const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const db = require("../db/db");
const { isAuthenticated, isAdmin } = require("../middleware/auth");
const fs = require("fs");

router.get("/products", isAuthenticated, isAdmin, async (req, res) => {
    const [rows] = await db.promise().query(`
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
        const [rows] = await db.promise().query(
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
            user: rows[0] || "",
        });
    } catch (error) {
        console.error("Failed to connect to database:", error);
        res.status(500).send("Internal Server Error");
    }
});


router.post("/users/make-admin", isAuthenticated, isAdmin, async (req, res) => {
    const { email } = req.body;

    try {
        const [result] = await db.promise().query(
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
        const [result] = await db.promise().query(
            "UPDATE users SET role = 'user' WHERE email = ?",
            [email]
        );

        if (result.affectedRows > 0) {
            res.status(200).json({ message: "Admin privileges revoked." });
        } else {
            res.status(404).json({ message: "User not found." });
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
        await db.promise().query("DELETE FROM products WHERE product_id = ?", [req.body.product_id]);
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
        await db.promise().query(
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

module.exports = router;
