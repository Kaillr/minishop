const express = require("express");
const router = express.Router();
const db = require("../db/db");
const resend = require("../services/resend");
const { isAuthenticated } = require("../middleware/auth"); // Importing the authentication middleware

// Route for the verification page (GET)
router.get("/", async (req, res) => {
    const { registrationInfo } = req.session; // For registration process
    const { user } = res.locals; // For logged-in user (via res.locals)

    if (user && user.isVerified) {
        // If user is already verified, redirect to home page
        res.redirect("/");
    }

    // Check if the user is registering
    if (registrationInfo) {
        const { email } = registrationInfo;

        // If verification code doesn't exist, generate and send it
        if (!registrationInfo.verificationCode) {
            const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

            // Send verification email
            await resend.emails.send({
                from: "Minishop <minishop@mikaelho.land>",
                to: email,
                subject: "Verify Your Email",
                html: `<h1>Email Verification</h1><p>Your verification code is: <b>${verificationCode}</b></p>`,
            });

            // Store verification code in session
            req.session.registrationInfo.verificationCode = verificationCode;
        }

        // Render verification page for registration
        res.render("verify", {
            title: "Verify Your Account",
            email: registrationInfo.email,
        });
    } else if (user && !user.is_verified) {
        // For logged-in users who are not verified yet
        const { email } = user;

        // If verification code hasn't been sent yet, generate and send it
        if (!req.session.registrationInfo || !req.session.registrationInfo.verificationCode) {
            const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

            // Send verification email
            await resend.emails.send({
                from: "Minishop <minishop@mikaelho.land>",
                to: email,
                subject: "Verify Your Email",
                html: `<h1>Email Verification</h1><p>Your verification code is: <b>${verificationCode}</b></p>`,
            });

            // Store verification code in the session
            req.session.registrationInfo = req.session.registrationInfo || {};
            req.session.registrationInfo.verificationCode = verificationCode;
        }

        res.render("verify", {
            title: "Verify Your Account",
            email: user.email,
        });
    } else {
        // If not registering and not logged in, redirect to the index page
        res.redirect("/");
    }
});

// Route for handling verification (POST)
router.post("/", async (req, res) => {
    const { verificationCode: providedCode } = req.body;
    const { registrationInfo } = req.session; // For registration process
    const { user } = res.locals; // For logged-in user

    // If registering, check the session verification code
    if (!user) {
        if (providedCode === registrationInfo.verificationCode) {
            const { first_name, last_name, email, hashedPassword } = registrationInfo;

            try {
                // Insert the new user into the database and set is_verified to true
                await db.promise().query(
                    "INSERT INTO users (first_name, last_name, email, password, is_verified) VALUES (?,?,?,?,?)",
                    [first_name, last_name, email, hashedPassword, true]
                );

                // Clear the registration session after successful verification
                req.session.registrationInfo = null;

                res.status(200).json({ message: "Account verified successfully!", redirectUrl: "/login" });
            } catch (error) {
                console.error(error);
                res.status(500).json({ error: "An error occurred during registration." });
            }
        } else {
            res.status(400).json({ error: "Invalid verification code." });
        }
    } else if (user) {
        // For logged-in users who need verification
        if (providedCode === req.session.registrationInfo?.verificationCode) {
            try {
                // Update the user's `is_verified` status to true in the database
                await db.promise().query(
                    "UPDATE users SET is_verified = ? WHERE email = ?",
                    [true, user.email]  // Set is_verified to true for the user
                );

                // Clear session verification info after successful verification
                req.session.registrationInfo = null;

                res.status(200).json({ message: "Account verified successfully!", redirectUrl: "/"});
            } catch (error) {
                console.error(error);
                res.status(500).json({ error: "An error occurred during verification." });
            }
        } else {
            res.status(400).json({ error: "Invalid verification code." });
        }
    } else {
        // If no user or registration info, redirect
        res.redirect("/");
    }
});

module.exports = router;