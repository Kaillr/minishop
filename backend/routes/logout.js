import express from 'express';

const router = express.Router();

router.get("/", (req, res) => {
    res.render("logout", {
        title: "Logout",
    });
});

router.post("/", (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error(err);
            return res.redirect("/");
        }

        res.clearCookie("connect.sid"); // clears session cookie
        res.redirect("/");
    });
});

export default router;