import express from 'express';
import axios from 'axios';
import { 
          createInvoice,
          syncInvoice,
          getInvoices,
          getInvoiceById,
          updateInvoice,
          deleteInvoice,
          getUnsyncedInvoices, 
          createNote,
          getInvoiceStats,
          updatePaymentStatus 
        } from '../controllers/invoiceController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// router.post('/', async (req, res) => {
//   const invoice = req.body;

//   try {
//     const response = await axios.post(process.env.FBR_API_URL, invoice, {
//       headers: {
//         'Authorization': `Bearer ${process.env.FBR_API_KEY}`,
//         'Content-Type': 'application/json',
//       },
//     });

//     res.status(200).json({ success: true, fbrResponse: response.data });
//   } catch (error) {
//     console.error(error.response?.data || error.message);
//     res.status(500).json({ success: false, message: 'Failed to sync with FBR', error: error.response?.data });
//   }
// });


router.post('/:id/sync', protect, syncInvoice);
router.post('/', protect, createInvoice);
router.get('/unsynced', protect, getUnsyncedInvoices);
router.get('/stats', protect, getInvoiceStats);
router.patch('/:id/payment', protect, updatePaymentStatus);
router.get('/', protect, getInvoices);
router.get('/:id', protect, getInvoiceById);
router.put('/:id', protect, updateInvoice);
router.delete('/:id', protect, deleteInvoice);
router.post('/note', protect, createNote);

export default router;
