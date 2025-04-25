import { Request, Response } from "express";
import { Server } from "socket.io";
import kafkaSetup from "../kafkaService/kafkaSetup";
import prisma from "../lib/prismaSetup";
import redis from "../lib/redisSetup";
import { AttachmentType, MessageType } from "@prisma/client";

const kafka = kafkaSetup.producer();

export default class ConversationManagement {
    public static async sendMessage(req: Request, res: Response): Promise<void> {
        try {
            const { senderId, receiverId, content, messageType, attachment } = req.body;
    
            if (!senderId || !receiverId) {
                res.status(400).json({ message: "Missing senderId or receiverId" });
                return;
            }
    
            const sender = await prisma.user.findUnique({ where: { id: senderId } });
            const receiver = await prisma.user.findUnique({ where: { id: receiverId } });

            if (!sender || !receiver) {
                res.status(404).json({ message: "Sender or receiver not found" });
                return;
            }

            let conversationId = await redis.get(`conversation:${senderId}:${receiverId}`);

            if (!conversationId) {
                let conversation = await prisma.conversation.findFirst({
                    where: {
                        OR: [
                            { senderId, receiverId },
                            { senderId: receiverId, receiverId: senderId }
                        ]
                    }
                });

                if (!conversation) {
                    conversation = await prisma.conversation.create({
                        data: {
                            senderId,
                            receiverId
                        }
                    });
                }

                conversationId = conversation.id;
                await redis.set(`conversation:${senderId}:${receiverId}`, conversationId);
            }

            await kafka.connect();
            console.log("Connected to Kafka");

            const messageData = {
                senderId,
                receiverId,
                conversationId,
                content,
                messageType,
                attachment,
                sentAt: new Date().toISOString()
            };

            await redis.hset(
                `message:${senderId}:${receiverId}`,
                messageData.sentAt,
                JSON.stringify(messageData)
            );
            
            console.log("Sending message....", messageData);

            await kafka.send({
                topic: "messages",
                messages: [{ value: JSON.stringify(messageData)}]
            });

            res.status(200).json({ message: "Message sent successfully", data: messageData });
        } catch (err) {
            console.error("Error processing request", err);
            res.status(500).json({ message: "Error processing request", err });
        } finally {
            await kafka.disconnect();
            console.log("Kafka disconnected");
        }
    }

    public static async consumeMessage(io: Server): Promise<void> {
        const consumer = kafkaSetup.consumer({ groupId: "received-message" });

        try {
            await consumer.connect();
            await consumer.subscribe({ topic: "messages" });
            console.log("Subscribed to Kafka topic: messages");

            await consumer.run({
                eachMessage: async ({ message }) => {
                    if (!message.value) return;

                    const messageData = JSON.parse(message.value.toString());
                    console.log("Message received:", messageData);

                    const { senderId, receiverId } = messageData;

                    let conversationId = await redis.get(`conversation:${senderId}:${receiverId}`);

                    if (!conversationId) {
                        let conversation = await prisma.conversation.findFirst({
                            where: {
                                OR: [
                                    { senderId, receiverId },
                                    { senderId: receiverId, receiverId: senderId }
                                ]
                            }
                        });

                        if (!conversation) {
                            conversation = await prisma.conversation.create({
                                data: { senderId, receiverId }
                            });
                        }

                        conversationId = conversation.id;
                        await redis.set(`conversation:${senderId}:${receiverId}`, conversationId);
                    }

                    if (!conversationId) {
                        console.error("No valid conversation found. Skipping message storage.");
                        return;
                    }

                    const userSocketId = await redis.get(`socket:${receiverId}`);
                    if (userSocketId) {
                        io.to(userSocketId).emit("message", messageData);

                        await redis.hset(
                            `message:${senderId}:${receiverId}`,
                            messageData.sentAt,
                            JSON.stringify(messageData)
                        );
                        
                    }
                        await prisma.message.create({
                        data: {
                            senderId: messageData.senderId,
                            receiverId: messageData.receiverId,
                            conversationId: conversationId,
                            content: messageData.content,
                            messageType: messageData.messageType.toUpperCase() as MessageType,
                            attachment: messageData.attachment?.length
                                ? {
                                      create: messageData.attachment.map((att: any) => ({
                                          url: att.url,
                                          fileType: att.fileType.toUpperCase() as AttachmentType
                                      }))
                                  }
                                : undefined
                        }
                    });
                    
                    console.log("Message stored successfully!");
            }
            });
        } catch (err) {
            console.error("Error in Kafka consumer:", err);
        }
    }

    public static async getMessages(req:Request,res:Response):Promise<void>{
        const senderId = req.query.senderId as string;
        const receiverId = req.query.receiverId as string;
        if(!senderId || !receiverId){
            res.status(400).json({message:"Missing senderId or receiverId"});
            return;
        }

        try{
            let conversation = await prisma.conversation.findFirst({
                where: {
                    OR: [
                        { senderId:senderId,receiverId: receiverId },
                        { senderId: receiverId, receiverId: senderId }
                    ],
                },
                include:{
                    messages:{
                        orderBy:{
                            createdAt: "asc"
                        }
                    }
                }
            });
            
            if(!conversation){
                res.status(404).json({message:"Conversation not found"});
                return;
            }
            res.status(200).json(conversation.messages);
            return;
        }catch(err){
            res.status(500).json({message:"an error occured while getting messages"});
        }
    }

    public static async TodayUserConversations(req: Request, res: Response): Promise<void> {
        const userId = req.query.userId as string;
    
        if (!userId) {
            res.status(400).json({ message: "Missing userId" });
            return;
        }
    
        try {
            const now = new Date();
            const startOfDayUTC = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
            const endOfDayUTC = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1));
    
            const messages = await prisma.message.findMany({
                where: {
                    senderId: userId,
                    createdAt: {
                        gte: startOfDayUTC,
                        lt: endOfDayUTC
                    }
                },
                select: {
                    receiverId: true
                }
            });
    
            const uniqueReceiverIds = [...new Set(messages.map(msg => msg.receiverId))];
    
            const users = await prisma.user.findMany({
                where: {
                    
                    id: {
                        in: uniqueReceiverIds
                    }
                },
                select: {
                    username: true 
                }
            });
    
            res.status(200).json(users);
        } catch (err) {
            console.error("Error fetching today's conversations:", err);
            res.status(500).json({ message: "Error fetching today's conversations" });
        }
    }
    
    
}
