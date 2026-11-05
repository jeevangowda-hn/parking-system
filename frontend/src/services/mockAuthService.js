/**
 * mockAuthService — UI Demonstration Only
 *
 * WARNING: This is NOT secure authentication.
 * Credentials are compared client-side. This is only for a frontend demonstration.
 * Do not use in production.
 */
import { storageService } from './storageService.js';

const delay = (ms = 400) => new Promise(r => setTimeout(r, ms));

export const mockAuthService = {
  /**
   * Attempts a login with email and password.
   * Returns { user } on success, throws on failure.
   */
  async login(email, password) {
    await delay(600);
    const { users } = storageService.getStoredData();
    const user = users.find(
      u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );
    if (!user) {
      throw new Error('Invalid email or password. Please try again.');
    }
    storageService.saveSession(user);
    const { password: _pw, ...safeUser } = user;
    return { user: safeUser };
  },

  /**
   * Registers a new customer account and logs them in.
   */
  async register(name, email, password) {
    await delay(700);
    const data = storageService.getStoredData();
    const existing = data.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      throw new Error('An account with this email already exists.');
    }
    const newUser = {
      id: `u-${Date.now()}`,
      name,
      email,
      password, // only stored in this demo context
      role: 'customer',
      vehicle: null,
      joinedDate: new Date().toISOString().split('T')[0],
      avatar: name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2),
    };
    const updatedUsers = [...data.users, newUser];
    storageService.updateUsers(updatedUsers);
    storageService.saveSession(newUser);
    const { password: _pw, ...safeUser } = newUser;
    return { user: safeUser };
  },

  /**
   * Logs out the current user by clearing the session.
   */
  async logout() {
    await delay(200);
    storageService.clearSession();
  },

  /**
   * Returns the current session user or null.
   */
  async getCurrentUser() {
    return storageService.getSession();
  },

  /**
   * Updates user profile data (name, vehicle).
   */
  async updateProfile(userId, updates) {
    await delay(500);
    const data = storageService.getStoredData();
    const updatedUsers = data.users.map(u =>
      u.id === userId ? { ...u, ...updates } : u
    );
    storageService.updateUsers(updatedUsers);
    const updated = updatedUsers.find(u => u.id === userId);
    // Refresh session
    storageService.saveSession(updated);
    const { password: _pw, ...safeUser } = updated;
    return { user: safeUser };
  },
};

