// src/models/WebpayTransaction.js
import pool from '../db.js';
import { v4 as uuidv4 } from 'uuid'; // Use UUID v4

const WebpayTransaction = {
    // Create a new Webpay transaction
    async create({ user_id, request_id, amount }) {
        // get buy_order
        const id = "O-" + uuidv4().replace(/-/g, '').slice(0, 24);
        const insertQuery = `
            INSERT INTO webpay_transactions (id, user_id, request_id, amount)
            VALUES ($1, $2, $3, $4)
            RETURNING *;
        `;
        const result = await pool.query(insertQuery, [
            id,
            user_id,
            request_id,
            amount
        ]);
        return result.rows[0];
    },

    // Update the transaction status
    async updateTransactionStatus(id, status) {
        const updateQuery = `
            UPDATE webpay_transactions SET status = $1 WHERE id = $2 RETURNING *;
        `;
        const result = await pool.query(updateQuery, [status, id]);
        return result.rows[0];
    },

    // Update the transaction status by token
    async updateTransactionStatusByToken(token, status) {
        const updateQuery = `
            UPDATE webpay_transactions SET status = $1 WHERE token = $2 RETURNING *;
        `;
        const result = await pool.query(updateQuery, [status, token]);
        return result.rows[0];
    },

    // Find a transaction by bond request id
    async findTransactionById(id) {
        const query = 'SELECT * FROM webpay_transactions WHERE id = $1';
        const result = await pool.query(query, [id]);
        return result.rows[0];
    },

    // Update deposit token
    async updateDepositToken(id, deposit_token) {
        const updateQuery = `
            UPDATE webpay_transactions SET token = $1 WHERE id = $2 RETURNING *;
        `;
        const result = await pool.query(updateQuery, [deposit_token, id]);
        return result.rows[0];
    }
};

export default WebpayTransaction;
