const express = require("express");
const router = express.Router();
const resend = require("../services/resend");
const db = require("../db/db");
const { isAuthenticated, isAdmin } = require("../middleware/auth"); // Importing the authentication middleware

router.get('/', isAuthenticated, isAdmin, (req, res) => {
    res.render('sendemail', {
        title: 'Send Admin Email',
    });
});

router.post('/', isAuthenticated, isAdmin, async (req, res) => {
    const email = req.body.email;
    console.log(email);

    try {
        const [rows] = await db.promise().query(
            "SELECT first_name, last_name FROM users WHERE email = (?)",
            [email]
        );

        user = rows[0];
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "An error occurred while sending the email." });
    }

    try {
        await resend.emails.send({
            from: "Minishop <minishop@mikaelho.land>",
            to: email,
            subject: `🎉 Welcome to the Minishop Admin Team, ${user.first_name}!`,
            html: `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Welcome to Minishop Admin</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        background-color: #f9f9f9;
                        color: #333;
                        margin: 0;
                        padding: 20px;
                    }
                    .email-container {
                        max-width: 600px;
                        margin: auto;
                        background: #ffffff;
                        padding: 20px;
                        border: 1px solid #ddd;
                        border-radius: 8px;
                    }
                    .header {
                        text-align: center;
                        background-color: #4caf50;
                        padding: 20px;
                        color: white;
                        border-radius: 8px 8px 0 0;
                    }
                    .header h1 {
                        margin: 0;
                    }
                    .content {
                        padding: 20px;
                        text-align: center;
                    }
                    .button {
                        display: inline-block;
                        margin-top: 20px;
                        padding: 10px 20px;
                        font-size: 16px;
                        color: white;
                        background-color: #4caf50;
                        text-decoration: none;
                        border-radius: 5px;
                    }
                    .button:hover {
                        background-color: white;
                        outline: 1px solid #888;
                    }
                    .footer {
                        margin-top: 20px;
                        text-align: center;
                        font-size: 12px;
                        color: #888;
                    }
                </style>
            </head>
            <body>
                <div class="email-container">
                    <div class="header">
                        <h1>Welcome to Minishop Admin, ${user.first_name}!</h1>
                    </div>
                    <div class="content">
                        <p>Hi ${user.first_name},</p>
                        <p>We’re excited to inform you that you have been granted <strong>Admin privileges</strong> on Minishop! 🎉</p>
                        <p>With your new role, you can now:</p>
                        <ul style="text-align: left; list-style: none; padding: 0;">
                            <li>✔ Manage Products</li>
                            <li>✔ Manage Users</li>
                        </ul>
                        <p>Your registered email is: <strong>${email}</strong></p>
                        <p>Click the button below to log in and start exploring your admin dashboard:</p>
                        <a href="https://minishop.mikaelho.land/settings/admin/products" class="button">Go to Admin Dashboard</a>
                    </div>
                    <div class="footer">
                        <p>If you have any questions or need assistance, feel free to reach out to us at support@minishop.mikaelho.land.</p>
                        <p>Thank you for being a part of the Minishop team!</p>
                    </div>
                </div>
            </body>
            </html>
            `,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "An error occurred while sending the email." });
    }

    res.render('sendemail', {
        title: 'Send Admin Email',
    });
});

module.exports = router;