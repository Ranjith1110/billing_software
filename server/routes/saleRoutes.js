import express from 'express';
import { createSale, getNextInvoiceNo } from '../controllers/saleController.js';
import { protectRoute } from '../middlewares/auth.js';

const router = express.Router();

router.post('/', protectRoute, createSale);
router.get('/latest', protectRoute, getNextInvoiceNo);

export default router;