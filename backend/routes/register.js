const express = require("express");
const router = express.Router();
const db = require("../db/db");
const bcrypt = require("bcrypt");

// Route for the registration page
router.get("/", (req, res) => {
    res.render("register", {
        title: "Register - Minishop",
        error: null,
    });
});

router.post("/", async (req, res) => {
    const { first_name, last_name, email, password, passwordConfirm } = req.body;

    // Check if passwords match
    if (password !== passwordConfirm) {
        return res.render("register", {
            title: "Register - Minishop",
            error: "Passwords do not match.", // Pass the error message to the view
        });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const [results] = await db.promise().query(
            "INSERT INTO users (first_name, last_name, email, password) VALUES (?,?,?,?)",
            [first_name, last_name, email, hashedPassword]
        );
        return res.redirect('/login');
    } catch (error) {
        console.error(error);
        // Handle duplicate email or other database errors
        if (error.code === 'ER_DUP_ENTRY') {
            return res.render("register", {
                title: "Register - Minishop",
                error: "Email already registered.", // Pass the error message to the view
            });
        }
        res.status(500).send("An error occurred while registering the user.");
    }
});

// Export the router
module.exports = router;