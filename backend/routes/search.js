const express = require("express");
const router = express.Router();
const db = require("../db/db");

// Route for handling search queries
router.get("/", async (req, res) => {
    const query = req.query.query || ""; // Get the query from the request URL

    let results = []; // Initialize results array
    if (query) {
        try {
            const [rows] = await db.promise().query(
                "SELECT product_name, description, price, image_path FROM products WHERE product_name LIKE ?",
                [`%${query}%`]
            );
            results = rows; // Set results to the fetched rows

            // Render the search page with results
            return res.render("search", {
                title: "Search - Minishop",
                results: results, // Pass results to the template
            });
        } catch (error) {
            console.error("Error fetching search results: ", error);
            return res.status(500).json({ error: "An error occurred while searching for products." });
        }
    }

    // Render the search page without results
    res.render("search", {
        title: "Search - Minishop",
        results: results, // Pass results to the template
    });
});

// Export the router
module.exports = router;
