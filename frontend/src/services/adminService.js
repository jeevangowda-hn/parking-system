import { storageService } from './storageService.js';

const delay = (ms = 350) => new Promise(r => setTimeout(r, ms));

export const adminService = {
  /**
   * Retrieves summary KPI metrics for the Admin Dashboard.
   */
  async getDashboardStats() {
    await delay(300);
    const { zones, slots, bookings } = storageService.getStoredData();
    const totalBays = slots.length;

    // Calculate occupied, reserved, and available based on current slot statuses and active bookings
    const occupiedSlots = slots.filter(s => s.baseStatus === 'occupied').length;
    const maintenanceSlots = slots.filter(s => s.baseStatus === 'maintenance').length;
    const reservedSlots = slots.filter(s => s.baseStatus === 'reserved').length;
    
    // Active bookings
    const activeBookings = bookings.filter(b => b.status === 'active' || b.status === 'upcoming').length;
    const availableBays = Math.max(0, totalBays - occupiedSlots - reservedSlots - maintenanceSlots);
    const occupancyRate = totalBays > 0 ? ((occupiedSlots / totalBays) * 100).toFixed(1) : 0;

    return {
      totalBays,
      occupiedBays: occupiedSlots,
      availableBays,
      activeReservations: activeBookings,
      occupancyRate: Number(occupancyRate),
      hardwareLatency: '14ms',
      telemetrySLA: '99.98%',
      activeZonesCount: zones.filter(z => z.status === 'active').length,
    };
  },

  /**
   * Gets zone summaries with occupancy metrics.
   */
  async getZoneSummaries() {
    await delay(250);
    const { zones, slots, bookings } = storageService.getStoredData();
    return zones.map(zone => {
      const zoneSlots = slots.filter(s => s.zoneId === zone.id);
      const occupied = zoneSlots.filter(s => s.baseStatus === 'occupied').length;
      const reserved = zoneSlots.filter(s => s.baseStatus === 'reserved').length;
      const maintenance = zoneSlots.filter(s => s.baseStatus === 'maintenance').length;
      const available = Math.max(0, zoneSlots.length - occupied - reserved - maintenance);
      const occupancyPct = zoneSlots.length > 0 ? Math.round(((occupied + reserved) / zoneSlots.length) * 100) : 0;

      return {
        ...zone,
        total: zoneSlots.length,
        available,
        occupied,
        reserved,
        maintenance,
        occupancyPct,
        sensorsOnline: `${zoneSlots.length - maintenance}/${zoneSlots.length}`,
      };
    });
  },

  /**
   * Gets hourly occupancy distribution curve.
   */
  async getHourlyAnalytics() {
    await delay(200);
    return [
      { time: '06:00', occupancyPct: 24, label: 'Early Window' },
      { time: '08:00', occupancyPct: 56, label: 'Morning Commute' },
      { time: '10:00', occupancyPct: 88, label: 'Peak Morning', isPeak: true },
      { time: '12:00', occupancyPct: 91, label: 'Midday Peak' },
      { time: '14:00', occupancyPct: 74, label: 'Afternoon Post-Lunch' },
      { time: '16:00', occupancyPct: 62, label: 'Evening Departures' },
      { time: '18:00', occupancyPct: 48, label: 'Late Commute' },
      { time: '20:00', occupancyPct: 31, label: 'Evening Hours' },
    ];
  },

  /**
   * Gets all bookings with optional filtering.
   */
  async getAllBookings(filter = 'all', searchQuery = '') {
    await delay(300);
    const { bookings } = storageService.getStoredData();
    let result = [...bookings];

    if (filter === 'active') {
      result = result.filter(b => b.status === 'active');
    } else if (filter === 'upcoming' || filter === 'scheduled') {
      result = result.filter(b => b.status === 'upcoming');
    } else if (filter === 'completed') {
      result = result.filter(b => b.status === 'completed');
    } else if (filter === 'cancelled') {
      result = result.filter(b => b.status === 'cancelled');
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(b =>
        b.bookingRef.toLowerCase().includes(q) ||
        b.userName.toLowerCase().includes(q) ||
        b.slotCode.toLowerCase().includes(q) ||
        (b.vehicle && b.vehicle.plate && b.vehicle.plate.toLowerCase().includes(q))
      );
    }

    return result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  /**
   * Updates an individual slot status (e.g. available, maintenance, occupied, reserved).
   */
  async updateSlotStatus(slotId, newStatus) {
    await delay(300);
    const { slots } = storageService.getStoredData();
    const updated = slots.map(s => s.id === slotId ? { ...s, baseStatus: newStatus } : s);
    storageService.updateSlots(updated);
    return updated.find(s => s.id === slotId);
  },

  /**
   * Adds a new parking slot.
   */
  async addSlot(slotData) {
    await delay(300);
    const { slots, zones } = storageService.getStoredData();
    const zone = zones.find(z => z.id === slotData.zoneId);
    if (!zone) throw new Error('Invalid zone specified');

    const id = `${slotData.zoneId}-${slotData.code}`;
    if (slots.some(s => s.id === id)) {
      throw new Error(`Slot with code ${slotData.code} already exists in ${zone.name}`);
    }

    const newSlot = {
      id,
      zoneId: slotData.zoneId,
      code: slotData.code,
      type: slotData.type || 'standard',
      baseStatus: slotData.baseStatus || 'available',
      amenities: slotData.amenities || [],
    };

    const updated = [...slots, newSlot];
    storageService.updateSlots(updated);
    return newSlot;
  },

  /**
   * Updates zone configuration.
   */
  async updateZone(zoneId, updates) {
    await delay(300);
    const { zones } = storageService.getStoredData();
    const updated = zones.map(z => z.id === zoneId ? { ...z, ...updates } : z);
    storageService.updateZones(updated);
    return updated.find(z => z.id === zoneId);
  },

  /**
   * Adds a new zone.
   */
  async addZone(zoneData) {
    await delay(300);
    const { zones } = storageService.getStoredData();
    const id = `zone-${zoneData.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
    if (zones.some(z => z.id === id)) {
      throw new Error(`Zone ${zoneData.name} already exists.`);
    }

    const newZone = {
      id,
      name: zoneData.name,
      label: zoneData.label || 'Standard Level',
      level: zoneData.level || 'Ground',
      shortCode: zoneData.name.replace(/[^A-Za-z]/g, '').slice(0, 1).toUpperCase() || 'X',
      capacity: Number(zoneData.capacity) || 50,
      type: zoneData.type || 'standard',
      description: zoneData.description || 'Facility parking zone',
      amenities: zoneData.amenities || ['CCTV', 'Covered'],
      status: 'active',
      clearanceHeight: zoneData.clearanceHeight || '2.2m',
      entryGate: zoneData.entryGate || 'Main Gate',
      walkTime: zoneData.walkTime || '1 min to Elevator',
      hourlyRate: Number(zoneData.hourlyRate) || 4.00,
      color: zoneData.color || '#006948',
    };

    const updated = [...zones, newZone];
    storageService.updateZones(updated);
    return newZone;
  },

  /**
   * Resets demo data back to default initial seed.
   */
  async resetDemoData() {
    await delay(500);
    return storageService.resetDemoData();
  },
};

