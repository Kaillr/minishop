function isAuthenticated(req, res, next) {
    if (req.session.userId) {
        return next(); // User is logged in
    }
    res.redirect("/"); // Redirect to home if not logged in
}

// Check if the user is an admin
/* function isAdmin(req, res, next) {
    if (req.session.admin === true) {
        return next(); // User is an admin
    }
    res.redirect("/"); // Redirect to home if not an admin
} */

module.exports = isAuthenticated;
