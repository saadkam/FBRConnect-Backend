import Invoice from '../models/Invoice.js';

import Invoice from '../models/Invoice.js';

export const createInvoice = async (req, res) => {
  try {
    const {
      invoiceType,
      invoiceDate,
      sellerBusinessName,
      sellerAddress,
      sellerProvince,
      buyerNTNCNIC,
      buyerBusinessName,
      buyerProvince,
      buyerAddress,
      invoiceRefNo,
      items
    } = req.body;

    // Calculate total from item totals
    const totalValues = items.reduce((sum, item) => sum + item.totalValues, 0);

    const invoice = await Invoice.create({
      user: req.user._id,
      invoiceType,
      invoiceDate,
      sellerBusinessName,
      sellerAddress,
      sellerProvince,
      buyerNTNCNIC,
      buyerBusinessName,
      buyerProvince,
      buyerAddress,
      invoiceRefNo,
      items,
      synced: false,
      fbrStatus: 'Not Synced',
      fbrStatusCode: 'NS',
      fbrErrors: null
    });

    res.status(201).json(invoice);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

import axios from 'axios';
import User from '../models/User.js';
import Invoice from '../models/Invoice.js';

export const syncInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findOne({ _id: req.params.id, user: req.user._id });
    if (!invoice) return res.status(404).json({ message: 'Invoice not found' });

    const user = req.user;
    if (!user.fbrToken) return res.status(400).json({ message: 'FBR token not found for user' });

    const payload = {
      invoiceType: invoice.invoiceType,
      invoiceDate: invoice.invoiceDate,
      sellerBusinessName: invoice.sellerBusinessName,
      sellerAddress: invoice.sellerAddress,
      sellerProvince: invoice.sellerProvince,
      buyerNTNCNIC: invoice.buyerNTNCNIC,
      buyerBusinessName: invoice.buyerBusinessName,
      buyerProvince: invoice.buyerProvince,
      buyerAddress: invoice.buyerAddress,
      invoiceRefNo: invoice.invoiceRefNo || '',
      items: invoice.items.map(item => ({
        ...item.toObject()
      }))
    };

    const response = await axios.post(
      'https://gw.fbr.gov.pk/di_data/v1/di/postinvoicedata_sb', // change to prod URL later
      payload,
      {
        headers: {
          Authorization: `Bearer ${user.fbrToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const fbrRes = response.data;

    invoice.synced = true;
    invoice.fbrInvoiceNumber = fbrRes.invoiceNumber;
    invoice.fbrStatus = fbrRes.validationResponse?.status || 'Unknown';
    invoice.fbrStatusCode = fbrRes.validationResponse?.statuscode || '';
    invoice.fbrErrors = fbrRes.validationResponse?.errors || '';
    await invoice.save();

    res.json({
      message: 'Invoice synced successfully',
      invoiceNumber: fbrRes.invoiceNumber,
      status: invoice.fbrStatus,
      validation: fbrRes.validationResponse
    });

  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({
      message: 'FBR sync failed',
      error: err.response?.data || err.message
    });
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
