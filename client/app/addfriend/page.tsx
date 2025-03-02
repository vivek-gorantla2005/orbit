import React from "react";
import FriendProfile from "../components/FriendProfile";
import { SuggestedFriends } from "../components/SuggestedFriends";

const Page = () => {
  return (
    <div className="m-0 p-0 flex w-full justify-center gap-6 overflow-hidden">
      {/* Left Side - Search Section */}
      <div className="w-2/5 p-6 bg-white rounded-lg shadow-md overflow-y-scroll no-scrollbar">
        <div className="font-bold text-2xl text-gray-700 mb-3">Add Friends</div>
        <input
          type="text"
          placeholder="Search..."
          className="w-full h-12 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="mt-4 flex justify-center">
          <img
            src="findFriends.jpg"
            width={370}
            height={370}
            alt="Find Friends"
            className="rounded-lg shadow-lg"
          />
        </div>
      </div>

      {/* Right Side - Profile & Suggested Friends */}
      <div className="w-3/5 flex flex-col">
        <FriendProfile />
        <div className="mt-2 flex-grow">
          <SuggestedFriends />
        </div>
      </div>
    </div>
  );
};

export default Page;
