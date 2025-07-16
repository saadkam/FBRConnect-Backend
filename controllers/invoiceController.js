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
