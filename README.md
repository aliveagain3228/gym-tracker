<div align="center">

# 🏋️ Gym Tracker

  <p>
    <a href="https://aliveagain3228.github.io/gym-tracker/" target="_blank">
      <img src="https://img.shields.io/badge/Live_Demo-Link-007ACC?style=for-the-badge&logo=githubpages&logoColor=white" alt="Live Demo" />
    </a>
  </p>

  <p>
    <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
    <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind" />
    <img src="https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E" alt="Vite" />
    <img src="https://img.shields.io/badge/PWA-5A0FC8?style=for-the-badge&logo=pwa&logoColor=white" alt="PWA" />
    <img src="https://img.shields.io/badge/Dexie.js-FF6B35?style=for-the-badge&logo=indexeddb&logoColor=white" alt="Dexie" />
  </p>

</div>

## 📝 About the Project

A fully offline-capable Progressive Web App for tracking gym workouts. Built to practice building real-world PWAs with local-first data storage. Install it on your phone's home screen and use it without internet — all data stays on your device.

### 📸 App Preview

<img src="./public/preview.png" alt="Gym Tracker Interface" width="400"/>

## ✨ Features

- 📱 **PWA** — install on iOS/Android home screen, works fully offline
- 🏋️ **Workout Tracking** — log exercises, sets, weight and reps in real time
- ⏱ **Live Timer** — tracks workout duration automatically
- 📊 **Progress Charts** — visualize weight progression and estimated 1RM per exercise
- 📋 **Templates** — save workouts as reusable templates for quick start
- 🎯 **Exercise Library** — 16+ exercises with muscle group filtering and technique guides
- 🫀 **Muscle Diagrams** — SVG body illustrations showing targeted muscle groups
- 💾 **IndexedDB Storage** — all data stored locally via Dexie.js, no backend required
- 🔁 **1RM Calculator** — estimates one-rep max using Epley and Brzycki formulas

## 🛠 Tech Stack

| Technology | Purpose |
|---|---|
| React + TypeScript | UI and type safety |
| Tailwind CSS v4 | Styling |
| Vite | Build tool + dev server |
| Dexie.js | IndexedDB wrapper for local storage |
| Framer Motion | Animations and transitions |
| Recharts | Progress charts |
| Lucide React | Icons |
| vite-plugin-pwa | Service Worker + PWA manifest |

## 🚀 Installation

```bash
# Clone the project
git clone https://github.com/aliveagain3228/gym-tracker.git

# Install dependencies
npm install

# Run locally
npm run dev

# Build for production
npm run build

# Deploy to GitHub Pages
npm run deploy
```

## 📱 Install as PWA

Open the live demo in your mobile browser, tap **"Add to Home Screen"** — the app installs like a native app and works fully offline.
