import pool from '../db.js';
import loadSQL from '../utils/loadSQL.js';

const findRecommendedFixtures = loadSQL('findRecommendedFixtures.sql');

const Worker = {

    // Function to get upcoming matches based on bond purchases
    async getUpcomingMatches(userId) {


        try {
            const result = await pool.query(findRecommendedFixtures, [userId]);
            return result.rows;
        } catch (error) {
            console.error("Error executing query:", error);
            throw error;
        }
    }
};

export default Worker;