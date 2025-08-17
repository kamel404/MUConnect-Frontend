import { http } from './httpClient';

// Fetch all notifications for the current user
export const getNotifications = async (page = 1) => {
  try {
  const res = await http.get(`/notifications`, { params: { page } });
    return res.data;
  } catch (error) {
    throw error;
  }
};

// Mark a notification as read by ID
export const markNotificationAsRead = async (id) => {
  try {
  const res = await http.patch(`/notifications/${id}/read`, {});
    return res.data;
  } catch (error) {
    throw error;
  }
};

// Delete a notification by ID
export const deleteNotification = async (id) => {
  try {
  const res = await http.delete(`/notifications/${id}`);
    return res.data;
  } catch (error) {
    throw error;
  }
};

// Mark ALL notifications as read (no body required)
export const markAllNotificationsAsRead = async () => {
  try {
  const res = await http.put(`/notifications`, {});
    return res.data;
  } catch (error) {
    throw error;
  }
};
