import React from 'react';
import { Zap, Accessibility, Car, Check, Wrench, Clock, Ban } from 'lucide-react';

export function ParkingSlot({
  slot,
  isSelected = false,
  onSelect,
  statusOverride,
}) {
  const status = statusOverride || slot.effectiveStatus || slot.baseStatus || 'available';
  const isAvailable = status === 'available';

  const handleClick = () => {
    if (isAvailable && onSelect) {
      onSelect(slot);
    }
  };

  const getTypeIcon = () => {
    if (slot.type === 'ev') {
      return <Zap className="w-3.5 h-3.5 shrink-0" />;
    }
    if (slot.type === 'accessible') {
      return <Accessibility className="w-3.5 h-3.5 shrink-0" />;
    }
    return <Car className="w-3.5 h-3.5 shrink-0" />;
  };

  if (isSelected) {
    return (
      <div
        onClick={handleClick}
        className="h-24 sm:h-28 rounded-lg bg-[#D1FAE5] border-2 border-primary ring-4 ring-primary/20 flex flex-col justify-between p-2 relative shadow-md transform -translate-y-1 transition-all cursor-pointer"
        role="button"
        aria-pressed="true"
        aria-label={`Slot ${slot.code}, Selected`}
      >
        <div className="flex justify-between items-start">
          <span className="font-slot-id text-xs font-bold text-primary">{slot.code}</span>
          <div className="flex items-center gap-1">
            {slot.type === 'ev' && (
              <span className="p-0.5 rounded bg-primary text-on-primary" title="EV Ready">
                <Zap className="w-3 h-3" />
              </span>
            )}
            <span className="p-0.5 rounded-full bg-primary text-on-primary" title="Selected Spot">
              <Check className="w-3 h-3" />
            </span>
          </div>
        </div>

        <div>
          <div className="inline-block px-1.5 py-0.5 rounded bg-primary text-on-primary text-[10px] font-bold uppercase tracking-wider">
            Selected
          </div>
          <div className="text-[11px] font-bold text-primary mt-0.5 truncate">
            {slot.type === 'ev' ? 'EV Ready' : 'Confirmed'}
          </div>
        </div>
      </div>
    );
  }

  if (status === 'available') {
    return (
      <button
        type="button"
        onClick={handleClick}
        className="h-24 sm:h-28 rounded border border-primary/50 bg-[#ECFDF5] hover:bg-primary-fixed/30 hover:border-primary transition-all flex flex-col justify-between p-2 group text-left shadow-xs"
        aria-label={`Slot ${slot.code}, Available`}
      >
        <div className="flex justify-between items-start">
          <span className="font-slot-id text-xs font-bold text-primary">{slot.code}</span>
          {slot.type === 'ev' ? (
            <span className="p-0.5 rounded bg-primary-fixed text-on-primary-fixed-variant" title="EV Ready">
              <Zap className="w-3 h-3" />
            </span>
          ) : slot.type === 'accessible' ? (
            <span className="p-0.5 rounded bg-secondary-container text-on-secondary-container" title="Accessible">
              <Accessibility className="w-3 h-3" />
            </span>
          ) : (
            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
          )}
        </div>
        <div className="text-center my-auto opacity-70 group-hover:opacity-100 transition-opacity">
          {getTypeIcon()}
        </div>
        <div className="text-[11px] font-semibold text-primary uppercase text-center group-hover:underline">
          Available
        </div>
      </button>
    );
  }

  if (status === 'occupied') {
    return (
      <div
        className="h-24 sm:h-28 rounded border border-outline-variant bg-surface-container flex flex-col justify-between p-2 opacity-75 cursor-not-allowed"
        aria-label={`Slot ${slot.code}, Occupied`}
      >
        <div className="flex justify-between items-start">
          <span className="font-slot-id text-xs text-outline">{slot.code}</span>
          <Ban className="w-3 h-3 text-outline" />
        </div>
        <div className="text-center my-auto opacity-50">
          {getTypeIcon()}
        </div>
        <div className="text-[11px] text-outline text-center">Occupied</div>
      </div>
    );
  }

  if (status === 'reserved') {
    return (
      <div
        className="h-24 sm:h-28 rounded border border-amber-300 bg-amber-50/70 flex flex-col justify-between p-2 cursor-not-allowed"
        aria-label={`Slot ${slot.code}, Reserved`}
      >
        <div className="flex justify-between items-start">
          <span className="font-slot-id text-xs text-amber-800 font-semibold">{slot.code}</span>
          <Clock className="w-3 h-3 text-amber-700" />
        </div>
        <div className="text-center my-auto opacity-60 text-amber-800">
          {getTypeIcon()}
        </div>
        <div className="text-[11px] text-amber-800 font-semibold text-center">Reserved</div>
      </div>
    );
  }

  // Maintenance
  return (
    <div
      className="h-24 sm:h-28 rounded border border-error/30 bg-error-container/40 flex flex-col justify-between p-2 cursor-not-allowed"
      aria-label={`Slot ${slot.code}, Maintenance`}
    >
      <div className="flex justify-between items-start">
        <span className="font-slot-id text-xs text-error font-semibold">{slot.code}</span>
        <Wrench className="w-3 h-3 text-error" />
      </div>
      <div className="text-center my-auto opacity-60 text-error">
        <Wrench className="w-4 h-4 mx-auto" />
      </div>
      <div className="text-[11px] text-error font-semibold text-center">Hold</div>
    </div>
  );
}

