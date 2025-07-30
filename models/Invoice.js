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
  saleType: { type: String, required: true } // "Goods" or "Services"
}, { _id: false });

const invoiceSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

  invoiceType: {
    type: String,
    enum: ['Sale Invoice', 'Credit Note', 'Debit Note'],
    required: true
  },
  invoiceDate: { type: String, required: true },

  sellerBusinessName: { type: String, required: true },
  sellerAddress: { type: String, required: true },
  sellerProvince: { type: String, required: true },

  buyerNTNCNIC: { type: String, required: true },
  buyerBusinessName: { type: String, required: true },
  buyerProvince: { type: String, required: true },
  buyerAddress: { type: String, required: true },

  invoiceRefNo: { type: String }, // for debit/credit notes
  referenceInvoice: { type: mongoose.Schema.Types.ObjectId, ref: 'Invoice' },

  items: [itemSchema],

  paymentStatus: {
    type: String,
    enum: ['Unpaid', 'Partial', 'Paid'],
    default: 'Unpaid'
  },

  synced: { type: Boolean, default: false },
  fbrInvoiceNumber: { type: String },
  fbrStatusCode: { type: String },
  fbrStatus: { type: String },
  fbrErrors: { type: String }
}, { timestamps: true });

export default mongoose.model('Invoice', invoiceSchema);
