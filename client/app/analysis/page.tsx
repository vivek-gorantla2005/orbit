'use client'
import React, { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
} from 'recharts'

const Page = () => {
    const [isVisible, setIsVisible] = useState(true)

    const handleStart = () => {
        setIsVisible(false)
    }

    const data = [
        { name: 'Jan', value: 30 },
        { name: 'Feb', value: 20 },
        { name: 'Mar', value: 40 },
        { name: 'Apr', value: 35 },
        { name: 'May', value: 50 },
    ]

    const pieData = [
        { name: 'Happy', value: 40 },
        { name: 'Sad', value: 20 },
        { name: 'Excited', value: 15 },
        { name: 'Anxious', value: 25 },
    ]

    const COLORS = ['#34D399', '#F87171', '#60A5FA', '#FBBF24']

    return (
        <AnimatePresence mode="wait">
            {isVisible ? (
                <motion.div
                    className="grid grid-cols-1 md:grid-cols-5 gap-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                >
                    {/* Image Section */}
                    <div className="md:col-span-3 flex justify-center mt-16">
                        <img
                            src="analysis.avif"
                            alt="memories"
                            className="object-contain w-full max-w-lg"
                        />
                    </div>

                    {/* Text Section */}
                    <div className="md:col-span-2 flex flex-col mt-16 px-6">
                        <p className="text-5xl md:text-7xl font-extrabold text-gray-800 mb-4 leading-tight">
                            View Your Analytics!!
                        </p>
                        <p className="text-xl md:text-2xl font-bold text-gray-700 mb-6">
                            Get insights into your data with our powerful analytics tools. Visualize trends, track performance, and make informed decisions.
                        </p>
                        <button
                            onClick={handleStart}
                            className="w-40 h-14 bg-slate-800 rounded-xl font-extrabold text-white"
                        >
                            Get Started
                        </button>
                    </div>
                </motion.div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 px-10 py-10">
                    {/* Chart Image */}
                    <div className="flex justify-center items-center">
                        <img src="pie.avif" alt="Pie Chart" className="object-contain w-full max-w-lg" />
                    </div>

                    {/* Line Chart Section */}
                    <div className="flex flex-col justify-center items-center">
                        <p className="text-5xl text-gray-700 font-extrabold">Weekly Mood Trend</p>
                        <ResponsiveContainer width="100%" height={300} className="mt-10">
                            <LineChart data={data}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Line type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={3} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Pie Chart Section */}
                    <div className="flex justify-center items-center">
                        <img src="emotion.avif" alt="Pie Chart" className="object-contain w-full max-w-lg" />
                    </div>

                    {/* bar graph*/}
                    <div className="flex flex-col justify-center items-center">
                        <p className="text-5xl text-gray-700 font-extrabold mt-20 mb-5">Mood Distribution</p>
                        <ResponsiveContainer width={400} height={300}>
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }) =>
                                        `${name}: ${(percent * 100).toFixed(0)}%`
                                    }
                                    outerRadius={100}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={COLORS[index % COLORS.length]}
                                        />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Recomendation section*/}
                    <div className="flex justify-center items-center">
                        <img src="recomendation.avif" alt="Pie Chart" className="object-contain w-full max-w-lg" />
                    </div>

                    <div className="flex flex-col">
                        <p className="text-5xl text-gray-700 font-extrabold mt-20 mb-5">Recomendations</p>
                        <ul className='mt-3'>
                            <li className='text-gray-800 font-extrabold text-xl'>Go for a Walk</li>
                            <li className='text-gray-800 font-extrabold text-xl'>Practice Mindfulness</li>
                            <li className='text-gray-800 font-extrabold text-xl'>Connect with Friends</li>
                        </ul>
                    </div>

                </div>
            )}
        </AnimatePresence>
    )
}

export default Page
