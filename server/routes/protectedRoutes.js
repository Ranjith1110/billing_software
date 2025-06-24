import express from 'express';
import auth from '../middlewares/auth.js';

const router = express.Router();

router.get('/dashboard', auth, (req, res) => {
  res.json({ message: `Hello, ${req.user.username}! Welcome to your dashboard.` });
});

export default router;
