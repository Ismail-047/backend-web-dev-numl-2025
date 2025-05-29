import { Notification } from "../models/notification.model.js";

export const getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ to: req.user.id }).sort({ createdAt: -1 });
        res.json({ success: true, notifications });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch notifications",
            error: err.message,
        });
    }
};

export const markAsRead = async (req, res) => {
    try {
        await Notification.findByIdAndUpdate(req.params.id, { isRead: true });
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Failed to update notification",
            error: err.message,
        });
    }
};
