import express from 'express';
import { loginUser, registerUser } from '../controllers/authController.js';
import { protectRoute } from '../middlewares/auth.js';

const router = express.Router();

router.post('/login', loginUser);

// Protected testing route
router.post('/signup', registerUser); // Use Postman only

// Example protected route
router.get('/dashboard', protectRoute, (req, res) => {
  res.json({ message: `Welcome to tenant ${req.user.tenantId}'s dashboard.` });
});

export default router;
