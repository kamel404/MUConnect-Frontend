import { http } from './httpClient';
import { FILES_BASE_URL } from '../config/env';

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

export const getAllResources = async (params = {}) => {
  try {
      // Automatically apply user's faculty and major as default filters (personalized view)
      const finalParams = { ...params };
      if (!finalParams.faculty_id || !finalParams.major_id) {
        // First try to extract from a stored `user` object
        const userDetails = JSON.parse(localStorage.getItem('user') || '{}');
        if (!finalParams.faculty_id) {
          finalParams.faculty_id = userDetails.faculty_id || localStorage.getItem('faculty_id');
        }
        if (!finalParams.major_id) {
          finalParams.major_id = userDetails.major_id || localStorage.getItem('major_id');
        }
      }

  const response = await http.get(`/resources`, { params: finalParams });

      if (Array.isArray(response.data)) return response.data;

      if (response.data && Array.isArray(response.data.data)) {
        const resourcesArray = response.data.data;
        resourcesArray.pagination = response.data.pagination || null;
        return resourcesArray;
      }

      return [];
    
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch resources' };
  }
};

// Get a single resource by ID
export const getResourceById = async (resourceId) => {
  try {
  const response = await http.get(`/resources/${resourceId}`);
    console.log('Resource fetched successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching resource:', error);
    throw error.response?.data || { message: 'Failed to fetch resource' };
  }
};


// Create a new resource with attachments support
export const createResource = async ({ title, description, attachments, course_id, major_id, faculty_id, type, poll }) => {
  try {
    const formData = new FormData();
    
    if (title) formData.append('title', title);
    if (description) formData.append('description', description);
    if (course_id) formData.append('course_id', course_id);
    if (major_id) formData.append('major_id', major_id);
    if (faculty_id) formData.append('faculty_id', faculty_id);
    if (type) formData.append('type', type);
    
    if (attachments && attachments.length) {
      for (let i = 0; i < attachments.length; i++) {
        formData.append('attachments[]', attachments[i]);
      }
    }

    if (poll && poll.question && poll.options && poll.options.length > 0) {
      formData.append('poll[question]', poll.question);
      poll.options.forEach(option => {
        const trimmedOption = typeof option === 'string' ? option.trim() : ''; 
        if (trimmedOption) {
          formData.append('poll[options][]', trimmedOption);
        }
      });
      console.log('Poll data added to FormData for creation:', poll);
    }

  const response = await http.post(`/resources`, formData, {
      headers: {
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
    
    formData.append('_method', 'PUT');
    
    if (title !== undefined) {
      console.log('Setting title:', title);
      formData.append('title', title);
    }
    if (description !== undefined) {
      console.log('Setting description:', description);
      formData.append('description', description);
    }
    
    if (newAttachments && newAttachments.length) {
      console.log(`Adding ${newAttachments.length} new attachment(s)`);
      for (let i = 0; i < newAttachments.length; i++) {
        formData.append('attachments[]', newAttachments[i]);
        console.log(`Added attachment: ${newAttachments[i].name}`);
      }
    }
    
    if (removeAttachmentIds) {
      const idsToRemove = Array.isArray(removeAttachmentIds) ? 
        removeAttachmentIds : 
        [removeAttachmentIds];
      
      if (idsToRemove.length) {
        console.log(`Removing ${idsToRemove.length} attachment(s)`);
        
        idsToRemove.forEach(id => {
          if (id) {
            console.log(`Marking attachment for removal: ${id}`);
            formData.append('remove_attachments[]', id.toString());
          }
        });
      }
    }

  const response = await http.post(`/resources/${resourceId}`, formData);
    
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
  const response = await http.post(`/resources/${resourceId}/toggle-upvote`, {}, {
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
    
    return updateResource(resourceId, {
      title: resourceData.title,
      description: resourceData.description,
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
  const response = await http.get(`/resources/${resourceId}/comments`, {
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
  const response = await http.post(`/resources/${resourceId}/comments`, 
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
  const response = await http.put(`/comments/${commentId}`, 
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
  const response = await http.delete(`/comments/${commentId}`, {
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
  const response = await http.post(`/poll-options/${optionId}/vote`, {}, {
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
  const response = await http.post(`/comments/${commentId}/toggle-upvote`, {}, {
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
  const response = await http.delete(`/resources/${resourceId}`);
    
    return response.data;
  } catch (error) {
    console.error('Error deleting resource:', error);
    throw error.response?.data || { message: 'Failed to delete resource' };
  }
};

// Save a resource to user collection
export const toggleSaveResource = async (resourceId) => {
  try {
  const response = await http.post(`/resources/${resourceId}/toggleSave`);
    
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to save resource' };
  }
};

// Get all saved items for the current user
export const getSavedItems = async (params = {}) => {
  try {
  const response = await http.get(`/saved-items`, { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch saved items' };
  }
};

// Get top contributors in the system
export const getTopContributors = async (limit) => {
  try {
  const response = await http.get(`/top-contributors`, { 
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
    const params = {};
    if (attachmentId) params.attachment_id = attachmentId;

    const response = await http.get(`/resources/${resourceId}/generate-quiz`, { params });
    return response.data; // Should contain content_id and status
  } catch (error) {
    console.error('Error initiating quiz generation:', error);
    throw error.response?.data || { message: 'Failed to initiate quiz generation' };
  }
};

// Generate summary for a resource
export const generateSummary = async (resourceId, attachmentId = null) => {
  try {
    const params = {};
    if (attachmentId) params.attachment_id = attachmentId;

    const response = await http.get(`/resources/${resourceId}/generate-summary`, { params });
    return response.data; // Should contain content_id and status
  } catch (error) {
    console.error('Error initiating summary generation:', error);
    throw error.response?.data || { message: 'Failed to initiate summary generation' };
  }
};

// Poll for AI content status
export const pollAIContentStatus = async (contentId) => {
  try {
    const response = await http.get(`/ai-content/${contentId}/status`);
    return response.data; // Should contain status and progress
  } catch (error) {
    console.error('Error polling AI content status:', error);
    throw error.response?.data || { message: 'Failed to check generation status' };
  }
};
