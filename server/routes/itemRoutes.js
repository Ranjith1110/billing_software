import express from 'express';
import { createItem, getAllItems } from '../controllers/itemController.js';
const router = express.Router();

router.route('/')
  .post(createItem)
  .get(getAllItems);

export default router;
