import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useParking } from '../../context/ParkingContext.jsx';
import { SearchForm } from '../../components/forms/SearchForm.jsx';
import {
  Search,
  PlayCircle,
  Radio,
  Sliders,
  Calendar,
  Clock,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Filter,
  MapPin,
  Car,
  Zap,
  Accessibility,
} from 'lucide-react';

export function LandingPage() {
  const navigate = useNavigate();
  const { zones } = useParking();

  // Compute live available count
  const totalAvailable = zones.reduce((sum, z) => sum + (z.availableCount || 0), 0) || 142;

  // Mini preview slots demo state
  const [selectedPreviewSlot, setSelectedPreviewSlot] = useState('A-103');

  const previewSlots = [
    { code: 'A-101', type: 'ev', status: 'available', label: 'Available' },
    { code: 'A-102', type: 'standard', status: 'occupied', label: 'Occupied' },
    { code: 'A-103', type: 'standard', status: 'available', label: 'Selected' },
    { code: 'A-104', type: 'standard', status: 'reserved', label: 'Reserved' },
    { code: 'A-105', type: 'accessible', status: 'available', label: 'Available' },
    { code: 'A-106', type: 'standard', status: 'occupied', label: 'Occupied' },
    { code: 'A-107', type: 'standard', status: 'available', label: 'Available' },
    { code: 'A-108', type: 'standard', status: 'occupied', label: 'Occupied' },
  ];

  const handleSearchSubmit = (params) => {
    navigate(`/parking/${params.zoneId || 'zone-a'}`);
  };

  return (
    <div className="flex-grow">
      {/* ========================================================================= */}
      {/* HERO SECTION WITH LIVE SEARCH CONSOLE                                     */}
      {/* ========================================================================= */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-28 overflow-hidden bg-gradient-to-b from-surface to-surface-container-low border-b border-outline-variant">
        {/* Subtle Architectural Background Grid & Ambient Glow */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(#006948 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />
        <div className="absolute -top-40 right-1/4 w-96 h-96 bg-primary-fixed-dim/20 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          {/* Live Badge */}
          <div className="flex justify-center mb-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface-container-lowest border border-outline-variant shadow-sm text-xs font-semibold text-primary">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              <span className="text-on-surface">{totalAvailable} slots currently available</span>
              <span className="text-tertiary">across 4 facility zones</span>
            </div>
          </div>

          {/* Main Headlines */}
          <div className="text-center max-w-3xl mx-auto mb-10">
            <h1 className="text-3xl sm:text-4xl md:text-display-lg font-display-lg text-on-surface font-bold tracking-tight mb-4">
              Your parking spot. <br className="hidden sm:inline" />
              <span className="text-primary">Reserved before you arrive.</span>
            </h1>
            <p className="text-sm sm:text-base md:text-body-lg text-secondary max-w-2xl mx-auto">
              Find available parking, choose your preferred time window, and secure your spot in seconds. Skip the city uncertainty and drive straight to your reserved bay.
            </p>

            {/* Hero CTAs */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <a
                href="#search-console"
                className="px-6 py-3 rounded-lg bg-primary hover:bg-primary-hover text-on-primary text-sm font-bold shadow-md active:scale-95 transition-all flex items-center gap-2"
              >
                <Search className="w-4 h-4" />
                Find a Parking Slot
              </a>
              <button
                type="button"
                onClick={() => {
                  const el = document.getElementById('how-it-works');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-5 py-3 rounded-lg bg-surface-container-lowest hover:bg-surface-container border border-outline-variant text-on-surface text-sm font-semibold shadow-sm active:scale-95 transition-all flex items-center gap-2"
              >
                <PlayCircle className="w-4 h-4 text-primary" />
                Explore How It Works
              </button>
            </div>
          </div>

          {/* FLOATING CENTRAL SEARCH CONSOLE */}
          <div id="search-console" className="max-w-5xl mx-auto">
            <SearchForm onSearchSubmit={handleSearchSubmit} />
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* INTERACTIVE MINI-BLUEPRINT TELEMETRY PREVIEW                              */}
      {/* ========================================================================= */}
      <section className="py-16 bg-surface-container-lowest border-b border-outline-variant">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <span className="text-xs font-bold tracking-wider text-primary uppercase">
                Live Bay Blueprint
              </span>
              <h2 className="text-xl sm:text-2xl font-bold font-headline-lg text-on-surface mt-1">
                Real-Time Facility Visualizer
              </h2>
              <p className="text-xs sm:text-sm text-secondary mt-1">
                Direct sensor link with Zone A-Floor 01. Select a spot to preview instant allocation.
              </p>
            </div>

            {/* Bay Status Legend */}
            <div className="flex items-center gap-4 bg-surface-container-low p-2 rounded-lg border border-outline-variant text-xs font-medium">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-primary"></span>
                <span className="text-secondary">Available (14)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-secondary"></span>
                <span className="text-secondary">Reserved (8)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-error"></span>
                <span className="text-secondary">Occupied (26)</span>
              </div>
            </div>
          </div>

          {/* Visual Slot Grid Frame */}
          <div className="bg-surface-container-low border border-outline-variant rounded-xl p-4 sm:p-6 relative overflow-hidden">
            <div className="text-xs text-tertiary mb-3 flex items-center justify-between font-mono">
              <span>FLOOR 01 / SECTION NORTH / LANE 02</span>
              <span className="text-primary font-medium flex items-center gap-1">
                <Radio className="w-3.5 h-3.5 animate-pulse" /> Telemetry Sync: 1 sec ago
              </span>
            </div>

            {/* Bay Slots Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-3">
              {previewSlots.map((slot) => {
                const isSelected = selectedPreviewSlot === slot.code;
                const isAvailable = slot.status === 'available';

                if (isSelected) {
                  return (
                    <div
                      key={slot.code}
                      onClick={() => setSelectedPreviewSlot(slot.code)}
                      className="aspect-[1/1.5] rounded-lg border-2 border-primary bg-primary-fixed/40 p-2.5 flex flex-col justify-between cursor-pointer shadow-md ring-2 ring-primary/20 relative"
                    >
                      <div className="flex justify-between items-start">
                        <span className="font-slot-id text-xs font-bold text-primary">{slot.code}</span>
                        <CheckCircle2 className="w-4 h-4 text-primary" />
                      </div>
                      <div className="text-center my-auto">
                        <Car className="w-5 h-5 text-primary mx-auto" />
                      </div>
                      <span className="text-[10px] font-bold text-on-primary-fixed-variant bg-primary-fixed px-1 py-0.5 rounded text-center">
                        Selected
                      </span>
                    </div>
                  );
                }

                if (isAvailable) {
                  return (
                    <div
                      key={slot.code}
                      onClick={() => setSelectedPreviewSlot(slot.code)}
                      className="aspect-[1/1.5] rounded-lg border-2 border-primary bg-primary-fixed/20 p-2.5 flex flex-col justify-between cursor-pointer hover:-translate-y-0.5 transition-transform shadow-xs relative group"
                    >
                      <div className="flex justify-between items-start">
                        <span className="font-slot-id text-xs font-bold text-primary">{slot.code}</span>
                        {slot.type === 'ev' && <Zap className="w-3.5 h-3.5 text-primary" />}
                        {slot.type === 'accessible' && <Accessibility className="w-3.5 h-3.5 text-primary" />}
                      </div>
                      <div className="text-center my-auto opacity-70 group-hover:opacity-100 transition-opacity">
                        <Car className="w-5 h-5 text-primary mx-auto" />
                      </div>
                      <span className="text-[10px] font-semibold text-primary uppercase text-center">
                        Available
                      </span>
                    </div>
                  );
                }

                if (slot.status === 'occupied') {
                  return (
                    <div
                      key={slot.code}
                      className="aspect-[1/1.5] rounded-lg border border-outline-variant bg-surface-container-highest p-2.5 flex flex-col justify-between opacity-60 cursor-not-allowed"
                    >
                      <div className="flex justify-between items-start">
                        <span className="font-slot-id text-xs font-bold text-tertiary">{slot.code}</span>
                      </div>
                      <div className="text-center my-auto text-tertiary">
                        <Car className="w-5 h-5 mx-auto" />
                      </div>
                      <span className="text-[10px] text-tertiary text-center">Occupied</span>
                    </div>
                  );
                }

                return (
                  <div
                    key={slot.code}
                    className="aspect-[1/1.5] rounded-lg border border-outline-variant bg-surface-container-high p-2.5 flex flex-col justify-between opacity-75 cursor-not-allowed"
                  >
                    <div className="flex justify-between items-start">
                      <span className="font-slot-id text-xs font-bold text-secondary">{slot.code}</span>
                      <Clock className="w-3.5 h-3.5 text-secondary" />
                    </div>
                    <div className="text-center my-auto text-secondary">
                      <Car className="w-5 h-5 mx-auto" />
                    </div>
                    <span className="text-[10px] text-secondary text-center">Reserved</span>
                  </div>
                );
              })}
            </div>

            <div className="mt-4 pt-3 border-t border-outline-variant/60 flex items-center justify-between text-xs">
              <span className="text-secondary">
                Spot <strong>{selectedPreviewSlot}</strong> selected in interactive preview.
              </span>
              <Link
                to="/parking/zone-a"
                className="font-bold text-primary hover:underline flex items-center gap-1"
              >
                <span>Launch Full Floor Blueprint</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* VISUAL VALUE SHOWCASE (3 ELEGANT FEATURE CARDS)                           */}
      {/* ========================================================================= */}
      <section className="py-20 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold tracking-wider text-primary uppercase">
              Engineered Precision
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-headline-xl text-on-surface mt-2">
              Architected for effortless parking
            </h2>
            <p className="text-sm sm:text-base text-secondary mt-3">
              High-precision bay telemetry fused with direct digital gate passes eliminates city traffic friction and entrance congestion.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
              <div className="w-12 h-12 rounded-lg bg-primary-fixed/30 text-primary flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
                <Radio className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold font-headline-md text-on-surface mb-3">
                Real-Time Availability
              </h3>
              <p className="text-sm text-secondary leading-relaxed">
                Live bay telemetry with second-by-second status clarity (Available, Reserved, Occupied) directly simulated for downtown metropolitan centers.
              </p>
              <div className="mt-6 pt-4 border-t border-surface-container-high flex items-center text-xs font-bold text-primary">
                <span>Explore Telemetry Engine</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
              <div className="w-12 h-12 rounded-lg bg-secondary-container text-on-secondary-container flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold font-headline-md text-on-surface mb-3">
                Advance Time-Window Reservation
              </h3>
              <p className="text-sm text-secondary leading-relaxed">
                Lock in single hours, full working days, or multi-week parking passes with our zero-double-booking guarantee policy.
              </p>
              <div className="mt-6 pt-4 border-t border-surface-container-high flex items-center text-xs font-bold text-primary">
                <span>View Flexible Passes</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
              <div className="w-12 h-12 rounded-lg bg-primary-fixed/30 text-primary flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold font-headline-md text-on-surface mb-3">
                Instant Contactless Confirmation
              </h3>
              <p className="text-sm text-secondary leading-relaxed">
                Receive a seamless digital QR boarding pass on your device alongside turn-by-turn walking route maps directly to your assigned parking bay.
              </p>
              <div className="mt-6 pt-4 border-t border-surface-container-high flex items-center text-xs font-bold text-primary">
                <span>Contactless Protocols</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* INTERACTIVE 'HOW IT WORKS' 3-STEP HORIZONTAL WORKFLOW                     */}
      {/* ========================================================================= */}
      <section id="how-it-works" className="py-20 bg-surface-container-lowest border-y border-outline-variant">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold tracking-wider text-primary uppercase">
              Frictionless Workflow
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-headline-xl text-on-surface mt-2">
              Three simple steps to guaranteed parking
            </h2>
            <p className="text-sm sm:text-base text-secondary mt-3">
              From search to spot arrival in less than 60 seconds.
            </p>
          </div>

          <div className="relative">
            {/* Connected Progress Line (Desktop) */}
            <div className="hidden md:block absolute top-10 left-[16%] right-[16%] h-0.5 bg-outline-variant -z-0"></div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10">
              {/* Step 01 */}
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-full bg-surface-container-lowest border-2 border-primary flex items-center justify-center shadow-sm mb-6 relative">
                  <Filter className="w-7 h-7 text-primary" />
                  <span className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-primary text-on-primary text-xs font-bold flex items-center justify-center">
                    1
                  </span>
                </div>
                <h4 className="font-headline-sm text-base font-bold text-on-surface mb-2">
                  Discover & Filter Facility
                </h4>
                <p className="text-xs sm:text-sm text-secondary max-w-xs">
                  Choose your destination zone, target floor level, arrival window, and vehicle requirements (EV or Standard).
                </p>
              </div>

              {/* Step 02 */}
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-full bg-surface-container-lowest border-2 border-primary flex items-center justify-center shadow-sm mb-6 relative">
                  <MapPin className="w-7 h-7 text-primary" />
                  <span className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-primary text-on-primary text-xs font-bold flex items-center justify-center">
                    2
                  </span>
                </div>
                <h4 className="font-headline-sm text-base font-bold text-on-surface mb-2">
                  Interactive Bay Selection
                </h4>
                <p className="text-xs sm:text-sm text-secondary max-w-xs">
                  Pick your specific bay on the real floor-plan blueprint. Enjoy complete spatial clarity before you even leave home.
                </p>
              </div>

              {/* Step 03 */}
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-full bg-surface-container-lowest border-2 border-primary flex items-center justify-center shadow-sm mb-6 relative">
                  <CheckCircle2 className="w-7 h-7 text-primary" />
                  <span className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-primary text-on-primary text-xs font-bold flex items-center justify-center">
                    3
                  </span>
                </div>
                <h4 className="font-headline-sm text-base font-bold text-on-surface mb-2">
                  Confirmed & Direct Access
                </h4>
                <p className="text-xs sm:text-sm text-secondary max-w-xs">
                  Receive an instant digital boarding pass on your phone. Entrance gate opens smoothly via optical QR or license plate.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* FACILITY TELEMETRY QUICK STATS                                            */}
      {/* ========================================================================= */}
      <section className="py-14 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 divide-y md:divide-y-0 md:divide-x divide-outline-variant">
            <div className="text-center pt-4 md:pt-0">
              <span className="font-numeric-metric text-3xl font-bold text-primary block mb-1">
                99.4%
              </span>
              <span className="font-semibold text-on-surface block">On-Time Bay Guarantee</span>
              <span className="text-xs text-secondary mt-1 block">
                Zero unauthorized parking conflicts recorded.
              </span>
            </div>
            <div className="text-center pt-4 md:pt-0">
              <span className="font-numeric-metric text-3xl font-bold text-primary block mb-1">
                18,500+
              </span>
              <span className="font-semibold text-on-surface block">Daily Successful Parkings</span>
              <span className="text-xs text-secondary mt-1 block">
                Managed across dense metropolitan zones.
              </span>
            </div>
            <div className="text-center pt-4 md:pt-0">
              <span className="font-numeric-metric text-3xl font-bold text-primary block mb-1">
                12
              </span>
              <span className="font-semibold text-on-surface block">Corporate Facilities Connected</span>
              <span className="text-xs text-secondary mt-1 block">
                Fully synchronized real-time IoT infrastructure.
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* CONTEXTUAL BOTTOM CALL TO ACTION                                          */}
      {/* ========================================================================= */}
      <section className="py-16 bg-gradient-to-r from-primary to-primary-container text-on-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-headline-xl font-bold">
              Ready to secure your spot today?
            </h2>
            <p className="text-sm sm:text-base text-primary-fixed mt-1 opacity-90">
              Join thousands of motorists saving up to 20 minutes on every metropolitan trip.
            </p>
          </div>
          <div className="flex items-center gap-4 flex-wrap">
            <Link
              to="/find-parking"
              className="px-7 py-3 rounded-lg bg-surface-container-lowest text-primary text-sm font-bold shadow-md hover:bg-surface transition-all active:scale-95"
            >
              Reserve Slot Now
            </Link>
            <button
              onClick={() => alert('Corporate Fleet: Contact enterprise@parkwise.demo for dedicated fleet pricing.')}
              className="px-6 py-3 rounded-lg border border-primary-fixed text-on-primary text-sm font-medium hover:bg-primary-container transition-all"
            >
              Commercial Fleet Access
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

