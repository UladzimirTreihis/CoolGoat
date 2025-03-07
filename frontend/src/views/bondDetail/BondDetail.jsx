
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/useAuth";
import { useApi } from "../../utils/api";
import BondDetailCard from "./components/BondDetailCard";
import "./bondDetail.scss";


const BondDetail = () => {
  const navigate = useNavigate();
  const { isTokenSet } = useAuth();
  const { id } = useParams();
  const api = useApi();
  const [bond, setBond] = useState(null);
  const [status, setStatus] = useState('loading');

  const handleBackClick = () => {
    navigate('/wallet');
  }

  useEffect(() => {
    const fetchData = async () => {
      const { status, data } = await api.get(`api/bonds/${id}`);
      console.log(data);
      if (status === "success") {
        setBond(data);
        setStatus('success');
      } else {
        setStatus('error');
        console.log(data);
      }
    }

    if (isTokenSet) {
      fetchData();
    }
  
  }, [isTokenSet]);

  if (status === 'loading') {
    return <p>Cargando...</p>;
  }

  if (status === 'error') {
    return <p>Hubo un error al cargar el fixture</p>;
  }

  return (
    <div id="bond-detail-container">
      <div className="content">
        <BondDetailCard bond={bond} />
        <button onClick={handleBackClick}>Volver</button>
      </div>
    </div>
  )
}

export default BondDetail;