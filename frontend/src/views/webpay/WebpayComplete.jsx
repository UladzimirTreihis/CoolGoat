import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../auth/useAuth'
import { useApi } from '../../utils/api.js'
import './webpayComplete.scss'

const WebpayComplete = () => {
  const [searchParams] = useSearchParams();
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { isTokenSet } = useAuth();
  const api = useApi();

  useEffect(() => {

    const token_ws = searchParams.get('token_ws') || '';

    const fetchTransaction = async () => {
        // Send a POST request to /webpay/commit with the token
        const { status, data } = await api.post('api/webpay/commit', { token_ws });
        console.log(status)
        if (status === 'success') {
        setData(data);
        } else {
        console.error('Error completing transaction:', data);
        }
        setIsLoading(false);
    };
    if (isTokenSet) {
      fetchTransaction();
    }

  }, [searchParams, isTokenSet]);

  if (isLoading) {
    return (
      <div className="p-20">
        <h1>Loading...</h1>
      </div>
    );
  }

  return (
    <div className="purchase-completed-container">
      <h1 className="purchase-completed-title">Purchase {data?.success ? "Success" : "Failure"}</h1>
      <p className="purchase-completed-message">{data?.message}</p>
      <Link to="/" className="purchase-completed-link">Volver a inicio</Link>
    </div>
  );
};

export default WebpayComplete;
