import React, { useState, useEffect } from 'react';
import { ChevronRight, RefreshCw, Download, Filter, Bell, Menu } from 'lucide-react';
import { useToast } from '../../context/ToastContext.jsx';
import { storageService } from '../../services/storageService.js';

export function AdminTopBar({ onToggleMobile, breadcrumb = 'Live Command Center' }) {
  const { success } = useToast();
  const [timeStr, setTimeStr] = useState('');

  useEffect(() => {
    function update() {
      const now = new Date();
      const options = {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      };
      setTimeStr(now.toLocaleDateString('en-US', options));
    }
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    success('Hardware telemetry refreshed • 14ms latency verified');
  };

  const handleExportCSV = () => {
    const { bookings } = storageService.getStoredData();
    const headers = ['BookingRef', 'User', 'Slot', 'Date', 'Start', 'End', 'Status', 'Amount'];
    const rows = bookings.map(b => [
      b.bookingRef,
      `"${b.userName}"`,
      b.slotCode,
      b.date,
      b.startTime,
      b.endTime,
      b.status,
      b.totalAmount,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `parkwise_roster_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    success('Reservation roster exported as CSV');
  };

  return (
    <header className="sticky top-0 z-40 bg-surface-container-lowest border-b border-outline-variant/60 px-4 sm:px-8 py-3 flex items-center justify-between shadow-sm">
      {/* Left breadcrumbs & live ticker */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobile}
          className="lg:hidden p-2 text-secondary hover:bg-surface-container rounded-lg"
          aria-label="Open sidebar menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex flex-col gap-0.5">
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-on-surface-variant font-medium">
            <span>Operations</span>
            <ChevronRight className="w-3 h-3 text-outline" />
            <span>Facility #04 Downtown</span>
            <ChevronRight className="w-3 h-3 text-outline" />
            <span className="text-primary font-semibold">{breadcrumb}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary animate-ping"></div>
            <span className="text-xs text-tertiary font-medium">
              Live Sync • {timeStr}
            </span>
          </div>
        </div>
      </div>

      {/* Global Header Actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Export CSV Button */}
        <button
          onClick={handleExportCSV}
          className="h-9 px-3 bg-surface-container-lowest border border-outline-variant rounded-lg text-xs font-semibold text-on-surface hidden md:flex items-center gap-1.5 hover:bg-surface-container transition-colors shadow-xs"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export CSV</span>
        </button>

        {/* Refresh Telemetry Button */}
        <button
          onClick={handleRefresh}
          className="h-9 px-3.5 bg-primary text-on-primary rounded-lg text-xs font-bold flex items-center gap-1.5 hover:bg-primary-hover active:scale-95 transition-all shadow-sm"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Refresh Telemetry</span>
        </button>

        {/* Notification Bell */}
        <div
          onClick={() => alert('Facility Alert: Zone D EV charger delivery active at 150kW. All gateways nominal.')}
          className="h-9 w-9 relative flex items-center justify-center rounded-lg border border-outline-variant hover:bg-surface-container transition-colors cursor-pointer"
        >
          <Bell className="w-4 h-4 text-on-surface-variant" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-error rounded-full ring-2 ring-surface-container-lowest"></span>
        </div>
      </div>
    </header>
  );
}

