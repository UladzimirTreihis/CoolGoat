import express from 'express';
import { createPurchaseRequest, commitTransaction } from '../controllers/webpayController.js';

const router = express.Router();

// Route to handle user purchase request
router.post('/webpay/purchase', createPurchaseRequest);
router.post('/webpay/commit', commitTransaction);

export default router;
