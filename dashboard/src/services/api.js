// Automatically handles switching between local development and production environments
const BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? 'http://localhost:5000/api'
  : 'https://causalfunnel-analytics-4k49.onrender.com/api';

export const fetchSessions = async () => {
  const response = await fetch(`${BASE_URL}/sessions`);
  if (!response.ok) throw new Error('Failed to fetch sessions');
  return response.json();
};

export const fetchSessionDetails = async (sessionId) => {
  const response = await fetch(`${BASE_URL}/sessions/${sessionId}`);
  if (!response.ok) throw new Error('Failed to fetch session details');
  return response.json();
};

export const fetchHeatmapData = async (url) => {
  const response = await fetch(`${BASE_URL}/heatmap?url=${encodeURIComponent(url)}`);
  if (!response.ok) throw new Error('Failed to fetch heatmap data');
  return response.json();
};