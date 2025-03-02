'use client'
import React, { useState } from 'react'
import FriendsList from '../components/FriendsList'
import ChatSection from '../components/ChatSection'

interface User {
    username: string
    id: number
    status: "online" | "offline" | "busy"
    avatar: string | "none"
}

const Page = () => {
    const [chatUser, setChatUser] = useState<User | null>(null)

    return (
        <div className="grid grid-cols-8 w-full h-screen overflow-y-hidden">
            <aside className="col-span-2 rounded-xl shadow-md bg-white text-black ml-7 items-center justify-center">
                <FriendsList onUserSelect={setChatUser} />
            </aside>

            <main className="col-span-6 p-6 h-[83vh] text-black flex flex-col">
                {chatUser ? (
                    <ChatSection chatUser={chatUser} onChatClose={() => setChatUser(null)} />
                ) : (
                    <img src="vec6.jpg" alt="" />
                )}
            </main>
        </div>
    )
}

export default Page
