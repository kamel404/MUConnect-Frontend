import { http } from './httpClient';

// Get list of all users (admin only). Relies on http client's baseURL; only appends query when provided.
export const getUsers = async (search = '') => {
  try {
    const endpoint = search ? `/users?search=${encodeURIComponent(search)}` : '/users';
    const response = await http.get(endpoint);
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

// Toggle active status for a user (admin only)
export const toggleUserActive = async (id) => {
  try {
    const response = await http.patch(`/users/${id}/toggle-active`, {});
    return response.data;
  } catch (error) {
    console.error('Error toggling user active status:', error);
    throw error;
  }
};

export const getUserProfileVisitor = async (id = 'me') => {
  try {
    const response = await http.get(`/users/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching visitor profile:', error);
    throw error;
  }
};

// Update user role (admin only)
export const updateUserRole = async (id, role) => {
  try {
    const response = await http.put(`/users/${id}/roles`, { role });
    return response.data;
  } catch (error) {
    console.error('Error updating user role:', error);
    throw error;
  }
};
