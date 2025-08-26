import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { getFaculties, getMajorsByFaculty, getCoursesByMajor } from "../services/filterService";
import { getFaculties as getAuthFaculties, getMajors as getAuthMajors } from "../services/authService";

const AcademicDataContext = createContext();

export const AcademicDataProvider = ({ children }) => {
  // State for academic data
  const [faculties, setFaculties] = useState([]);
  const [majors, setMajors] = useState([]);
  const [courses, setCourses] = useState({ data: [], current_page: 1, last_page: 1 });
  
  // Loading states
  const [facultiesLoading, setFacultiesLoading] = useState(false);
  const [majorsLoading, setMajorsLoading] = useState(false);
  const [coursesLoading, setCoursesLoading] = useState(false);
  
  // Error states
  const [facultiesError, setFacultiesError] = useState(null);
  const [majorsError, setMajorsError] = useState(null);
  const [coursesError, setCoursesError] = useState(null);
  
  // Current selections
  const [selectedFaculty, setSelectedFaculty] = useState('All');
  const [selectedMajor, setSelectedMajor] = useState('All');
  const [coursePage, setCoursePage] = useState(1);

  // Get user's default academic info from localStorage
  const getUserDefaults = useCallback(() => {
    try {
      const userDetails = JSON.parse(localStorage.getItem('user') || '{}');
      return {
        facultyId: userDetails?.faculty_id,
        majorId: userDetails?.major_id,
      };
    } catch (error) {
      console.error('Error parsing user data:', error);
      return { facultyId: null, majorId: null };
    }
  }, []);

  // Fetch faculties (with optional auth service fallback)
  const fetchFaculties = useCallback(async (useAuthService = false) => {
    setFacultiesLoading(true);
    setFacultiesError(null);
    
    try {
      let data;
      if (useAuthService) {
        data = await getAuthFaculties();
      } else {
        data = await getFaculties();
      }
      
      setFaculties(data || []);
      
      // Set user's default faculty if available
      const { facultyId } = getUserDefaults();
      if (facultyId && data?.find(f => f.id === parseInt(facultyId))) {
        setSelectedFaculty(facultyId);
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching faculties:', error);
      setFacultiesError(error.message || 'Failed to load faculties');
      setFaculties([]);
      throw error;
    } finally {
      setFacultiesLoading(false);
    }
  }, [getUserDefaults]);

  // Fetch majors by faculty
  const fetchMajorsByFacultyId = useCallback(async (facultyId, useAuthService = false) => {
    if (!facultyId || facultyId === 'All') {
      setMajors([]);
      setSelectedMajor('All');
      return [];
    }

    setMajorsLoading(true);
    setMajorsError(null);
    
    try {
      let data;
      if (useAuthService) {
        data = await getAuthMajors(facultyId);
      } else {
        data = await getMajorsByFaculty(facultyId);
      }
      
      setMajors(data || []);
      
      // Set user's default major if it belongs to this faculty
      const { facultyId: userFacultyId, majorId } = getUserDefaults();
      if (majorId && parseInt(userFacultyId) === parseInt(facultyId) && data?.find(m => m.id === parseInt(majorId))) {
        setSelectedMajor(majorId);
      } else {
        setSelectedMajor('All');
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching majors:', error);
      setMajorsError(error.message || 'Failed to load majors');
      setMajors([]);
      throw error;
    } finally {
      setMajorsLoading(false);
    }
  }, [getUserDefaults]);

  // Fetch courses by major (with pagination)
  const fetchCoursesByMajorId = useCallback(async (majorId, page = 1) => {
    if (!majorId || majorId === 'All') {
      setCourses({ data: [], current_page: 1, last_page: 1 });
      setCoursePage(1);
      return { data: [], current_page: 1, last_page: 1 };
    }

    setCoursesLoading(true);
    setCoursesError(null);
    
    try {
      const data = await getCoursesByMajor(majorId, page);
      setCourses(data || { data: [], current_page: 1, last_page: 1 });
      setCoursePage(data?.current_page || page);
      
      return data;
    } catch (error) {
      console.error('Error fetching courses:', error);
      setCoursesError(error.message || 'Failed to load courses');
      setCourses({ data: [], current_page: 1, last_page: 1 });
      throw error;
    } finally {
      setCoursesLoading(false);
    }
  }, []);

  // Update selected faculty (and reset dependent data)
  const updateSelectedFaculty = useCallback(async (facultyId, useAuthService = false) => {
    setSelectedFaculty(facultyId);
    
    if (facultyId === 'All') {
      setMajors([]);
      setSelectedMajor('All');
      setCourses({ data: [], current_page: 1, last_page: 1 });
      setCoursePage(1);
    } else {
      // Fetch majors for the selected faculty
      await fetchMajorsByFacultyId(facultyId, useAuthService);
    }
  }, [fetchMajorsByFacultyId]);

  // Update selected major (and reset courses)
  const updateSelectedMajor = useCallback(async (majorId) => {
    setSelectedMajor(majorId);
    setCoursePage(1);
    
    if (majorId === 'All') {
      setCourses({ data: [], current_page: 1, last_page: 1 });
    } else {
      // Fetch courses for the selected major
      await fetchCoursesByMajorId(majorId, 1);
    }
  }, [fetchCoursesByMajorId]);

  // Load next page of courses
  const loadNextCoursePage = useCallback(async () => {
    if (selectedMajor && selectedMajor !== 'All' && coursePage < courses.last_page) {
      await fetchCoursesByMajorId(selectedMajor, coursePage + 1);
    }
  }, [selectedMajor, coursePage, courses.last_page, fetchCoursesByMajorId]);

  // Load previous page of courses
  const loadPreviousCoursePage = useCallback(async () => {
    if (selectedMajor && selectedMajor !== 'All' && coursePage > 1) {
      await fetchCoursesByMajorId(selectedMajor, coursePage - 1);
    }
  }, [selectedMajor, coursePage, fetchCoursesByMajorId]);

  // Reset all academic data
  const resetAcademicData = useCallback(() => {
    setFaculties([]);
    setMajors([]);
    setCourses({ data: [], current_page: 1, last_page: 1 });
    setSelectedFaculty('All');
    setSelectedMajor('All');
    setCoursePage(1);
    setFacultiesError(null);
    setMajorsError(null);
    setCoursesError(null);
  }, []);

  // Helper functions to get names by ID
  const getFacultyName = useCallback((facultyId) => {
    if (facultyId === 'All') return 'All Faculties';
    const faculty = faculties.find(f => f.id === parseInt(facultyId));
    return faculty?.name || 'Unknown Faculty';
  }, [faculties]);

  const getMajorName = useCallback((majorId) => {
    if (majorId === 'All') return 'All Majors';
    const major = majors.find(m => m.id === parseInt(majorId));
    return major?.name || 'Unknown Major';
  }, [majors]);

  const getCourseName = useCallback((courseId) => {
    if (courseId === 'All') return 'All Courses';
    const course = courses.data.find(c => c.id === parseInt(courseId));
    return course?.name || course?.title || 'Unknown Course';
  }, [courses.data]);

  // Initialize faculties on mount
  useEffect(() => {
    fetchFaculties();
  }, [fetchFaculties]);

  // Auto-fetch majors when selectedFaculty changes (if it's set from user defaults)
  useEffect(() => {
    if (selectedFaculty && selectedFaculty !== 'All') {
      fetchMajorsByFacultyId(selectedFaculty);
    }
  }, [selectedFaculty, fetchMajorsByFacultyId]);

  const value = {
    // Data
    faculties,
    majors,
    courses,
    
    // Current selections
    selectedFaculty,
    selectedMajor,
    coursePage,
    
    // Loading states
    facultiesLoading,
    majorsLoading,
    coursesLoading,
    
    // Error states
    facultiesError,
    majorsError,
    coursesError,
    
    // Actions
    fetchFaculties,
    fetchMajorsByFacultyId,
    fetchCoursesByMajorId,
    updateSelectedFaculty,
    updateSelectedMajor,
    loadNextCoursePage,
    loadPreviousCoursePage,
    resetAcademicData,
    
    // Helper functions
    getFacultyName,
    getMajorName,
    getCourseName,
    getUserDefaults,
    
    // Computed values
    hasMoreCourses: coursePage < courses.last_page,
    totalCoursePages: courses.last_page,
    isLoading: facultiesLoading || majorsLoading || coursesLoading,
    hasErrors: !!(facultiesError || majorsError || coursesError),
  };

  return (
    <AcademicDataContext.Provider value={value}>
      {children}
    </AcademicDataContext.Provider>
  );
};

export const useAcademicData = () => {
  const context = useContext(AcademicDataContext);
  if (!context) {
    throw new Error('useAcademicData must be used within an AcademicDataProvider');
  }
  return context;
};
