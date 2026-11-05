import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService.js';
import { useToast } from '../../context/ToastContext.jsx';
import { Modal } from '../../components/common/Modal.jsx';
import { Button } from '../../components/common/Button.jsx';
import { Input } from '../../components/common/Input.jsx';
import {
  Layers,
  Plus,
  Edit,
  DollarSign,
  Ruler,
  Building,
  CheckCircle2,
  XCircle,
  Zap,
} from 'lucide-react';
import { formatCurrency } from '../../utils/formatters.js';

export function ZoneManagement() {
  const { success, error } = useToast();
  const [zones, setZones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingZone, setEditingZone] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    label: '',
    level: '',
    capacity: 50,
    hourlyRate: 4.00,
    clearanceHeight: '2.2m',
    entryGate: 'Main Gate',
  });

  const loadZones = async () => {
    try {
      setLoading(true);
      const data = await adminService.getZoneSummaries();
      setZones(data);
    } catch (err) {
      error(err.message || 'Failed to load zones');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadZones();
  }, []);

  const handleOpenAdd = () => {
    setEditingZone(null);
    setFormData({
      name: `Zone ${String.fromCharCode(65 + zones.length)}`,
      label: 'Level 2',
      level: `Level ${zones.length}`,
      capacity: 50,
      hourlyRate: 4.50,
      clearanceHeight: '2.2m',
      entryGate: 'Ramp Gate #4',
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (zone) => {
    setEditingZone(zone);
    setFormData({
      name: zone.name,
      label: zone.label,
      level: zone.level,
      capacity: zone.capacity,
      hourlyRate: zone.hourlyRate,
      clearanceHeight: zone.clearanceHeight,
      entryGate: zone.entryGate,
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingZone) {
        await adminService.updateZone(editingZone.id, formData);
        success(`Zone ${formData.name} updated successfully.`);
      } else {
        await adminService.addZone(formData);
        success(`New ${formData.name} created.`);
      }
      setModalOpen(false);
      await loadZones();
    } catch (err) {
      error(err.message || 'Operation failed');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-outline-variant/60 pb-5">
        <div>
          <h1 className="font-headline-xl text-2xl sm:text-3xl font-bold text-on-surface">
            Parking Zone Configuration
          </h1>
          <p className="text-xs sm:text-sm text-secondary mt-1">
            Configure floor clearance heights, hourly tariff rates, and maximum vehicle capacities across parking sections.
          </p>
        </div>
        <Button onClick={handleOpenAdd} icon={Plus} size="sm">
          Add New Zone
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {zones.map((zone) => (
          <div
            key={zone.id}
            className="bg-surface-container-lowest border border-outline-variant rounded-xl p-5 shadow-sm space-y-4"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-primary font-bold">
                  {zone.shortCode}
                </div>
                <div>
                  <h3 className="font-headline-sm text-base font-bold text-on-surface">
                    {zone.name} — {zone.label}
                  </h3>
                  <span className="text-xs text-secondary">{zone.level}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    zone.status === 'active'
                      ? 'bg-[#ECFDF5] text-primary'
                      : 'bg-surface-container text-secondary'
                  }`}
                >
                  {zone.status.toUpperCase()}
                </span>
                <button
                  onClick={() => handleOpenEdit(zone)}
                  className="p-1.5 rounded-lg border border-outline-variant hover:bg-surface-container text-secondary"
                  title="Edit Zone"
                >
                  <Edit className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <p className="text-xs text-secondary leading-relaxed">{zone.description}</p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 bg-surface rounded-lg border border-outline-variant/60 text-xs">
              <div>
                <span className="text-outline text-[11px] block">Capacity</span>
                <span className="font-bold text-on-surface">{zone.capacity} Bays</span>
              </div>
              <div>
                <span className="text-outline text-[11px] block">Occupancy</span>
                <span className="font-bold text-primary">{zone.occupancyPct}%</span>
              </div>
              <div>
                <span className="text-outline text-[11px] block">Base Rate</span>
                <span className="font-bold text-on-surface">{formatCurrency(zone.hourlyRate)}/h</span>
              </div>
              <div>
                <span className="text-outline text-[11px] block">Clearance</span>
                <span className="font-bold text-on-surface">{zone.clearanceHeight}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Zone Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingZone ? `Edit ${editingZone.name}` : 'Add Parking Section'}
      >
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <Input
            label="Zone Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g. Zone E"
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Level / Floor Label"
              value={formData.label}
              onChange={(e) => setFormData({ ...formData, label: e.target.value })}
              placeholder="e.g. Mezzanine"
              required
            />
            <Input
              label="Floor Level"
              value={formData.level}
              onChange={(e) => setFormData({ ...formData, level: e.target.value })}
              placeholder="e.g. Level 3"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Stall Capacity"
              type="number"
              min="10"
              max="200"
              value={formData.capacity}
              onChange={(e) => setFormData({ ...formData, capacity: Number(e.target.value) })}
              required
            />
            <Input
              label="Hourly Tariff ($/hr)"
              type="number"
              step="0.5"
              min="1"
              value={formData.hourlyRate}
              onChange={(e) => setFormData({ ...formData, hourlyRate: Number(e.target.value) })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Height Clearance"
              value={formData.clearanceHeight}
              onChange={(e) => setFormData({ ...formData, clearanceHeight: e.target.value })}
              placeholder="2.2m"
            />
            <Input
              label="Dedicated Entrance Gate"
              value={formData.entryGate}
              onChange={(e) => setFormData({ ...formData, entryGate: e.target.value })}
              placeholder="East Gate 3"
            />
          </div>

          <div className="pt-3 flex justify-end gap-2 border-t border-surface-container">
            <Button variant="secondary" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {editingZone ? 'Save Changes' : 'Create Zone'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

