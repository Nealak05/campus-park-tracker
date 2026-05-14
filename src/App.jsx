import React, { useMemo, useState } from "react";

const initialZones = [
  {
    id: "A1",
    lot: "Lot A",
    name: "Zone A1",
    capacity: 50,
    occupied: 42,
    nearFull: 10,
    location: "Main entrance",
  },
  {
    id: "A2",
    lot: "Lot A",
    name: "Zone A2",
    capacity: 40,
    occupied: 31,
    nearFull: 8,
    location: "Library side",
  },
  {
    id: "B1",
    lot: "Lot B",
    name: "Zone B1",
    capacity: 35,
    occupied: 35,
    nearFull: 7,
    location: "Sports hall",
  },
  {
    id: "B2",
    lot: "Lot B",
    name: "Zone B2",
    capacity: 45,
    occupied: 20,
    nearFull: 9,
    location: "Science building",
  },
];

function getZoneState(zone) {
  const spotsLeft = zone.capacity - zone.occupied;

  if (spotsLeft <= 0) {
    return {
      label: "FULL",
      spotsLeft,
      tone: "bg-rose-50 text-rose-700 border-rose-200",
      bar: "bg-rose-500",
    };
  }

  if (spotsLeft <= zone.nearFull) {
    return {
      label: "NEAR FULL",
      spotsLeft,
      tone: "bg-amber-50 text-amber-700 border-amber-200",
      bar: "bg-amber-500",
    };
  }

  return {
    label: "AVAILABLE",
    spotsLeft,
    tone: "bg-emerald-50 text-emerald-700 border-emerald-200",
    bar: "bg-emerald-500",
  };
}

