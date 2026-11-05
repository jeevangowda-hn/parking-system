import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AdminSidebar } from '../components/navigation/AdminSidebar.jsx';
import { AdminTopBar } from '../components/navigation/AdminTopBar.jsx';
import { Footer } from '../components/navigation/Footer.jsx';
import { DemoBanner } from '../components/common/DemoBanner.jsx';

export function AdminLayout() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const location = useLocation();

  // Compute breadcrumb title based on route
  const getBreadcrumb = () => {
    const path = location.pathname;
    if (path.includes('zones')) return 'Zone Management';
    if (path.includes('slots')) return 'Bay Slot Controls';
    if (path.includes('reservations')) return 'Reservation Roster';
    if (path.includes('analytics')) return 'Hourly Analytics';
    if (path.includes('settings')) return 'Facility Settings';
    return 'Live Command Center';
  };

  return (
    <div className="min-h-screen bg-background text-on-surface antialiased flex flex-col font-body-md selection:bg-primary-fixed selection:text-on-primary-fixed">
      <DemoBanner />
      <div className="flex-1 flex min-h-0">
        <AdminSidebar
          isMobileOpen={mobileSidebarOpen}
          onCloseMobile={() => setMobileSidebarOpen(false)}
        />
        <main className="lg:ml-72 flex-1 flex flex-col min-w-0 bg-background">
          <AdminTopBar
            onToggleMobile={() => setMobileSidebarOpen(true)}
            breadcrumb={getBreadcrumb()}
          />
          <div className="flex-1 p-4 sm:p-8 max-w-[1600px] w-full mx-auto">
            <Outlet />
          </div>
          <Footer />
        </main>
      </div>
    </div>
  );
}

