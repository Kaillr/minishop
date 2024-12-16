const express = require("express");
const router = express.Router();
const db = require("../db/db")

router.get("/", async (req, res) => {
    try {
        const [faqs] = await db.query("SELECT * FROM faqs")

        res.render("faq", {
            title: "FAQs - Minishop",
            faqs: faqs
        });
    } catch (err) {
        console.error(err);
        console.error("Failed to fetch FAQs from database");
    }
});

module.exports = router;
