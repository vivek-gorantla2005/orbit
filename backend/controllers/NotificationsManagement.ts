import { Request, Response } from "express";
import kafkaSetup from "../kafkaService/kafkaSetup";
import prisma from "../lib/prismaSetup";
import { Server} from "socket.io";
import redis from "../lib/redisSetup";

const kafka = kafkaSetup.producer()
export default class NotificationsProducer {
    public static async sendFriendNotifications(req: Request, res: Response): Promise<void> {
        try {
            const {senderId,receiverId} = req.body;
    
            if (!senderId || !receiverId) {
                res.status(400).json({ message: "Missing userId or senderId" });
                return;
            }

            const sender = await prisma.user.findFirst({ where: { id: senderId } });
            const receiver = await prisma.user.findFirst({ where: { id: receiverId } });
            if (!sender) {
                res.status(404).json({ message: "receiver not found" });
                return;
            }
    
            console.log("Sending friend request notification...");
    
            await kafka.connect();
            console.log("Connected to Kafka");
    
            const notification = {
                senderId,
                receiverId,
                type: "FRIEND_REQUEST",
                title: "Friend Request",
                content: `You have a new friend request from ${sender.username}`,
                createdAt: new Date().toISOString(),
            };
    
            console.log("Notification Payload:", notification);
    
            await kafka.send({
                topic: process.env.KAFKA_NOTIFICATIONS_TOPIC || "friend-notifications",
                messages: [{ value: JSON.stringify(notification) }]
            });
    
            res.status(201).json({ message: "Friend request notification sent" });
        } catch (err) {
            console.error("Error sending friend request notification:", err);
            res.status(500).json({ message: "Error sending friend request notification" });
        } finally {
            try {
                await kafka.disconnect();
                console.log("Disconnected from Kafka");
            } catch (disconnectErr) {
                console.error("Error disconnecting Kafka:", disconnectErr);
            }
        }
    }
    
    public static async sendMessageNotifications(req: Request, res: Response): Promise<void> {
        const { senderId, receiverId } = req.body;
    
        try {
            if (!receiverId || !senderId) {
                res.status(400).json({ message: "Missing senderId or receiverId" });
                return;
            }
            const sender = await prisma.user.findFirst({where:{id:senderId}})
            const receiver = await prisma.user.findFirst({ where: { id: receiverId } });
            if (!sender) {
                res.status(404).json({ message: "Sender not found" });
                return;
            }
    
            console.log("Sending message notification...");
    
            await kafka.connect();
            console.log("Connected to Kafka");
    
            const messageNotification = {
                senderId,
                receiverId,
                type: "MESSAGE_RECEIVED",
                title: "New Message",
                content: `You have a new message from ${sender.username}`,
                createdAt: new Date().toISOString(),
            };
    
            console.log("Notification Payload:", messageNotification);
    
            await kafka.send({
                topic: process.env.KAFKA_NOTIFICATIONS_TOPIC || "message-notifications",
                messages: [{ value: JSON.stringify(messageNotification) }]
            });
    
            res.status(201).json({ message: "Message notification sent" });
    
        } catch (err) {
            console.error("Error sending message notification:", err);
            res.status(500).json({ message: "Error sending message notification" });
        } finally {
            try {
                await kafka.disconnect();
                console.log("Disconnected from Kafka");
            } catch (disconnectErr) {
                console.error("Error disconnecting Kafka:", disconnectErr);
            }
        }
    }
}

export class NotificationsConsumer {
    public static async consumeFriendNotifications(io:Server): Promise<void>{
        const consumer = kafkaSetup.consumer({groupId:"friend-req-notifications"});
        try{
            console.log('connecting to kafka')
            await consumer.connect();
            console.log('connected to kafka')
            await consumer.subscribe({topic:"friend-notifications"})
            console.log('subscribed to friend-notifications')

            await consumer.run({
                eachMessage:async({message})=>{
                    if(!message.value){
                        return;
                    }

                    const notificationData = JSON.parse(message.value.toString());
                    console.log('received notification',notificationData)

                    //check if sender is online
                    const {receiverId} = notificationData

                    const userSocketId = await redis.get(`socket:${receiverId}`);

                    console.log('user is online',userSocketId)

                    if(userSocketId){
                        console.log('sending to online user')
                        io.to(userSocketId).emit('friend-request', notificationData)
                        await prisma.notifications.create(
                            {
                                data:{
                                   ...notificationData,
                                    read: true,
                                }
                            }
                        )
                    }else{
                        await prisma.notifications.create(
                            {
                                data:{
                                   ...notificationData,
                                }
                            }
                        )
                    }
                }
            })
        }catch(err){
            console.error("Error consuming notification", err);
            return;
        }
    }
}