import pool from '../db.js';

const Wallet = {
    // Get the balance of a user by their ID
    async getBalance(user_id) {
        const query = 'SELECT balance FROM users WHERE id = $1';
        const result = await pool.query(query, [user_id]);
        return result.rows[0]?.balance || 0;  // Return the user's balance or 0 if not found
    },

    // Increase the balance by
    async increaseBalanceBy(user_id, amount) {
        const updateQuery = `
            UPDATE users 
            SET balance = balance + $1 
            WHERE id = $2 
            RETURNING id, username, balance;
        `;
        const result = await pool.query(updateQuery, [amount, user_id]);
        return result.rows[0]; // Returns the updated user with new balance
    },

    // Reduce the balance by
    async decreaseBalanceBy(user_id, amount) {
        const updateQuery = `
            UPDATE users 
            SET balance = balance - $1 
            WHERE id = $2 
            RETURNING id, username, balance;
        `;
        const result = await pool.query(updateQuery, [amount, user_id]);
        return result.rows[0]; // Returns the updated user with new balance
    },

    // Create a new transaction (can be linked to bond requests)
    async createTransaction({ user_id, request_id = null, amount, type, status = 'pending' }) {
        const insertQuery = `
            INSERT INTO wallet_transactions (user_id, request_id, amount, type, status)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *;
        `;
        const result = await pool.query(insertQuery, [user_id, request_id, amount, type, status]);
        return result.rows[0];
    },

    // Update the transaction status
    async updateTransactionStatus(transaction_id, status) {
        const updateQuery = `
            UPDATE wallet_transactions SET status = $1 WHERE id = $2 RETURNING *;
        `;
        const result = await pool.query(updateQuery, [status, transaction_id]);
        return result.rows[0];
    },

    // Find a transaction by bond request id
    async findTransactionByRequestId(request_id) {
        const query = 'SELECT * FROM wallet_transactions WHERE request_id = $1';
        const result = await pool.query(query, [request_id]);
        return result.rows[0];
    },

    // Get the current balance and the transaction history of a user, including Webpay and Wallet transactions
    async getWalletInfo(user_id) {
        const balanceQuery = `SELECT id, username, balance FROM users WHERE id = $1;`;

        // Combine transactions from both wallet_transactions and webpay_transactions tables
        const transactionsQuery = `
            SELECT id::VARCHAR AS id, type, amount, status, created_at, request_id 
            FROM wallet_transactions
            WHERE user_id = $1
            UNION ALL
            SELECT id, 'bond_purchase' AS type, amount, status, created_at, request_id 
            FROM webpay_transactions
            WHERE user_id = $1
            ORDER BY created_at DESC;
        `;

        // Execute the queries
        const userResult = await pool.query(balanceQuery, [user_id]);
        const transactionsResult = await pool.query(transactionsQuery, [user_id]);

        // Construct the wallet info object
        const walletInfo = {
            user: userResult.rows[0],
            transactions: transactionsResult.rows
        };

        return walletInfo; // Return user balance and combined transaction history
    }

};

export default Wallet;
