import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api';

/**
 * Resource Service
 * 
 * Provides methods to interact with the resource-related endpoints.
 * All endpoints require authentication which is handled by the axios interceptor
 * configured in authService.js
 */

const getToken = () => {
  return localStorage.getItem('token');
};

// ---- CACHING CONFIGURATION ----
// Cache expiration time (ms). Shorter duration ensures fresh data but still avoids redundant requests.
const CACHE_EXPIRATION_MS = 2 * 60 * 1000; // 2 minutes

// Generate a cache key based on request parameters
const generateCacheKey = (params) => {
  // Sort keys to ensure consistent cache keys regardless of object property order
  const sortedParams = Object.keys(params).sort().reduce((acc, key) => {
    acc[key] = params[key];
    return acc;
  }, {});
  
  return `resources_${JSON.stringify(sortedParams)}`;
};

// Get all resources with caching support
// Returns an object: { resources: [], pagination: { ... } }
// This keeps compatibility with existing code that expects an array (Resources.jsx)
// while still exposing pagination details if needed later.
export const getAllResources = async (params = {}, useCache = true) => {
  try {
    // If we're using the cache and have window available (browser environment)
    if (useCache && typeof window !== 'undefined') {
      // Generate a unique cache key based on the request parameters
      const cacheKey = generateCacheKey(params);
      
      // Check if we have this data in sessionStorage
      const cachedData = sessionStorage.getItem(cacheKey);
      
      if (cachedData) {
        try {
          // Parse the cached data
          const parsedData = JSON.parse(cachedData);
          
          // Check if the cache is still valid
          const now = Date.now();
          if (now - parsedData.timestamp < CACHE_EXPIRATION_MS) {
            console.log('Using cached resources data');
            return parsedData.data;
          }
        } catch (e) {
          console.error('Error parsing cached data:', e);
          // Continue with API request if cache parsing fails
        }
      }
      
      // If we don't have valid cached data, make the API request
      const response = await axios.get(`${API_URL}/resources`, { params });
      
      let result;
      // 1. If backend returns an array directly
      if (Array.isArray(response.data)) {
        result = response.data;
      }
      // 2. If backend wraps resources in a "data" key (Laravel style)
      else if (response.data && Array.isArray(response.data.data)) {
        result = response.data.data;
        // Attach pagination meta to the array so existing code keeps working
        result.pagination = response.data.pagination || null;
      }
      // 3. Unknown structure – fail gracefully
      else {
        result = [];
      }
      
      // Cache the result with a timestamp
      try {
        sessionStorage.setItem(cacheKey, JSON.stringify({
          data: result,
          timestamp: Date.now()
        }));
      } catch (e) {
        console.error('Error caching resources data:', e);
        // Continue even if caching fails
      }
      
      return result;
    } else {
      // If not using cache, proceed with normal API request
      const response = await axios.get(`${API_URL}/resources`, { params });

      // 1. If backend returns an array directly, just forward it.
      if (Array.isArray(response.data)) return response.data;

      // 2. If backend wraps resources in a "data" key (Laravel style)
      if (response.data && Array.isArray(response.data.data)) {
        const resourcesArray = response.data.data;
        // Attach pagination meta to the array so existing code keeps working
        resourcesArray.pagination = response.data.pagination || null;
        return resourcesArray;
      }

      // 3. Unknown structure – fail gracefully
      return [];
    }
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch resources' };
  }
};

// Get a single resource by ID
export const getResourceById = async (resourceId) => {
  try {
    const response = await axios.get(`${API_URL}/resources/${resourceId}`);
    console.log('Resource fetched successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching resource:', error);
    throw error.response?.data || { message: 'Failed to fetch resource' };
  }
};

// Helper function to clear all resources cache entries
export const clearResourcesCache = () => {
  if (typeof window !== 'undefined') {
    // Get all keys from sessionStorage
    const keys = [];
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      if (key && key.startsWith('resources_')) {
        keys.push(key);
      }
    }
    
    // Remove all resource cache entries
    keys.forEach(key => sessionStorage.removeItem(key));
    console.log('Resources cache cleared');
  }
};

