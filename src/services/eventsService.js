import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api';
const BACKEND_URL = 'http://127.0.0.1:8000';

// Fetch events with optional params (pagination, filters)
export const fetchEvents = async (params = {}) => {
  const response = await axios.get(`${API_URL}/events`, { params });
  // Map image_path to media (full URL) for each event
  if (response.data && Array.isArray(response.data.data)) {
    response.data.data = response.data.data.map(ev => ({
      ...ev,
      media: ev.image_path ? `${BACKEND_URL}/api/storage/${ev.image_path.replace(/^events[\\\/]/, 'events/')}` : undefined
    }));
  }
  return response.data;
};

// Fetch a single event by ID
export const fetchEventById = async (eventId) => {
  const response = await axios.get(`${API_URL}/events/${eventId}`);
  return response.data;
};

// Register for an event
export const registerForEvent = async (eventId) => {
  const response = await axios.post(`${API_URL}/events/${eventId}/register`);
  return response.data;
};

// Cancel registration for an event
export const unregisterFromEvent = async (eventId) => {
  const response = await axios.post(`${API_URL}/events/${eventId}/unregister`);
  return response.data;
};

// Fetch events the current user is registered for
export const fetchMyEvents = async (params = {}) => {
  const response = await axios.get(`${API_URL}/events/my-events`, { params });
  // Map image_path to media (full URL) for each event
  if (response.data && Array.isArray(response.data.data)) {
    response.data.data = response.data.data.map(ev => ({
      ...ev,
      media: ev.image_path ? `${BACKEND_URL}/api/storage/${ev.image_path.replace(/^events[\\\/]/, 'events/')}` : undefined
    }));
  }
  return response.data;
};

// Create a new event (admin/organizer)
export const createEvent = async (eventData) => {
  const response = await axios.post(`${API_URL}/events`, eventData);
  return response.data;
};

// Update an event (admin/organizer)
export const updateEvent = async (eventId, eventData) => {
  const response = await axios.put(`${API_URL}/events/${eventId}`, eventData);
  return response.data;
};

// Delete an event (admin/organizer)
export const deleteEvent = async (eventId) => {
  const response = await axios.delete(`${API_URL}/events/${eventId}`);
  return response.data;
};
