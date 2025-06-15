import axios from 'axios';

const API_BASE = 'http://127.0.0.1:8000/api';

// Fetch all notifications for the current user
export const getNotifications = async () => {
  try {
    const res = await axios.get(`${API_BASE}/notifications`, { withCredentials: true });
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
