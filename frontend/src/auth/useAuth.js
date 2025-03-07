import { useContext } from 'react';
import { AuthContext } from './AuthProvider';

export const useAuth = () => {
  const { token, isTokenSet, setToken, logout, userId, scope, isAdmin } = useContext(AuthContext);
  return { token, isTokenSet, setToken, logout, userId, scope, isAdmin };
};