
import React from 'react';
import { useState, useEffect } from 'react';
import { useApi } from '../../../utils/api';
import { useAuth } from '../../../auth/useAuth';
import Transaction from './Transaction';

import './walletCard.scss';

const WalletCard = () => {

  const api = useApi();
  const { isTokenSet } = useAuth();
  const [wallet, setWallet] = useState([]);
  const [balance, setBalance] = useState(0);
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    const fetchData = async () => {
      const { status, data } = await api.get('api/wallet');

      if (status === "success") {
        setWallet(data);
        setBalance(data.user.balance);
        console.log(data);
        setStatus('success');
      } else {
        setStatus('error');
        console.log(data);
      }
    };

    if (isTokenSet) {
      fetchData();
    }
  }, [isTokenSet]);

  const handleAddFunds = async (event) => {
    event.preventDefault();
    const funds = Number(event.target.funds.value);

    const { status, data } = await api.post('api/wallet/add', {
      amount: funds
    });

    if (status === "success") {
      setBalance(data.balance);
      wallet.transactions.unshift(data.transaction);
      console.log(status);
    } else {
      console.error(error);
    }
  }

  return (
    <div id="wallet-card-container">

      {status === 'loading' && <p>Cargando...</p>}
      {status === 'error' && <p>Error al cargar la información</p>}
      {status === 'success' &&
      <div className="wallet-card">
        <div className="user-details-group">
          <h2>{wallet.user.username}</h2>
          <p>User id: {wallet.user.id}</p>
        </div>
        <div className="user-balance-group">
          <h3>Balance actual: {balance}</h3>
          <form onSubmit={handleAddFunds}>
            <div className="add-balance-group">
              <input type="number" id="funds" defaultValue="0" placeholder="Fondos a ingresar" min="0"/>
              <button type="submit" id="add-funds">Agregar fondos</button>
            </div>
          </form>
        </div>
        <div className="transactions-group">
          <h2>Transacciones anteriores</h2>
          {wallet.transactions.map((transaction) => (
              <Transaction key={transaction.id} transaction={transaction} />
            ))}
        </div>        
      </div>
    }
    </div>
          
  )
};

export default WalletCard;