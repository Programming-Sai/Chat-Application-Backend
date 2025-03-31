import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.route.js';
import messageRoutes from './routes/message.route.js';
import { connectDB } from './lib/db.js';
import cookieParser from 'cookie-parser';
import { app, server } from './lib/socket.js';
import cors from 'cors';


dotenv.config();

app.use(express.json());
app.use(cookieParser());
app.use(
    cors({
        origin: process.env.FRONTEND_BASE_URL,
        credentials: true,
    })
);
app.use('/api/auth', authRoutes);
app.use('/api/message', messageRoutes);



server.listen(process.env.PORT,  ()=>{
    console.log(`Server is Running on ${process.env.PORT}`); 
    connectDB()
});