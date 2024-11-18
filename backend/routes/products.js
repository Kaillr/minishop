import express from 'express';
import db from '../db/db.js';

const router = express.Router();

// Route to handle product display
router.get("/:product_id/:product_info", async (req, res) => {
    const productId = req.params.product_id;

    try {
        // Fetch product details based on product_id
        const [productRows] = await db.promise().query(
            "SELECT * FROM products WHERE product_id = ?",
            [productId]
        );

        // Check if product exists
        if (productRows.length === 0) {
            return res.status(404).send("Product not found");
        }

        const product = productRows[0]; // Get the product details

        // Render the product page with the product details
        res.render("product", {
            title: `Minishop - ${product.brand} ${product.product_name}`,
            product: product, // Pass the product details to the template
        });
    } catch (error) {
        console.error("Error fetching product details: ", error);
        res.status(500).json({ error: "An error occurred while fetching the product." });
    }
});

export default router;