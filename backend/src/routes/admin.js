const express = require("express");
const router = express.Router();
const multer = require("multer");
const db = require("../db/db");
const { isAuthenticated, isAdmin } = require("../middleware/auth");
const fs = require("fs");
const resend = require("../services/resend")

router.get("/products", isAuthenticated, isAdmin, async (req, res) => {
    const [rows] = await db.query(`
        SELECT brand, product_name, description, price, image_path, product_id
        FROM products
    `);
    const results = rows

    res.render("admin/products", {
        title: "Manage Products - Minishop",
        products: results
    });

});

router.get("/users", isAuthenticated, isAdmin, async (req, res) => {
    const email = req.query.email || "";

    try {
        const [rows] = await db.query(
            `
            SELECT user_id, first_name, last_name, email, role
            FROM users
            WHERE email = ?
            `,
            [email]
        );

        res.render("admin/users", {
            title: "Manage Users - Minishop",
            searchUser: email,
            userInfo: rows[0] || "",
        });
    } catch (error) {
        console.error("Failed to connect to database:", error);
        res.status(500).send("Internal Server Error");
    }
});


router.post("/users/make-admin", isAuthenticated, isAdmin, async (req, res) => {
    const { email } = req.body;

    try {
        const [result] = await db.query(
            "UPDATE users SET role = 'admin' WHERE email = ?",
            [email]
        );

        if (result.affectedRows > 0) {
            res.status(200).json({ message: "Admin privileges granted." });
        } else {
            res.status(404).json({ message: "User not found." });
        }
    } catch (error) {
        console.error("Error updating admin role:", error);
        res.status(500).json({ message: "Internal Server Error." });
    }
});

router.post("/users/revoke-admin", isAuthenticated, isAdmin, async (req, res) => {
    const { email } = req.body;

    try {
        const [result] = await db.query(
            "UPDATE users SET role = 'user' WHERE email = ?",
            [email]
        );

        if (result.affectedRows > 0) {
            res.status(200).json({ message: "Admin privileges revoked." });
        } else {
            res.status(404).json({ message: "User not found." });
        }

        try {
            const [rows] = await db.query(
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
                            <p>If you have any questions or need assistance, feel free to reach out to us at noreply@minishop.mikaelho.land.</p>
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

    } catch (error) {
        console.error("Error updating admin role:", error);
        res.status(500).json({ message: "Internal Server Error." });
    }
});


// Set up multer for image uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '../../uploads/'); // Specify the uploads directory
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname); // Generate unique filename
    }
});
const upload = multer({ storage: storage });

async function deleteProductFromDatabase(req, res) {
    try {
        await db.query("DELETE FROM products WHERE product_id = ?", [req.body.product_id]);
        res.json({ message: "Product deleted successfully." });
    } catch (error) {
        console.error("Error deleting product: ", error);
        res.status(500).json({ error: "An error occurred while deleting the product." });
    }
}



// Route for adding a product, including image upload
router.post("/products/add", upload.single('image'), isAuthenticated, isAdmin, async (req, res) => {
    const { brand, name, description, price } = req.body;
    console.log("Received product data:", req.body);

    if (!req.file) {
        return res.status(400).json({ error: "No file uploaded." });
    }
    const imagePath = req.file.path; // Path to the uploaded image
    console.log("Image uploaded successfully:", imagePath);


    // Insert product into the database, including the image path
    try {
        await db.query(
            "INSERT INTO products (brand, product_name, description, price, image_path) VALUES (?, ?, ?, ?, ?)",
            [brand, name, description, price, imagePath]
        );

        res.status(200).json({ message: "Product added successfully!" });
    } catch (error) {
        console.error("Error adding product: ", error);
        res.status(500).json({ error: "An error occurred while adding the product." });

        /* Delete image from imagePath */
        fs.unlink(imagePath, (err) => {
            if (err) {
                console.error("Error deleting image:", err);
            } else {
                console.log("Image deleted successfully.");
            }
        });
    }
});

router.post('/products/delete', isAuthenticated, isAdmin, async (req, res) => {
    try {
        await deleteProductFromDatabase(req, res); // Pass req and res
    } catch (error) {
        console.error("Error deleting product:", error);
        res.status(500).json({ error: "Failed to delete product. Please try again." });
    }
});

router.get('/faqs', (req, res) => {
    res.render('admin/faqs', {
        title: 'Manage FAQs - Minishop'
    })
});

router.post("/faqs", async (req, res) => {
    try {
        const { question, answer } = req.body;

        await db.query(
            "INSERT INTO faqs (question, answer) VALUES (?,?)",
            [question, answer]
        );
        res.status(200).json({ message: "New FAQ added successfully." });
    } catch (err) {
        console.error(err);
        console.error("Failed to add new FAQ to database");
        res.status(200).json({ error: "Failed to add new FAQ. Please try again." });
    }
});

module.exports = router;
