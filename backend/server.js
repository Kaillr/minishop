const express = require("express");
const path = require("path");
const dotenv = require("dotenv");

dotenv.config({ path: '../.env' });

const db = require('./db/db');

const indexRoutes = require('./routes/index');
const registerRoutes = require('./routes/register');
const loginRoutes = require('./routes/login');
const searchRoutes = require('./routes/search');

const app = express();
const port = process.env.PORT || 3000;

// Set EJS as the templating engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, '../frontend/views/pages'));

// Middleware for parsing request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the frontend directory
app.use(express.static(path.join(__dirname, '../frontend')));

// Middleware to set query variable globally
app.use((req, res, next) => {
    res.locals.currentYear = new Date().getFullYear();
    res.locals.query = req.query.query || "";  // Set query globally for all views
    next();
});

// Define routes
app.use("/", indexRoutes);
app.use("/register", registerRoutes);
app.use("/login", loginRoutes);
app.use("/search", searchRoutes);

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
