import pool from "../lib/db.js";

export const createMessageTable = async () => {
    try{
        const query = `
            CREATE TABLE IF NOT EXISTS Messages (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                sender_id UUID NOT NULL REFERENCES Users(id) ON DELETE CASCADE,
                receiver_id UUID NOT NULL REFERENCES Users(id) ON DELETE CASCADE,
                text TEXT,
                image TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `;

        await pool.query(query);
        console.log("Messages Table Has been Created or Already exists.")
    }catch (error){
        console.error("An Error Occured Creating the MESSAGES Table:", error)
    }
} 