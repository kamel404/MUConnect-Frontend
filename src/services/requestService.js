import { http } from './httpClient';

export const updateApplicationStatus = async (applicationId, status) => {
  const token = localStorage.getItem('authToken');
  if (!token) {
    throw new Error('No authentication token found');
  }

  const response = await http.put(`/applications/${applicationId}`, 
    { status }, 
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

// All endpoints now use the http client baseURL

// 1. View All Requests (Feed)
export const fetchAllRequests = async (params = {}) => {
  // params: { page, ... }
  const response = await http.get(`/requests`, { params });
  return response.data;
};

// 1b. View Requests with Filters
export const fetchFilteredRequests = async (filters = {}) => {
  // filters: { course_name, current_day, desired_day }
  const params = {};
  if (filters.course_name) params.course_name = filters.course_name;
  if (filters.current_day) params.current_day = filters.current_day;
  if (filters.desired_day) params.desired_day = filters.desired_day;
  const response = await http.get(`/requests`, { params });
  return response.data;
};

// 2. View My Requests (History)
export const fetchMyRequests = async (params = {}) => {
  // params: { page, ... }
  const response = await http.get(`/my-requests`, { params });
  return response.data;
};

// 2b. View My Applications (History)
export const fetchMyApplications = async () => {
  const response = await http.get(`/my-applications`);
  return response.data;
};

// 3. Create a Section Request
export const createSectionRequest = async (data) => {
  const response = await http.post(`/requests`, data);
  return response.data;
};

// 4. View a Specific Request
export const fetchRequestById = async (id) => {
  const response = await http.get(`/requests/${id}`);
  return response.data;
};

// 5. Update a Section Request
export const updateSectionRequest = async (id, data) => {
  const response = await http.put(`/requests/${id}`, data);
  return response.data;
};

// 6. Delete a Section Request
export const deleteSectionRequest = async (id) => {
  const response = await http.delete(`/requests/${id}`);
  return response.data;
};

// 7. Apply to a Section Request
export const applyToRequest = async (id, payload = {}) => {
  // payload may include a reason, etc.
  const response = await http.post(`/requests/${id}/apply`, payload);
  return response.data;
};

// 8. View All Applications for a Request (owner only)
export const fetchApplicationsForRequest = async (id) => {
  const response = await http.get(`/requests/${id}/applications`);
  return response.data;
};

// 9. Approve an Application for a request
// send data with it like "status": "accepted" or "status": "rejected" or "status": "cancelled"
export const approveApplication = async (id, data) => {
  const response = await http.put(`/applications/${id}`, data);
  return response.data;
};

// 10. View a Specific Application
export const fetchApplicationById = async (id) => {
  const response = await http.get(`/applications/${id}`);
  return response.data;
};

// 11. Delete an Application (withdraw)
export const deleteApplication = async (id) => {
  const response = await http.put(`/applications/${id}/withdraw`);
  return response.data;
};
