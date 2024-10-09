// main.js
const express = require('express');
const app = express();
const port = 3000;

// Middleware to parse JSON requests
app.use(express.json());

// Test endpoint
app.get('/', (req, res) => {
    res.send('Hello World! This is a test endpoint.');
});

// Example of a simple API endpoint
app.get('/api/test', (req, res) => {
    res.json({ message: 'This is a test API response.' });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
