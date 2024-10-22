const express = require("express");
const router = express.Router();

// Route for the search page
router.get("/", async (req, res) => {
    
    const searchQuery = req.query.q; // Get search query from URL parameters
    
    try {
        const [results] = await db.promise().query(
            "SELECT product_name, description, price, image_path FROM products WHERE product_name LIKE ?",
            [`%${searchQuery}%`]
        );
        
        res.json(results); // Return the results as JSON
    } catch (error) {
        console.error("Error fetching products: ", error);
        res.status(500).json({ error: "An error occurred while searching for products." });
    }
    
    res.render("search", {
        title: "Search - Minishop",
    });
});

// Export the router
module.exports = router;
 