import { useApi } from '../../utils/api';
import { useState, useEffect } from 'react';
import { useAuth } from '../../auth/useAuth';
import FixtureCard from "./components/FixtureCard";
import './fixtures.scss';

const Fixtures = () => {

  const api = useApi();
  const { isTokenSet } = useAuth();
  const [fixtures, setFixtures] = useState([]);
  const [pageLimit, setPageLimit] = useState(1);
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;
  const [status, setStatus] = useState('loading');
  const [home, setHome] = useState('');
  const [away, setAway] = useState('');
  const [date, setDate] = useState('');

  const buildQueryParams = (params) => {
    return Object.entries(params)
      .filter(([key, value]) => value)
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join('&');
  };

  const fetchFixtures = async (home, away, date, page, count) => {
    setStatus('loading');
    const queryParams = buildQueryParams({ home, away, date, page, count });
    const { status, data } = await api.get(`api/fixtures?${queryParams}`);
    if (status === "success") {
      setFixtures(data.fixtures);
      setPageLimit(data.totalPages);
      setStatus('success');
    } else {
      console.error(error);
      setStatus('error');
    }
  }

  const handleFilter = async (event) => {
    event.preventDefault();
    setPage(1);
    fetchFixtures(home, away, date, 1, itemsPerPage);
  }

  const handlePageChange = async (newPage) => {
    setPage(newPage);
    fetchFixtures(home, away, date, newPage, itemsPerPage);
  }

  const resetFilters = async () => {
    setPage(1);
    setHome('');
    setAway('');
    setDate('');
    fetchFixtures('', '', '', 1, itemsPerPage);
  }

  useEffect(() => {
    const fetchData = async () => {
      
      const { status, data } = await api.get('api/fixtures?page=1&count=10');
      if (status === "success") {
        setFixtures(data.fixtures);
        setPageLimit(data.totalPages);
        setStatus('success');
      } else {
        console.error(error);
        setStatus('error');
      }
    };

    if (isTokenSet) {
      fetchData();
    }
  }, [isTokenSet]);

  return (
    <div id="fixtures-container">
      <div className="content">
        <h2>Partidos</h2>

        {status === 'loading' && <p>Cargando...</p>}
        {status === 'error' && <p>Hubo un error al cargar los fixtures</p>}
        {status === 'success' && (<>
          <div className="filters-group">
            <form id="fixtures-filters" onSubmit={handleFilter}>
              <input 
                type="text"
                name="home" 
                placeholder="Introduzca el equipo local" 
                value={home}
                onChange={(e) => setHome(e.target.value)}
                />
              <input
                type="text"
                name="away"
                placeholder="Introduzca el equipo visitante"
                value={away}
                onChange={(e) => setAway(e.target.value)}
              />
              <input
                type="date"
                name="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
              <button type="submit" id="filter-button">Filtrar</button>
              <button type="button" onClick={() => resetFilters()}>Limpiar</button>
            </form>
          </div>
          <div id="fixtures-list">
            {fixtures.map((fixture) => (
              <FixtureCard key={fixture.fixture_id} fixture={fixture} />
            ))}
          </div>
          <div className="pagination">
            <button onClick={() => handlePageChange(page - 1)} disabled={page == 1}>Anterior</button>
            <span>{page}</span>
            <button onClick={() => handlePageChange(page + 1)} disabled={page == pageLimit}>Siguiente</button>
          </div>
        </>)}
      </div>
    </div>
  );
}

export default Fixtures;