// Create a new resource with attachments support
export const createResource = async ({ title, description, attachments, course_id, major_id, faculty_id, type, poll }) => {
  try {
    const formData = new FormData();
    
    // Add resource data
    if (title) formData.append('title', title);
    if (description) formData.append('description', description);
    // Add contextual IDs and type
    if (course_id) formData.append('course_id', course_id);
    if (major_id) formData.append('major_id', major_id);
    if (faculty_id) formData.append('faculty_id', faculty_id);
    if (type) formData.append('type', type);
    
    // Add attachment files (supports multiple)
    if (attachments && attachments.length) {
      for (let i = 0; i < attachments.length; i++) {
        formData.append('attachments[]', attachments[i]);
      }
    }

    // Add poll data if present
    if (poll && poll.question && poll.options && poll.options.length > 0) {
      formData.append('poll[question]', poll.question);
      poll.options.forEach(option => {
        // Ensure option is not just whitespace and is a string
        const trimmedOption = typeof option === 'string' ? option.trim() : ''; 
        if (trimmedOption) {
          formData.append('poll[options][]', trimmedOption);
        }
      });
      console.log('Poll data added to FormData for creation:', poll);
    }

    // Use axios with FormData configuration
    const response = await axios.post(`${API_URL}/resources`, formData, {
      headers: {
        // Don't set Content-Type - axios will set it automatically with the correct boundary
        'Content-Type': 'multipart/form-data'
      }
    });
    
    // Invalidate cache so updated resource list refreshes
clearResourcesCache();
return response.data.resource || response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to create resource' };
  }
};

// Update an existing resource with attachments support - improved to match backend changes
export const updateResource = async (resourceId, { title, description, newAttachments, removeAttachmentIds }) => {
  try {
    console.log('Updating resource with ID:', resourceId);
    const formData = new FormData();
    
    // Add method spoofing for PUT
    formData.append('_method', 'PUT');
    
    // Add updated resource data
    if (title !== undefined) {
      console.log('Setting title:', title);
      formData.append('title', title);
    }
    if (description !== undefined) {
      console.log('Setting description:', description);
      formData.append('description', description);
    }
    
    // Add new attachment files
    if (newAttachments && newAttachments.length) {
      console.log(`Adding ${newAttachments.length} new attachment(s)`);
      for (let i = 0; i < newAttachments.length; i++) {
        formData.append('attachments[]', newAttachments[i]);
        console.log(`Added attachment: ${newAttachments[i].name}`);
      }
    }
    
    // Handle attachments to remove (by ID)
    if (removeAttachmentIds) {
      // Handle both array and string formats
      const idsToRemove = Array.isArray(removeAttachmentIds) ? 
        removeAttachmentIds : 
        [removeAttachmentIds];
      
      if (idsToRemove.length) {
        console.log(`Removing ${idsToRemove.length} attachment(s)`);
        
        // Add each ID as a separate form field named remove_attachments[]
        idsToRemove.forEach(id => {
          if (id) {
            console.log(`Marking attachment for removal: ${id}`);
            formData.append('remove_attachments[]', id.toString());
          }
        });
      }
    }

    // Important: Do NOT manually set Content-Type header for multipart/form-data
    // Let axios set it automatically with the proper boundary
    // Using POST instead of PUT with method spoofing (_method: PUT)
    const response = await axios.post(`${API_URL}/resources/${resourceId}`, formData);
    
    console.log('Resource updated successfully:', response.data);
    // Invalidate cache so updated resource list refreshes
clearResourcesCache();
return response.data.resource || response.data;
  } catch (error) {
    console.error('Error updating resource:', error);
    console.error('Error details:', error.response?.data || 'Unknown error');
    throw error.response?.data || { message: 'Failed to update resource' };
  }
};

// Toggle upvote for a resource
export const toggleUpvote = async (resourceId) => {
  try {
    const response = await axios.post(`${API_URL}/resources/${resourceId}/toggle-upvote`, {}, {
      headers: {
        'Authorization': `Bearer ${getToken()}`
      }
    });
    
    // Clear any cached resources since upvote state has changed
    clearResourcesCache();
    
    return response.data;
  } catch (error) {
    console.error('Error toggling upvote:', error);
    throw error;
  }
};

