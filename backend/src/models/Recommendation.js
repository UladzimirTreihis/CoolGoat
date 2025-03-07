import pool from "../db.js";
import loadSQL from "../utils/loadSQL.js";

const insertRecommendationSQL = loadSQL("insertRecommendation.sql");
const findFixtureByIdSQL = loadSQL('findFixtureById.sql');

const Recommendation = {
    async getRecommendedFixtures(user_id) {
        // Get all recommended fixtures for a user sorted by recommendation date
        const query = 'SELECT fixture_id, created_at FROM recommendations WHERE user_id = $1 ORDER BY created_at DESC';
        const result = await pool.query(query, [user_id]);

        const lastUpdate = result.rows[0]?.created_at;

        console.log(`Found ${result.rows.length} recommended fixtures for user ${user_id}`);
        console.log("###############");
        console.log(result.rows);
        console.log("###############");

        const fixtures = [];
        for (const row of result.rows) {
            if (row.fixture_id) {
                console.log(`Recommended fixture: ${row.fixture_id} recommended at ${row.created_at}`);
                let fixture_result = await pool.query(findFixtureByIdSQL, [row.fixture_id]);
                console.log(fixture_result.rows[0]);
                const fixtureData = fixture_result.rows[0];
                const fixture = {
                    recommended_at: row.created_at,
                    fixture_id: row.fixture_id,
                    date: fixtureData.date,
                    timestamp: fixtureData.timestamp,
                    timezone: fixtureData.timezone,
                    status: {
                        long: fixtureData.status_long,
                        short: fixtureData.status_short,
                        elapsed: fixtureData.status_elapsed,
                    },
                    goals: {
                        home: fixtureData.goals_home,
                        away: fixtureData.goals_away,
                    },
                    referee: fixtureData.referee,
                    updated_at: fixtureData.updated_at,
                    home_team: {
                        name: fixtureData.home_team_name,
                        logo: fixtureData.home_team_logo,
                    },
                    away_team: {
                        name: fixtureData.away_team_name,
                        logo: fixtureData.away_team_logo,
                    },
                    odds: result.rows.map(row => ({
                        id: row.odds_id,
                        name: row.odds_name,
                        values: row.odds_values,
                    })),
                    remaining_bonds: fixtureData.remaining_bonds
                };
                fixtures.push(fixture);
            }
        }

        return { fixtures, lastUpdate };
    },

    async create(data) {
        const { user_id, fixture_id } = data;
        try {
            const result = await pool.query(insertRecommendationSQL, [user_id, fixture_id]);
            return result.rows[0].id;
        } catch (err) {
            console.error('Error creating recommendation:', err);
            throw err;
        }
    }
}

export default Recommendation;