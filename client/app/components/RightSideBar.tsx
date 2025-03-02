import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Sparkles, Edit, TrendingUp } from "lucide-react";

const RightSideBar = () => {
  return (
    <div className="w-80 bg-white dark:bg-gray-900 shadow-lg rounded-xl p-6 h-screen overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 relative transition-all">
      {/* Trending Topics Section */}
      <div className="mb-6">
        <h3 className="text-xl font-bold flex items-center text-gray-800 dark:text-gray-200 mb-4">

          <p className="font-extrabold text-5xl text-gray-800">Trending Topics</p>
        </h3>
        <ul className="space-y-3">
          {["#NextJS", "#AI", "#WebDevelopment", "#MachineLearning", "#SystemDesign"].map(
            (topic, index) => (
              <li
                key={index}
                className="cursor-pointer px-4 py-2 rounded-lg transition-all duration-300 text-gray-700 font-bold dark:text-gray-300 hover:bg-gray-700 hover:text-white flex items-center"
              >
                <Sparkles className="w-4 h-4 text-yellow-400 mr-2" />
                {topic}
              </li>
            )
          )}
        </ul>
      </div>

      {/* Create a Post Section */}
      <div className="mt-8">
        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2 flex items-center">
        <p className= "font-extrabold text-2xl text-gray-800">Create a Post.........</p>
        </h3>
        <div className="w-full">
          <AlertDialog>
            <AlertDialogTrigger className="w-full bg-gray-800 font-bold text-white py-3 mt-2 rounded-lg shadow-md hover:scale-105 transition-all duration-300">
              Write Something...
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-white dark:bg-gray-800">
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. Your post will be published publicly.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction className="bg-blue-500 hover:bg-blue-600 text-white">
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
};

export default RightSideBar;
