import { storageService } from './storageService.js';

const delay = (ms = 350) => new Promise(r => setTimeout(r, ms));

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Checks if two time ranges overlap.
 * Returns true if they conflict.
 * Times are 'HH:MM' strings.
 */
function toMinutes(time) {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}

function hasTimeOverlap(existStart, existEnd, reqStart, reqEnd) {
  const es = toMinutes(existStart);
  const ee = toMinutes(existEnd);
  const rs = toMinutes(reqStart);
  const re = toMinutes(reqEnd);
  return es < re && ee > rs;
}

/**
 * Determines the effective status of a slot given active bookings.
 */
function getEffectiveSlotStatus(slot, bookings, date, startTime, endTime) {
  // Maintenance slots are always unavailable
  if (slot.baseStatus === 'maintenance') return 'maintenance';

  // Check for overlapping bookings (non-cancelled)
  const conflicts = bookings.filter(b =>
    b.slotId === slot.id &&
    b.date === date &&
    b.status !== 'cancelled' &&
    hasTimeOverlap(b.startTime, b.endTime, startTime, endTime)
  );

  if (conflicts.length > 0) {
    const isActive = conflicts.some(b => b.status === 'active');
    return isActive ? 'occupied' : 'reserved';
  }

  // Fall back to base status for occupied (physical occupancy sensor simulation)
  if (slot.baseStatus === 'occupied') return 'occupied';

  return 'available';
}

// ─── Parking Service ──────────────────────────────────────────────────────────

export const parkingService = {
  /**
   * Returns all zones with live capacity statistics.
   */
  async getZones() {
    await delay();
    const { zones, slots, bookings } = storageService.getStoredData();
    return zones.map(zone => {
      const zoneSlots = slots.filter(s => s.zoneId === zone.id);
      const today = new Date().toISOString().split('T')[0];
      const occupiedCount = zoneSlots.filter(s => {
        const eff = getEffectiveSlotStatus(s, bookings, today, '00:00', '23:59');
        return eff === 'occupied';
      }).length;
      const reservedCount = zoneSlots.filter(s => {
        const eff = getEffectiveSlotStatus(s, bookings, today, '00:00', '23:59');
        return eff === 'reserved';
      }).length;
      const maintenanceCount = zoneSlots.filter(s => s.baseStatus === 'maintenance').length;
      const availableCount = zone.capacity - occupiedCount - reservedCount - maintenanceCount;
      const occupancyPct = Math.round(((occupiedCount + reservedCount) / zone.capacity) * 100);

      return {
        ...zone,
        totalSlots: zoneSlots.length,
        availableCount: Math.max(0, availableCount),
        occupiedCount,
        reservedCount,
        maintenanceCount,
        occupancyPct,
      };
    });
  },

  /**
   * Returns a single zone by ID.
   */
  async getZone(zoneId) {
    await delay(200);
    const zones = await this.getZones();
    const zone = zones.find(z => z.id === zoneId);
    if (!zone) throw new Error(`Zone not found: ${zoneId}`);
    return zone;
  },

  /**
   * Returns all slots for a zone with their effective status
   * for a given date/time window (used for the slot selector).
   */
  async getSlots(zoneId, { date, startTime, endTime } = {}) {
    await delay(300);
    const { slots, bookings } = storageService.getStoredData();
    const zoneSlots = slots.filter(s => s.zoneId === zoneId);

    const searchDate = date || new Date().toISOString().split('T')[0];
    const searchStart = startTime || '00:00';
    const searchEnd = endTime || '23:59';

    return zoneSlots.map(slot => ({
      ...slot,
      effectiveStatus: getEffectiveSlotStatus(slot, bookings, searchDate, searchStart, searchEnd),
    }));
  },

  /**
   * Returns only available slots for a given zone/date/time window.
   */
  async getAvailableSlots(zoneId, date, startTime, endTime) {
    const slots = await this.getSlots(zoneId, { date, startTime, endTime });
    return slots.filter(s => s.effectiveStatus === 'available');
  },
};

