// app.js (or index.js)
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const db = require('./config/db'); // Adjust path as necessary
const registerRoutes = require('./auth/register'); // Adjust path as necessary
const loginRoutes = require('./auth/login'); // Adjust path as necessary

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser()); // Enable cookie parsing

// Use routes
app.use(registerRoutes); // Register register routes
app.use(loginRoutes); // Register login routes

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
