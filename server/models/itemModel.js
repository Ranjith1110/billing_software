import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema({
  tenantId: { type: String, required: true },
  code: { type: String, required: true },
  name: { type: String, required: true },
  category: { type: String, required: true },
  price1: { type: Number, default: 0 },
  price2: { type: Number, default: 0 },
  price3: { type: Number, default: 0 },
  price4: { type: Number, default: 0 },
  stock: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.model('Item', itemSchema);