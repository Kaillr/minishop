const bcrypt = require('bcrypt');
const db = require('../config/db');

const registerUser = async (req, res) => {
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
        const [results] = await db.promise().query(sql, [first_name, last_name, email, hashedPassword]); // Using promise-based approach
        
        res.status(201).send('User registered successfully');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }
};

module.exports = { registerUser };
