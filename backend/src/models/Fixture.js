import pool from '../db.js';
import path from 'path';
import { fileURLToPath } from 'url';
import loadSQL from '../utils/loadSQL.js';

// Load SQL queries
const insertLeagueSQL = loadSQL('insertLeague.sql');
const insertTeamSQL = loadSQL('insertTeam.sql');
const insertFixtureSQL = loadSQL('insertFixture.sql');
const insertOddsSQL = loadSQL('insertOdds.sql');
const baseQuery = loadSQL('findAllFixtures.sql');

// Helper functions to insert or find entities
async function insertOrGetId(query, values) {
    try {
        const result = await pool.query(query, values);
        return result.rows[0].id;
    } catch (err) {
        console.error('Error inserting or retrieving ID:', err);
        throw err;
    }
}

const Fixture = {
    async create(data) {
        const { league, fixture, teams, odds, goals } = data;

        try {
            // Insert league
            const leagueId = await insertOrGetId(insertLeagueSQL, [
                league.id, league.name, league.country, league.logo, league.flag, league.season, league.round
            ]);

            // Insert teams
            const homeTeamId = await insertOrGetId(insertTeamSQL, [
                teams.home.id, teams.home.name, teams.home.logo
            ]);
            const awayTeamId = await insertOrGetId(insertTeamSQL, [
                teams.away.id, teams.away.name, teams.away.logo
            ]);

            // Insert fixture with referee
            const fixtureId = await insertOrGetId(insertFixtureSQL, [
                fixture.id, leagueId, homeTeamId, awayTeamId,
                fixture.timezone, fixture.date, fixture.timestamp,
                fixture.status.long, fixture.status.short, fixture.status.elapsed,
                goals.home, goals.away,
                fixture.referee
            ]);

            // Insert odds linked to this fixture
            if (odds && odds.length > 0) {
                for (let odd of odds) {
                    await pool.query(insertOddsSQL, [fixture.id, odd.name, JSON.stringify(odd.values)]);
                }
            }

            console.log(`Fixture ${fixture.id} and associated odds inserted successfully`);

        } catch (err) {
            console.error('Error saving fixture and odds to PostgreSQL:', err);
            throw err;
        }
    },
    async findById(fixture_id) {
        const findFixtureByIdSQL = loadSQL('findFixtureById.sql');
        try {
            const result = await pool.query(findFixtureByIdSQL, [fixture_id]);
            if (result.rows.length === 0) {
                return null; // Fixture not found
            }

            const fixtureData = result.rows[0];
            const fixture = {
                fixture: {
                    fixture_id: fixtureData.fixture_id,
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
                    remaining_bonds: fixtureData.remaining_bonds,
                },
                league: {
                    id: fixtureData.league_id,
                    name: fixtureData.league_name,
                    country: fixtureData.league_country,
                    logo: fixtureData.league_logo,
                    flag: fixtureData.league_flag,
                    season: fixtureData.league_season,
                    round: fixtureData.league_round,
                },
                teams: {
                    home: {
                        id: fixtureData.home_team_id,
                        name: fixtureData.home_team_name,
                        logo: fixtureData.home_team_logo,
                    },
                    away: {
                        id: fixtureData.away_team_id,
                        name: fixtureData.away_team_name,
                        logo: fixtureData.away_team_logo,
                    }
                },
                odds: result.rows.map(row => ({
                    id: row.odds_id,
                    name: row.odds_name,
                    values: row.odds_values,
                }))
            };

            return fixture;
        } catch (err) {
            console.error('Error retrieving fixture by ID:', err);
            throw err;
        }
    },

    async findAll({ page = 1, count = 25, home, away, date }) {
        let query = baseQuery;
        let countQuery = `
            SELECT COUNT(DISTINCT f.fixture_id) AS total
            FROM 
                fixtures f
            LEFT JOIN 
                teams ht ON f.home_team_id = ht.id
            LEFT JOIN 
                teams at ON f.away_team_id = at.id
            WHERE 1=1`;
        const values = [];
        const countValues = [];
        let i = 1;

        count = parseInt(count, 10);
        if (isNaN(count) || count <= 0) {
            count = 25;
        }

        page = parseInt(page, 10);
        if (isNaN(page) || page <= 0) {
            page = 1;
        }
    
        // Add conditions based on home and visit filters
        if (home) {
            query += ` AND ht.name ILIKE $${i}`;
            countQuery += ` AND ht.name ILIKE $${i}`;
            values.push(`%${home}%`);
            countValues.push(`%${home}%`);
            i++;
        }
    
        if (away) {
            query += ` AND at.name ILIKE $${i}`;
            countQuery += ` AND at.name ILIKE $${i}`;
            values.push(`%${away}%`);
            countValues.push(`%${away}%`);
            i++;
        }
    
        // Date filtering logic
        if (date) {
            query += ` AND DATE(f.date) = $${i}`;
            countQuery += ` AND DATE(f.date) = $${i}`;
            values.push(date);
            countValues.push(date);
            i++;
        } else if (home || away) {
            query += ` AND f.date >= NOW()`;
            countQuery += ` AND f.date >= NOW()`;
        }

        // Only select fixtures with remaining bonds greater than 0
        query += ` AND f.remaining_bonds > 0`;
        countQuery += ` AND f.remaining_bonds > 0`;
    
        // Add pagination
        query += `
            ORDER BY f.date DESC, f.fixture_id DESC
            LIMIT $${i++} OFFSET $${i++}
        `;
        values.push(count);
        values.push((page - 1) * count);
    
        try {
            const countResult = await pool.query(countQuery, countValues);
            const totalFixtures = countResult.rows[0].total;
            const result = await pool.query(query, values);

            const fixtureIds = result.rows.map(row => row.fixture_id);
            const oddsQuery = `
                SELECT fixture_id, name, values
                FROM odds
                WHERE fixture_id = ANY($1)
            `;
            const oddsResult = await pool.query(oddsQuery, [fixtureIds]);

            // Group odds by fixture_id
            const oddsByFixtureId = oddsResult.rows.reduce((acc, row) => {
                if (!acc[row.fixture_id]) {
                    acc[row.fixture_id] = [];
                }
                acc[row.fixture_id].push({
                    name: row.odd_name,
                    values: row.odd_values
                });
                return acc;
            }, {});
    
            // Combine fixtures and their corresponding odds
            const fixtures = result.rows.map(row => ({
                fixture_id: row.fixture_id,
                date: row.date,
                timestamp: row.timestamp,
                timezone: row.timezone,
                status: {
                    long: row.status_long,
                    short: row.status_short,
                    elapsed: row.status_elapsed
                },
                goals: {
                    home: row.goals_home,
                    away: row.goals_away
                },
                referee: row.referee,
                updated_at: row.updated_at,
                home_team: {
                    name: row.home_team_name,
                    logo: row.home_team_logo
                },
                away_team: {
                    name: row.away_team_name,
                    logo: row.away_team_logo
                },
                odds: oddsByFixtureId[row.fixture_id] || [],
                remaining_bonds: row.remaining_bonds
            }));
    
            return {
                fixtures: Object.values(fixtures),
                total: totalFixtures,
                totalPages: Math.ceil(totalFixtures / count),
            }

        } catch (err) {
            console.error('Error fetching fixtures:', err);
            throw err;
        }
    },
    // Other methods like findAll, findById, and filter would go here

    // Update remaining bonds for a fixture
    async updateRemainingBonds(fixture_id, newRemainingBonds) {
        const query = 'UPDATE fixtures SET remaining_bonds = $1 WHERE fixture_id = $2';
        await pool.query(query, [newRemainingBonds, fixture_id]);
        console.log(`Updated fixture ${fixture_id} with remaining bonds: ${newRemainingBonds}`);
    },

    // Get odds_values for a fixture
    async getOdds(fixture_id, name) {
        const query = 'SELECT values FROM odds WHERE fixture_id = $1 AND name = $2';
        const result = await pool.query(query, [fixture_id, name]);
        
        // Return the values of the odds, or null if not found
        return result.rows[0] ? result.rows[0].values : null;
    }
};

export default Fixture;
