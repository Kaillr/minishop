const db = require('../db/db');

// Middleware to fetch user details
const fetchUserDetails = (req, res, next) => {
    if (req.session.userId) {
        // If userId exists in session, query the database for user details
        db.promise()
            .query("SELECT first_name, last_name, email, phone_number, password FROM users WHERE user_id = ?", [req.session.userId])
            .then(([userRows]) => {
                if (userRows.length > 0) {
                    const user = userRows[0];
                    // Attach user details to res.locals for use in templates
                    res.locals.firstName = user.first_name || '';
                    res.locals.lastName = user.last_name || '';
                    res.locals.email = user.email || '';
                    res.locals.phoneNumber = user.phone_number || '';
                    res.locals.password = user.password || '';
                }
                // Proceed to fetch address details
                return db.promise()
                    .query("SELECT address_line1, address_line2, city, state, postal_code, country FROM addresses WHERE user_id = ?", [req.session.userId]);
            })
            .then(([addressRows]) => {
                if (addressRows.length > 0) {
                    const address = addressRows[0];
                    res.locals.addressLine1 = address.address_line1 != null ? address.address_line1 : ''; 
                    res.locals.addressLine2 = address.address_line2 != null ? address.address_line2 : ''; 
                    res.locals.city = address.city != null ? address.city : ''; 
                    res.locals.state = address.state != null ? address.state : ''; 
                    res.locals.postalCode = address.postal_code != null ? address.postal_code : ''; 
                    res.locals.country = address.country != null ? address.country : '';
                } else {
                    // No address found, set defaults
                    res.locals.addressLine1 = '';
                    res.locals.addressLine2 = '';
                    res.locals.city = '';
                    res.locals.state = '';
                    res.locals.postalCode = '';
                    res.locals.country = '';
                }
                next(); // Continue to the next middleware or route handler
            })
            
            .catch((error) => {
                console.error("Error fetching user or address details: ", error);
                next(); // Continue even if there's an error
            });
    } else {
        // No userId in session, continue without user details
        next();
    }
};

module.exports = fetchUserDetails;
