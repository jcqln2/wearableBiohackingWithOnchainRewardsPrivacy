# Nervous System Happiness Dashboard

A **Looker-style web dashboard** that displays **biometric data** for “how happy your nervous system is,” driven by **sound data from an Arduino**. The UI uses a clean, data-focused layout with KPI cards, time-range filters, and charts.

## What it does

- **Front end**: Looker-inspired layout (sidebar, top bar, filter bar, KPI tiles, chart grid).
- **Metrics**: Nervous system score, HRV proxy, coherence, stress level, relaxation index, breathing rate — all framed as derived from Arduino sound input.
- **Data**: Currently uses **mock time-series data** that simulates live Arduino/biometric streams. You can replace this with real Arduino data (see below).

## Run locally

```bash
npm install
npm run dev
```

Open the URL shown (e.g. `http://localhost:5173`).

## Hooking up real Arduino sound data

1. **Send data from Arduino** (or a small gateway) to your app, e.g.:
   - WebSocket server that the dashboard connects to.
   - REST API that the dashboard polls.
   - Serial over USB to a local Node/Python script that forwards to the above.

2. **Data shape**: Each reading should match the `BiometricSnapshot` type in `src/types.ts`:

   - `timestamp`: number (Unix ms)
   - `nervousSystemScore`: 0–100
   - `hrvProxy`: number (e.g. ms)
   - `coherence`: 0–1
   - `stressLevel`: 0–100
   - `relaxationIndex`: 0–100
   - `breathingRate`: breaths/min
   - `audioLevel`: raw level (e.g. 0–1)

3. **Replace mock data**: Swap `generateMockBiometricSeries` / `getLatestSnapshot` in `App.tsx` for state updated from your WebSocket or API (e.g. append to a `series` array and use the last item for KPIs).

## Stack

- **Vite** + **React** (TypeScript)
- **Recharts** for area and pie charts
- CSS variables for Looker-like theme (sidebar, cards, borders, accent color)

## Build

```bash
npm run build
npm run preview   # optional: preview production build
```
