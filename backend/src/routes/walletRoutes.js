// MIDDLEWARES ELIMINADOS
import { getWalletBalance } from '../controllers/walletController.js';

import express from 'express';
import { addMoneyToWallet, getWalletInfo } from '../controllers/walletController.js';

const router = express.Router();

// Route to add money to the user's wallet
router.post('/wallet/add', addMoneyToWallet);

// Route to get user wallet info (balance + transaction history)
router.get('/wallet', getWalletInfo);

// Get Balance
router.get('/wallet/balance', getWalletBalance);

export default router;
