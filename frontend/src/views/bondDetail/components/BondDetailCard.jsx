
import React from 'react';
import './bondDetailCard.scss';

const BondDetailCard = ({ bond }) => {

  const bondId = bond.id;
  const bondDate = new Date(bond.date);
  const date = bondDate.toLocaleDateString();
  const quantity = bond.quantity;
  const fixtureId = bond.fixture_id;
  const leagueName = bond.league_name;
  const round = bond.round;
  const result = bond.result;
  const oddsName = bond.odds_name;
  const status = bond.status;

  return (
    <div id="bond-detail-card-container">
      <div className="bond-detail-card">
        <div className="bond-detail-card-header">
          <h1>Detalle del bono</h1>
          <p>Bond id: {bondId}</p>
          <p>Fixture id: {fixtureId}</p>
          <p>Cantidad: {quantity}</p>
        </div>
        <div className="bond-detail-card-content">
          <h2>Información del partido</h2>
          <p>Liga: {leagueName}</p>
          <p>Ronda: {round}</p>
          <p>Tipo de resultado: {oddsName}</p>
          <p>Resultado elegido: {result}</p>
          <p>Fecha: {date}</p>
          <p>Estado: {status}</p>
        </div>
      </div>
    </div>
  )
}

export default BondDetailCard;