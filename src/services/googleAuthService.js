import { http } from './httpClient';
import { API_BASE_URL, FILES_BASE_URL } from '../config/env';
const API_URL = API_BASE_URL;
const BASE_URL = FILES_BASE_URL; // Base URL without /api prefix for auth routes

/**
 * Initiates Google Sign-In process by redirecting to backend endpoint
 * The backend will handle the OAuth flow with Google
 * This function should be called when the "Sign in with Google" button is clicked
 */
export const initiateGoogleSignIn = () => {
  try {
    // Store the current URL to return to after authentication (optional)
    localStorage.setItem('authRedirectUrl', window.location.href);
    
    // Log the redirect URL for debugging
    console.log('Redirecting to Google Sign-In:', `${BASE_URL}/auth/google/redirect`);
    
    // Redirect to backend endpoint that will handle Google OAuth
    window.location.href = `${BASE_URL}/auth/google/redirect`;
  } catch (error) {
    console.error('Error during Google Sign-In redirect:', error);
  }
};

/**
 * Alternative direct link to Google Sign-In for testing
 * This is a helper function to print the URL that should be used
 * in case the automatic redirect isn't working
 */
export const getGoogleSignInUrl = () => {
  return `${BASE_URL}/auth/google/redirect`;
};

/**
 * Handles the completion of Google registration for new users
 * @param {Object} registrationData - Data containing temp_token and user details
 * @returns {Promise} - Promise resolving to user data
 */
/**
 * Completes the Google registration process for new users
 * This uses the API endpoint which doesn't require CSRF token
 */
export const completeGoogleRegistration = async (registrationData) => {
  try {
    // Using API route that doesn't require CSRF token
  const response = await http.post(`/auth/google/complete-registration`, registrationData);
    
    if (response.data.token) {
      localStorage.setItem('authToken', response.data.token);
      
      // Store faculty/major if available
      if (response.data.user?.faculty) {
        localStorage.setItem('userFaculty', response.data.user.faculty.name);
        localStorage.setItem('faculty_id', response.data.user.faculty.id);
      }
      if (response.data.user?.major) {
        localStorage.setItem('userMajor', response.data.user.major.name);
        localStorage.setItem('major_id', response.data.user.major.id);
      }
      if (response.data.user?.roles && response.data.user.roles[0]) {
        localStorage.setItem('role', response.data.user.roles[0]);
      }
    }
    
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Registration completion failed' };
  }
};

/**
 * Processes temporary token stored from Google callback
 * Used for retrieving stored token when returning to complete registration
 */
export const getStoredGoogleTempToken = () => {
  return localStorage.getItem('googleTempToken');
};

/**
 * Stores Google temporary token
 * @param {string} token - Temporary token from Google callback
 */
export const storeGoogleTempToken = (token) => {
  localStorage.setItem('googleTempToken', token);
};

// Function to remove the Google temporary token from localStorage
export const removeGoogleTempToken = () => {
  localStorage.removeItem('googleTempToken');
};

/**
 * Logs out a user who was authenticated with Google
 * This properly revokes the token on the server side
 * @returns {Promise<Object>} - Promise resolving to the logout response
 */
export const logoutGoogleUser = async () => {
  try {
    // Get the token from localStorage
    const token = localStorage.getItem('authToken');
    
    if (!token) {
      console.warn('No auth token found for logout');
      return { success: false, message: 'No authentication token found' };
    }
    
    // Call the backend logout endpoint with the token
  const response = await http.post(`/auth/google/logout`, {});
    
    // Clear local storage regardless of the response
    localStorage.clear();
    sessionStorage.clear();
    
    return response.data;
  } catch (error) {
    console.error('Error during Google logout:', error);
    
    // Still clear storage even if the API call fails
    localStorage.clear();
    sessionStorage.clear();
    
    throw error;
  }
};
