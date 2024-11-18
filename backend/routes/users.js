import express from 'express';
import path from 'path';

const router = express.Router();

router.get('/users', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/users.html'));
});

export default router;