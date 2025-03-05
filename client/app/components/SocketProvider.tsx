"use client";
import { useEffect, useRef, useContext } from "react";
import { io, Socket } from "socket.io-client";
import { BACKEND_ROUTE } from "@/backendRoutes";
import { useSession } from "next-auth/react";
import { SocketContext } from "../context/SocketCustomContext";

const SocketManager = () => {
  const currentContext = useContext(SocketContext);

  const handleNewNotification = (notification) => {
    currentContext.setNotifications((prev) => [...prev, notification]);
  };

  const handleNewMessage = (message) => {
    currentContext.setMessages((prev) => [...prev, message]);
  };

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

    socket.on("friend-request", handleNewNotification);
    socket.on("message", handleNewMessage);

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        console.log("Socket disconnected");
      }
    };
  }, [session?.user?.id]);

  return null;
};

export default SocketManager;
