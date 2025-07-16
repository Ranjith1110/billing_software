// routes/categoryRoutes.js
import express from 'express';
import { createCategory, getCategories } from '../controllers/categoryController.js';
import { protectRoute } from '../middlewares/auth.js';

const router = express.Router();

router.use(protectRoute);
router.post('/', createCategory);
router.get('/', getCategories);

export default router;
