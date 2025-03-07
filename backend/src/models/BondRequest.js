import pool from '../db.js';
import { v4 as uuidv4 } from 'uuid';

const BondRequest = {
    // Create a new bond request for our users
    async create({ fixture_id, user_id, group_id, league_name, round, date, result, quantity, seller, odds_name, odds_values, wallet }) {
        const requestId = uuidv4();


        const insertQuery = `
            INSERT INTO bond_requests (id, fixture_id, user_id, group_id, league_name, round, date, result, deposit_token, datetime, quantity, seller, odds_name, odds_values, status, wallet)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, '', NOW(), $9, $10, $11, $12, 'pending', $13)
            RETURNING *;
        `;
        const request = await pool.query(insertQuery, [
            requestId, 
            fixture_id, 
            user_id, 
            group_id, 
            league_name, 
            round, 
            date, 
            result, 
            quantity, 
            seller,
            odds_name,
            JSON.stringify(odds_values),
            wallet
        ]);
        return request.rows[0];
    },

    // Find a bond request by request_id in bond_requests table
    async findById(request_id) {
        const query = 'SELECT * FROM bond_requests WHERE id = $1';
        const result = await pool.query(query, [request_id]);
        return result.rows[0];
    },

    // Find a bond request by token in bond_requests table
    async findByDepositToken(token) {
        const query = 'SELECT * FROM bond_requests WHERE deposit_token = $1';
        const result = await pool.query(query, [token]);
        return result.rows[0];
    },

    // Fetch all bond requests
    async findAll() {
        const query = 'SELECT * FROM bond_requests';
        const result = await pool.query(query);
        return result.rows;
    },

    async findBondsByUserID(userID) {
        const query = `
            SELECT 
                br.*,
                f.home_team_id,
                f.away_team_id
            FROM 
                bond_requests br
            JOIN 
                fixtures f ON br.fixture_id = f.fixture_id
            WHERE 
                br.user_id = $1
        `;
        const result = await pool.query(query, [userID]);
        return result.rows;
    },
    
    // Update bond request status
    async updateStatus(request_id, status) {
        const updateQuery = `
            UPDATE bond_requests SET status = $1 WHERE id = $2 RETURNING *;
        `;
        const result = await pool.query(updateQuery, [status, request_id]);
        return result.rows[0];
    },

    // Update bond request status by token
    async updateStatusByDepositToken(token, status) {
        const updateQuery = `
            UPDATE bond_requests SET status = $1 WHERE deposit_token = $2 RETURNING *;
        `;
        const result = await pool.query(updateQuery, [status, token]);
        return result.rows[0];
    },

    // Fetch all valid bond requests for a given fixture
    async findValidRequestsByFixture(fixture_id) {
        const bondRequestsQuery = `
            SELECT * FROM bond_requests WHERE fixture_id = $1 AND status = 'valid';
        `;
        const bondRequestsResult = await pool.query(bondRequestsQuery, [fixture_id]);
        return bondRequestsResult.rows; // Return all matching bond requests
    },

    // Update deposit token
    async updateDepositToken(id, deposit_token) {
        const updateQuery = `
            UPDATE bond_requests SET deposit_token = $1 WHERE id = $2 RETURNING *;
        `;
        const result = await pool.query(updateQuery, [deposit_token, id]);
        return result.rows[0];
    },

    // Delete a bond request
    async delete(request_id) {
        const deleteQuery = 'DELETE FROM bond_requests WHERE id = $1';
        await pool.query(deleteQuery, [request_id]);
        console.log(`Deleted bond request ${request_id}`);
    }
};

export default BondRequest;
