import pool from '../db.js';

const BondValidation = {
    // Create a new bond validation (this could be used to store validation results)
    async create({ request_id, fixture_id, valid }) {
        const insertQuery = `
            INSERT INTO bond_validations (request_id, fixture_id, valid, validation_date)
            VALUES ($1, $2, $3, NOW())
            RETURNING *;
        `;
        const result = await pool.query(insertQuery, [request_id, fixture_id, valid]);
        return result.rows[0];
    },

    // Find a bond validation by request_id
    async findByRequestId(request_id) {
        const query = 'SELECT * FROM bond_validations WHERE request_id = $1';
        const result = await pool.query(query, [request_id]);
        return result.rows[0];
    },

    // Delete a bond validation
    async deleteByRequestId(request_id) {
        const deleteQuery = 'DELETE FROM bond_validations WHERE request_id = $1';
        await pool.query(deleteQuery, [request_id]);
        console.log(`Deleted bond validation for request ${request_id}`);
    }
};

export default BondValidation;
