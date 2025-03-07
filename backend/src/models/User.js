import pool from '../db.js';
import bcrypt from 'bcrypt';

const User = {
    // Create a new user
    async create({ username, email, password }) {
        const hashedPassword = await bcrypt.hash(password, 10);
        const insertQuery = `
            INSERT INTO users (username, email, password) 
            VALUES ($1, $2, $3) 
            RETURNING id, username, email, balance;
        `;
        const result = await pool.query(insertQuery, [username, email, hashedPassword]);
        return result.rows[0];  // Return the new user
    },

    // Find a user by their ID
    async findById(user_id) {
        const query = 'SELECT * FROM users WHERE id = $1';
        const result = await pool.query(query, [user_id]);
        return result.rows[0];  // Return the user if found
    },

    // Find a user by their email
    async findByEmail(email) {
        const query = 'SELECT * FROM users WHERE email = $1';
        const result = await pool.query(query, [email]);
        return result.rows[0];
    },

    // Find a user by their username
    async findByUsername(username) {
        const query = 'SELECT * FROM users WHERE username = $1';
        const result = await pool.query(query, [username]);
        return result.rows[0];
    },
    
    // Delete a user by their ID
    async delete(user_id) {
        const deleteQuery = 'DELETE FROM users WHERE id = $1 RETURNING *;';
        const result = await pool.query(deleteQuery, [user_id]);
        return result.rows[0];  // Return the deleted user
    },

    // Get the balance of a user by their ID
    async getBalance(user_id) {
        const query = 'SELECT balance FROM users WHERE id = $1';
        const result = await pool.query(query, [user_id]);
        return result.rows[0]?.balance || 0;  // Return the user's balance or 0 if not found
    },

    // Update the user's balance (increment or decrement)
    async updateBalance(user_id, newBalance) {
        const updateQuery = 'UPDATE users SET balance = $1 WHERE id = $2 RETURNING balance;';
        const result = await pool.query(updateQuery, [newBalance, user_id]);
        return result.rows[0].balance;  // Return the updated balance
    }
};

export default User;
