import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { bookingService } from '../../services/bookingService.js';
import { useBooking } from '../../context/BookingContext.jsx';
import {
  CheckCircle2,
  Printer,
  Calendar,
  Clock,
  Car,
  MapPin,
  QrCode,
  ArrowRight,
  ShieldCheck,
  Building,
  ParkingSquare,
} from 'lucide-react';
import { formatCurrency, formatDate, formatTime } from '../../utils/formatters.js';

export function BookingConfirmation() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const { draftBooking, clearSelection } = useBooking();
  const [booking, setBooking] = useState(draftBooking || null);
  const [loading, setLoading] = useState(!draftBooking);

  useEffect(() => {
    async function load() {
      if (draftBooking) {
        setBooking(draftBooking);
        setLoading(false);
        return;
      }
      try {
        const found = await bookingService.getBooking(bookingId);
        setBooking(found);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [bookingId, draftBooking]);

  // Clean up selected draft in booking context
  useEffect(() => {
    return () => {
      clearSelection();
    };
  }, []);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto py-16 px-4 text-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-secondary text-sm">Issuing digital pass...</p>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="max-w-md mx-auto py-16 px-4 text-center space-y-4">
        <h2 className="text-xl font-bold text-on-surface">Reservation Pass Not Found</h2>
        <p className="text-xs text-secondary">
          Could not locate booking record {bookingId}.
        </p>
        <Link
          to="/dashboard"
          className="inline-block px-4 py-2 bg-primary text-on-primary rounded-lg text-xs font-bold"
        >
          Return to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 md:py-14 space-y-8">
      {/* Success Hero Header */}
      <div className="text-center space-y-3">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-primary flex items-center justify-center mx-auto shadow-sm animate-success">
          <CheckCircle2 className="w-9 h-9" />
        </div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ECFDF5] border border-primary/20 text-primary text-xs font-semibold">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span>Booking Successfully Confirmed & Guaranteed!</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-headline-xl font-bold text-on-surface">
          Digital Pass Reference: {booking.bookingRef}
        </h1>
        <p className="text-xs sm:text-sm text-secondary max-w-lg mx-auto">
          Your parking bay is reserved and locked in facility systems. Present your optical QR pass at Gate Barrier #2 on arrival.
        </p>
      </div>

      {/* Confirmed Pass Card */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl shadow-md overflow-hidden">
        {/* Pass Top Ribbon */}
        <div className="bg-inverse-surface text-inverse-on-surface px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="p-1.5 rounded-md bg-white/10 text-inverse-primary">
              <ParkingSquare className="w-5 h-5" />
            </span>
            <div>
              <span className="text-[10px] text-outline-variant uppercase font-semibold block">
                Access Level & Hub
              </span>
              <span className="text-sm font-bold text-white">
                PARKWISE METROPOLITAN HUB — {booking.zoneLabel.toUpperCase()}
              </span>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded bg-primary-container text-on-primary text-xs font-bold">
            CONFIRMED
          </span>
        </div>

        {/* Card Body */}
        <div className="p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pb-6 border-b border-surface-container">
            <div>
              <span className="text-xs text-secondary uppercase font-semibold block">
                Assigned Bay Allocation
              </span>
              <div className="text-4xl sm:text-5xl font-display-lg text-primary font-extrabold tracking-tight mt-1">
                BAY {booking.slotCode}
              </div>
              <span className="inline-block mt-2 px-2.5 py-1 rounded-md bg-secondary-container/70 text-on-secondary-container text-xs font-semibold">
                {booking.slotType === 'ev' ? 'EV 150kW Fast-Charging Bay' : 'Standard Covered Bay'}
              </span>
            </div>

            {/* Stylized QR */}
            <div className="p-3 bg-surface rounded-xl border border-outline-variant text-center">
              <div className="w-28 h-28 bg-white p-2 rounded-lg border border-outline-variant flex items-center justify-center">
                <QrCode className="w-full h-full text-primary" />
              </div>
              <span className="text-[10px] text-outline mt-1 block">Scan at Gate Barrier</span>
            </div>
          </div>

          {/* Details Matrix */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-4 gap-x-6 text-xs">
            <div>
              <span className="text-secondary block font-medium">Customer Name</span>
              <span className="font-semibold text-on-surface text-sm">{booking.userName}</span>
            </div>
            <div>
              <span className="text-secondary block font-medium">Booking Date</span>
              <span className="font-semibold text-on-surface text-sm">{formatDate(booking.date)}</span>
            </div>
            <div>
              <span className="text-secondary block font-medium">Time Window</span>
              <span className="font-semibold text-on-surface text-sm">
                {formatTime(booking.startTime)} – {formatTime(booking.endTime)}
              </span>
            </div>
            <div>
              <span className="text-secondary block font-medium">Vehicle Plate</span>
              <span className="font-mono font-bold text-on-surface bg-surface-container px-1.5 py-0.5 rounded border border-outline-variant inline-block mt-0.5">
                {booking.vehicle?.plate || 'CA 7XYZ89'}
              </span>
            </div>
            <div>
              <span className="text-secondary block font-medium">Dedicated Entrance</span>
              <span className="font-semibold text-on-surface text-sm">{booking.entryBarrier}</span>
            </div>
            <div>
              <span className="text-secondary block font-medium">Total Paid</span>
              <span className="font-bold text-primary font-numeric-metric text-base">
                {formatCurrency(booking.totalAmount)}
              </span>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="bg-surface-container-low px-6 py-4 border-t border-outline-variant flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-secondary">
            <ShieldCheck className="w-4 h-4 text-primary" />
            <span>Digital invoice and entrance credentials confirmed.</span>
          </div>

          <div className="flex items-center gap-2 no-print">
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-surface-container-lowest border border-outline-variant rounded-lg text-xs font-semibold hover:bg-surface-container"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Pass</span>
            </button>
            <Link
              to="/my-bookings"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-primary text-on-primary rounded-lg text-xs font-bold hover:bg-primary-hover"
            >
              <span>View in My Bookings</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Return to Dashboard */}
      <div className="text-center pt-2">
        <Link
          to="/dashboard"
          className="text-xs text-secondary hover:text-primary font-semibold transition-colors"
        >
          ← Return to Customer Dashboard
        </Link>
      </div>
    </div>
  );
}

