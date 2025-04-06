import bcrypt from "bcryptjs";
import { generateToken } from "../lib/utils.js";
import pool from "../lib/db.js";
import { uploadToCloudinary } from "../lib/cloudinary.js";



export const signup = async (req, res)=>{
    const { fullName, email, password } = req.body;
    try{
        if (!fullName || !email || !password){
            return res.status(400).json({ message: "Please All fields are reqiured."});
        }

        if (password.length < 6){
            return res.status(400).json({ message: "Password must be at least 6 characters long."});
        }

         // Check if the user exists using SQL
         const { rows } = await pool.query("SELECT * FROM Users WHERE email = $1", [email]);
         const user = rows[0];
         if (user) {
             return res.status(400).json({ message: "Email Already exists" });
         }
 
         const salt = await bcrypt.genSalt(10);
         const hashedPassword = await bcrypt.hash(password, salt);
 
         // Insert new user into the database
         const insertQuery = `
             INSERT INTO Users (full_name, email, password)
             VALUES ($1, $2, $3)
             RETURNING *;
         `;
         const result = await pool.query(insertQuery, [fullName, email, hashedPassword]);
         const newUser = result.rows[0];

       // Generate token (pass newUser.id)
        generateToken(newUser.id, res);

        res.status(201).json({
            _id: newUser.id,
            fullName: newUser.full_name,
            email: newUser.email,
            profilePic: newUser.profile_pic,
        });
    }catch(error){
        console.log("Error in signup controller", error.message);
        res.status(500).json({message: "Internal Server Error."})
    }
};


export const signin = async (req, res)=>{
    const { email, password } = req.body;
    try{
        // Query the user from PostgreSQL
        const { rows } = await pool.query("SELECT * FROM Users WHERE email = $1", [email]);
        const user = rows[0];
        if (!user) {
            return res.status(400).json({ message: "Invalid Credential provided."});
        }
        const isPasswordSame = await bcrypt.compare(password, user.password);

        if (!isPasswordSame){
            return res.status(400).json({ message: "Invalid Credential provided."});
        }

        const token = generateToken(user.id, res);
        const responsePayload = {
            _id: user.id,
            fullName: user.full_name,
            email: user.email,
            profilePic: user.profile_pic,
        };
        
        if (process.env.MODE === 'development') {
            responsePayload.token = token;
        }
        
        res.status(201).json(responsePayload);
        
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
        const userId = req.user.id;

        if (!profilePic){
            return res.status(400).json({ message: "ProfilePic is Required"});
        }

        const uploadProfilePicResponse = await uploadToCloudinary(profilePic, "profilePics");
        // Use an UPDATE query to update the profile picture
        const updateQuery = `
            UPDATE Users 
            SET profile_pic = $1, updated_at = CURRENT_TIMESTAMP 
            WHERE id = $2 
            RETURNING *;
        `;
        const { rows } = await pool.query(updateQuery, [uploadProfilePicResponse.secure_url, userId]);
        const updatedUser = rows[0];  
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