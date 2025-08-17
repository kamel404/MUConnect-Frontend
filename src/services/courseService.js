import { http } from './httpClient';

// Service to fetch all courses (mocked for now, replace with API call if available)
// Accepts params for pagination and filtering (e.g., { page, per_page, major_id, faculty_id })
export const fetchCourses = async (params = {}) => {
  const res = await http.get(`/courses`, { params });
  // Return the full paginated response (not just data)
  return res.data;
};
