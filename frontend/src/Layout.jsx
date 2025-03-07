import React from 'react';
import Navbar from './views/navbar/Navbar';

const Layout = ({ children }) => {
  return (
    <div>
      <Navbar />
      <main style={{ paddingTop: '2rem' }}>{children}</main>
    </div>
  );
};

export default Layout;