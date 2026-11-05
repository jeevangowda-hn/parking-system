import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export function ZoneBarChart({ data = [] }) {
  const chartData = data.length > 0
    ? data
    : [
        { name: 'Zone A', capacity: 60, occupied: 42, available: 18 },
        { name: 'Zone B', capacity: 60, occupied: 32, available: 28 },
        { name: 'Zone C', capacity: 80, occupied: 68, available: 12 },
        { name: 'Zone D', capacity: 20, occupied: 16, available: 4 },
      ];

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
          <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#64748B' }} />
          <YAxis tick={{ fontSize: 12, fill: '#64748B' }} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#FFFFFF',
              borderRadius: '8px',
              border: '1px solid #CBD5E1',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            }}
          />
          <Bar dataKey="occupied" name="Occupied" fill="#006948" radius={[4, 4, 0, 0]} />
          <Bar dataKey="available" name="Available" fill="#85F8C4" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

