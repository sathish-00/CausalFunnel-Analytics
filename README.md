# CausalFunnel Analytics Platform

## User Analytics Application

A full-stack analytics platform developed as part of the CausalFunnel Full Stack Engineer Assignment. The application tracks user interactions on web pages, stores event data in MongoDB, and provides an analytics dashboard for session tracking, user journey visualization, and click heatmap analysis.

---

## Live Deployments

### Tracking Demo Website

https://causalfunnel-test-site.onrender.com/demo.html

### Analytics Dashboard

https://causalfunnel-dashboard.onrender.com/



---

## Project Overview

The system consists of three major components:

### Event Tracking Layer

A lightweight JavaScript tracking script that can be embedded into any webpage to capture user interactions.

### Analytics Backend

A Node.js and Express-based REST API responsible for receiving, processing, and storing telemetry events.

### Analytics Dashboard

A React-based dashboard that provides session analytics, user journey tracking, and click heatmap visualization.

---

## Features

### Event Tracking

Tracks the following user events:

* Page Views (`page_view`)
* Click Events (`click`)

Each event contains:

* Session ID
* Event Type
* Page URL
* Timestamp
* Click Coordinates (x, y)

### Session Analytics

* View all active sessions
* Display total event count per session
* Inspect complete user journeys
* Chronological event visualization

### Heatmap Visualization

* Select tracked pages
* Display click locations
* Analyze user interaction patterns
* Identify high-engagement areas

---

## Tech Stack

### Frontend Dashboard

* React.js
* JavaScript
* CSS3

### Event Tracking

* Vanilla JavaScript
* Browser Local Storage

### Backend

* Node.js
* Express.js

### Database

* MongoDB Atlas
* Mongoose ODM

### Deployment

* Render Cloud Platform

---

## Project Structure

```text
causalfunnel-analytics/

├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── package.json
│   └── server.js
│
├── dashboard/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── tracker/
│   ├── tracker.js
│   └── demo.html
│
├── .gitignore
└── README.md
```

---

## API Endpoints

### Track Events

```http
POST /api/track
```

Stores page view and click events.

### Fetch Sessions

```http
GET /api/sessions
```

Returns all tracked sessions and event counts.

### Fetch Session Events

```http
GET /api/sessions/:sessionId
```

Returns all events for a selected session.

### Fetch Heatmap Data

```http
GET /api/heatmap?pageUrl=<page_url>
```

Returns click coordinates for heatmap rendering.

---

## Local Setup

### Clone Repository

```bash
git clone <repository-url>
cd causalfunnel-analytics
```

### Install Backend Dependencies

```bash
cd backend
npm install
```

### Configure Environment Variables

Create a `.env` file inside the backend directory:

```env
PORT=5000
MONGO_URI=<your_mongodb_connection_string>
```

### Run Backend

```bash
npm run dev
```

### Run Dashboard

```bash
cd dashboard
npm install
npm start
```

---

## Design Decisions & Trade-offs

### Stateless Session Management

Session identifiers are stored in browser localStorage, eliminating the need for server-side session storage and improving scalability.

### Flexible Event Schema

Different event types contain different metadata. A flexible MongoDB schema allows easy extension of telemetry data without frequent schema modifications.

### Cloud-Native Deployment

MongoDB Atlas and Render were chosen to simplify deployment, scalability, and infrastructure management.

---

## Screenshots

### Session Analytics Dashboard

![Session Dashboard](screenshots/session-dashboard.png)

### User Journey View

![User Journey](screenshots/user-journey.png)

### Heatmap Visualization

![Heatmap](screenshots/heatmap.png)

---

## Future Improvements

* Session Replay
* Heatmap Density Clustering
* Funnel Analytics
* User Authentication
* Device & Browser Analytics
* Real-Time Dashboard Updates

---

## Author

**Sathish Kodari**

Built for the CausalFunnel Full Stack Engineer Assignment.
