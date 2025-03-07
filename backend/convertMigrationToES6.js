import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the current directory of the script for ES6 modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Function to update a migration file to ES6 syntax
const convertToES6 = async (migrationFilePath) => {
  const fullPath = path.resolve(__dirname, migrationFilePath);

  try {
    const data = await fs.readFile(fullPath, 'utf8');

    // Replace `exports.up` and `exports.down` with ES6 module syntax
    let updatedData = data.replace(/exports\.up\s*=\s*function/g, 'export async function up')
                          .replace(/exports\.down\s*=\s*function/g, 'export async function down');

    // Write the updated content back to the file
    await fs.writeFile(fullPath, updatedData, 'utf8');
    console.log(`Successfully updated the file: ${fullPath}`);
  } catch (err) {
    console.error('Error processing the migration file:', err);
  }
};

// Provide the migration file path as an argument when running the script
const migrationFilePath = process.argv[2];

if (!migrationFilePath) {
  console.error('Please provide a migration file path as an argument.');
  process.exit(1);
}

// Call the conversion function
convertToES6(migrationFilePath);
