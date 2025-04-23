'use client'
import React, { useState, useCallback } from "react";
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
import { Sparkles, UploadCloud } from "lucide-react";
import { useDropzone } from 'react-dropzone';

const RightSideBar = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [postText, setPostText] = useState("");

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setSelectedFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: "image/*"
  });

  return (
    <div className="w-80 bg-white dark:bg-gray-900 shadow-lg rounded-xl p-6 h-screen overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 relative transition-all">
      {/* Trending Topics Section */}
      <div className="mb-6">
        <h3 className="text-xl font-bold flex items-center text-gray-800 dark:text-gray-200 mb-4">
          <span className="font-extrabold text-5xl text-gray-800">Trending Topics</span>
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

      {/* Create Post Section */}
      <div className="mt-8">
        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">
          <span className="font-extrabold text-2xl text-gray-800">Create a Post</span>
        </h3>
        <div className="w-full">
          <AlertDialog>
            <AlertDialogTrigger className="items-center justify-center w-full bg-gray-800 font-bold text-white py-3 mt-2 rounded-lg shadow-md hover:scale-105 transition-all duration-300">
              Write Something...
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-white dark:bg-gray-800 p-6">
              <AlertDialogHeader>
                <AlertDialogTitle>
                  <span className="font-bold">Start Creating a Post</span>
                </AlertDialogTitle>
                <AlertDialogDescription>
                  <span className="font-bold text-xl">Title</span>
                <input type="text" className="mb-4 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 dark:bg-gray-700 dark:text-white" placeholder="Enter title of the post!!" />
                <span className="font-bold text-xl">Enter description  </span>
                  <textarea
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 dark:bg-gray-700 dark:text-white"
                    rows="4"
                    placeholder="Write your post here..."
                    value={postText}
                    onChange={(e) => setPostText(e.target.value)}
                  ></textarea>
                  
                  <div {...getRootProps()} className="border-2 border-dashed border-gray-400 p-6 text-center rounded-lg cursor-pointer hover:bg-gray-100 mt-4">
                    <input {...getInputProps()} />
                    <UploadCloud size={40} className="mx-auto text-gray-500" />
                    <span className="mt-2 text-gray-600">Drag & drop an image here, or click to select</span>
                    {selectedFile && <span className="text-sm mt-2 text-gray-700">Selected: {selectedFile.name}</span>}
                  </div>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction className="bg-gray-800 hover:bg-gray-900 text-white">
                  Post
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
