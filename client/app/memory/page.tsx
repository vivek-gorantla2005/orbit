'use client'
import React, { useState, useEffect } from 'react'
import { AnimatePresence, motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import axios from "axios"
import { useSession } from 'next-auth/react'

const Page = () => {
    const [isVisible, setIsVisible] = useState(true)
    const { data: session } = useSession()
    const [memory, setMemory] = useState([])

    useEffect(() => {
        const getImages = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/api/getMemory/${session?.user?.id}`)
                setMemory(response.data?.data || []) // Extract actual data
            } catch (error) {
                console.error("Error fetching images:", error)
            }
        }

        if (session?.user?.id) {
            getImages()
        }
    }, [session?.user?.id])

    const handleStart = () => {
        setIsVisible(false)
    }

    return (
        <>
            <AnimatePresence initial={false}>
                {isVisible ? (
                    <motion.div
                        className='grid grid-cols-5 items-center'
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <div className='col-span-3'>
                            <img src="memories.jpg" alt="memories" width={700} height={700} />
                        </div>
                        <div className='col-span-2'>
                            <p className='text-8xl font-extrabold text-gray-800 mb-2'>
                                Glance Your Memories
                            </p>
                            <p className='text-2xl font-extrabold text-gray-700'>
                                Have a view of your image gallery custom memories
                            </p>
                            <button
                                onClick={handleStart}
                                className='w-40 h-14 bg-slate-800 rounded-xl mt-5 font-extrabold text-white'
                            >
                                Get Started
                            </button>
                        </div>
                    </motion.div>
                ) : (
                    <>
                        {memory.length === 0 ? (
                            <div className='grid grid-cols-5 items-center max-h-screen mt-20'>
                                <div className='col-span-3 flex justify-center items-center'>
                                    <img src="empty.jpg" alt="empty" width={700} height={700} />
                                </div>
                                <div className='col-span-2 p-4'>
                                    <p className="text-8xl font-extrabold text-gray-800">No Memories Found</p>
                                    <p className='text-3xl font-bold text-gray-600 mt-2'>Please add some memories</p>
                                </div>
                            </div>
                        ) : (
                            memory.map((item) => (
                                <div key={item._id} className='grid grid-cols-5 items-center  mt-20'>
                                    <div className='col-span-3 flex justify-center items-center'>
                                        <Carousel className="w-[500px]">
                                            <CarouselContent>
                                                {item.uploads.map((upload) => (
                                                    <CarouselItem key={upload._id}>
                                                        <div className="p-1">
                                                            <Card>
                                                                <CardContent className="flex items-center justify-center p-6">
                                                                    <img
                                                                        src={upload.filePath}
                                                                        alt={upload.fileName}
                                            
                                                                    />
                                                                </CardContent>
                                                            </Card>
                                                        </div>
                                                    </CarouselItem>
                                                ))}
                                            </CarouselContent>
                                            <CarouselPrevious />
                                            <CarouselNext />
                                        </Carousel>
                                    </div>
                                    <div className='col-span-2 p-4'>
                                        <p className="text-8xl font-extrabold text-gray-800 capitalize">
                                            {item.label} Pics
                                        </p>
                                        <p className='text-3xl font-bold text-gray-600 mt-2'>
                                            Date : {new Date(item.timestamp).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            ))
                        )}
                    </>
                )}
            </AnimatePresence>
        </>
    )
}

export default Page
