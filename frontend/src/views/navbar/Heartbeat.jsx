import React from 'react';
import { useApi } from '../../utils/api';
import { useEffect, useState } from 'react';
import './heartbeat.scss';

const Heartbeat = () => {

  const [onlineMsg, setOnlineMsg] = useState('Loading');
  const [onlineClass, setOnlineClass] = useState('loading');
  const api = useApi();

  useEffect(() => {
    const fetchHeartbeat = async () => {
      const { status, data } = await api.get('api/heartbeat');
      if (status === 'success') {
        setOnlineMsg('Online');
        setOnlineClass('online');
      } else {
        setOnlineMsg('Offline');
        setOnlineClass('offline');
      }
    }

    fetchHeartbeat();

    const intervalId = setInterval(fetchHeartbeat, 30000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className={`heartbeat ${onlineClass}`}>
      <p>Recomendaciones: {onlineMsg}</p>
    </div>
  );
}

export default Heartbeat;