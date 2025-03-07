import React, { useEffect, useState } from 'react';
import { useApi } from '../../utils/api';
import { useAuth } from '../../auth/useAuth';
import './bonds.scss';

const Bonds = () => {
  const [bonds, setBonds] = useState([]);
  const api = useApi();
  const { isTokenSet } = useAuth();

  useEffect(() => {
    const fetchBonds = async () => {
      const { status, data } = await api.get('api/bonds/user');
      if (status === 'success') {
        setBonds(data);
      } else {
        console.error("Failed to fetch bonds:", data);
      }
    };
    if (isTokenSet) {
      fetchBonds();
    }
  }, [isTokenSet]);

  const getStatusClass = (status) => {
    switch (status) {
      case 'pending':
        return 'bond-status-pending';
      case 'valid':
        return 'bond-status-valid';
      case 'invalid':
        return 'bond-status-invalid';
      case 'lost':
        return 'bond-status-lost';
      case 'won':
        return 'bond-status-won';
      default:
        return '';
    }
  };

  const handleGetBill = async (bondId) => {
    const { status, data } = await api.get(`api/bill/${bondId}`);
    if (status === 'success') {
      console.log(data);
      const downloadUrl = data.url;

      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = 'bill.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

    } else {
      console.error("Failed to get bill:", data);
    }
  }

  return (
    <div className="bonds-container">
      {bonds && bonds.map(bond => (
        <div key={bond.id} className={`bond-card ${getStatusClass(bond.status)}`}>
          <h3>{bond.league_name}</h3>
          <p><strong>Round:</strong> {bond.round}</p>
          <p><strong>Chosen Result:</strong> {bond.result}</p>
          <p><strong>Status:</strong> {bond.status}</p>
          <p><strong>Quantity:</strong> {bond.quantity}</p>
          <p><strong>Odds Type:</strong> {bond.odds_name}</p>
          <div className="odds-values">
            {bond.odds_values && bond.odds_values.map((odds, index) => (
              <p key={index}><strong>{odds.value}:</strong> {odds.odd}</p>
            ))}
          </div>
          <button onClick={() => handleGetBill(bond.id)}>Get bill</button>
        </div>
      ))}
    </div>
  );
};

export default Bonds;
