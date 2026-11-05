import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useParking } from '../../context/ParkingContext.jsx';
import { useBooking } from '../../context/BookingContext.jsx';
import { SearchForm } from '../../components/forms/SearchForm.jsx';
import { ZoneCard } from '../../components/parking/ZoneCard.jsx';
import { Skeleton } from '../../components/common/Skeleton.jsx';
import { MapPin, Sparkles, ShieldCheck } from 'lucide-react';

export function FindParking() {
  const navigate = useNavigate();
  const { zones, loading } = useParking();
  const { updateSearchParams } = useBooking();

  const handleZoneSelect = (zone) => {
    updateSearchParams({ zoneId: zone.id });
    navigate(`/parking/${zone.id}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-10 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-outline-variant/60 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-container text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span>PRECISION FACILITY RESERVATIONS</span>
          </div>
          <h1 className="font-headline-xl text-2xl sm:text-3xl font-bold text-on-surface">
            Find & Reserve a Parking Spot
          </h1>
          <p className="text-xs sm:text-sm text-secondary mt-1 max-w-2xl">
            Choose your preferred facility zone, parking level, and target arrival window. Browse real-time slot capacities across all 4 downtown sections.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-secondary bg-surface-container-low px-3 py-2 rounded-lg border border-outline-variant/40">
          <MapPin className="w-4 h-4 text-primary" />
          <span>Facility: <strong>Downtown Metro Center (Hub 04)</strong></span>
        </div>
      </div>

      {/* Embedded Search Console */}
      <SearchForm
        onSearchSubmit={(params) => {
          navigate(`/parking/${params.zoneId}`);
        }}
      />

      {/* Available Zones Header */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-headline-lg text-lg sm:text-xl font-bold text-on-surface">
              Available Parking Sections ({zones.length} Zones Active)
            </h2>
            <p className="text-xs text-secondary">
              Select any level to inspect individual bay blueprints and lock in your reservation.
            </p>
          </div>
        </div>

        {/* Zone Cards Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-64 rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {zones.map((zone) => (
              <ZoneCard
                key={zone.id}
                zone={zone}
                onSelect={handleZoneSelect}
              />
            ))}
          </div>
        )}
      </div>

      {/* Guarantee Notice */}
      <div className="p-4 rounded-xl bg-surface-container-low/70 border border-outline-variant/60 flex items-center gap-3 text-xs text-secondary">
        <ShieldCheck className="w-5 h-5 text-primary shrink-0" />
        <span>
          <strong>Zero Over-Booking Guarantee:</strong> When you select and confirm a bay, our system reserves that stall identifier for the full specified duration.
        </span>
      </div>
    </div>
  );
}

