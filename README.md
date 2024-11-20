[![Deploy](https://github.com/Kaillr/minishop/actions/workflows/main.yml/badge.svg)](https://github.com/Kaillr/minishop/actions/workflows/main.yml)
[![Latest Release](https://img.shields.io/github/v/release/Kaillr/minishop)](https://github.com/Kaillr/py-search-engine/releases/minishop)
[![CodeFactor](https://www.codefactor.io/repository/github/kaillr/minishop/badge)](https://www.codefactor.io/repository/github/kaillr/minishop)

# 🛍️ Minishop

<i>[Minishop](https://minishop.mikaelho.land/) is a Shopping Site where the concept is to earn points by playing minigames in order to purchase various products.</i>

## 💡Ideas for Minishop

### User Management
  - User registration and login with database using hashed passwords
  - Profile Management: Lets the user manage and view their profile stats and view order history
  - [reCAPTCHA](https://www.google.com/recaptcha/) for registration and purchases
  - Wishlist feature?
  - Maybe.. just maybe email notification system for registration, purchases, etc.

### Shopping Features
  - Working Shopping Cart with cart products in database, or in localstorage for unregistered users
  - Use points to shop for products
  - Sort products by various categories
  - Create a working Search Bar that sorts products by relevance, date added, price (ascending or descending) and filters such as: in-stock or different product tags
  - product Recommendations based on previous purchases
  - Coupons (for fun)

### Gameplay & Points
  - Play a minigame to earn points

### Admin Features
  - Admin Dashboard where you can add new shop products by inserting name, price, description, stock and images
  - Dashboard should also show data like total sales, most popular products, and user activity

### Front-end & Branding
  - Branded front-end design for the website
  - Image database for products and branding

### Customer Engagement & Support
  - FAQs?

## 🛢️Database Concept Overview 

This document shows the concept for a shopping website database, including user information and a credit system.

### Tables

1. **Users Table**: Stores user information.
2. **Products Table**: Stores product details.
3. **Orders Table**: Stores information about user purchases.
4. **Credits Table**: Tracks user credits and transactions.

## SQL Statements

### Create Users Table
```sql
CREATE TABLE Users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(320) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Create Products Table
```sql
CREATE TABLE Products (
    product_id INT AUTO_INCREMENT PRIMARY KEY,
    product_name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    stock INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Create Orders Table
```sql
CREATE TABLE Orders (
    order_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    total_amount DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES Users(user_id)
);
```

### Create Credits Table
```sql
CREATE TABLE Credits (
    credit_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    type ENUM('earned', 'spent') NOT NULL,
    FOREIGN KEY (user_id) REFERENCES Users(user_id)
);
```
### Create Shopping Cart Table
```sql
CREATE TABLE ShoppingCart (
    cart_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(user_id),
    FOREIGN KEY (product_id) REFERENCES Products(product_id)
);
```
### Create Images Table
```sql
CREATE TABLE Images (
    image_id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT,  -- Can be NULL initially, set later when product is added
    file_path VARCHAR(255) NOT NULL,  -- Path or URL to the image
    upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES Products(product_id) ON DELETE CASCADE
);
```

## Explanation of the Tables

- **Users Table**: 
  - `user_id`: Unique identifier for each user.
  - `password`: Password for account authentication (stored securely using hashing).
  - `email`: Unique email address for the user.
  - `created_at`: Timestamp for when the account was created.

- **Products Table**:
  - `product_id`: Unique identifier for each product.
  - `product_name`: Name of the product.
  - `description`: Description of the product.
  - `price`: Price of the product.
  - `stock`: Quantity available in stock.
  - `created_at`: Timestamp for when the product was added.

- **Orders Table**:
  - `order_id`: Unique identifier for each order.
  - `user_id`: Identifier of the user who placed the order.
  - `order_date`: Date and time when the order was placed.
  - `total_amount`: Total amount for the order.

- **Credits Table**:
  - `credit_id`: Unique identifier for each credit transaction.
  - `user_id`: Identifier of the user associated with the credit.
  - `amount`: Amount of credits earned or spent.
  - `transaction_date`: Date and time of the credit transaction.
  - `type`: Indicates whether the credits were earned or spent.

  - **Images Table**:
  - `image_id`: Unique identifier for each image.
  - `product_id`: Identifier of the associated product from the **Products Table** (can be NULL initially).
  - `file_path`: Path or URL to the image file.
  - `upload_date`: Date and time when the image was uploaded (defaults to the current timestamp).


## Additional Considerations

- **Security**: Always hash passwords before storing them in the database.
- **Indexes**: Consider adding indexes to columns that are frequently queried, like `email`, and `product_name`, for better performance.


## 📝 Documentation

### Project Structure

Your project is structured into two main directories: `frontend` and `backend`. This separation promotes a clear organization of your codebase, making it easier to manage both the server-side logic and the client-side presentation.

### Backend

1. **server.js**: Main server file where the Express application is configured, including middleware and routes.
2. **db/db.js**: Database connection file using MySQL.
3. **routes**: Contains route files like `index.js`, `login.js`, `register.js`, and `users.js` to handle different endpoints.
4. **Static Files**: All static files (CSS, JS) are served from the `frontend` directory.

### Frontend

1. **views**: Contains Handlebars templates like `index.ejs`, `login.ejs`, and `register.ejs` for rendering the user interface.
2. **css**: Contains your CSS stylesheets.

### Middleware in `server.js`

- `app.use(express.json())`: Parses incoming JSON requests.
- `app.use(express.urlencoded({ extended: true }))`: Parses incoming requests with URL-encoded payloads, allowing you to handle form submissions.

### Routing

The routes are set up to render the appropriate views, using the Handlebars templating engine for dynamic content.

### SQL Database

The database is structured to handle user information, products, orders, credits, and images, ensuring data integrity and efficient retrieval.

### Version Control

Use Git for version control. Commits should be descriptive, explaining the changes made to the codebase.

### License

This project is licensed under the MIT License, allowing for free use and distribution of the code.
