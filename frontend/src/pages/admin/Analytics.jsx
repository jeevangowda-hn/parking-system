import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService.js';
import { ZoneBarChart } from '../../components/charts/ZoneBarChart.jsx';
import { HourlyBarChart } from '../../components/charts/HourlyBarChart.jsx';
import {
  BarChart3,
  TrendingUp,
  Clock,
  DollarSign,
  Zap,
  Layers,
  ArrowUpRight,
} from 'lucide-react';
import { formatCurrency } from '../../utils/formatters.js';

export function Analytics() {
  const [zones, setZones] = useState([]);
  const [hourly, setHourly] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [zoneSummaries, hourlyData, dashboardStats] = await Promise.all([
          adminService.getZoneSummaries(),
          adminService.getHourlyAnalytics(),
          adminService.getDashboardStats(),
        ]);
        setZones(zoneSummaries);
        setHourly(hourlyData);
        setStats(dashboardStats);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const zoneChartData = zones.map((z) => ({
    name: z.name,
    capacity: z.total,
    occupied: z.occupied,
    available: z.available,
  }));

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-outline-variant/60 pb-5">
        <h1 className="font-headline-xl text-2xl sm:text-3xl font-bold text-on-surface">
          Facility Analytics & Utilization Telemetry
        </h1>
        <p className="text-xs sm:text-sm text-secondary mt-1">
          Historical demand velocity curves, zone throughput velocity, and power delivery telemetry.
        </p>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-5 shadow-sm">
          <span className="text-xs text-secondary font-semibold">Peak Demand Window</span>
          <div className="text-2xl font-bold font-numeric-metric text-on-surface mt-1">
            11:30 AM
          </div>
          <span className="text-xs text-primary font-bold flex items-center gap-1 mt-2">
            <TrendingUp className="w-3.5 h-3.5" /> 92% Projected Capacity
          </span>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-5 shadow-sm">
          <span className="text-xs text-secondary font-semibold">Avg Stay Duration</span>
          <div className="text-2xl font-bold font-numeric-metric text-on-surface mt-1">
            3.4 Hours
          </div>
          <span className="text-xs text-secondary mt-2 block">Across Standard & EV Stalls</span>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-5 shadow-sm">
          <span className="text-xs text-secondary font-semibold">Today's Gross Bookings</span>
          <div className="text-2xl font-bold font-numeric-metric text-primary mt-1">
            $3,842.50
          </div>
          <span className="text-xs text-primary font-semibold flex items-center gap-0.5 mt-2">
            <ArrowUpRight className="w-3.5 h-3.5" /> +18.4% vs last Friday
          </span>
        </div>

        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-5 shadow-sm">
          <span className="text-xs text-secondary font-semibold">EV Fast Charge Delivery</span>
          <div className="text-2xl font-bold font-numeric-metric text-on-surface mt-1">
            80.0%
          </div>
          <span className="text-xs text-primary font-semibold flex items-center gap-1 mt-2">
            <Zap className="w-3.5 h-3.5" /> 16/20 EV Bays Engaged
          </span>
        </div>
      </div>

      {/* Chart 1: Zone Occupancy Comparison */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-surface-container">
          <div>
            <h2 className="font-headline-sm text-base font-bold text-on-surface">
              Occupancy vs. Availability by Facility Section
            </h2>
            <span className="text-xs text-secondary">Breakdown across Ground Floor, First Floor, Rooftop and EV Hub</span>
          </div>
          <Layers className="w-5 h-5 text-secondary" />
        </div>
        <ZoneBarChart data={zoneChartData} />
      </div>

      {/* Chart 2: Hourly Occupancy Velocity Curve */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-surface-container">
          <div>
            <h2 className="font-headline-sm text-base font-bold text-on-surface">
              Hourly Utilization Telemetry Curve
            </h2>
            <span className="text-xs text-secondary">Aggregated check-in volume throughout operating hours</span>
          </div>
          <Clock className="w-5 h-5 text-secondary" />
        </div>
        <HourlyBarChart data={hourly} />
      </div>
    </div>
  );
}

