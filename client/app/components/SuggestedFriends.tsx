import * as React from "react";
import { Card } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

export function SuggestedFriends() {
  const suggestedFriends = [
    { id: 1, name: "vivek_g", role: "Coder", img: "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp", progress: 80 },
    { id: 2, name: "alex_dev", role: "Tech Enthusiast", img: "https://randomuser.me/api/portraits/men/32.jpg", progress: 60 },
    { id: 3, name: "sophia_ai", role: "AI Researcher", img: "https://randomuser.me/api/portraits/women/44.jpg", progress: 75 },
    { id: 4, name: "john_d", role: "Open Source Contributor", img: "https://randomuser.me/api/portraits/men/50.jpg", progress: 50 },
    { id: 5, name: "lina_ml", role: "Machine Learning Enthusiast", img: "https://randomuser.me/api/portraits/women/55.jpg", progress: 90 },
  ];

  return (
    <div className="relative flex w-[50vw] mt-2">
      <Carousel opts={{ align: "start" }} className="w-[50vw]">
        <CarouselContent className="gap-x-1"> {/* Reduced gap here */}
          {suggestedFriends.map((friend) => (
            <CarouselItem key={friend.id} className="md:basis-1/3 lg:basis-1/4"> {/* Adjust size */}
              <Card className="shadow-md rounded-lg flex flex-col items-center p-3 w-40 h-52 border-gray-400">
                {/* Profile Image */}
                <div className="relative w-14 h-14">
                  <img
                    src={friend.img}
                    alt={friend.name}
                    className="w-14 h-14 rounded-full border-2 border-gray-300 object-cover"
                  />
                </div>

                {/* Progress Bar */}
                <div className="w-full mt-1">
                  <Progress value={friend.progress} className="h-1.5 bg-gray-200 rounded-full" />
                  <p className="text-xs text-gray-500 mt-1 text-center">{friend.progress}% alike</p>
                </div>

                {/* Username & Role */}
                <div className="text-center mt-1">
                  <p className="text-sm font-semibold text-gray-800">{friend.name}</p>
                  <p className="text-xs text-gray-500">{friend.role}</p>
                </div>

                {/* Add Friend Button */}
                <Button className="mt-2 bg-purple-700 text-white px-3 py-1 text-sm rounded-md hover:bg-purple-900 transition">
                  Add Friend
                </Button>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Carousel Navigation Buttons */}
        <CarouselPrevious className="absolute left-0 z-10 bg-white p-2 rounded-full shadow-md" />
        <CarouselNext className="absolute right-0 z-10 bg-white p-2 rounded-full shadow-md" />
      </Carousel>
    </div>
  );
}
