import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useParking } from '../../context/ParkingContext.jsx';
import { useBooking } from '../../context/BookingContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { parkingService } from '../../services/parkingService.js';
import { ParkingSlot } from '../../components/parking/ParkingSlot.jsx';
import { DrivewayLane } from '../../components/parking/DrivewayLane.jsx';
import { SlotLegend } from '../../components/parking/SlotLegend.jsx';
import { ReservationSummary } from '../../components/parking/ReservationSummary.jsx';
import { Modal } from '../../components/common/Modal.jsx';
import { Button } from '../../components/common/Button.jsx';
import { formatDate, formatTime } from '../../utils/formatters.js';
import {
  MapPin,
  Layers,
  Clock,
  SlidersHorizontal,
  ZoomIn,
  ZoomOut,
  Maximize2,
  RotateCw,
  Building,
  Ruler,
  Car,
  Zap,
} from 'lucide-react';

export function SlotSelector() {
  const { zoneId: routeZoneId } = useParams();
  const navigate = useNavigate();
  const { zones } = useParking();
  const { searchParams, updateSearchParams, selectedSlot, setSelectedSlot } = useBooking();
  const { success, error } = useToast();

  const currentZoneId = routeZoneId || searchParams.zoneId || 'zone-a';
  const currentZone = zones.find((z) => z.id === currentZoneId) || zones[0] || {
    id: 'zone-a',
    name: 'Zone A',
    label: 'Ground Floor',
    level: 'Level G',
    hourlyRate: 4.50,
  };

  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [activeFloor, setActiveFloor] = useState('G');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Load slots for the selected zone and time window
  useEffect(() => {
    async function loadSlots() {
      try {
        setLoading(true);
        const data = await parkingService.getSlots(currentZoneId, {
          date: searchParams.date,
          startTime: searchParams.startTime,
          endTime: searchParams.endTime,
        });
        setSlots(data);

        // If no slot is selected, check if A-14 exists and is available as a showcase default
        if (!selectedSlot) {
          const a14 = data.find((s) => s.code === 'A-14' && s.effectiveStatus === 'available');
          if (a14) {
            setSelectedSlot(a14);
          }
        }
      } catch (err) {
        error(err.message || 'Failed to load bay slots');
      } finally {
        setLoading(false);
      }
    }
    loadSlots();
  }, [currentZoneId, searchParams.date, searchParams.startTime, searchParams.endTime]);

  const handleSlotSelect = (slot) => {
    setSelectedSlot(slot);
    success(`Slot ${slot.code} selected. Review your booking order on the right.`);
  };

  const handleZoneSwitch = (zoneId) => {
    updateSearchParams({ zoneId });
    navigate(`/parking/${zoneId}`);
  };

  const handleProceedToReview = () => {
    if (!selectedSlot) {
      error('Please select an available parking bay before proceeding.');
      return;
    }
    navigate('/booking/review');
  };

  // Divide slots into logical rows for Zone A
  const row1 = slots.slice(0, 10);
  const row2 = slots.slice(10, 18); // EV bank upper
  const row3 = slots.slice(18, 26); // EV bank lower
  const row4 = slots.slice(26, 36); // Accessible
  const remainingSlots = slots.slice(36);

  return (
    <div className="flex-1 flex flex-col bg-background">
      {/* ========================================================================= */}
      {/* SEARCH SUMMARY BAR (Sticky Subheader)                                      */}
      {/* ========================================================================= */}
      <section className="sticky top-[57px] z-30 bg-surface-container-lowest border-b border-outline-variant shadow-sm py-3 px-4 sm:px-6">
        <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full md:w-auto items-center">
            {/* Facility Info */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-surface-container flex items-center justify-center text-primary shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[11px] font-semibold text-secondary uppercase tracking-wider">
                  Facility
                </div>
                <div className="text-xs sm:text-sm font-semibold text-on-surface truncate">
                  Metropolitan Center (Hub #04)
                </div>
              </div>
            </div>

            {/* Zone Info */}
            <div className="flex items-center gap-3 border-t sm:border-t-0 sm:border-l border-outline-variant sm:pl-4 pt-2 sm:pt-0">
              <div className="w-9 h-9 rounded-lg bg-surface-container flex items-center justify-center text-secondary shrink-0">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[11px] font-semibold text-secondary uppercase tracking-wider">
                  Zone & Level
                </div>
                <div className="text-xs sm:text-sm font-semibold text-on-surface">
                  {currentZone.name} — {currentZone.level} ({currentZone.label})
                </div>
              </div>
            </div>

            {/* Schedule Info */}
            <div className="flex items-center gap-3 border-t sm:border-t-0 sm:border-l border-outline-variant sm:pl-4 pt-2 sm:pt-0">
              <div className="w-9 h-9 rounded-lg bg-surface-container flex items-center justify-center text-primary shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[11px] font-semibold text-secondary uppercase tracking-wider">
                  Reservation Window
                </div>
                <div className="text-xs sm:text-sm font-semibold text-on-surface">
                  {formatDate(searchParams.date)} • {formatTime(searchParams.startTime)} – {formatTime(searchParams.endTime)}
                </div>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-3.5 py-2 border border-outline-variant bg-surface hover:bg-surface-container rounded-lg text-on-surface text-xs font-semibold transition-all active:scale-95 shadow-sm"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-primary" />
            <span>Edit Time / Filter Amenities</span>
          </button>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* MAIN WORKSPACE: 2-COLUMN SPLIT (70% Blueprint | 30% Reservation Summary)   */}
      {/* ========================================================================= */}
      <div className="flex-1 max-w-[1600px] w-full mx-auto px-4 md:px-6 py-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: INTERACTIVE PARKING BAY GRID & BLUEPRINT (8 Cols) */}
        <div className="lg:col-span-8 flex flex-col gap-5">
          {/* Zone Quick Selector Tabs */}
          <div className="flex items-center gap-3 overflow-x-auto pb-1 scrollbar-hide">
            {zones.map((z) => {
              const isActive = z.id === currentZoneId;
              return (
                <button
                  key={z.id}
                  onClick={() => handleZoneSwitch(z.id)}
                  className={`flex items-center gap-2.5 px-4 py-2.5 rounded-lg border text-xs font-semibold shadow-xs transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-surface-container-lowest border-2 border-primary text-primary shadow-sm'
                      : 'bg-surface-container-lowest border-outline-variant text-secondary hover:text-on-surface hover:border-outline'
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isActive ? 'bg-primary animate-pulse' : 'bg-outline-variant'
                    }`}
                  />
                  <span>
                    {z.name} - {z.label}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant text-[11px]">
                    {z.availableCount !== undefined ? z.availableCount : z.capacity}/{z.capacity} Avail
                  </span>
                </button>
              );
            })}
          </div>

          {/* Canvas / Blueprint Container Card */}
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm overflow-hidden flex flex-col">
            {/* Floor Blueprint Controls Header */}
            <div className="px-5 py-3 border-b border-outline-variant/70 flex flex-wrap items-center justify-between gap-3 bg-surface-container-low/60">
              {/* Floor Level Switcher */}
              <div className="flex items-center gap-1 bg-surface-container p-1 rounded-lg text-xs">
                <span className="text-secondary px-2 font-medium">Floor:</span>
                {['P1', 'G', 'L1', 'L2'].map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => setActiveFloor(lvl)}
                    className={`px-2.5 py-1 rounded font-bold transition-colors ${
                      activeFloor === lvl
                        ? 'bg-primary text-on-primary shadow-xs'
                        : 'text-secondary hover:text-on-surface hover:bg-surface-container-highest'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>

              {/* Zoom & Orientation Controls */}
              <div className="flex items-center gap-2">
                <div className="flex items-center border border-outline-variant rounded-lg bg-surface-container-lowest overflow-hidden text-xs">
                  <button
                    onClick={() => setZoomLevel((prev) => Math.max(75, prev - 10))}
                    className="p-1.5 hover:bg-surface-container text-secondary"
                    title="Zoom Out"
                  >
                    <ZoomOut className="w-4 h-4" />
                  </button>
                  <span className="px-2 font-mono text-secondary border-x border-outline-variant">
                    {zoomLevel}%
                  </span>
                  <button
                    onClick={() => setZoomLevel((prev) => Math.min(125, prev + 10))}
                    className="p-1.5 hover:bg-surface-container text-secondary"
                    title="Zoom In"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </button>
                </div>

                <button
                  onClick={() => setZoomLevel(100)}
                  className="p-1.5 border border-outline-variant rounded-lg bg-surface-container-lowest text-secondary hover:bg-surface-container"
                  title="Reset Zoom"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>

                <button
                  onClick={() => alert('Layout orientation locked to North architectural view.')}
                  className="p-1.5 border border-outline-variant rounded-lg bg-surface-container-lowest text-secondary hover:bg-surface-container"
                  title="Rotate View"
                >
                  <RotateCw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Architectural Blueprint Canvas Area */}
            <div
              className="p-4 sm:p-6 bg-surface-bright blueprint-grid overflow-x-auto relative"
              style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top left' }}
            >
              {/* Entrance & Elevator Indicators */}
              <div className="flex items-center justify-between mb-4 px-2 text-xs">
                <div className="flex items-center gap-2 px-3 py-1 rounded bg-secondary-container text-on-secondary-container font-medium border border-outline-variant">
                  <Building className="w-3.5 h-3.5 text-secondary" />
                  <span>North Elevator & Lobby Core ({currentZone.walkTime || '45s walk'})</span>
                </div>
                <div className="flex items-center gap-1.5 text-outline">
                  <Ruler className="w-3.5 h-3.5" />
                  <span>Clearance: {currentZone.clearanceHeight || '2.2m'} Garage Clearance Height</span>
                </div>
              </div>

              {/* Garage Schematic Container */}
              <div className="min-w-[700px] flex flex-col gap-3">
                {/* ROW 1: Standard Clearance Bays */}
                <div className="bg-surface-container-lowest/80 p-3 rounded-lg border border-outline-variant">
                  <div className="text-[10px] text-outline uppercase tracking-widest font-bold mb-2">
                    Bay Row 01 • Standard Clearance (A-01 to A-10)
                  </div>
                  <div className="grid grid-cols-10 gap-2">
                    {row1.map((slot) => (
                      <ParkingSlot
                        key={slot.id}
                        slot={slot}
                        isSelected={selectedSlot?.id === slot.id}
                        onSelect={handleSlotSelect}
                      />
                    ))}
                  </div>
                </div>

                {/* DRIVEWAY LANE 1: NORTH DRIVING LANE */}
                <DrivewayLane
                  name="North Driving Lane (One-Way)"
                  note="SPEED LIMIT 10 KM/H"
                />

                {/* ROW 2 & 3: DEDICATED EV FAST-CHARGING BANK */}
                <div className="bg-surface-container-lowest/80 p-3 rounded-lg border border-outline-variant flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-outline uppercase tracking-widest font-bold">
                      Bay Row 02 & 03 • Dedicated EV Fast-Charging Bank
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs text-primary font-semibold">
                      <Zap className="w-3.5 h-3.5" /> Level 2 & 150kW DC Fast Charge Ready
                    </span>
                  </div>

                  {/* Upper EV Row */}
                  <div className="grid grid-cols-8 gap-2">
                    {row2.map((slot) => (
                      <ParkingSlot
                        key={slot.id}
                        slot={slot}
                        isSelected={selectedSlot?.id === slot.id}
                        onSelect={handleSlotSelect}
                      />
                    ))}
                  </div>

                  {/* Lower EV Row */}
                  <div className="grid grid-cols-8 gap-2">
                    {row3.map((slot) => (
                      <ParkingSlot
                        key={slot.id}
                        slot={slot}
                        isSelected={selectedSlot?.id === slot.id}
                        onSelect={handleSlotSelect}
                      />
                    ))}
                  </div>
                </div>

                {/* DRIVEWAY LANE 2: SOUTH EXIT LANE */}
                <DrivewayLane
                  name="South Exit Lane"
                  note="WAY OUT TO METRO BLVD ➔"
                />

                {/* ROW 4: ACCESSIBLE BAYS */}
                <div className="bg-surface-container-lowest/80 p-3 rounded-lg border border-outline-variant">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] text-outline uppercase tracking-widest font-bold">
                      Bay Row 04 • Accessible Priority (Wide Clearance 3.5m)
                    </span>
                    <span className="text-xs text-secondary font-medium">Direct Ramp Access</span>
                  </div>
                  <div className="grid grid-cols-10 gap-2">
                    {row4.map((slot) => (
                      <ParkingSlot
                        key={slot.id}
                        slot={slot}
                        isSelected={selectedSlot?.id === slot.id}
                        onSelect={handleSlotSelect}
                      />
                    ))}
                  </div>
                </div>

                {/* REMAINING SLOTS (IF MORE THAN 36 SLOTS IN ZONE) */}
                {remainingSlots.length > 0 && (
                  <div className="bg-surface-container-lowest/80 p-3 rounded-lg border border-outline-variant">
                    <div className="text-[10px] text-outline uppercase tracking-widest font-bold mb-2">
                      Additional Bays (Rows 05 - 06)
                    </div>
                    <div className="grid grid-cols-10 gap-2">
                      {remainingSlots.map((slot) => (
                        <ParkingSlot
                          key={slot.id}
                          slot={slot}
                          isSelected={selectedSlot?.id === slot.id}
                          onSelect={handleSlotSelect}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* COMPREHENSIVE STATUS LEGEND */}
            <SlotLegend />
          </div>
        </div>

        {/* RIGHT COLUMN: STICKY RESERVATION SUMMARY DRAWER (4 Cols) */}
        <div className="lg:col-span-4 sticky top-[135px]">
          <ReservationSummary
            zone={currentZone}
            selectedSlot={selectedSlot}
            searchParams={searchParams}
            onProceed={handleProceedToReview}
          />
        </div>
      </div>

      {/* Edit Time / Parameters Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Adjust Reservation Window"
      >
        <div className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-secondary mb-1">Reservation Date</label>
            <input
              type="date"
              min={new Date().toISOString().split('T')[0]}
              value={searchParams.date}
              onChange={(e) => updateSearchParams({ date: e.target.value })}
              className="w-full p-2 bg-surface-container-lowest border border-outline-variant rounded-lg text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-secondary mb-1">Start Time</label>
              <input
                type="time"
                value={searchParams.startTime}
                onChange={(e) => updateSearchParams({ startTime: e.target.value })}
                className="w-full p-2 bg-surface-container-lowest border border-outline-variant rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block font-semibold text-secondary mb-1">End Time</label>
              <input
                type="time"
                value={searchParams.endTime}
                onChange={(e) => updateSearchParams({ endTime: e.target.value })}
                className="w-full p-2 bg-surface-container-lowest border border-outline-variant rounded-lg text-sm"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                setIsEditModalOpen(false);
                success('Time window updated. Re-evaluating slot availability.');
              }}
            >
              Apply Changes
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

