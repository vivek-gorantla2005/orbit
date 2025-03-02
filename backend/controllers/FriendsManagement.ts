import prisma from "../lib/prismaSetup";
import { Request, Response } from "express";
import redis from '../lib/redisSetup'

export interface FriendReq {
    senderId: string;
    receiverId: string;
}

class FriendManagement {
    public static async addFriend(req: Request, res: Response): Promise<void> {
        const { senderId, receiverId }: FriendReq = req.body;

        try {
            // Ensure sender and receiver exist
            const sender = await prisma.user.findUnique({ where: { id: senderId } });
            const receiver = await prisma.user.findUnique({ where: { id: receiverId } });

            if (!sender || !receiver) {
                res.status(404).json({ message: "User not found" });
                return;
            }

            // Check if they are already friends
            const isFriend = await prisma.friendship.findFirst({
                where: {
                    OR: [
                        { userId: sender.id, friendId: receiver.id },
                        { userId: receiver.id, friendId: sender.id },
                    ],
                },
            });

            if (isFriend) {
                res.status(400).json({ message: "You are already friends" });
                return;
            }

            // Check if a friend request already exists
            const existingRequest = await prisma.friendReq.findFirst({
                where: {
                    OR: [
                        { senderId: sender.id, receiverId: receiver.id },
                        { senderId: receiver.id, receiverId: sender.id },
                    ],
                },
            });

            if (existingRequest) {
                res.status(400).json({ message: "Friend request already sent" });
                return;
            }

            
            // Send a new friend request with correct user IDs
            const newFriendRequest = await prisma.friendReq.create({
                data: {
                    senderId: sender.id,
                    receiverId: receiver.id,
                    friendshipId: sender.id + receiver.id,
                },
            });
            
            await redis.set(`friendReq:${sender.id}:${receiver.id}`, JSON.stringify(newFriendRequest))

            res.status(200).json({ message: "Friend request sent", newFriendRequest });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: "An error occurred", error: err });
        }
    }

    public static async acceptFriendRequest(req: Request, res: Response): Promise<void> {
        const {friendshipId} = req.body;
        try{
            const findReq = await prisma.friendReq.findFirst({
                where:{friendshipId},
            })

            if(findReq){
                const {senderId,receiverId} = findReq;
                
                const newFriend = await prisma.$transaction([
                    prisma.friendship.create({
                        data:{
                            userId:senderId,
                            friendId:receiverId
                        }
                    }),
                    prisma.friendship.create({
                        data:{
                            userId:receiverId,
                            friendId:senderId
                        }
                    })
                ])

                if(newFriend){
                    prisma.friendReq.delete({
                        where: { id: findReq.id },
                    }),

                    await redis.del(`friends:${senderId}`);
                    await redis.del(`friends:${receiverId}`);
    
                    res.json({message:"Friendship created", newFriend}).status(200);
                    return;
                }
            }
            else{
                res.json({message:"Friend request not found"}).status(404);
                return;
            }
        }catch(err){
            res.json({message:"error processing request", err}).status(404);
            return;
        }
    }

    public static async rejectFriendRequest(req: Request, res: Response): Promise<void> {
        const {friendshipId} = req.body;
        try{
            const findReq = await prisma.friendReq.findFirst({
                where:{friendshipId},
            })
            if(findReq){
                prisma.friendReq.delete({
                    where: { id: findReq.id },
                }),

                await redis.del(`friendReq:${findReq.senderId}:${findReq.receiverId}`);
                res.json({message:"Friend request rejected"}).status(200);
                return;
            }
        }catch(err){
            res.json({message:"error processing request", err}).status(404);
            return;
        }
    }

    public static async deleteFriend(req: Request, res: Response):Promise<void> {
        const {userId,friendId} = req.body;
        const user = await prisma.user.findFirst({where:{id:userId}})
        const friend = await prisma.user.findFirst({where:{id:friendId}})
        if(!user ||!friend){
            res.status(404).json({message:"User not found"}).status(404);
            return;
        }

        try{
            const friendship = await prisma.friendship.findFirst({
                where:{
                    OR:[
                        {userId:userId, friendId:friendId},
                        {userId:friendId, friendId:userId}
                    ]
                }
            })

            if(friendship){
                const delFriendship = await prisma.$transaction([
                    prisma.friendship.deleteMany({
                        where:{
                            OR:[
                                {userId,friendId},
                                {userId:friendId, friendId:userId}
                            ]
                        }
                    })
                ])
                if(delFriendship){
                    await redis.del(`friends:${userId}`);
                    await redis.del(`friends:${friendId}`);
                    res.json({message:"Friendship deleted"}).status(200);
                    return;
                }
            }
        }catch(err) {
            res.status(500).json({message: "An error occurred", error: err});
            return;
        }
    }

    public static async getFriends(req: Request, res: Response): Promise<void> {
        const userId = req.query.userId as string;
    
        if (!userId) {
            res.status(400).json({ message: "Missing userId parameter" });
            return;
        }
    
        try {
            const cachedFriends = await redis.get(`friends:${userId}`);
            if (cachedFriends) {
                res.status(200).json({ message: "Friends retrieved from cache", friends: JSON.parse(cachedFriends) });
                return;
            }
            const friendships = await prisma.friendship.findMany({
                where: {
                    OR: [{ userId }, { friendId: userId }],
                },
            });
    
            if (!friendships.length) {
                console.log("No friends found.");
                res.status(200).json({ message: "No friends found" });
                return;
            }
    
            // Extract friend IDs
            const friendIds = friendships.map(f => (f.userId === userId ? f.friendId : f.userId));
    
            // Fetch friend details
            const friends = await prisma.user.findMany({
                where: {
                    id: { in: friendIds },
                },
                select: {
                    id: true,
                    email: true,
                    username: true,
                },
            });

            await redis.set(`friends:${userId}`, JSON.stringify(friends), 'EX', 3600);
            res.status(200).json({ message: "Friends retrieved successfully" ,friends});
            return;
        } catch (err) {
            console.error("Error fetching friends:", err);
            res.status(500).json({ message: "Error fetching friends" });
        }
    }
}

export default FriendManagement;
