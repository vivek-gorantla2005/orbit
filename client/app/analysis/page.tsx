'use client'
import React, { useState } from 'react'
import { AnimatePresence, motion } from "framer-motion"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'


const Page = () => {
    const [isVisible, setIsVisible] = useState(true)

    const handleStart = () => {
        setIsVisible(false)
    }

    const data = [
        {name: 'Jan', value: 30 },
        {name: 'Feb', value: 20 },
        {name: 'Mar', value: 40 },
        {name: 'Apr', value: 35 },
        {name: 'May', value: 50 },
        ]


    return (
        <AnimatePresence initial={false}>
            {isVisible ? (
                <motion.div
                    className='grid grid-cols-5'
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                >
                    {/* Image Section */}
                    <div className='col-span-3 flex justify-center items-center'>
                        <img
                            src="analysis.avif"
                            alt="memories"
                            width={570}
                            height={500}
                            className="object-contain"
                        />
                    </div>

                    {/* Text Section */}
                    <div className='col-span-2 flex flex-col justify-center items-start px-6'>
                        <p className='text-7xl font-extrabold text-gray-800 mb-4 leading-tight'>
                            Glance Your Memories
                        </p>
                        <p className='text-2xl font-bold text-gray-700 mb-6'>
                            Have a view of your image gallery custom memories
                        </p>
                        <button
                            onClick={handleStart}
                            className='w-40 h-14 bg-slate-800 rounded-xl font-extrabold text-white'
                        >
                            Get Started
                        </button>
                    </div>
                </motion.div>
            ) : (
           
            <div className="grid grid-cols-2 h-screen">
                {/* Image Section */}
                <div className="flex">
                    <img src="pie.avif" width={800} height={800} alt="Pie Chart" className="object-contain" />
                </div>

                {/* Line Chart Section */}
                <div className="flex">
                    <ResponsiveContainer width="80%" height="70%">
                        <LineChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Line type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={3} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
            )
    }
        </AnimatePresence>
    )
}

export default Page
