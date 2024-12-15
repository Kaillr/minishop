const mysql = require("mysql2");
const dotenv = require("dotenv");

dotenv.config({ path: '../../.env' });

const pool = mysql.createPool({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

pool.getConnection((err, connection) => {
    if (err) {
        console.error("Error connecting to the database:", err);
        return;
    }
    console.log("Database connection successful.");
    connection.release(); // Return the connection to the pool
});

const db = pool.promise();

module.exports = db;
