const express = require("express");
const router = express.Router();
const db = require("../db/db");
const bcrypt = require("bcrypt");

// Route for the login page
router.get("/", (req, res) => {
    res.render("login", {
        title: "Login - Minishop",
    });
});

// Handle form submission of login form
router.post("/", async (req, res) => {
    const { email, password } = req.body;

    try {
        // Query the database for the user by email
        const [rows] = await db.promise().query("SELECT * FROM users WHERE email = ?", [email]);
        
        if (rows.length > 0) {
            const user = rows[0];

            // Compare the entered password with the hashed password in the database
            const match = await bcrypt.compare(password, user.password);
            if (match) {
                req.session.userId = user.user_id;
                res.status(200).json({ message: "User logged in successfully!", });
            } else {
                // Password did not match
                return res.status(400).json({ error: "Password did not match." });
            }
        } else {
            // No user found with that email
            return res.status(400).json({ error: "Email not found" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "An error occurred while logging in." });
    }
});

module.exports = router;
