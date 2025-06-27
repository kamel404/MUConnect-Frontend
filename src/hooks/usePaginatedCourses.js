import { useState, useEffect, useCallback } from 'react';
import { fetchCourses } from '../services/courseService';

const DEFAULT_PER_PAGE = 5;

export default function usePaginatedCourses({ perPage = DEFAULT_PER_PAGE, trigger = true } = {}) {
  const [courses, setCourses] = useState([]);
  const [coursesLoading, setCoursesLoading] = useState(false);
  const [coursesError, setCoursesError] = useState(null);
  const [coursesPage, setCoursesPage] = useState(1);
  const [coursesTotalPages, setCoursesTotalPages] = useState(1);

  const fetchPaginatedCourses = useCallback(async (page = 1) => {
    setCoursesLoading(true);
    setCoursesError(null);
    try {
      // Include user context (major / faculty) just like CreatePostModal
      const major_id = localStorage.getItem('major_id');
      const faculty_id = localStorage.getItem('faculty_id');
      const params = {
        ...(major_id ? { major_id } : {}),
        ...(faculty_id ? { faculty_id } : {}),
        page,
        per_page: perPage,
      };
      const res = await fetchCourses(params);
      setCourses(res.data || []);
      setCoursesTotalPages(res.last_page || 1);
      setCoursesPage(res.current_page || 1);
    } catch (err) {
      setCoursesError(err.message || 'Failed to load courses');
    } finally {
      setCoursesLoading(false);
    }
  }, [perPage]);

  useEffect(() => {
    if (trigger) fetchPaginatedCourses(coursesPage);
    // eslint-disable-next-line
  }, [coursesPage, trigger]);

  return {
    courses,
    coursesLoading,
    coursesError,
    coursesPage,
    coursesTotalPages,
    setCoursesPage,
    fetchPaginatedCourses,
  };
}
