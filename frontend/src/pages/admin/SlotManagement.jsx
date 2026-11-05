import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService.js';
import { storageService } from '../../services/storageService.js';
import { useParking } from '../../context/ParkingContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { Modal } from '../../components/common/Modal.jsx';
import { Button } from '../../components/common/Button.jsx';
import { Input } from '../../components/common/Input.jsx';
import {
  ParkingSquare,
  Filter,
  Plus,
  Wrench,
  CheckCircle2,
  Clock,
  Ban,
  Zap,
  Accessibility,
} from 'lucide-react';

export function SlotManagement() {
  const { zones } = useParking();
  const { success, error } = useToast();

  const [selectedZone, setSelectedZone] = useState('zone-a');
  const [statusFilter, setStatusFilter] = useState('all');
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);

  // Add slot modal
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [newSlotCode, setNewSlotCode] = useState('');
  const [newSlotType, setNewSlotType] = useState('standard');

  const loadSlots = async () => {
    try {
      setLoading(true);
      const { slots: allSlots } = storageService.getStoredData();
      setSlots(allSlots);
    } catch (err) {
      error(err.message || 'Failed to load slots');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSlots();
  }, []);

  const handleStatusChange = async (slotId, newStatus) => {
    try {
      await adminService.updateSlotStatus(slotId, newStatus);
      success(`Slot status updated to ${newStatus}`);
      await loadSlots();
    } catch (err) {
      error(err.message || 'Status update failed');
    }
  };

  const handleAddSlot = async (e) => {
    e.preventDefault();
    if (!newSlotCode.trim()) return;
    try {
      await adminService.addSlot({
        zoneId: selectedZone,
        code: newSlotCode.trim().toUpperCase(),
        type: newSlotType,
        baseStatus: 'available',
      });
      success(`Slot ${newSlotCode.toUpperCase()} added to ${selectedZone}`);
      setAddModalOpen(false);
      setNewSlotCode('');
      await loadSlots();
    } catch (err) {
      error(err.message || 'Failed to add slot');
    }
  };

  const zoneSlots = slots.filter((s) => s.zoneId === selectedZone);
  const filteredSlots = zoneSlots.filter((s) => {
    if (statusFilter === 'all') return true;
    return s.baseStatus === statusFilter;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-outline-variant/60 pb-5">
        <div>
          <h1 className="font-headline-xl text-2xl sm:text-3xl font-bold text-on-surface">
            Bay Slot Operational Controls
          </h1>
          <p className="text-xs sm:text-sm text-secondary mt-1">
            Override hardware sensor telemetry, place stalls on maintenance hold, or add newly engineered bays.
          </p>
        </div>
        <Button onClick={() => setAddModalOpen(true)} icon={Plus} size="sm">
          Add Slot
        </Button>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-surface-container-lowest border border-outline-variant rounded-xl p-4">
        {/* Zone Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-secondary">Zone:</span>
          <select
            value={selectedZone}
            onChange={(e) => setSelectedZone(e.target.value)}
            className="text-xs font-bold bg-surface-container-low border border-outline-variant rounded-lg px-3 py-1.5 focus:outline-none"
          >
            {zones.map((z) => (
              <option key={z.id} value={z.id}>
                {z.name} — {z.label}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-1 overflow-x-auto text-xs font-semibold">
          {[
            { id: 'all', label: 'All Slots' },
            { id: 'available', label: 'Available' },
            { id: 'occupied', label: 'Occupied' },
            { id: 'reserved', label: 'Reserved' },
            { id: 'maintenance', label: 'Maintenance' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setStatusFilter(item.id)}
              className={`px-2.5 py-1 rounded-md transition-colors whitespace-nowrap ${
                statusFilter === item.id
                  ? 'bg-primary text-on-primary font-bold shadow-xs'
                  : 'text-secondary hover:text-on-surface'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Slots Table */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-surface-container text-secondary bg-surface-container-low/50 font-semibold">
                <th className="py-3 px-4">Slot Identifier</th>
                <th className="py-3 px-4">Hardware Type</th>
                <th className="py-3 px-4">Current Base Status</th>
                <th className="py-3 px-4">Amenities</th>
                <th className="py-3 px-4 text-right">Operational Override</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container">
              {filteredSlots.map((s) => (
                <tr key={s.id} className="hover:bg-surface-container-low/40 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-on-surface text-sm">
                    {s.code}
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center gap-1 font-semibold text-secondary">
                      {s.type === 'ev' && <Zap className="w-3.5 h-3.5 text-primary" />}
                      {s.type === 'accessible' && <Accessibility className="w-3.5 h-3.5 text-secondary" />}
                      <span className="capitalize">{s.type}</span>
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                        s.baseStatus === 'available'
                          ? 'bg-[#ECFDF5] text-primary'
                          : s.baseStatus === 'occupied'
                          ? 'bg-surface-container text-secondary'
                          : s.baseStatus === 'reserved'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-red-100 text-error'
                      }`}
                    >
                      {s.baseStatus.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-secondary">
                    {s.amenities?.join(', ') || 'Standard bay'}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <select
                      value={s.baseStatus}
                      onChange={(e) => handleStatusChange(s.id, e.target.value)}
                      className="text-xs bg-surface-container-low border border-outline-variant rounded px-2 py-1 focus:outline-none font-medium cursor-pointer"
                    >
                      <option value="available">Set: Available</option>
                      <option value="occupied">Set: Occupied</option>
                      <option value="reserved">Set: Reserved</option>
                      <option value="maintenance">Set: Maintenance Hold</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Slot Modal */}
      <Modal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        title={`Add Bay Slot to ${zones.find((z) => z.id === selectedZone)?.name || selectedZone}`}
      >
        <form onSubmit={handleAddSlot} className="space-y-4 text-xs">
          <Input
            label="Slot Code"
            value={newSlotCode}
            onChange={(e) => setNewSlotCode(e.target.value)}
            placeholder="e.g. A-61 or EV-21"
            required
          />

          <div>
            <label className="block font-semibold text-secondary mb-1">Slot Hardware Type</label>
            <select
              value={newSlotType}
              onChange={(e) => setNewSlotType(e.target.value)}
              className="w-full p-2 bg-surface-container-lowest border border-outline-variant rounded-lg text-sm"
            >
              <option value="standard">Standard Vehicle</option>
              <option value="ev">EV Charger Bank</option>
              <option value="accessible">Accessible Priority</option>
            </select>
          </div>

          <div className="pt-3 flex justify-end gap-2 border-t border-surface-container">
            <Button variant="secondary" onClick={() => setAddModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Create Slot</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
