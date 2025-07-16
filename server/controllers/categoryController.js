// controllers/categoryController.js
import Category from '../models/categoryModel.js';

export const createCategory = async (req, res) => {
  const tenantId = req.user?.tenantId;
  const { name } = req.body;

  if (!tenantId || !name) {
    return res.status(400).json({ message: "Tenant or name missing" });
  }

  try {
    const exists = await Category.findOne({ tenantId, name });
    if (exists) return res.status(409).json({ message: "Category already exists" });

    const newCategory = await Category.create({ tenantId, name });
    res.status(201).json(newCategory);
  } catch (error) {
    res.status(500).json({ message: 'Error creating category', error });
  }
};

export const getCategories = async (req, res) => {
  const tenantId = req.user?.tenantId;
  if (!tenantId) return res.status(401).json({ message: 'Unauthorized' });

  try {
    const categories = await Category.find({ tenantId }).sort({ createdAt: -1 });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching categories', error });
  }
};
