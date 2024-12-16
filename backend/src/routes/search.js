const express = require("express");
const router = express.Router();
const db = require("../db/db");

// Route for handling search queries
router.get("/", async (req, res) => {
    const query = req.query.query || ""; // Get the query from the request URL
    const words = query.trim().split(/\s+/); // Split query into words based on spaces

    let results = []; // Initialize results array
    if (query.length > 0) {
        // Create dynamic SQL query with multiple AND conditions for each word
        const sqlQuery = `
            SELECT brand, product_name, description, price, image_path, product_id
            FROM products 
            WHERE ${words.map(() => "(product_name LIKE ? OR brand LIKE ?)").join(" AND ")}
        `;

        // Create an array of parameters for the SQL query
        const sqlParams = words.flatMap(word => [`%${word}%`, `%${word}%`]);

        try {
            const [rows] = await db.query(sqlQuery, sqlParams);
            results = rows; // Set results to the fetched rows

            results.sort((a, b) => { // Sort results alphabetically by brand, then name
                const brandNameA = `${a.brand} ${a.product_name}`.toLowerCase();
                const brandNameB = `${b.brand} ${b.product_name}`.toLowerCase();
                return brandNameA.localeCompare(brandNameB);
            });

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
