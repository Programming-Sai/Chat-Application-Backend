import mongoose from "mongoose";
 
export const connectDB = async () => {
    try {
        const connection = await mongoose.connect(process.env.MONGO_DB_URL);
        console.log("MongoDB Connected: ", connection.connection.host);
    } catch (error) {
        console.log("MongoDB Connection Error: ", error);
    }
};
