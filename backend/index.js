// index.js
const express = require('express');
const bodyParser = require('body-parser');
const db = require('./config/db');
const { registerUser } = require('./controllers/authController');

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Registration endpoint
app.post('/register', registerUser);

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
