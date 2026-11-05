// Generates realistic demo slot data for all 4 zones
// baseStatus is the initial seed status; actual runtime status is computed
// from active/upcoming bookings in the reservation engine

const makeSlot = (zoneId, code, type = 'standard', baseStatus = 'available', amenities = []) => ({
  id: `${zoneId}-${code}`,
  zoneId,
  code,
  type, // 'standard' | 'ev' | 'accessible'
  baseStatus, // 'available' | 'occupied' | 'reserved' | 'maintenance'
  amenities,
});

// ─── Zone A — Ground Floor (60 slots) ────────────────────────────────────────
const zoneASlots = [
  // Row 1: A-01 to A-10
  makeSlot('zone-a', 'A-01', 'standard', 'occupied'),
  makeSlot('zone-a', 'A-02', 'standard', 'available'),
  makeSlot('zone-a', 'A-03', 'standard', 'occupied'),
  makeSlot('zone-a', 'A-04', 'standard', 'reserved'),
  makeSlot('zone-a', 'A-05', 'standard', 'available'),
  makeSlot('zone-a', 'A-06', 'standard', 'available'),
  makeSlot('zone-a', 'A-07', 'standard', 'maintenance'),
  makeSlot('zone-a', 'A-08', 'standard', 'available'),
  makeSlot('zone-a', 'A-09', 'standard', 'available'),
  makeSlot('zone-a', 'A-10', 'standard', 'available'),
  // Row 2: EV Bank A-11 to A-18
  makeSlot('zone-a', 'A-11', 'ev', 'available', ['EV Charging']),
  makeSlot('zone-a', 'A-12', 'ev', 'occupied', ['EV Charging']),
  makeSlot('zone-a', 'A-13', 'ev', 'available', ['EV Charging']),
  makeSlot('zone-a', 'A-14', 'ev', 'available', ['EV Charging', '150kW DC']),
  makeSlot('zone-a', 'A-15', 'ev', 'occupied', ['EV Charging']),
  makeSlot('zone-a', 'A-16', 'ev', 'available', ['EV Charging']),
  makeSlot('zone-a', 'A-17', 'ev', 'reserved', ['EV Charging']),
  makeSlot('zone-a', 'A-18', 'ev', 'available', ['EV Charging']),
  // Row 3: EV Bank A-19 to A-26
  makeSlot('zone-a', 'A-19', 'ev', 'available', ['EV Charging']),
  makeSlot('zone-a', 'A-20', 'standard', 'occupied'),
  makeSlot('zone-a', 'A-21', 'ev', 'available', ['EV Charging']),
  makeSlot('zone-a', 'A-22', 'ev', 'available', ['EV Charging']),
  makeSlot('zone-a', 'A-23', 'ev', 'reserved', ['EV Charging']),
  makeSlot('zone-a', 'A-24', 'ev', 'available', ['EV Charging']),
  makeSlot('zone-a', 'A-25', 'ev', 'available', ['EV Charging']),
  makeSlot('zone-a', 'A-26', 'standard', 'occupied'),
  // Row 4: Accessible A-27 to A-36
  makeSlot('zone-a', 'A-27', 'accessible', 'available', ['Accessible']),
  makeSlot('zone-a', 'A-28', 'accessible', 'available', ['Accessible']),
  makeSlot('zone-a', 'A-29', 'accessible', 'occupied', ['Accessible']),
  makeSlot('zone-a', 'A-30', 'standard', 'available'),
  makeSlot('zone-a', 'A-31', 'standard', 'available'),
  makeSlot('zone-a', 'A-32', 'standard', 'occupied'),
  makeSlot('zone-a', 'A-33', 'standard', 'available'),
  makeSlot('zone-a', 'A-34', 'standard', 'available'),
  makeSlot('zone-a', 'A-35', 'standard', 'reserved'),
  makeSlot('zone-a', 'A-36', 'standard', 'available'),
  // Row 5: A-37 to A-46
  makeSlot('zone-a', 'A-37', 'standard', 'available'),
  makeSlot('zone-a', 'A-38', 'standard', 'occupied'),
  makeSlot('zone-a', 'A-39', 'standard', 'available'),
  makeSlot('zone-a', 'A-40', 'standard', 'available'),
  makeSlot('zone-a', 'A-41', 'standard', 'occupied'),
  makeSlot('zone-a', 'A-42', 'standard', 'available'),
  makeSlot('zone-a', 'A-43', 'standard', 'maintenance'),
  makeSlot('zone-a', 'A-44', 'standard', 'available'),
  makeSlot('zone-a', 'A-45', 'standard', 'occupied'),
  makeSlot('zone-a', 'A-46', 'standard', 'available'),
  // Row 6: A-47 to A-60
  makeSlot('zone-a', 'A-47', 'standard', 'available'),
  makeSlot('zone-a', 'A-48', 'standard', 'available'),
  makeSlot('zone-a', 'A-49', 'standard', 'occupied'),
  makeSlot('zone-a', 'A-50', 'standard', 'available'),
  makeSlot('zone-a', 'A-51', 'standard', 'available'),
  makeSlot('zone-a', 'A-52', 'standard', 'occupied'),
  makeSlot('zone-a', 'A-53', 'standard', 'available'),
  makeSlot('zone-a', 'A-54', 'standard', 'reserved'),
  makeSlot('zone-a', 'A-55', 'standard', 'available'),
  makeSlot('zone-a', 'A-56', 'standard', 'available'),
  makeSlot('zone-a', 'A-57', 'standard', 'occupied'),
  makeSlot('zone-a', 'A-58', 'standard', 'available'),
  makeSlot('zone-a', 'A-59', 'standard', 'available'),
  makeSlot('zone-a', 'A-60', 'standard', 'occupied'),
];

