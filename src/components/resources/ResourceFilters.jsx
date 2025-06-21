import React from "react";
import {
  Flex,
  HStack,
  Button,
  Tag,
  TagLabel,
  TagCloseButton,
  Box,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Text,
  Icon,
  Wrap,
  WrapItem,
  useColorModeValue,
  Badge,
  Spinner
} from "@chakra-ui/react";
import { FiChevronDown, FiFilter } from "react-icons/fi";

/**
 * Component for handling resource filtering with a cleaner UI that's always visible
 */
const ResourceFilters = ({
  searchQuery,
  facultyFilter,
  setFacultyFilter,
  courseFilter,
  setCourseFilter,
  majorFilter,
  setMajorFilter,
  faculties,
  majors,
  courses,
  coursePagination,
  onCoursePageChange,
  isLoadingFilters,
  onClearFilters,
  mutedText,
}) => {
  // Theme colors
  const tagBg = useColorModeValue("blue.50", "blue.900");
  const activeBg = useColorModeValue("blue.100", "blue.800");
  const hoverBg = useColorModeValue("gray.100", "gray.700");
  
  // Helper function to check if any filters are applied
  const isFiltering = searchQuery !== "" || facultyFilter !== "All" || courseFilter !== "All" || majorFilter !== "All";

  // Find the selected item's name to display in the button/tag
  const getFacultyName = (id) => faculties.find(f => f.id === id)?.name || "Faculty";
  const getMajorName = (id) => majors.find(m => m.id === id)?.name || "Major";
  const getCourseName = (id) => courses.find(c => c.id === id)?.title || "Course";

  // Handle clearing all filters
  const clearAllFilters = () => {
    setFacultyFilter("All");
    setCourseFilter("All");
    setMajorFilter("All");
  };

  return (
    <Flex direction="column" w="full" gap={3}>
      <Flex justify="space-between" align="center" w="full" mb={2}>
        <HStack>
          <Icon as={FiFilter} />
          <Text fontWeight="medium">Filters</Text>
          {isLoadingFilters && <Spinner size="sm" ml={2} />}
          {isFiltering && !isLoadingFilters && (
            <Badge ml={1} colorScheme="blue" borderRadius="full" px={2}>
              {(searchQuery ? 1 : 0) + (facultyFilter !== "All" ? 1 : 0) + (courseFilter !== "All" ? 1 : 0) + (majorFilter !== "All" ? 1 : 0)}
            </Badge>
          )}
        </HStack>
        
        {isFiltering && (
          <Button 
            size="xs" 
            variant="ghost" 
            colorScheme="blue" 
            onClick={onClearFilters}
          >
            Clear All
          </Button>
        )}
      </Flex>
      
      <Flex direction={{base: "column", md: "row"}} gap={3} mb={2}>
          {/* Faculty Filter */}
          <Menu>
            <MenuButton as={Button} rightIcon={<FiChevronDown />} w="full" isDisabled={isLoadingFilters}>
              {facultyFilter === "All" ? "Faculty" : getFacultyName(facultyFilter)}
            </MenuButton>
            <MenuList>
              <MenuItem onClick={() => setFacultyFilter("All")}>All Faculties</MenuItem>
              {faculties && faculties.map(faculty => (
                <MenuItem key={faculty.id} onClick={() => setFacultyFilter(faculty.id)}>{faculty.name}</MenuItem>
              ))}
            </MenuList>
          </Menu>

          {/* Major Filter */}
          <Menu>
            <MenuButton as={Button} rightIcon={<FiChevronDown />} w="full" isDisabled={isLoadingFilters || facultyFilter === 'All'}>
              {majorFilter === "All" ? "Major" : getMajorName(majorFilter)}
            </MenuButton>
            <MenuList>
              <MenuItem onClick={() => setMajorFilter("All")}>All Majors</MenuItem>
              {majors && majors.map(major => (
                <MenuItem key={major.id} onClick={() => setMajorFilter(major.id)}>{major.name}</MenuItem>
              ))}
            </MenuList>
          </Menu>

          {/* Course Filter */}
          <Menu>
            <MenuButton as={Button} rightIcon={<FiChevronDown />} w="full" isDisabled={isLoadingFilters || majorFilter === 'All'}>
              {courseFilter === "All" ? "Course" : getCourseName(courseFilter)}
            </MenuButton>
            <MenuList>
              <MenuItem onClick={() => setCourseFilter("All")}>All Courses</MenuItem>
              {courses && courses.map(course => (
                <MenuItem key={course.id} onClick={() => setCourseFilter(course.id)}>{course.title}</MenuItem>
              ))}
              {coursePagination && coursePagination.last_page > 1 && (
                <Box px={3} py={2}>
                  <Flex justify="space-between" align="center">
                    <Button
                      size="sm"
                      onClick={() => onCoursePageChange(coursePagination.current_page - 1)}
                      isDisabled={coursePagination.current_page === 1}
                    >
                      Prev
                    </Button>
                    <Text fontSize="sm">
                      Page {coursePagination.current_page} of {coursePagination.last_page}
                    </Text>
                    <Button
                      size="sm"
                      onClick={() => onCoursePageChange(coursePagination.current_page + 1)}
                      isDisabled={coursePagination.current_page === coursePagination.last_page}
                    >
                      Next
                    </Button>
                  </Flex>
                </Box>
              )}
            </MenuList>
          </Menu>
        </Flex>

      
      {/* Active filter tags for quick reference */}
      {isFiltering && (
        <Box mt={3}>
          <Wrap spacing={2}>
            {facultyFilter !== "All" && (
              <WrapItem>
                <Tag size="md" borderRadius="full" variant="subtle" colorScheme="green">
                  <TagLabel>
                    <HStack spacing={1}>
                      <Text fontSize="xs">Faculty:</Text>
                      <Text fontSize="sm" fontWeight="medium">{getFacultyName(facultyFilter)}</Text>
                    </HStack>
                  </TagLabel>
                  <TagCloseButton onClick={() => setFacultyFilter("All")} />
                </Tag>
              </WrapItem>
            )}

            {majorFilter !== "All" && (
              <WrapItem>
                <Tag size="md" borderRadius="full" variant="subtle" colorScheme="purple">
                  <TagLabel>
                    <HStack spacing={1}>
                      <Text fontSize="xs">Major:</Text>
                      <Text fontSize="sm" fontWeight="medium">{getMajorName(majorFilter)}</Text>
                    </HStack>
                  </TagLabel>
                  <TagCloseButton onClick={() => setMajorFilter("All")} />
                </Tag>
              </WrapItem>
            )}

            {courseFilter !== "All" && (
              <WrapItem>
                <Tag size="md" borderRadius="full" variant="subtle" colorScheme="orange">
                  <TagLabel>
                    <HStack spacing={1}>
                      <Text fontSize="xs">Course:</Text>
                      <Text fontSize="sm" fontWeight="medium">{getCourseName(courseFilter)}</Text>
                    </HStack>
                  </TagLabel>
                  <TagCloseButton onClick={() => setCourseFilter("All")} />
                </Tag>
              </WrapItem>
            )}
            {searchQuery && (
              <WrapItem>
                <Tag size="md" borderRadius="full" variant="subtle" colorScheme="purple">
                  <TagLabel>
                    <HStack spacing={1}>
                      <Text fontSize="xs">Search:</Text>
                      <Text fontSize="sm" fontWeight="medium">"{searchQuery}"</Text>
                    </HStack>
                  </TagLabel>
                </Tag>
              </WrapItem>
            )}
          </Wrap>
        </Box>
      )}
    </Flex>
  );
};

export default ResourceFilters;
