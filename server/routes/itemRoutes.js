import express from 'express';
import multer from 'multer';
import { createItem, getItems, deleteItem, updateItem, bulkUploadItems } from '../controllers/itemController.js';
import { protectRoute } from '../middlewares/auth.js';

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.use(protectRoute);

router.post('/', createItem);
router.get('/', getItems);
router.delete('/:id', deleteItem);
router.put('/:id', updateItem);
router.post('/bulk', upload.single('file'), bulkUploadItems); // Bulk route

export default router;