'use client'
import React, { useState, useEffect } from 'react'
import { Progress } from "@/components/ui/progress"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Input } from '@/components/ui/input'
import { useSession } from 'next-auth/react'
import { Loader2 } from 'lucide-react' // ShadCN's loader icon
import axios from 'axios'

const Page = () => {
    const [open, setOpen] = useState(false)
    const [goalInput, setGoalInput] = useState("")
    const [goals, setGoals] = useState<any[]>([])
    const [loading, setLoading] = useState(false)
    const { data: session } = useSession()
    const [messages, setMessages] = useState([])

    const fetchGoals = async () => {
        try {
            setLoading(true)
            const res = await fetch(`http://localhost:8000/api/getGoals?userId=${session?.user?.id}`)
            const data = await res.json()

            console.log(data)

            if (data?.data) {
                const allGoals = data.data.flatMap((item: any) => item.goals)
                setGoals(allGoals)
            }
        } catch (err) {
            console.error("Error fetching goals:", err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (session?.user?.id) {
            fetchGoals()
        }
    }, [session?.user?.id])

    const handleSetGoal = async () => {
        if (!goalInput.trim()) return

        try {
            const res = await fetch("http://localhost:8000/api/createGoal", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId: session?.user?.id,
                    goals: [{ name: goalInput.trim(), progress: 0 }]
                })
            })

            const data = await res.json()
            if (res.ok) {
                setOpen(false)
                setGoalInput("")
                fetchGoals()
            } else {
                console.error(data.message)
            }
        } catch (err) {
            console.error("Error setting goal:", err)
        }
    }

    const handleRefresh = async () => {
        try {
            setLoading(true);
    
            const response = await axios.get(`http://localhost:8000/api/getUserMessages?userId=${session?.user?.id}`);
            const chatHistory: string[] = response.data.data.map((msg: { content: string }) => msg.content);
    
            const goalsObj = goals.reduce((acc: any, goal: any) => {
                acc[goal.name] = goal.progress / 100;
                return acc;
            }, {});
    
            const payload = {
                userId: session?.user?.id,
                goals: goalsObj,
                chatHistory: chatHistory
            };
    
            console.log("Payload to AI API:", payload);
    
            const aiRes = await axios.post("http://127.0.0.1:8000/api/goalProgress", payload);
            const updatedProgress = aiRes.data;
    
            console.log("AI response:", updatedProgress);
    
            const newGoals = goals.map(goal => {
                const newProgress = updatedProgress[goal.name.toLowerCase()];
                return newProgress !== undefined
                    ? { ...goal, progress: Math.min(Math.round(newProgress * 100), 100) }
                    : goal;
            });
    
            setGoals(newGoals);    
        } catch (error) {
            console.error("Error refreshing goal progress:", error);
        } finally {
            setLoading(false);
        }
    };
    
    
    return (
        <>
            <AlertDialog open={open} onOpenChange={setOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            <p className='font-extrabold text-3xl'>Add a new goal</p>
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            This feature allows you to add a goal and track its progress.
                        </AlertDialogDescription>
                        <AlertDialogDescription>
                            <Input
                                className='h-9 w-96'
                                placeholder='Enter the goal'
                                value={goalInput}
                                onChange={(e) => setGoalInput(e.target.value)}
                            />
                        </AlertDialogDescription>
                        <AlertDialogDescription>
                            <button
                                className='mt-2 h-9 w-36 text-white bg-gray-800 font-extrabold rounded-2xl'
                                onClick={handleSetGoal}
                            >
                                Set Goal
                            </button>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setOpen(false)}>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => setOpen(false)}>Continue</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="md:col-span-2 flex mt-3">
                    <img
                        src="goal.avif"
                        alt="memories"
                        className="object-contain w-full max-w-lg"
                    />
                </div>

                <div className="md:col-span-3 flex flex-col mt-10 max-h-[60vh] overflow-y-auto">
                    <h1 className="text-6xl text-gray-800 font-extrabold">Track Your Goal Progress</h1>
                    <p className="text-lg text-gray-600 mb-4 font-bold">
                        Track your progress and stay motivated with our goal progress feature.
                    </p>

                    <button className='w-44 bg-gray-700 font-extrabold h-9 text-white rounded-3xl' onClick={handleRefresh}>Refresh Progress</button>

                    {loading ? (
                        <div className="flex items-center justify-center mt-10">
                            <Loader2 className="h-10 w-10 animate-spin text-gray-600" />
                            <span className="ml-4 font-semibold text-gray-700">Loading goals...</span>
                        </div>
                    ) : goals.length === 0 ? (
                        <p className="text-lg text-gray-600">No goals set yet. Add one!</p>
                    ) : (
                        goals.map((goal, index) => (
                            <div className='mt-10' key={index}>
                                <p className='font-extrabold text-black text-xl mb-2'>{goal.name}</p>
                                <div className='flex items-center gap-3'>
                                    <Progress value={goal.progress} className='w-96' />
                                    {goal.progress === 100 && (
                                        <img src="target.png" className='w-10 h-10' alt="Completed" />
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <div className="md:col-span-2 flex flex-col mt-10 max-h-[60vh] overflow-y-auto items-center justify-center">
                    <h1 className="text-6xl text-gray-800 font-extrabold">Add a Goal!!</h1>
                    <p className="text-lg text-gray-600 mb-4 font-bold">Add goal to maintain progress</p>
                    <div>
                        <button
                            className='h-16 w-40 bg-gray-700 text-white font-extrabold rounded-3xl'
                            onClick={() => setOpen(true)}
                        >
                            Add a Goal
                        </button>
                    </div>
                </div>

                <div className="md:col-span-3 flex mt-3 mb-28 justify-center items-center">
                    <img
                        src="goal2.avif"
                        alt="memories"
                        className="object-contain w-full max-w-lg"
                    />
                </div>
            </div>
        </>
    )
}

export default Page
