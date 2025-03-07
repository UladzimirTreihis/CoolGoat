// NO SE USA
// LO REEMPLAZA LAMBDA AUTH SERVICE

import pool from '../db.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import User from '../models/User.js';

dotenv.config();

export const signup = async (req, res) => {
    const { username, email, password } = req.body;

    // Debugging line
    console.log("Signup Data:", { username, email, password });
  
    // Verifica si el usuario ya existe (por email)
    try {
      const emailExists = await User.findByEmail(email);
      const usernameExists = await User.findByUsername(username);

      if (emailExists) {
        return res.status(400).json({ message: `The user with email '${email}' already exists` });
      }
  
      // Verifica si el usuario ya existe (por nombre)
      if (usernameExists) {
        return res.status(400).json({ message: `The user with username '${username}' already exists` });
      }
  
  
      // New user
      const newUser = await User.create({ username, email, password });

  
      // Respuesta exitosa con el nuevo usuario
      return res.status(201).json({
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
      });
    } catch (err) {
      console.error('Error during user signup:', err);
      return res.status(500).json({ message: 'Server error', data: `console.log("Signup Data:", { ${username}, ${email}, ${password} });` });
    }
  };

export const login = async (req, res) => {
  const { email, password } = req.body;
  
  // Debugging line
  console.log("Signin Data:", { email, password });

  try {
    // Buscar el usuario por correo
    const user = await User.findByEmail(email);

    if (!user) {
      return res.status(400).json({ message: `The user by the email '${email}' was not found` });
    }

    // Comparar la contraseña ingresada con la contraseña hasheada
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(400).json({ message: 'Incorrect password' });
    }
  
    // Generar el JWT
    const expirationSeconds = 1 * 60 * 60 * 24;
    const JWT_PRIVATE_KEY = process.env.JWT_SECRET;
    const token = jwt.sign(
      { scope: ['user'] },
      JWT_PRIVATE_KEY,
      { subject: user.id.toString(), expiresIn: expirationSeconds }
    );

    // Responder con el token
    return res.status(200).json({
      user_id: user.id,
      access_token: token,
      token_type: 'Bearer',
      expires_in: expirationSeconds,
    });
  } catch (error) {
    console.error('Error during user lookup:', error);
    return res.status(500).json({ message: 'Server error', data: `console.log("Signin Data:", { ${username}, ${email}, ${password} });` });
  }
};