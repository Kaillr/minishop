const express = require("express");
const router = express.Router();
const db = require("../db/db");
const resend = require("../services/resend");

function generateCode(n, chunks = 0, separator = ' ') {
    var add = 1, max = 12 - add;
    
    var out;
    if ( n > max ) {
        out = generate(max) + generate(n - max);
    }
    else {
        max        = Math.pow(10, n+add);
        var min    = max/10; // Math.pow(10, n) basically
        var number = Math.floor( Math.random() * (max - min + 1) ) + min;
        
        out = ("" + number).substring(add);
    }
    
    if (chunks > 0 && n > chunks) {
        // Insert separator every chunks characters
        const instead = []; for (let i = 0; i < out.length; i++) {
            if (i > 0 && i % chunks === 0) instead.push(separator);
            instead.push(out[i]);
        }
        
        return instead.join('');
    }
    
    return out;
}

async function sendVerificationEmail(verificationCode, email) {
    await resend.emails.send({
        from: "Minishop <minishop@mikaelho.land>",
        to: email,
        subject: "Verify Your Email",
        html: `<h1>Email Verification</h1><p>Your verification code is: <b>${verificationCode}</b></p>`,
    });
    console.log("Verification code sent");
    console.log(verificationCode, email);
}

// Route for the verification page (GET)
router.get("/", async (req, res) => {
    const { registrationInfo } = req.session;
    const { user } = res.locals;

    if (user && user.isVerified) {
        // Redirect if the user is already verified
        return res.redirect("/");
    }

    if (registrationInfo && registrationInfo.email) {
        // Proceed only if registrationInfo exists and contains email
        const { email } = registrationInfo;

        if (!registrationInfo.verificationCode) {

            const verificationCode = generateCode(6)
            req.session.registrationInfo.verificationCode = verificationCode;

            sendVerificationEmail(verificationCode, email);
        }

        // Render the verification page
        return res.render("verify", {
            title: "Verify Your Account",
            email,
        });
    }

    if (user && !user.isVerified) {
        // For logged-in users who are not verified
        const { email } = user;

        if (!req.session.registrationInfo || !req.session.registrationInfo.verificationCode) {
            const verificationCode = generateCode(6)
            req.session.registrationInfo.verificationCode = verificationCode;

            sendVerificationEmail(verificationCode, email);

            req.session.registrationInfo = req.session.registrationInfo || {};
            req.session.registrationInfo.verificationCode = verificationCode;
        }

        return res.render("verify", {
            title: "Verify Your Account",
            email,
        });
    }

    // If no valid case matches, redirect to the index page
    return res.redirect("/");
});

// Route for handling verification (POST)
router.post("/", async (req, res) => {
    const { verificationCode: providedCode } = req.body;
    const { registrationInfo } = req.session;
    const { user } = res.locals;

    if (!registrationInfo && !user) {
        // Redirect if no registrationInfo or user is available
        return res.redirect("/");
    }

    if (!user) {
        // Handle registration verification
        if (registrationInfo && providedCode === registrationInfo.verificationCode) {
            const { first_name, last_name, email, hashedPassword } = registrationInfo;

            try {
                await db.query(
                    "INSERT INTO users (first_name, last_name, email, password, is_verified) VALUES (?,?,?,?,?)",
                    [first_name, last_name, email, hashedPassword, true]
                );

                req.session.registrationInfo = null; // Clear registration info
                return res.status(200).json({ message: "Account verified successfully!", redirectUrl: "/login" });
            } catch (error) {
                console.error(error);
                return res.status(500).json({ error: "An error occurred during registration." });
            }
        } else {
            return res.status(400).json({ error: "Invalid verification code." });
        }
    } else {
        // Handle logged-in user verification
        if (providedCode === req.session.registrationInfo?.verificationCode) {
            try {
                await db.query(
                    "UPDATE users SET is_verified = ? WHERE email = ?",
                    [true, user.email]
                );

                req.session.registrationInfo = null; // Clear session
                return res.status(200).json({ message: "Account verified successfully!", redirectUrl: "/" });
            } catch (error) {
                console.error(error);
                return res.status(500).json({ error: "An error occurred during verification." });
            }
        } else {
            return res.status(400).json({ error: "Invalid verification code." });
        }
    }
});

router.post('/resend', async (req, res) => {
    const { registrationInfo } = req.session;
    const { email } =  res.locals.user;

    const verificationCode = req.session.registrationInfo?.verificationCode

    sendVerificationEmail(verificationCode, email)
})

module.exports = router;