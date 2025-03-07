import React from 'react';
import { useState } from 'react';
import { useAuth } from '../../../auth/useAuth';
import { useApi } from '../../../utils/api';
import MatchWinnerOdds from './MatchWinnerOdds';
import { useNavigate } from 'react-router-dom'; // Import to redirect to new route

import './fixtureDetailCard.scss';

const FixtureDetailCard = ({ fixture }) => {

  const dateObj = new Date(fixture.fixture.date);
  const date = dateObj.toLocaleDateString();
  const time = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
  const utcTime = fixture.fixture.date.split('T')[1].split('.')[0].slice(0, 5)

  const teams = fixture.teams;
  const league = fixture.league;
  const goals = fixture.fixture.goals;
  const status = fixture.fixture.status;
  const referee = fixture.fixture.referee;
  const odds = fixture.odds;
  const adminBonds = fixture.fixture.bonds;


  const [result, setResult] = useState(null);
  const [isAdminBond, setIsAdminBond] = useState(false);
  const [remaining_bonds, setRemainingBonds] = useState(fixture.fixture.remaining_bonds);
  const { userId } = useAuth();
  const api = useApi();
  const navigate = useNavigate(); 

  const handleBuyClick = async (event) => {
    event.preventDefault();
    console.log(result);
    console.log(event.target.bonds.value);

    if (result === null) {
      console.log("Debe seleccionar un resultado y una cantidad de bonos");
      return;
    }

    // Obtener la dirección IP pública
    const ipResponse = await fetch('https://api.ipify.org?format=json');
    const ipData = await ipResponse.json();
    const userIP = ipData.ip;
    // console.log('IP del usuario:', userIP);

    // Prepare the data to pass to PurchaseOptions
    const purchaseDetails = {
      fixture_id: fixture.fixture.fixture_id,
      league_name: league.name,
      round: league.round,
      date: fixture.fixture.date,
      result: result.split('/')[0],
      quantity: event.target.bonds.value,
      odds_name: "Match Winner",
      user_ip: userIP,
      system_bonds: result.includes('Admin')
    };

    console.log('purchaseDetails:', purchaseDetails);

    // Redirect to /purchase/options with the data
    navigate('/purchase/options', { state: purchaseDetails });

    // const { status, data } = await api.post('api/bonds/create', {
    //   user_id: userId,
    //   fixture_id: fixture.fixture.id,
    //   group_id: "3",
    //   league_name: league.name,
    //   round: league.round,
    //   date: fixture.fixture.date,
    //   result: result,
    //   quantity: event.target.bonds.value,
    //   odds_name: odds_name,
    //   user_ip: userIP
    // });

    // if (status === "success") {
    //   console.log("Solicitud ingresada");
    //   console.log(data);
    // } else {
    //   console.log("Error al ingresar la solicitud");
    //   console.log(data);
    // }
  }

  const handleResultChange = (selectedResult) => {
    setResult(selectedResult);

    // Verificar si es un bono admin y actualizar isAdminBond
    const isAdmin = selectedResult.includes("Admin");
    setIsAdminBond(isAdmin);

    console.log("Resultado seleccionado:", selectedResult, "¿Es admin bond?", isAdmin);
  };

  return (
    <div id="fixture-detail-card-container">
      <div className="fixture-detail-card">
        <div className="date-and-league-group">
          <div className="date-group">
            <p>{date}</p>
            <p>{time} (Local)</p>
            <p>{utcTime} (UTC)</p>
          </div>
          <div className="league-group">
            <p>{league.name} ({league.round})</p>
          </div>
        </div>
        <div className="match-details-group">
          <h2>{teams.home.name}</h2>
          <div className="match-goals-group">
            <h2>{goals.home === null && "-" || goals.home}</h2>
            <h2>{status.elapsed && status.elapsed + "'" || "--'" }</h2>
            <h2>{goals.away === null && "-" || goals.away}</h2>
          </div>
          <h2>{teams.away.name}</h2>
        </div>
        <p>Árbitro: {referee}</p>
        <h2>Comprar bonos</h2>
        <div className="odds-group">
        {odds.map((odd, index) => {
          if (odd.name == "Match Winner") {
            return (<MatchWinnerOdds key={index} odd={odd} handleResultChange={handleResultChange} teams={teams} result={result} adminBonds={adminBonds} />)
          }
        })}
        </div>
        <p>Bonos restantes: {remaining_bonds}</p>
        <form onSubmit={handleBuyClick}>
          <div className="bonds-group">
            <input
            type="number" 
            id="bonds" 
            defaultValue="0" 
            placeholder="Cantidad de bonos" 
            min={Math.min(1, remaining_bonds)} 
            max={
              isAdminBond
                  ? adminBonds[
                      result.includes(teams.home.name)
                        ? "home"
                        : result.includes("draw")
                        ? "draw"
                        : "away"
                    ]
                  : remaining_bonds
              }
            />
            <button type="submit" id="buy-button">Comprar</button>
          </div>
        </form>
      </div>
    </div>
  )
};

export default FixtureDetailCard;