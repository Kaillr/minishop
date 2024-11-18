import express from 'express';
import { isAuthenticated } from '../middleware/auth.js';
import bcrypt from 'bcrypt';
import db from '../db/db.js';

const router = express.Router();

router.get("/", isAuthenticated, (req, res) => {
    res.render("security", {
        title: "Profile Security",
    });
});

router.post("/", async (req, res) => {
    const { currentPassword, newPassword, confirmPassword } = req.body;
    
    try {
        // Validate the current password
        const isMatch = await bcrypt.compare(currentPassword, res.locals.user.password);
        if (!isMatch) {
            res.status(400).json({ error: "Invalid current password" });
        } else {
            // Validate the new password
            if (newPassword.length < 8) {
                return res.status(400).json({ error: "New password must be at least 8 characters long" });
            } else if (newPassword !== confirmPassword) {
                return res.status(400).json({ error: "New passwords do not match" });
            } else {
                const hashedPassword = await bcrypt.hash(newPassword, 10);
                
                await db.promise().query(
                    "UPDATE users SET password =? WHERE user_id =?",
                    [hashedPassword, req.session.userId]
                );

                res.json({ success: true });
            }
        }
    } catch(error) {
        console.error(error);
        res.status(500).json({ error: "An error occurred while updating your profile" });
    }
}); 

export default router;