function nowTime() {
  return new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

function StatCard({ label, value, helper }) {
  return (
    <div className="rounded-2xl border bg-white p-4 shadow-sm">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-1 text-2xl font-bold text-slate-900">{value}</p>
      {helper && <p className="mt-1 text-xs text-slate-500">{helper}</p>}
    </div>
  );
}

function FakeQrCode() {
  const cells = [
    1, 1, 1, 0, 1, 0, 1, 1,
    1, 0, 1, 0, 0, 1, 0, 1,
    1, 1, 1, 1, 0, 1, 1, 1,
    0, 0, 1, 0, 1, 0, 0, 1,
    1, 0, 0, 1, 1, 1, 0, 0,
    0, 1, 1, 0, 0, 1, 1, 0,
    1, 0, 1, 1, 0, 0, 1, 1,
    1, 1, 0, 0, 1, 1, 0, 1,
  ];

  return (
    <div className="grid h-36 w-36 grid-cols-8 gap-1 rounded-2xl bg-white p-3 shadow-inner">
      {cells.map((cell, index) => (
        <span
          key={index}
          className={`rounded-sm ${cell ? "bg-slate-950" : "bg-slate-100"}`}
        />
      ))}
    </div>
  );
}

function LoginPanel({ role, onLogin, onBack }) {
  const isAdmin = role === "Administrator";

  return (
    <section className="mt-6 grid gap-6 lg:grid-cols-[420px_1fr]">
      <div className="rounded-3xl border bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-black">
          {isAdmin ? "Admin login" : "Staff QR login"}
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          {isAdmin
            ? "Admin functions are protected with role-based access control in this prototype."
            : "Security staff can authenticate by scanning a staff QR badge before using manual event capture."}
        </p>

        <div className="mt-6 flex flex-col items-center rounded-3xl bg-slate-50 p-6 text-center">
          <FakeQrCode />
          <p className="mt-4 text-sm font-semibold text-slate-700">
            {isAdmin ? "ADMIN-DEMO-QR" : "STAFF-DEMO-QR"}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Prototype QR code simulation
          </p>
        </div>

        <button
          onClick={() => onLogin(role)}
          className="mt-6 w-full rounded-xl bg-slate-950 px-4 py-3 font-bold text-white hover:bg-slate-800"
        >
          {isAdmin ? "Login as Administrator" : "Scan QR and login as Staff"}
        </button>

        <button
          onClick={onBack}
          className="mt-3 w-full rounded-xl border px-4 py-3 font-bold text-slate-700 hover:bg-slate-50"
        >
          Back to Driver Dashboard
        </button>
      </div>

      <div className="rounded-3xl border bg-white p-6 shadow-sm">
        <h3 className="text-xl font-black">Role-based access</h3>

        <div className="mt-4 space-y-3 text-sm text-slate-700">
          <p className="rounded-2xl bg-emerald-50 p-4 text-emerald-800">
            Driver: public access, can view parking availability without login.
          </p>
          <p className="rounded-2xl bg-blue-50 p-4 text-blue-800">
            Security Staff: QR login is required before manual entry/exit correction.
          </p>
          <p className="rounded-2xl bg-violet-50 p-4 text-violet-800">
            Administrator: login is required before editing capacity, thresholds, and reports.
          </p>
        </div>
      </div>
    </section>
  );
}

function ZoneCard({ zone, onViewDetails }) {
  const state = getZoneState(zone);
  const usedPercent = Math.round((zone.occupied / zone.capacity) * 100);

  return (
    <article className="rounded-2xl border bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            {zone.lot}
          </p>
          <h3 className="text-xl font-bold text-slate-950">{zone.name}</h3>
          <p className="text-sm text-slate-500">{zone.location}</p>
        </div>

        <span
          className={`rounded-full border px-3 py-1 text-xs font-bold ${state.tone}`}
        >
          {state.label}
        </span>
      </div>

      <div className="mt-5 grid grid-cols-3 gap-3 text-center">
        <div className="rounded-xl bg-slate-50 p-3">
          <p className="text-xs text-slate-500">Free</p>
          <p className="text-lg font-bold text-slate-900">
            {state.spotsLeft}
          </p>
        </div>

        <div className="rounded-xl bg-slate-50 p-3">
          <p className="text-xs text-slate-500">Occupied</p>
          <p className="text-lg font-bold text-slate-900">{zone.occupied}</p>
        </div>

        <div className="rounded-xl bg-slate-50 p-3">
          <p className="text-xs text-slate-500">Capacity</p>
          <p className="text-lg font-bold text-slate-900">{zone.capacity}</p>
        </div>
      </div>

      <div className="mt-4">
        <div className="mb-2 flex justify-between text-xs text-slate-500">
          <span>Occupancy</span>
          <span>{usedPercent}%</span>
        </div>

        <div className="h-2 overflow-hidden rounded-full bg-slate-100">
          <div
            className={`h-full rounded-full ${state.bar}`}
            style={{ width: `${usedPercent}%` }}
          />
        </div>
      </div>

      <button
        onClick={() => onViewDetails(zone.id)}
        className="mt-5 w-full rounded-xl border px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
      >
        View zone details
      </button>
    </article>
  );
}

function ControlCard({ title, description }) {
  return (
    <div className="rounded-2xl border bg-white p-5 shadow-sm">
      <h4 className="font-black text-slate-900">{title}</h4>
      <p className="mt-2 text-sm text-slate-600">{description}</p>
    </div>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState("driver");
  const [role, setRole] = useState("Driver");
  const [authenticatedRole, setAuthenticatedRole] = useState("Driver");
  const [zones, setZones] = useState(initialZones);

  const [events, setEvents] = useState([
    {
      id: 1,
      zoneId: "A1",
      type: "entry",
      source: "QR scan",
      time: "08:45:12",
      result: "accepted",
    },
    {
      id: 2,
      zoneId: "A2",
      type: "exit",
      source: "Manual",
      time: "09:03:27",
      result: "accepted",
    },
    {
      id: 3,
      zoneId: "B1",
      type: "entry",
      source: "QR scan",
      time: "09:18:41",
      result: "rejected: zone full",
    },
  ]);

  const [message, setMessage] = useState(
    "Driver view is public. Select Security Staff or Administrator to see the protected access flow."
  );

  const [lastUpdate, setLastUpdate] = useState(nowTime());
  const [query, setQuery] = useState("");
  const [selectedZone, setSelectedZone] = useState("A1");
  const [eventType, setEventType] = useState("entry");
  const [source, setSource] = useState("QR scan");
  const [adminZone, setAdminZone] = useState("A1");
  const [selectedDetailZone, setSelectedDetailZone] = useState("A1");
  const [driverScanType, setDriverScanType] = useState("entry");
  const [lastScanKey, setLastScanKey] = useState("");
  const [selectedEventId, setSelectedEventId] = useState("");

  const totals = useMemo(() => {
    const capacity = zones.reduce((sum, zone) => sum + zone.capacity, 0);
    const occupied = zones.reduce((sum, zone) => sum + zone.occupied, 0);
    const free = capacity - occupied;
    const fullZones = zones.filter(
      (zone) => getZoneState(zone).label === "FULL"
    ).length;
    const nearFullZones = zones.filter(
      (zone) => getZoneState(zone).label === "NEAR FULL"
    ).length;

    return { capacity, occupied, free, fullZones, nearFullZones };
  }, [zones]);

  const filteredZones = zones.filter((zone) => {
    const search = `${zone.lot} ${zone.name} ${zone.location}`.toLowerCase();
    return search.includes(query.toLowerCase());
  });

  const alerts = zones
    .map((zone) => ({ ...zone, state: getZoneState(zone) }))
    .filter(
      (zone) => zone.state.label === "FULL" || zone.state.label === "NEAR FULL"
    );

  const tabs = [
    { id: "driver", label: "Driver Dashboard" },
    { id: "staff", label: "Staff Event Capture" },
    { id: "admin", label: "Admin Panel" },
    { id: "reports", label: "Reports & Logs" },
    { id: "security", label: "Security & Risks" },
  ];

  const currentAdminZone =
    zones.find((zone) => zone.id === adminZone) || zones[0];

  const currentDetailZone =
    zones.find((zone) => zone.id === selectedDetailZone) || zones[0];

  const detailState = getZoneState(currentDetailZone);

  function handleRoleChange(nextRole) {
    setRole(nextRole);

    if (nextRole === "Driver") {
      setAuthenticatedRole("Driver");
      setActiveTab("driver");
      setMessage("Driver selected: public dashboard is open without login.");
      return;
    }

    if (nextRole === "Security Staff") {
      setActiveTab("login");
      setMessage(
        "Security Staff selected: scan the demo QR badge to access event capture."
      );
      return;
    }

    setActiveTab("login");
    setMessage(
      "Administrator selected: login is required before configuration and reports are available."
    );
  }

  function loginAs(loginRole) {
    setAuthenticatedRole(loginRole);

    if (loginRole === "Security Staff") {
      setActiveTab("staff");
      setMessage("QR login successful. Staff Event Capture is now unlocked.");
    } else {
      setActiveTab("admin");
      setMessage("Admin login successful. Configuration is now unlocked.");
    }
  }

  function logout() {
    setRole("Driver");
    setAuthenticatedRole("Driver");
    setActiveTab("driver");
    setMessage("Logged out. Returned to public Driver Dashboard.");
  }

  function openRestrictedTab(tabId) {
    if (tabId === "driver" || tabId === "security") {
      setActiveTab(tabId);
      return;
    }

    if (
      tabId === "staff" &&
      authenticatedRole !== "Security Staff" &&
      authenticatedRole !== "Administrator"
    ) {
      setRole("Security Staff");
      setActiveTab("login");
      setMessage("Please scan the staff QR code before recording manual events.");
      return;
    }

    if (
      (tabId === "admin" || tabId === "reports") &&
      authenticatedRole !== "Administrator"
    ) {
      setRole("Administrator");
      setActiveTab("login");
      setMessage("Admin login is required before opening this section.");
      return;
    }

    setActiveTab(tabId);
  }

  function applyParkingEvent(zoneId, type, eventSource) {
    const zone = zones.find((item) => item.id === zoneId);

    if (!zone) {
      setMessage("Error: selected zone does not exist.");
      return;
    }

    const scanKey = `${zoneId}-${type}-${eventSource}`;

    if (scanKey === lastScanKey) {
      const time = nowTime();

      setEvents((prev) => [
        {
          id: Date.now(),
          zoneId,
          type,
          source: eventSource,
          time,
          result: "rejected: duplicate scan",
        },
        ...prev,
      ]);

      setMessage(
        "Duplicate scan detected and rejected. This protects availability data from repeated/fake events."
      );
      setLastUpdate(time);
      return;
    }

    const nextOccupied =
      type === "entry" ? zone.occupied + 1 : zone.occupied - 1;

    const isValid = nextOccupied >= 0 && nextOccupied <= zone.capacity;
    const time = nowTime();

    setEvents((prev) => [
      {
        id: Date.now(),
        zoneId,
        type,
        source: eventSource,
        time,
        result: isValid
          ? "accepted"
          : type === "entry"
          ? "rejected: zone full"
          : "rejected: already empty",
      },
      ...prev,
    ]);

    if (!isValid) {
      setMessage(
        type === "entry"
          ? `Event rejected: ${zone.name} is already full.`
          : `Event rejected: ${zone.name} is already empty.`
      );
      setLastUpdate(time);
      setLastScanKey(scanKey);
      return;
    }

    setZones((prev) =>
      prev.map((item) =>
        item.id === zoneId ? { ...item, occupied: nextOccupied } : item
      )
    );

    const updated = { ...zone, occupied: nextOccupied };
    const status = getZoneState(updated).label;

    setMessage(
      `Event accepted: ${type.toUpperCase()} recorded for ${
        zone.name
      }. Source: ${eventSource}. New status: ${status}.`
    );

    setLastUpdate(time);
    setLastScanKey(scanKey);
  }

  function recordStaffEvent(zoneId, type, eventSource = source) {
    if (
      authenticatedRole !== "Security Staff" &&
      authenticatedRole !== "Administrator"
    ) {
      setRole("Security Staff");
      setActiveTab("login");
      setMessage(
        "Access denied: staff QR login is required before recording manual staff events."
      );
      return;
    }

    applyParkingEvent(zoneId, type, eventSource);
  }

  function recordDriverQrEvent() {
    applyParkingEvent(selectedDetailZone, driverScanType, "Driver gate QR scan");
  }

  function removeSelectedEvent() {
    if (
      authenticatedRole !== "Security Staff" &&
      authenticatedRole !== "Administrator"
    ) {
      setRole("Security Staff");
      setActiveTab("login");
      setMessage(
        "Access denied: staff QR login is required before correcting events."
      );
      return;
    }

    if (!selectedEventId) {
      setMessage("Please select an event from the audit log first.");
      return;
    }

    const eventToRemove = events.find(
      (event) => String(event.id) === String(selectedEventId)
    );

    if (!eventToRemove) {
      setMessage("Selected event was not found.");
      setSelectedEventId("");
      return;
    }

    const zone = zones.find((item) => item.id === eventToRemove.zoneId);

    if (eventToRemove.result === "accepted" && zone) {
      const correctedOccupied =
        eventToRemove.type === "entry"
          ? zone.occupied - 1
          : zone.occupied + 1;

      if (correctedOccupied < 0 || correctedOccupied > zone.capacity) {
        setMessage(
          "Correction rejected because it would create an impossible occupancy value."
        );
        return;
      }

      setZones((prev) =>
        prev.map((item) =>
          item.id === eventToRemove.zoneId
            ? { ...item, occupied: correctedOccupied }
            : item
        )
      );
    }

    setEvents((prev) =>
      prev.filter((event) => String(event.id) !== String(selectedEventId))
    );

    setSelectedEventId("");
    setLastUpdate(nowTime());

    setMessage(
      `Selected ${eventToRemove.type} event for ${eventToRemove.zoneId} was removed and occupancy was corrected. In a production system this correction would also be stored in an audit trail.`
    );
  }

  function updateAdminZone(field, value) {
    if (authenticatedRole !== "Administrator") {
      setRole("Administrator");
      setActiveTab("login");
      setMessage(
        "Access denied: administrator login is required before editing configuration."
      );
      return;
    }

    setZones((prev) =>
      prev.map((zone) => {
        if (zone.id !== adminZone) return zone;

        const numericValue = Math.max(0, Number(value));
        const updatedZone = { ...zone, [field]: numericValue };

        if (field === "capacity" && updatedZone.occupied > numericValue) {
          updatedZone.occupied = numericValue;
        }

        return updatedZone;
      })
    );

    setLastUpdate(nowTime());
    setMessage("Admin configuration saved and dashboard data refreshed.");
  }

  function exportCsv() {
    if (authenticatedRole !== "Administrator") {
      setRole("Administrator");
      setActiveTab("login");
      setMessage(
        "Access denied: administrator login is required before exporting reports."
      );
      return;
    }

    const csv = [
      "zone,lot,capacity,occupied,free,status",
      ...zones.map((zone) => {
        const state = getZoneState(zone);
        return `${zone.name},${zone.lot},${zone.capacity},${zone.occupied},${state.spotsLeft},${state.label}`;
      }),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "campus-park-report.csv";
    link.click();

    URL.revokeObjectURL(url);
    setMessage("CSV report exported from the prototype.");
  }

  return (
    <main className="min-h-screen bg-slate-100 p-4 text-slate-900 sm:p-6 lg:p-8">
      <section className="mx-auto max-w-7xl">
        <header className="overflow-hidden rounded-3xl bg-slate-950 p-6 text-white shadow-xl sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-300">
                Software Engineering Prototype
              </p>

              <h1 className="mt-3 text-3xl font-black sm:text-5xl">
                Campus Park Tracker
              </h1>

              <p className="mt-3 max-w-2xl text-slate-300">
                Real-time parking availability for campus lots with QR/staff
                event capture, alerts, reports, and security controls.
              </p>
            </div>

            <div className="rounded-2xl bg-white/10 p-4 backdrop-blur">
              <p className="text-sm text-slate-300">Demo role</p>

              <select
                value={role}
                onChange={(event) => handleRoleChange(event.target.value)}
                className="mt-2 w-full rounded-xl border border-white/20 bg-slate-900 p-3 font-semibold text-white"
              >
                <option>Driver</option>
                <option>Security Staff</option>
                <option>Administrator</option>
              </select>

              <p className="mt-3 text-xs text-slate-400">
                Logged in as: {authenticatedRole}
              </p>

              <p className="mt-1 text-xs text-slate-400">
                Last update: {lastUpdate}
              </p>

              {authenticatedRole !== "Driver" && (
                <button
                  onClick={logout}
                  className="mt-3 w-full rounded-xl bg-white/10 px-3 py-2 text-sm font-bold text-white hover:bg-white/20"
                >
                  Logout
                </button>
              )}
            </div>
          </div>
        </header>

        <div className="my-5 rounded-2xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800 shadow-sm">
          {message}
        </div>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Total capacity"
            value={totals.capacity}
            helper="Lot A + Lot B zones"
          />
          <StatCard
            label="Free spots"
            value={totals.free}
            helper="Capacity minus occupancy"
          />
          <StatCard
            label="Near-full zones"
            value={totals.nearFullZones}
            helper="Yellow alert status"
          />
          <StatCard
            label="Full zones"
            value={totals.fullZones}
            helper="Red alert status"
          />
        </section>

        <nav className="mt-6 flex flex-wrap gap-2 rounded-2xl bg-white p-2 shadow-sm">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => openRestrictedTab(tab.id)}
              className={`rounded-xl px-4 py-2 text-sm font-bold transition ${
                activeTab === tab.id
                  ? "bg-slate-950 text-white"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        {activeTab === "login" && (
          <LoginPanel
            role={role}
            onLogin={loginAs}
            onBack={() => handleRoleChange("Driver")}
          />
        )}

        {activeTab === "driver" && (
          <section className="mt-6">
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-2xl font-black">
                  Driver availability view
                </h2>
                <p className="text-sm text-slate-500">
                  Simple driver flow: open app, see which lot has space, and
                  drive directly there.
                </p>
              </div>

              <div className="flex gap-2">
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search Lot A / Lot B..."
                  className="rounded-xl border bg-white px-4 py-2 outline-none focus:ring-2 focus:ring-slate-300"
                />

                <button
                  onClick={() => {
                    setLastUpdate(nowTime());
                    setMessage("Availability manually refreshed.");
                  }}
                  className="rounded-xl bg-white px-4 py-2 text-sm font-bold shadow-sm hover:bg-slate-50"
                >
                  Refresh
                </button>
              </div>
            </div>

            {alerts.length > 0 && (
              <div className="mb-5 rounded-3xl border border-amber-200 bg-amber-50 p-5 shadow-sm">
                <h3 className="font-black text-amber-900">Live alerts</h3>

                <div className="mt-3 grid gap-3 md:grid-cols-2">
                  {alerts.map((zone) => (
                    <p
                      key={zone.id}
                      className="rounded-2xl bg-white p-3 text-sm font-semibold text-amber-800"
                    >
                      {zone.name}: {zone.state.label} —{" "}
                      {zone.state.spotsLeft} free spots left
                    </p>
                  ))}
                </div>
              </div>
            )}

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {filteredZones.map((zone) => (
                <ZoneCard
                  key={zone.id}
                  zone={zone}
                  onViewDetails={(zoneId) => {
                    setSelectedDetailZone(zoneId);
                    setMessage(`Showing details for ${zoneId}.`);
                  }}
                />
              ))}
            </div>

            <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_420px]">
              <div className="rounded-3xl border bg-white p-6 shadow-sm">
                <h3 className="text-xl font-black">Selected zone details</h3>

                <div className="mt-4 grid gap-4 md:grid-cols-4">
                  <StatCard
                    label="Zone"
                    value={currentDetailZone.name}
                    helper={currentDetailZone.location}
                  />
                  <StatCard
                    label="Free spots"
                    value={detailState.spotsLeft}
                    helper={detailState.label}
                  />
                  <StatCard
                    label="Occupied"
                    value={currentDetailZone.occupied}
                    helper={`Capacity ${currentDetailZone.capacity}`}
                  />
                  <StatCard
                    label="Last update"
                    value={lastUpdate}
                    helper="Live / simulated update"
                  />
                </div>
              </div>

              <div className="rounded-3xl border bg-white p-6 shadow-sm">
                <h3 className="text-xl font-black">
                  Gate QR check-in / check-out
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Simulates a QR sign at the entrance or exit gate. The event is
                  validated before occupancy changes.
                </p>

                <div className="mt-5 flex flex-col items-center rounded-3xl bg-slate-50 p-5 text-center">
                  <FakeQrCode />
                  <p className="mt-3 text-sm font-bold text-slate-700">
                    {currentDetailZone.id}-GATE-QR
                  </p>
                </div>

                <label className="mt-4 block text-sm font-bold">
                  Gate action
                </label>

                <select
                  value={driverScanType}
                  onChange={(event) => setDriverScanType(event.target.value)}
                  className="mt-2 w-full rounded-xl border p-3"
                >
                  <option value="entry">Entry scan</option>
                  <option value="exit">Exit scan</option>
                </select>

                <button
                  onClick={recordDriverQrEvent}
                  className="mt-5 w-full rounded-xl bg-slate-950 px-4 py-3 font-bold text-white hover:bg-slate-800"
                >
                  Scan QR for {currentDetailZone.name}
                </button>
              </div>
            </div>
          </section>
        )}

        {activeTab === "staff" && (
          <section className="mt-6 grid gap-6 lg:grid-cols-[420px_1fr]">
            <form
              onSubmit={(event) => {
                event.preventDefault();
                recordStaffEvent(selectedZone, eventType);
              }}
              className="rounded-3xl border bg-white p-6 shadow-sm"
            >
              <h2 className="text-2xl font-black">Staff event capture</h2>

              <p className="mt-1 text-sm text-slate-500">
                Backup mode for security staff when QR/gate event capture needs
                manual correction.
              </p>

              <div className="mt-5 rounded-2xl bg-emerald-50 p-4 text-sm font-semibold text-emerald-800">
                QR access active: {authenticatedRole}
              </div>

              <label className="mt-5 block text-sm font-bold">Zone</label>

              <select
                value={selectedZone}
                onChange={(event) => setSelectedZone(event.target.value)}
                className="mt-2 w-full rounded-xl border p-3"
              >
                {zones.map((zone) => (
                  <option key={zone.id} value={zone.id}>
                    {zone.name} — {zone.lot}
                  </option>
                ))}
              </select>

              <label className="mt-4 block text-sm font-bold">
                Event type
              </label>

              <select
                value={eventType}
                onChange={(event) => setEventType(event.target.value)}
                className="mt-2 w-full rounded-xl border p-3"
              >
                <option value="entry">Entry</option>
                <option value="exit">Exit</option>
              </select>

              <label className="mt-4 block text-sm font-bold">Source</label>

              <select
                value={source}
                onChange={(event) => setSource(event.target.value)}
                className="mt-2 w-full rounded-xl border p-3"
              >
                <option>QR scan</option>
                <option>Manual</option>
                <option>Gate sensor</option>
              </select>

              <button className="mt-6 w-full rounded-xl bg-slate-950 px-4 py-3 font-bold text-white hover:bg-slate-800">
                Submit event
              </button>
            </form>

            <div className="rounded-3xl border bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-xl font-black">Audit event log</h3>
                  <p className="mt-1 text-sm text-slate-500">
                    Select an accidental event and remove it to correct
                    occupancy.
                  </p>
                </div>

                <button
                  onClick={removeSelectedEvent}
                  className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-bold text-rose-700 hover:bg-rose-100"
                >
                  Remove selected event
                </button>
              </div>

              <div className="mt-4 overflow-hidden rounded-2xl border">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                    <tr>
                      <th className="p-3">Select</th>
                      <th className="p-3">Time</th>
                      <th className="p-3">Zone</th>
                      <th className="p-3">Type</th>
                      <th className="p-3">Source</th>
                      <th className="p-3">Result</th>
                    </tr>
                  </thead>

                  <tbody>
                    {events.slice(0, 8).map((event) => (
                      <tr key={event.id} className="border-t">
                        <td className="p-3">
                          <input
                            type="radio"
                            name="selectedEvent"
                            checked={
                              String(selectedEventId) === String(event.id)
                            }
                            onChange={() =>
                              setSelectedEventId(String(event.id))
                            }
                          />
                        </td>
                        <td className="p-3">{event.time}</td>
                        <td className="p-3 font-semibold">{event.zoneId}</td>
                        <td className="p-3 capitalize">{event.type}</td>
                        <td className="p-3">{event.source}</td>
                        <td
                          className={`p-3 font-semibold ${
                            event.result === "accepted"
                              ? "text-emerald-700"
                              : "text-rose-700"
                          }`}
                        >
                          {event.result}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}

        {activeTab === "admin" && (
          <section className="mt-6 grid gap-6 lg:grid-cols-[420px_1fr]">
            <div className="rounded-3xl border bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-black">Admin configuration</h2>

              <p className="mt-1 text-sm text-slate-500">
                Manage lot capacity, near-full thresholds, and reports.
              </p>

              <div className="mt-5 rounded-2xl bg-violet-50 p-4 text-sm font-semibold text-violet-800">
                Administrator access active
              </div>

              <label className="mt-5 block text-sm font-bold">
                Select zone
              </label>

              <select
                value={adminZone}
                onChange={(event) => setAdminZone(event.target.value)}
                className="mt-2 w-full rounded-xl border p-3"
              >
                {zones.map((zone) => (
                  <option key={zone.id} value={zone.id}>
                    {zone.name}
                  </option>
                ))}
              </select>

              <label className="mt-4 block text-sm font-bold">Capacity</label>

              <input
                type="number"
                value={currentAdminZone.capacity}
                onChange={(event) =>
                  updateAdminZone("capacity", event.target.value)
                }
                className="mt-2 w-full rounded-xl border p-3"
              />

              <label className="mt-4 block text-sm font-bold">
                Near-full threshold
              </label>

              <input
                type="number"
                value={currentAdminZone.nearFull}
                onChange={(event) =>
                  updateAdminZone("nearFull", event.target.value)
                }
                className="mt-2 w-full rounded-xl border p-3"
              />

              <button
                onClick={exportCsv}
                className="mt-6 w-full rounded-xl bg-emerald-600 px-4 py-3 font-bold text-white hover:bg-emerald-700"
              >
                Export CSV report
              </button>
            </div>

            <div className="rounded-3xl border bg-white p-6 shadow-sm">
              <h3 className="text-xl font-black">Zones overview</h3>

              <div className="mt-4 grid gap-3">
                {zones.map((zone) => {
                  const state = getZoneState(zone);

                  return (
                    <div key={zone.id} className="rounded-2xl border p-4">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div>
                          <p className="font-bold">{zone.name}</p>
                          <p className="text-sm text-slate-500">
                            Capacity {zone.capacity}, occupied {zone.occupied},
                            free {state.spotsLeft}
                          </p>
                        </div>

                        <span
                          className={`rounded-full border px-3 py-1 text-xs font-bold ${state.tone}`}
                        >
                          {state.label}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {activeTab === "reports" && (
          <section className="mt-6 grid gap-6 lg:grid-cols-2">
            <div className="rounded-3xl border bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-black">Usage report</h2>

              <p className="mt-1 text-sm text-slate-500">
                Simple occupancy trend view for peak-hour and capacity
                planning.
              </p>

              <div className="mt-6 space-y-4">
                {zones.map((zone) => {
                  const percent = Math.round(
                    (zone.occupied / zone.capacity) * 100
                  );

                  return (
                    <div key={zone.id}>
                      <div className="mb-1 flex justify-between text-sm">
                        <span className="font-semibold">{zone.name}</span>
                        <span>{percent}% occupied</span>
                      </div>

                      <div className="h-4 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className="h-full rounded-full bg-slate-900"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="rounded-3xl border bg-white p-6 shadow-sm">
              <h3 className="text-xl font-black">Sustainability impact</h3>

              <div className="mt-4 space-y-3 text-sm text-slate-700">
                <p className="rounded-2xl bg-emerald-50 p-4 text-emerald-800">
                  Environmental: less circling around campus, lower fuel use and
                  emissions.
                </p>
                <p className="rounded-2xl bg-blue-50 p-4 text-blue-800">
                  Social: less stress, fewer parking conflicts, better
                  accessibility planning.
                </p>
                <p className="rounded-2xl bg-violet-50 p-4 text-violet-800">
                  Economic: saves time and supports smarter capacity decisions.
                </p>
              </div>
            </div>
          </section>
        )}

        {activeTab === "security" && (
          <section className="mt-6">
            <div className="rounded-3xl border bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-black">
                Security and risk controls
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                Prototype controls based on vulnerability analysis and risk
                mitigation planning.
              </p>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              <ControlCard
                title="Role-based access"
                description="Staff and admin actions are blocked until the correct demo login is completed."
              />
              <ControlCard
                title="Occupancy validation"
                description="The system rejects impossible states, such as below zero or above zone capacity."
              />
              <ControlCard
                title="Duplicate scan detection"
                description="Repeated identical QR events are rejected to reduce fake/spam event risk."
              />
              <ControlCard
                title="Audit log"
                description="Accepted and rejected events are stored with time, zone, type, source, and result."
              />
              <ControlCard
                title="Manual correction"
                description="Staff can remove accidental events and correct occupancy when wrong input happens."
              />
              <ControlCard
                title="Future production controls"
                description="HTTPS/TLS, parameterized queries, backups, monitoring, and secret storage would be added in the backend version."
              />
            </div>
          </section>
        )}
      </section>
    </main>
  );
}
