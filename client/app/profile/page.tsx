import { BadgeCheck, Star, Trophy } from "lucide-react";
import { Users, UserCheck, FileText } from "lucide-react";
import Link from "next/link";
import React from 'react'
import { Button } from "@/components/ui/button";

const Page = () => {
    return (
        <>
            {/* Edit Profile Section */}
            <div className="grid grid-cols-2 gap-12 items-center p-8">
                {/* Left Section - Image */}
                <div className="flex justify-center">
                    <img src="edit2.jpg" alt="Edit" width={500} height={700} className="rounded-lg shadow-md" />
                </div>

                {/* Right Section - Edit Profile Button */}
                <div className="space-y-4 flex flex-col items-center">
                    <p className="font-extrabold text-gray-700 text-7xl">Edit Profile</p>
                    <p className="text-gray-500 text-lg">Customize your profile & stand out!</p>
                    <Button className="bg-gray-700 text-white font-bold px-6 py-2 rounded-lg shadow-md hover:bg-gray-900 transition">
                        Edit Now
                    </Button>
                </div>
            </div>

            {/* Your Network Section */}
            <div className="grid grid-cols-2 gap-12">
                {/* Left Section - Text + Icons */}
                <div className="flex flex-col justify-center items-center text-left font-semibold text-2xl text-gray-700 gap-4">
                    <p className="font-extrabold text-gray-700 text-7xl">Your Network</p>
                    <p className="text-gray-500 text-lg">Connect & grow with amazing people!</p>

                    {/* Followers */}
                    <div className="flex items-center gap-2 text-lg text-gray-600">
                        <Users className="w-6 h-6 text-blue-500" />
                        <span>Followers: 1.2K</span>
                    </div>

                    {/* Following */}
                    <div className="flex items-center gap-2 text-lg text-gray-600">
                        <UserCheck className="w-6 h-6 text-green-500" />
                        <span>Following: 530</span>
                    </div>

                    {/* Posts */}
                    <div className="flex items-center gap-2 text-lg text-gray-600">
                        <FileText className="w-6 h-6 text-purple-500" />
                        <span>Posts: 245</span>
                    </div>
                </div>

                {/* Right Section - Image */}
                <div className="flex justify-end">
                    <img src="friends.jpg" width={500} height={700} alt="network" />
                </div>
            </div>

            {/* Perks & Badges Section */}
            <div className="grid grid-cols-2 gap-8 items-center mt-16">
                {/* Left Section - Image */}
                <div className="flex justify-center">
                    <img src="perks.jpg" alt="Perks" width={500} height={700} className="rounded-lg shadow-md" />
                </div>

                {/* Right Section - Perks & Badges */}
                <div className="flex flex-col justify-center space-y-4 text-left">
                    <p className="font-extrabold text-gray-700 text-7xl">Perks & Badges</p>
                    <p className="text-gray-500 text-lg">Unlock rewards & earn your stripes!</p>

                    {/* Badge 1 - Verified User */}
                    <div className="flex items-center gap-2 text-lg text-gray-600">
                        <BadgeCheck className="w-6 h-6 text-blue-500" />
                        <span>Verified User</span>
                    </div>

                    {/* Badge 2 - Top Contributor */}
                    <div className="flex items-center gap-2 text-lg text-gray-600">
                        <Star className="w-6 h-6 text-yellow-500" />
                        <span>Top Contributor</span>
                    </div>

                    {/* Badge 3 - Achiever */}
                    <div className="flex items-center gap-2 text-lg text-gray-600">
                        <Trophy className="w-6 h-6 text-green-500" />
                        <span>Achiever</span>
                    </div>
                </div>
            </div>

            {/* Analytics Section */}
            <div className="grid grid-cols-2 gap-8 items-center">
                {/* Left Section - Button */}
                <div className="space-y-4 flex flex-col items-center">
                    <p className="font-extrabold text-gray-700 text-7xl">View Analytics</p>
                    <p className="text-gray-500 text-lg">Gain insights & track your growth!</p>
                    <Link href='/analysis'>
                    <Button className="bg-gray-700 text-white font-bold px-6 py-2 rounded-lg shadow-md hover:bg-gray-900 transition">
                        Go To Analytics
                    </Button>
                    </Link>
                </div>

                {/* Right Section - Centered Image */}
                <div className="flex justify-center items-center">
                    <img src="analytics2.jpg" width={500} height={700} alt="Analytics" className="rounded-lg shadow-md" />
                </div>
            </div>
        </>
    )
}

export default Page;
