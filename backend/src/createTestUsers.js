import pool from './db.js'; // Import the pool from your db.js
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid'; // To generate UUID for session IDs
import dotenv from 'dotenv';
import loadSQL from './utils/loadSQL.js'

dotenv.config(); // Load environment variables

// Set up sql queries
const insertUserSQL = loadSQL('insertUser.sql');
const insertUserSessionSQL = loadSQL('insertUserSession.sql')

// Helper function to insert a user and return the user ID
async function createUser(username, email, password) {
  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the user into the database
    const result = await pool.query(insertUserSQL, [username, email, hashedPassword]);
    return result.rows[0].id; // Return the user ID
  } catch (err) {
    console.error('Error creating user:', err);
    throw err;
  }
}

// Helper function to generate a JWT token and insert into user_sessions table
async function createUserSession(userId) {
  try {
    const expirationSeconds = 1 * 60 * 60 * 24; // Token valid for 1 day
    const JWT_PRIVATE_KEY = process.env.JWT_SECRET;

    // Generate the JWT token
    const token = jwt.sign({ scope: ['user'] }, JWT_PRIVATE_KEY, {
      subject: userId.toString(),
      expiresIn: expirationSeconds,
    });

    // Generate a UUID for the session ID
    const sessionId = uuidv4();

    // Insert the session into the user_sessions table
    await pool.query(insertUserSessionSQL, [sessionId, userId, token]);

    console.log(`Session created for user ID ${userId} with token: ${token}`);
  } catch (err) {
    console.error('Error creating user session:', err);
    throw err;
  }
}

// Main function to create test users and their sessions
async function createTestUsers() {
  try {
    // User data
    const users = [
      { username: 'testuser1', email: 'testuser1@example.com', password: 'password1' },
      { username: 'testuser2', email: 'testuser2@example.com', password: 'password2' },
      { username: 'testuser3', email: 'testuser3@example.com', password: 'password3' },
    ];

    // Loop through users, create them and their sessions
    for (const user of users) {
      const userId = await createUser(user.username, user.email, user.password); // Create the user
      await createUserSession(userId); // Create the session
    }

    console.log('Test users and sessions created successfully');
  } catch (err) {
    console.error('Error creating test users:', err);
  } finally {
    pool.end(); // Close the connection pool when done
  }
}

// Execute the function to create test users
createTestUsers();
