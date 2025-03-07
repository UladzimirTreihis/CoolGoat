// NO SE USA
// LO REEMPLAZA LAMBDA CUSTOM AUTHORIZER

import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

// Function to get the full JWT payload
function getJWTPayload(token) {
  const secret = process.env.JWT_SECRET;
  try {
    const payload = jwt.verify(token, secret);
    return payload;
  } catch (error) {
    throw new Error('Invalid token');
  }
}

// Middleware para verificar si el usuario tiene rol de "user"
export function isUser(req, res, next) {
  try {
    const token = req.headers.authorization.split(' ')[1]; // Obtenemos el token del header Authorization
    const payload = getJWTPayload(token); // Get the full token payload

    if (!payload.scope.includes('user')) {
      return res.status(403).json({ message: "You're not a User" });
    }
    
    // Attach user information to req object
    req.user = {
      id: payload.sub,  // Attach the subject (user id) to req.user
      scope: payload.scope
    };

    next(); // Continuar al siguiente middleware si el scope es válido
  } catch (error) {
    return res.status(401).json({ message: 'Unauthorized: Invalid or missing token' });
  }
}

// Middleware para verificar si el usuario tiene rol de "admin"
export function isAdmin(req, res, next) {
  try {
    const token = req.headers.authorization.split(' ')[1]; // Obtenemos el token del header Authorization
    const scope = getJWTScope(token); // Obtenemos el scope del token

    if (!scope.includes('admin')) {
      return res.status(403).json({ message: "You're not an Admin" });
    }
    
    next(); // Continuar al siguiente middleware si el scope es válido
  } catch (error) {
    return res.status(401).json({ message: 'Unauthorized: Invalid or missing token' });
  }
}
