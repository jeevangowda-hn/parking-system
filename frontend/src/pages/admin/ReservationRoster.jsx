import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService.js';
import { bookingService } from '../../services/bookingService.js';
import { useToast } from '../../context/ToastContext.jsx';
import { ConfirmDialog } from '../../components/common/ConfirmDialog.jsx';
import {
  TableProperties,
  Search,
  Download,
  Filter,
  Calendar,
  Clock,
  Car,
  CheckCircle2,
  XCircle,
  FileText,
} from 'lucide-react';
import { formatCurrency, formatDate, formatTime } from '../../utils/formatters.js';

export function ReservationRoster() {
  const { success, error } = useToast();
  const [bookings, setBookings] = useState([]);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [cancelModalBooking, setCancelModalBooking] = useState(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await adminService.getAllBookings(filter, search);
      setBookings(data);
    } catch (err) {
      error(err.message || 'Failed to load reservations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [filter, search]);

  const handleCancel = async () => {
    if (!cancelModalBooking) return;
    try {
      await bookingService.cancelBooking(cancelModalBooking.id);
      success(`Booking ${cancelModalBooking.bookingRef} cancelled.`);
      setCancelModalBooking(null);
      await loadData();
    } catch (err) {
      error(err.message || 'Cancel failed');
    }
  };

  const exportCSV = () => {
    const headers = ['BookingRef', 'User', 'Email', 'Zone', 'Slot', 'Date', 'Start', 'End', 'Status', 'Total'];
    const rows = bookings.map((b) => [
      b.bookingRef,
      `"${b.userName}"`,
      b.userEmail,
      b.zoneName,
      b.slotCode,
      b.date,
      b.startTime,
      b.endTime,
      b.status,
      b.totalAmount,
    ]);

    const csv = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encoded = encodeURI(csv);
    const link = document.createElement('a');
    link.href = encoded;
    link.download = `parkwise_roster_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    success('CSV exported successfully');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-outline-variant/60 pb-5">
        <div>
          <h1 className="font-headline-xl text-2xl sm:text-3xl font-bold text-on-surface">
            Central Reservation Roster
          </h1>
          <p className="text-xs sm:text-sm text-secondary mt-1">
            Complete record journal of active check-ins, upcoming arrivals, and archived parking passes.
          </p>
        </div>
        <button
          onClick={exportCSV}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-surface-container-lowest border border-outline-variant hover:bg-surface-container rounded-lg text-xs font-bold text-on-surface shadow-xs transition-colors self-start sm:self-auto"
        >
          <Download className="w-3.5 h-3.5 text-primary" />
          <span>Export Full Roster CSV</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-surface-container-lowest border border-outline-variant rounded-xl p-4">
        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-secondary absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search ref, motorist, slot or plate..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-surface-container-low border border-outline-variant rounded-lg text-on-surface focus:outline-none focus:border-primary"
          />
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-1 overflow-x-auto text-xs font-semibold">
          {[
            { id: 'all', label: 'All Records' },
            { id: 'active', label: 'Checked-In' },
            { id: 'scheduled', label: 'Scheduled' },
            { id: 'completed', label: 'Completed' },
            { id: 'cancelled', label: 'Cancelled' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setFilter(item.id)}
              className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${
                filter === item.id
                  ? 'bg-primary text-on-primary font-bold shadow-xs'
                  : 'text-secondary hover:text-on-surface'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Roster Table */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-surface-container text-secondary bg-surface-container-low/50 font-semibold">
                <th className="py-3 px-4">Booking Ref</th>
                <th className="py-3 px-4">Motorist</th>
                <th className="py-3 px-4">Slot / Zone</th>
                <th className="py-3 px-4">Reservation Window</th>
                <th className="py-3 px-4">Vehicle</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container">
              {bookings.map((b) => (
                <tr key={b.id} className="hover:bg-surface-container-low/40 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-on-surface">
                    {b.bookingRef}
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-semibold text-on-surface block">{b.userName}</span>
                    <span className="text-[10px] text-secondary">{b.userEmail}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center gap-1 font-bold text-primary bg-primary-fixed/20 px-2 py-0.5 rounded text-[11px]">
                      {b.slotCode}
                    </span>
                    <span className="text-[10px] text-secondary block">{b.zoneName}</span>
                  </td>
                  <td className="py-3 px-4 font-mono text-secondary">
                    <div>{formatDate(b.date)}</div>
                    <div className="text-[11px] text-on-surface">
                      {b.startTime} - {b.endTime}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-semibold text-on-surface block">
                      {b.vehicle?.make} {b.vehicle?.model}
                    </span>
                    <span className="font-mono text-[10px] bg-surface-container px-1 rounded border border-outline-variant inline-block">
                      {b.vehicle?.plate}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-bold font-numeric-metric text-on-surface">
                    {formatCurrency(b.totalAmount)}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                        b.status === 'active'
                          ? 'bg-primary-fixed/50 text-on-primary-fixed'
                          : b.status === 'upcoming'
                          ? 'bg-secondary-container text-on-secondary-container'
                          : b.status === 'completed'
                          ? 'bg-surface-container text-secondary'
                          : 'bg-red-50 text-error'
                      }`}
                    >
                      {b.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    {b.status === 'upcoming' && (
                      <button
                        onClick={() => setCancelModalBooking(b)}
                        className="text-xs text-error font-semibold hover:underline"
                      >
                        Cancel
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmDialog
        isOpen={!!cancelModalBooking}
        onClose={() => setCancelModalBooking(null)}
        onConfirm={handleCancel}
        isDestructive={true}
        title="Cancel Reservation Record"
        message={`Confirm administrative cancellation for ${cancelModalBooking?.bookingRef}?`}
      />
    </div>
  );
}

