import pool from "../lib/db.js";


// Initialize database extensions, etc.
export const initializeDB = async () => {
  try {
    // This query creates the pgcrypto extension if it doesn't exist
    await pool.query(`CREATE EXTENSION IF NOT EXISTS pgcrypto;`);
    console.log("pgcrypto extension ensured.");
  } catch (error) {
    console.error("Error initializing database:", error);
  }
};
