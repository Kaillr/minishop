function isAuthenticated(req, res, next) {
    if (req.session.userId) {
        return next(); // User is logged in
    }
    res.redirect("/"); // Redirect to home if not logged in
}

module.exports = isAuthenticated;
