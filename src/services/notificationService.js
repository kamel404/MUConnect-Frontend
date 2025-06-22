import axios from 'axios';

const API_BASE = 'http://127.0.0.1:8000/api';

// Fetch all notifications for the current user
export const getNotifications = async (page = 1) => {
  try {
        const res = await axios.get(`${API_BASE}/notifications?page=${page}`, { withCredentials: true });
    return res.data;
  } catch (error) {
    throw error;
  }
};

// Mark a notification as read by ID
export const markNotificationAsRead = async (id) => {
  try {
    const res = await axios.patch(`${API_BASE}/notifications/${id}/read`, {}, { withCredentials: true });
    return res.data;
  } catch (error) {
    throw error;
  }
};

// Delete a notification by ID
export const deleteNotification = async (id) => {
  try {
    const res = await axios.delete(`${API_BASE}/notifications/${id}`, { withCredentials: true });
    return res.data;
  } catch (error) {
    throw error;
  }
};

// Mark ALL notifications as read (no body required)
export const markAllNotificationsAsRead = async () => {
  try {
    const res = await axios.put(`${API_BASE}/notifications`, {}, { withCredentials: true });
    return res.data;
  } catch (error) {
    throw error;
  }
};
