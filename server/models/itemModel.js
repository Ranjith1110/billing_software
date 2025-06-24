import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema({
  code: { type: String, required: true },
  name: { type: String, required: true },
  category: { type: String, required: true },
  price1: { type: Number, required: true },
  price2: Number,
  price3: Number,
  price4: Number,
  stock: { type: Number, required: true },
}, { timestamps: true });

export default mongoose.model('Item', itemSchema);
