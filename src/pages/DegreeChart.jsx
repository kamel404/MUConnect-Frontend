import { useState, useEffect } from 'react';
import {
  Box,
  Heading,
  Text,
  SimpleGrid,
  VStack,
  HStack,
  Badge,
  Input,
  Select,
  Flex,
  Icon,
  Card,
  CardHeader,
  CardBody,
  Button,
  Checkbox,
  Progress,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  useToast,
  IconButton,
  Tooltip,
  useColorModeValue,
  Divider,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon
} from "@chakra-ui/react";
import { FiInfo, FiArrowLeft } from "react-icons/fi";
import { useNavigate } from 'react-router-dom';
import { FiFilter, FiSearch, FiCheckCircle, FiClock, FiXCircle, FiChevronDown, FiChevronUp } from "react-icons/fi";
import { motion } from "framer-motion";

// Computer Science curriculum data based on the university's 3-year program
// This would ideally come from an API
const csCoursesData = {
  "Year 1": {
    "Fall": [
      { id: "CSC 215", name: "C++ Programming", credits: 3, category: "Major", prerequisites: [] },
      { id: "CSC 215L", name: "C++ Programming Lab", credits: 1, category: "Major", prerequisites: ["CSC 215"] },
      { id: "MAT 211", name: "Calculus III", credits: 3, category: "Math", prerequisites: [] },
      { id: "FOE 201", name: "Intro to Computing", credits: 3, category: "Technical", prerequisites: [] },
      { id: "ENG 201", name: "Communication Skills I", credits: 3, category: "General", prerequisites: [] },
      { id: "CST 200", name: "Cultural Studies", credits: 3, category: "General", prerequisites: [] }
    ],
    "Spring": [
      { id: "CSC 210", name: "Object Oriented Programming", credits: 3, category: "Major", prerequisites: ["CSC 215"] },
      { id: "CSC 215L", name: "Object Oriented Programming Lab", credits: 0, category: "Major", prerequisites: ["CSC 215"] },
      { id: "EEE 225", name: "Digital Logic Design", credits: 3, category: "Major", prerequisites: [] },
      { id: "EEE 225L", name: "Digital Logic Design Lab", credits: 1, category: "Major", prerequisites: ["EEE 225"] },
      { id: "MAT 230", name: "Discrete Mathematics", credits: 3, category: "Math", prerequisites: ["MAT 211"] },
      { id: "ENG 202", name: "Communication Skills II", credits: 3, category: "General", prerequisites: ["ENG 201"] },
      { id: "CST 201", name: "Cultural Studies II", credits: 3, category: "General", prerequisites: ["CST 200"] }
    ],
    "Summer": [
      { id: "MAT 225", name: "Prob & Stat for Science", credits: 3, category: "Math", prerequisites: ["MAT 211"] },
      { id: "General Elective", name: "Genral Elective Course", credits: 3, category: "General", prerequisites: [] }


    ]
  },
  "Year 2": {
    "Fall": [
      { id: "CSC 230", name: "Data Structures", credits: 3, category: "Major", prerequisites: ["CSC 210", "CSC 215L"] },
      { id: "CSC 230L", name: "Data Structures Lab", credits: 0, category: "Major", prerequisites: ["CSC 230"] },
      { id: "COE 360", name: "Computer Networks", credits: 3, category: "Major", prerequisites: ["CSC 210"] },
      { id: "COE 360L", name: "Computer Networks Lab", credits: 1, category: "Major", prerequisites: ["COE 360"] },
      { id: "COE 380", name: "Computer Organization", credits: 3, category: "Major", prerequisites: ["CSC 210", "EEE 225"] },
      { id: "MAT 330", name: "Linear Algebra", credits: 3, category: "Math", prerequisites: ["MAT 211"] },
      { id: "CST 202", name: "Cultural Studies II", credits: 3, category: "General", prerequisites: ["CST 201"] }
    ],
    "Spring": [
      { id: "CSC 330", name: "Database Systems", credits: 3, category: "Major", prerequisites: ["CSC 230"] },
      { id: "CSC 330L", name: "Database Systems Lab", credits: 1, category: "Major", prerequisites: ["CSC 330"] },
      { id: "CSC 340", name: "Theory of Computation", credits: 3, category: "Major", prerequisites: ["CSC 230", "MAT 230"] },
      { id: "Technical Elective", name: "Technical Elective Course", credits: 3, category: "Technical", prerequisites: ["CSC 230"] },
      { id: "MAT 350", name: "Numerical Analysis", credits: 3, category: "Math", prerequisites: ["MAT 330"] },
      { id: "ENG 204", name: "Public Speaking", credits: 3, category: "General", prerequisites: ["ENG 202"] },
      
    ],
    "Summer": [
      { id: "ARB 201", name: "Arabic Communication Skills I", credits: 3, category: "General", prerequisites: [] }
    ]
  },
  "Year 3": {
    "Fall": [
      { id: "CSC 400", name: "Web Programming", credits: 3, category: "Major", prerequisites: ["CSC 230", "CSC 230L"] },
      { id: "CSC 400L", name: "Web Programming Lab", credits: 0, category: "Major", prerequisites: ["CSC 400"] },
      { id: "CSC 470", name: "Software Engineering", credits: 3, category: "Major", prerequisites: ["CSC 330", "CSC 400"] },
      { id: "CSC 498", name: "Capstone Project Proposal", credits: 0, category: "Major", prerequisites: ["CSC 330", "CSC 340"] },
      { id: "Technical Elective", name: "Technical Elective Course", credits: 3, category: "Technical", prerequisites: ["CSC 330"] },
      { id: "Science Elective", name: "Science Elective Course", credits: 3, category: "Science", prerequisites: ["MAT 225"] }
    ],
    "Spring": [
      { id: "CSC 420", name: "Algorithms", credits: 3, category: "Major", prerequisites: ["CSC 230", "MAT 230"] },
      { id: "CSC 450", name: "Operating Systems", credits: 3, category: "Major", prerequisites: ["CSC 230", "COE 380"] },
      { id: "CSC 499", name: "Capstone Project", credits: 3, category: "Major", prerequisites: ["CSC 498", "CSC 470"] }
    ],
    "Summer": [
      { id: "CSC 497", name: "Practical Training", credits: 3, category: "Major", prerequisites: ["CSC 499"] }
    ]
  }
};

