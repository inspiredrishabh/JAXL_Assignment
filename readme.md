# JAXL ASSIGNMENT POC

## Overview

This project is a **production-quality simulation of a real-time outbound call routing system**, similar to what is used in call centers.

The system automatically generates outbound calls, handles customer pickup or drop, assigns calls to available agents, queues calls when agents are busy, and immediately connects queued calls when an agent becomes free.
A **real-time web dashboard** displays the live state of the system using WebSockets.

The focus of this project is **correctness, clean architecture, concurrency handling, and system design**, not UI aesthetics.

---

## Key Features

* Automated outbound call generation
* Deterministic call lifecycle simulation
* Agent availability tracking and routing
* Strict FIFO call queue
* Immediate agent reuse after call completion
* Real-time UI updates using WebSockets
* Clean separation of concerns
* Fully tick-based time simulation (no `setTimeout`)

---

## Tech Stack

### Backend

* Node.js (v20+)
* Express.js
* JavaScript (ES2023)
* WebSocket (`ws`)
* Event-driven architecture

### Frontend

* React 18
* Vite
* Native WebSocket client

---

## System Design (High Level)

The system is built around a **tick-based simulation engine**.

```
Tick
 ├─ Call Spawner (creates calls)
 ├─ Call Engine (updates call states)
 ├─ Agent Manager (assigns & frees agents)
 ├─ Queue Manager (FIFO queue)
 ├─ Event Bus (system communication)
 └─ WebSocket Broadcaster (UI updates)
```

The frontend is **read-only** and only displays the current system state.

---

## Call Lifecycle

```
DIALING
 ├─→ DROPPED (customer did not pick up)
 └─→ PICKED
       ├─→ CONNECTED
       └─→ QUEUED
             └─→ CONNECTED
                   └─→ COMPLETED
```

* Calls start in `DIALING`
* Pickup decision happens after a delay
* If an agent is available → connect immediately
* If no agent is available → queue the call
* When a call completes, the agent becomes available and the next queued call is connected immediately

---

## Agent Lifecycle

```
AVAILABLE ↔ BUSY
```

* Agents become `BUSY` when assigned a call
* Agents return to `AVAILABLE` when a call completes
* An available agent immediately picks the next queued call (if any)

---

## Time Model (Very Important)

This system uses a **pure tick-based time model**.

* No `setTimeout`
* No real wall-clock delays for business logic
* One tick = one simulated second

### Why tick-based time?

* Fully deterministic behavior
* No event-loop drift
* Fast and reliable testing
* Easy to reason about concurrency

Example:

```js
call.endAtTick = currentTick + durationInTicks;
```

Each tick checks whether the call should complete.

---

## Project Structure

### Backend

```
backend/
├─ app.js                 # Express app
├─ server.js              # System bootstrap (single source of truth)
├─ config/                # System configuration
├─ tick/                  # Tick-based clock
├─ models/                # Call and Agent models
├─ constants/             # State constants
├─ events/                # Event bus and event types
├─ queue/                 # FIFO queue manager
├─ agents/                # Agent manager (routing brain)
├─ engine/                # Call engine (lifecycle brain)
├─ spawner/               # Call spawner
└─ websocket/             # Real-time state broadcaster
```

### Frontend

```
frontend/
├─ App.jsx                # Live dashboard
└─ main.jsx               # React bootstrap
```

---

## How to Run the Project

### 1️⃣ Backend

```bash
cd backend
npm install
npm run dev
```

Backend runs on:

```
http://localhost:4000
```

Health check:

```
GET /health
```

---

### 2️⃣ Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on:

```
http://localhost:5173
```

---

## Real-Time Updates

* Backend broadcasts **full system snapshots** over WebSockets
* Frontend listens and re-renders automatically
* No polling
* No REST APIs for system control

WebSocket endpoint:

```
ws://localhost:4000
```

---

## Testing the System

### WebSocket (Browser / Postman)

You can connect using:

```js
const ws = new WebSocket("ws://localhost:4000");
ws.onmessage = e => console.log(JSON.parse(e.data));
```

You should see:

* Tick increasing
* Agents switching between AVAILABLE/BUSY
* Calls moving through states
* Queue length changing correctly

---

## Key Design Decisions

### 1. Event-Driven Architecture

Components communicate using events instead of direct calls, making the system loosely coupled and easy to extend.

### 2. Single Source of Truth

All core managers are instantiated **once** in `server.js` and shared across the system.

### 3. FIFO Queue

Queued calls are always handled in strict arrival order.

### 4. Read-Only UI

The UI never controls the system. It only reflects backend state.

---

## Challenges Faced & Solutions

###  Hybrid Time Issue

**Problem:** Using `setTimeout` caused non-deterministic behavior.
**Solution:** Switched to a pure tick-based simulation.

---

###  Missing Call Completion Loop

**Problem:** Agents were not reused immediately after call completion.
**Solution:** On call completion, agents are freed and the next queued call is connected instantly.

---

###  Ringing Call State

**Problem:** Separate `RINGING` state added unnecessary complexity.
**Solution:** Used `DIALING` delay to represent ringing behavior.

---

###  Multiple System Instances (Critical Bug)

**Problem:** Tick engine and WebSocket were using different instances of core managers.
**Effect:** UI showed agents always AVAILABLE and calls never updated.
**Solution:** Enforced a single source of truth by creating all managers in `server.js`.

---

## What This Project Demonstrates

* Correct handling of concurrency in Node.js
* Deterministic simulation design
* Clean separation of concerns
* Real-time system state propagation
* Practical system design skills

---

## Conclusion

This project models a real-world outbound call routing platform with a strong focus on correctness, clarity, and system design.
It avoids over-engineering while still demonstrating production-level thinking and architecture.

---
