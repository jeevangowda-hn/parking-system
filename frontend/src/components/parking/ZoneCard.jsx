import React from 'react';
import { ArrowRight, ShieldCheck, Zap, Accessibility } from 'lucide-react';

export function ZoneCard({
  zone,
  onSelect,
  showSelectButton = true,
}) {
  const isOptimal = zone.occupancyPct < 60;
  const isNearCap = zone.occupancyPct >= 80;

  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-5 shadow-sm hover:border-primary transition-all flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-tertiary">
              {zone.level}
            </span>
            <h3 className="font-headline-sm text-base font-bold text-on-surface">
              {zone.name} ({zone.label})
            </h3>
          </div>
          <span
            className={`px-2 py-0.5 rounded text-[11px] font-bold ${
              isNearCap
                ? 'bg-amber-100 text-amber-800'
                : isOptimal
                ? 'bg-primary-fixed/40 text-on-primary-fixed-variant'
                : 'bg-secondary-container text-on-secondary-container'
            }`}
          >
            {isNearCap ? 'Near Cap' : isOptimal ? 'Optimal' : 'Normal'}
          </span>
        </div>

        <div className="mt-4 flex items-baseline justify-between">
          <div>
            <span className="text-2xl font-bold font-numeric-metric text-on-surface">
              {zone.availableCount !== undefined ? zone.availableCount : zone.capacity}
            </span>
            <span className="text-xs text-secondary ml-1">/ {zone.capacity} Available</span>
          </div>
          <span className="text-xs font-semibold text-primary">
            {zone.occupancyPct || 0}% Occupied
          </span>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-surface-container h-2 rounded-full overflow-hidden mt-2">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              isNearCap ? 'bg-secondary' : 'bg-primary'
            }`}
            style={{ width: `${Math.min(100, zone.occupancyPct || 0)}%` }}
          />
        </div>

        {/* Amenities */}
        <div className="flex flex-wrap gap-1.5 mt-4">
          {zone.amenities?.map((amenity) => (
            <span
              key={amenity}
              className="px-2 py-0.5 rounded text-[10px] font-medium bg-surface-container text-on-surface-variant flex items-center gap-1"
            >
              {amenity.includes('EV') ? (
                <Zap className="w-3 h-3 text-primary" />
              ) : amenity.includes('Accessible') ? (
                <Accessibility className="w-3 h-3 text-secondary" />
              ) : (
                <ShieldCheck className="w-3 h-3 text-outline" />
              )}
              {amenity}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-surface-container flex items-center justify-between text-xs">
        <span className="text-secondary">{zone.sensorsOnline || 'Sensors: 100% Online'}</span>
        {showSelectButton && onSelect && (
          <button
            onClick={() => onSelect(zone)}
            className="font-bold text-primary hover:text-primary-hover flex items-center gap-1 group"
          >
            <span>Select Zone</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        )}
      </div>
    </div>
  );
}

