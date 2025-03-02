'use client'
import React from 'react'
import { motion } from 'framer-motion'
import { X } from 'lucide-react'

interface ChatSectionProps {
    chatUser: {
        username: string
        id: number
        status: "online" | "offline" | "busy"
        avatar: string | "none"
    }
    onChatClose: () => void
}

const ChatSection: React.FC<ChatSectionProps> = ({ chatUser, onChatClose }) => {
    return (
        <motion.div
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 300, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="m-0 p-0 h-full w-full bg-white shadow-lg flex flex-col"
        >

            <div className="flex justify-between items-center border-b pb-3">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-300 overflow-hidden">
                        <img
                            src={chatUser.avatar !== "none" ? chatUser.avatar : "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"}
                            alt="User Avatar"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div>
                        <p className="text-lg font-bold">{chatUser.username}</p>
                        <p className="text-sm text-gray-500">{chatUser.status}</p>
                    </div>
                </div>
                <button onClick={onChatClose} className="p-2 text-gray-600 hover:text-red-500">
                    <X size={20} />
                </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
                <p className="text-sm text-gray-500 italic text-center">No messages yet.</p>
            </div>

            {/* Chat Input */}
            <div className="border-t pt-3">
                <input
                    type="text"
                    placeholder="Type a message..."
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
        </motion.div>
    )
}

export default ChatSection
