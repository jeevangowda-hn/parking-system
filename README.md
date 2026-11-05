<<<<<<< HEAD
# parking-system
=======
# PARKWISE — Cloud-Based Parking Slot Reservation System

[![React](https://img.shields.io/badge/React-18-blue.svg)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC.svg)](https://tailwindcss.com/)
[![AWS Amplify](https://img.shields.io/badge/AWS-Amplify_Hosting-FF9900.svg)](https://aws.amazon.com/amplify/hosting/)

**PARKWISE** is an architectural, cloud-ready parking bay reservation web application designed for high-density metropolitan facilities. It translates the original Google Stitch spatial design system into a responsive, fully interactive single-page application (SPA) deployable directly through AWS Amplify Hosting.

---

## 1. Project Overview & Features

- **Precision Slot Finder:** Search parking availability by facility zone, date, start time, end time, and vehicle specification (Standard Sedan, EV Charging, Accessible Priority).
- **Interactive Bay Blueprint:** Realistic spatial floor-plan canvas featuring live bay occupancy telemetry, multi-floor selectors, driveway lanes, and slot selection.
- **Reservation Simulation Engine:** Client-side time-window overlap detection preventing double bookings:
  $$\text{Overlap} \iff (\text{existingStart} < \text{requestedEnd}) \land (\text{existingEnd} > \text{requestedStart})$$
- **Digital Pass & Review:** Contactless optical QR pass, itemized payment receipt calculation, walking route schematic, and Apple/Google Wallet integration stubs.
- **My Bookings & Pass Management:** Filter upcoming, active, completed, and cancelled reservations with cancellation workflow and persistence.
- **Admin Operations Command Center:** High-density operations dashboard with live KPI metric cards, capacity breakdown donut chart, hourly demand velocity curve, live reservation roster, event telemetry feed, zone management, and slot status controls.

---

## 2. Technology Stack

- **Frontend Framework:** React 18 with Vite 5 (Fast ESM development & optimized Rollup production builds)
- **Routing:** React Router DOM v6
- **Styling:** Tailwind CSS v3 (installed locally via npm, zero CDN dependencies), CSS variables for design tokens
- **Typography:** Manrope (Headings & metrics), Inter (Body & UI labels)
- **Icons:** Lucide React (Tree-shakeable SVG icons)
- **Charts:** Recharts (Interactive Donut and Bar charts)
- **State Management:** React Context API (`AuthContext`, `BookingContext`, `ParkingContext`, `ToastContext`)
- **Data Persistence:** Browser `localStorage` (`parkwise:app-state` v1.1) and `sessionStorage`
- **Hosting & CI/CD:** AWS Amplify Hosting (`amplify.yml`)

---

## 3. Project Directory Structure

```
cc project/
├── amplify.yml                       # AWS Amplify build & deployment configuration
├── AMPLIFY_DEPLOYMENT.md             # Detailed Amplify setup & SPA rewrite guide
├── README.md                         # Comprehensive project documentation
├── .gitignore                        # Git ignore rules
├── stitch_parkwise_smart_parking_platform/ # Original Google Stitch design exports
└── frontend/                         # Application root
    ├── index.html                    # Root HTML with Google Fonts
    ├── package.json                  # Dependencies & scripts
    ├── vite.config.js                # Vite build config with path aliases
    ├── tailwind.config.js            # Custom design tokens & colors
    ├── postcss.config.js             # PostCSS Tailwind & Autoprefixer
    ├── public/
    │   └── favicon.svg               # PARKWISE brand icon
    └── src/
        ├── App.jsx                   # Route table & providers
        ├── main.jsx                  # React entrypoint
        ├── styles/
        │   ├── tokens.css            # CSS custom properties
        │   └── global.css            # Global resets, blueprints, and animations
        ├── data/
        │   ├── demoUsers.js          # Demo customer & admin accounts
        │   ├── demoZones.js          # 4 facility zones (A, B, C, D)
        │   ├── demoSlots.js          # Pre-configured bay slot definitions
        │   └── demoBookings.js       # Pre-seeded reservation records
        ├── services/
        │   ├── storageService.js     # Centralized localStorage manager
        │   ├── mockAuthService.js    # Session-based authentication
        │   ├── parkingService.js     # Live zone and slot telemetry
        │   ├── bookingService.js     # Overlap checking & booking lifecycle
        │   └── adminService.js       # Dashboard KPI calculations & overrides
        ├── context/
        │   ├── AuthContext.jsx       # User identity & roles
        │   ├── BookingContext.jsx    # Selected slot, time, draft pass
        │   ├── ParkingContext.jsx    # Zone telemetry state
        │   └── ToastContext.jsx      # Notifications queue
        ├── components/
        │   ├── common/               # Button, Input, Modal, Badge, Card, etc.
        │   ├── navigation/           # CustomerNav, AdminSidebar, AdminTopBar, Footer
        │   ├── parking/              # ParkingSlot, DrivewayLane, SlotLegend, ZoneCard
        │   ├── forms/                # SearchForm console
        │   └── charts/               # OccupancyDonut, HourlyBarChart, ZoneBarChart
        └── pages/
            ├── auth/                 # LoginPage, RegisterPage
            ├── customer/             # LandingPage, Dashboard, FindParking, SlotSelector,
            │                         # BookingReview, BookingConfirmation, MyBookings, Profile
            └── admin/                # AdminDashboard, ZoneManagement, SlotManagement,
                                      # ReservationRoster, Analytics, AdminSettings
```

---

## 4. Demonstration Login Credentials

The application includes two pre-configured demonstration accounts:

| Role | Email Address | Password | Landing Experience |
|---|---|---|---|
| **Customer** | `customer@parkwise.demo` | `Parkwise123!` | Customer Dashboard (`/dashboard`) |
| **Administrator** | `admin@parkwise.demo` | `Parkwise123!` | Command Center (`/admin/dashboard`) |

> **Security Note:** This authentication is purely a browser-based UI demonstration. Password checks and role gating run client-side. No sensitive credentials are transmitted or stored insecurely.

---

## 5. User Journeys

### Customer Journey:
1. **Landing Page (`/`):** View real-time available bays count, inspect how the platform operates, and configure search criteria.
2. **Find Parking (`/find-parking`):** Compare the 4 facility zones (Ground Floor, Level 1, Rooftop, EV Hub) with occupancy rates and amenities.
3. **Interactive Slot Blueprint (`/parking/:zoneId`):** Click on any available bay (e.g., Bay A-14) on the architectural schematic. The reservation drawer reflects real-time rate calculations and initiates an instant checkout hold.
4. **Booking Review (`/booking/review`):** Inspect the digital boarding pass, QR code block, vehicle assignments, itemized receipt, and walking route to concourse elevators.
5. **Confirmation (`/booking/confirmation/:id`):** Lock in the reservation pass with an animated guarantee badge and printable pass.
6. **My Bookings (`/my-bookings`):** View active, scheduled, completed, and cancelled reservations. Cancel eligible bookings to release the spot back to the pool.

### Administrator Journey:
1. **Command Center (`/admin/dashboard`):** Monitor 4 primary KPI metrics, capacity donut chart, hourly demand curve, active roster, and facility event feed.
2. **Zone Management (`/admin/zones`):** Add or edit zones, update hourly tariff rates, and inspect sensor connectivity.
3. **Bay Slot Controls (`/admin/slots`):** Filter slots by zone and operational status. Override any slot to `Available`, `Occupied`, `Reserved`, or `Maintenance Hold`.
4. **Reservation Roster (`/admin/reservations`):** Search, filter, and export all customer bookings as a downloadable CSV.
5. **Hourly Analytics (`/admin/analytics`):** Analyze peak demand windows, average stay duration, and EV power delivery statistics.
6. **Facility Settings (`/admin/settings`):** Inspect IoT LoRaWAN gateway node status or trigger a 2-step **Reset Demo Data** action.

---

## 6. Local Installation & Development

### Prerequisites:
- Node.js 18.x or 20.x
- npm 9.x or later

### Installation:
```bash
# Navigate to the frontend directory
cd frontend

# Install dependencies cleanly
npm install

# Start local Vite development server
npm run dev
```

Visit `http://localhost:5173` in your browser.

### Production Build:
```bash
# In frontend/
npm run build
```
The optimized production bundle will be generated under `frontend/dist/`.

---

## 7. AWS Amplify Hosting Deployment

This repository is configured out-of-the-box for **AWS Amplify Hosting** via `amplify.yml`:

```yaml
version: 1
applications:
  - appRoot: frontend
    frontend:
      phases:
        preBuild:
          commands:
            - npm ci
        build:
          commands:
            - npm run build
      artifacts:
        baseDirectory: dist
        files:
          - '**/*'
      cache:
        paths:
          - node_modules/**/*
```

### Critical Single Page Application (SPA) Rewrite Rule:
In the AWS Amplify Console under **Hosting > Rewrites and redirects**, ensure the following rewrite rule is configured to support client-side routing:

| Source Address | Target Address | Type |
|---|---|---|
| `</^[^.]+$|\.(?!(css|gif|ico|jpg|js|png|txt|svg|woff|woff2|ttf|map|json)$)([^.]+$)/>` | `/index.html` | `200 (Rewrite)` |

For full deployment instructions, see [AMPLIFY_DEPLOYMENT.md](./AMPLIFY_DEPLOYMENT.md).

---

## 8. Frontend-Only Architecture & Limitations

1. **Storage Isolation:** All reservations, profile changes, and administrative overrides are saved inside the browser's `localStorage` (`parkwise:app-state`). Data is isolated to each user's individual browser session.
2. **No Multi-User Concurrency:** Because there is no central database or WebSocket cluster, two different browsers will operate with their own isolated local demonstration states.
3. **Simulated Telemetry:** Sensor heartbeats, LoRaWAN latency metrics, and gate logs are generated locally to demonstrate real-world mobility software capabilities without physical IoT hardware.
4. **Service Layer Architecture:** All business logic is encapsulated in Promise-based services (`parkingService.js`, `bookingService.js`, `adminService.js`). These interfaces can be replaced with actual REST/GraphQL API clients in a future phase without rewriting any UI components.

>>>>>>> d57a05d (Initial commit: PARKWISE smart parking reservation platform)
