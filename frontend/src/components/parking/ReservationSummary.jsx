import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Zap,
  Footprints,
  Calendar,
  Clock,
  Car,
  ArrowRight,
  Lock,
  Headphones,
} from 'lucide-react';
import { formatCurrency, formatDate, formatTime } from '../../utils/formatters.js';

export function ReservationSummary({
  zone,
  selectedSlot,
  searchParams,
  onProceed,
}) {
  const navigate = useNavigate();
  const [secondsLeft, setSecondsLeft] = useState(582); // 9m 42s

  useEffect(() => {
    if (!selectedSlot) return;
    const interval = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [selectedSlot]);

  const formatTimer = (s) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // Calculate pricing
  const [sh, sm] = (searchParams.startTime || '09:00').split(':').map(Number);
  const [eh, em] = (searchParams.endTime || '13:00').split(':').map(Number);
  const duration = Math.max(1, (eh * 60 + em - (sh * 60 + sm)) / 60);
  const rate = zone?.hourlyRate || 4.50;
  const baseCost = parseFloat((duration * rate).toFixed(2));

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-md p-5 sm:p-6 flex flex-col gap-5">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-outline-variant/60">
          <div>
            <span className="text-[11px] font-bold text-primary uppercase tracking-wider block">
              Live Booking Order
            </span>
            <h2 className="font-headline-sm text-base font-bold text-on-surface">
              Reservation Details
            </h2>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-[#ECFDF5] text-primary text-xs font-semibold border border-primary/20 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-ping"></span>
            Active Draft
          </span>
        </div>

        {selectedSlot ? (
          <>
            {/* Selected Slot Highlight Card */}
            <div className="bg-surface-container-low rounded-lg p-4 border border-outline-variant/80 flex flex-col gap-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-primary text-on-primary flex flex-col items-center justify-center shadow-sm">
                    <span className="text-[10px] leading-tight opacity-80 uppercase font-mono">
                      Slot
                    </span>
                    <span className="text-base font-bold font-numeric-metric leading-none">
                      {selectedSlot.code}
                    </span>
                  </div>
                  <div>
                    <div className="text-sm font-bold text-on-surface">
                      Bay {selectedSlot.code}
                    </div>
                    <div className="text-xs text-secondary">
                      {zone?.level || 'Ground'} • {zone?.label || 'Covered Bay'}
                    </div>
                  </div>
                </div>

                {selectedSlot.type === 'ev' && (
                  <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-primary-fixed text-on-primary-fixed-variant text-[11px] font-bold">
                    <Zap className="w-3 h-3" />
                    <span>EV Fast</span>
                  </div>
                )}
              </div>

              {/* Feature tags */}
              <div className="flex flex-wrap gap-1.5 pt-1 text-[11px]">
                <span className="px-2 py-0.5 rounded bg-surface-container text-on-surface-variant font-medium">
                  Standard Vehicle
                </span>
                <span className="px-2 py-0.5 rounded bg-surface-container text-on-surface-variant font-medium">
                  Covered Heated Bay
                </span>
                <span className="px-2 py-0.5 rounded bg-surface-container text-on-surface-variant font-medium">
                  24/7 CCTV Telemetry
                </span>
              </div>

              {/* Proximity Callout */}
              <div className="mt-1 p-2.5 rounded bg-surface-container-lowest border border-outline-variant/60 flex items-center gap-2 text-xs text-on-surface">
                <Footprints className="w-4 h-4 text-primary shrink-0" />
                <span>
                  <strong>{zone?.walkTime || '45 seconds walk'}</strong> to Elevator Lobby & Exit
                </span>
              </div>
            </div>

            {/* Time Window & Vehicle Breakdown */}
            <div className="flex flex-col gap-2.5 text-xs">
              <div className="flex items-center justify-between py-1 border-b border-outline-variant/40">
                <span className="text-secondary flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-outline" />
                  Booking Date:
                </span>
                <span className="font-semibold text-on-surface">{formatDate(searchParams.date)}</span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-outline-variant/40">
                <span className="text-secondary flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-outline" />
                  Time Window:
                </span>
                <span className="font-semibold text-on-surface">
                  {formatTime(searchParams.startTime)} – {formatTime(searchParams.endTime)}
                  <span className="text-primary font-normal ml-1">({duration} hrs)</span>
                </span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-outline-variant/40">
                <span className="text-secondary flex items-center gap-1.5">
                  <Car className="w-3.5 h-3.5 text-outline" />
                  Assigned Vehicle:
                </span>
                <span className="font-semibold text-on-surface">Tesla Model 3 • CA 7XYZ89</span>
              </div>

              {selectedSlot.type === 'ev' && (
                <div className="flex items-center justify-between py-1">
                  <span className="text-secondary flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-outline" />
                    EV Charging:
                  </span>
                  <span className="font-semibold text-primary">Plug & Charge Auto-Detect</span>
                </div>
              )}
            </div>

            {/* Price Rate Summary Calculation */}
            <div className="bg-surface p-4 rounded-lg border border-outline-variant flex flex-col gap-2 text-xs">
              <div className="font-semibold text-secondary uppercase tracking-wider text-[11px]">
                Transparent Rate Calculation
              </div>
              <div className="flex justify-between items-center text-secondary">
                <span>Standard Parking ({formatCurrency(rate)}/hr × {duration} hrs)</span>
                <span className="font-mono font-medium text-on-surface">{formatCurrency(baseCost)}</span>
              </div>
              <div className="flex justify-between items-center text-secondary">
                <span>Facility Access & Security Surcharge</span>
                <span className="text-primary font-mono font-medium">$0.00 (Waived)</span>
              </div>
              <div className="h-px bg-outline-variant/60 my-1"></div>
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-sm font-bold text-on-surface block">Total Due</span>
                  <span className="text-[10px] text-outline">Free cancellation up to 15 mins prior</span>
                </div>
                <div className="text-right">
                  <span className="text-xl font-bold font-numeric-metric text-primary">
                    {formatCurrency(baseCost)}
                  </span>
                  <span className="block text-[10px] text-outline">USD</span>
                </div>
              </div>
            </div>

            {/* Primary Action Button */}
            <div className="flex flex-col gap-2 pt-1">
              <button
                onClick={onProceed}
                className="w-full py-3.5 px-4 rounded-lg bg-primary hover:bg-primary-hover text-on-primary text-sm font-bold shadow-md hover:shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <span>Continue to Booking Review</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-1.5 text-xs text-secondary py-1 text-center">
                <Lock className="w-3.5 h-3.5 text-primary shrink-0" />
                <span>
                  Slot {selectedSlot.code} is temporarily held for{' '}
                  <strong className="text-on-surface font-mono">{formatTimer(secondsLeft)}</strong>
                </span>
              </div>
            </div>
          </>
        ) : (
          <div className="py-8 text-center flex flex-col items-center justify-center gap-2 text-secondary">
            <Car className="w-8 h-8 text-outline mb-1" />
            <p className="text-sm font-semibold text-on-surface">No bay selected yet</p>
            <p className="text-xs text-outline max-w-xs">
              Click any green "Available" parking bay on the blueprint canvas to reserve it.
            </p>
          </div>
        )}
      </div>

      {/* Quick Facility Assistance Banner */}
      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-4 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-surface-container flex items-center justify-center text-secondary shrink-0">
            <Headphones className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-on-surface">Need Dispatch Help?</div>
            <div className="text-[11px] text-secondary">Gate intercom active 24/7</div>
          </div>
        </div>
        <button
          onClick={() => alert('Dispatch intercom connected. Audio channel ready.')}
          className="text-xs text-primary font-bold hover:underline"
        >
          Contact
        </button>
      </div>
    </div>
  );
}

