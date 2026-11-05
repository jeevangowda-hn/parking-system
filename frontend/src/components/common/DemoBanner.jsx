import React from 'react';
import { Info } from 'lucide-react';

export function DemoBanner() {
  return (
    <div className="demo-banner text-on-primary py-1.5 px-4 text-xs font-medium flex items-center justify-center gap-2 text-center no-print shadow-sm">
      <Info className="w-3.5 h-3.5 shrink-0" />
      <span>
        <strong>DEMONSTRATION PROTOTYPE:</strong> Data is simulated and stored locally in your browser. Multi-device cloud sync and physical sensors are disabled.
      </span>
    </div>
  );
}

