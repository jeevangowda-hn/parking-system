import React from 'react';

export function HourlyBarChart({ data = [] }) {
  const defaultBars = [
    { time: '06:00', pct: 24 },
    { time: '08:00', pct: 56 },
    { time: '10:00', pct: 88, isCurrent: true },
    { time: '12:00', pct: 91 },
    { time: '14:00', pct: 74 },
    { time: '16:00', pct: 62 },
    { time: '18:00', pct: 48 },
    { time: '20:00', pct: 31 },
  ];

  const bars = data.length > 0
    ? data.map(d => ({ time: d.time, pct: d.occupancyPct || d.pct, isCurrent: d.isPeak }))
    : defaultBars;

  return (
    <div className="py-2 flex flex-col gap-4">
      <div className="h-44 w-full flex items-end justify-between gap-2 sm:gap-3 px-2 pt-4">
        {bars.map((bar) => (
          <div
            key={bar.time}
            className="flex-1 flex flex-col items-center gap-2 h-full justify-end group relative"
          >
            <span
              className={`text-xs ${
                bar.isCurrent
                  ? 'text-primary font-bold'
                  : 'text-tertiary opacity-0 group-hover:opacity-100 transition-opacity'
              }`}
            >
              {bar.pct}%
            </span>

            <div
              className={`w-full rounded-t transition-all ${
                bar.isCurrent
                  ? 'bg-primary shadow-sm relative'
                  : 'bg-surface-container-high group-hover:bg-primary-container'
              }`}
              style={{ height: `${bar.pct}%` }}
            >
              {bar.isCurrent && (
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-primary-fixed rounded-full"></div>
              )}
            </div>

            <span
              className={`text-[11px] ${
                bar.isCurrent ? 'text-primary font-bold' : 'text-on-surface-variant'
              }`}
            >
              {bar.time}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

