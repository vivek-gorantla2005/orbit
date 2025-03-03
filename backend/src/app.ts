import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import redis from "../lib/redisSetup";
import {NotificationsConsumer} from '../controllers/NotificationsManagement'
import router from '../routes/backendRoutes'
dotenv.config();
const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: { origin: "*" }
});


app.use(cors({ origin: "*", methods: ["GET", "POST", "PUT", "DELETE"] }));
app.use(express.json());

app.use('/api',router);

io.on("connection", async (socket) => {
    console.log(`User Connected: ${socket.id}`);

    socket.on("join", async (userId) => {
        if (!userId) return;

        socket.join(userId);
        await redis.sadd("onlineUsers", userId);
        await redis.set(`socket:${userId}`, socket.id);

        console.log(`User ${userId} joined and is now online.`);
    });

    socket.on("disconnect", async () => {
        const userId = await redis.get(`socket:${socket.id}`);

        if (userId) {
            await redis.srem("onlineUsers", userId);
            await redis.del(`socket:${socket.id}`);
            console.log(`User ${userId} is now offline.`);
        }

        console.log(`Socket ${socket.id} disconnected`);
    });
});

NotificationsConsumer.consumeFriendNotifications(io);

const port = process.env.PORT || 8000;
server.listen(port, () => console.log(`🚀 Server running at http://localhost:${port}`));
