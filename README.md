# CausalFunnel Analytics Platform

### Full-Stack User Analytics & Behavioral Insights Platform

Real-time user interaction tracking platform built with React, Node.js, Express, MongoDB Atlas, and Render. The system captures user behavior, visualizes session journeys, generates click heatmaps, and provides advanced engagement analytics including hotspot detection, dead-click analysis, and rage-click detection.


## Highlights

- Successfully deployed full-stack application on Render
- Implemented real-time event tracking architecture
- Built session journey visualization dashboard
- Developed click heatmap analytics
- Added behavioral analytics beyond assignment requirements
- Integrated MongoDB Atlas for scalable event storage

---

**Key Highlights**
- Real-Time Event Tracking
- Session Journey Visualization
- Click Heatmap Analytics
- Engagement Scoring
- Dead Click & Rage Click Detection
- CSV / JSON Data Export
- Cloud-Native Deployment

---

## Live Deployments

### Analytics Tracking Demo

https://causalfunnel-test-site.onrender.com/demo.html

### Analytics Dashboard

https://causalfunnel-dashboard.onrender.com/



---

## Project Overview

This application tracks user interactions on a webpage and provides actionable analytics through a centralized dashboard.

The system consists of:

* A client-side tracking script for collecting telemetry events
* A Node.js backend for processing and storing analytics data
* A MongoDB database for event persistence
* A React dashboard for session analytics and heatmap visualization

The platform enables analysis of user journeys, interaction hotspots, engagement patterns, and behavioral insights.

---

## Assignment Requirements Coverage

| Requirement              | Status |
| ------------------------ | ------ |
| Page View Tracking       | ✅      |
| Click Tracking           | ✅      |
| Session ID Management    | ✅      |
| Event Storage in MongoDB | ✅      |
| Backend APIs             | ✅      |
| Sessions View            | ✅      |
| User Journey View        | ✅      |
| Heatmap Visualization    | ✅      |
| Cloud Deployment         | ✅      |

---

## Key Features

### Event Tracking

* Tracks page view events (`page_view`)
* Tracks click events (`click`)
* Generates persistent session identifiers using browser localStorage
* Captures page URLs and timestamps
* Records click coordinates (x, y)
* Sends telemetry data asynchronously to the backend API

### Session Analytics

* View all tracked sessions
* Display event counts per session
* Analyze complete user journeys
* Chronological event visualization
* Session-level activity summaries

### Heatmap Visualization

* Visual representation of click locations
* User interaction hotspot detection
* Engagement pattern analysis

### Advanced Analytics

Additional features implemented beyond the assignment requirements:

* Engagement Score Calculation
* Hotspot Detection
* Dead Click Detection
* Rage Click Detection
* Behavioral Insights & Recommendations
* CSV Export Functionality
* JSON Export Functionality
* Session Search & Filtering

---

## Technology Stack

### Frontend

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

| Method | Endpoint                     | Description                         |
| ------ | ---------------------------- | ----------------------------------- |
| POST   | `/api/track`                 | Store analytics events              |
| GET    | `/api/sessions`              | Fetch sessions with event counts    |
| GET    | `/api/sessions/:sessionId`   | Fetch all events for a session      |
| GET    | `/api/heatmap?pageUrl=<url>` | Fetch click coordinates for heatmap |

---

## Screenshots

### Tracking Demo

<img width="1446" height="730" alt="Tracking Demo" src="https://github.com/user-attachments/assets/728f7979-096c-4cd8-bed9-56b3c6044849" />

### Session Analytics Dashboard

<img width="1488" height="778" alt="Session Dashboard" src="https://github.com/user-attachments/assets/36fc125d-e070-4b0c-bfdd-0883e0494268" />

### User Journey Timeline

<img width="1477" height="587" alt="User Journey" src="https://github.com/user-attachments/assets/71aa1a6c-8974-43dc-9318-b9dbc4063f87" />

### Heatmap Visualization

<img width="1485" height="763" alt="Heatmap" src="https://github.com/user-attachments/assets/e070169f-1568-4596-be4d-c0004df5a9c8" />

---

## Local Setup

### Clone Repository

```bash
git clone <https://github.com/sathish-00/CausalFunnel-Analytics>
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

### Start Backend

```bash
npm run dev
```

### Start Dashboard

```bash
cd dashboard
npm install
npm start
```

---

## Design Decisions & Trade-offs

### Stateless Session Tracking

Session identifiers are stored in browser localStorage, eliminating the need for server-side session storage and enabling scalable deployments.

### Flexible Event Schema

A flexible MongoDB schema was chosen to support different event types and allow future analytics enhancements without major schema migrations.

### Cloud-Native Architecture

MongoDB Atlas and Render were selected to provide reliable cloud infrastructure, simplified deployment, and persistent data storage.




## Future Enhancements

* Session Replay
* Funnel Conversion Analytics
* Real-Time Event Streaming
* Device & Browser Analytics
* User Authentication
* Advanced Reporting & Filtering
* Custom Event Tracking

---



## Author

**Sathish Kodari**

Developed as part of the CausalFunnel Full Stack Engineer Assignment. is this or we need some more 
