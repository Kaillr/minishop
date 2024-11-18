import mysql from 'mysql2';
import dotenv from 'dotenv';

// Load environment variables from the .env file
dotenv.config({ path: '../../.env' });

const db = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
});

db.connect((error) => {
    if (error) {
        console.error("Database connection failed: ", error);
        return;
    }
    console.log("MYSQL Connected...");
});

export default db;