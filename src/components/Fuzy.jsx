import React, { useEffect, useMemo, useRef, useState } from "react";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, off } from "firebase/database";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

/**
 * ==============================
 *  🔧 How to use this component
 * ==============================
 * 1) npm i firebase recharts
 * 2) Replace firebaseConfig with your project's values
 * 3) Ensure your RTDB path has keys under `/Fuzzy_Logic` like:
 *    Battery, Current, Power, RPM, Voltage
 * 4) Use this file as App.jsx in a Vite or CRA React app.
 *
 *  Realtime DB path read:  /Fuzzy_Logic
 */

const firebaseConfig = {
 apiKey: "AIzaSyAXHnvNZkb00PXbG5JidbD4PbRgf7l6Lgg",
  authDomain: "v2v-communication-d46c6.firebaseapp.com",
  databaseURL: "https://v2v-communication-d46c6-default-rtdb.firebaseio.com",
  projectId: "v2v-communication-d46c6",
  storageBucket: "v2v-communication-d46c6.firebasestorage.app",
  messagingSenderId: "536888356116",
  appId: "1:536888356116:web:983424cdcaf8efdd4e2601",
  measurementId: "G-H0YN6PE3S1"
};

// Initialize Firebase once (safe for HMR)
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// ====== Small helpers ======
const fmt = (n, digits = 2) =>
  (isNaN(n) ? 0 : Number(n)).toLocaleString(undefined, {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });

const nowLabel = () => new Date().toLocaleTimeString();

// Keep last N samples for the charts
const HISTORY_LIMIT = 200;

export default function App() {
  const [dataPoint, setDataPoint] = useState({
    Battery: 0,
    Current: 0,
    Power: 0,
    RPM: 0,
    Voltage: 0,
  });
  const [updatedAt, setUpdatedAt] = useState(0);
  const [history, setHistory] = useState([]); // array of {timeLabel, Battery, Current, Power, RPM, Voltage}
  const liveRef = useRef(null);

  useEffect(() => {
    const fuzzyPath = ref(db, "/Fuzzy_Logic");

    const unsub = onValue(fuzzyPath, (snap) => {
      const v = snap.val() || {};
      const next = {
        Battery: Number(v.Battery ?? 0),
        Current: Number(v.Current ?? 0),
        Power: Number(v.Power ?? 0),
        RPM: Number(v.RPM ?? 0),
        Voltage: Number(v.Voltage ?? 0),
      };
      setDataPoint(next);
      setUpdatedAt(Date.now());
      setHistory((prev) => {
        const row = { timeLabel: nowLabel(), ...next };
        const arr = [...prev, row];
        if (arr.length > HISTORY_LIMIT) arr.shift();
        return arr;
      });
    });

    liveRef.current = unsub;
    return () => {
      try { off(fuzzyPath); } catch (_) {}
    };
  }, []);

  const cards = useMemo(
    () => [
      { key: "Battery", label: "Battery", unit: "%" },
      { key: "Voltage", label: "Voltage", unit: "V" },
      { key: "Current", label: "Current", unit: "A" },
      { key: "Power", label: "Power", unit: "W" },
      { key: "RPM", label: "RPM", unit: "rpm" },
    ],
    []
  );

  const lastUpdatedText = updatedAt
    ? new Date(updatedAt).toLocaleTimeString()
    : "—";

  return (
    <div className="wrap">
      <style>{css}</style>

      <header className="topbar">
        <div>
          <h1>Fuzzy Logic – Realtime Dashboard</h1>
          <p className="sub">Connected to Firebase Realtime Database /Fuzzy_Logic</p>
        </div>
        <div className="status">
          <span className={`dot ${updatedAt ? "ok" : "idle"}`} />
          <span className="ts">Last update: {lastUpdatedText}</span>
          <button className="btn" onClick={() => setHistory([])}>Clear Graph</button>
        </div>
      </header>

      <section className="cards">
        {cards.map((c) => (
          <article key={c.key} className="card">
            <div className="card-title">{c.label}</div>
            <div className="card-value">
              {fmt(dataPoint[c.key], c.key === "RPM" ? 0 : 2)}
              <span className="unit">{" "}{c.unit}</span>
            </div>
          </article>
        ))}
      </section>

      <section className="charts">
        <ChartPanel title="Voltage (V) & Current (A)" lines={[
          { dataKey: "Voltage", stroke: "#2563eb" },
          { dataKey: "Current", stroke: "#16a34a" },
        ]} data={history} />

        <ChartPanel title="Power (W)" lines={[{ dataKey: "Power", stroke: "#7c3aed" }]} data={history} />

        <ChartPanel title="Battery (%)" lines={[{ dataKey: "Battery", stroke: "#f59e0b" }]} data={history} />

        <ChartPanel title="RPM" lines={[{ dataKey: "RPM", stroke: "#ef4444" }]} data={history} />
      </section>

      <footer className="foot">
        <small>
          Tip: Values update live when you change them in Firebase Realtime Database.
        </small>
      </footer>
    </div>
  );
}

