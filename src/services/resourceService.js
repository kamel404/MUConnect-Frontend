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

// Get all resources
export const getAllResources = async () => {
  try {
    const response = await axios.get(`${API_URL}/resources`);
    return response.data;
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

// Create a new resource with attachments support
export const createResource = async ({ title, description, attachments, poll }) => {
  try {
    const formData = new FormData();
    
    // Add resource data
    if (title) formData.append('title', title);
    if (description) formData.append('description', description);
    
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
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to save resource' };
  }
};
