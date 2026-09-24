# GIRI RAKSHA (गिरि रक्षा / গিৰি ৰক্ষা)
> **"Predict. Warn. Protect."**  
> *Giri = Mountain | Raksha = Protection*

**Smart India Hackathon Problem Statement — PS ID 26001:**  
*"AI-Based Early Warning and Landslide Risk Monitoring System in NER"*

---

## Executive Summary

**Giri Raksha** is an integrated, production-grade, offline-first landslide early warning, geospatial risk monitoring, and emergency response management mobile platform built for the **North Eastern Region (NER) of India** (Assam, Arunachal Pradesh, Manipur, Meghalaya, Mizoram, Nagaland, Sikkim, Tripura).

Designed for harsh, low-connectivity mountainous terrain, Giri Raksha functions 100% offline using a local SQLite persistence engine, sub-meter GPS geo-tagging, explainable AI risk scoring, and automatic bi-directional synchronization when connectivity returns.

---

## System Architecture

```
                                  GIRI RAKSHA
                                       |
                   +-------------------+-------------------+
                   |                                       |
                   v                                       v
         Mobile Application (Expo)                Backend Services (Node/Express)
                   |                                       |
    +--------------+--------------+                +-------+-------+
    |                             |                |               |
    v                             v                v               v
Role-Based UI              Offline Engine    REST / Sockets     MongoDB Models
(Citizen, Field, Admin)    (SQLite + Queue)        |
    |                             |                v
    +--------------+--------------+        Python ML Microservice
                   |                       (FastAPI + Random Forest)
                   v
         Service Abstraction
  (Weather, Sensors, Satellite,
   Landslides, Risk, Road, Alerts)
```

---

## Core Capabilities

1. **AI Landslide Risk Prediction (Explainable AI)**:
   - 11-feature input vector: 24h/72h/7d cumulative rainfall, pore-water soil saturation %, terrain slope angle, elevation, historical landslide frequency, distance to road cut, NDVI vegetation index, temperature, humidity.
   - Outputs: Risk Score (0–100), Risk Level (`LOW`, `MODERATE`, `HIGH`), Model Confidence (87%), and feature contribution breakdown (e.g. Heavy Rainfall +28, Saturated Soil +22, Slope +17, History +9, Terrain +6).
   - Unobtrusive official disclaimer: *"Giri Raksha is a prototype decision-support system. Risk estimates are model-based and should not replace official disaster-management advisories."*

2. **Interactive GIS Risk Map**:
   - 7 Thematic Vector Overlays: Landslide Risk Zones, Highway Status & Blockages, Citizen & Field Reports, GSI Historical Incidents, Soil Moisture Telemetry Nodes, Designated Relief Shelters.
   - Interactive bottom-sheet inspector displaying environmental telemetry, slope angle, and vulnerable population metrics.

3. **Offline-First System & Auto-Sync Engine**:
   - Local SQLite database tables: `users`, `cached_risk_zones`, `cached_alerts`, `cached_weather`, `cached_roads`, `cached_landslides`, `pending_reports`, `sync_queue`, `field_observations`.
   - Automatic sync lifecycle: detects network reconnection via NetInfo, drains queue, compresses media, updates server, and transitions report state (`PENDING` ➔ `SYNCING` ➔ `SYNCED`).
   - In-app simulated network toggle for instant testing without airplane mode.

4. **Multi-Role Ground Operations**:
   - **Citizen**: View local risk, receive early warnings, capture geo-tagged hazard reports (photo/video + GPS), view highway connectivity, emergency SOS hotlines (112, 108).
   - **Field Officer**: Submit official geological ground surveys (tension cracks depth, rockfall intensity, groundwater seepage, soil saturation state), verify or reject citizen reports with photographic evidence.
   - **Disaster Authority (DEOC/SDMA)**: Regional command center with sensor health monitoring, AI-assisted incident priority ranking (0–100), and rapid emergency response team dispatching (NDRF, SDRF, BRO, Medical).

