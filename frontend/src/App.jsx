import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { ParkingProvider } from './context/ParkingContext.jsx';
import { BookingProvider } from './context/BookingContext.jsx';

// Layouts
import { CustomerLayout } from './layouts/CustomerLayout.jsx';
import { AdminLayout } from './layouts/AdminLayout.jsx';
import { ProtectedRoute } from './components/common/ProtectedRoute.jsx';

// Customer Pages
import { LandingPage } from './pages/customer/LandingPage.jsx';
import { LoginPage } from './pages/auth/LoginPage.jsx';
import { RegisterPage } from './pages/auth/RegisterPage.jsx';
import { CustomerDashboard } from './pages/customer/CustomerDashboard.jsx';
import { FindParking } from './pages/customer/FindParking.jsx';
import { SlotSelector } from './pages/customer/SlotSelector.jsx';
import { BookingReview } from './pages/customer/BookingReview.jsx';
import { BookingConfirmation } from './pages/customer/BookingConfirmation.jsx';
import { MyBookings } from './pages/customer/MyBookings.jsx';
import { Profile } from './pages/customer/Profile.jsx';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard.jsx';
import { ZoneManagement } from './pages/admin/ZoneManagement.jsx';
import { SlotManagement } from './pages/admin/SlotManagement.jsx';
import { ReservationRoster } from './pages/admin/ReservationRoster.jsx';
import { Analytics } from './pages/admin/Analytics.jsx';
import { AdminSettings } from './pages/admin/AdminSettings.jsx';

function NotFound() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
      <h1 className="text-4xl font-bold font-numeric-metric text-primary">404</h1>
      <h2 className="text-lg font-bold text-on-surface mt-2">Route Not Found</h2>
      <p className="text-xs text-secondary mt-1 max-w-sm">
        The requested parking portal page does not exist or has been relocated.
      </p>
      <Navigate to="/" replace />
    </div>
  );
}

export function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <ParkingProvider>
          <BookingProvider>
            <BrowserRouter>
              <Routes>
                {/* Customer Facing Routes with CustomerLayout */}
                <Route element={<CustomerLayout />}>
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/find-parking" element={<FindParking />} />
                  <Route path="/parking/:zoneId" element={<SlotSelector />} />
                  <Route path="/parking" element={<Navigate to="/parking/zone-a" replace />} />

                  {/* Customer Protected Routes */}
                  <Route
                    path="/dashboard"
                    element={
                      <ProtectedRoute>
                        <CustomerDashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/booking/review"
                    element={
                      <ProtectedRoute>
                        <BookingReview />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/booking/confirmation/:bookingId"
                    element={
                      <ProtectedRoute>
                        <BookingConfirmation />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/my-bookings"
                    element={
                      <ProtectedRoute>
                        <MyBookings />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/profile"
                    element={
                      <ProtectedRoute>
                        <Profile />
                      </ProtectedRoute>
                    }
                  />
                </Route>

                {/* Admin Operations Command Center Routes with AdminLayout */}
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute role="admin">
                      <AdminLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<Navigate to="/admin/dashboard" replace />} />
                  <Route path="dashboard" element={<AdminDashboard />} />
                  <Route path="zones" element={<ZoneManagement />} />
                  <Route path="slots" element={<SlotManagement />} />
                  <Route path="reservations" element={<ReservationRoster />} />
                  <Route path="analytics" element={<Analytics />} />
                  <Route path="settings" element={<AdminSettings />} />
                </Route>

                {/* Fallback */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </BookingProvider>
        </ParkingProvider>
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;

