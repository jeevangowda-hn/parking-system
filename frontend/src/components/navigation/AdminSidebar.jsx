import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import {
  LayoutDashboard,
  Map,
  Layers,
  TableProperties,
  BarChart3,
  SlidersHorizontal,
  Lock,
  History,
  User,
  LogOut,
  ParkingSquare,
  Radio,
} from 'lucide-react';

export function AdminSidebar({ isMobileOpen, onCloseMobile }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navClass = ({ isActive }) =>
    isActive
      ? 'flex items-center gap-3 bg-surface-variant/40 text-inverse-primary font-semibold border-l-4 border-inverse-primary pl-3 py-2.5 rounded-r transition-colors text-xs'
      : 'flex items-center gap-3 text-outline-variant hover:text-inverse-on-surface hover:bg-surface-variant/20 pl-4 py-2.5 rounded transition-colors text-xs';

  return (
    <>
      {/* Mobile backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`fixed left-0 top-0 h-screen w-72 bg-inverse-surface text-inverse-on-surface flex flex-col justify-between p-4 z-50 border-r border-outline/30 overflow-y-auto transition-transform duration-200 lg:translate-x-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand / Hub Header */}
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-3 px-2 pt-2">
            <div className="w-10 h-10 rounded-lg bg-primary-container flex items-center justify-center text-on-primary-container font-headline-md font-bold shadow-sm">
              <span>P</span>
            </div>
            <div className="flex flex-col">
              <span className="font-headline-md text-sm font-bold tracking-wider text-inverse-on-surface">
                PARKWISE Central
              </span>
              <span className="text-[11px] text-outline-variant">Facility Operations Hub</span>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex flex-col gap-1 mt-2">
            <NavLink to="/admin/dashboard" className={navClass} onClick={onCloseMobile}>
              <LayoutDashboard className="w-4 h-4 shrink-0" />
              <span>Command Center</span>
            </NavLink>

            <NavLink to="/parking/zone-a" className={navClass} onClick={onCloseMobile}>
              <Map className="w-4 h-4 shrink-0" />
              <span>Live Bay Blueprint</span>
            </NavLink>

            <NavLink to="/admin/zones" className={navClass} onClick={onCloseMobile}>
              <Layers className="w-4 h-4 shrink-0" />
              <span>Zones Management</span>
            </NavLink>

            <NavLink to="/admin/slots" className={navClass} onClick={onCloseMobile}>
              <ParkingSquare className="w-4 h-4 shrink-0" />
              <span>Bay Slot Controls</span>
            </NavLink>

            <NavLink to="/admin/reservations" className={navClass} onClick={onCloseMobile}>
              <TableProperties className="w-4 h-4 shrink-0" />
              <span>Reservation Roster</span>
            </NavLink>

            <NavLink to="/admin/analytics" className={navClass} onClick={onCloseMobile}>
              <BarChart3 className="w-4 h-4 shrink-0" />
              <span>Hourly Analytics</span>
            </NavLink>

            <NavLink to="/admin/settings" className={navClass} onClick={onCloseMobile}>
              <SlidersHorizontal className="w-4 h-4 shrink-0" />
              <span>Facility Settings</span>
            </NavLink>
          </nav>
        </div>

        {/* Bottom Sidebar Section & Controls */}
        <div className="flex flex-col gap-3 pt-4 border-t border-outline/30 mt-6">
          {/* Emergency Bay Lock CTA */}
          <button
            onClick={() => alert('EMERGENCY LOCK INITIATED: Automated barriers armed in lock mode. Manual clearance override required.')}
            className="w-full flex items-center justify-center gap-2 bg-error-container text-on-error-container text-xs font-semibold py-2.5 px-3 rounded-lg hover:brightness-95 active:scale-95 transition-all shadow-sm"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Emergency Bay Lock</span>
          </button>

          {/* System Health Indicator */}
          <div className="flex items-center gap-2 px-2.5 py-1.5 rounded bg-surface-variant/20 border border-outline/20">
            <div className="w-2 h-2 rounded-full bg-primary-fixed animate-pulse shrink-0"></div>
            <span className="text-[11px] text-outline-variant font-medium">
              Telemetry Active • 99.98% SLA
            </span>
          </div>

          {/* Footer Nav Utility Tabs */}
          <div className="flex flex-col gap-0.5">
            <Link
              to="/dashboard"
              className="flex items-center gap-2.5 text-outline-variant hover:text-inverse-on-surface px-2 py-1.5 rounded text-xs transition-colors"
            >
              <Radio className="w-3.5 h-3.5" />
              <span>Customer View</span>
            </Link>
            <button
              onClick={() => alert('Telemetry Audit Trail: 14,892 verified gate transactions logged today.')}
              className="flex items-center gap-2.5 text-outline-variant hover:text-inverse-on-surface px-2 py-1.5 rounded text-xs transition-colors text-left"
            >
              <History className="w-3.5 h-3.5" />
              <span>Audit Trail</span>
            </button>
          </div>

          {/* User Profile Card */}
          <div className="flex items-center justify-between px-2.5 py-2 mt-1 rounded-lg bg-surface-variant/20 border border-outline/20">
            <div className="flex items-center gap-2.5 truncate">
              <div className="w-8 h-8 rounded-full bg-tertiary-container flex items-center justify-center text-on-tertiary-container font-bold text-xs uppercase tracking-wider shrink-0">
                {user?.avatar || 'AM'}
              </div>
              <div className="flex flex-col truncate">
                <span className="text-xs font-bold text-inverse-on-surface truncate">
                  {user?.name || 'Alex Mercer'}
                </span>
                <span className="text-[10px] text-outline-variant truncate">
                  {user?.title || 'Operations Director'}
                </span>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="text-outline-variant hover:text-error p-1 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

