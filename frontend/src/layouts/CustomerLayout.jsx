import React from 'react';
import { Outlet } from 'react-router-dom';
import { CustomerNav } from '../components/navigation/CustomerNav.jsx';
import { Footer } from '../components/navigation/Footer.jsx';
import { DemoBanner } from '../components/common/DemoBanner.jsx';

export function CustomerLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-on-surface antialiased font-body-md selection:bg-primary-fixed selection:text-on-primary-fixed">
      <DemoBanner />
      <CustomerNav />
      <main className="flex-1 flex flex-col">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

