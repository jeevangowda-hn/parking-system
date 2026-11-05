import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useBooking } from '../../context/BookingContext.jsx';
import { useParking } from '../../context/ParkingContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { bookingService } from '../../services/bookingService.js';
import {
  Printer,
  Download,
  ParkingSquare,
  Zap,
  QrCode,
  Lock,
  Compass,
  MapPin,
  Clock,
  Car,
  ShieldCheck,
  CheckCircle2,
  ChevronRight,
  Send,
  MoreHorizontal,
  PhoneCall,
  ArrowLeft,
  Wallet,
} from 'lucide-react';
import { formatCurrency, formatDate, formatTime } from '../../utils/formatters.js';

export function BookingReview() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { zones } = useParking();
  const { searchParams, selectedSlot, setDraftBooking } = useBooking();
  const { success, error } = useToast();

  const [loading, setLoading] = useState(false);

  // Fallback demo slot if accessed directly
  const slot = selectedSlot || {
    id: 'zone-a-A-14',
    code: 'A-14',
    zoneId: 'zone-a',
    type: 'ev',
  };

  const zone = zones.find((z) => z.id === slot.zoneId) || {
    id: 'zone-a',
    name: 'Zone A',
    label: 'Ground Floor',
    level: 'Level G',
    entryGate: 'North Ramp Barrier #2',
    hourlyRate: 4.50,
  };

  // Pricing calculations
  const [sh, sm] = (searchParams.startTime || '09:00').split(':').map(Number);
  const [eh, em] = (searchParams.endTime || '13:00').split(':').map(Number);
  const duration = Math.max(1, (eh * 60 + em - (sh * 60 + sm)) / 60);
  const baseParking = parseFloat((duration * (zone.hourlyRate || 4.50)).toFixed(2));
  const surcharge = duration >= 4 ? 1.20 : 0;
  const totalAmount = parseFloat((baseParking + surcharge).toFixed(2));

  const handleConfirmReservation = async () => {
    try {
      setLoading(true);
      const newBooking = await bookingService.createBooking({
        userId: user?.id || 'u-001',
        userName: user?.name || 'Alex Customer',
        userEmail: user?.email || 'customer@parkwise.demo',
        zoneId: zone.id,
        zoneName: zone.name,
        zoneLabel: zone.label,
        slotId: slot.id,
        slotCode: slot.code,
        slotType: slot.type,
        date: searchParams.date || new Date().toISOString().split('T')[0],
        startTime: searchParams.startTime || '09:00',
        endTime: searchParams.endTime || '13:00',
        vehicle: user?.vehicle || {
          make: 'Tesla',
          model: 'Model 3',
          plate: 'CA 7XYZ89',
          type: 'EV',
        },
        hourlyRate: zone.hourlyRate || 4.50,
        paymentMethod: 'Mastercard •••• 4092',
        entryBarrier: zone.entryGate || 'North Ramp Barrier #2',
      });

      setDraftBooking(newBooking);
      success(`Reservation ${newBooking.bookingRef} confirmed successfully!`);
      navigate(`/booking/confirmation/${newBooking.id}`);
    } catch (err) {
      error(err.message || 'Failed to complete reservation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
      {/* Breadcrumb Context */}
      <div className="flex items-center gap-2 text-xs text-secondary mb-6">
        <Link to="/find-parking" className="hover:text-primary transition-colors">
          Find Parking
        </Link>
        <ChevronRight className="w-3 h-3 text-outline" />
        <Link to={`/parking/${zone.id}`} className="hover:text-primary transition-colors">
          Bay Selection
        </Link>
        <ChevronRight className="w-3 h-3 text-outline" />
        <span className="font-semibold text-primary">Booking Review & Pass Issuance</span>
      </div>

      {/* Hero Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ECFDF5] border border-primary/20 text-primary mb-3">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
          </span>
          <span className="text-xs font-semibold">Active Bay Hold • Ready for Confirmation</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-headline-xl font-headline-xl font-bold text-on-surface tracking-tight">
              Review Reservation & Digital Pass
            </h1>
            <p className="text-xs sm:text-sm text-secondary mt-1 max-w-2xl">
              Inspect your assigned parking bay allocation, walking route guide, and payment receipt before locking in your contactless access pass.
            </p>
          </div>

          <div className="flex items-center gap-2 no-print">
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-surface-container-lowest border border-outline-variant hover:border-outline text-on-surface rounded-lg text-xs font-semibold transition-all active:scale-95 shadow-sm"
            >
              <Printer className="w-4 h-4" />
              <span>Print Pass</span>
            </button>
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-primary text-on-primary hover:bg-primary-hover rounded-lg text-xs font-bold transition-all active:scale-95 shadow-sm"
            >
              <Download className="w-4 h-4" />
              <span>Download PDF</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2-Column Asymmetric Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* ===================================================================== */}
        {/* LEFT SECTION: BOARDING PASS & FACILITY ROUTE (Cols: 7)                */}
        {/* ===================================================================== */}
        <div className="lg:col-span-7 space-y-6">
          {/* DIGITAL PARKING BOARDING PASS CARD */}
          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant shadow-md relative overflow-hidden transition-all hover:shadow-lg">
            {/* Pass Top Header Ribbon */}
            <div className="bg-inverse-surface text-inverse-on-surface px-6 py-4 flex items-center justify-between border-b border-outline">
              <div className="flex items-center gap-3">
                <span className="p-1.5 rounded-md bg-white/10 text-inverse-primary">
                  <ParkingSquare className="w-5 h-5" />
                </span>
                <div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-outline-variant block">
                    Access Zone & Level
                  </span>
                  <span className="text-sm font-bold tracking-tight text-white">
                    PARKWISE METROPOLITAN HUB - {zone.level.toUpperCase()}
                  </span>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded bg-primary-container text-on-primary text-xs font-semibold tracking-wide">
                TERMINAL 1 NORTH
              </span>
            </div>

            {/* Main Pass Slot & QR Visual Section */}
            <div className="p-6 md:p-8">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pb-6">
                {/* Massive Bay Slot Code Callout */}
                <div className="text-center sm:text-left space-y-2">
                  <span className="text-xs uppercase text-outline tracking-wider font-semibold block">
                    Assigned Bay Allocation
                  </span>
                  <div className="flex items-baseline gap-3">
                    <span className="text-4xl sm:text-display-lg font-display-lg text-primary tracking-tight font-extrabold">
                      BAY {slot.code}
                    </span>
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-secondary-container/70 text-on-secondary-fixed-variant text-xs font-semibold">
                    <Zap className="w-3.5 h-3.5 text-primary" />
                    <span>{slot.type === 'ev' ? 'EV 150kW Ultra Fast-Charge' : 'Standard Covered Bay'}</span>
                  </div>
                </div>

                {/* High-Fidelity Contactless QR Scanner Code Block */}
                <div className="flex flex-col items-center p-4 bg-surface rounded-xl border border-outline-variant text-center w-full sm:w-auto">
                  <div className="w-32 h-32 bg-white p-2.5 rounded-lg border border-outline-variant flex items-center justify-center shadow-inner relative group cursor-pointer">
                    <svg className="w-full h-full text-on-surface" fill="currentColor" viewBox="0 0 100 100">
                      <path d="M0,0 h30 v30 h-30 z M5,5 h20 v20 h-20 z M10,10 h10 v10 h-10 z" />
                      <path d="M70,0 h30 v30 h-30 z M75,5 h20 v20 h-20 z M80,10 h10 v10 h-10 z" />
                      <path d="M0,70 h30 v30 h-30 z M5,75 h20 v20 h-20 z M10,80 h10 v10 h-10 z" />
                      <rect x="36" y="6" width="6" height="6" />
                      <rect x="46" y="6" width="14" height="6" />
                      <rect x="36" y="16" width="8" height="8" />
                      <rect x="52" y="16" width="10" height="6" />
                      <rect x="6" y="36" width="12" height="6" />
                      <rect x="22" y="36" width="12" height="12" />
                      <rect x="38" y="32" width="6" height="6" />
                      <rect x="48" y="30" width="8" height="8" />
                      <rect x="60" y="34" width="8" height="6" />
                      <rect x="74" y="36" width="16" height="8" />
                      <rect x="6" y="52" width="8" height="12" />
                      <rect x="20" y="52" width="10" height="6" />
                      <rect x="36" y="44" width="12" height="12" />
                      <rect x="54" y="46" width="6" height="6" />
                      <rect x="66" y="48" width="12" height="6" />
                      <rect x="84" y="48" width="10" height="10" />
                      <rect x="36" y="62" width="8" height="8" />
                      <rect x="50" y="60" width="8" height="14" />
                      <rect x="64" y="60" width="6" height="6" />
                      <rect x="76" y="64" width="18" height="6" />
                      <circle cx="50" cy="50" r="7" fill="#006948" />
                    </svg>
                  </div>
                  <div className="mt-2.5 flex items-center gap-1.5 text-xs font-bold text-on-surface">
                    <QrCode className="w-3.5 h-3.5 text-primary" />
                    <span>Scan at Entrance Gate</span>
                  </div>
                  <span className="text-[10px] text-outline mt-0.5">Barrier reads plate or optical QR</span>
                </div>
              </div>

              {/* Perforation notch division line */}
              <div className="relative py-4 my-2 flex items-center">
                <div className="ticket-notch-left"></div>
                <div className="w-full perforation-line"></div>
                <div className="ticket-notch-right"></div>
              </div>

              {/* Key Booking Metadata Grid (2x3 Matrix) */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-y-5 gap-x-4 pt-2 text-xs">
                <div>
                  <span className="text-secondary block font-medium">Draft Reference</span>
                  <span className="text-sm font-bold text-on-surface">#PW-PENDING</span>
                </div>
                <div>
                  <span className="text-secondary block font-medium">Pass Status</span>
                  <span className="inline-flex items-center gap-1.5 font-bold text-primary">
                    <span className="w-2 h-2 rounded-full bg-primary inline-block"></span>
                    READY TO CONFIRM
                  </span>
                </div>
                <div>
                  <span className="text-secondary block font-medium">Reservation Date</span>
                  <span className="font-semibold text-on-surface">{formatDate(searchParams.date)}</span>
                </div>
                <div>
                  <span className="text-secondary block font-medium">Active Window</span>
                  <span className="font-semibold text-on-surface">
                    {formatTime(searchParams.startTime)} – {formatTime(searchParams.endTime)}
                  </span>
                  <span className="text-secondary block font-normal">({duration}h 00m reserved)</span>
                </div>
                <div>
                  <span className="text-secondary block font-medium">Assigned Vehicle</span>
                  <span className="font-semibold text-on-surface">Tesla Model 3</span>
                  <span className="inline-block bg-surface-container px-1.5 py-0.5 rounded text-[10px] font-mono text-on-surface-variant font-bold border border-outline-variant ml-1">
                    CA 7XYZ89
                  </span>
                </div>
                <div>
                  <span className="text-secondary block font-medium">Dedicated Entry Barrier</span>
                  <span className="font-semibold text-on-surface">{zone.entryGate}</span>
                  <span className="text-primary block text-[11px]">Lane 2B (Clearance {zone.clearanceHeight})</span>
                </div>
              </div>
            </div>

            {/* Card Bottom Verification Footer */}
            <div className="bg-surface-container-low px-6 py-3.5 border-t border-outline-variant/60 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-secondary">
                <Lock className="w-4 h-4 text-primary" />
                <span>Encrypted cryptogram ready for automatic gate lift</span>
              </div>
              <span className="text-outline font-mono text-[11px]">Terminal ID: PW-NW-L0-{slot.code}</span>
            </div>
          </div>

          {/* FACILITY NAVIGATION & WALKING ROUTE GUIDE */}
          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-primary">
                  <Compass className="w-4 h-4" />
                </span>
                <div>
                  <h2 className="text-sm sm:text-base font-bold font-headline-sm text-on-surface">
                    Facility Navigation & Pedestrian Route
                  </h2>
                  <p className="text-xs text-secondary">
                    Step-by-step guidance from Bay {slot.code} to concourse elevators.
                  </p>
                </div>
              </div>
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary bg-[#ECFDF5] px-2.5 py-1 rounded-md border border-primary/20">
                <Clock className="w-3.5 h-3.5" />
                <span>{zone.walkTime || '2 min walk to Elevators'}</span>
              </span>
            </div>

            {/* Architectural Parking Schema Walking Vector SVG */}
            <div className="relative w-full h-48 rounded-xl overflow-hidden border border-outline-variant bg-surface-container-high mb-4">
              <div
                className="absolute inset-0 opacity-80"
                style={{
                  backgroundImage: 'radial-gradient(#bccac0 1px, transparent 1px)',
                  backgroundSize: '16px 16px',
                }}
              />
              <div className="absolute inset-0 p-4 flex flex-col justify-between pointer-events-none">
                <div className="flex justify-between items-center text-[10px] font-mono text-outline uppercase font-semibold">
                  <span>North Ramp Vector [Lane 2B]</span>
                  <span>Pedestrian Lobby Concourse [East Wing]</span>
                </div>

                <svg className="w-full h-24 my-auto" fill="none" viewBox="0 0 600 120">
                  <path d="M 20 60 L 580 60" stroke="#bccac0" strokeDasharray="6 6" strokeWidth="2" />
                  <rect x="60" y="10" width="40" height="40" rx="4" fill="#ffffff" stroke="#6d7a72" strokeWidth="1.5" />
                  <text x="80" y="35" fill="#3d4a42" fontFamily="Manrope" fontSize="11" fontWeight="bold" textAnchor="middle">
                    A-12
                  </text>
                  <rect x="120" y="10" width="46" height="42" rx="4" fill="#D1FAE5" stroke="#006948" strokeWidth="2.5" />
                  <text x="143" y="35" fill="#006948" fontFamily="Manrope" fontSize="11" fontWeight="bold" textAnchor="middle">
                    {slot.code}
                  </text>
                  <circle cx="143" cy="46" r="3" fill="#006948" />
                  <rect x="186" y="10" width="40" height="40" rx="4" fill="#ffffff" stroke="#6d7a72" strokeWidth="1.5" />
                  <text x="206" y="35" fill="#3d4a42" fontFamily="Manrope" fontSize="11" fontWeight="bold" textAnchor="middle">
                    A-16
                  </text>
                  <path d="M 143 52 L 143 85 Q 143 95 155 95 L 470 95 Q 485 95 485 75 L 485 35" fill="none" stroke="#006948" strokeDasharray="5 5" strokeWidth="3" />
                  <g transform="translate(470, 10)">
                    <rect x="0" y="0" width="32" height="32" rx="6" fill="#0F172A" />
                    <circle cx="16" cy="16" r="4" fill="#68dba9" />
                  </g>
                  <text x="486" y="52" fill="#0F172A" fontFamily="Inter" fontSize="10" fontWeight="600" textAnchor="middle">
                    Elevators
                  </text>
                </svg>

                <div className="flex items-center justify-between text-xs bg-surface-container-lowest/90 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-outline-variant/60">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-primary"></span>
                    <span className="font-semibold text-on-surface">Origin: Bay {slot.code} ({zone.level})</span>
                  </div>
                  <div className="flex items-center gap-1 text-secondary">
                    <span>140 ft East to Sky Bridge & Main Elevators</span>
                  </div>
                </div>
              </div>
            </div>

            {/* GPS External Navigation Hand-off CTAs */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              <span className="text-xs text-secondary font-medium">Drive directly to entrance gate:</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => alert('GPS Handoff: Target set to 100 Metro Plaza North Entrance Lane 2B')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface text-xs font-semibold border border-outline-variant transition-colors"
                >
                  <MapPin className="w-3.5 h-3.5 text-primary" />
                  <span>Apple Maps</span>
                </button>
                <button
                  type="button"
                  onClick={() => alert('GPS Handoff: Target set to 100 Metro Plaza North Entrance Lane 2B')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface text-xs font-semibold border border-outline-variant transition-colors"
                >
                  <MapPin className="w-3.5 h-3.5 text-primary" />
                  <span>Google Maps</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ===================================================================== */}
        {/* RIGHT SECTION: RESERVATION SUMMARY & PASS ACTIONS (Cols: 5)           */}
        {/* ===================================================================== */}
        <div className="lg:col-span-5 space-y-6">
          {/* PAYMENT & CHARGE BREAKDOWN CARD */}
          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant p-6 shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-outline-variant/60 mb-5">
              <div>
                <h2 className="text-sm sm:text-base font-bold font-headline-sm text-on-surface">
                  Payment Receipt Summary
                </h2>
                <span className="text-xs text-secondary">Mastercard ending in •••• 4092</span>
              </div>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#ECFDF5] text-primary text-xs font-bold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>READY</span>
              </span>
            </div>

            {/* Itemized Rows */}
            <div className="space-y-3.5 text-xs">
              <div className="flex items-center justify-between text-secondary">
                <span>Base Parking ({duration} hrs @ {formatCurrency(zone.hourlyRate)}/hr)</span>
                <span className="font-semibold text-on-surface font-mono">{formatCurrency(baseParking)}</span>
              </div>
              <div className="flex items-center justify-between text-secondary">
                <div className="flex items-center gap-1.5">
                  <span>EV Charging Connectivity</span>
                  <span className="text-[10px] bg-secondary-container px-1 rounded text-on-secondary-container font-semibold">
                    Tier 1
                  </span>
                </div>
                <span className="font-semibold text-primary">Included</span>
              </div>
              <div className="flex items-center justify-between text-secondary">
                <span>City Mobility Surcharge</span>
                <span className="font-semibold text-on-surface font-mono">{formatCurrency(surcharge)}</span>
              </div>
              <div className="flex items-center justify-between text-secondary">
                <span>Applicable Municipal Sales Tax (0.00%)</span>
                <span className="font-semibold text-on-surface font-mono">$0.00</span>
              </div>

              <div className="border-t border-outline-variant pt-3.5 mt-2 flex items-baseline justify-between">
                <div>
                  <span className="text-base font-bold text-on-surface block">Total Due</span>
                  <span className="text-[11px] text-outline">Includes instant digital boarding pass</span>
                </div>
                <span className="text-2xl font-bold font-numeric-metric text-primary">
                  {formatCurrency(totalAmount)}
                </span>
              </div>
            </div>

            {/* Refund & Policy Micro-note */}
            <div className="mt-5 p-3 rounded-lg bg-surface-container-low border border-outline-variant/60 flex items-start gap-2 text-xs text-secondary">
              <ShieldCheck className="w-4 h-4 text-primary shrink-0 mt-0.5" />
              <span>
                Free cancellation eligible up to 15 minutes before slot window begins.
              </span>
            </div>
          </div>

          {/* PRIMARY CONFIRM ACTION & WALLET INTEGRATIONS */}
          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant p-6 shadow-sm space-y-4">
            <h2 className="text-sm sm:text-base font-bold font-headline-sm text-on-surface">
              Lock & Issue Digital Pass
            </h2>

            {/* Confirm Reservation CTA */}
            <button
              onClick={handleConfirmReservation}
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-xl bg-primary hover:bg-primary-hover text-on-primary font-bold text-sm shadow-md hover:shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <span>Generating Digital Pass...</span>
              ) : (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Confirm Reservation ({formatCurrency(totalAmount)})</span>
                </>
              )}
            </button>

            {/* Wallet Buttons */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => alert('Apple Wallet token created for CA 7XYZ89')}
                className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-black text-white hover:bg-neutral-800 text-xs font-semibold shadow-xs"
              >
                <Wallet className="w-4 h-4" />
                <span>Apple Wallet</span>
              </button>
              <button
                type="button"
                onClick={() => alert('Google Wallet pass ready for Bay ' + slot.code)}
                className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-surface-container-lowest border border-outline hover:bg-surface-container-low text-on-surface text-xs font-semibold shadow-xs"
              >
                <Wallet className="w-4 h-4 text-primary" />
                <span>Google Wallet</span>
              </button>
            </div>

            {/* Send via Email / SMS */}
            <button
              type="button"
              onClick={() => alert(`Digital pass dispatched to ${user?.email || 'customer@parkwise.demo'} and mobile on file.`)}
              className="w-full flex items-center justify-between px-4 py-3 rounded-xl border border-outline-variant hover:border-primary hover:bg-surface-container-low transition-colors text-left"
            >
              <div className="flex items-center gap-2.5">
                <Send className="w-4 h-4 text-primary" />
                <div>
                  <span className="text-xs font-bold text-on-surface block">Send Pass via SMS / Email</span>
                  <span className="text-[11px] text-secondary">Instant dispatch to customer profile</span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-outline" />
            </button>

            {/* Modify selection back button */}
            <Link
              to={`/parking/${zone.id}`}
              className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-outline-variant hover:bg-surface-container-low text-xs font-semibold text-secondary transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Modify Bay or Time Window</span>
            </Link>
          </div>

          {/* Support Dispatch Callout */}
          <div className="p-4 rounded-xl border border-outline-variant/60 bg-surface-container-low/80 flex items-center justify-between gap-3 text-xs text-secondary">
            <div className="flex items-center gap-2.5">
              <PhoneCall className="w-4 h-4 text-primary" />
              <div>
                <span className="font-bold text-on-surface block">Need barrier or dispatch help?</span>
                <span className="text-outline text-[11px]">Facility Control Center is 24/7 active</span>
              </div>
            </div>
            <button
              onClick={() => alert('Dispatch intercom ringing entrance barrier 2B...')}
              className="px-3 py-1.5 rounded-lg border border-outline-variant bg-surface-container-lowest hover:bg-surface-container text-xs font-bold text-on-surface"
            >
              Call Gate
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

