import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { adminService } from '../../services/adminService.js';
import { ConfirmDialog } from '../../components/common/ConfirmDialog.jsx';
import {
  SlidersHorizontal,
  Building,
  RotateCcw,
  ShieldAlert,
  Server,
  LogOut,
  Radio,
  CheckCircle2,
} from 'lucide-react';

export function AdminSettings() {
  const { user, logout } = useAuth();
  const { success, error } = useToast();
  const [resetModalOpen, setResetModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleResetData = async () => {
    try {
      setLoading(true);
      await adminService.resetDemoData();
      success('Demonstration dataset restored to factory defaults.');
      setResetModalOpen(false);
      // reload after slight delay
      setTimeout(() => {
        window.location.reload();
      }, 600);
    } catch (err) {
      error(err.message || 'Failed to reset demo data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="border-b border-outline-variant/60 pb-5">
        <h1 className="font-headline-xl text-2xl sm:text-3xl font-bold text-on-surface">
          Facility Control & System Configuration
        </h1>
        <p className="text-xs sm:text-sm text-secondary mt-1">
          Telemetry settings, operational parameters, and browser demonstration state management.
        </p>
      </div>

      {/* Facility Details */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-3 pb-4 border-b border-surface-container">
          <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-primary">
            <Building className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-on-surface">
              Facility Location: Metropolitan Center Hub #04
            </h2>
            <span className="text-xs text-secondary">
              Downtown Core Sector 4 • 100 Metro Plaza Way, CA
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-3 bg-surface rounded-lg border border-outline-variant/60">
            <span className="text-secondary block font-medium">IoT Hardware Node</span>
            <span className="font-bold text-on-surface font-mono mt-0.5 block">LoRaWAN-GW-04-A</span>
            <span className="text-primary text-[10px] font-semibold">14ms latency verified</span>
          </div>
          <div className="p-3 bg-surface rounded-lg border border-outline-variant/60">
            <span className="text-secondary block font-medium">Operational Availability</span>
            <span className="font-bold text-on-surface font-mono mt-0.5 block">99.98% SLA</span>
            <span className="text-primary text-[10px] font-semibold">Automatic failover armed</span>
          </div>
          <div className="p-3 bg-surface rounded-lg border border-outline-variant/60">
            <span className="text-secondary block font-medium">Active Dispatch Officer</span>
            <span className="font-bold text-on-surface mt-0.5 block">{user?.name || 'Alex Mercer'}</span>
            <span className="text-secondary text-[10px]">{user?.title || 'Operations Director'}</span>
          </div>
        </div>
      </div>

      {/* Demo Reset Card */}
      <div className="bg-surface-container-lowest border border-error/30 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-error-container text-on-error-container shrink-0">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-on-surface">
                Reset Demonstration App State
              </h3>
              <p className="text-xs text-secondary mt-1 max-w-xl">
                Restores the local browser storage back to the original seed data (4 zones, default demo slots, and sample reservations). Any custom bookings, added slots, or zone changes made in this browser session will be reset.
              </p>
            </div>
          </div>
          <button
            onClick={() => setResetModalOpen(true)}
            className="px-4 py-2 bg-error text-on-error text-xs font-bold rounded-lg hover:opacity-90 active:scale-95 transition-all shadow-xs shrink-0"
          >
            Reset Demo Data
          </button>
        </div>
      </div>

      {/* Admin Sign Out */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 shadow-sm flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-on-surface">Administrative Session</h3>
          <p className="text-xs text-secondary">Signed in as {user?.email}</p>
        </div>
        <button
          onClick={logout}
          className="inline-flex items-center gap-1.5 px-4 py-2 border border-outline-variant text-error hover:bg-red-50 text-xs font-bold rounded-lg transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>

      <ConfirmDialog
        isOpen={resetModalOpen}
        onClose={() => setResetModalOpen(false)}
        onConfirm={handleResetData}
        isDestructive={true}
        loading={loading}
        title="Reset All Demo Data?"
        message="Are you sure you want to reset the browser demo data? All newly created reservations and slot changes will be permanently replaced with default demo records."
        confirmText="Yes, Reset Data"
      />
    </div>
  );
}