const MotionCard = motion(Card);

const DegreeChart = () => {
  // Retrieve user's major from localStorage (saved elsewhere in the app)
  // Fallback to empty string if not found
  const storedMajor = (localStorage.getItem('userMajor')).toLowerCase();
  const isComputerScienceMajor = storedMajor.includes('computer science');
  const [courses, setCourses] = useState({});
  const [userCourses, setUserCourses] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [progress, setProgress] = useState(0);
  const [totalCredits, setTotalCredits] = useState(0);
  const [completedCredits, setCompletedCredits] = useState(0);
  const toast = useToast();
  
  const bgColor = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.800", "white");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const accentColor = useColorModeValue("yellow.400", "yellow.500");

  // Early exit: feature not yet available for other majors
  if (!isComputerScienceMajor) {
    const bgCard = useColorModeValue('white', 'gray.800');
    const textColor = useColorModeValue('gray.800', 'white');
    const muted = useColorModeValue('gray.500', 'gray.400');
    const navigate = useNavigate();

    return (
      <Flex minH="70vh" align="center" justify="center" p={4}>
        <Card bg={bgCard} p={10} shadow="xl" textAlign="center" maxW="sm" w="full">
          <VStack spacing={6}>
            <Icon as={FiInfo} boxSize={12} color="blue.400" />
            <Heading size="lg" color={textColor}>Coming Soon</Heading>
            <Text color={muted} fontSize="md" fontWeight="bold">
              Sorry, this feature is coming soon for your major.
            </Text>
            <Button colorScheme="blue" leftIcon={<FiArrowLeft />} onClick={() => navigate(-1)} width="full">
              Back
            </Button>
          </VStack>
        </Card>
      </Flex>
    );
  }

  // Initialize courses data
  useEffect(() => {
    setCourses(csCoursesData);
    
    // Calculate total credits
    let total = 0;
    Object.values(csCoursesData).forEach(year => {
      Object.values(year).forEach(semester => {
        semester.forEach(course => {
          total += course.credits;
        });
      });
    });
    setTotalCredits(total);
    
    // Load user course progress from localStorage (would be from API in real app)
    const savedCourses = localStorage.getItem('userCourses');
    if (savedCourses) {
      const parsedCourses = JSON.parse(savedCourses);
      setUserCourses(parsedCourses);
      
      // Calculate completed credits
      let completed = 0;
      Object.entries(parsedCourses).forEach(([courseId, status]) => {
        if (status === 'completed') {
          // Find the course to get its credits
          for (const year of Object.values(csCoursesData)) {
            let found = false;
            for (const semester of Object.values(year)) {
              const course = semester.find(c => c.id === courseId);
              if (course) {
                completed += course.credits;
                found = true;
                break;
              }
            }
            if (found) break;
          }
        }
      });
      setCompletedCredits(completed);
      setProgress((completed / total) * 100);
    }
  }, []);

  // Update progress when user courses change
  useEffect(() => {
    if (Object.keys(userCourses).length > 0) {
      // Save to localStorage (would be API in real app)
      localStorage.setItem('userCourses', JSON.stringify(userCourses));
      
      // Calculate completed credits
      let completed = 0;
      Object.entries(userCourses).forEach(([courseId, status]) => {
        if (status === 'completed') {
          // Find the course to get its credits
          for (const year of Object.values(courses)) {
            let found = false;
            for (const semester of Object.values(year)) {
              const course = semester.find(c => c.id === courseId);
              if (course) {
                completed += course.credits;
                found = true;
                break;
              }
            }
            if (found) break;
          }
        }
      });
      setCompletedCredits(completed);
      setProgress((completed / totalCredits) * 100);
    }
  }, [userCourses, courses, totalCredits]);

  // Update course status
  const updateCourseStatus = (courseId, status, prerequisites) => {
    // Check if trying to mark as completed and has prerequisites
    if (status === 'completed' && prerequisites && prerequisites.length > 0) {
      // Check if all prerequisites are completed
      const hasCompletedPrereqs = arePrerequisitesCompleted(prerequisites);
      
      if (!hasCompletedPrereqs) {
        // Get the list of incomplete prerequisites
        const incompletePrereqs = prerequisites.filter(pre => userCourses[pre] !== 'completed');
        
        // Show error toast notification
        toast({
          title: 'Prerequisites Not Completed',
          description: `You must complete these prerequisites first: ${incompletePrereqs.join(', ')}`,
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
        return; // Don't update the status
      }
    }
    
    setUserCourses(prev => {
      const updatedCourses = { ...prev, [courseId]: status };
      
      // Show toast notification
      toast({
        title: `Course ${status === 'completed' ? 'Completed' : status === 'in-progress' ? 'In Progress' : 'Not Started'}`,
        description: `Course ${courseId} has been marked as ${status === 'completed' ? 'Completed' : status === 'in-progress' ? 'In Progress' : 'Not Started'}`,
        status: status === 'completed' ? 'success' : status === 'in-progress' ? 'info' : 'warning',
        duration: 3000,
        isClosable: true,
      });
      
      return updatedCourses;
    });
  };

  // Check if prerequisites are completed
  const arePrerequisitesCompleted = (prerequisites) => {
    if (!prerequisites || prerequisites.length === 0) return true;
    return prerequisites.every(pre => userCourses[pre] === 'completed');
  };

  // Filter courses based on search and filter
    // Get filtered courses from a semester list
  const getFilteredCourses = (semesterCourses) => {
    return semesterCourses.filter(course => {
      const matchesSearch = course.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          course.id.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesFilter = filter === 'all' || 
                          (filter === 'completed' && userCourses[course.id] === 'completed') ||
                          (filter === 'in-progress' && userCourses[course.id] === 'in-progress') ||
                          (filter === 'not-started' && (!userCourses[course.id] || userCourses[course.id] === 'not-started'));
      
      const matchesCategory = categoryFilter === 'all' || 
                            (course.category && course.category.toLowerCase() === categoryFilter.toLowerCase());
      
      return matchesSearch && matchesFilter && matchesCategory;
    });
  };
  
  // Get all courses from all semesters in a year
  const getAllCoursesInYear = (yearData) => {
    return Object.values(yearData).flat();
  };

  // Render the course card
  const CourseCard = ({ course }) => {
    const status = userCourses[course.id] || 'not-started';
    const hasCompletedPrereqs = arePrerequisitesCompleted(course.prerequisites);
    
    // Set card background color based on course category and status
    const getCategoryColor = (category) => {
      switch(category) {
        case 'Major': return status === 'completed' ? 'red.50' : 'red.100';
        case 'Technical': return status === 'completed' ? 'yellow.50' : 'yellow.100';
        case 'Math': return status === 'completed' ? 'green.50' : 'green.100';
        case 'Science': return status === 'completed' ? 'green.50' : 'green.100';
        case 'General': return status === 'completed' ? 'purple.50' : 'purple.100';
        default: return status === 'completed' ? 'gray.50' : 'gray.100';
      }
    };
    
    const cardBg = useColorModeValue(
      getCategoryColor(course.category),
      status === 'completed' ? 'green.900' : 
      status === 'in-progress' ? 'blue.900' : 'gray.800'
    );
    
    const statusColor = {
      'completed': 'green',
      'in-progress': 'blue',
      'not-started': 'gray'
    };
    
    const categoryColor = {
      'Major': 'red',
      'Technical': 'yellow',
      'Math': 'green',
      'Science': 'teal',
      'General': 'purple'
    };

    return (
      <MotionCard 
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.2 }}
        bg={cardBg}
        borderWidth="1px"
        borderColor={borderColor}
        borderRadius="lg"
        overflow="hidden"
        boxShadow="sm"
      >
        <CardHeader pb={0}>
          <Flex justify="space-between" align="center">
            <HStack>
              <Badge colorScheme={statusColor[status]} px={2} py={1} borderRadius="full">
                {course.id}
              </Badge>
              <Badge colorScheme="yellow">{course.credits} Credits</Badge>
              {course.category && (
                <Badge colorScheme={categoryColor[course.category] || 'gray'} variant="subtle">
                  {course.category}
                </Badge>
              )}
            </HStack>
            <Tooltip 
              label={
                course.prerequisites.length > 0 
                  ? `Prerequisites: ${course.prerequisites.join(', ')}` 
                  : 'No prerequisites'
              }
            >
              <IconButton
                size="sm"
                aria-label="Prerequisites"
                icon={<FiInfo />}
                variant="ghost"
              />
            </Tooltip>
          </Flex>
        </CardHeader>
        <CardBody>
          <VStack align="start" spacing={3}>
            <Heading size="sm">{course.name}</Heading>
            
            {course.prerequisites.length > 0 && (
              <Text fontSize="xs" color={hasCompletedPrereqs ? "green.500" : "red.500"}>
                {hasCompletedPrereqs 
                  ? "All prerequisites completed" 
                  : `Prerequisites needed: ${course.prerequisites.filter(pre => userCourses[pre] !== 'completed').join(', ')}`
                }
              </Text>
            )}
            
            <HStack width="100%" spacing={4}>
              <Tooltip
                label={!hasCompletedPrereqs ? 'Complete all prerequisites first' : 'Mark as completed'}
                placement="top"
                hasArrow
              >
                <Button 
                  size="sm" 
                  leftIcon={<FiCheckCircle />} 
                  colorScheme="green"
                  variant={status === 'completed' ? 'solid' : 'outline'}
                  onClick={() => updateCourseStatus(course.id, 'completed', course.prerequisites)}
                  flex="1"
                  opacity={!hasCompletedPrereqs ? 0.7 : 1}
                  _hover={!hasCompletedPrereqs ? { opacity: 0.7 } : {}}
                >
                  Completed
                </Button>
              </Tooltip>
              <Button 
                size="sm" 
                leftIcon={<FiClock />} 
                colorScheme="blue"
                variant={status === 'in-progress' ? 'solid' : 'outline'}
                onClick={() => updateCourseStatus(course.id, 'in-progress', course.prerequisites)}
                flex="1"
              >
                In Progress
              </Button>
              <Button 
                size="sm" 
                leftIcon={<FiXCircle />} 
                colorScheme="gray"
                variant={status === 'not-started' ? 'solid' : 'outline'}
                onClick={() => updateCourseStatus(course.id, 'not-started', course.prerequisites)}
                flex="1"
              >
                Reset
              </Button>
            </HStack>
          </VStack>
        </CardBody>
      </MotionCard>
    );
  };

  return (
    <Box p={5}>
      <VStack spacing={8} align="stretch">
        <Flex 
          direction={{ base: 'column', md: 'row' }} 
          justify="space-between" 
          align={{ base: 'flex-start', md: 'center' }}
          gap={4}
        >
          <VStack align="start" spacing={1}>
            <Heading size="xl"> Degree Chart</Heading>
            <Text color="gray.500">Track your progress toward your courses according to the official degree chart </Text>
          </VStack>
          
          <Card p={4} width={{ base: '100%', md: 'auto' }}>
            <VStack align="start" spacing={2}>
              <Heading size="md">Degree Progress</Heading>
              <Progress 
                value={progress} 
                colorScheme="yellow" 
                size="md" 
                width={{ base: '100%', md: '300px' }} 
                borderRadius="md"
              />
              <HStack justify="space-between" width="100%">
                <Text fontSize="sm">{completedCredits} of {totalCredits} credits</Text>
                <Text fontSize="sm" fontWeight="bold">{Math.round(progress)}% Complete</Text>
              </HStack>
            </VStack>
          </Card>
        </Flex>

        <Flex 
          justify="space-between" 
          align={{ base: 'flex-start', md: 'center' }}
          direction={{ base: 'column', md: 'row' }}
          gap={4}
        >
          <HStack spacing={4} width={{ base: '100%', md: 'auto' }}>
            <Box position="relative" width={{ base: '100%', md: '300px' }}>
              <Input
                placeholder="Search courses..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                pr="10"
              />
              <Icon
                as={FiSearch}
                position="absolute"
                right="3"
                top="50%"
                transform="translateY(-50%)"
                color="gray.400"
              />
            </Box>
            
            <HStack spacing={2}>
              <Icon as={FiFilter} color="gray.500" />
              <Select
                value={filter}
                onChange={e => setFilter(e.target.value)}
                width={{ base: '100%', md: 'auto' }}
              >
                <option value="all">All Courses</option>
                <option value="completed">Completed</option>
                <option value="in-progress">In Progress</option>
                <option value="not-started">Not Started</option>
              </Select>
              <Select
                value={categoryFilter}
                onChange={e => setCategoryFilter(e.target.value)}
                width={{ base: '100%', md: 'auto' }}
              >
                <option value="all">All Categories</option>
                <option value="major">Major Requirements</option>
                <option value="technical">Technical Electives</option>
                <option value="math">Math & Science</option>
                <option value="general">General Requirements</option>
              </Select>
            </HStack>
          </HStack>
          
          <HStack spacing={4}>
            <Badge colorScheme="green" p={2} borderRadius="md">
              <HStack>
                <Icon as={FiCheckCircle} />
                <Text>{Object.values(userCourses).filter(status => status === 'completed').length} Completed</Text>
              </HStack>
            </Badge>
            <Badge colorScheme="blue" p={2} borderRadius="md">
              <HStack>
                <Icon as={FiClock} />
                <Text>{Object.values(userCourses).filter(status => status === 'in-progress').length} In Progress</Text>
              </HStack>
            </Badge>
          </HStack>
        </Flex>

          <VStack spacing={6} align="stretch">
          <Accordion allowMultiple defaultIndex={[0]} borderWidth="0">
            {Object.entries(courses).map(([year, yearData], yearIndex) => {
              const allYearCourses = getAllCoursesInYear(yearData);
              const hasFilteredCourses = Object.values(yearData).some(semester => 
                getFilteredCourses(semester).length > 0
              );
              
              if (!hasFilteredCourses) return null;
              
              return (
                <AccordionItem 
                  key={year} 
                  borderWidth="1px" 
                  borderColor={useColorModeValue('gray.200', 'gray.700')} 
                  borderRadius="md"
                  mb={4}
                  overflow="hidden"
                  boxShadow="sm"
                >
                  <AccordionButton 
                    py={4}
                    _hover={{ bg: useColorModeValue('gray.100', 'gray.700') }}
                    bg={useColorModeValue('gray.50', 'gray.800')}
                  >
                    <HStack flex="1" justify="space-between">
                      <HStack>
                        <Heading size="md">{year}</Heading>
                        <Badge colorScheme="teal" borderRadius="full" px={2}>
                          {allYearCourses.length} Courses
                        </Badge>
                      </HStack>
                      <AccordionIcon fontSize="24px" />
                    </HStack>
                  </AccordionButton>
                  
                  <AccordionPanel pb={4} px={4}>
                    <Accordion allowMultiple defaultIndex={[0]} borderWidth="0">
                      {/* Display semesters */}
                      {Object.entries(yearData).map(([semester, semesterCourses], semesterIndex) => {
                        const filteredSemesterCourses = getFilteredCourses(semesterCourses);
                        
                        if (filteredSemesterCourses.length === 0) return null;
                        
                        return (
                          <AccordionItem 
                            key={`${year}-${semester}`} 
                            mb={4}
                            borderWidth="1px"
                            borderRadius="md"
                            borderColor={useColorModeValue('gray.200', 'gray.700')}
                          >
                            <AccordionButton 
                              bg={useColorModeValue(
                                semester === 'Fall' ? 'orange.50' : 
                                semester === 'Spring' ? 'green.50' : 'blue.50',
                                semester === 'Fall' ? 'orange.900' : 
                                semester === 'Spring' ? 'green.900' : 'blue.900'
                              )}
                              _hover={{ bg: useColorModeValue(
                                semester === 'Fall' ? 'orange.100' : 
                                semester === 'Spring' ? 'green.100' : 'blue.100',
                                semester === 'Fall' ? 'orange.800' : 
                                semester === 'Spring' ? 'green.800' : 'blue.800'
                              )}}                              
                              borderTopRadius="md"
                              py={2}
                            >
                              <HStack flex="1" justify="space-between">
                                <HStack>
                                  <Heading size="sm">{semester}</Heading>
                                  <Badge 
                                    colorScheme={semester === 'Fall' ? 'orange' : semester === 'Spring' ? 'green' : 'blue'} 
                                    borderRadius="full" 
                                    px={2}
                                  >
                                    {filteredSemesterCourses.length} Courses
                                  </Badge>
                                </HStack>
                                <AccordionIcon />
                              </HStack>
                            </AccordionButton>
                            
                            <AccordionPanel py={4}>
                              <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                                {filteredSemesterCourses.map(course => (
                                  <CourseCard key={course.id} course={course} />
                                ))}
                              </SimpleGrid>
                            </AccordionPanel>
                          </AccordionItem>
                        );
                      })}
                    </Accordion>
                  </AccordionPanel>
                </AccordionItem>
              );
            })}
          </Accordion>
          
          {Object.entries(courses).every(([_, yearData]) => 
            Object.values(yearData).every(semester => getFilteredCourses(semester).length === 0)
          ) && (
            <Flex 
              justify="center" 
              align="center" 
              direction="column" 
              p={10} 
              bg={bgColor} 
              borderRadius="md"
              border="1px dashed"
              borderColor={borderColor}
            >
              <Icon as={FiInfo} fontSize="4xl" color="gray.400" mb={4} />
              <Text fontSize="xl" color="gray.500">No courses match your filters</Text>
              <Button 
                mt={4} 
                onClick={() => {
                  setSearchTerm('');
                  setFilter('all');
                }}
                colorScheme="yellow"
              >
                Clear Filters
              </Button>
            </Flex>
          )}
        </VStack>
      </VStack>
    </Box>
  );
};

export default DegreeChart;
