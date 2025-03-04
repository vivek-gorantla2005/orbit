'use client'
import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import axios from 'axios'
import { BACKEND_ROUTE } from '@/backendRoutes'
import { useSession } from 'next-auth/react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"

interface FriendsInterface {
    username: string
    id: string
    status: "online" | "offline" | "busy" | "unknown"
    avatar: string | null
}

// Status color mapping
const statusColors: Record<string, string> = {
    online: "bg-green-500",
    offline: "bg-gray-400",
    busy: "bg-red-500",
    unknown: "bg-yellow-500"
};

const FriendsList = ({ onUserSelect }: { onUserSelect: (user: FriendsInterface) => void }) => {
    const [friends, setFriends] = useState<FriendsInterface[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const { data: session } = useSession();

    useEffect(() => {
        const getFriends = async () => {
            if (!session?.user?.id) return;

            try {
                const res = await axios.get(`${BACKEND_ROUTE}/api/getFriends?userId=${session.user.id}`)
                console.log(res.data);

                const mappedFriends = res.data.friends.map((friend: any) => ({
                    id: friend.id,
                    username: friend.username,
                    status: friend.userStatus || "unknown",
                    avatar: friend.profilePic || null,
                }));

                setFriends(mappedFriends);
            } catch (error) {
                console.error("Error fetching friends:", error);
            } finally {
                setLoading(false);
            }
        }

        getFriends();
    }, [session?.user?.id]);

    return (
        <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Friends List</h2>
            
            {/* Skeleton Loader */}
            {loading ? (
                <ul>
                    {Array.from({ length: 5 }).map((_, index) => (
                        <li key={index} className="flex items-center gap-4 py-3 px-3 rounded-lg">
                            <Skeleton className="w-12 h-12 rounded-full" />
                            <Skeleton className="w-32 h-6 rounded-md" />
                        </li>
                    ))}
                </ul>
            ) : (
                <ul>
                    {friends.map((friend, index) => (
                        <motion.li
                            key={friend.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1, duration: 0.3 }}
                            className="flex items-center justify-between py-3 cursor-pointer hover:bg-gray-100 px-3 rounded-lg"
                            onClick={() => onUserSelect(friend)}
                        >
                            <div className="flex items-center gap-4 relative">
                                {/* Avatar with Status Indicator */}
                                <div className="relative">
                                    <Avatar className="w-12 h-12">
                                        <AvatarImage src={friend.avatar} />
                                        <AvatarFallback className="w-full rounded-full h-full bg-gray-800 text-white flex items-center justify-center font-bold">
                                            {friend.username.charAt(0).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                    {/* Status Indicator */}
                                    <span 
                                        className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${statusColors[friend.status]}`}
                                    ></span>
                                </div>

                                <p className="font-bold text-gray-900">{friend.username}</p>
                            </div>
                        </motion.li>
                    ))}
                </ul>
            )}
        </div>
    )
}

export default FriendsList
