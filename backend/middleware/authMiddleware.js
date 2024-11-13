function isAuthenticated(req, res, next) {
    if (req.session.userId) {
        return next(); // User is logged in
    }
    res.redirect("/"); // Redirect to home if not logged in
}

// Check if the user is an admin
const isAdmin = (req, res, next) => {
    if (res.locals.user && res.locals.user.isAdmin) {
        return next(); // User is an admin, proceed with the request
    }
    res.redirect('/'); // Redirect to home if the user is not an admin
};

module.exports = { isAuthenticated, isAdmin };
