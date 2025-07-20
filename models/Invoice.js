import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema({
  hsCode: { type: String, required: true },
  productDescription: { type: String, required: true },
  rate: { type: String, required: true }, // e.g., "17%"
  uoM: { type: String, required: true },
  quantity: { type: Number, required: true },
  totalValues: { type: Number, required: true },
  valueSalesExcludingST: { type: Number, required: true },
  salesTaxApplicable: { type: Number, required: true },
  salesTaxWithheldAtSource: { type: Number, required: true },
  extraTax: { type: Number, default: 0 },
  furtherTax: { type: Number, default: 0 },
  sroScheduleNo: { type: String },
  sroItemSerialNo: { type: String },
  fedPayable: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  saleType: { type: String, required: true }, // "Goods" or "Services"
}, { _id: false });

const invoiceSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

  invoiceType: { type: String, required: true }, // e.g., "Sale Invoice"
  invoiceDate: { type: String, required: true }, // ISO format: YYYY-MM-DD

  sellerBusinessName: { type: String, required: true },
  sellerAddress: { type: String, required: true },
  sellerProvince: { type: String, required: true },

  buyerNTNCNIC: { type: String, required: true },
  buyerBusinessName: { type: String, required: true },
  buyerProvince: { type: String, required: true },
  buyerAddress: { type: String, required: true },

  invoiceRefNo: { type: String }, // for debit/credit notes

  items: [itemSchema],

  // Flags
  synced: { type: Boolean, default: false },

  // FBR response storage
  fbrInvoiceNumber: { type: String },
  fbrStatusCode: { type: String },
  fbrStatus: { type: String },
  fbrErrors: { type: String },
}, { timestamps: true });

export default mongoose.model('Invoice', invoiceSchema);
