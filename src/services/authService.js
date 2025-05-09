import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api';

export const register = async (userData) => {
  try {
    // Save the user data in localStorage for personalization purposes
    if (userData.faculty && userData.major) {
      localStorage.setItem('userFaculty', userData.faculty);
      localStorage.setItem('userMajor', userData.major);
    }
    
    const response = await axios.post(`${API_URL}/register`, userData);
    if (response.data.token) {
      localStorage.setItem('userToken', response.data.token);
    }
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Registration failed' };
  }
};

export const login = async (credentials) => {
  try {
    const response = await axios.post(`${API_URL}/login`, credentials);
    if (response.data.token) {
      localStorage.setItem('userToken', response.data.token);
    }
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Login failed' };
  }
};

export const logout = () => {
  localStorage.removeItem('userToken');
  localStorage.removeItem('userFaculty');
  localStorage.removeItem('userMajor');
};

export const getUserPreferences = () => {
  return {
    faculty: localStorage.getItem('userFaculty'),
    major: localStorage.getItem('userMajor')
  };
};