5. **Multilingual Localization**:
   - Full localized interface across **English**, **Hindi (हिन्दी)**, **Assamese (অসমীয়া)**, and **Bengali (বাংলা)**, with architectural stubs for Khasi, Mizo, Manipuri, and Nepali.

6. **SIH 60-Second Evaluation Flow (Demo Mode)**:
   - Real-time simulation of heavy monsoon precipitation (120mm ➔ 220mm, soil moisture 60% ➔ 82%, risk escalates from 58 MODERATE to 84 HIGH, GIS zone turns Red, warning alert pops up, offline report filed, network reconnected, and auto-synced to authority).

---

## Directory Structure

```
giri-raksha/
├── mobile/                     # React Native + Expo Mobile Application
│   ├── App.tsx                 # Root Navigator with dynamic role-based tab bar
│   ├── index.js                # Expo registerRootComponent entry point
│   ├── package.json            # Expo SDK 52 dependencies
│   ├── app.json                # Permissions & Android metadata
│   ├── tsconfig.json           # TypeScript configuration
│   ├── scripts/
│   │   └── test-runner.js      # Subsystem automated validation test suite
│   └── src/
│       ├── components/         # Reusable disaster management components
│       │   ├── RiskCard.tsx
│       │   ├── RiskGauge.tsx
│       │   ├── RiskFactorChart.tsx
│       │   ├── RiskMap.tsx
│       │   ├── WeatherCard.tsx
│       │   ├── SensorCard.tsx
│       │   ├── AlertCard.tsx
│       │   ├── ReportCard.tsx
│       │   ├── RoadStatusCard.tsx
│       │   ├── PriorityCard.tsx
│       │   ├── OfflineBanner.tsx
│       │   ├── NetworkStatusBadge.tsx
│       │   └── DemoSimulationPanel.tsx
│       ├── screens/            # Application screens
│       │   ├── SplashScreen.tsx
│       │   ├── OnboardingScreen.tsx
│       │   ├── LoginScreen.tsx
│       │   ├── HomeScreen.tsx
│       │   ├── RiskMapScreen.tsx
│       │   ├── ReportHazardScreen.tsx
│       │   ├── FieldOfficerScreen.tsx
│       │   ├── AdminDashboardScreen.tsx
│       │   ├── RegionalViewScreen.tsx
│       │   ├── SensorsScreen.tsx
│       │   ├── RoadsScreen.tsx
│       │   ├── EmergencyScreen.tsx
│       │   ├── AnalyticsScreen.tsx
│       │   └── SettingsScreen.tsx
│       ├── context/            # AppContext with global state & simulation runner
│       ├── services/           # Abstraction services (AI, Weather, Sensors, Roads, etc.)
│       ├── database/           # SQLite / AsyncStorage persistence layer
│       ├── storage/            # SecureStore credential manager
│       ├── localization/       # Multilingual dictionary (EN, HI, AS, BN)
│       ├── constants/          # NER 8-state geographic data & emergency contacts
│       ├── mock/               # Pre-populated realistic datasets
│       ├── theme/              # Disaster management color palette & typography
│       └── types/              # Comprehensive TypeScript definitions
├── server/                     # Node.js + Express Backend
│   ├── package.json
│   ├── tsconfig.json
│   ├── .env.example
│   └── src/
│       ├── server.ts           # REST API endpoints & Socket.IO gateway
│       └── models/             # Mongoose schemas with compound spatial indexes
└── ml-service/                 # Python FastAPI Machine Learning Microservice
    ├── main.py                 # FastAPI server exposing POST /predict
    ├── requirements.txt        # Python dependencies (scikit-learn, numpy, fastapi)
    └── training/
        └── train_model.py      # Random Forest model training script
```

---

## How to Run & Verify

