import Invoice from '../models/Invoice.js';

export const createInvoice = async (req, res) => {
  try {
    const { invoiceNumber, client, dueDate, items } = req.body;

    const totalAmount = items.reduce((sum, item) =>
      sum + item.quantity * item.rate + (item.tax || 0), 0
    );

    const invoice = await Invoice.create({
      user: req.user._id,
      invoiceNumber,
      client,
      dueDate,
      items,
      totalAmount,
    });

    res.status(201).json(invoice);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// GET all invoices for current user
export const getInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(invoices);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching invoices', error: err.message });
  }
};

// GET single invoice
export const getInvoiceById = async (req, res) => {
  try {
    const invoice = await Invoice.findOne({ _id: req.params.id, user: req.user._id });
    if (!invoice) return res.status(404).json({ message: 'Invoice not found' });
    res.json(invoice);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching invoice', error: err.message });
  }
};

// PUT update invoice
export const updateInvoice = async (req, res) => {
  try {
    const updated = await Invoice.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'Invoice not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Error updating invoice', error: err.message });
  }
};

// DELETE invoice
export const deleteInvoice = async (req, res) => {
  try {
    const deleted = await Invoice.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!deleted) return res.status(404).json({ message: 'Invoice not found' });
    res.json({ message: 'Invoice deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting invoice', error: err.message });
  }
};
