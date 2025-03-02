'use client'
import React, { useState } from 'react';

const PostCard = () => {
    const [likes, setLikes] = useState(120);
    const [comments, setComments] = useState(18);

    return (
        <div className="m-6 mb-10">
            {/* Card Container */}
            <div className=" bg-white shadow-xl rounded-2xl overflow-hidden transition-transform duration-300 hover:scale-[1.02] p-4 border border-gray-300">

                {/* User Section */}
                <div className="flex space-x-4 mb-4 items-center">
                    {/* User Avatar */}
                    <div className="avatar placeholder">
                        <div className="bg-neutral text-neutral-content w-12 rounded-full">
                            <span className='font-bold'>SY</span>
                        </div>
                    </div>
                    {/* User Info */}
                    <div>
                        <h3 className="text-gray-800 text-2xl font-extrabold">vivek_g</h3>
                        <p className="text-gray-500 text-sm">Posted on August 15, 2021</p>
                    </div>
                </div>

                {/* Image Section */}
                <figure className="flex relative rounded-lg overflow-hidden items-center justify-center">
                    <img
                        src="vec4.jpg"
                        alt="Shoes"
                        className='w-full h-80 object-contain'
                    />
                </figure>

                {/* Card Body */}
                <div className="p-4">
                    <h2 className="text-xl font-bold text-gray-800">Bought Shoes</h2>
                    <p className="text-gray-700 text-sm">Amazing shoes from Amazon</p>

                    {/* Hashtags Section */}
                    <div className="mt-2 flex flex-wrap gap-2">
                        <span className="text-blue-500 text-xs font-semibold bg-blue-100 px-2 py-1 rounded-md">#Shoes</span>
                        <span className="text-blue-500 text-xs font-semibold bg-blue-100 px-2 py-1 rounded-md">#Fashion</span>
                        <span className="text-blue-500 text-xs font-semibold bg-blue-100 px-2 py-1 rounded-md">#Style</span>
                    </div>
                </div>

                {/* Card Actions */}
                <div className="flex items-center gap-5 p-4 border-t border-gray-300">
                    <button className="flex items-center gap-1 transition-transform duration-300 hover:scale-105" onClick={() => setLikes(likes + 1)}>
                        <img src="heart.png" width={20} height={20} alt="like" />
                        <span className="text-gray-600 text-sm">{likes}</span>
                    </button>
                    <button className="flex items-center gap-1 transition-transform duration-300 hover:scale-105" onClick={() => setComments(comments + 1)}>
                        <img src="comment.png" width={20} height={20} alt="comment" />
                        <span className="text-gray-600 text-sm">{comments}</span>
                    </button>
                    <button className="flex items-center gap-1 transition-transform duration-300 hover:scale-105">
                        <img src="share.png" width={20} height={20} alt="share" />
                        <span className="text-gray-600 text-sm">Share</span>
                    </button>
                </div>
            </div>
        </div>
    );
};
export default PostCard;
