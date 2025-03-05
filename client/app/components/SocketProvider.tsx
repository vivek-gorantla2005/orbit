'use client'
import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { BACKEND_ROUTE } from "@/backendRoutes";
import { useSession } from "next-auth/react";

const SocketManager = ({ onNotification,onMessage}) => {
  const socketRef = useRef<Socket | null>(null);
  const { data: session } = useSession();

  useEffect(() => {
    const userId = session?.user?.id;
    if (!userId) return;

    socketRef.current = io(BACKEND_ROUTE, {
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 3000,
    });

    const socket = socketRef.current;

    socket.on("connect", () => {
      console.log("Connected to socket:", socket.id);
      socket.emit("join", userId);
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from socket");
    });

    socket.on("reconnect_attempt", () => {
      console.log("Attempting to reconnect...");
    });

    socket.on("reconnect", () => {
      console.log("Reconnected to socket");
      socket.emit("join", userId);
    });

    socket.on("friend-request", (notification) => {
      onNotification(notification);
    });

    socket.on("message",(message)=>{
      onMessage(message);
    })

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        console.log("Socket disconnected");
      }
    };
  }, [session?.user?.id, onNotification,onMessage]);

  return null;
};

export default SocketManager;
