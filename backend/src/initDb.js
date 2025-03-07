import pool from './db.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';


// Convert import.meta.url to a file path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Utility function to load SQL files
const loadSQL = (filename) => {
    const fullPath = path.join(__dirname, 'sql', 'schema', filename);
    return fs.readFileSync(fullPath, { encoding: 'utf-8' });
};

// List of SQL files to run
const sqlFiles = [
    'createUsersTable.sql',
    'createLeaguesTable.sql',
    'createTeamsTable.sql',
    'createFixturesTable.sql',
    'createOddsTable.sql',
    'createBondRequestsTable.sql',
    'createBondRequestsReceivedTable.sql',
    'createBondValidationsTable.sql',
    'createWalletTransactionsTable.sql',
    'createUserSessionsTable.sql',
    'createWebpayTransactionsTable.sql',
    'createRecommendationsTable.sql'
];

// Function to create tables
async function createTables() {
    for (const file of sqlFiles) {
        const query = loadSQL(file);
        try {
            await pool.query(query);
            console.log(`Executed ${file} successfully`);
        } catch (err) {
            console.error(`Error executing ${file}:`, err);
        }
    }
}

// Run the table creation process
createTables()
    .then(() => {
        console.log('All tables created successfully');
        // pool.end(); // Close the connection pool
    })
    .catch(err => {
        console.error('Error creating tables:', err);
        pool.end();
    });