// ─── Zone B — First Floor (60 slots) ─────────────────────────────────────────
const zoneBSlots = Array.from({ length: 60 }, (_, i) => {
  const num = String(i + 1).padStart(2, '0');
  const code = `B-${num}`;
  const statuses = ['available', 'available', 'available', 'occupied', 'available', 'reserved', 'available', 'available', 'available', 'occupied'];
  const status = statuses[i % statuses.length];
  const type = i % 8 === 0 ? 'ev' : i % 15 === 0 ? 'accessible' : 'standard';
  const amenities = type === 'ev' ? ['EV Charging'] : type === 'accessible' ? ['Accessible'] : [];
  if (i === 1) return makeSlot('zone-b', 'B-08', 'standard', 'reserved'); // matches demo booking
  return makeSlot('zone-b', code, type, status, amenities);
});

// ─── Zone C — Open Deck (80 slots) ───────────────────────────────────────────
const zoneCSlots = Array.from({ length: 80 }, (_, i) => {
  const num = String(i + 1).padStart(2, '0');
  const code = `C-${num}`;
  const statuses = ['available', 'occupied', 'available', 'available', 'occupied', 'available', 'available', 'reserved'];
  const status = statuses[i % statuses.length];
  if (i === 21) return makeSlot('zone-c', 'C-22', 'standard', 'reserved'); // matches demo booking
  return makeSlot('zone-c', code, 'standard', status);
});

// ─── Zone D — EV Hub (20 slots) ──────────────────────────────────────────────
const zoneDSlots = [
  makeSlot('zone-d', 'D-01', 'ev', 'occupied', ['150kW DC Fast Charge']),
  makeSlot('zone-d', 'D-02', 'ev', 'occupied', ['150kW DC Fast Charge']),
  makeSlot('zone-d', 'D-03', 'ev', 'occupied', ['150kW DC Fast Charge']),
  makeSlot('zone-d', 'D-04', 'ev', 'available', ['150kW DC Fast Charge']),
  makeSlot('zone-d', 'D-05', 'ev', 'occupied', ['150kW DC Fast Charge']),
  makeSlot('zone-d', 'D-06', 'ev', 'available', ['150kW DC Fast Charge']),
  makeSlot('zone-d', 'D-07', 'ev', 'occupied', ['150kW DC Fast Charge']),
  makeSlot('zone-d', 'D-08', 'ev', 'reserved', ['150kW DC Fast Charge']),
  makeSlot('zone-d', 'D-09', 'ev', 'occupied', ['150kW DC Fast Charge']),
  makeSlot('zone-d', 'D-10', 'ev', 'available', ['150kW DC Fast Charge']),
  makeSlot('zone-d', 'D-11', 'ev', 'occupied', ['150kW DC Fast Charge']),
  makeSlot('zone-d', 'D-12', 'ev', 'available', ['150kW DC Fast Charge']),
  makeSlot('zone-d', 'D-13', 'ev', 'occupied', ['150kW DC Fast Charge']),
  makeSlot('zone-d', 'D-14', 'ev', 'occupied', ['150kW DC Fast Charge']),
  makeSlot('zone-d', 'D-15', 'ev', 'available', ['150kW DC Fast Charge']),
  makeSlot('zone-d', 'D-16', 'ev', 'occupied', ['150kW DC Fast Charge']),
  makeSlot('zone-d', 'D-17', 'ev', 'reserved', ['150kW DC Fast Charge']),
  makeSlot('zone-d', 'D-18', 'ev', 'occupied', ['150kW DC Fast Charge']),
  makeSlot('zone-d', 'D-19', 'ev', 'occupied', ['150kW DC Fast Charge']),
  makeSlot('zone-d', 'D-20', 'ev', 'available', ['150kW DC Fast Charge']),
];

export const DEMO_SLOTS = [
  ...zoneASlots,
  ...zoneBSlots,
  ...zoneCSlots,
  ...zoneDSlots,
];