function ChartPanel({ title, lines, data }) {
  return (
    <div className="panel">
      <div className="panel-title">{title}</div>
      <div className="chartbox">
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={data} margin={{ top: 8, right: 24, left: 8, bottom: 8 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="timeLabel" minTickGap={20} />
            <YAxis allowDecimals />
            <Tooltip />
            <Legend />
            {lines.map((l) => (
              <Line
                key={l.dataKey}
                type="monotone"
                dataKey={l.dataKey}
                dot={false}
                isAnimationActive={false}
                stroke={l.stroke}
                strokeWidth={2}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// ================= CSS (plain, no Tailwind) =================
const css = `
:root{
  --bg:#0f172a; /* slate-900 */
  --card:#111827; /* gray-900 */
  --muted:#94a3b8; /* slate-400 */
  --text:#e5e7eb; /* gray-200 */
  --accent:#2563eb; /* blue-600 */
  --ring: #22c55e; /* green-500 */
}
*{box-sizing:border-box}
body{margin:0}
.wrap{min-height:100vh;background:linear-gradient(180deg,#0b1220,#111827);color:var(--text);padding:16px}
.topbar{display:flex;align-items:center;justify-content:space-between;gap:16px;margin:8px 0 16px}
.topbar h1{font-size:22px;margin:0}
.sub{margin:4px 0 0;color:var(--muted)}
.status{display:flex;align-items:center;gap:12px}
.dot{width:10px;height:10px;border-radius:50%;background:#64748b;display:inline-block}
.dot.ok{background:var(--ring);box-shadow:0 0 0 4px rgba(34,197,94,.15)}
.ts{color:var(--muted)}
.btn{border:1px solid #334155;background:#0b1220;color:var(--text);padding:6px 10px;border-radius:8px;cursor:pointer}
.btn:hover{background:#0f172a}
.cards{display:grid;grid-template-columns:repeat(5,minmax(140px,1fr));gap:12px}
.card{background:var(--card);border:1px solid #1f2937;border-radius:14px;padding:14px;box-shadow:0 1px 0 rgba(0,0,0,.25)}
.card-title{font-size:12px;color:var(--muted);letter-spacing:.02em}
.card-value{font-size:28px;font-weight:700;margin-top:6px}
.unit{font-size:14px;color:var(--muted);margin-left:6px}
.charts{display:grid;grid-template-columns:repeat(2,1fr);gap:14px;margin-top:16px}
.panel{background:var(--card);border:1px solid #1f2937;border-radius:14px;padding:10px}
.panel-title{font-size:14px;color:var(--muted);margin:6px 10px}
.chartbox{height:260px;padding:4px 0}
.foot{margin-top:20px;color:var(--muted)}

/* Responsive */
@media (max-width: 1200px){.cards{grid-template-columns:repeat(3,1fr)}}
@media (max-width: 900px){.charts{grid-template-columns:1fr}.cards{grid-template-columns:repeat(2,1fr)}}
@media (max-width: 560px){.cards{grid-template-columns:1fr}}
`;
