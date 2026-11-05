import { storageService } from './storageService.js';

const delay = (ms = 400) => new Promise(r => setTimeout(r, ms));

function toMinutes(time) {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}

function hasTimeOverlap(existStart, existEnd, reqStart, reqEnd) {
  return toMinutes(existStart) < toMinutes(reqEnd) &&
         toMinutes(existEnd) > toMinutes(reqStart);
}

function generateBookingRef() {
  const { bookings } = storageService.getStoredData();
  const maxRef = bookings.reduce((max, b) => {
    const num = parseInt(b.bookingRef.replace('PW-', ''), 10);
    return num > max ? num : max;
  }, 84920);
  return `PW-${maxRef + 1}`;
}

function calcDuration(startTime, endTime) {
  return (toMinutes(endTime) - toMinutes(startTime)) / 60;
}

export const bookingService = {
  /**
   * Creates a new booking with full overlap validation.
   */
  async createBooking({ userId, userName, userEmail, zoneId, zoneName, zoneLabel,
    slotId, slotCode, slotType, date, startTime, endTime, vehicle,
    hourlyRate = 4.50, paymentMethod = 'Demo Payment', entryBarrier }) {
    await delay(700);

    const { bookings, slots } = storageService.getStoredData();

    // 1. Verify slot exists
    const slot = slots.find(s => s.id === slotId);
    if (!slot) throw new Error('Selected slot does not exist.');

    // 2. Check maintenance
    if (slot.baseStatus === 'maintenance') {
      throw new Error('This slot is currently under maintenance and cannot be booked.');
    }

    // 3. Validate date/time
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const bookingDate = new Date(date + 'T00:00:00');
    if (bookingDate < today) {
      throw new Error('Booking date cannot be in the past.');
    }
    if (toMinutes(endTime) <= toMinutes(startTime)) {
      throw new Error('End time must be after start time.');
    }

    // 4. Check overlapping bookings (non-cancelled)
    const conflict = bookings.find(b =>
      b.slotId === slotId &&
      b.date === date &&
      b.status !== 'cancelled' &&
      hasTimeOverlap(b.startTime, b.endTime, startTime, endTime)
    );
    if (conflict) {
      throw new Error(
        `Slot ${slotCode} is already booked from ${conflict.startTime} to ${conflict.endTime} on this date.`
      );
    }

    // 5. Calculate pricing
    const duration = calcDuration(startTime, endTime);
    const baseParking = parseFloat((duration * hourlyRate).toFixed(2));
    const surcharge = duration >= 4 ? 1.20 : 0;
    const totalAmount = parseFloat((baseParking + surcharge).toFixed(2));

    // 6. Build booking record
    const newBooking = {
      id: `bk-${Date.now()}`,
      bookingRef: generateBookingRef(),
      userId,
      userName,
      userEmail,
      zoneId,
      zoneName,
      zoneLabel,
      slotId,
      slotCode,
      slotType,
      date,
      startTime,
      endTime,
      duration,
      status: 'upcoming',
      vehicle,
      totalAmount,
      breakdown: { baseParking, surcharge, tax: 0 },
      paymentMethod,
      entryBarrier: entryBarrier || 'Main Entry Barrier',
      createdAt: new Date().toISOString(),
    };

    const updatedBookings = [...bookings, newBooking];
    storageService.updateBookings(updatedBookings);
    return newBooking;
  },

  /**
   * Returns all bookings for a specific user.
   */
  async getUserBookings(userId) {
    await delay(300);
    const { bookings } = storageService.getStoredData();
    return bookings
      .filter(b => b.userId === userId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  /**
   * Returns a single booking by ID.
   */
  async getBooking(bookingId) {
    await delay(200);
    const { bookings } = storageService.getStoredData();
    const booking = bookings.find(b => b.id === bookingId || b.bookingRef === bookingId);
    if (!booking) throw new Error(`Booking not found: ${bookingId}`);
    return booking;
  },

  /**
   * Cancels a booking. Only upcoming bookings can be cancelled.
   */
  async cancelBooking(bookingId) {
    await delay(500);
    const { bookings } = storageService.getStoredData();
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking) throw new Error('Booking not found.');
    if (booking.status === 'cancelled') throw new Error('Booking is already cancelled.');
    if (booking.status === 'completed') throw new Error('Completed bookings cannot be cancelled.');

    const updated = bookings.map(b =>
      b.id === bookingId
        ? { ...b, status: 'cancelled', cancelledAt: new Date().toISOString() }
        : b
    );
    storageService.updateBookings(updated);
    return { ...booking, status: 'cancelled' };
  },
};

