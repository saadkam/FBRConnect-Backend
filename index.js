import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import invoiceRoutes from './routes/invoice.js';

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/invoice', invoiceRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));
