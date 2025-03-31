import { Server } from "socket.io";
import http from 'http';
import express from 'express';

const app = express();
const server = http.createServer(app);
const io = new Server( server, {
    cors:{
        origin: [process.env.FRONTEND_BASE_URL,]
    }
});

const userSocketMap = {};

export const getReceiverSocketId = (userId) => {
    return userSocketMap[userId];
};


io.on("connection", (socket) => {
    console.log("A User is Connecting...");

    const userId = socket.handshake.query.userId;
    if (userId){
        userSocketMap[userId] = socket.id;
    }

    io.emit("getAllOnlineUsers", Object.keys(userSocketMap));
    console.log("A User has Connected: ", socket.id);

    socket.on("disconnect", ()=>{
        console.log("A User Has disconnecting...")
        delete userSocketMap[userId];
        io.emit("getAllOnlineUsers", Object.keys(userSocketMap));
        console.log("A User Has disconnected.", socket.id)
    })
})
export { io, app, server };