import Wallet from '../models/Wallet.js';
import { getUserIdFromScopes } from '../utils/authUtils.js';


// Dummy payment route: Always successful, updates balance, and adds a transaction
export const addMoneyToWallet = async (req, res) => {
    const user_id = getUserIdFromScopes(req);  // Get the user ID from the JWT payload
    const { amount } = req.body;  // Only get the amount from the body

    try {
        // Update balance
        const updatedUser = await Wallet.increaseBalanceBy(user_id, amount);

        // Add transaction (type: 'deposit')
        const transaction = await Wallet.createTransaction({
            user_id,
            amount,
            status: "completed",
            type: "deposit"
        });

        return res.status(200).json({
            message: 'Money added successfully',
            balance: updatedUser.balance,
            transaction
        });
    } catch (err) {
        console.error('Error adding money to wallet:', err);
        return res.status(500).json({ message: 'Server error' });
    }
};


// Get user wallet information (balance + transaction history)
export const getWalletInfo = async (req, res) => {
    // console.log(req);
    const user_id = getUserIdFromScopes(req);  // Get the user ID from the JWT payload

    try {
        const walletInfo = await Wallet.getWalletInfo(user_id);
        return res.status(200).json(walletInfo);
    } catch (err) {
        console.error('Error fetching wallet info:', err);
        return res.status(500).json({ message: 'Server error' });
    }
};

export const getWalletBalance = async (req, res) => {
    const user_id = getUserIdFromScopes(req) 
    try {
      const balance = await Wallet.getBalance(user_id);
      return res.status(200).json({ balance });
    } catch (err) {
      console.error('Error fetching balance:', err);
      return res.status(500).json({ message: 'Server error' });
    }
};
