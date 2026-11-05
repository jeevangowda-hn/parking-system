import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBooking } from '../../context/BookingContext.jsx';
import { useParking } from '../../context/ParkingContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import {
  SlidersHorizontal,
  ShieldCheck,
  MapPin,
  Calendar,
  Clock,
  Car,
  Zap,
  Accessibility,
  Search,
  ArrowRight,
} from 'lucide-react';
import { isFutureOrTodayDate, isValidTimeRange } from '../../utils/validators.js';

export function SearchForm({ onSearchSubmit, initialValues }) {
  const navigate = useNavigate();
  const { zones } = useParking();
  const { searchParams, updateSearchParams } = useBooking();
  const { error } = useToast();

  const [formState, setFormState] = useState({
    zoneId: initialValues?.zoneId || searchParams.zoneId || 'zone-a',
    date: initialValues?.date || searchParams.date || new Date().toISOString().split('T')[0],
    startTime: initialValues?.startTime || searchParams.startTime || '09:00',
    endTime: initialValues?.endTime || searchParams.endTime || '13:00',
    vehicleType: initialValues?.vehicleType || searchParams.vehicleType || 'standard',
  });

  const handleChange = (field, value) => {
    setFormState(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!isFutureOrTodayDate(formState.date)) {
      error('Please select today or a future date for your parking reservation.');
      return;
    }

    if (!isValidTimeRange(formState.startTime, formState.endTime)) {
      error('End time must be after start time.');
      return;
    }

    // Persist search params in context
    updateSearchParams(formState);

    if (onSearchSubmit) {
      onSearchSubmit(formState);
    } else {
      navigate(`/parking/${formState.zoneId}`);
    }
  };

  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-lg p-5 md:p-8 backdrop-blur-sm relative">
      <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-surface-container-highest mb-6">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-5 h-5 text-primary" />
          <span className="font-headline-sm text-base font-bold text-on-surface">
            Precision Slot Finder
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-tertiary">
          <ShieldCheck className="w-4 h-4 text-primary" />
          <span>100% Guaranteed Space Reservation</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Field 1: Facility/Zone Selector */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-secondary">Facility / Zone</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-tertiary">
                <MapPin className="w-4 h-4" />
              </div>
              <select
                value={formState.zoneId}
                onChange={(e) => handleChange('zoneId', e.target.value)}
                className="w-full pl-9 pr-8 py-2.5 bg-surface-container-lowest border border-outline-variant rounded-lg text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer"
              >
                {zones.map((zone) => (
                  <option key={zone.id} value={zone.id}>
                    {zone.name} — {zone.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Field 2: Date Picker */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-secondary">Date</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-tertiary">
                <Calendar className="w-4 h-4" />
              </div>
              <input
                type="date"
                min={new Date().toISOString().split('T')[0]}
                value={formState.date}
                onChange={(e) => handleChange('date', e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-surface-container-lowest border border-outline-variant rounded-lg text-sm text-on-surface font-medium focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>
          </div>

          {/* Field 3: Start Time */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-secondary">Start Time</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-tertiary">
                <Clock className="w-4 h-4" />
              </div>
              <input
                type="time"
                value={formState.startTime}
                onChange={(e) => handleChange('startTime', e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-surface-container-lowest border border-outline-variant rounded-lg text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>
          </div>

          {/* Field 4: End Time */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-secondary">End Time</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-tertiary">
                <Clock className="w-4 h-4" />
              </div>
              <input
                type="time"
                value={formState.endTime}
                onChange={(e) => handleChange('endTime', e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-surface-container-lowest border border-outline-variant rounded-lg text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>
          </div>
        </div>

        {/* Vehicle Specification & CTA */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pt-2">
          {/* Vehicle Selectors */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-secondary mr-1 font-medium">Vehicle Specification:</span>

            <button
              type="button"
              onClick={() => handleChange('vehicleType', 'standard')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
                formState.vehicleType === 'standard'
                  ? 'border-primary bg-primary-fixed/30 text-primary'
                  : 'border-outline-variant bg-surface-container-lowest text-secondary hover:border-outline'
              }`}
            >
              <Car className="w-3.5 h-3.5" />
              <span>Standard Sedan</span>
            </button>

            <button
              type="button"
              onClick={() => handleChange('vehicleType', 'ev')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
                formState.vehicleType === 'ev'
                  ? 'border-primary bg-primary-fixed/30 text-primary'
                  : 'border-outline-variant bg-surface-container-lowest text-secondary hover:border-outline'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>EV Charging</span>
            </button>

            <button
              type="button"
              onClick={() => handleChange('vehicleType', 'accessible')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
                formState.vehicleType === 'accessible'
                  ? 'border-primary bg-primary-fixed/30 text-primary'
                  : 'border-outline-variant bg-surface-container-lowest text-secondary hover:border-outline'
              }`}
            >
              <Accessibility className="w-3.5 h-3.5" />
              <span>Accessible Priority</span>
            </button>
          </div>

          {/* Search CTA */}
          <button
            type="submit"
            className="w-full md:w-auto px-7 py-3 rounded-lg bg-primary hover:bg-primary-hover text-on-primary text-sm font-bold shadow-md hover:shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2.5"
          >
            <Search className="w-4 h-4" />
            <span>Check Live Slot Availability</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
}

