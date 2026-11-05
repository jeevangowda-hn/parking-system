import React from 'react';

export function Footer() {
  return (
    <footer className="w-full mt-auto bg-surface border-t border-outline-variant/60 no-print">
      <div className="w-full max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <span className="font-headline-sm text-sm font-bold text-primary">PARKWISE</span>
          <span className="text-outline-variant">|</span>
          <span className="text-xs text-secondary">
            © 2025 PARKWISE Mobility Systems Inc. All rights reserved.
          </span>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-secondary">
          <button onClick={() => alert('API: Standard REST & Webhook endpoints enabled in enterprise tier.')} className="hover:text-primary transition-colors">
            Bay Blueprint API
          </button>
          <button onClick={() => alert('SLA: 99.98% uptime telemetry guarantee for hardware nodes.')} className="hover:text-primary transition-colors">
            Enterprise SLA
          </button>
          <button onClick={() => alert('Terms: Max stay 24h per standard reservation unless extended.')} className="hover:text-primary transition-colors">
            Facility Terms
          </button>
          <button onClick={() => alert('Privacy: No sensitive credentials or location traces sold or tracked.')} className="hover:text-primary transition-colors">
            Privacy Policy
          </button>
          <button onClick={() => alert('Compliance: SOC2 Type II and ISO 27001 audited operations.')} className="hover:text-primary transition-colors">
            Security Compliance
          </button>
          <button onClick={() => alert('Dispatch: Emergency phone +1 (800) 555-PARK')} className="hover:text-primary transition-colors">
            Dispatch Contact
          </button>
        </div>
      </div>
    </footer>
  );
}

