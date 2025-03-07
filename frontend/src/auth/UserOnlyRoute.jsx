import PropTypes from 'prop-types';
import { Navigate } from 'react-router-dom';
import { useAuth } from './useAuth';

export const UserOnlyRoute = ({ children }) => {
  const { token } = useAuth();

  if (token === null) {
    return <Navigate to="/login" />;
  }

  return children;
}

UserOnlyRoute.propTypes = {
  children: PropTypes.node.isRequired
}