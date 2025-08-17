import { http } from './httpClient';

const getAuthToken = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  return user ? user.token : null;
};

const getFaculties = async () => {
  try {
  const response = await http.get(`/registration/faculties`);
    return response.data;
  } catch (error) {
    console.error('Error fetching faculties:', error);
    return [];
  }
};

const getMajorsByFaculty = async (facultyId) => {
  if (!facultyId) return [];
  try {
  const response = await http.get(`/registration/faculties/${facultyId}/majors`);
    return response.data;
  } catch (error) {
    console.error('Error fetching majors:', error);
    return [];
  }
};

const getCoursesByMajor = async (majorId, page = 1) => {
  if (!majorId) return { data: [], current_page: 1, last_page: 1 };
  try {
  const response = await http.get(`/courses`, { params: { major_id: majorId, page } });
    return response.data; // Return the full pagination object
  } catch (error) {
    console.error('Error fetching courses:', error);
    return { data: [], current_page: 1, last_page: 1 };
  }
};

export { getFaculties, getMajorsByFaculty, getCoursesByMajor };