### Quick Start (From Project Root)
You can run commands directly from the root using npm:
```bash
# 1. Run Automated Subsystem Verification Tests
npm run test

# 2. Train Random Forest ML Model
npm run ml:train

# 3. Start Python FastAPI ML Microservice (Port 8000)
npm run ml:serve

# 4. Start Node.js / Express Backend Server (Port 5000 / 5001)
npm run server

# 5. Launch Mobile Application (Expo)
npm run mobile
# or to open in web browser:
npm run mobile:web
```

---

### Running Subsystems Individually

#### 1. Automated Subsystem Verification Tests
```bash
cd mobile
node scripts/test-runner.js
```
*Executes unit tests verifying: AI Risk Calculation (58 ➔ 84), Emergency Priority Scoring, End-to-End Offline Storage & Sync, Alert Rules, and Response Lifecycle.*

#### 2. Python ML Microservice (FastAPI + Random Forest)
Activate virtual environment and train / serve:
```bash
# Activate environment
source .venv/bin/activate

# Train the Random Forest Susceptibility Classifier (saves to ml-service/models/)
python3 ml-service/training/train_model.py

# Launch FastAPI microservice (runs on http://0.0.0.0:8000)
python3 ml-service/main.py
```
*API docs available at: http://localhost:8000/docs*

#### 3. Node.js / Express Backend Server
```bash
cd server
npm run dev
```
*Backend API and Socket.IO gateway running on http://localhost:5000 (or 5001).*

#### 4. Launch Mobile Application
```bash
cd mobile
npx expo start
```
*Scan QR code via Expo Go on an Android or iOS device, press `w` to open Expo Web in your browser, or press `a` for Android emulator.*

---

## SIH Evaluation Script (60-Second Demo)

1. **Launch App**: Open Giri Raksha. Notice the professional splash screen and onboarding walkthrough.
2. **Quick 1-Tap Login**: On the login screen, tap **"👤 CITIZEN: Priya Sharma (Shillong)"** to sign in instantly.
3. **Inspect Home Dashboard**: Observe Shillong Sector 4 at **Risk: 58 / 100 (MODERATE)**. Tap **"▼ VIEW EXPLAINABLE AI ANALYSIS"** to see the transparent point contribution breakdown.
4. **Trigger Heavy Rainfall**: Tap **"⚡ SIH DEMO RUNNER"** in the top bar ➔ Tap **"🌧️ SIMULATE HEAVY RAINFALL (SIH DEMO)"**.
   - Rainfall jumps from 120mm to 220mm.
   - Soil moisture jumps from 60% to 82%.
   - AI score re-computes in real-time to **84 / 100 (HIGH)**.
   - A **High Landslide Risk Warning** is generated.
5. **File Offline Report**:
   - Tap **"CUT NETWORK (OFFLINE)"** in the demo bar. Notice the orange **OFFLINE MODE** badge.
   - Tap **"🚨 REPORT"** in the bottom tab bar.
   - Select **"Road Blockage"**, enter description, verify sub-meter GPS, tap **"SAVE OFFLINE REPORT (LOCAL DB)"**.
   - Notice the report is queued in SQLite: *"1 PENDING"*.
6. **Automatic Sync**:
   - Tap the network badge or Demo Controller to restore **ONLINE** mode.
   - The sync engine automatically wakes up: *"Syncing reports..."* ➔ *"✓ All reports synchronized"*.
7. **Authority Dispatch & Action**:
   - In Settings or the Demo Controller, switch role to **"🏛️ DISASTER AUTHORITY"**.
   - Open **"COMMAND"** tab: The incident appears at the top of the AI Prioritization Queue with a score of **96 / 100 (CRITICAL)**.
   - Tap **"ASSIGN TEAM"** ➔ Deploy **BRO / PWD Heavy Road Clearance Unit** ➔ Status updates to **"EN ROUTE"** and road status updates to **"PARTIALLY BLOCKED"**.
