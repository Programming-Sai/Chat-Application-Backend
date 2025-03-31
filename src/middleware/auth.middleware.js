import  jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protectedRoute= async (req, res, next) => {
    try {
        console.log("Incoming Cookies:", req.cookies);
        console.log("Extracted Token:", req.cookies.jwt);
        const token = req.cookies.jwt;

        if (!token) {
            return res.status(400).json({ message: "Unauthorised - No Token Provided"});
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded){
            return res.status(401).json({ message: "Unauthorised - Invalid Token"});
        }

        const user = await User.findById(decoded.userId).select("-password");

        if (!user){
            return res.status(404).json({ message: "User Not Found"});
        }

        req.user = user

        next()
    }catch(error){
        console.log("Error in protectedRoute middleware", error.message);
        res.status(500).json({message: "Internal Server Error."})
    }
}