'use client'
import React, { useState } from "react";
import SideBar from "./components/SideBar";
import PostCard from "./components/postCard";
import RightSideBar from "./components/RightSideBar";
import { useContext } from "react";
import { SocketContext } from "./context/SocketCustomContext";


export default function Home() {
  const {notifications} = useContext(SocketContext)

  console.log('new notification: ',notifications)

  return (
    <div className="grid grid-cols-12 h-[83vh] m-1 gap-2 overflow-hidden">
      {/* Sidebar */}
      <div className="hidden md:flex md:col-span-1 text-white p-2 rounded-lg shadow-md">
        <SideBar notifications={notifications} />
      </div>

      {/* Main Feed */}
      <div className="m-0 p-0 span-12 md:col-span-8 rounded-lg shadow-md flex flex-col text-center h-screen overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-gray-200">
        <div className="font-extrabold text-5xl text-gray-900 flex gap-2 items-center justify-center">POSTS
          <img src="post.svg" alt="post" className="w-10 h-10 filter invert-[20%] brightness-0 saturate-0"
          />
        </div>
        <PostCard />
        <PostCard />
        <PostCard />
        <PostCard />
        <PostCard />
      </div>

      {/* Right Sidebar */}
      <div className="hidden md:block md:col-span-3 w-72 p-4 rounded-lg shadow-md justify-center">
        <RightSideBar />
      </div>

      {/* Socket Manager */}
    </div>
  );
}
