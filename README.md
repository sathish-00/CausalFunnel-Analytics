# CausalFunnel Analytics Platform

A full-stack user analytics platform built as part of the CausalFunnel Full Stack Engineer Assignment.

The application tracks user interactions on a webpage, stores analytics events in MongoDB, and provides a dashboard for session analysis, user journey visualization, and click heatmap generation.

---

## Live Deployments

### Tracking Demo Website

https://causalfunnel-test-site.onrender.com/demo.html

### Analytics Dashboard

https://causalfunnel-dashboard.onrender.com/



---

## Features

### Event Tracking

The tracking script automatically captures:

* Page View Events
* Click Events

Each event contains:

* Session ID
* Event Type
* Current Page URL
* Timestamp
* Click Coordinates (x, y)

---

### Session Analytics Dashboard

* View all tracked sessions
* Display total events per session
* Inspect complete user journeys
* Chronological event ordering

---

### Heatmap Visualization

* Select a tracked page
* Visualize click locations
* Analyze user interaction patterns
* Identify high-engagement regions

---

## Tech Stack

### Frontend Dashboard

* React.js
* JavaScript
* CSS

### Tracking Layer

* Vanilla JavaScript
* Browser Local Storage

### Backend

* Node.js
* Express.js

### Database

* MongoDB Atlas
* Mongoose

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
│   ├── server.js
│   └── package.json
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

Stores page view and click telemetry events.

### Get Sessions

```http
GET /api/sessions
```

Returns all tracked sessions with event counts.

### Get Session Events

```http
GET /api/sessions/:sessionId
```

Returns ordered event history for a specific session.

### Get Heatmap Data

```http
GET /api/heatmap?pageUrl=<page_url>
```

Returns click coordinates used for heatmap rendering.

---

## Local Development Setup

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

Create a `.env` file inside the backend folder:

```env
PORT=5000
MONGO_URI=<your_mongodb_connection_string>
```

### Start Backend Server

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

## Design Decisions

### Stateless Session Tracking

Sessions are managed using browser localStorage identifiers. This removes server-side session storage requirements and enables easy horizontal scaling.

### Flexible Event Schema

Telemetry events contain different metadata depending on event type. A flexible schema design was chosen to support future event expansion without frequent schema migrations.

### Cloud-Native Architecture

MongoDB Atlas and Render were selected to provide scalable cloud deployment with minimal operational overhead.

---

## Future Enhancements

* Session Replay
* Heatmap Density Clustering
* Funnel Analytics
* Device & Browser Analytics
* Conversion Tracking
* Real-Time Dashboard Updates

---

## Author

Sathish Kodari

Built for the CausalFunnel Full Stack Engineer Assignment.
