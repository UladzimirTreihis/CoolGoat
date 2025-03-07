import React from 'react';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../auth/useAuth';
import './navbar.scss';
import Heartbeat from './Heartbeat';

const Navbar = () => {

  const { logout, isTokenSet, isAdmin } = useAuth();

  useEffect(() => {
    // Wait until the token is set before proceeding
    if (!isTokenSet) {
        return;
    }
  }, [isAdmin, isTokenSet]);

  console.log(`Admin status: ${isAdmin}`)

  return (
    <div id="navbar-container">
      <nav className="navbar">
        <div className="left-side">
          {isTokenSet && <Link to="/fixtures">Partidos</Link>}
          {isTokenSet && <Link to="/recommendations">Recomendaciones</Link>}
          {isTokenSet && <Heartbeat />}
          {isTokenSet && <Link to="/bonds">Mis bonos</Link>}
          {isTokenSet && isAdmin && <Link to="/admin">Admin</Link>}
        </div>
        <div className="right-side">
          {!isTokenSet && <Link to="/login">Iniciar sesión</Link>}
          {!isTokenSet && <Link to="/signup">Registrarse</Link>}
          {isTokenSet && <Link to="/wallet">Mi cartera</Link>}
          {isTokenSet && <button onClick={logout} className="logout-button">Cerrar sesión</button>}
        </div>
      </nav>
    </div>
  );
}

export default Navbar;