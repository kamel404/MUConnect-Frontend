import { http } from './httpClient';
import { API_BASE_URL, FILES_BASE_URL } from '../config/env';
const BACKEND_URL = FILES_BASE_URL;

// Fetch events with optional params (pagination, filters)
export const fetchEvents = async (params = {}) => {
  const response = await http.get(`/events`, { params });
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
  const response = await http.get(`/events/${eventId}`);
  return response.data;
};

// Register for an event
export const registerForEvent = async (eventId) => {
  const response = await http.post(`/events/${eventId}/register`);
  return response.data;
};

// Cancel registration for an event
export const unregisterFromEvent = async (eventId) => {
  const response = await http.post(`/events/${eventId}/unregister`);
  return response.data;
};

// Fetch events the current user is registered for
export const fetchMyEvents = async (params = {}) => {
  const response = await http.get(`/events/my-events`, { params });
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
  try {
    let dataToSend = eventData;
    let headers = {};

    // If a plain object is passed in (not FormData), convert it to FormData so that
    // files such as `image_path` are properly transmitted to the backend.
    if (!(eventData instanceof FormData)) {
      const formData = new FormData();

      // Iterate through object keys and append to FormData. Arrays are handled by
      // appending each value with the same key followed by [] to comply with
      // Laravel style array inputs.
      Object.entries(eventData || {}).forEach(([key, value]) => {
        if (value === undefined || value === null) return;

        if (Array.isArray(value)) {
          value.forEach((v) => formData.append(`${key}[]`, v));
        } else {
          formData.append(key, value);
        }
      });
      dataToSend = formData;
    }

    // Ensure multipart header so the backend treats the request as a file upload.
    headers['Content-Type'] = 'multipart/form-data';

  const response = await http.post(`/events`, dataToSend, { headers });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to create event' };
  }
};

// Update an event (admin/organizer)
export const updateEvent = async (eventId, eventData) => {
  try {
    let dataToSend = eventData;
    let headers = {};

    if (!(eventData instanceof FormData)) {
      const formData = new FormData();

      Object.entries(eventData || {}).forEach(([key, value]) => {
        if (value === undefined || value === null) return;
        if (Array.isArray(value)) {
          value.forEach((v) => formData.append(`${key}[]`, v));
        } else {
          formData.append(key, value);
        }
      });
      // The backend may expect a POST with _method=PUT when receiving FormData
      formData.append('_method', 'PUT');
      dataToSend = formData;
      headers['Content-Type'] = 'multipart/form-data';
      // Use POST when sending multipart FormData with method override
  const response = await http.post(`/events/${eventId}`, dataToSend, { headers });
      return response.data;
    }

    // If already FormData, send as PUT with multipart header
    headers['Content-Type'] = 'multipart/form-data';
  const response = await http.put(`/events/${eventId}`, dataToSend, { headers });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to update event' };
  }
};

// Delete an event (admin/organizer)
export const deleteEvent = async (eventId) => {
  const response = await http.delete(`/events/${eventId}`);
  return response.data;
};

// Toggle save status for an event
export const toggleSaveEvent = async (eventId) => {
  const response = await http.post(`/events/${eventId}/toggleSave`);
  return response.data;
};
