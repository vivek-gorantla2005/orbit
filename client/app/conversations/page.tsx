'use client'
import React, { useState, useEffect, useContext } from 'react';
import FriendsList from '../components/FriendsList';
import ChatSection from '../components/ChatSection';
import { SocketContext } from '../context/SocketCustomContext';

interface User {
    username: string;
    id: string;
    status: "online" | "offline" | "busy" | "unknown";
    avatar: string | null;
}

interface Message {
    senderId: string;
    receiverId: string;
    conversationId: string;
    content: string;
    messageType: string;
    attachment: string[] | null;
    sentAt: string;
}

const Page = () => {
    const [chatUser, setChatUser] = useState<User | null>(null);
    const [chatMessages, setChatMessages] = useState<Message[]>([]);

    const { messages } = useContext(SocketContext);

    useEffect(() => {
        if (chatUser) {
            const filteredMessages = messages.filter((msg) => msg.senderId === chatUser.id);
            setChatMessages(filteredMessages);
        }
    }, [messages, chatUser]);

    return (
        <div className="grid grid-cols-8 w-full h-screen overflow-y-hidden transition-all duration-300">
            {!chatUser && (
                <aside className="col-span-2 rounded-xl shadow-md bg-white text-black ml-7 items-center justify-center">
                    <FriendsList onUserSelect={setChatUser} />
                </aside>
            )}

            <main className={`${chatUser ? "col-span-8" : "col-span-6"} h-[85vh] m-0 p-0 text-black flex flex-col`}>
                {chatUser ? (
                    <ChatSection chatUser={chatUser} onChatClose={() => setChatUser(null)} messages={chatMessages} />
                ) : (
                    <img src="vec6.jpg" alt="" className="w-full h-full object-cover" />
                )}
            </main>
        </div>
    );
};

export default Page;
