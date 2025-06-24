import Item from '../models/itemModel.js';

export const createItem = async (req, res) => {
  try {
    console.log('Creating item:', req.body);
    const item = new Item(req.body);
    const saved = await item.save();
    return res.status(201).json(saved);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Create failed', error: err.message });
  }
};

export const getAllItems = async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Fetch failed', error: err.message });
  }
};
