import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { User, Mail, Car, Shield, LogOut, CheckCircle2 } from 'lucide-react';
import { Button } from '../../components/common/Button.jsx';
import { Input } from '../../components/common/Input.jsx';

export function Profile() {
  const { user, updateProfile, logout } = useAuth();
  const { success, error } = useToast();

  const [name, setName] = useState(user?.name || '');
  const [vehicleMake, setVehicleMake] = useState(user?.vehicle?.make || 'Tesla');
  const [vehicleModel, setVehicleModel] = useState(user?.vehicle?.model || 'Model 3');
  const [vehiclePlate, setVehiclePlate] = useState(user?.vehicle?.plate || 'CA 7XYZ89');
  const [vehicleType, setVehicleType] = useState(user?.vehicle?.type || 'EV');
  const [loading, setLoading] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await updateProfile({
        name,
        vehicle: {
          make: vehicleMake,
          model: vehicleModel,
          plate: vehiclePlate,
          type: vehicleType,
        },
      });
      success('Profile and vehicle telemetry updated successfully');
    } catch (err) {
      error(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 md:py-12 space-y-6">
      <div className="border-b border-outline-variant/60 pb-5">
        <h1 className="font-headline-xl text-2xl sm:text-3xl font-bold text-on-surface">
          User Account & Vehicle Settings
        </h1>
        <p className="text-xs sm:text-sm text-secondary mt-1">
          Manage your motorist profile credentials, registered license plates, and RFID gate preferences.
        </p>
      </div>

      <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl shadow-sm p-6 sm:p-8 space-y-6">
        {/* Profile Card Header */}
        <div className="flex items-center gap-4 pb-6 border-b border-surface-container">
          <div className="w-16 h-16 rounded-full bg-secondary-container text-on-secondary-container font-bold text-xl flex items-center justify-center border border-outline-variant">
            {user?.avatar || 'AC'}
          </div>
          <div>
            <h2 className="text-lg font-bold text-on-surface">{user?.name}</h2>
            <p className="text-xs text-secondary">{user?.email}</p>
            <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold bg-[#ECFDF5] text-primary">
              {user?.role?.toUpperCase()} DEMO ACCOUNT
            </span>
          </div>
        </div>

        {/* Edit Form */}
        <form onSubmit={handleSave} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              icon={User}
              required
            />
            <Input
              label="Email Address (Demo Account)"
              value={user?.email || ''}
              disabled
              icon={Mail}
              helperText="Demo accounts have fixed emails"
            />
          </div>

          <div className="pt-2">
            <h3 className="text-xs font-bold text-on-surface uppercase tracking-wider mb-3">
              Registered Primary Vehicle
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Input
                label="Make"
                value={vehicleMake}
                onChange={(e) => setVehicleMake(e.target.value)}
                placeholder="e.g. Tesla"
                required
              />
              <Input
                label="Model"
                value={vehicleModel}
                onChange={(e) => setVehicleModel(e.target.value)}
                placeholder="e.g. Model 3"
                required
              />
              <Input
                label="License Plate"
                value={vehiclePlate}
                onChange={(e) => setVehiclePlate(e.target.value)}
                placeholder="e.g. CA 7XYZ89"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-secondary mb-1">
              Vehicle Powertrain Specification
            </label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setVehicleType('EV')}
                className={`flex-1 py-2 rounded-lg border text-xs font-bold transition-colors ${
                  vehicleType === 'EV'
                    ? 'border-primary bg-primary-fixed/30 text-primary'
                    : 'border-outline-variant bg-surface-container-lowest text-secondary'
                }`}
              >
                Electric Vehicle (EV)
              </button>
              <button
                type="button"
                onClick={() => setVehicleType('Standard')}
                className={`flex-1 py-2 rounded-lg border text-xs font-bold transition-colors ${
                  vehicleType === 'Standard'
                    ? 'border-primary bg-primary-fixed/30 text-primary'
                    : 'border-outline-variant bg-surface-container-lowest text-secondary'
                }`}
              >
                Internal Combustion (Standard)
              </button>
            </div>
          </div>

          <div className="pt-4 flex items-center justify-between border-t border-surface-container">
            <button
              type="button"
              onClick={logout}
              className="text-xs text-error font-semibold hover:underline flex items-center gap-1"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>

            <Button type="submit" loading={loading}>
              Save Profile Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

