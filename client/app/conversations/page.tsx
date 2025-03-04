'use client'
import React, { useState } from 'react'
import FriendsList from '../components/FriendsList'
import ChatSection from '../components/ChatSection'

interface User {
    username: string
    id: string
    status: "online" | "offline" | "busy" | "unknown"
    avatar: string | null
}


const Page = () => {
    const [chatUser, setChatUser] = useState<User | null>(null)

    return (
        <div className="grid grid-cols-8 w-full h-screen overflow-y-hidden transition-all duration-300">
            {/* Hide Friends List when a chat is open */}
            {!chatUser && (
                <aside className="col-span-2 rounded-xl shadow-md bg-white text-black ml-7 items-center justify-center">
                    <FriendsList onUserSelect={setChatUser} />
                </aside>
            )}

            {/* Chat Section expands when open */}
            <main className={`${chatUser ? "col-span-8" : "col-span-6"} h-[85vh] m-0 p-0 text-black flex flex-col`}>
                {chatUser ? (
                    <ChatSection chatUser={chatUser} onChatClose={() => setChatUser(null)} />
                ) : (
                    <img src="vec6.jpg" alt="" className="w-full h-full object-cover" />
                )}
            </main>
        </div>
    )
}

export default Page
