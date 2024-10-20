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
        // Hash the password using bcrypt
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert the user into the database
        await db.promise().query(
            "INSERT INTO users (first_name, last_name, email, password) VALUES (?,?,?,?)",
            [first_name, last_name, email, hashedPassword]
        );

        // Send a success response (no need to render a page)
        res.status(200).json({ message: "User registered successfully!" });

    } catch (error) {
        console.error(error);

        // Handle duplicate email (or other database errors)
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ error: "Email already registered." });
        }

        res.status(500).json({ error: "An error occurred while registering the user." });
    }
});

// Export the router
module.exports = router;
