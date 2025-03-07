import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApi } from '../../utils/api';
import { useAuth } from '../../auth/useAuth';
import FixtureDetailCard from './components/FixtureDetailCard';
import './fixtureDetail.scss';

const FixtureDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams(); 
  const api = useApi();
  const { isTokenSet } = useAuth();
  const [fixture, setFixture] = useState(null);
  const [status, setStatus] = useState('loading');

  const handleBackClick = () => {
    navigate('/fixtures');
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get(`api/fixtures/${id}`);
        console.log(response.data);
        setFixture(response.data);
        setStatus('success');
      } catch {
        console.log(error);
        setStatus('error');
      }
    };
    if (isTokenSet) {
      fetchData();
    }
  }, [isTokenSet]);

  if (status === 'loading') {
    return <p>Cargando...</p>;
  }

  if (status === 'error') {
    return <p>Hubo un error al cargar el fixture</p>;
  }

  return (
    <div id="fixture-detail-container">
      <div className="content">
        <FixtureDetailCard fixture={fixture} />
        <button onClick={handleBackClick}>Volver</button>
      </div>
    </div>
  )

}

export default FixtureDetail;