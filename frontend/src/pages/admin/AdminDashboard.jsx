import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminService } from '../../services/adminService.js';
import { OccupancyDonut } from '../../components/charts/OccupancyDonut.jsx';
import { HourlyBarChart } from '../../components/charts/HourlyBarChart.jsx';
import {
  Radio,
  Zap,
  Car,
  CheckCircle2,
  Calendar,
  PieChart,
  TrendingUp,
  ArrowRight,
  Search,
  Receipt,
  Sparkles,
  History,
  Activity,
  Layers,
} from 'lucide-react';
import { formatCurrency, formatDate, formatTime } from '../../utils/formatters.js';

export function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [zones, setZones] = useState([]);
  const [hourlyData, setHourlyData] = useState([]);
  const [recentBookings, setRecentBookings] = useState([]);
  const [rosterFilter, setRosterFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [dashStats, zoneList, hourly, bookings] = await Promise.all([
          adminService.getDashboardStats(),
          adminService.getZoneSummaries(),
          adminService.getHourlyAnalytics(),
          adminService.getAllBookings(),
        ]);
        setStats(dashStats);
        setZones(zoneList);
        setHourlyData(hourly);
        setRecentBookings(bookings.slice(0, 5));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const filteredBookings = recentBookings.filter((b) => {
    if (rosterFilter === 'active' && b.status !== 'active') return false;
    if (rosterFilter === 'scheduled' && b.status !== 'upcoming') return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        b.bookingRef.toLowerCase().includes(q) ||
        b.userName.toLowerCase().includes(q) ||
        b.slotCode.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="flex flex-col gap-8">
      {/* ========================================================================= */}
      {/* BANNER / TITLE SECTION                                                    */}
      {/* ========================================================================= */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-outline-variant/30 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-secondary-container text-on-secondary-container text-xs font-semibold mb-2">
            <Zap className="w-3.5 h-3.5 text-primary" />
            <span>DEMONSTRATION OPERATIONAL DATA • CLOUD MOBILITY ENGINE v2.4</span>
          </div>
          <h1 className="font-headline-xl text-2xl sm:text-3xl font-bold text-on-surface">
            Parking Operations Overview
          </h1>
          <p className="text-xs sm:text-sm text-secondary mt-1">
            Live bay occupancy telemetry, reservation traffic, and real-time slot allocation for Downtown Metro Hub.
          </p>
        </div>
        <div className="flex items-center gap-2 text-secondary text-xs bg-surface-container-low px-3 py-2 rounded-lg border border-outline-variant/40">
          <Radio className="w-3.5 h-3.5 text-primary" />
          <span>Hardware Latency: <strong>14ms</strong> (LoRaWAN Gateway Node 04)</span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4 PRIMARY KPI METRIC CARDS                                                */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        {/* Metric 1: Capacity */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-5 shadow-sm hover:border-outline transition-all flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-semibold text-tertiary">Total Parking Capacity</span>
              <div className="font-numeric-metric text-2xl sm:text-3xl font-bold text-on-surface mt-1">
                {stats?.totalBays || 320} Bays
              </div>
            </div>
            <div className="w-10 h-10 rounded-lg bg-surface-container-low flex items-center justify-center text-tertiary">
              <Layers className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-center gap-1.5 mt-4 pt-3 border-t border-surface-container text-xs text-secondary">
            <span className="w-2 h-2 rounded-full bg-primary-container"></span>
            <span>Across {stats?.activeZonesCount || 4} active zones • <strong>98% operational</strong></span>
          </div>
        </div>

        {/* Metric 2: Live Occupied */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-5 shadow-sm hover:border-outline transition-all flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-semibold text-tertiary">Live Occupied Bays</span>
              <div className="font-numeric-metric text-2xl sm:text-3xl font-bold text-on-surface mt-1">
                {stats?.occupiedBays || 214}
              </div>
            </div>
            <div className="w-10 h-10 rounded-lg bg-primary-fixed/30 flex items-center justify-center text-primary">
              <Car className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-center gap-1.5 mt-4 pt-3 border-t border-surface-container text-xs">
            <span className="text-primary font-bold">{stats?.occupancyRate || 66.8}% Occupancy</span>
            <span className="text-tertiary">•</span>
            <span className="text-primary flex items-center gap-0.5 font-semibold">
              <TrendingUp className="w-3.5 h-3.5" /> +12% vs last hr
            </span>
          </div>
        </div>

        {/* Metric 3: Available Bays */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-5 shadow-sm hover:border-outline transition-all flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-semibold text-tertiary">Available Bays</span>
              <div className="font-numeric-metric text-2xl sm:text-3xl font-bold text-primary mt-1">
                {stats?.availableBays || 82}
              </div>
            </div>
            <div className="w-10 h-10 rounded-lg bg-secondary-container/40 flex items-center justify-center text-secondary">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-center gap-1.5 mt-4 pt-3 border-t border-surface-container text-xs text-secondary">
            <Zap className="w-3.5 h-3.5 text-primary" />
            <span>Instant walk-in & reservation ready</span>
          </div>
        </div>

        {/* Metric 4: Active Reservations */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-5 shadow-sm hover:border-outline transition-all flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-semibold text-tertiary">Active Reservations</span>
              <div className="font-numeric-metric text-2xl sm:text-3xl font-bold text-secondary mt-1">
                {stats?.activeReservations || 24}
              </div>
            </div>
            <div className="w-10 h-10 rounded-lg bg-tertiary-fixed/30 flex items-center justify-center text-on-tertiary-fixed-variant">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-center gap-1.5 mt-4 pt-3 border-t border-surface-container text-xs text-secondary">
            <span className="w-2 h-2 rounded-full bg-secondary"></span>
            <span>Scheduled arrivals in next 60 mins</span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* ANALYTICS ROW (Donut Chart & Hourly Demand Velocity)                      */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Donut Chart Card (5 cols) */}
        <div className="lg:col-span-5 bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between pb-4 border-b border-surface-container">
            <div>
              <h2 className="font-headline-sm text-sm sm:text-base font-bold text-on-surface">
                Live Capacity Breakdown
              </h2>
              <span className="text-xs text-secondary">Instant bay assignment distribution</span>
            </div>
            <PieChart className="w-5 h-5 text-secondary" />
          </div>

          <OccupancyDonut
            occupied={stats?.occupiedBays || 214}
            reserved={stats?.activeReservations || 24}
            available={stats?.availableBays || 82}
          />

          <div className="bg-surface-container-low p-3 rounded-lg flex items-center justify-between text-xs text-secondary">
            <span>Utilization Threshold: <strong className="text-on-surface">Target 75%</strong></span>
            <span className="text-primary font-bold">Normal Variance</span>
          </div>
        </div>

        {/* Hourly Occupancy & Velocity Curve Card (7 cols) */}
        <div className="lg:col-span-7 bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-surface-container gap-2">
            <div>
              <h2 className="font-headline-sm text-sm sm:text-base font-bold text-on-surface">
                Hourly Occupancy & Demand Velocity Curve
              </h2>
              <span className="text-xs text-secondary">Comparative telemetry against 30-day baseline</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-surface-container-low border border-outline-variant rounded-lg text-xs font-semibold text-tertiary">
              <span className="w-2 h-2 rounded-full bg-primary"></span>
              <span>Projected Peak: 11:30 AM (92%)</span>
            </div>
          </div>

          {/* Bar Visualizer */}
          <HourlyBarChart data={hourlyData} />

          <div className="flex items-center justify-between text-xs text-secondary pt-2 border-t border-surface-container">
            <span>Peak Window: <strong>11:30 AM - 01:00 PM</strong> (Projected 92% capacity)</span>
            <span className="text-primary font-bold flex items-center gap-1">
              <Activity className="w-3.5 h-3.5" /> AI Dynamic Pricing Active
            </span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* LIVE PARKING ZONE STATUS GRID                                             */}
      {/* ========================================================================= */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-headline-lg text-lg sm:text-xl font-bold text-on-surface">
              Live Parking Zone Status
            </h2>
            <span className="text-xs text-secondary">Real-time occupancy across physical sections</span>
          </div>
          <Link
            to="/admin/zones"
            className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
          >
            <span>Configure Zone Thresholds</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {zones.map((zone) => (
            <div
              key={zone.id}
              className="bg-surface-container-lowest border border-outline-variant rounded-xl p-5 shadow-sm hover:border-primary transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-tertiary">
                      {zone.level}
                    </span>
                    <h3 className="font-headline-sm text-sm font-bold text-on-surface">
                      {zone.name} ({zone.label})
                    </h3>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-primary-fixed/40 text-on-primary-fixed-variant">
                    {zone.occupancyPct >= 80 ? 'Near Cap' : zone.occupancyPct < 55 ? 'Optimal' : 'Normal'}
                  </span>
                </div>

                <div className="mt-4 flex items-baseline justify-between">
                  <div>
                    <span className="font-numeric-metric text-xl font-bold text-on-surface">
                      {zone.available}
                    </span>
                    <span className="text-xs text-secondary ml-1">/ {zone.total} Available</span>
                  </div>
                  <span className="text-xs font-bold text-primary">{zone.occupancyPct}% Occupied</span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-surface-container h-2 rounded-full overflow-hidden mt-2">
                  <div
                    className="bg-primary h-full rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, zone.occupancyPct)}%` }}
                  />
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-surface-container flex items-center justify-between text-xs">
                <span className="text-secondary">{zone.sensorsOnline} Online</span>
                <Link
                  to={`/parking/${zone.id}`}
                  className="font-bold text-primary hover:underline"
                >
                  Manage Slots
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MAIN DATA SECTION: RESERVATION ROSTER & LIVE ACTIVITY FEED               */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Reservation Roster Table Card (8 cols) */}
        <div className="xl:col-span-8 bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-surface-container">
              <div>
                <h2 className="font-headline-sm text-base font-bold text-on-surface">
                  Live Reservation Roster
                </h2>
                <span className="text-xs text-secondary">Real-time vehicle check-in log and pending arrivals</span>
              </div>

              {/* Filter Pills & Search */}
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-secondary absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Search plate, bay or ID..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-8 pl-8 pr-3 text-xs bg-background border border-outline-variant rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none w-48 sm:w-56"
                  />
                </div>

                <div className="flex items-center bg-surface-container-low p-1 rounded-lg border border-outline-variant/40 text-xs font-semibold">
                  <button
                    onClick={() => setRosterFilter('all')}
                    className={`px-2.5 py-1 rounded transition-colors ${
                      rosterFilter === 'all'
                        ? 'bg-surface-container-lowest text-on-surface shadow-xs font-bold'
                        : 'text-secondary hover:text-on-surface'
                    }`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setRosterFilter('active')}
                    className={`px-2.5 py-1 rounded transition-colors ${
                      rosterFilter === 'active'
                        ? 'bg-surface-container-lowest text-on-surface shadow-xs font-bold'
                        : 'text-secondary hover:text-on-surface'
                    }`}
                  >
                    Active
                  </button>
                  <button
                    onClick={() => setRosterFilter('scheduled')}
                    className={`px-2.5 py-1 rounded transition-colors ${
                      rosterFilter === 'scheduled'
                        ? 'bg-surface-container-lowest text-on-surface shadow-xs font-bold'
                        : 'text-secondary hover:text-on-surface'
                    }`}
                  >
                    Scheduled
                  </button>
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto mt-4">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-surface-container text-secondary font-semibold">
                    <th className="py-2.5 px-3">Booking ID</th>
                    <th className="py-2.5 px-3">Motorist Name</th>
                    <th className="py-2.5 px-3">Slot / Zone</th>
                    <th className="py-2.5 px-3">Scheduled Time</th>
                    <th className="py-2.5 px-3">Vehicle Details</th>
                    <th className="py-2.5 px-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-container">
                  {filteredBookings.map((b) => (
                    <tr key={b.id} className="hover:bg-surface-container-low/50 transition-colors">
                      <td className="py-3 px-3 font-mono font-bold text-on-surface">
                        {b.bookingRef}
                      </td>
                      <td className="py-3 px-3 font-semibold text-on-surface">
                        {b.userName}
                      </td>
                      <td className="py-3 px-3">
                        <span className="inline-flex items-center gap-1 font-bold text-primary bg-primary-fixed/20 px-2 py-0.5 rounded text-[11px]">
                          {b.slotCode}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-secondary font-mono">
                        {b.startTime} - {b.endTime}
                      </td>
                      <td className="py-3 px-3 text-on-surface">
                        {b.vehicle?.make} {b.vehicle?.model}
                        {b.vehicle?.type === 'EV' && (
                          <span className="text-secondary ml-1 font-mono text-[10px]">(EV)</span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            b.status === 'active'
                              ? 'bg-primary-fixed/50 text-on-primary-fixed'
                              : b.status === 'upcoming'
                              ? 'bg-secondary-container text-on-secondary-container'
                              : 'bg-surface-container text-secondary'
                          }`}
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                          {b.status === 'active'
                            ? 'Checked-In'
                            : b.status === 'upcoming'
                            ? 'Incoming'
                            : b.status.toUpperCase()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 mt-4 border-t border-surface-container text-xs text-secondary">
            <span>Showing <strong>{filteredBookings.length}</strong> of <strong>{recentBookings.length}</strong> recent reservations</span>
            <Link
              to="/admin/reservations"
              className="font-bold text-primary hover:underline flex items-center gap-1"
            >
              <span>Open Complete Roster</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Live Facility Activity Feed (4 cols) */}
        <div className="xl:col-span-4 bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-surface-container">
              <div>
                <h2 className="font-headline-sm text-base font-bold text-on-surface">
                  Facility Event Feed
                </h2>
                <span className="text-xs text-secondary">Automated gate & sensor telemetry</span>
              </div>
              <Activity className="w-5 h-5 text-primary" />
            </div>

            <div className="flex flex-col gap-4 mt-5 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-surface-container text-xs">
              <div className="flex items-start gap-3 relative">
                <div className="w-6 h-6 rounded-full bg-primary-fixed flex items-center justify-center text-primary z-10 ring-4 ring-surface-container-lowest shrink-0">
                  <Radio className="w-3.5 h-3.5" />
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-on-surface">Gate 2 Entry Detection</span>
                    <span className="text-secondary font-mono text-[10px]">09:41 AM</span>
                  </div>
                  <span className="text-secondary mt-0.5">
                    Bay A-14 occupied • RFID Tag verified for #PW-84920
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3 relative">
                <div className="w-6 h-6 rounded-full bg-secondary-container flex items-center justify-center text-secondary z-10 ring-4 ring-surface-container-lowest shrink-0">
                  <Receipt className="w-3.5 h-3.5" />
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-on-surface">Online Booking Confirmed</span>
                    <span className="text-secondary font-mono text-[10px]">09:38 AM</span>
                  </div>
                  <span className="text-secondary mt-0.5">
                    New reservation created for Zone B by app user
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3 relative">
                <div className="w-6 h-6 rounded-full bg-surface-container-high flex items-center justify-center text-secondary z-10 ring-4 ring-surface-container-lowest shrink-0">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-on-surface">Zone B Sweep Complete</span>
                    <span className="text-secondary font-mono text-[10px]">09:30 AM</span>
                  </div>
                  <span className="text-secondary mt-0.5">
                    Automated scrub bot returned to dock bay
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3 relative">
                <div className="w-6 h-6 rounded-full bg-primary-fixed flex items-center justify-center text-primary z-10 ring-4 ring-surface-container-lowest shrink-0">
                  <Zap className="w-3.5 h-3.5 text-primary" />
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-on-surface">EV Fast Charger Engaged</span>
                    <span className="text-secondary font-mono text-[10px]">09:12 AM</span>
                  </div>
                  <span className="text-secondary mt-0.5">
                    Bay D-03 delivering 150 kW DC charging
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-surface-container">
            <button
              onClick={() => alert('Full journal: 4,120 sensor event logs archived for current shift.')}
              className="w-full py-2 bg-surface-container-low hover:bg-surface-container rounded-lg text-xs font-bold text-on-surface flex items-center justify-center gap-1.5 transition-colors"
            >
              <History className="w-3.5 h-3.5 text-secondary" />
              <span>Open Full Telemetry Journal</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
