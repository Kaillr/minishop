const express = require("express");
const router = express.Router();
const db = require("../db/db");
const bcrypt = require("bcrypt");

// Route for the registration page (GET)
router.get("/", (req, res) => {
    res.render("register", {
        title: "Register - Minishop",
    });
});

// Route for handling form submission (POST)
router.post("/", async (req, res) => {
    const { first_name, last_name, email, password, passwordConfirm } = req.body;

    // Check if password is at least 8 characters long
    if (password.length < 8) {
        return res.status(400).json({ error: "Password must be at least 8 characters long." });
    }

    // Check if passwords match
    if (password !== passwordConfirm) {
        return res.status(400).json({ error: "Passwords do not match." });
    }

    try {
        // Check if email already exists in the database
        const [rows] = await db.promise().query("SELECT * FROM users WHERE email = ?", [email]);

        if (rows.length > 0) {
            return res.status(400).json({ error: "Email already registered." });
        }

        // Hash the password using bcrypt
        const hashedPassword = await bcrypt.hash(password, 10);



        // Store registration info in session
        req.session.registrationInfo = {
            first_name,
            last_name,
            email,
            hashedPassword,
        };

        // Respond with a success message
        res.status(200).json({ message: "Verify your email to complete registration." });

    } catch (error) {
        console.error(error);

        res.status(500).json({ error: "An error occurred while registering the user." });
    }
});

// Export the router
module.exports = router;