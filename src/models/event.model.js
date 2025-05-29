import mongoose from "mongoose";

const EventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    date: {
        type: Date,
        required: true
    },
    startTime: {
        type: String,
        required: true
    },
    endTime: {
        type: String
    },
    location: {
        address: { type: String },
        latitude: { type: Number },
        longitude: { type: Number }
    },
    department: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    tags: [String],
    images: [String],
    createdBy: {
        organizerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        name: String,
        email: String
    },
    rsvps: [
        {
            userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            name: String,
            email: String,
            registeredAt: { type: Date, default: Date.now }
        }
    ],
    chatRoomId: {
        type: String
    },
    isOnline: {
        type: Boolean,
        default: false
    },
    mapEmbedUrl: {
        type:
            String
    },
}, { timestamps: true });


export const Event = mongoose.model("Event", EventSchema);
