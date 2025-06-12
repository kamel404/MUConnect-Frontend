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
      media: ev.image_path ? `${BACKEND_URL}/storage/${ev.image_path.replace(/^events[\\\/]/, 'events/')}` : undefined
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
      media: ev.image_path ? `${BACKEND_URL}/storage/${ev.image_path.replace(/^events[\\\/]/, 'events/')}` : undefined
    }));
  }
  return response.data;
};

// Create a new event (admin/organizer)
// data should be an object with all fields, image_path as a File if present
export const createEvent = async (data) => {
  const formData = new FormData();
  formData.append('user_id', data.user_id);
  formData.append('title', data.title);
  formData.append('category', data.category);
  formData.append('event_datetime', data.event_datetime);
  formData.append('location', data.location);
  formData.append('organizer', data.organizer);
  if (data.description) formData.append('description', data.description);
  if (data.speaker_names) formData.append('speaker_names', data.speaker_names);
  if (data.image_path) formData.append('image_path', data.image_path); // File object

  const response = await axios.post(`${API_URL}/events`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

// Update an event (admin/organizer)
export const updateEvent = async (eventId, data) => {
  const formData = new FormData();
  if (data.title) formData.append('title', data.title);
  if (data.event_datetime) formData.append('event_datetime', data.event_datetime);
  if (data.location) formData.append('location', data.location);
  if (data.organizer) formData.append('organizer', data.organizer);
  if (data.description) formData.append('description', data.description);
  if (data.speaker_names) formData.append('speaker_names', data.speaker_names);
  if (data.image_path instanceof File) formData.append('image_path', data.image_path);

  const response = await axios.post(`${API_URL}/events/${eventId}?_method=PUT`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

// Delete an event (admin/organizer)
export const deleteEvent = async (eventId) => {
  const response = await axios.delete(`${API_URL}/events/${eventId}`);
  return response.data;
};

// Save an event for the authenticated user
export const saveEvent = async (eventId) => {
  const response = await axios.post(`${API_URL}/events/${eventId}/save`);
  return response.data;
};

// Unsave an event for the authenticated user
export const unsaveEvent = async (eventId) => {
  const response = await axios.delete(`${API_URL}/events/${eventId}/unsave`);
  return response.data;
};
