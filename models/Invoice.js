import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema({
  description: String,
  quantity: Number,
  rate: Number,
  tax: Number,
  hsCode: { type: String, required: true }
}, { _id: false });

const invoiceSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  invoiceNumber: { type: String, required: true },
  client: { type: String, required: true },
  dueDate: String,
  status: { type: String, default: 'Pending' },
  items: [itemSchema],
  totalAmount: Number,
  synced: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model('Invoice', invoiceSchema);
