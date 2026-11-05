import React, { createContext, useContext, useState } from 'react';

const BookingContext = createContext(null);

export function BookingProvider({ children }) {
  const today = new Date().toISOString().split('T')[0];

  const [searchParams, setSearchParams] = useState({
    zoneId: 'zone-a',
    date: today,
    startTime: '09:00',
    endTime: '13:00',
    vehicleType: 'standard', // 'standard' | 'ev' | 'accessible'
  });

  const [selectedSlot, setSelectedSlot] = useState(null);
  const [draftBooking, setDraftBooking] = useState(null);

  const updateSearchParams = (updates) => {
    setSearchParams(prev => ({ ...prev, ...updates }));
  };

  const clearSelection = () => {
    setSelectedSlot(null);
    setDraftBooking(null);
  };

  const value = {
    searchParams,
    updateSearchParams,
    selectedSlot,
    setSelectedSlot,
    draftBooking,
    setDraftBooking,
    clearSelection,
  };

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
}

export function useBooking() {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
}

