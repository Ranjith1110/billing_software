import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema({
  item: String,
  qty: Number,
  amount: Number,
  sgst: Number,
  cgst: Number
});

const saleSchema = new mongoose.Schema({
  invoiceNo: { type: String, required: true },
  date: String,
  time: String,
  salesman: String,
  customerRef: String,
  customerName: String,
  paymentMode: String,
  priceType: String,
  items: [itemSchema],
  totalAmount: Number,
  totalGST: Number,
  tenantId: { type: String, required: true }
}, { timestamps: true });

// 🔥 FIX: Composite unique index
saleSchema.index({ invoiceNo: 1, tenantId: 1 }, { unique: true });

export default mongoose.model("Sale", saleSchema);