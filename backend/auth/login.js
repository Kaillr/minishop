const express = require('express');
const bcrypt = require('bcrypt');
const db = require('../config/db');

const router = express.Router();

// Login endpoint
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find user in the database
        const sql = 'SELECT * FROM Users WHERE email = ?';
        db.query(sql, [email], async (error, results) => {
            if (error) {
                console.error('Database error:', error);
                return res.status(500).send('Database error');
            }

            if (results.length === 0) {
                return res.status(401).send('User not found');
            }

            const user = results[0];

            // Compare passwords
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(401).send('Invalid password');
            }

            // Set a cookie (you can adjust options as needed)
            res.cookie('userId', user.user_id, { httpOnly: true, secure: true }); // Use secure: true in production
            
            // Redirect to the minishop domain
            return res.redirect('https://minishop.mikaelho.land');
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).send('Internal server error');
    }
});

module.exports = router;
