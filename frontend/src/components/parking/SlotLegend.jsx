import React from 'react';
import { Zap, Accessibility } from 'lucide-react';

export function SlotLegend() {
  return (
    <div className="p-4 bg-surface border-t border-outline-variant flex flex-wrap items-center justify-between gap-4 text-xs">
      <div className="font-bold text-on-surface-variant uppercase tracking-wider">
        Bay Status Legend:
      </div>
      <div className="flex flex-wrap items-center gap-4">
        {/* Available */}
        <div className="flex items-center gap-1.5">
          <span className="w-3.5 h-3.5 rounded border border-primary bg-[#ECFDF5]"></span>
          <span className="text-on-surface font-medium">Available</span>
        </div>
        {/* Selected */}
        <div className="flex items-center gap-1.5">
          <span className="w-3.5 h-3.5 rounded bg-primary text-on-primary flex items-center justify-center text-[10px]">✓</span>
          <span className="text-on-surface font-semibold text-primary">Selected (Active)</span>
        </div>
        {/* Occupied */}
        <div className="flex items-center gap-1.5">
          <span className="w-3.5 h-3.5 rounded border border-outline-variant bg-surface-container"></span>
          <span className="text-on-surface-variant">Occupied</span>
        </div>
        {/* Reserved */}
        <div className="flex items-center gap-1.5">
          <span className="w-3.5 h-3.5 rounded border border-amber-300 bg-amber-50"></span>
          <span className="text-on-surface-variant">Reserved</span>
        </div>
        {/* Maintenance */}
        <div className="flex items-center gap-1.5">
          <span className="w-3.5 h-3.5 rounded border border-error/30 bg-error-container/40"></span>
          <span className="text-on-surface-variant">Maintenance</span>
        </div>
        {/* EV Badge */}
        <div className="flex items-center gap-1.5">
          <span className="p-0.5 rounded bg-primary-fixed text-on-primary-fixed-variant flex items-center">
            <Zap className="w-3 h-3" />
          </span>
          <span className="text-on-surface-variant">EV Charger Slot</span>
        </div>
        {/* Accessible */}
        <div className="flex items-center gap-1.5">
          <span className="p-0.5 rounded bg-secondary-container text-on-secondary-container flex items-center">
            <Accessibility className="w-3 h-3" />
          </span>
          <span className="text-on-surface-variant">Accessible</span>
        </div>
      </div>
    </div>
  );
}

