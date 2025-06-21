import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api';

const getAuthToken = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  return user ? user.token : null;
};

const getFaculties = async () => {
  try {
    const response = await axios.get(`${API_URL}/registration/faculties`, {
      headers: {
        Authorization: `Bearer ${getAuthToken()}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching faculties:', error);
    return [];
  }
};

const getMajorsByFaculty = async (facultyId) => {
  if (!facultyId) return [];
  try {
    const response = await axios.get(`${API_URL}/registration/faculties/${facultyId}/majors`, {
      headers: {
        Authorization: `Bearer ${getAuthToken()}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching majors:', error);
    return [];
  }
};

const getCoursesByMajor = async (majorId, page = 1) => {
  if (!majorId) return { data: [], current_page: 1, last_page: 1 };
  try {
    const response = await axios.get(`${API_URL}/courses?major_id=${majorId}&page=${page}`, {
      headers: {
        Authorization: `Bearer ${getAuthToken()}`
      }
    });
    return response.data; // Return the full pagination object
  } catch (error) {
    console.error('Error fetching courses:', error);
    return { data: [], current_page: 1, last_page: 1 };
  }
};

export { getFaculties, getMajorsByFaculty, getCoursesByMajor };
