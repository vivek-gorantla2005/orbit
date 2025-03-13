'use client'
import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { X } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import axios from 'axios'
import { BACKEND_ROUTE } from '@/backendRoutes'
import { useSession } from 'next-auth/react'
import AttachSection from './AttachSection'
import GifSection from './GifSection'
import EmojiSection from './EmojiSection'

interface ChatSectionProps {
    chatUser: {
        username: string
        id: string
        status: "online" | "offline" | "busy" | null
        avatar: string | null
    }
    onChatClose: () => void
    messages: { senderId: string; content: string }[]
}

const ChatSection: React.FC<ChatSectionProps> = ({ chatUser, onChatClose, messages }) => {
    const { data: session } = useSession();
    const [message, setMessage] = useState("");
    const [localMessages, setLocalMessages] = useState(messages);
    const [open, setOpen] = useState(false)
    const [gifOpen, setGifOpen] = useState(false)
    const [emojiOpen,setEmojiOpen] = useState(false)

    const handleAttachment = () => {
        setOpen(true)
    }

    const handleGifAttachment = () => {
        setGifOpen(true)
    }

    const handleEmoji = () => {
        setEmojiOpen(true)
    }

    const getMessages = async () => {
        if (!session?.user?.id) return;

        try {
            const res = await axios.get(`${BACKEND_ROUTE}/api/getMessages`, {
                params: { senderId: session.user.id, receiverId: chatUser.id },
            });
            setLocalMessages(res.data);
        } catch (err) {
            console.error("Error getting messages:", err);
        }
    };

    useEffect(() => {
        getMessages();
        const interval = setInterval(getMessages, 3000);
        return () => clearInterval(interval);
    }, [session?.user?.id, chatUser.id]);

    const sendMessage = async () => {
        if (!message.trim()) return;
        if (!session?.user?.id) return;
        const newMessage = {
            senderId: session.user.id,
            receiverId: chatUser.id,
            content: message,
            messageType: "TEXT",
            attachment: [],
            sentAt: new Date().toISOString()
        };

        setLocalMessages((prev) => [...prev, newMessage]);
        setMessage("");

        try {
            await axios.post(`${BACKEND_ROUTE}/api/sendMessage`, newMessage);
        } catch (err) {
            console.error("Error sending message:", err);
        }
    };

    return (
        <motion.div
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 300, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="m-0 p-0 h-[85vh] w-full bg-white shadow-lg flex flex-col"
        >
            <div className="flex justify-between items-center border-b px-4 py-3 bg-gray-50">
                <div className="flex items-center gap-3">
                    <Avatar className="w-12 h-12">
                        <AvatarImage src={chatUser.avatar ?? ""} />
                        <AvatarFallback>{chatUser.username.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <p className="text-lg font-bold text-gray-900">{chatUser.username}</p>
                </div>

                <button onClick={onChatClose} className="p-2 text-gray-600 hover:text-red-500 transition">
                    <X size={20} />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-gray-50">
                {localMessages.map((msg, index) => (
                    <div
                        key={index}
                        className={`p-2 rounded-lg w-fit max-w-xs ${msg.senderId === session?.user?.id ? "ml-auto bg-blue-500 text-white" : "bg-gray-200 text-black"
                            }`}
                    >
                        {msg.content}
                    </div>
                ))}
            </div>

            <div className="border-t px-4 py-3 bg-white flex items-center relative">
                <input
                    type="text"
                    placeholder="Type a message..."
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-800 pr-20"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                />

                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex gap-5 mr-2">
                    <button onClick={sendMessage} className="text-gray-600 hover:text-gray-900">
                        <img src="send.png" alt="send" width={20} height={20} />
                    </button>
                    <button className="text-gray-600 hover:text-gray-900">
                        <img src="laugh.png" alt="emoji" width={20} height={20} onClick={handleEmoji}/>
                        {emojiOpen && <EmojiSection onClose={() => setEmojiOpen(false)} />}
                    </button>
                    <button className="text-gray-600 hover:text-gray-900">
                        <img src="gif3.png" alt="gif" width={25} height={25} onClick={handleGifAttachment} />
                        {gifOpen && <GifSection onClose={() => setGifOpen(false)} onGifSelect={(gifUrl) => {
                            setMessage(gifUrl);
                            setGifOpen(false);
                        }} />}
                    </button>
                    <div className="text-gray-600 hover:text-gray-900 cursor-pointer">
                        <img src="attach.png" alt="attach" width={25} height={25} onClick={handleAttachment} />
                        {open && <AttachSection onClose={() => setOpen(false)} />}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default ChatSection;