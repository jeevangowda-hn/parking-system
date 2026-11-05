import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import {
  ParkingSquare,
  Search,
  Bell,
  HelpCircle,
  Menu,
  X,
  User,
  LogOut,
  ArrowRight,
  Shield,
} from 'lucide-react';

export function CustomerNav() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userDropdown, setUserDropdown] = useState(false);

  const handleLogout = async () => {
    await logout();
    setUserDropdown(false);
    navigate('/');
  };

  const navLinkClass = ({ isActive }) =>
    isActive
      ? 'border-b-2 border-primary text-primary font-semibold pb-1 text-sm flex items-center gap-1.5 transition-colors'
      : 'text-on-surface-variant hover:text-on-surface pb-1 text-sm transition-colors';

  return (
    <header className="sticky top-0 z-40 bg-surface-container-lowest border-b border-outline-variant shadow-sm transition-all duration-200">
      <div className="w-full max-w-7xl px-4 sm:px-6 py-3 flex items-center justify-between mx-auto">
        {/* Brand Logo & Cluster */}
        <div className="flex items-center gap-6 lg:gap-8">
          <Link to="/" className="flex items-center gap-2.5 text-primary group">
            <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center text-on-primary shadow-sm group-hover:bg-primary-hover transition-colors">
              <span className="font-bold text-lg leading-none">P</span>
            </div>
            <span className="text-xl font-headline-md font-bold tracking-tight text-primary">
              PARKWISE
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-6">
            <NavLink to="/find-parking" className={navLinkClass}>
              Find Parking
            </NavLink>
            <NavLink to="/parking/zone-a" className={navLinkClass}>
              Interactive Map
            </NavLink>
            {isAuthenticated && (
              <NavLink to="/my-bookings" className={navLinkClass}>
                My Bookings
              </NavLink>
            )}
            <NavLink to="/dashboard" className={navLinkClass}>
              Dashboard
            </NavLink>
            {isAdmin && (
              <NavLink
                to="/admin/dashboard"
                className="text-amber-800 bg-amber-50 px-2 py-0.5 rounded text-xs font-bold border border-amber-200 flex items-center gap-1"
              >
                <Shield className="w-3 h-3" /> Admin Portal
              </NavLink>
            )}
          </nav>
        </div>

        {/* Action Cluster */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            aria-label="Notifications"
            className="p-2 rounded-lg text-secondary hover:bg-surface-container transition-colors relative"
            type="button"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full"></span>
          </button>
          
          <button
            aria-label="Support Help"
            className="hidden sm:inline-flex p-2 rounded-lg text-secondary hover:bg-surface-container transition-colors"
            type="button"
            onClick={() => alert('Support helpline: Call +1 (800) 555-PARK (24/7 Concierge)')}
          >
            <HelpCircle className="w-5 h-5" />
          </button>

          <div className="h-5 w-px bg-outline-variant mx-1 hidden sm:block"></div>

          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setUserDropdown(!userDropdown)}
                className="flex items-center gap-2 p-1 rounded-lg hover:bg-surface-container transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-secondary-container text-on-secondary-container text-xs font-bold flex items-center justify-center border border-outline-variant">
                  {user.avatar || 'U'}
                </div>
                <span className="hidden sm:inline text-xs font-semibold text-on-surface">
                  {user.name.split(' ')[0]}
                </span>
              </button>

              {userDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-surface-container-lowest border border-outline-variant rounded-xl shadow-lg py-1 z-50 animate-slide-up">
                  <div className="px-4 py-2 border-b border-outline-variant/60">
                    <p className="text-xs font-bold text-on-surface truncate">{user.name}</p>
                    <p className="text-[11px] text-secondary truncate">{user.email}</p>
                  </div>
                  <Link
                    to="/profile"
                    onClick={() => setUserDropdown(false)}
                    className="flex items-center gap-2 px-4 py-2 text-xs text-on-surface hover:bg-surface-container transition-colors"
                  >
                    <User className="w-4 h-4 text-secondary" />
                    <span>User Profile</span>
                  </Link>
                  <Link
                    to="/my-bookings"
                    onClick={() => setUserDropdown(false)}
                    className="flex items-center gap-2 px-4 py-2 text-xs text-on-surface hover:bg-surface-container transition-colors"
                  >
                    <ParkingSquare className="w-4 h-4 text-secondary" />
                    <span>My Bookings</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-2 text-xs text-error hover:bg-red-50 transition-colors text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="px-3.5 py-1.5 rounded-lg text-sm text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors font-semibold"
            >
              Sign In
            </Link>
          )}

          {/* Primary CTA */}
          <Link
            to="/find-parking"
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-primary hover:bg-primary-hover text-on-primary text-xs font-bold shadow-sm active:scale-95 transition-all"
          >
            <span>Reserve Slot</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>

          {/* Mobile hamburger button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-lg text-secondary hover:bg-surface-container"
            aria-label="Toggle navigation menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileOpen && (
        <div className="md:hidden border-t border-outline-variant bg-surface-container-lowest px-4 py-4 space-y-3">
          <NavLink
            to="/find-parking"
            onClick={() => setMobileOpen(false)}
            className="block text-sm font-semibold text-on-surface py-1.5"
          >
            Find Parking
          </NavLink>
          <NavLink
            to="/parking/zone-a"
            onClick={() => setMobileOpen(false)}
            className="block text-sm font-semibold text-on-surface py-1.5"
          >
            Interactive Blueprint
          </NavLink>
          <NavLink
            to="/dashboard"
            onClick={() => setMobileOpen(false)}
            className="block text-sm font-semibold text-on-surface py-1.5"
          >
            Dashboard
          </NavLink>
          {isAuthenticated && (
            <NavLink
              to="/my-bookings"
              onClick={() => setMobileOpen(false)}
              className="block text-sm font-semibold text-on-surface py-1.5"
            >
              My Bookings
            </NavLink>
          )}
          {isAdmin && (
            <NavLink
              to="/admin/dashboard"
              onClick={() => setMobileOpen(false)}
              className="block text-sm font-semibold text-amber-800 py-1.5"
            >
              Admin Operations Command Center
            </NavLink>
          )}
          <div className="pt-2 border-t border-outline-variant flex gap-2">
            <Link
              to="/find-parking"
              onClick={() => setMobileOpen(false)}
              className="flex-1 py-2 text-center rounded-lg bg-primary text-on-primary text-xs font-bold"
            >
              Reserve Slot
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

