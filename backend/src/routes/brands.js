const express = require("express");
const router = express.Router();
const db = require("../db/db");

router.get("/:brand", async (req, res) => {
    brandName = req.params.brand;
    
    try {
        const [rows] = await db.query(
            "SELECT * FROM products WHERE brand = ?", [brandName]
        )

        const products = rows
        console.log(products)
        res.render("brand", {
            title: "Minishop - " + brandName,
            brand: brandName,
            products: products
        });
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
});

module.exports = router;
