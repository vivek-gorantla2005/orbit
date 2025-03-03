'use client'
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BACKEND_ROUTE } from '@/backendRoutes';

const FriendProfile = ({ selectedUser }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const req = await axios.get(`${BACKEND_ROUTE}/api/getUser?userId=${selectedUser}`);
                setUser(req.data.retrievedUser);
            } catch (error) {
                console.error("Error fetching user:", error);
            }
        };

        if (selectedUser) {
            fetchUserProfile();
        }
    }, [selectedUser]);

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <div className="rounded-lg w-96 p-4 border shadow-lg bg-white">
            {/* Profile Header */}
            <div className="flex gap-4 items-center">
                {/* Profile Picture */}
                <div className="w-20 h-20">
                    <img
                        src={user.profilePic || "/default-profile.png"}
                        alt="User Profile"
                        className="w-full h-full object-cover rounded-full border-2 border-gray-300"
                    />
                </div>

                {/* User Info */}
                <div>
                    <h2 className="text-xl font-bold text-gray-800">{user.username || "Unknown"}</h2>
                    <p className="text-gray-500 text-sm">{user.bio || "No bio available"}</p>

                    {/* Followers & Following */}
                    <div className="flex gap-4 mt-2">
                        <div className="text-center">
                            <p className="text-lg font-semibold text-gray-800">{user.followers ?? 0}</p>
                            <p className="text-xs text-gray-500">Followers</p>
                        </div>
                        <div className="text-center">
                            <p className="text-lg font-semibold text-gray-800">{user.following ?? 0}</p>
                            <p className="text-xs text-gray-500">Following</p>
                        </div>
                        <div className="text-center">
                            <p className="text-lg font-semibold text-gray-800">{user.postCount ?? 0}</p>
                            <p className="text-xs text-gray-500">Posts</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Badges */}
            <div className="mt-4 flex flex-wrap justify-center gap-2">
                {user.badges && Object.keys(user.badges).length > 0 ? (
                    Object.values(user.badges).map((badge, index) => (
                        <span key={index} className="bg-blue-100 text-blue-600 text-xs font-semibold px-3 py-1 rounded-full">
                            {badge}
                        </span>
                    ))
                ) : (
                    <div className="font-bold text-gray-500">No badges found</div>
                )}
            </div>

            {/* Likeness Progress Bar */}
            <div className="mt-4">
                <p className="text-gray-700 font-medium">Likeness Score: {user.likenessScore ?? 0}%</p>
                <div className="w-full bg-gray-200 h-4 rounded-full overflow-hidden">
                    <div
                        className="bg-gray-700 h-full text-xs text-center text-white flex items-center justify-center"
                        style={{ width: `${user.likenessScore ?? 0}%` }}
                    >
                        {user.likenessScore ?? 0}%
                    </div>
                </div>
            </div>

            {/* Card Actions */}
            <div className="mt-5 flex gap-4">
                <button className="bg-gray-800 text-white px-4 py-2 rounded-lg shadow-md hover:bg-gray-700 transition">
                    Follow
                </button>
                <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg shadow-md hover:bg-gray-300 transition">
                    Inspect
                </button>
            </div>
        </div>
    );
};

export default FriendProfile;
