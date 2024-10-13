const express = require("express");
const path = require("path");
const mysql = require("mysql");
const dotenv = require("dotenv");
const router = express.Router();

dotenv.config({ path: './.env'});

const db = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
});

db.connect( (error) =>{
    if(error) {
        console.log(error);
    } else {
        console.log("MYSQL Connected...");
    }
});

module.exports = router;