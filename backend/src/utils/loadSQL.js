import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';


// Convert import.meta.url to a file path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Utility function to load SQL files
const loadSQL = (filename) => {
    const fullPath = path.join(__dirname, '../sql', filename);
    return fs.readFileSync(fullPath, { encoding: 'utf-8' });
};

export default loadSQL;