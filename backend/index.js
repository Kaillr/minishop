// app.js
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const db = require('./config/db');
const registerRoutes = require('./auth/register');
const loginRoutes = require('./auth/login');

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

// Use routes with specific paths
app.use('/auth/register', registerRoutes); // Mount register routes at /auth/register
app.use('/auth/login', loginRoutes);       // Mount login routes at /auth/login

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
