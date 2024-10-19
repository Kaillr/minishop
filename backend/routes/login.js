const express = require("express");
const router = express.Router();
const db = require("../db/db");
const bcrypt = require("bcrypt");

// Route for the login page
router.get("/", (req, res) => {
    res.render("login", {
        title: "Login - Minishop",
        error: null,  // Initialize error as null
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
                // Save user info in session
                req.session.userId = user.user_id;
                req.session.firstName = user.first_name;

                // Redirect to a dashboard or homepage
                return res.redirect("/");
            } else {
                // Password did not match
                return res.render("login", {
                    title: "Login - Minishop",
                    error: "Incorrect email or password."  // Pass the error message to the view
                });
            }
        } else {
            // No user found with that email
            return res.render("login", {
                title: "Login - Minishop",
                error: "Incorrect email or password."  // Pass the error message to the view
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("An error occurred while logging in.");
    }
});

module.exports = router;
