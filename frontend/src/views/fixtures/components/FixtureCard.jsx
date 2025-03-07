import React from 'react';
import { useNavigate } from 'react-router-dom';
import './fixtureCard.scss';

const FixtureCard = ({ fixture }) => {

  const navigate = useNavigate();

  const handleDetailClick = () => {
    navigate(`/fixtures/${fixture.fixture_id}`);
  }

  const dateObj = new Date(fixture.date);
  const date = dateObj.toLocaleDateString();
  const time = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
  const utcTime = fixture.date.split('T')[1].split('.')[0].slice(0, 5)

  return (
    <div id="fixture-card-container">
      <div className="fixture-card">
        <div className="date-group">
          <p>{date}</p>
          <p>{time} (Local)</p>
          <p>{utcTime} (UTC)</p>
        </div>
        <div className="match-details-group">
          <h2>{fixture.home_team.name}</h2>
          <div className="match-goals-group">
            <h2>{fixture.goals.home === null && "-" || fixture.goals.home}</h2>
            <h2>{fixture.status.elapsed && fixture.status.elapsed + "'" || "--'" }</h2>
            <h2>{fixture.goals.away === null && "-" || fixture.goals.away}</h2>
          </div>
          <h2>{fixture.away_team.name}</h2>
        </div>
        <div id="buttons-group">
          <button onClick={handleDetailClick}>Ver en detalle</button>
        </div>
      </div>
    </div>
  );
}

export default FixtureCard;