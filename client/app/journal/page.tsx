'use client'
import axios from 'axios'
import React from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import { BACKEND_ROUTE } from '@/backendRoutes'
import { useSession } from 'next-auth/react'
const Page = () => {
  const { data: session } = useSession()
  const [chattedWith, setChattedWith] = React.useState<string[]>([])
  useEffect(() => {
    async function fetchChatUsers() {
      try {
        const userChattedWith = await axios.get(`${BACKEND_ROUTE}/api/todayConversations?userId=${session?.user?.id}`);
        if (userChattedWith.data) {
          console.log(userChattedWith.data);
          setChattedWith(userChattedWith.data);
        }
      } catch (err) {
        console.error("Error fetching chat users:", err);
      }
    }

    if (session?.user?.id) {
      fetchChatUsers();
    }
  }, [session?.user?.id]); // Only re-run if user ID changes

  return (
    <div>
      <div className="grid grid-cols-5 ">
        <div className='col-span-2'>
          <img src="journal.avif" alt="journal" />
        </div>
        <div className='col-span-3 '>
          <p className='text-gray-700 text-5xl font-extrabold'>Your Journal</p>
          <div className='bg-yellow-200 w-[50vw] h-[60vh] mt-5 rounded-3xl p-4 overflow-y-auto'>
            <p className='text-gray-800 text-2xl font-extrabold'>Date:12 March 2025</p>
            <p className='text-gray-700 font-bold'>Your Overall emotion : </p>
            <p className='text-gray-700 font-bold'>Topics Discussed : </p>
            <p className='text-gray-700 font-bold '>
              <span className='mr-2'>People:</span>
              {chattedWith.length > 0 ? (
                chattedWith.map((user, index) => (
                  <span key={index} className='text-gray-800 font-bold'>
                    {user.username as string}
  
                    {index < chattedWith.length - 1 ? ', ' : ''}
                  </span>
                ))
              ) : (
                <span>No one to show</span>
              )}
            </p>


            <ul className='mt-4'>
              <li className='style-none'>
                <div>
                  <p className='font-bold text-gray-900'>Time :</p>
                  <p className='text-sm font-bold text-gray-800'>You were happy and conversing with vivek</p>
                </div>
              </li>
            </ul>
            <div className='mt-4'>
              <p className='font-bold text-gray-900'>Todays Summary!!</p>

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Page
