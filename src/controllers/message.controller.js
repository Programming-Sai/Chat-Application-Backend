import { uploadToCloudinary } from "../lib/cloudinary.js";
import pool from "../lib/db.js";
import { getReceiverSocketId, io } from "../lib/socket.js";


export const getUserForSidebar = async (req, res) => {
    try{
        const loggedInUserID = req.user.id;
        const query = `
            SELECT id, full_name, email, profile_pic 
            FROM Users 
            WHERE id != $1
        `;
        const { rows: users } = await pool.query(query, [loggedInUserID]);
        res.status(200).json(users);
    }catch(error){
        console.log("Error in getUserForSideBar", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


export const getMessages = async (req, res) => {
    try{
        const { id: userToChatId } = req.params;
        const senderId = req.user.id;  // use req.user.id as set by your middleware
        const query = `
            SELECT * FROM Messages
            WHERE (sender_id = $1 AND receiver_id = $2)
               OR (sender_id = $2 AND receiver_id = $1)
            ORDER BY created_at ASC;
        `;
        const { rows: messages } = await pool.query(query, [senderId, userToChatId]);
        res.status(200).json(messages);
    }catch(error){
        console.log("Error in getMEssages", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}


export const sendMessages = async (req, res) => {
    try{
        const{ text, image } = req.body;
        const { id: receiverId } = req.params;
        const senderId = req.user.id;

        let imageUrl;
        if (image){
            const uploadMessageImageResponse = await uploadToCloudinary(image, "messageImages");
            imageUrl = uploadMessageImageResponse.secure_url;
        }

        const insertQuery = `
            INSERT INTO Messages (sender_id, receiver_id, text, image)
            VALUES ($1, $2, $3, $4)
            RETURNING *;
        `;
        const { rows } = await pool.query(insertQuery, [senderId, receiverId, text, imageUrl]);
        const newMessage = rows[0];

        // Socket.io functionality: send message to receiver if connected
        const receiverSocketId = getReceiverSocketId(receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }
        res.status(201).json(newMessage);

    }catch(error){
        console.log("Error in sendMessages", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};