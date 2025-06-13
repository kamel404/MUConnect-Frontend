import axios from 'axios';

export const updateApplicationStatus = async (applicationId, status) => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No authentication token found');
  }

  const response = await axios.put(`/api/applications/${applicationId}`, 
    { status }, 
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

const API_URL = 'http://127.0.0.1:8000/api';

// 1. View All Requests (Feed)
export const fetchAllRequests = async () => {
  const response = await axios.get(`${API_URL}/requests`);
  return response.data;
};

// 2. View My Requests (History)
export const fetchMyRequests = async () => {
  const response = await axios.get(`${API_URL}/my-requests`);
  return response.data;
};

// 2b. View My Applications (History)
export const fetchMyApplications = async () => {
  const response = await axios.get(`${API_URL}/my-applications`);
  return response.data;
};

// 3. Create a Section Request
export const createSectionRequest = async (data) => {
  const response = await axios.post(`${API_URL}/requests`, data);
  return response.data;
};

// 4. View a Specific Request
export const fetchRequestById = async (id) => {
  const response = await axios.get(`${API_URL}/requests/${id}`);
  return response.data;
};

// 5. Update a Section Request
export const updateSectionRequest = async (id, data) => {
  const response = await axios.put(`${API_URL}/requests/${id}`, data);
  return response.data;
};

// 6. Delete a Section Request
export const deleteSectionRequest = async (id) => {
  const response = await axios.delete(`${API_URL}/requests/${id}`);
  return response.data;
};

// 7. Apply to a Section Request
export const applyToRequest = async (id, payload = {}) => {
  // payload may include a reason, etc.
  const response = await axios.post(`${API_URL}/requests/${id}/apply`, payload);
  return response.data;
};

// 8. View All Applications for a Request (owner only)
export const fetchApplicationsForRequest = async (id) => {
  const response = await axios.get(`${API_URL}/requests/${id}/applications`);
  return response.data;
};

// 9. Approve an Application for a request
// send data with it like "status": "accepted" or "status": "rejected" or "status": "cancelled"
export const approveApplication = async (id, data) => {
  const response = await axios.put(`${API_URL}/applications/${id}`, data);
  return response.data;
};

// 10. View a Specific Application
export const fetchApplicationById = async (id) => {
  const response = await axios.get(`${API_URL}/applications/${id}`);
  return response.data;
};

// 11. Delete an Application (withdraw)
export const deleteApplication = async (id) => {
  const response = await axios.put(`${API_URL}/applications/${id}/withdraw`);
  return response.data;
};
