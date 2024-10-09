const express = require('express');
const bcrypt = require('bcrypt');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const dotenv = require('dotenv')

dotenv.config({ path: './.env' })

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// MySQL connection
const db = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
});

db.connect((err) => {
    if (err) throw err;
    console.log('Connected to database');
});

// Registration endpoint
app.post('/auth/register', async (req, res) => {
    const { first_name, last_name, email, password, passwordConfirm } = req.body;

    // Check if passwords match
    if (password !== passwordConfirm) {
        return res.status(401).send('Password does not match');
    }

    try {
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert user into database
        const sql = 'INSERT INTO Users (first_name, last_name, email, password) VALUES (?, ?, ?, ?)';
        db.query(sql, [first_name, last_name, email, hashedPassword], (error, results) => {
            if (error) {
                console.error(error);
                return res.status(500).send('Database error');
            }
            res.status(201).send('User registered successfully');
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }
});


// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});