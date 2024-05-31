import express from "express";
import http from "http";
import { Server } from "socket.io";
import { markMessagesAsSeen } from "../controllers/messageController.js";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
    },
});

const userSocketMap = {};

const getRecipientSocketId = (recipientId) => {
  return userSocketMap[recipientId];
};

io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;
    if(userId != "undefined"){
        userSocketMap[userId] = socket.id;
    }

    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("markMessagesAsSeen", ({conversationId, userId}) => {
        markMessagesAsSeen(conversationId, userId);
        io.to(userSocketMap[userId]).emit("messagesSeen", {conversationId});
    });
    socket.on("disconnect", () => {
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
});

export { app, getRecipientSocketId, io, server };