// Comprehensive update function that handles attachments exactly as expected by CreatePostModal
export const updateResourceSimple = async (resourceId, resourceData) => {
  try {
    console.log('updateResourceSimple called with data:', resourceData);
    
    // Always use the full updateResource function to maintain consistent behavior
    // This ensures attachments are handled correctly whether they exist or not
    return updateResource(resourceId, {
      title: resourceData.title,
      description: resourceData.description,
      // Match the exact parameter names used in CreatePostModal
      newAttachments: resourceData.newAttachments || [], 
      removeAttachmentIds: resourceData.removeAttachmentIds || []
    });
  } catch (error) {
    console.error('Error updating resource:', error);
    throw error;
  }
};

// Comments API functions
export const getResourceComments = async (resourceId, page = 1, perPage = 10) => {
  try {
    const response = await axios.get(`${API_URL}/resources/${resourceId}/comments`, {
      params: {
        page,
        per_page: perPage
      },
      headers: {
        'Authorization': `Bearer ${getToken()}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching comments:', error);
    throw error;
  }
};

export const addComment = async (resourceId, body) => {
  try {
    const response = await axios.post(`${API_URL}/resources/${resourceId}/comments`, 
      { body }, 
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error adding comment:', error);
    throw error;
  }
};

export const updateComment = async (commentId, body) => {
  try {
    const response = await axios.put(`${API_URL}/comments/${commentId}`, 
      { body },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error updating comment:', error);
    throw error;
  }
};

export const deleteComment = async (commentId) => {
  try {
    const response = await axios.delete(`${API_URL}/comments/${commentId}`, {
      headers: {
        'Authorization': `Bearer ${getToken()}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting comment:', error);
    throw error;
  }
};

// Vote or unvote / switch vote for a poll option
export const votePollOption = async (optionId) => {
  try {
    const response = await axios.post(`${API_URL}/poll-options/${optionId}/vote`, {}, {
      headers: {
        'Authorization': `Bearer ${getToken()}`,
      },
    });
    // The backend returns { message, poll }
    return response.data;
  } catch (error) {
    console.error('Error voting poll option:', error);
    throw error.response?.data || { message: 'Failed to record vote' };
  }
};

export const toggleCommentUpvote = async (commentId) => {
  try {
    const response = await axios.post(`${API_URL}/comments/${commentId}/toggle-upvote`, {}, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error toggling comment upvote:', error);
    throw error;
  }
};

// Delete a resource
export const deleteResource = async (resourceId) => {
  try {
    const response = await axios.delete(`${API_URL}/resources/${resourceId}`);
    
    // Clear cache after deleting a resource
    clearResourcesCache();
    
    return response.data;
  } catch (error) {
    console.error('Error deleting resource:', error);
    throw error.response?.data || { message: 'Failed to delete resource' };
  }
};

// Save a resource to user collection
export const toggleSaveResource = async (resourceId) => {
  try {
    const response = await axios.post(`${API_URL}/resources/${resourceId}/toggleSave`);
    
    // Clear cache after toggling save state
    clearResourcesCache();
    
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to save resource' };
  }
};

// Get all saved items for the current user
export const getSavedItems = async (params = {}) => {
  try {
    const response = await axios.get(`${API_URL}/saved-items`, { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch saved items' };
  }
};

// Get top contributors in the system
export const getTopContributors = async (limit = 3) => {
  try {
    const response = await axios.get(`${API_URL}/top-contributors`, { 
      params: { limit } 
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching top contributors:', error);
    throw error.response?.data || { message: 'Failed to fetch top contributors' };
  }
};

// Generate quiz for a resource
export const generateQuiz = async (resourceId, attachmentId = null) => {
  try {
    const response = await axios.get(`${API_URL}/resources/${resourceId}/generate-quiz`, {
      params: attachmentId ? { attachment_id: attachmentId } : {},
    });
    return response.data;
  } catch (error) {
    console.error('Error generating quiz:', error);
    throw error.response?.data || { message: 'Failed to generate quiz' };
  }
};
