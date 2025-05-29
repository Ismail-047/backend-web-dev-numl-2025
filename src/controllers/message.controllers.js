import { Conversation } from "../models/conversation.model.js";
import { Message } from "../models/message.model.js";
import { getUserSocketId, io } from "../socket.io/socket.js";
import { logError } from "../utils/comman.utils.js";
import { sendRes } from "../utils/responseHelper.js";

export const sendMessage = async (req, res) => {
    try {
        const loggedInUser = req.user
        const { recieverId, chatMessage } = req.body;

        // Create a new Message
        const message = await Message.create({
            senderId: loggedInUser._id,
            recieverId,
            chatMessage,
        });

        const recieverSocketId = getUserSocketId(recieverId);
        const senderSocketId = getUserSocketId(loggedInUser._id);

        if (recieverSocketId) io.to(recieverSocketId).emit("newMessage", message);
        if (senderSocketId) io.to(senderSocketId).emit("newMessage", message);


        // Find the conversation between the two chatting users
        let conversation = await Conversation.findOne({ participants: { $all: [loggedInUser._id, recieverId] } });

        if (!conversation) {
            // If no conversation exists, create a new one
            conversation = new Conversation({
                participants: [loggedInUser._id, recieverId],
                messages: [message._id],
                lastMessageAt: message.createdAt,
                lastMessageContent: message.chatMessage,
            });
        } else {
            // If conversation exists, add the new message to the conversation
            conversation.messages.push(message._id);

            // Update the `lastMessageAt` and `lastMessageContent` to reflect the new message
            conversation.lastMessageAt = message.createdAt;
            conversation.lastMessageContent = message.chatMessage;
        }
        await conversation.save();

        return sendRes(res, 200, "Message sent successfully.", message);
    }
    catch (error) {
        logError("sendMessage", error);
        return sendRes(res, 500, "Internal Server Error.")
    }
}

export const getChatBetweenUsers = async (req, res) => {
    try {
        const { _id: loggedInUser } = req.user;
        const { id: otherUserId } = req.params;

        if (!otherUserId) return sendRes(res, 422, "User Id is required.");

        // Find the conversation between the two users
        let conversation = await Conversation.findOne({
            participants: { $all: [loggedInUser, otherUserId] }
        });

        if (!conversation) return sendRes(res, 200, "Chats are empty.", []);

        // Fetch messages of the conversation & sort by oldest first
        const messages = await Message.find({
            _id: { $in: conversation.messages }
        }).sort({ createdAt: 1 });

        return sendRes(res, 200, "Chat messages fetched successfully.", messages);
    }
    catch (error) {
        logError("getChatBetweenUsers", error);
        return sendRes(res, 500, "Internal Server Error.")
    }
}

export const deleteAllMessages = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;
        await Promise.all([
            Message.deleteMany({ $or: [{ senderId: loggedInUserId }, { recieverId: loggedInUserId }] }),
            Conversation.updateMany({ participants: loggedInUserId }, { $set: { messages: [], lastMessageAt: null, lastMessageContent: "" } })
        ]);

        return sendRes(res, 200, "All messages deleted successfully.");
    } catch (error) {
        logError("deleteAllMessages", error);
        return sendRes(res, 500, "Internal Server Error.");
    }
}

export const deleteAllChats = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;
        await Promise.all([
            Message.deleteMany({ $or: [{ senderId: loggedInUserId }, { recieverId: loggedInUserId }] }),
            Conversation.deleteMany({ participants: loggedInUserId })
        ]);

        return sendRes(res, 200, "All chats and messages deleted successfully.");
    } catch (error) {
        logError("deleteAllChats", error);
        return sendRes(res, 500, "Internal Server Error.");
    }
}

export const createConversation = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;
        const { id: userToChatId } = req.params;

        if (!userToChatId) sendRes(res, 500, "Other participant id is required while creating a conversation.");

        await Conversation.create({
            participants: [loggedInUserId, userToChatId],
            messages: [],
        })

        return sendRes(res, 200, "New conversation created successfully.");
    }
    catch (error) {
        logError("createConversation", error);
        return sendRes(res, 500, "Internal Server Error.")
    }
}