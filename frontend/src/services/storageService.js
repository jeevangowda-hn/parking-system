import { DEMO_USERS } from '../data/demoUsers.js';
import { DEMO_ZONES } from '../data/demoZones.js';
import { DEMO_SLOTS } from '../data/demoSlots.js';
import { DEMO_BOOKINGS } from '../data/demoBookings.js';

const STORAGE_KEY = 'parkwise:app-state';
const STORAGE_VERSION = '1.1';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function safeParseJSON(str) {
  try {
    return JSON.parse(str);
  } catch {
    return null;
  }
}

function isStorageAvailable() {
  try {
    localStorage.setItem('__test__', '1');
    localStorage.removeItem('__test__');
    return true;
  } catch {
    return false;
  }
}

// ─── Public API ───────────────────────────────────────────────────────────────

export const storageService = {
  /**
   * Returns the full app state from localStorage.
   * Initializes with demo data if key is absent or version mismatch.
   */
  getStoredData() {
    if (!isStorageAvailable()) return this._buildSeedData();
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return this.initializeDemoData();
    const parsed = safeParseJSON(raw);
    if (!parsed || parsed.version !== STORAGE_VERSION) {
      return this.initializeDemoData();
    }
    return parsed;
  },

  /**
   * Saves the full app state to localStorage.
   */
  saveStoredData(data) {
    if (!isStorageAvailable()) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...data, version: STORAGE_VERSION }));
    } catch (e) {
      console.warn('PARKWISE: localStorage write failed', e);
    }
  },

  /**
   * Seeds demo data into localStorage (only on first visit or version bump).
   * Does NOT overwrite if data already exists at the correct version.
   */
  initializeDemoData() {
    const seed = this._buildSeedData();
    this.saveStoredData(seed);
    return seed;
  },

  /**
   * Wipes all stored data and re-seeds with demo defaults.
   */
  resetDemoData() {
    if (!isStorageAvailable()) return;
    localStorage.removeItem(STORAGE_KEY);
    return this.initializeDemoData();
  },

  /**
   * Clears the current user session from sessionStorage.
   */
  clearSession() {
    try {
      sessionStorage.removeItem('parkwise:session');
    } catch {
      // silent
    }
  },

  /**
   * Gets the current session user.
   */
  getSession() {
    try {
      const raw = sessionStorage.getItem('parkwise:session');
      return safeParseJSON(raw);
    } catch {
      return null;
    }
  },

  /**
   * Saves a user session to sessionStorage.
   */
  saveSession(user) {
    try {
      // Strip password before storing session
      const { password: _pw, ...safeUser } = user;
      sessionStorage.setItem('parkwise:session', JSON.stringify(safeUser));
    } catch {
      // silent
    }
  },

  // ─── Partial updaters (avoid rewriting full state each time) ───────────────

  updateBookings(bookings) {
    const data = this.getStoredData();
    this.saveStoredData({ ...data, bookings });
  },

  updateSlots(slots) {
    const data = this.getStoredData();
    this.saveStoredData({ ...data, slots });
  },

  updateZones(zones) {
    const data = this.getStoredData();
    this.saveStoredData({ ...data, zones });
  },

  updateUsers(users) {
    const data = this.getStoredData();
    this.saveStoredData({ ...data, users });
  },

  // ─── Internal seed builder ─────────────────────────────────────────────────

  _buildSeedData() {
    return {
      version: STORAGE_VERSION,
      users: [...DEMO_USERS],
      zones: [...DEMO_ZONES],
      slots: [...DEMO_SLOTS],
      bookings: [...DEMO_BOOKINGS],
    };
  },
};

