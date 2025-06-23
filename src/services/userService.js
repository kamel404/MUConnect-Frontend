import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api';

// Fetch a user's public profile. If the provided id is 'me', it will use the /users/me endpoint
// Get list of all users (admin only)
export const getUsers = async (search = '') => {
  try {
    const url = search ? `${API_URL}/users?search=${encodeURIComponent(search)}` : `${API_URL}/users`;
  const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

// Toggle active status for a user (admin only)
export const toggleUserActive = async (id) => {
  try {
    const response = await axios.patch(`${API_URL}/users/${id}/toggle-active`, {}, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error toggling user active status:', error);
    throw error;
  }
};

export const getUserProfileVisitor = async (id = 'me') => {
  try {
    const endpoint =  `${API_URL}/users/${id}`;
    const response = await axios.get(endpoint, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching visitor profile:', error);
    throw error;
  }
};
