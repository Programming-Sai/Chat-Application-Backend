import pkg from 'pg';
const { Pool } = pkg;


const pool = new Pool({
    connectionString: process.env.POSTGRES_DB_URL,
    ssl:{
        rejectUnauthorized: false,
    },
});


export const connectDB = async () => {
    try{
        const client = await pool.connect();
        console.log("Postgres Connected");
        client.release();
    }catch(error){
        console.log("Postgres Connection Error: ", error)
    }
}

export default pool;