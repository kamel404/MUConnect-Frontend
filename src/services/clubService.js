import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api';

// 1. Get all clubs
export const getClubs = async (page = 1, query = '') => {
  try {
    const response = await axios.get(`${API_URL}/clubs`, {
      params: { page, query: query || undefined }, // Pass search only if it has a value
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch clubs' };
  }
};

// 2. Create a new club
export const createClub = async (clubData) => {
  try {
    const response = await axios.post(`${API_URL}/clubs`, clubData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to create club' };
  }
};

// 3. Create an event for a club
export const createClubEvent = async (clubId, eventData) => {
  try {
    const response = await axios.post(`${API_URL}/clubs/${clubId}/events`, eventData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to create club event' };
  }
};

// 4. Join a club
export const joinClub = async (clubId) => {
  try {
    const response = await axios.post(`${API_URL}/clubs/${clubId}/join`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to join club' };
  }
};

// 5. Leave a club
export const leaveClub = async (clubId) => {
  try {
    const response = await axios.post(`${API_URL}/clubs/${clubId}/leave`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to leave club' };
  }
};

// 6. Get clubs the current user has joined
export const getMyClubs = async (page = 1) => {
  try {
    const response = await axios.get(`${API_URL}/my-clubs?page=${page}`, {
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch your clubs' };
  }
};


