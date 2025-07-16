import Item from '../models/itemModel.js';
import XLSX from 'xlsx';
import { generateItemCode } from '../utils/generateCode.js';

export const bulkUploadItems = async (req, res) => {
  const tenantId = req.user?.tenantId;
  if (!tenantId) return res.status(401).json({ message: 'Unauthorized' });

  try {
    const file = req.file;
    if (!file) return res.status(400).json({ message: 'No file uploaded' });

    const workbook = XLSX.read(file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

    // Optional: log parsed data
    console.log("Parsed Excel Data:", data);

    // Use Promise.all to await generateItemCode for each row
    const mappedData = await Promise.all(
      data.map(async (row) => {
        const code = await generateItemCode();
        return {
          code,
          name: row["Item Name"] || row.name || row.Name || "Unnamed",
          category: row.Category || "Others",
          price1: Number(row["Price 1"] || row.price1 || 0),
          price2: Number(row["Price 2"] || row.price2 || 0),
          price3: Number(row["Price 3"] || row.price3 || 0),
          price4: Number(row["Price 4"] || row.price4 || 0),
          stock: Number(row.Stock || row.stock || 0),
          tenantId,
        };
      })
    );

    const inserted = await Item.insertMany(mappedData);
    res.status(201).json({ message: 'Items uploaded successfully', items: inserted });
  } catch (error) {
    console.error("Bulk upload error:", error);
    res.status(500).json({ message: 'Bulk upload failed', error });
  }
};


export const createItem = async (req, res) => {
  const tenantId = req.user?.tenantId;
  if (!tenantId) return res.status(401).json({ message: 'Unauthorized' });

  try {
    const code = await generateItemCode();

    const newItem = await Item.create({
      ...req.body,
      code,
      tenantId,
    });

    res.status(201).json(newItem);
  } catch (error) {
    res.status(500).json({ message: 'Error creating item', error });
  }
};

export const getItems = async (req, res) => {
  const tenantId = req.user?.tenantId;
  if (!tenantId) return res.status(401).json({ message: 'Unauthorized' });

  try {
    const items = await Item.find({ tenantId });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching items', error });
  }
};

export const deleteItem = async (req, res) => {
  const tenantId = req.user?.tenantId;
  try {
    const item = await Item.findOneAndDelete({ _id: req.params.id, tenantId });
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.json({ message: 'Item deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting item', error });
  }
};

export const updateItem = async (req, res) => {
  const tenantId = req.user?.tenantId;
  try {
    const updatedItem = await Item.findOneAndUpdate(
      { _id: req.params.id, tenantId },
      req.body,
      { new: true }
    );
    if (!updatedItem) return res.status(404).json({ message: 'Item not found' });
    res.json(updatedItem);
  } catch (error) {
    res.status(500).json({ message: 'Error updating item', error });
  }
};