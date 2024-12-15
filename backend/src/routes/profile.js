const express = require("express");
const router = express.Router();
const { isAuthenticated } = require("../middleware/auth");
const db = require("../db/db");

// Use the authentication middleware for this route
router.get("/", isAuthenticated, (req, res) => {
    res.render("profile", {
        title: "Your profile",
    });
});

router.post("/", async (req, res) => {
    const userId = req.session.userId; // Get the user ID from the session
    const { email, phone, address_line1, address_line2, city, state, postal_code, country } = req.body;

    try {
        if (email || phone) {
            // Check if the email already exists in the database
            const [existingUser] = await db.query(
                "SELECT * FROM users WHERE email = ? AND user_id != ?",
                [email, userId]
            );

            if (existingUser.length > 0) {
                console.log("Email already exists:", email); // Log existing email
                return res.status(400).json({ error: "Email already exists." }); // Send error response if email exists
            }

            // Update user details if email or phone is provided
            await db.query(
                "UPDATE users SET email = ?, phone_number = ? WHERE user_id = ?",
                [email || null, phone || null, userId]
            );
            console.log("User details updated for userId:", userId); // Log update success
        }

        if (address_line1 || address_line2 || city || state || postal_code || country) {
            // First, try to update the existing address
            const [updateResult] = await db.query(
                "UPDATE addresses SET address_line1 = ?, address_line2 = ?, city = ?, state = ?, postal_code = ?, country = ? WHERE user_id = ?",
                [address_line1 || null, address_line2 || null, city || null, state || null, postal_code || null, country || null, userId]
            );
        
            if (updateResult.affectedRows > 0) {
                console.log("Address updated for userId:", userId);
            } else {
                console.log("No address found for userId:", userId);
                // If no address exists, insert a new record
                const [insertResult] = await db.query(
                    "INSERT INTO addresses (user_id, address_line1, address_line2, city, state, postal_code, country) VALUES (?, ?, ?, ?, ?, ?, ?)",
                    [userId, address_line1, address_line2, city, state, postal_code, country]
                );
                console.log("New address created for userId:", userId);
            }
        }        

        res.json({ success: true });
    } catch (error) {
        console.error("Error updating profile: ", error);
        res.status(500).json({ error: "Failed to update profile." });
    }
});

module.exports = router;
