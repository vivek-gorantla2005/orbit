import React, { useState } from 'react'
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import EmojiPicker from 'emoji-picker-react'

const EmojiSection = ({ onClose }) => {
    const [selectedEmoji, setSelectedEmoji] = useState(null)
    const [copied, setCopied] = useState(false)

    const handleEmojiClick = (emoji) => {
        navigator.clipboard.writeText(emoji.emoji)
        setSelectedEmoji(emoji.emoji)
        setCopied(true)

        // Reset copy message after 2 seconds
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <AlertDialog open={true} onOpenChange={onClose}>
            <AlertDialogContent className="w-full">
                <AlertDialogHeader>
                    <AlertDialogTitle>Select an Emoji</AlertDialogTitle>
                    <AlertDialogDescription>Click on an emoji to copy it!</AlertDialogDescription>
                </AlertDialogHeader>

                {/* Emoji Picker */}
                <div className="flex flex-col items-center">
                    <EmojiPicker onEmojiClick={handleEmojiClick} />
                    {copied && (
                        <p className="text-green-600 mt-2">Copied: {selectedEmoji} ✅</p>
                    )}
                </div>

                <AlertDialogFooter>
                    <AlertDialogCancel>Close</AlertDialogCancel>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default EmojiSection
