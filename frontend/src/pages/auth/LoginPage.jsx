import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { Mail, Lock, Eye, EyeOff, ShieldCheck, User } from 'lucide-react';
import { Button } from '../../components/common/Button.jsx';
import { Input } from '../../components/common/Input.jsx';

export function LoginPage() {
  const { login } = useAuth();
  const { success, error } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    if (!email || !password) {
      setErrorMessage('Please enter both email and password.');
      return;
    }

    try {
      setLoading(true);
      const user = await login(email, password);
      success(`Welcome back, ${user.name}!`);
      if (user.role === 'admin') {
        navigate('/admin/dashboard', { replace: true });
      } else {
        navigate(from === '/login' ? '/dashboard' : from, { replace: true });
      }
    } catch (err) {
      setErrorMessage(err.message || 'Login failed. Check your credentials.');
      error(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoAccount = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setErrorMessage('');
  };

  return (
    <div className="flex-1 flex items-center justify-center p-4 sm:p-6 py-12">
      <div className="w-full max-w-md bg-surface-container-lowest border border-outline-variant rounded-2xl shadow-lg p-6 sm:p-8 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center text-on-primary font-bold text-xl mx-auto shadow-sm">
            P
          </div>
          <h1 className="font-headline-lg text-2xl font-bold text-on-surface">
            Sign In to PARKWISE
          </h1>
          <p className="text-xs text-secondary">
            Access your reservation passes, vehicle telemetry, and live bays.
          </p>
        </div>

        {/* Demo Quick-Fill Callout */}
        <div className="p-3 rounded-lg bg-surface-container-low border border-outline-variant/60 space-y-2 text-xs">
          <div className="flex items-center gap-1.5 font-bold text-on-surface">
            <ShieldCheck className="w-4 h-4 text-primary" />
            <span>Demonstration Accounts</span>
          </div>
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              type="button"
              onClick={() => fillDemoAccount('customer@parkwise.demo', 'Parkwise123!')}
              className="py-1.5 px-2 rounded border border-outline-variant hover:border-primary bg-surface-container-lowest text-left text-[11px] transition-colors"
            >
              <span className="font-bold block text-primary">Customer Demo</span>
              <span className="text-secondary">customer@parkwise.demo</span>
            </button>
            <button
              type="button"
              onClick={() => fillDemoAccount('admin@parkwise.demo', 'Parkwise123!')}
              className="py-1.5 px-2 rounded border border-outline-variant hover:border-primary bg-surface-container-lowest text-left text-[11px] transition-colors"
            >
              <span className="font-bold block text-secondary">Admin Demo</span>
              <span className="text-secondary">admin@parkwise.demo</span>
            </button>
          </div>
          <p className="text-[10px] text-outline text-center">
            Password: <code className="bg-surface-container px-1 py-0.5 rounded font-mono">Parkwise123!</code>
          </p>
        </div>

        {errorMessage && (
          <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-error text-xs font-medium">
            {errorMessage}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="e.g. customer@parkwise.demo"
            icon={Mail}
            required
          />

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-secondary">Password</label>
              <button
                type="button"
                onClick={() => alert('Password reset: Use Parkwise123! to login to demo accounts.')}
                className="text-[11px] text-primary hover:underline"
              >
                Forgot password?
              </button>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-tertiary">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                required
                className="w-full pl-9 pr-10 py-2 bg-surface-container-lowest border border-outline-variant rounded-lg text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-tertiary hover:text-on-surface"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <Button type="submit" loading={loading} className="w-full py-2.5">
            Sign In
          </Button>
        </form>

        {/* Footer */}
        <div className="text-center text-xs text-secondary pt-2">
          Don't have an account yet?{' '}
          <Link to="/register" className="font-bold text-primary hover:underline">
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
}

