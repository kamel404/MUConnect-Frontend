import axios from 'axios';
import { API_BASE_URL } from '../config/env.js';

const API_URL = API_BASE_URL;

export const getUserProfile = async () => {
  try {
    const response = await axios.get(`${API_URL}/my-profile`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};

export const updateUserProfile = async (userId, profileData) => {
  try {
    // Check if there's a file to upload (avatar)
    const hasFile = profileData.avatarFile instanceof File;
    
    let response;
    
    if (hasFile) {
      // Use FormData for file uploads
      const formData = new FormData();
      
      // Append file and other profile data
      formData.append('avatar', profileData.avatarFile);
        // Add method override for Laravel to handle PUT requests with FormData
      formData.append('_method', 'PUT');
      
      // Append other fields
      Object.keys(profileData).forEach(key => {
        // Skip the file object, as we've already appended it as 'avatar'
        if (key !== 'avatarFile' && key !== 'avatar' && profileData[key] !== undefined) {
          formData.append(key, profileData[key]);
        }
      });
        // Use POST for FormData with file uploads, with _method field for method spoofing
      response = await axios.post(`${API_URL}/user/${userId}`, formData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          'Content-Type': 'multipart/form-data'
        }
      });
    } else {
      // Regular JSON request
      response = await axios.put(`${API_URL}/user/${userId}`, profileData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json'
        }
      });
    }
    
    return response.data;
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};
