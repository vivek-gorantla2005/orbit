'use client'
import React, { useState } from 'react'
import FriendsList from '../components/FriendsList'
import ChatSection from '../components/ChatSection'
import SocketManager from '../components/SocketProvider'

interface User {
    username: string
    id: string
    status: "online" | "offline" | "busy" | "unknown"
    avatar: string | null
}

interface Message {
    senderId: string
    receiverId: string
    conversationId: string
    content: string
    messageType: string
    attachment: string[] | null
    sentAt: string
}

const Page = () => {
    const [messages, setMessages] = useState<Message[]>([])
    const [chatUser, setChatUser] = useState<User | null>(null)

    const handleMessage = (message: Message) => {
        setMessages((prevMessages) => [...prevMessages, message]);
    };

    return (
        <div className="grid grid-cols-8 w-full h-screen overflow-y-hidden transition-all duration-300">
            {/* Hide Friends List when a chat is open */}
            {!chatUser && (
                <aside className="col-span-2 rounded-xl shadow-md bg-white text-black ml-7 items-center justify-center">
                    <FriendsList onUserSelect={setChatUser} />
                </aside>
            )}
            
            <main className={`${chatUser ? "col-span-8" : "col-span-6"} h-[85vh] m-0 p-0 text-black flex flex-col`}>
                {chatUser ? (
                    <ChatSection chatUser={chatUser} onChatClose={() => setChatUser(null)} messages={messages} />
                ) : (
                    <img src="vec6.jpg" alt="" className="w-full h-full object-cover" />
                )}
            </main>

            <SocketManager onMessage={handleMessage} />
        </div>
    )
}

export default Page
