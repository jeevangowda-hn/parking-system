import React from 'react';
import { ArrowRight } from 'lucide-react';

export function DrivewayLane({
  name = 'North Driving Lane (One-Way)',
  note = 'SPEED LIMIT 10 KM/H',
}) {
  return (
    <div className="h-12 bg-surface-container rounded-md flex items-center justify-between px-4 sm:px-6 border-y border-outline-variant/60 relative overflow-hidden my-2">
      <div className="lane-stripes absolute inset-0 opacity-40"></div>
      <div className="flex items-center gap-2 text-xs font-bold tracking-wide z-10 bg-surface-container/90 px-3 py-1 rounded text-on-surface-variant">
        <span>{name}</span>
        <ArrowRight className="w-3.5 h-3.5 text-primary" />
      </div>
      <div className="text-[11px] text-outline z-10 font-mono hidden sm:block">{note}</div>
    </div>
  );
}

