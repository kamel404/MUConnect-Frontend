import React, { useState, useMemo } from 'react';
import {
  Box,
  Heading,
  Text,
  Input,
  Button,
  VStack,
  HStack,
  IconButton,
  useColorModeValue,
  SimpleGrid,
  Card,
  CardBody,
  Flex,
  FormControl,
  FormLabel,
  Select,
  Icon,
  Divider,
  useToast,
} from '@chakra-ui/react';
import { FiPlus, FiTrash2, FiCodesandbox } from 'react-icons/fi';
import { motion } from 'framer-motion';

const gradePoints = {
  'A+': 4.0,
  'A': 4.0,
  'B+': 3.5,
  'B': 3.0,
  'C+': 2.5,
  'C': 2.0,
  'D+': 1.5,
  'D': 1.0,
  'F': 0.0,
};

const GradeCalculator = () => {
  const [courses, setCourses] = useState([
    { name: '', credits: '', grade: 'A' },
  ]);
  const [gpa, setGpa] = useState(null);
  const toast = useToast();

  const cardBg = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'whiteAlpha.900');
  const mutedText = useColorModeValue('gray.600', 'gray.400');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const primaryColor = useColorModeValue('blue.600', 'blue.400');

  const handleCourseChange = (index, field, value) => {
    const newCourses = [...courses];
    newCourses[index][field] = value;
    setCourses(newCourses);
    setGpa(null); // Reset GPA when inputs change
  };

  const addCourse = () => {
    setCourses([...courses, { name: '', credits: '', grade: 'A' }]);
  };

  const removeCourse = (index) => {
    const newCourses = courses.filter((_, i) => i !== index);
    setCourses(newCourses);
    setGpa(null);
  };

  const calculateGpa = () => {
    let totalPoints = 0;
    let totalCredits = 0;

    for (const course of courses) {
      const credits = parseFloat(course.credits);
      const grade = course.grade;

      if (isNaN(credits) || credits <= 0 || !gradePoints.hasOwnProperty(grade)) {
        toast({
          title: 'Invalid Input',
          description: `Please check the details for course #${courses.indexOf(course) + 1}. Credits must be a positive number.`,
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
        return;
      }

      totalPoints += gradePoints[grade] * credits;
      totalCredits += credits;
    }

    if (totalCredits === 0) {
      setGpa(0);
      return;
    }

    const calculatedGpa = (totalPoints / totalCredits).toFixed(2);
    setGpa(calculatedGpa);
  };

  const totalCredits = useMemo(() => {
    return courses.reduce((acc, course) => {
      const credits = parseFloat(course.credits);
      return acc + (isNaN(credits) ? 0 : credits);
    }, 0);
  }, [courses]);

  return (
    <Box>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card mb={6} p={6} borderRadius="xl" borderWidth="1px" borderColor={borderColor} bg={cardBg}>
          <Flex alignItems="center" gap={4}>
            <Icon as={FiCodesandbox} w={10} h={10} color={primaryColor} />
            <Box>
              <Heading size="lg" color={textColor}>
                Semester Grade Calculator
              </Heading>
              <Text color={mutedText}>
                Calculate your semester GPA based on your courses, credits, and grades.
              </Text>
            </Box>
          </Flex>
        </Card>
      </motion.div>

      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
        {/* Left Column: Course Inputs */}
        <VStack spacing={4} align="stretch">
          {courses.map((course, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Card bg={cardBg} borderWidth="1px" borderColor={borderColor} borderRadius="lg">
                <CardBody>
                  <HStack spacing={4} align="flex-end">
                    <FormControl flex={3}>
                      <FormLabel htmlFor={`course-name-${index}`} fontSize="sm">Course Name (Optional)</FormLabel>
                      <Input
                        id={`course-name-${index}`}
                        placeholder={`Course ${index + 1}`}
                        value={course.name}
                        onChange={(e) => handleCourseChange(index, 'name', e.target.value)}
                      />
                    </FormControl>
                    <FormControl flex={1}>
                      <FormLabel htmlFor={`credits-${index}`} fontSize="sm">Credits</FormLabel>
                      <Input
                        id={`credits-${index}`}
                        type="number"
                        placeholder="e.g., 3"
                        value={course.credits}
                        onChange={(e) => handleCourseChange(index, 'credits', e.target.value)}
                      />
                    </FormControl>
                    <FormControl flex={1}>
                      <FormLabel htmlFor={`grade-${index}`} fontSize="sm">Grade</FormLabel>
                      <Select
                        id={`grade-${index}`}
                        value={course.grade}
                        onChange={(e) => handleCourseChange(index, 'grade', e.target.value)}
                      >
                        {Object.keys(gradePoints).map((grade) => (
                          <option key={grade} value={grade}>{grade}</option>
                        ))}
                      </Select>
                    </FormControl>
                    <IconButton
                      icon={<FiTrash2 />}
                      aria-label="Remove course"
                      colorScheme="red"
                      variant="ghost"
                      onClick={() => removeCourse(index)}
                      isDisabled={courses.length === 1}
                    />
                  </HStack>
                </CardBody>
              </Card>
            </motion.div>
          ))}
          <Button
            leftIcon={<FiPlus />}
            onClick={addCourse}
            colorScheme="blue"
            variant="outline"
            w="100%"
          >
            Add Another Course
          </Button>
        </VStack>

        {/* Right Column: GPA Display and Actions */}
        <Box>
          <Card bg={cardBg} borderWidth="1px" borderColor={borderColor} borderRadius="lg" p={6} position="sticky" top="80px">
            <VStack spacing={4} align="stretch">
              <Heading size="md">Summary</Heading>
              <Divider />
              <Flex justify="space-between">
                <Text fontWeight="bold">Total Courses:</Text>
                <Text>{courses.length}</Text>
              </Flex>
              <Flex justify="space-between">
                <Text fontWeight="bold">Total Credits:</Text>
                <Text>{totalCredits}</Text>
              </Flex>
              <Divider />
              {gpa !== null && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <VStack spacing={2} bg={useColorModeValue('blue.50', 'blue.900')} p={4} borderRadius="md">
                    <Text fontSize="lg" color={mutedText}>Your Semester GPA is</Text>
                    <Heading size="2xl" color={primaryColor}>{gpa}</Heading>
                  </VStack>
                </motion.div>
              )}
              <Button
                leftIcon={<FiCodesandbox />}
                colorScheme="blue"
                onClick={calculateGpa}
                size="lg"
                w="100%"
              >
                Calculate GPA
              </Button>
            </VStack>
          </Card>
        </Box>
      </SimpleGrid>
    </Box>
  );
};

export default GradeCalculator;
