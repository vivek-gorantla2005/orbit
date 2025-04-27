'use client'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { BACKEND_ROUTE } from '@/backendRoutes'
import { useSession } from 'next-auth/react'

interface Message {
    senderId: string;
    receiverId: string;
    content: string;
    createdAt: string;
}

interface Friend {
    username: string;
    receiverId: string;
}

const Page = () => {
    const { data: session } = useSession();
    const [friends, setFriends] = useState<Friend[]>([]);
    const [selectedUser, setSelectedUser] = useState<string>("");
    const [chat, setChat] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isFriendLoading, setIsFriendLoading] = useState<boolean>(true); // NEW

    const handleUserClick = async (receiverId: string) => {
        setSelectedUser(receiverId);
        setIsLoading(true);
        setChat("");

        try {
            const res = await axios.get(
                `${BACKEND_ROUTE}/api/getMessages?senderId=${session?.user?.id}&receiverId=${receiverId}`
            );

            const rawMessages = res.data;

            const formattedMessages = rawMessages.map((msg: any) => ({
                senderId: msg.senderId,
                receiverId: msg.receiverId,
                content: msg.content,
                messageType: msg.messageType,
            }));

            console.log("Formatted:", formattedMessages);

            const aiCall = await axios.post(
                'http://127.0.0.1:8000/api/generateSummary',
                {
                    messages: formattedMessages
                }
            );

            console.log("AI Summary:", aiCall.data);

            setChat(aiCall.data.summary || "No summary returned.");
        } catch (err: any) {
            console.error('Error fetching or summarizing messages:', err?.response?.data || err.message || err);
            setChat(`chat = """\n[Error: Could not fetch messages]\n"""`);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        async function getFriends() {
            try {
                setIsFriendLoading(true);
                const res = await axios.get(`${BACKEND_ROUTE}/api/getConversations?userId=${session?.user?.id}`);
                setFriends(res.data.conversations);
            } catch (err) {
                console.error('Error fetching friends:', err);
            } finally {
                setIsFriendLoading(false);
            }
        }

        if (session?.user?.id) {
            getFriends();
        }
    }, [session?.user?.id]);

    return (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4">
            <div className="md:col-span-2 flex flex-col mt-3 p-5">
                <img
                    src="/summary.avif"
                    alt="memories"
                    className="object-contain w-full max-w-lg"
                />
            </div>

            <div className='md:col-span-3'>
                <p className='font-extrabold text-3xl md:text-5xl text-gray-800 mb-6'>
                    {selectedUser ? "Summary for Selected User" : "Select Conversations to generate Summary"}
                </p>

                {isFriendLoading ? (
                    <div className="flex flex-col gap-4 mt-6">
                        {[1, 2, 3].map((_, i) => (
                            <div key={i} className="flex items-center gap-4 animate-pulse">
                                <div className="w-14 h-14 bg-gray-300 rounded-full"></div>
                                <div className="h-5 w-40 bg-gray-300 rounded"></div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <ul>
                        {friends
                            .filter(friend => !selectedUser || friend.receiverId === selectedUser)
                            .map((friend, index) => (
                                <li
                                    key={index}
                                    className='mt-6 cursor-pointer'
                                    onClick={() => handleUserClick(friend.receiverId)}
                                >
                                    <div className='flex items-center gap-4'>
                                        <div className="w-14 h-14 rounded-full bg-gray-900 flex items-center justify-center text-white font-extrabold">
                                            <p className="text-lg">{friend?.username?.[0] || 'U'}</p>
                                        </div>
                                        <div className='text-gray-700 font-extrabold text-lg'>
                                            {friend?.username || 'Unknown User'}
                                        </div>
                                    </div>
                                </li>
                            ))}
                    </ul>
                )}

                {isLoading && (
                    <div className="mt-10 text-gray-600 text-lg animate-pulse font-medium">
                        Generating summary... please wait ⏳
                    </div>
                )}

                {!isLoading && chat && (
                    <div className="mt-10 p-5 bg-gray-100 rounded-xl">
                        <pre className="whitespace-pre-wrap text-sm md:text-base text-gray-800 font-mono">{chat}</pre>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Page;
