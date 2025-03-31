import { uploadToCloudinary } from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";
import Message from "../models/message.model.js";
import User from "../models/user.model.js";


export const getUserForSidebar = async (req, res) => {
    try{
        const loggedInUserID = req.user._id;
        const loggedInUsersExcceptSelf = await User.find({ _id: { $ne: loggedInUserID }}).select("-password");

        res.status(200).json(loggedInUsersExcceptSelf);
    }catch(error){
        console.log("Error in getUserForSideBar", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


export const getMessages = async (req, res) => {
    try{
        const { id: userToChatId } = req.params;
        const senderId = req.user_id;
        const messages = await Message.find({
            $or:[
                    {senderId: senderId, receiverId: userToChatId},
                    {senderId: userToChatId, receiverId: senderId}
                ],
        });

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
        const senderId = req.user._id;

        let imageUrl;
        if (image){
            const uploadMessageImageResponse = await uploadToCloudinary(image, "messageImages");
            imageUrl = uploadMessageImageResponse.secure_url;
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image: imageUrl
        })

        await newMessage.save()

        // Socket.io funcoinality here.
        const receiverSocketId = getReceiverSocketId(receiverId);
        if (receiverSocketId){
            io.to(receiverId).emit("newMessage", newMessage);
        }

        res.status(201).json(newMessage);

    }catch(error){
        console.log("Error in sendMessages", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};