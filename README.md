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

| Requirement | Status |
|------------|---------|
| Page View Tracking | ✓ |
| Click Tracking | ✓ |
| Session ID Management | ✓ |
| Event Storage in MongoDB | ✓ |
| Backend APIs | ✓ |
| Sessions View | ✓ |
| User Journey View | ✓ |
| Heatmap Visualization | ✓ |
| Cloud Deployment | ✓ |
---

## Key Features

### Event Tracking

- Real-time page view tracking
- Real-time click event tracking
- Persistent session identification using browser localStorage
- Automatic capture of page URLs and timestamps
- Click coordinate collection for interaction heatmaps
- Asynchronous event delivery to the analytics API

### Session Analytics

- Track and analyze user sessions in real time
- Display session-level event counts and engagement metrics
- Visualize complete user journeys chronologically
- Inspect user interaction patterns and navigation behavior
- Identify dead clicks and rage-click activity
- Generate actionable session insights and summaries

### Heatmap Visualization

- Visualize click activity across tracked pages
- Detect user interaction hotspots
- Analyze engagement and navigation patterns
- Identify areas of high user interest
- Support data-driven UX improvements

### Advanced Analytics

Implemented several advanced analytics features beyond the assignment scope:

- Engagement scoring to measure session quality
- Hotspot detection for identifying high-interaction areas
- Dead click detection for usability issue identification
- Rage click detection for frustration analysis
- Behavioral insights and automated recommendations
- Session search and filtering capabilities
- Export analytics data in CSV and JSON formats
- User activity pattern analysis
- Session-level performance summaries

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

<img width="1022" height="572" alt="user journey" src="https://github.com/user-attachments/assets/92a266c4-57b1-4c93-9e6c-81a35d5a6d3d" />


### Heatmap Visualization 1
<img width="1492" height="760" alt="user" src="https://github.com/user-attachments/assets/f40af672-1f25-4dcb-b0a8-6c5edc97fef1" />


### Heatmap Visualization 2

<img width="1485" height="763" alt="Heatmap" src="https://github.com/user-attachments/assets/e070169f-1568-4596-be4d-c0004df5a9c8" />

---

## Local Setup

### Clone Repository

```bash
git clone <https://github.com/sathish-00/CausalFunnel-Analytics>
cd Causalfunnel-Analytics
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

## Assumptions & Trade-offs

### Stateless Session Tracking

Session identifiers are stored in browser localStorage rather than server-side sessions to improve scalability and reduce backend state management complexity.

### Flexible Event Schema

Different event types may contain different metadata. A flexible MongoDB schema allows future event extensions without requiring frequent schema migrations.

### Cloud-Native Architecture

MongoDB Atlas and Render were selected to simplify deployment, provide persistent cloud storage, and support scalable hosting.


## Future Enhancements

* Session Replay
* Funnel Conversion Analytics
* Real-Time Event Streaming
* Device & Browser Analytics
* User Authentication
* Advanced Reporting & Filtering
* Custom Event Tracking

---

---

## Conclusion

This project demonstrates the complete lifecycle of a modern analytics platform, including client-side event tracking, backend API development, database integration, cloud deployment, session analytics, and user behavior visualization.

## Author

**Sathish Kodari**

Developed as part of the CausalFunnel Full Stack Engineer Assignment. is this or we need some more 
