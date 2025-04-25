import mongoose from "mongoose";
import { Schema } from "mongoose";

const chatSchema = new Schema({
    senderId : {
        type: String,
    },
    receiverId : {
        type: String,
    },
    conversationId : {
        type: String,
    },
    content:{
        type: String,
    },
    analytics:{
        type: Schema.Types.Mixed,
        default: null,
    }
})

const ChatModel = mongoose.models.chat || mongoose.model("chat", chatSchema);