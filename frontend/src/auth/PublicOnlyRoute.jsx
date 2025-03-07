import PropTypes from 'prop-types';
import { Navigate } from 'react-router-dom';
import { useAuth } from './useAuth';

export const PublicOnlyRoute = ({ children }) => {
  const { token } = useAuth();

  if (token) {
    return <Navigate to="/fixtures" />;
  }

  return children;
}

PublicOnlyRoute.propTypes = {
  children: PropTypes.node.isRequired
}