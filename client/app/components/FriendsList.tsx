'use client'
import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface FriendsInterface {
    username: string
    id: number
    status: "online" | "offline" | "busy"
    avatar: string | "none"
}

const UserFriends: FriendsInterface[] = [
    { username: "vivek", id: 1, status: "online", avatar: 'none' },
    { username: "rahul", id: 2, status: "offline", avatar: 'none' },
    { username: "anil", id: 3, status: "busy", avatar: 'none' },
    { username: "ramesh", id: 4, status: "online", avatar: 'none' },
    { username: "ajay", id: 5, status: "offline", avatar: 'none' },
    { username: "ramesh", id: 6, status: "online", avatar: 'none' },
]

const FriendsList = ({ onUserSelect }: { onUserSelect: (user: FriendsInterface) => void }) => {
    const [friends, setFriends] = useState<FriendsInterface[]>([])

    useEffect(() => {
        setFriends(UserFriends)
    }, [])

    return (
        <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Friends List</h2>
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
                        <div className="flex items-center gap-4">
                            <div className={`avatar ${friend.status}`}>
                                <div className="w-12 h-12 rounded-full overflow-hidden">
                                    <img
                                        src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                                        alt="avatar"
                                    />
                                </div>
                            </div>
                            <p className="font-bold text-gray-900">{friend.username}</p>
                        </div>
                    </motion.li>
                ))}
            </ul>
        </div>
    )
}

export default FriendsList
