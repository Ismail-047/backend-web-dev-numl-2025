import http from "http";
import express from "express";
import { Server } from "socket.io";
import { User } from "../models/user.model.js";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: { origin: ["http://localhost:5173", "http://192.168.18.14:5173"] }
});

const userSocketMap = {};

const usersLastSeen = {};

io.on("connection", (socket) => {
    console.log("User Connected: " + socket.id);

    const { userId } = socket.handshake.query;

    if (userId) userSocketMap[userId] = socket.id;

    // emit userId's of all connected users
    io.emit("onlineUsers", Object.keys(userSocketMap));


    socket.on("disconnect", async () => {
        console.log("User Disconnected: " + socket.id);
        delete userSocketMap[userId];

        usersLastSeen[userId] = socket.id;
        io.emit("updateUserLastSeen", { userId, userLastSeen: Date.now() });

        io.emit("onlineUsers", Object.keys(userSocketMap));

        await User.findByIdAndUpdate(userId, {
            userLastSeen: Date.now()
        });
    });
});

const getUserSocketId = (userId) => {
    return userSocketMap[userId];
}

export { app, io, server, getUserSocketId };