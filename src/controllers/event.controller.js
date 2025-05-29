import { Event } from "../models/event.model.js";
import cloudinary from "../lib/cloudinary.js";
import { deleteUploadedFiles } from "../utils/auth.utils.js";
import { sendRes, logError } from "../utils/comman.utils.js";
import { User } from "../models/user.model.js";

export const addNewEvent = async (req, res) => {
    try {
        const {
            title,
            description,
            department,
            category,
            date,
            startTime,
            endTime,
            address,
            latitude,
            longitude,
            mapEmbedUrl,
            tags,
            isOnline
        } = req.body;

        const { userId } = req.user;
        const existingUser = await User.findOne({ _id: userId });
        if (!existingUser) return sendRes(res, 400, "User not found.");

        let images = [];
        if (req.files && req.files.length > 0) {
            const imageUploadPromises = req.files.map(file =>
                cloudinary.uploader.upload(file.path)
            );

            const uploadedImages = await Promise.all(imageUploadPromises);
            images = uploadedImages.map(img => img.secure_url);
            deleteUploadedFiles(req.files);
        }

        const newEvent = await Event.create({
            title,
            description,
            department,
            category,
            date,
            startTime,
            endTime,
            address,
            latitude,
            longitude,
            mapEmbedUrl,
            tags: tags?.split(',') || [],
            isOnline: isOnline === "true",
            images,
            createdBy: {
                organizerId: existingUser._id,
                name: existingUser.name,
                email: existingUser.email
            }
        });

        if (!newEvent) return sendRes(res, 500, "Error creating event.");

        return sendRes(res, 200, "Event created successfully.");
    }
    catch (error) {
        deleteUploadedFiles(req.files);
        logError("addNewEvent (event controllers)", error);
        return sendRes(res, 500, "Something went wrong on our side. Please try again.");
    }
};


export const getMyEvents = async (req, res) => {
    try {
        const { userId } = req.user;

        console.log(userId);
        const events = await Event.find({ "createdBy.organizerId": userId }).sort({ createdAt: -1 });

        if (!events || events.length === 0) {
            return sendRes(res, 404, "No events found for this user.");
        }

        return sendRes(res, 200, "User events fetched successfully.", events);
    }
    catch (error) {
        logError("getMyEvents (event controllers)", error);
        return sendRes(res, 500, "Something went wrong on our side. Please try again.");
    }
};


export const getAllEvents = async (req, res) => {
    try {
        const events = await Event.find({}).sort({ createdAt: -1 });

        return sendRes(res, 200, "All events fetched successfully.", events);
    }
    catch (error) {
        logError("getAllEvents (event controllers)", error);
        return sendRes(res, 500, "Something went wrong on our side. Please! try again.");
    }
}

export const searchEvents = async (req, res) => {
    try {
        const { searchQuery } = req.body;

        const results = await Event.aggregate([
            {
                $match: {
                    title: { $regex: searchQuery, $options: "i" }
                }
            },
            {
                $addFields: {
                    priority: {
                        $cond: {
                            if: { $regexMatch: { input: "$title", regex: `^${searchQuery}`, options: "i" } },
                            then: 0,
                            else: 1
                        }
                    }
                }
            },
            {
                $sort: {
                    priority: 1,
                    title: 1
                }
            },
            {
                $project: {
                    _id: 1,
                    title: 1,
                    date: 1,
                    category: 1,
                    department: 1,
                    images: 1,
                    location: 1,
                    createdBy: 1
                }
            }
        ]);

        return sendRes(res, 200, "Search results", results);
    }
    catch (error) {
        logError("searchEvents", error);
        return sendRes(res, 500, "Something went wrong on our side. Please try again later.");
    }
};

export const registerForEvent = async (req, res) => {
    try {
        const { eventId } = req.params;
        const { userId } = req.user;

        const event = await Event.findById(eventId);
        if (!event) return sendRes(res, 404, "Event not found.");

        const user = await User.findById(userId);
        if (!user) return sendRes(res, 404, "User not found.");

        // Check if user is already registered
        const isAlreadyRegistered = event.rsvps.some(rsvp => rsvp.userId.toString() === userId);
        if (isAlreadyRegistered) {
            return sendRes(res, 400, "You are already registered for this event.");
        }

        // Add new RSVP
        event.rsvps.push({
            userId: user._id,
            name: user.name,
            email: user.email,
            registeredAt: new Date()
        });

        await event.save();
        return sendRes(res, 200, "Event registered successfully.");
    }
    catch (error) {
        logError("registerForEvent (event controllers)", error);
        return sendRes(res, 500, "Something went wrong on our side. Please try again later.");
    }
}

export const unregisterForEvent = async (req, res) => {
    try {
        const { eventId } = req.params;
        const { userId } = req.user;

        const event = await Event.findById(eventId);
        if (!event) return sendRes(res, 404, "Event not found.");

        // Remove RSVP
        event.rsvps = event.rsvps.filter(rsvp => rsvp.userId.toString() !== userId);
        await event.save();
        return sendRes(res, 200, "Event unregistered successfully.");

    }
    catch (error) {
        logError("unregisterForEvent (event controllers)", error);
        return sendRes(res, 500, "Something went wrong on our side. Please try again later.");
    }
}

export const getRegisteredEvents = async (req, res) => {
    try {
        const { userId } = req.user;

        const events = await Event.find({ "rsvps.userId": userId }).sort({ createdAt: -1 });

        return sendRes(res, 200, "Registered events fetched successfully.", events);
    }
    catch (error) {
        logError("getRegisteredEvents (event controllers)", error);
        return sendRes(res, 500, "Something went wrong on our side. Please try again later.");
    }
}

export const getEventDetails = async (req, res) => {
    try {
        const { eventId } = req.params;
        const event = await Event.findById(eventId);
        return sendRes(res, 200, "Event details fetched successfully.", event);
    }
    catch (error) {
        logError("getEventDetails (event controllers)", error);
        return sendRes(res, 500, "Something went wrong on our side. Please try again later.");
    }
}

