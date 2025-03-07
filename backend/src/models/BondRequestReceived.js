import pool from '../db.js';

const BondRequestReceived = {
    // Create a new bond request in the database
    async create({ request_id, fixture_id, group_id, league_name, round, date, result, deposit_token, datetime, quantity, seller }) {
        const insertQuery = `
            INSERT INTO bond_requests_received (id, fixture_id, group_id, league_name, round, date, result, deposit_token, datetime, quantity, seller)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
            RETURNING *;
        `;
        const requestReceived = await pool.query(insertQuery, [
            request_id, 
            fixture_id, 
            group_id, 
            league_name, 
            round, 
            date, 
            result, 
            deposit_token,
            datetime,
            quantity, 
            seller
        ]);
        console.log(`BondRequestReceived for ${request_id} added successfully`)
        return requestReceived.rows[0];
    },

    // Find a bond request by request_id
    async findById(request_id) {
        const query = 'SELECT * FROM bond_requests_received WHERE id = $1';
        const result = await pool.query(query, [request_id]);
        return result.rows[0];
    },

    // Update bond request status
    // async updateStatus(request_id, status) {
    //     const updateQuery = `
    //         UPDATE bond_requests SET status = $1 WHERE id = $2 RETURNING *;
    //     `;
    //     const result = await pool.query(updateQuery, [status, request_id]);
    //     return result.rows[0];
    // },

    // Delete a bond request
    async delete(request_id) {
        const deleteQuery = 'DELETE FROM bond_requests_received WHERE id = $1';
        await pool.query(deleteQuery, [request_id]);
        console.log(`Deleted bond request ${request_id}`);
    }
};

export default BondRequestReceived;
