const mysql = require("mysql");
const dotenv = require("dotenv");

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

module.exports = db;
