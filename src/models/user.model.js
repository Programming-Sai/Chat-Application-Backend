import pool from "../lib/db.js";


export const createUserTable = async () => {
    const query = `
    CREATE TABLE IF NOT EXISTS Users(
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email VARCHAR(150) NOT NULL UNIQUE,
        full_name VARCHAR(150) NOT NULL,
        password VARCHAR(150) NOT NULL CHECK (LENGTH(password) >= 6),
        profile_pic TEXT DEFAULT '',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    `

    try{
        await pool.query(query);
        console.log("Users Table Has been Created or Already exists.")
    }catch(error){
        console.error("An error occurred while creating the USERS table:", error);
    }
}


