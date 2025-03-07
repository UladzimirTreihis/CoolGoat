import app from './app.js';
import { serverConfig } from '../config/config.js';
import pool from './db.js';
import './initDb.js';

pool.connect()
    .then(() => {
        app.listen(serverConfig.port, () => {
            console.log(`Server running on port ${serverConfig.port}`);
        });
    })
    .catch(err => {
        console.error('Failed to connect to PostgreSQL:', err);
    });
