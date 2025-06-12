import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api';

// Service to fetch all courses (mocked for now, replace with API call if available)
// Accepts params for pagination and filtering (e.g., { page, per_page, major_id, faculty_id })
export const fetchCourses = async (params = {}) => {
  const res = await axios.get(`${API_URL}/courses`, { params });
  // Return the full paginated response (not just data)
  return res.data;
};
