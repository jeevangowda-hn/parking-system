import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { bookingService } from '../../services/bookingService.js';
import {
  ParkingSquare,
  Calendar,
  Clock,
  ArrowRight,
  ShieldCheck,
  Zap,
  CheckCircle2,
  AlertCircle,
  PlusCircle,
  Car,
} from 'lucide-react';
import { formatCurrency, formatDate, formatTime } from '../../utils/formatters.js';

export function CustomerDashboard() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBookings() {
      try {
        const data = await bookingService.getUserBookings(user?.id || 'u-001');
        setBookings(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchBookings();
  }, [user]);

  const upcomingBookings = bookings.filter((b) => b.status === 'upcoming' || b.status === 'active');
  const completedBookings = bookings.filter((b) => b.status === 'completed');
  const totalHours = bookings
    .filter((b) => b.status === 'completed')
    .reduce((sum, b) => sum + (b.duration || 0), 0);

  return (
    <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-primary to-primary-container text-on-primary rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-md">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 text-primary-fixed text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-primary-fixed animate-pulse" />
            <span>CUSTOMER MOBILITY PORTAL</span>
          </div>
          <h1 className="font-headline-xl text-2xl sm:text-3xl font-bold">
            Welcome back, {user?.name?.split(' ')[0] || 'Motorist'}!
          </h1>
          <p className="text-xs sm:text-sm text-primary-fixed opacity-90 max-w-xl">
            Downtown Metro Center parking status is currently <strong>Optimal</strong>. Your vehicle {user?.vehicle?.plate ? `(${user.vehicle.plate})` : ''} is registered for automatic RFID barrier lift.
          </p>
        </div>

        <Link
          to="/find-parking"
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-surface-container-lowest text-primary font-bold text-sm shadow-md hover:bg-surface active:scale-95 transition-all shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Reserve Parking Slot</span>
        </Link>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-secondary">Active & Upcoming</span>
            <div className="w-9 h-9 rounded-lg bg-primary-fixed/30 flex items-center justify-center text-primary">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-bold font-numeric-metric text-on-surface mt-2">
            {upcomingBookings.length}
          </div>
          <p className="text-xs text-secondary mt-1">Guaranteed bays reserved</p>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-secondary">Completed Stays</span>
            <div className="w-9 h-9 rounded-lg bg-secondary-container flex items-center justify-center text-secondary">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-bold font-numeric-metric text-on-surface mt-2">
            {completedBookings.length}
          </div>
          <p className="text-xs text-secondary mt-1">Past successful parkings</p>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-secondary">Total Hours Parked</span>
            <div className="w-9 h-9 rounded-lg bg-tertiary-fixed/40 flex items-center justify-center text-tertiary">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-bold font-numeric-metric text-on-surface mt-2">
            {totalHours}h
          </div>
          <p className="text-xs text-secondary mt-1">Total time saved in city</p>
        </div>
      </div>

      {/* Upcoming Bookings Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-headline-lg text-lg sm:text-xl font-bold text-on-surface">
              Upcoming & Active Reservations
            </h2>
            <p className="text-xs text-secondary">
              Show your digital pass QR code at the entrance barrier on arrival.
            </p>
          </div>
          <Link
            to="/my-bookings"
            className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
          >
            <span>View All Bookings</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {upcomingBookings.length === 0 ? (
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-8 text-center space-y-3">
            <Car className="w-8 h-8 text-outline mx-auto" />
            <h3 className="text-sm font-bold text-on-surface">No Active Reservations</h3>
            <p className="text-xs text-secondary max-w-sm mx-auto">
              You don't have any upcoming parking bays reserved. Search downtown zones to secure a spot before your trip.
            </p>
            <Link
              to="/find-parking"
              className="inline-block px-4 py-2 bg-primary text-on-primary rounded-lg text-xs font-bold"
            >
              Find a Parking Bay
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {upcomingBookings.map((b) => (
              <div
                key={b.id}
                className="bg-surface-container-lowest border border-outline-variant rounded-xl p-5 shadow-sm hover:border-primary transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="font-mono text-xs font-bold text-primary">
                        {b.bookingRef}
                      </span>
                      <h3 className="font-headline-sm text-base font-bold text-on-surface mt-0.5">
                        Bay {b.slotCode} • {b.zoneLabel}
                      </h3>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#ECFDF5] text-primary border border-primary/20">
                      {b.status.toUpperCase()}
                    </span>
                  </div>

                  <div className="mt-4 space-y-2 text-xs text-secondary">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-outline" />
                      <span>{formatDate(b.date)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-outline" />
                      <span>
                        {formatTime(b.startTime)} – {formatTime(b.endTime)} ({b.duration} hrs)
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Car className="w-3.5 h-3.5 text-outline" />
                      <span>{b.vehicle?.make} {b.vehicle?.model} ({b.vehicle?.plate})</span>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-surface-container flex items-center justify-between text-xs">
                  <span className="font-bold text-on-surface">
                    {formatCurrency(b.totalAmount)}
                  </span>
                  <Link
                    to={`/booking/confirmation/${b.id}`}
                    className="font-bold text-primary hover:underline flex items-center gap-1"
                  >
                    <span>View Pass</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

