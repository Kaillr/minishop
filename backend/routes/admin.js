const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const db = require("../db/db");
const { isAuthenticated, isAdmin } = require("../middleware/authMiddleware");
const fs = require("fs");

router.get("/", (req, res) => {
    res.render("admin", {
router.get("/products", isAuthenticated, isAdmin, async (req, res) => {
    res.render("admin/products", {
        title: "Dashboard - Minishop",
    });

});

// Set up multer for image uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '../uploads/'); // Specify the uploads directory
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname); // Generate unique filename
    }
});
const upload = multer({ storage: storage });

// Route for adding a product, including image upload
router.post("/add", upload.single('image'), async (req, res) => {
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

module.exports = router;
