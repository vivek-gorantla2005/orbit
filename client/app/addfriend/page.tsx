"use client";
import React, { useEffect, useState } from "react";
import FriendProfile from "../components/FriendProfile";
import { SuggestedFriends } from "../components/SuggestedFriends";
import axios from "axios";
import { BACKEND_ROUTE } from "@/backendRoutes";

const Page = () => {
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    if (!query) {
      setUsers([]); // Clear users if query is empty
      return;
    }

    const fetchUsers = async () => {
      try {
        console.log(query);
        const res = await axios.get(
          `${BACKEND_ROUTE}/api/autocomplete?query=${encodeURIComponent(query)}`
        );
        setUsers(res.data.users);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    const delay = setTimeout(fetchUsers, 300); // Debounced API call

    return () => clearTimeout(delay); // Cleanup function
  }, [query]);

  return (
    <div className="m-0 p-0 flex w-full justify-center gap-6 overflow-hidden">
      {/* Left Side - Search Section */}
      <div className="w-2/5 p-6 bg-white rounded-lg shadow-md relative">
        <div className="font-bold text-2xl text-gray-700 mb-3">Add Friends</div>
        <input
          type="text"
          placeholder="Search..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full h-12 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Suggestions Overlay */}
        {users.length > 0 && (
          <div className="absolute mt-1 bg-white shadow-lg rounded-lg z-10 p-4">
            <h3 className="font-semibold text-lg">Suggested Users</h3>
            <ul className="mt-2">
              {users.map((user) => (
                <li
                  key={user.id}
                  className="p-2 border-b last:border-0 cursor-pointer hover:bg-gray-100"
                  onClick={() => {
                    setSelectedUser(user.id);
                  }}
                >
                  {user.username}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Background Image with Blur */}
        <div className={`mt-4 flex ${users.length > 0 ? "blur-sm" : ""}`}>
          <img
            src="findFriends.jpg"
            width={370}
            height={370}
            alt="Find Friends"
            className="rounded-lg"
          />
        </div>
      </div>

      {/* Right Side - Profile & Suggested Friends */}
      <div className="w-3/5 flex flex-col">
        <div className="min-h-[300px]">
          <div className="min-h-[300px]">
            {selectedUser ? (
              <FriendProfile selectedUser={selectedUser} />
            ) : (
              <div className="flex items-center justify-center">
                <img src="profile.jpg" alt="profile" className="w-[23vw]  " />
              </div>
            )}
          </div>

        </div>
        <div className="mt-2 flex-grow">
          <SuggestedFriends />
        </div>
      </div>
    </div>
  );
};

export default Page;
