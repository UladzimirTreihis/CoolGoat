import pool from './db.js';

// Function to drop all tables
async function dropAllTables() {
    try {
        // Get the names of all tables in the current schema
        const result = await pool.query(`
            SELECT tablename
            FROM pg_tables
            WHERE schemaname = current_schema();
        `);

        const tableNames = result.rows.map(row => row.tablename);

        if (tableNames.length === 0) {
            console.log('No tables found to drop.');
            return;
        }

        // Generate and execute drop table commands
        for (const tableName of tableNames) {
            try {
                await pool.query(`DROP TABLE IF EXISTS ${tableName} CASCADE;`);
                console.log(`Dropped table ${tableName} successfully`);
            } catch (err) {
                console.error(`Error dropping table ${tableName}:`, err);
            }
        }
    } catch (err) {
        console.error('Error retrieving table names:', err);
    } finally {
        pool.end(); // Close the connection pool
    }
}

// Run the table drop process
dropAllTables();
