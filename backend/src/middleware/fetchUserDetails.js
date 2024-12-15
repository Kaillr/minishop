const db = require('../db/db');

// Middleware to fetch user details and cart items
const fetchUserDetails = (req, res, next) => {
    if (req.session.userId) {
        // Fetch user details with cart items
        db.query(
            `SELECT u.first_name, u.last_name, u.email, u.phone_number, u.password, u.role, u.is_verified,
                    a.address_line1, a.address_line2, a.city, a.state, a.postal_code, a.country
             FROM users u
             LEFT JOIN addresses a ON u.user_id = a.user_id
             WHERE u.user_id = ?`,
            [req.session.userId]
        ).then(async ([userRows]) => {
            if (userRows.length > 0) {
                const user = userRows[0];

                // Fetch cart items
                const [cartItems] = await db.query(
                    `SELECT 
                        cart_items.product_id, 
                        cart_items.quantity, 
                        products.brand,
                        products.product_name,
                        products.price,
                        products.description,
                        products.stock,
                        products.image_path
                     FROM cart_items
                     JOIN products ON cart_items.product_id = products.product_id
                     WHERE cart_items.user_id = ?`,
                    [req.session.userId]
                );

                // Construct user object
                res.locals.user = {
                    firstName: user.first_name || '',
                    lastName: user.last_name || '',
                    email: user.email || '',
                    phoneNumber: user.phone_number || '',
                    role: user.role || '',
                    password: user.password || '',
                    isAdmin: user.role === 'admin',
                    isVerified: user.is_verified || false,
                    address: {
                        line1: user.address_line1 || '',
                        line2: user.address_line2 || '',
                        city: user.city || '',
                        state: user.state || '',
                        postalCode: user.postal_code || '',
                        country: user.country || '',
                    },
                    cart: cartItems.map(item => ({
                        productId: item.product_id || '',
                        brand: item.brand || '',
                        productName: item.product_name || '',
                        quantity: item.quantity || '',
                        imagePath: item.image_path || '',
                        price: item.price || '',
                        description: item.description || '',
                        stock: item.stock || '',
                    }))
                };
            } else {
                res.locals.user = { cart: [] }; // Default empty cart
            }
            next();
        }).catch((error) => {
            console.error("Error fetching user details or cart: ", error);
            res.locals.user = { cart: [] }; // Default to an empty user object
            next();
        });
    } else {
        // Default user object when not logged in
        res.locals.user = { cart: [] }; // Default empty cart
        next();
    }
};

module.exports = fetchUserDetails;
