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

// 7. Add a new candidate to a club
export const addCandidate = async (clubId, name) => {
  try {
    const response = await axios.post(`${API_URL}/clubs/${clubId}/candidates`, { name });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to add candidate' };
  }
};

// 8. Get all candidates for a club 
export const getCandidates = async (clubId) => {
  try {
    const response = await axios.get(`${API_URL}/clubs/${clubId}/candidates`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to get candidates' };
  }
};

// 9. Vote for a candidate in a club
export const voteForCandidate = async (clubId, voteData) => {
  try {
    const response = await axios.post(`${API_URL}/clubs/${clubId}/vote`, voteData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to cast vote' };
  }
};

// 10. Get voting results for a club
export const getVoteResults = async (clubId) => {
  try {
    const response = await axios.get(`${API_URL}/clubs/${clubId}/results`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to get vote results' };
  }
};

// 11. Get user's voting status for a club
export const getVoteStatus = async (clubId) => {
  try {
    const response = await axios.get(`${API_URL}/clubs/${clubId}/vote-status`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to get vote status' };
  }
};

// 12. Get current voting system status
export const getVotingSystemStatus = async () => {
  try {
    const response = await axios.get(`${API_URL}/voting-status`);
    // Return the voting_status from the response data
    return response.data?.voting_status || 'closed';
  } catch (error) {
    console.error('Error getting voting status:', error);
    return 'closed'; // Default to closed if there's an error
  }
};

// 13. Update voting system status (open/close)
export const updateVotingSystemStatus = async (status) => {
  try {
    const response = await axios.post(`${API_URL}/voting-status`, {
      voting_status: status
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to update voting system status' };
  }
};


