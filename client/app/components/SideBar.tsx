import React from 'react';
import Link from 'next/link';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const SideBar = ({ notifications }) => {
  return (
    <div className="flex flex-col justify-between h-[82vh] w-16 text-white rounded-xl p-3 shadow-md">
      {/* Top Icons */}
      <div className="flex flex-col gap-5 items-center">
        <img src="home.svg" alt="home" className="w-10 h-10 filter invert-[20%] brightness-0 saturate-0"
        />
        <Link href={'/conversations'}><img src="chat.svg" alt="Chat" className="w-10 h-10 filter invert-[20%] brightness-0 saturate-0"
 /></Link>
        <Link href={'/addfriend'}><img src="Add Friend.png" alt="add friend" className="w-10 h-10 filter invert-[20%] brightness-0 saturate-0"
        /></Link>
      </div>

      {/* Bottom Icons */}
      <div className="flex flex-col gap-5 items-center">
        <AlertDialog>
          <AlertDialogTrigger asChild>
           <img src="bell.svg" alt="bell" className="w-10 h-10 filter invert-[20%] brightness-0 saturate-0 cursor-pointer"
 />
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Notifications</AlertDialogTitle>
            </AlertDialogHeader>
            <div className="max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-gray-200 p-2">
              {notifications.length > 0 ? (
                notifications.map((notification, index) => (
                  <div key={index} className="border-b py-2">
                    {/* <p><strong>Type:</strong> {notification.type}</p> */}
                    <p><strong>Message:</strong> {notification.content}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No new notifications</p>
              )}
            </div>
            <AlertDialogAction>Close</AlertDialogAction>
          </AlertDialogContent>
        </AlertDialog>

        <Link href={'/profile'}><img src="profile.svg" alt="Chat" className="w-10 h-10 filter invert-[20%] brightness-0 saturate-0"
 /></Link>
        <img src="settings.svg" alt="settings" className="w-10 h-10 filter invert-[20%] brightness-0 saturate-0"
 />
      </div>
    </div>
  );
};

export default SideBar;
