# CausalFunnel Analytics Platform

## User Analytics Application

A full-stack analytics platform built for the CausalFunnel Full Stack Engineer assignment. The application tracks user interactions, stores telemetry events in MongoDB, and provides session analytics and heatmap visualizations through a dashboard.

## Live Demo

* **Tracking Demo Site:** https://causalfunnel-test-site.onrender.com/demo.html
* **Analytics Dashboard:** https://causalfunnel-dashboard.onrender.com/
  

---

## Features

### Event Tracking

* Tracks `page_view` events
* Tracks `click` events
* Generates persistent session IDs using localStorage
* Captures page URL and timestamp
* Records click coordinates (x, y)

### Session Analytics

* View all tracked sessions
* Display event counts per session
* Inspect complete user journeys
* Events ordered chronologically

### Heatmap Visualization

* Select page URLs
* Visualize click locations
* Analyze user interaction patterns

---

## Tech Stack

### Frontend

* React.js
* JavaScript
* HTML5
* CSS3

### Backend

* Node.js
* Express.js

### Database

* MongoDB Atlas
* Mongoose

### Deployment

* Render

---

## Project Structure

```text
causalfunnel-analytics/
│
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   └── server.js
│
├── frontend/
│   ├── dashboard/
│   ├── tracker/
│   └── public/
│
└── README.md
```

## API Endpoints

### Track Events

```http
POST /api/track
```

### Get Sessions

```http
GET /api/sessions
```

### Get Session Events

```http
GET /api/sessions/:sessionId
```

### Get Heatmap Data

```http
GET /api/heatmap?pageUrl=<page_url>
```

---

## Local Setup

### Clone Repository

```bash
git clone <repository-url>
cd causalfunnel-analytics
```

### Install Dependencies

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

### Start Frontend

```bash
cd frontend
npm install
npm start
```

---

## Design Decisions

* Session IDs are stored in browser localStorage.
* MongoDB is used for scalable event storage.
* Event schema supports flexible telemetry payloads.
* Backend remains stateless for improved scalability.
* Heatmap data is generated from stored click coordinates.

---

## Future Enhancements

* Session replay
* Heatmap intensity clustering
* Conversion funnel analytics
* User authentication
* Advanced reporting and filters

---

## Author

**Sathish Kodari**

Built as part of the CausalFunnel Full Stack Engineer Assignment.
