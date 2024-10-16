const express = require("express");
const router = express.Router();

// Route for the registration page
router.get("/", (req, res) => {
    res.render("register", {
        title: "Register - Minishop",
    });
});

// Export the router
module.exports = router;
 