const express = require("express");
const router = express.Router();

// Route for the search page
router.get("/", (req, res) => {
    res.render("search", {
        title: "Search - Minishop",
    });
});

// Export the router
module.exports = router;
 