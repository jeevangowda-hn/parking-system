import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

export function OccupancyDonut({
  occupied = 214,
  reserved = 24,
  available = 82,
}) {
  const total = occupied + reserved + available || 1;
  const occupiedPct = Math.round((occupied / total) * 100);
  const reservedPct = ((reserved / total) * 100).toFixed(1);
  const availablePct = ((available / total) * 100).toFixed(1);

  const data = [
    { name: 'Occupied', value: occupied, color: '#006948' },
    { name: 'Reserved', value: reserved, color: '#505F76' },
    { name: 'Available', value: available, color: '#85F8C4' },
  ];

  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-6 py-4">
      {/* Donut Chart with Center Text */}
      <div className="relative w-44 h-44 flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              innerRadius={52}
              outerRadius={68}
              paddingAngle={3}
              dataKey="value"
              startAngle={90}
              endAngle={-270}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="font-numeric-metric text-2xl font-bold text-on-surface">
            {occupiedPct}%
          </span>
          <span className="text-[10px] text-tertiary uppercase tracking-wider font-semibold">
            Occupied
          </span>
        </div>
      </div>

      {/* Legend with Metrics */}
      <div className="flex flex-col gap-3 min-w-[170px] text-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-sm bg-primary"></span>
            <span className="text-on-surface font-medium">Occupied</span>
          </div>
          <div className="font-slot-id font-bold text-on-surface">
            {occupied} ({occupiedPct}%)
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-sm bg-secondary"></span>
            <span className="text-on-surface font-medium">Reserved</span>
          </div>
          <div className="font-slot-id font-bold text-on-surface">
            {reserved} ({reservedPct}%)
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-sm bg-[#85F8C4] border border-outline-variant/60"></span>
            <span className="text-on-surface font-medium">Available</span>
          </div>
          <div className="font-slot-id font-bold text-on-surface">
            {available} ({availablePct}%)
          </div>
        </div>
      </div>
    </div>
  );
}

