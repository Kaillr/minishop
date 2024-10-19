const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error(err);
            return res.redirect("/");
        }

        res.clearCookie("connect.sid"); // clears session cookie
        res.redirect("/");
    });
});

module.exports = router;
