const db = require('../db/db');

// Middleware to fetch user details
const fetchUserDetails = (req, res, next) => {
    if (req.session.userId) {
        db.promise()
            .query(`
                SELECT u.first_name, u.last_name, u.email, u.phone_number, u.role, password, 
                       a.address_line1, a.address_line2, a.city, a.state, a.postal_code, a.country
                FROM users u
                LEFT JOIN addresses a ON u.user_id = a.user_id
                WHERE u.user_id = ?
            `, [req.session.userId])
            .then(([userRows]) => {
                if (userRows.length > 0) {
                    const user = userRows[0];
                    res.locals.user = {
                        firstName: user.first_name || '',
                        lastName: user.last_name || '',
                        email: user.email || '',
                        phoneNumber: user.phone_number || '',
                        role: user.role || '',
                        password: user.password || '',
                        isAdmin: user.role === 'admin',
                        address: {
                            line1: user.address_line1 || '',
                            line2: user.address_line2 || '',
                            city: user.city || '',
                            state: user.state || '',
                            postalCode: user.postal_code || '',
                            country: user.country || '',
                        }
                    };
                }
                next(); 
            })
            .catch((error) => {
                console.error("Error fetching user details: ", error);
                next();
            });
    } else {
        next(); // Proceed even if no user in session
    }
};

module.exports = fetchUserDetails;
