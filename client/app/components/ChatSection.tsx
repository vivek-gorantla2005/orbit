'use client'
import React from 'react'
import { motion } from 'framer-motion'
import { X } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface ChatSectionProps {
    chatUser: {
        username: string
        id: string
        status: "online" | "offline" | "busy" | null
        avatar: string | null
    }
    onChatClose: () => void
}

// Status color mapping
const statusColors: Record<string, string> = {
    online: "bg-green-500",
    offline: "bg-yellow-400",
    busy: "bg-red-500"
};

// Function to determine the correct status (defaults to "offline" if null)
const getStatus = (status: string | null | undefined): string => {
    return status && statusColors[status] ? status : "offline";
};

// Capitalize status text for display
const formatStatus = (status: string) => status.charAt(0).toUpperCase() + status.slice(1);

const ChatSection: React.FC<ChatSectionProps> = ({ chatUser, onChatClose }) => {
    const userStatus = getStatus(chatUser.status); // Ensure valid status

    return (
        <motion.div
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 300, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="m-0 p-0 h-full w-full bg-white shadow-lg flex flex-col"
        >
            {/* Chat Header */}
            <div className="flex justify-between items-center border-b px-4 py-3 bg-gray-50">
                <div className="flex items-center gap-3">
                    {/* Avatar with Status Indicator */}
                    <div className="relative w-12 h-12">
                        <Avatar className="w-12 h-12">
                            <AvatarImage src={chatUser.avatar ?? ""} />
                            <AvatarFallback className="w-full h-full rounded-full bg-gray-800 text-white flex items-center justify-center font-bold">
                                {chatUser.username.charAt(0).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        {/* Status Indicator */}
                        <span 
                            className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white ${statusColors[userStatus]}`} 
                        />
                    </div>

                    <div>
                        <p className="text-lg font-bold text-gray-900">{chatUser.username}</p>
                        <p className={`text-sm font-medium ${statusColors[userStatus]} text-white px-2 py-0.5 rounded-lg`}>
                            {formatStatus(userStatus)}
                        </p>
                    </div>
                </div>

                <button onClick={onChatClose} className="p-2 text-gray-600 hover:text-red-500 transition">
                    <X size={20} />
                </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-gray-50">
                <p className="text-sm text-gray-500 italic text-center">No messages yet.</p>
            </div>

            {/* Chat Input */}
            <div className="border-t px-4 py-3 bg-white">
                <input
                    type="text"
                    placeholder="Type a message..."
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
        </motion.div>
    );
};

export default ChatSection;
