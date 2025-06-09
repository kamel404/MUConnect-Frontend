import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api';

// Service to fetch all courses (mocked for now, replace with API call if available)
export const fetchCourses = async () => {
  const res = await axios.get(`${API_URL}/courses`);
  // Return the array of courses from the paginated response
  return res.data.data;
};
