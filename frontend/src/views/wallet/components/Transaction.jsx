import React from 'react';
import './transaction.scss';
import { useNavigate } from 'react-router-dom';


const Transaction = ({ transaction }) => {

  const navigate = useNavigate();

  const type = transaction.type;
  const amount = transaction.amount;
  const status = transaction.status;
  const date = new Date(transaction.created_at).toLocaleString();

  const handleBondDetailClick = () => {
    const bondId = transaction.request_id;
    navigate(`/wallet/bond/${bondId}`);
  };

  return (
    <div id="transaction-container">
      <div className='content'>
        <div>
          <h6>Tipo</h6>
          <p>{type}</p>
        </div>
        <div className='amount'>
          <h6>Monto</h6>
          <p>{amount}</p>
        </div>
        <div className='status'>
          <h6>Estado</h6>
          <p>{status}</p> 
        </div>
        <div>
          <h6>Fecha y hora local</h6>
          <p>{date}</p>
        </div>
        <div className="bond-button">
        {transaction.request_id && 
          <button onClick={handleBondDetailClick}>
            Ver detalles del bono
          </button>
        }
        </div>
      </div> 
    </div>
  )
}

export default Transaction;