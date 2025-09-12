import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '@components/common/Header';
import Footer from '@components/common/Footer';

const RootLayout = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default RootLayout;
