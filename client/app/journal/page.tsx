'use client'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { BACKEND_ROUTE } from '@/backendRoutes'
import { useSession } from 'next-auth/react'

const Page = () => {
  const { data: session } = useSession()
  const [chattedWith, setChattedWith] = useState<{ username: string }[]>([])
  const [journal, setJournal] = useState<{
    overall_emotion?: string,
    topics_discussed?: string[]
  }>({
    overall_emotion: 'Neutral',
    topics_discussed: []
  })

  const [chatEmotion,setChatEmotion] = useState("")


  useEffect(() => {
    async function fetchChatUsers() {
      try {
        const userChattedWith = await axios.get(`${BACKEND_ROUTE}/api/todayConversations?userId=${session?.user?.id}`)
        if (userChattedWith.data) {
          setChattedWith(userChattedWith.data)
        }
      } catch (err) {
        console.error("Error fetching chat users:", err)
      }
    }

    if (session?.user?.id) {
      fetchChatUsers()
    }
  }, [session?.user?.id])

  useEffect(() => {
    async function getTodayConv() {
      try {
        const response = await axios.get(`http://localhost:8000/api/getTodayMessages?userId=${session?.user?.id}`)
        const data = response.data

        const ai_res = await axios.post(
          'http://127.0.0.1:8000/api/generateJournal',
          data
        )

        const d = ai_res.data

        const cleanedResponse = d.replace(/```json/g, '')
          .replace(/```/g, '')
          .trim()

        const parsedJSON = JSON.parse(cleanedResponse)
        setJournal(parsedJSON)

        const sumAi = await axios.post('http://127.0.0.1:8000/api/generateSum',
          data
        )
        console.log(sumAi.data)

        setChatEmotion(sumAi.data)

      } catch (error) {
        console.error("Error fetching/generating journal:", error)
      }
    }

    if (session?.user?.id) {
      getTodayConv()
    }
  }, [session?.user?.id])

  const emotionEmoji = (emotion?: string) => {
    switch (emotion?.toLowerCase()) {
      case 'happy': return '😊'
      case 'sad': return '😢'
      case 'neutral': return '😐'
      case 'angry': return '😠'
      default: return ''
    }
  }

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-5 gap-4">
        {/* Left Image Section */}
        <div className="col-span-2">
          <img src="/journal.avif" alt="journal" className="w-full h-full object-cover rounded-lg" />
        </div>

        {/* Right Journal Section */}
        <div className="col-span-3 bg-yellow-200 p-6 rounded-xl shadow-md">
          <p className="text-gray-700 text-5xl font-extrabold">Your Journal</p>

          <div className="mt-5">
            <p className="text-gray-800 text-2xl font-bold">Date: {new Date().toDateString()}</p>

            <div className="mt-4">
              <p className="text-gray-700 font-bold">
                Your Overall Emotion: <span className="text-gray-900">{journal.overall_emotion || '...'}</span>
                <span className="ml-2">{emotionEmoji(journal.overall_emotion)}</span>
              </p>

              <div className="mt-2">
                <p className="text-gray-700 font-bold">Topics Discussed:</p>
                {journal.topics_discussed && journal.topics_discussed.length > 0 ? (
                  <ul className="list-disc list-inside text-gray-900 mt-1">
                    {journal.topics_discussed.map((topic, index) => (
                      <li key={index} className='font-bold'>{topic}</li>
                    ))}
                  </ul>
                ) : (
                  <span className="text-gray-800 ml-2">No topics detected</span>
                )}
              </div>

            </div>

            <div className="mt-4">
              <p className="text-gray-700 font-bold">People:</p>
              <div className="text-gray-800">
                {chattedWith.length > 0 ? (
                  chattedWith.map((user, index) => (
                    <span key={index} className="font-bold">
                      {user.username}
                      {index < chattedWith.length - 1 ? ', ' : ''}
                    </span>
                  ))
                ) : (
                  <span>No one to show</span>
                )}
              </div>
            </div>

            <div className="mt-4">
              <p className="font-bold text-gray-900">Summary of Your Conversations</p>
              <p className="text-gray-800 mt-2">
                {chatEmotion}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Page
