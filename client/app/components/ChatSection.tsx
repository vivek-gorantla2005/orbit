'use client'
import React, { useState, useEffect, useContext } from 'react'
import { motion } from 'framer-motion'
import { X } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import axios from 'axios'
import { BACKEND_ROUTE } from '@/backendRoutes'
import { useSession } from 'next-auth/react'
import AttachSection from './AttachSection'
import GifSection from './GifSection'
import EmojiSection from './EmojiSection'
import { NavContext } from '../context/NavContext'

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
    const [emojiOpen, setEmojiOpen] = useState(false)
    const handleAttachment = () => setOpen(true)
    const handleGifAttachment = () => setGifOpen(true)
    const handleEmoji = () => setEmojiOpen(true)
    const { navControls, setNavControls } = useContext(NavContext);
    const [onChatCloseState, setOnChatCloseState] = useState(false)
    const [attachment, setAttachment] = useState<File | null>(null)
    const [attachmentUrl, setAttachmentUrl] = useState<string | null>(null)

    useEffect(() => {
        setNavControls(() => false);
    }, [onChatClose])

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.ctrlKey && event.key === 'e') {
                event.preventDefault();
                setEmojiOpen((prev) => !prev);
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

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
        if (!message.trim() || !session?.user?.id) return;

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
            className="m-0 p-0 h-[100vh] w-full bg-gradient-to-br from-blue-50 to-white shadow-lg flex flex-col"
        >
            <div className="flex justify-between items-center border-b px-4 py-3  bg-black">
                <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10 rounded-full">
                        <AvatarImage src={chatUser.avatar ?? ""} />
                        <AvatarFallback >{chatUser.username.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <p className="text-lg font-bold text-gray-900"><span className='text-white'>{chatUser.username}</span></p>
                </div>

                <button
                    onClick={() => {
                        setNavControls(true);
                        onChatClose();
                    }}
                    className="p-2 text-gray-600 hover:text-red-500 transition"
                >
                    <X size={20} />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-black" style={{ backgroundImage: "url('/chat_wallpaper.jpg')" }}>
                {localMessages.map((msg, index) => (
                    <div
                        key={index}
                        className={`p-3 rounded-xl w-fit max-w-xs shadow-md ${msg.senderId === session?.user?.id
                            ? "ml-auto bg-black text-white shadow-gray-900 shadow-lg filter drop-shadow-lg"
                            : "bg-gray-700 text-white shadow-purple-950 shadow-lg filter drop-shadow-lg"
                            }`}
                    >

                        {(() => {
                            if (
                                msg.content.startsWith("http") &&
                                (msg.content.includes(".gif") || msg.content.includes("tenor.com") || msg.content.includes("giphy.com"))
                            ) {
                                return <img src={msg.content} alt="GIF" className="rounded-lg max-w-full h-auto" />;
                            } else if (
                                msg.content.startsWith("http") &&
                                (msg.content.includes(".png") || msg.content.includes(".jpg") || msg.content.includes(".jpeg"))
                            ) {
                                return <img src={msg.content} alt="Image" className="rounded-lg max-w-full h-auto" />;
                            } else if(
                                msg.content.startsWith("http") &&
                                (msg.content.includes(".mp4") || msg.content.includes(".mov") || msg.content.includes(".avi"))
                            ) {
                                return <video src={msg.content} controls className="rounded-lg max-w-full h-auto" />;
                            }
                        else if (
                            msg.content.startsWith("http") &&
                            (msg.content.includes(".mp3") || msg.content.includes(".wav") || msg.content.includes(".aac"))
                          ) {
                            return (
                              <audio controls className="rounded-lg max-w-full h-auto">
                                <source src={msg.content} type={`audio/${msg.content.split('.').pop()}`} />
                                Your browser does not support the audio element.
                              </audio>
                            );
                          }  
                             else {
                                return (
                           <div className="chat chat-start">
                                        <div>{msg.content}</div>
                                    </div>
                                );
                            }
                        })()}



                        {/* {msg.content.startsWith("http") && (msg.content.includes(".gif") || msg.content.includes("tenor.com") || msg.content.includes("giphy.com")) ? (
                            <img src={msg.content} alt="GIF" className="rounded-lg max-w-full h-auto" />
                        ) : (
                            <div className="chat chat-start">
                                <div>{msg.content}</div>
                            </div>
                        )}
                        {msg.content.startsWith("http") && (msg.content.includes(".png") || msg.content.includes(".jpg") || msg.content.includes(".jpeg")) ? (
                            <img src={msg.content} alt="Image" className="rounded-lg max-w-full h-auto" />
                        ) : (
                            <div className="chat chat-start">
                            </div>
                        )} */}
                    </div>
                ))}
            </div>

            <div className="border-t px-4 py-3 flex items-center relative">
                <input
                    type="text"
                    placeholder="Type a message..."
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black pr-20"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            sendMessage();
                        }
                    }}
                />

                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex gap-5 mr-2">
                    <button onClick={sendMessage} className="text-blue-600 hover:text-blue-900">
                        <img src="send.png" alt="send" width={20} height={20} />
                    </button>
                    <button className="text-blue-600 hover:text-blue-900">
                        <img src="laugh.png" alt="emoji" width={20} height={20} onClick={handleEmoji} />
                        {emojiOpen && <EmojiSection onClose={() => setEmojiOpen(false)} onSelectEmoji={(emoji) => setMessage((prev) => prev + emoji)} />}
                    </button>
                    <button className="text-blue-600 hover:text-blue-900">
                        <img src="gif3.png" alt="gif" width={25} height={25} onClick={handleGifAttachment} />
                        {gifOpen && <GifSection onClose={() => setGifOpen(false)} onGifSelect={(gifUrl) => {
                            setMessage(gifUrl);
                            setGifOpen(false);
                        }} />}
                    </button>
                    <div className="text-blue-600 hover:text-blue-900 cursor-pointer">
                        <img src="attach.png" alt="attach" width={25} height={25} onClick={handleAttachment} />
                        {open && <AttachSection onClose={() => setOpen(false)} onSendAttachment={(attachment_Url) => {
                            setAttachmentUrl(attachment_Url);
                            setOpen(false);
                            setMessage("Images Sent");
                        }} />}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default ChatSection;
