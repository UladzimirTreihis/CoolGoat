import jwt from 'jsonwebtoken';
import { jwtDecode } from 'jwt-decode';
import dotenv from 'dotenv';
import { serverConfig } from '../../config/config.js'


dotenv.config();

function getJWTScope(token) {
    const secret = process.env.JWT_SECRET;

    // Verificar el token y manejar errores si es necesario
    try {
        const payload = jwt.verify(token, secret);
        return payload.scope;
    } catch (error) {
        throw new Error('Invalid token or verification failed: ' + error.message);
    }
}

// Función para extraer el userId desde los scopes del JWT
export const getUserIdFromScopes = (req) => {
    try {
        // Verifica si el token existe en los headers
        if (!req.headers.authorization) {
            throw new Error('Authorization header is missing');
        }

        var token = req.headers.authorization.split(' ')[1];

        if (serverConfig.development === 'true') {
            const decodedToken = jwtDecode(token);
            const userId = Number(decodedToken.sub);
            var scopes = getJWTScope(token);  
            return userId;
        } else {
            var scopes = getJWTScope(token);

            // Validar si scopes existe y tiene al menos 2 elementos
            if (!scopes || !Array.isArray(scopes) || scopes.length < 2) {
                throw new Error('Scopes are missing or invalid in the token');
            }
    
            return scopes[1];
        }

    } catch (error) {
        console.error('Error extracting userId from scopes:', error.message);
        throw error;
    }
};
