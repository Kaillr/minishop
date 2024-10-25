// Import necessary modules
const express = require("express");
const session = require("express-session");
const MySQLStore = require("express-mysql-session")(session);
const path = require("path");
const dotenv = require("dotenv");

// Load environment variables from .env file
dotenv.config({ path: '../.env' });

// Import database connection
const db = require('./db/db');

// Import middleware
const fetchUserDetails = require("./middleware/fetchUserDetails");

// Import routes
const indexRoutes = require('./routes/index');
const registerRoutes = require('./routes/register');
const loginRoutes = require('./routes/login');
const searchRoutes = require('./routes/search');
const logoutRoutes = require('./routes/logout');
const profileRoutes = require('./routes/profile');
const securityRoutes = require('./routes/security');
const adminRoutes = require('./routes/admin');
const productRoutes = require("./routes/products");

// Initialize Express app
const app = express();
const port = process.env.PORT || 3000;

// Configure EJS as the templating engine
app.set('trust proxy', true);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, '../frontend/views/pages'));

// Middleware for parsing request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configure session middleware
const sessionStore = new MySQLStore({}, db);
app.use(session({
    key: 'minishop_session',
    secret: process.env.SESSION_SECRET,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24, // Expires after 24 hours
        secure: true, // Secure only works over HTTPS
        httpOnly: true, // Prevent client-side JavaScript from accessing the cookie
    }
}));

// Middleware to fetch user details from the database
app.use(fetchUserDetails);

// Middleware for additional variables in views
app.use((req, res, next) => {
    res.locals.currentYear = new Date().getFullYear();
    res.locals.query = req.query.query || "";
    res.locals.userId = req.session.userId;
    next();
});

// Serve static files from the frontend directory
app.use(express.static(path.join(__dirname, '../frontend')));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Define routes
app.use("/", indexRoutes);
app.use("/register", registerRoutes);
app.use("/login", loginRoutes);
app.use("/search", searchRoutes);
app.use("/logout", logoutRoutes);
app.use("/settings/profile", profileRoutes);
app.use("/settings/security", securityRoutes);
app.use("/admin", adminRoutes);
app.use("/product", productRoutes);

// Catch-all 404 handler for unavailable routes
app.use((req, res, next) => {
    res.status(404).render("404", {
        title: "404 Not Found",
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
