const express = require("express");
const path = require("path");
const dotenv = require("dotenv");

dotenv.config({ path: '../.env' });

const db = require('./db/db');

const indexRoutes = require('./routes/index');
const registerRoutes = require('./routes/register');
const loginRoutes = require('./routes/login');

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

// Define routes
app.use("/", indexRoutes);
app.use("/register", registerRoutes);
app.use("/login", loginRoutes)

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});