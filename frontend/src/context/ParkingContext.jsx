import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { parkingService } from '../services/parkingService.js';

const ParkingContext = createContext(null);

export function ParkingProvider({ children }) {
  const [zones, setZones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refreshZones = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await parkingService.getZones();
      setZones(data);
    } catch (err) {
      setError(err.message || 'Failed to load parking zones');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshZones();
  }, [refreshZones]);

  const value = {
    zones,
    loading,
    error,
    refreshZones,
  };

  return <ParkingContext.Provider value={value}>{children}</ParkingContext.Provider>;
}

export function useParking() {
  const context = useContext(ParkingContext);
  if (!context) {
    throw new Error('useParking must be used within a ParkingProvider');
  }
  return context;
}

