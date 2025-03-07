import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useApi } from '../../utils/api'; // Use API hook for backend calls
import { useAuth } from '../../auth/useAuth';
import './purchaseOptions.scss';

const PurchaseOptions = () => {
  const location = useLocation(); // Get the passed state from navigate
  const navigate = useNavigate();
  const api = useApi();
  const { isTokenSet } = useAuth();
  
  const [walletBalance, setWalletBalance] = useState(0);
  const [status, setStatus] = useState('loading');
  
  // Fetch wallet balance
  useEffect(() => {
    const fetchWalletBalance = async () => {
      const { status, data } = await api.get('api/wallet/balance');
      if (status === 'success') {
        setWalletBalance(data.balance);
        setStatus('success');
      } else {
        setStatus('error');
      }
    };
    if (isTokenSet) {
      fetchWalletBalance();
    }
  }, [isTokenSet]);

  // Handle wallet payment
  const handleWalletPayment = async () => {
    const { status, data } = await api.post('api/bonds/create', {
      ...location.state, // Send the purchase details from the fixture
      wallet: true,
      deposit_token: "",
    });
    console.log(location.state)

    if (status === 'success') {
        alert("Gracias por su compra. Navigate to wallet to see the status of your purchase.")
      navigate(`/wallet`);
    }
  };

  // Handle Webpay payment
  const handleWebpayPayment = async () => {
    const { status, data } = await api.post('api/webpay/purchase', {
      ...location.state, // Send the purchase details from the fixture
      wallet: false,
      deposit_token: "",
      returnUrl: `${window.location.origin}/webpay/complete`
    });
  
    if (status === 'success') {
      console.log("Success")
      console.log(status, data)
      // Navigate to the confirmation page with the token and URL
      navigate(`/webpay/commit`, { state: { token_ws: data.token_ws, url: data.url } });
    }
  };
  

  return (
    <div id="purchase-options-container">
      <h2>Detalles de la Compra</h2>
      <div className="purchase-details">
        <p>League: {location.state.league_name}</p>
        <p>Round: {location.state.round}</p>
        <p>Date: {new Date(location.state.date).toLocaleString()}</p>
        <p>Result: {location.state.result}</p>
        <p>Quantity: {location.state.quantity}</p>
        <p>Odds Name: {location.state.odds_name}</p>
      </div>
      
      <h3>Saldo de la Cartera: {walletBalance}</h3>

      <div className="payment-buttons">
        <button onClick={handleWalletPayment}>Pagar con Cartera</button>
        <button onClick={handleWebpayPayment}>Pagar con Webpay</button>
      </div>
    </div>
  );
};

export default PurchaseOptions;
