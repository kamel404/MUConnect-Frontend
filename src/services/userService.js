import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api';

// Fetch a user's public profile. If the provided id is 'me', it will use the /users/me endpoint
export const getUserProfileVisitor = async () => {
  try {
    const response = await axios.get(`${API_URL}/users/me`, {
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
