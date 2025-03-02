import React from 'react';

const FriendProfile = () => {
    return (
        <div className="rounded-lg w-96">
            {/* Profile Header */}
            <div className="flex gap-4">
                {/* Profile Picture */}
                <div className="w-20 h-20">
                    <img
                        src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                        alt="User Profile"
                        className="w-full h-full object-cover rounded-full border-2 border-gray-300"
                    />
                </div>

                {/* User Info */}
                <div>
                    <h2 className="text-xl font-bold text-gray-800">vivek_g</h2>
                    <p className="text-gray-500 text-sm">
                        I am a B.Tech UG student from Anurag University
                    </p>

                    {/* Followers & Following */}
                    <div className="flex gap-4 mt-2">
                        <div className="text-center">
                            <p className="text-lg font-semibold text-gray-800">1.2K</p>
                            <p className="text-xs text-gray-500">Followers</p>
                        </div>
                        <div className="text-center">
                            <p className="text-lg font-semibold text-gray-800">540</p>
                            <p className="text-xs text-gray-500">Following</p>
                        </div>
                        <div className="text-center">
                            <p className="text-lg font-semibold text-gray-800">4</p>
                            <p className="text-xs text-gray-500">Posts</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Badges */}
            <div className="mt-4 flex flex-wrap justify-center gap-2">
                <span className="bg-blue-100 text-blue-600 text-xs font-semibold px-3 py-1 rounded-full">
                    Coder 💻
                </span>
                <span className="bg-green-100 text-green-600 text-xs font-semibold px-3 py-1 rounded-full">
                    Tech Enthusiast 🚀
                </span>
                <span className="bg-yellow-100 text-yellow-600 text-xs font-semibold px-3 py-1 rounded-full">
                    AI Explorer 🤖
                </span>
                <span className="bg-red-100 text-red-600 text-xs font-semibold px-3 py-1 rounded-full">
                    Open Source Contributor 🌍
                </span>
            </div>

            {/* Likeness Progress Bar */}
            <div className="mt-4">
                <p className="text-gray-700 font-medium">Likeness Score</p>
                <div className="w-full bg-gray-200 h-4 rounded-full overflow-hidden">
                    <div
                        className="bg-gray-700 h-full text-xs text-center text-white flex items-center justify-center"
                        style={{ width: "75%" }}
                    >
                        75%
                    </div>
                </div>
            </div>

            {/* Card Actions */}
            <div className="mt-5 flex gap-4">
                <button className="bg-gray-800 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition">
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
