import { http } from './httpClient';
import { FILES_BASE_URL } from '../config/env';

// Helper function to construct full CDN URL from relative path
const constructCdnUrl = (relativePath) => {
  if (!relativePath) return null;
  if (relativePath.startsWith('http')) return relativePath;
  return `${FILES_BASE_URL}/${relativePath}`;
};

// 1. Get all clubs
export const getClubs = async (page = 1, query = '') => {
  try {
  const response = await http.get(`/clubs`, {
      params: { page, query: query || undefined }, // Pass search only if it has a value
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
    
    // Transform logo paths to full CDN URLs
    if (response.data && response.data.data) {
      response.data.data = response.data.data.map(club => ({
        ...club,
        logo: constructCdnUrl(club.logo)
      }));
    }
    
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch clubs' };
  }
};

// 2. Get club details with members
export const getClubDetails = async (clubId) => {
  try {
    const response = await http.get(`/clubs/${clubId}`);
    
    // Transform logo and member pictures to full CDN URLs
    if (response.data) {
      response.data.logo = constructCdnUrl(response.data.logo);
      
      if (response.data.club_members && Array.isArray(response.data.club_members)) {
        response.data.club_members = response.data.club_members.map(member => ({
          ...member,
          picture: constructCdnUrl(member.picture)
        }));
      }
    }
    
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch club details' };
  }
};

// 3. Add a member to a club
export const addClubMember = async (clubId, memberData) => {
  try {
    const response = await http.post(`/clubs/${clubId}/members`, memberData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to add club member' };
  }
};

// 4. Update a club member
export const updateClubMember = async (clubId, memberId, memberData) => {
  try {
    const config = {};
    let url = `/clubs/${clubId}/members/${memberId}`;
    if (memberData instanceof FormData) {
      url += '?_method=PUT';
      config.headers = { 'Content-Type': 'multipart/form-data' };
    }
    const response = await http.post(url, memberData, config);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to update club member' };
  }
};

// 5. Delete a club member
export const deleteClubMember = async (clubId, memberId) => {
  try {
    const response = await http.delete(`/clubs/${clubId}/members/${memberId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to delete club member' };
  }
};

// 6. Create a new club
export const createClub = async (clubData) => {
  try {
  const response = await http.post(`/clubs`, clubData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to create club' };
  }
};

// 7. Create an event for a club
export const createClubEvent = async (clubId, eventData) => {
  try {
  const response = await http.post(`/clubs/${clubId}/events`, eventData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to create club event' };
  }
};

// 8. Update a club (PUT /clubs/{clubId})
// Accepts FormData so that logo image can be updated. If you are sending JSON,
// pass a plain object and omit the multipart headers.
export const updateClub = async (clubId, clubData) => {
  try {
    // When using multipart/form-data with Laravel, we can use method spoofing
    // by sending a POST with _method=PUT query param or body. Adjust if backend
    // supports actual PUT with multipart.
    const config = {};
  let url = `/clubs/${clubId}`;
    if (clubData instanceof FormData) {
      url += '?_method=PUT';
      config.headers = { 'Content-Type': 'multipart/form-data' };
    }
  const response = await http.post(url, clubData, config);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to update club' };
  }
};

// 9. Delete a club (DELETE /clubs/{clubId})
export const deleteClub = async (clubId) => {
  try {
  const response = await http.delete(`/clubs/${clubId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to delete club' };
  }
};


