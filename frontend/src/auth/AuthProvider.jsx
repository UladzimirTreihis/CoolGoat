import { createContext, useEffect, useState } from "react";
import { jwtDecode } from 'jwt-decode';
import axios from "axios";

export const AuthContext = createContext();

function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [timeoutId, setTimeoutId] = useState(null);
  const [userId, setUserId] = useState(null);
  const [scope, setScope] = useState(null);
  const [isTokenSet, setIsTokenSet] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false); 

  function logout() {
    setToken(null);
    setIsTokenSet(false);
    setUserId(null);
    setScope(null);
    setIsAdmin(false);
    if (timeoutId) {
      clearTimeout(timeoutId);
      setTimeoutId(null);
    }
  }

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('token', token);
      setIsTokenSet(true);
      
      const decodedToken = jwtDecode(token);
      const expiresIn = decodedToken.exp;
      const currentTime = Date.now() / 1000;
      const timeLeft = expiresIn - currentTime;

      setUserId(Number(decodedToken.sub));
      setScope(decodedToken.scope);
      setIsAdmin(decodedToken.isAdmin || false); 
      console.log(`Explore decoded token`)
      console.log(decodedToken)
      console.log('end')

      if (timeLeft > 0) {
        const timeoutId = setTimeout(() => {
          logout();
        }, timeLeft * 1000);
        setTimeoutId(timeoutId);

        return () => clearTimeout(timeoutId);
      } else {
        logout();
      }
    } else {
      delete axios.defaults.headers.common['Authorization'];
      localStorage.removeItem('token');
      setIsTokenSet(false);
    }
  }, [token]);

  return (
    <AuthContext.Provider value={{ token, isTokenSet, setToken, logout, userId, scope, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;