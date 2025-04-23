import React from 'react'
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import EmojiPicker from 'emoji-picker-react'

const EmojiSection = ({ onClose, onSelectEmoji }) => {
    return (
        <AlertDialog open={true} onOpenChange={onClose}>
            <AlertDialogContent className="w-full">
                <AlertDialogHeader>
                    <AlertDialogTitle>Select an Emoji</AlertDialogTitle>
                    <AlertDialogDescription>Click on an emoji to insert it into the chat!</AlertDialogDescription>
                </AlertDialogHeader>

                {/* Emoji Picker */}
                <div className="flex flex-col items-center">
                    <EmojiPicker onEmojiClick={(emojiObject) => {
                        onSelectEmoji(emojiObject.emoji);
                        onClose();
                    }} />
                </div>

                <AlertDialogFooter>
                    <AlertDialogCancel>Close</AlertDialogCancel>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default EmojiSection
