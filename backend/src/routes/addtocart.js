const express = require("express");
const router = express.Router();
const db = require("../db/db");

router.post('/', async (req, res) => {
    const { product_id, quantity = 1 } = req.body; // Destructure inputs and default quantity to 1
    const user_id = req.session.userId;

    // Validate input
    if (!user_id || !product_id) {
        return res.status(400).json({ success: false, message: 'User ID and Product ID are required.' });
    }

    try {
        // Insert product into the cart table
        await db.query(
            `INSERT INTO cart_items (user_id, product_id, quantity)
            VALUES (?, ?, ?)
            ON DUPLICATE KEY UPDATE quantity = quantity + VALUES(quantity);
            `,
            [user_id, product_id, quantity]
        );

    } catch (error) {
        console.error('Error inserting into cart:', error);
        res.status(500).json({ success: false, message: 'Failed to add product to cart.', error });
    }

    try {
        const [cart_items] = await db.query(
            `SELECT 
                cart_items.product_id, 
                cart_items.quantity, 
                products.brand, 
                products.product_name, 
                products.price,
                products.image_path
             FROM cart_items
             JOIN products ON cart_items.product_id = products.product_id
             WHERE cart_items.user_id = ?`,
            [user_id]
        );

        res.json({ success: true, cart_items });
    } catch (error) {
        console.error("Error fetching cart items:", error);
        res.status(500).json({ success: false, message: "Error fetching cart items." });
    }

});

router.post('/remove', async (req, res) => {
    const { product_id } = req.body;
    const user_id = req.session.userId;

    try {
        await db.query(
            "DELETE FROM cart_items WHERE user_id =? AND product_id =?",
            [req.session.userId, product_id]
        )

        res.json({ success: true, message: 'Product removed from cart.' });
    } catch (error) {
        console.error('Error deleting from cart:', error);
        res.status(500).json({ success: false, message: 'Failed to remove product from cart.', error });
    }
});

module.exports = router;