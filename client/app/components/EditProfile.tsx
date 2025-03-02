'use client'
import React from 'react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useState } from 'react'
const EditProfile = () => {
    const [profile, setProfile] = useState({
        username: "vivek_g",
        bio: "B.Tech UG | AI & Web Dev Enthusiast",
        gender: "Male",
        location: "Hyderabad, India",
        mobileNumber: "9876543210",
        email: "vivek@example.com",
        profileImg: "https://randomuser.me/api/portraits/men/75.jpg",
    });

    // Handle Input Change
    const handleChange = (e) => {
        setProfile({ ...profile, [e.target.name]: e.target.value });
    };

  return (
    <div>
      <div className="border border-gray-300 rounded-lg p-6 shadow-lg w-96 bg-white">
                <p className='font-bold text-2xl text-gray-700 mb-4 text-center'>Edit Profile</p>

                <div className="space-y-4">
                    <div>
                        <label className="text-sm font-semibold text-gray-700">Username</label>
                        <Input
                            name="username"
                            value={profile.username}
                            onChange={handleChange}
                            className="mt-1 w-full"
                        />
                    </div>

                    <div>
                        <label className="text-sm font-semibold text-gray-700">Bio</label>
                        <Textarea
                            name="bio"
                            value={profile.bio}
                            onChange={handleChange}
                            className="mt-1 w-full"
                        />
                    </div>

                    <div>
                        <label className="text-sm font-semibold text-gray-700">Gender</label>
                        <select
                            name="gender"
                            value={profile.gender}
                            onChange={handleChange}
                            className="w-full p-2 border rounded-lg mt-1"
                        >
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    <div>
                        <label className="text-sm font-semibold text-gray-700">Location</label>
                        <Input
                            name="location"
                            value={profile.location}
                            onChange={handleChange}
                            className="mt-1 w-full"
                        />
                    </div>

                    <div>
                        <label className="text-sm font-semibold text-gray-700">Mobile Number</label>
                        <Input
                            name="mobileNumber"
                            type="tel"
                            value={profile.mobileNumber}
                            onChange={handleChange}
                            className="mt-1 w-full"
                        />
                    </div>

                    <div>
                        <label className="text-sm font-semibold text-gray-700">Email</label>
                        <Input
                            name="email"
                            type="email"
                            value={profile.email}
                            onChange={handleChange}
                            className="mt-1 w-full"
                        />
                    </div>
                </div>
            </div>
    </div>
  )
}

export default EditProfile
