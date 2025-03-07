import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './webpayCommit.scss';  // Import the SCSS file

const WebpayCommit = () => {
  const location = useLocation();
  const { token_ws, url } = location.state || {};

  useEffect(() => {
    if (token_ws && url) {
      // Automatically submit the form as soon as the component loads
      // document.getElementById('webpay-form').submit();
      console.log("Got token and url")
    }
  }, [token_ws, url]);



  // if (!token_ws || !url) {
  //   return <p>Error: Missing payment data.</p>;
  // }

  return (
    <div id="webpay-confirm-container">
      <h2>Redirigiendo a Webpay...</h2>
      <div className="loader"></div>

      <form id="webpay-form" method="post" action={url}>
        <input type="hidden" name="token_ws" value={token_ws} />
        <input type="submit" value="Ir a pagar" />
      </form>
    </div>
  );
};

export default WebpayCommit;
