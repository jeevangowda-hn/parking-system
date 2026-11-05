import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { bookingService } from '../../services/bookingService.js';
import { ConfirmDialog } from '../../components/common/ConfirmDialog.jsx';
import {
  Calendar,
  Clock,
  Car,
  Search,
  Filter,
  ArrowRight,
  XCircle,
  FileText,
  ParkingSquare,
  ShieldAlert,
} from 'lucide-react';
import { formatCurrency, formatDate, formatTime } from '../../utils/formatters.js';

export function MyBookings() {
  const { user } = useAuth();
  const { success, error } = useToast();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [cancelModalBooking, setCancelModalBooking] = useState(null);
  const [cancelLoading, setCancelLoading] = useState(false);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const data = await bookingService.getUserBookings(user?.id || 'u-001');
      setBookings(data);
    } catch (err) {
      error(err.message || 'Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [user]);

  const handleCancelConfirm = async () => {
    if (!cancelModalBooking) return;
    try {
      setCancelLoading(true);
      await bookingService.cancelBooking(cancelModalBooking.id);
      success(`Booking ${cancelModalBooking.bookingRef} cancelled. Slot is released.`);
      setCancelModalBooking(null);
      await fetchBookings();
    } catch (err) {
      error(err.message || 'Failed to cancel booking');
    } finally {
      setCancelLoading(false);
    }
  };

  const filteredBookings = bookings.filter((b) => {
    if (tab === 'upcoming' && b.status !== 'upcoming') return false;
    if (tab === 'active' && b.status !== 'active') return false;
    if (tab === 'completed' && b.status !== 'completed') return false;
    if (tab === 'cancelled' && b.status !== 'cancelled') return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchRef = b.bookingRef?.toLowerCase().includes(q);
      const matchSlot = b.slotCode?.toLowerCase().includes(q);
      const matchPlate = b.vehicle?.plate?.toLowerCase().includes(q);
      return matchRef || matchSlot || matchPlate;
    }
    return true;
  });

  return (
    <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 md:py-10 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-outline-variant/60 pb-5">
        <div>
          <h1 className="font-headline-xl text-2xl sm:text-3xl font-bold text-on-surface">
            My Reservation History & Passes
          </h1>
          <p className="text-xs sm:text-sm text-secondary mt-1">
            Review active parking passes, upcoming arrivals, and past parking records.
          </p>
        </div>
        <Link
          to="/find-parking"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary hover:bg-primary-hover text-on-primary rounded-lg text-xs font-bold shadow-sm transition-all self-start sm:self-auto"
        >
          <span>Book New Slot</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Toolbar & Filter Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Tabs */}
        <div className="flex items-center gap-1 bg-surface-container p-1 rounded-lg text-xs font-semibold overflow-x-auto">
          {[
            { id: 'all', label: 'All Bookings' },
            { id: 'upcoming', label: 'Upcoming' },
            { id: 'active', label: 'Active' },
            { id: 'completed', label: 'Completed' },
            { id: 'cancelled', label: 'Cancelled' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setTab(item.id)}
              className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${
                tab === item.id
                  ? 'bg-surface-container-lowest text-on-surface shadow-xs font-bold'
                  : 'text-secondary hover:text-on-surface'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 text-secondary absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search ref, slot or plate..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-surface-container-lowest border border-outline-variant rounded-lg text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      {/* Bookings List */}
      {filteredBookings.length === 0 ? (
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-12 text-center space-y-3">
          <ParkingSquare className="w-10 h-10 text-outline mx-auto" />
          <h3 className="text-base font-bold text-on-surface">No Reservations Found</h3>
          <p className="text-xs text-secondary max-w-sm mx-auto">
            {searchQuery
              ? 'No bookings matched your search query. Try clearing the filter.'
              : 'You have no bookings under this status tab.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredBookings.map((b) => (
            <div
              key={b.id}
              className="bg-surface-container-lowest border border-outline-variant rounded-xl p-4 sm:p-5 shadow-xs hover:border-outline transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              {/* Left Info */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-lg bg-surface-container flex flex-col items-center justify-center shrink-0">
                  <span className="text-[10px] text-secondary font-mono">BAY</span>
                  <span className="text-base font-bold font-numeric-metric text-on-surface">
                    {b.slotCode}
                  </span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-primary">
                      {b.bookingRef}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        b.status === 'active' || b.status === 'upcoming'
                          ? 'bg-[#ECFDF5] text-primary'
                          : b.status === 'completed'
                          ? 'bg-surface-container text-secondary'
                          : 'bg-red-50 text-error'
                      }`}
                    >
                      {b.status.toUpperCase()}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-on-surface mt-0.5">
                    {b.zoneName} — {b.zoneLabel}
                  </h4>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-secondary mt-1">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-outline" />
                      {formatDate(b.date)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-outline" />
                      {formatTime(b.startTime)} – {formatTime(b.endTime)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Car className="w-3.5 h-3.5 text-outline" />
                      {b.vehicle?.plate || 'CA 7XYZ89'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Actions & Amount */}
              <div className="flex items-center justify-between md:justify-end gap-4 border-t md:border-t-0 pt-3 md:pt-0">
                <div className="text-left md:text-right">
                  <span className="text-xs text-secondary block">Total Paid</span>
                  <span className="font-numeric-metric text-base font-bold text-on-surface">
                    {formatCurrency(b.totalAmount)}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    to={`/booking/confirmation/${b.id}`}
                    className="px-3 py-1.5 rounded-lg border border-outline-variant hover:bg-surface-container text-xs font-semibold text-on-surface flex items-center gap-1"
                  >
                    <FileText className="w-3.5 h-3.5 text-primary" />
                    <span>View Pass</span>
                  </Link>

                  {b.status === 'upcoming' && (
                    <button
                      onClick={() => setCancelModalBooking(b)}
                      className="px-3 py-1.5 rounded-lg border border-red-200 text-error hover:bg-red-50 text-xs font-semibold"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Cancel Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!cancelModalBooking}
        onClose={() => setCancelModalBooking(null)}
        onConfirm={handleCancelConfirm}
        isDestructive={true}
        loading={cancelLoading}
        title="Cancel Parking Reservation"
        message={`Are you sure you want to cancel booking ${cancelModalBooking?.bookingRef} for Bay ${cancelModalBooking?.slotCode}? This will release the spot for other drivers.`}
        confirmText="Confirm Cancellation"
      />
    </div>
  );
}

