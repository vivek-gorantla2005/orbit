'use client'
import React, { useState } from 'react'
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

const Page = () => {
    const [open, setOpen] = useState(false)

    return (
        <>
            
            <AlertDialog open={open} onOpenChange={setOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle><p className='font-extrabold text-3xl '>Add a new goal</p></AlertDialogTitle>
                        <AlertDialogDescription>
                            This feature allows you to add a goal and track its progress.
                        </AlertDialogDescription>
                        <AlertDialogDescription>
                            <Input className='h-9 w-96' placeholder='enter the goal'/>
                        </AlertDialogDescription>
                        <AlertDialogDescription>
                            <button className='mt-2 h-9 w-36 text-white bg-gray-800 font-extrabold rounded-2xl'>Set Goal</button>
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

                {/* Progress Section */}
                <div className="md:col-span-3 flex flex-col mt-10 max-h-[60vh] overflow-y-auto">
                    <h1 className="text-6xl text-gray-800 font-extrabold">Track Your Goal Progress</h1>
                    <p className="text-lg text-gray-600 mb-4 font-bold">
                        Track your progress and stay motivated with our goal progress feature.
                    </p>

                    <div className='mt-10'>
                        <p className='font-extrabold text-black text-xl mb-2 '>Learn C++</p>
                        <Progress value={33} className='w-96' />
                    </div>
                    <div className='mt-10'>
                        <p className='font-extrabold text-black text-xl mb-2 '>Go cycling</p>
                        <Progress value={33} className='w-96' />
                    </div>
                    <div className='mt-10'>
                        <p className='font-extrabold text-black text-xl mb-2 '>Play cricket</p>
                        <div className='flex items-center gap-3'>
                            <Progress value={100} className='w-96' />
                            <img src="target.png" className='w-10 h-10' alt="" />
                        </div>
                    </div>
                </div>

                {/* Goal Setting Section */}
                <div className="md:col-span-2 flex flex-col mt-10 max-h-[60vh] overflow-y-auto items-center justify-center">
                    <h1 className="text-6xl text-gray-800 font-extrabold">Add a Goal!!</h1>
                    <p className="text-lg text-gray-600 mb-4 font-bold">
                        Add goal to maintain progress
                    </p>
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
