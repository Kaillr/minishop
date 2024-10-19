const express = require("express");
const router = express.Router();
const isAuthenticated = require("../middleware/authMiddleware");

// Use the authentication middleware for this route
router.get("/", isAuthenticated, (req, res) => {
    res.render("profile", {
        title: "Your profile",
    });
});

module.exports = router;
