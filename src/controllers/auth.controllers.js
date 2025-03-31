import bcrypt from "bcryptjs";
import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import { cloudinary, uploadToCloudinary } from "../lib/cloudinary.js";



export const signup = async (req, res)=>{
    const { fullName, email, password } = req.body;
    try{
        if (!fullName || !email || !password){
            return res.status(400).json({ message: "Please All fields are reqiured."});
        }

        if (password.length < 6){
            return res.status(400).json({ message: "Password must be at least 6 characters long."});
        }

        const user = await User.findOne({email});
        if (user) {
            return res.status(400).json({ message: "Email Already exists"});
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            fullName,
            email, 
            password: hashedPassword,
        })

        if (newUser){
            generateToken(newUser._id, res);
            await newUser.save();

            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                profilePic: newUser.profilePic,
            })
        }else{
            res.status(400).json({ message: "Invalid User Data"});
        }
    }catch(error){
        console.log("Error in signup controller", error.message);
        res.status(500).json({message: "Internal Server Error."})
    }
};


export const signin = async (req, res)=>{
    const { email, password } = req.body;
    try{
        const user = await User.findOne({ email });
        if (!user){
            return res.status(400).json({ message: "Invalid Credential provided."});
        }
        const isPasswordSame = await bcrypt.compare(password, user.password);

        if (!isPasswordSame){
            return res.status(400).json({ message: "Invalid Credential provided."});
        }

        generateToken(user._id, res);
        res.status(201).json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            profilePic: user.profilePic,
        })
    }catch(error){
        console.log("Error in signin controller", error.message);
        res.status(500).json({message: "Internal Server Error."})
    }
};


export const signout = (req, res)=>{
   try{
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged Out Successfully"});
    }catch(error){
        console.log("Error in signout controller", error.message);
        res.status(500).json({message: "Internal Server Error."})
    }
};


export const updateProfilePic = async (req, res) =>{
    try{
        const { profilePic } = req.body;
        const userId = req.user._id;

        if (!profilePic){
            return res.status(400).json({ message: "ProfilePic is Required"});
        }

        const uploadProfilePicResponse = await uploadToCloudinary(profilePic, "profilePics");
        const updatedUser = await User.findByIdAndUpdate(userId, { profilePic: uploadProfilePicResponse.secure_url}, { new: true });
        res.status(200).json(updatedUser);
        
    }catch(error){
        console.log("Error in updateProfilePic controller", error.message);
        res.status(500).json({message: "Internal Server Error."})
    }
};

export const checkAuth = async (req, res) => {
    try{
        res.status(200).json(req.user);
    }catch(error){
        console.log("Error in checkAuth controller", error.message);
        res.status(500).json({message: "Internal Server Error."})
    }
}