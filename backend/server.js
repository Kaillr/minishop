import express from 'express';
import session from 'express-session';
import MySQLStore from 'express-mysql-session';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url'; // Import fileURLToPath to handle ES module paths

// Load environment variables from .env file
dotenv.config({ path: '../.env' });

// Import database connection
import db from './db/db.js';  // Note the .js extension for ES modules

// Import middleware
import fetchUserDetails from './middleware/fetchUserDetails.js';

// Import routes
import indexRoutes from './routes/index.js';
import registerRoutes from './routes/register.js';
import loginRoutes from './routes/login.js';
import searchRoutes from './routes/search.js';
import logoutRoutes from './routes/logout.js';
import profileRoutes from './routes/profile.js';
import securityRoutes from './routes/security.js';
import adminRoutes from './routes/admin.js';
import productRoutes from './routes/products.js';
import editproductRoutes from './routes/editproducts.js';

// Initialize Express app
const app = express();
const port = process.env.PORT || 3000;

// Resolve __dirname in ES module context
const __filename = fileURLToPath(import.meta.url);  // Get the current file path
const __dirname = path.dirname(__filename);  // Get the directory of the current file

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
        maxAge: 1000 * 60 * 60 * 24 * 7, // Expires after 7 days
        secure: false, // Secure only works over HTTPS
        httpOnly: true, // Prevent client-side JavaScript from accessing the cookie
    }
}));

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
app.use("/", fetchUserDetails, indexRoutes);
app.use("/register", registerRoutes);
app.use("/login", loginRoutes);
app.use("/search", searchRoutes);
app.use("/logout", logoutRoutes);
app.use("/product", productRoutes);
app.use("/settings/profile", profileRoutes);
app.use("/settings/security", securityRoutes);
app.use("/settings/admin", adminRoutes);
app.use("/settings/admin/products/edit", editproductRoutes);

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