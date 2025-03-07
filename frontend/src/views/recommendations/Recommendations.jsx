import { useState, useEffect } from 'react';
import { useAuth } from '../../auth/useAuth';
import { useApi } from '../../utils/api';
import FixtureCard from '../fixtures/components/FixtureCard';
import './recommendations.scss';

const Recommendations = () => {
  const api = useApi();
  const { isTokenSet } = useAuth();
  const [recommendations, setRecommendations] = useState([]);
  const [status, setStatus] = useState('loading');
  const [lastUpdate, setLastUpdate] = useState('');

  const fetchRecommendations = async () => {
    setStatus('loading');
    const { status, data } = await api.get('api/recommendations');
    if (status === 'success') {
      setRecommendations(data.fixtures);
      console.log(data.fixtures);
      setLastUpdate(data.lastUpdate);
      console.log(data.lastUpdate);
      setStatus('success');
    } else {
      setStatus('error');
    }
  }

  useEffect(() => {
    if (isTokenSet) {
      fetchRecommendations();
    }
  }, [isTokenSet]);

  return (
    <div id="recommendations-container">
      <div className="content">
        <h2>Recomendaciones de partidos</h2>
        {status === 'loading' && <p>Cargando...</p>}
        {status === 'error' && <p>Ha ocurrido un error al cargar las recomendaciones</p>}
        {status === 'success' && recommendations.length === 0 && (<>
            <h4>Aún no hay recomendaciones</h4>
            <p>Las recomendaciones aparecerán aquí automáticamente una vez compres tu primer bono de partido</p>
          </>
        )}
        {status === 'success' && recommendations.length > 0 && (<>
          <div id="recommendations-update">
            <p>Última actualización: {lastUpdate}</p>
          </div>
          <div id="recommendations-list">
            {recommendations.map((recommendation) => (
              <FixtureCard key={recommendation.fixture_id} fixture={recommendation} />
            ))}
          </div>
        </>)}
      </div>
    </div>
  )
}

export default Recommendations;