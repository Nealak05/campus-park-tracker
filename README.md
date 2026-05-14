# Campus Park Tracker Prototype

Campus Park Tracker is a React prototype for a campus parking availability system.

## Project idea

The system helps drivers quickly see which campus parking lot or zone has free spaces. It reduces unnecessary circling inside the parking area and supports staff/admin operations such as event recording, manual correction, alerts, reporting, and risk controls.

## Implemented prototype features

- Driver dashboard with Lot A / Lot B zone availability
- Available / Near Full / Full status indicators
- Live alerts for near-full and full zones
- Gate QR check-in / check-out simulation
- Staff QR login simulation
- Staff event capture for backup/manual correction
- Audit log with accepted and rejected events
- Remove selected accidental event and correct occupancy
- Admin capacity and threshold configuration
- Basic usage report and CSV export
- Security & Risks section with mitigation controls

## Technologies used

- React
- JavaScript
- Vite
- Tailwind CSS via CDN
- Mock data and frontend state for prototype simulation

## How to run

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open the local URL shown in the terminal, usually:

```text
http://localhost:5173/
```

## Notes

This is a frontend prototype. It uses mock data in React state to simulate the backend/database logic.

In a full production version, the system would use:

- REST API backend
- PostgreSQL database
- Secure authentication and RBAC
- Real QR code or gate sensor integration
- HTTPS/TLS
- Parameterized queries
- Backups and monitoring
- Persistent event logs and reports
