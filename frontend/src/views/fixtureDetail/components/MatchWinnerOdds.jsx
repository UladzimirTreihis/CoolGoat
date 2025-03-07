

const MatchWinnerOdds = ({ odd, handleResultChange, teams, result, adminBonds }) => {
  return (
    <div className="odds-buttons">
      {/* Primera fila de botones */}
      <div className="button-row">
        <button 
          type="button" 
          onClick={() => handleResultChange(teams.home.name)} 
          className={`odd split-button ${result === teams.home.name ? 'pressed' : ''}`}
        >
          <span className="left">{teams.home.name}</span>
          <span className="right">{odd.values[0].odd}</span>
        </button>
        <button 
          type="button"
          onClick={() => handleResultChange("draw")}
          className={`odd split-button ${result === "draw" ? 'pressed' : ''}`}
        >
          <span className="left">Empate</span>
          <span className="right">{odd.values[1].odd}</span>
        </button>
        <button 
          type="button" 
          onClick={() => handleResultChange(teams.away.name)} 
          className={`odd split-button ${result === teams.away.name ? 'pressed' : ''}`}
        >
          <span className="left">{teams.away.name}</span>
          <span className="right">{odd.values[2].odd}</span>
        </button>
      </div>

      {/* Segunda fila de botones */}
      <div className="button-row">
        <button 
          type="button" 
          onClick={() => handleResultChange(`${teams.home.name}/Admin`)} 
          className={`odd split-button ${result === `${teams.home.name}/Admin` ? 'pressed' : ''}`}
        >
          <span className="left">{teams.home.name} - ADMIN - {adminBonds.home} </span>
          <span className="right">{odd.values[0].odd}</span>
        </button>
        <button 
          type="button"
          onClick={() => handleResultChange("draw/Admin")}
          className={`odd split-button ${result === "draw/Admin" ? 'pressed' : ''}`}
        >
          <span className="left">Empate - ADMIN - {adminBonds.draw} </span>
          <span className="right">{odd.values[1].odd}</span>
        </button>
        <button 
          type="button" 
          onClick={() => handleResultChange(`${teams.away.name}/Admin`)} 
          className={`odd split-button ${result === `${teams.away.name}/Admin` ? 'pressed' : ''}`}
        >
          <span className="left">{teams.away.name} - ADMIN - {adminBonds.away} </span>
          <span className="right">{odd.values[2].odd}</span>
        </button>
      </div>
    </div>
  );
};

export default MatchWinnerOdds;
