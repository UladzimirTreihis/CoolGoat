import pkg from 'pg';
import { dbConfig } from '../config/config.js';

const { Pool } = pkg; 

const pool = new Pool({
    user: dbConfig.user,
    host: dbConfig.host,
    database: dbConfig.database,
    password: dbConfig.password,
    port: dbConfig.port,
});

pool.on('connect', () => {
    console.log('Connected to PostgreSQL');
});

pool.on('error', (err) => {
    console.error('Error connecting to PostgreSQL:', err);
});

export default pool;