import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api';

// Helper to get token from localStorage
export const getToken = () => localStorage.getItem('authToken');

// Axios interceptor to add Authorization header automatically
axios.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Register a new user (and store token if returned)
export const register = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/register`, userData);
    if (response.data.token) {
      localStorage.setItem('authToken', response.data.token);
    }
    // Optionally store faculty/major
    if (userData.faculty) {
      localStorage.setItem('userFaculty', userData.faculty);
    }
    if (userData.major) {
      localStorage.setItem('userMajor', userData.major);
    }
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Registration failed' };
  }
};

// Login user (and store token if returned)
// Login user (Sanctum SPA flow)
export const login = async (credentials) => {
  try {
    const response = await axios.post(`${API_URL}/login`, credentials);
    if (response.data.token) {
      localStorage.setItem('authToken', response.data.token);
    }
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Login failed' };
  }
};

// Logout user (Sanctum SPA flow)
export const logout = async () => {
  try {
    const token = getToken();
    if (token) {
      await axios.post(`${API_URL}/logout`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
    }
  } catch (error) {
    // ignore error
  }
  localStorage.clear();
};

// Get the currently authenticated user (and role)
export const getCurrentUser = async () => {
  const token = getToken();
  if (!token) return null;
  try {
    const response = await axios.get(`${API_URL}/users/me`);
    localStorage.setItem('userFaculty', response.data.faculty.name);
    localStorage.setItem('userMajor', response.data.major.name);
    localStorage.setItem('faculty_id', response.data.faculty.id);
    localStorage.setItem('major_id', response.data.major.id);
    return response.data;
  } catch (error) {
    return null;
  }
};

export const getUserPreferences = () => {
  return {
    faculty: localStorage.getItem('userFaculty'),
    major: localStorage.getItem('userMajor'),
  };
};

// Fetch all faculties for registration
export const getFaculties = async () => {
  try {
    const response = await axios.get(`${API_URL}/registration/faculties`, { withCredentials: true });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to load faculties' };
  }
};

// Fetch majors for a given faculty
export const getMajors = async (facultyId) => {
  try {
    const response = await axios.get(`${API_URL}/registration/faculties/${facultyId}/majors`, { withCredentials: true });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to load majors' };
  }
};
