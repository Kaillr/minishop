const express = require('express');
const bcrypt = require('bcrypt');
const mysql = require('mysql');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// MySQL connection
const db = mysql.createConnection({
    ***REMOVED***
    ***REMOVED***
    ***REMOVED***
    ***REMOVED***
});

db.connect((err) => {
    if (err) throw err;
    console.log('Connected to database');
});

// Registration endpoint
app.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user into database
    const sql = 'INSERT INTO Users (name, email, password) VALUES (?, ?, ?)';
    db.query(sql, [name, email, hashedPassword], (error, results) => {
        if (error) {
            console.error(error);
            return res.status(500).send('Database error');
        }
        res.status(201).send('User registered successfully');
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});