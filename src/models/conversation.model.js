import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema({
    participants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    messages: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message",
        default: []
    }],
    lastMessageAt: {
        type: Date,
    },
    lastMessageContent: {
        type: String,
        default: ""
    },
}, { timestamps: true });

export const Conversation = mongoose.model("Conversation", conversationSchema);