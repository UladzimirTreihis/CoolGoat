import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './useAuth';
import { useEffect } from 'react';

export const AdminOnlyRoute = ({ children }) => {
  const { token, isTokenSet, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Wait until the token is set before proceeding
    if (!isTokenSet) {
        return;
    }

    if (token === null) {
        navigate('/login')
    }

    if (!isAdmin) {
        // Redirect non-admin users
        navigate('/fixtures');
        return;
    }
    }, [isAdmin, isTokenSet, navigate])

  // If admin, render the children
  return children;
}

AdminOnlyRoute.propTypes = {
  children: PropTypes.node.isRequired
};
