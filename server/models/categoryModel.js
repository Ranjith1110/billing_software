// models/categoryModel.js
import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  tenantId: { type: String, required: true },
  name: { type: String, required: true, unique: false }, // Allow same name for different tenants
}, { timestamps: true });

export default mongoose.model('Category', categorySchema);