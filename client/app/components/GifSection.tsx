import React, { useState, useEffect, useCallback } from 'react'
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Grid } from '@giphy/react-components'
import { GiphyFetch } from '@giphy/js-fetch-api'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

// Initialize GiphyFetch
const gf = new GiphyFetch(process.env.NEXT_PUBLIC_GIPHY_API_KEY as string)

// Categories
const categories = ["Trending", "Happy", "Sad", "Angry", "Excited", "Funny"]

const GifSection = ({ onClose, onGifSelect }) => {
    const [selectedCategory, setSelectedCategory] = useState("Trending")
    const [searchTerm, setSearchTerm] = useState("")
    const [loading, setLoading] = useState(false)

    const fetchGifs = useCallback(
        async (offset: number) => {
            setLoading(true)
            try {
                let result
                if (searchTerm) {
                    result = await gf.search(searchTerm, { offset, limit: 10 })
                } else if (selectedCategory === "Trending") {
                    result = await gf.trending({ offset, limit: 10 })
                } else {
                    result = await gf.search(selectedCategory, { offset, limit: 10 })
                }
                return result
            } catch (error) {
                console.error("Error fetching GIFs:", error)
                return { data: [] }
            } finally {
                setLoading(false)
            }
        },
        [selectedCategory, searchTerm]
    )

    return (
        <AlertDialog open={true} onOpenChange={onClose}>
            <AlertDialogContent className="w-full max-w-3xl h-[95vh]">
                <AlertDialogHeader>
                    <AlertDialogTitle>Select a GIF</AlertDialogTitle>
                    <AlertDialogDescription>Choose a GIF based on your mood or search for one!</AlertDialogDescription>
                </AlertDialogHeader>

                {/* Search Bar */}
                <div className="flex gap-2">
                    <Input
                        type="text"
                        placeholder="Search for a GIF..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="flex-1"
                    />
                    <Button onClick={() => setSearchTerm("")} variant="outline">
                        Clear
                    </Button>
                </div>

                {/* Category Selection */}
                <div className="flex flex-wrap gap-2 justify-center mt-3">
                    {categories.map((category) => (
                        <Button
                            key={category}
                            onClick={() => {
                                setSelectedCategory(category)
                                setSearchTerm("")
                            }}
                            variant={selectedCategory === category ? "default" : "outline"}
                            className="px-3 py-1"
                        >
                            {category}
                        </Button>
                    ))}
                </div>

                {/* GIF Grid */}
                <div className="overflow-auto max-h-[400px] min-h-[270px] flex justify-center items-center mt-4">
                    {loading ? (
                        <div className="flex justify-center items-center min-h-[270px]">
                            <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
                        </div>
                    ) : (
                        <Grid
                        key={searchTerm || selectedCategory}
                        width={690}
                        columns={3}
                        fetchGifs={fetchGifs}
                        onGifClick={(gif) => {
                            onGifSelect(gif.images.original.url); // Now correctly sends GIF URL to `ChatSection`
                            onClose();
                        }}
                    />
                    
                    )}
                </div>

                <AlertDialogFooter>
                    <AlertDialogCancel>Close</AlertDialogCancel>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default GifSection
