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
        <Card mb={6} p={{ base: 4, md: 6 }} borderRadius="xl" borderWidth="1px" borderColor={borderColor} bg={cardBg}>
          <Flex alignItems="center" gap={{ base: 3, md: 4 }} direction={{ base: "column", sm: "row" }} textAlign={{ base: "center", sm: "left" }}>
            <Icon as={FiCodesandbox} w={{ base: 8, md: 10 }} h={{ base: 8, md: 10 }} color={primaryColor} flexShrink={0} />
            <Box>
              <Heading size={{ base: "md", md: "lg" }} color={textColor}>
                Semester Grade Calculator
              </Heading>
              <Text color={mutedText} fontSize={{ base: "sm", md: "md" }}>
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
                <CardBody p={{ base: 3, md: 4 }}>
                  <VStack spacing={3} align="stretch">
                    <FormControl>
                      <FormLabel htmlFor={`course-name-${index}`} fontSize={{ base: "xs", md: "sm" }}>Course Name (Optional)</FormLabel>
                      <Input
                        id={`course-name-${index}`}
                        placeholder={`Course ${index + 1}`}
                        value={course.name}
                        onChange={(e) => handleCourseChange(index, 'name', e.target.value)}
                        size={{ base: "sm", md: "md" }}
                      />
                    </FormControl>
                    <HStack spacing={2} align="flex-end">
                      <FormControl flex={1}>
                        <FormLabel htmlFor={`credits-${index}`} fontSize={{ base: "xs", md: "sm" }}>Credits</FormLabel>
                        <Input
                          id={`credits-${index}`}
                          type="number"
                          placeholder="e.g., 3"
                          value={course.credits}
                          onChange={(e) => handleCourseChange(index, 'credits', e.target.value)}
                          size={{ base: "sm", md: "md" }}
                        />
                      </FormControl>
                      <FormControl flex={1}>
                        <FormLabel htmlFor={`grade-${index}`} fontSize={{ base: "xs", md: "sm" }}>Grade</FormLabel>
                        <Select
                          id={`grade-${index}`}
                          value={course.grade}
                          onChange={(e) => handleCourseChange(index, 'grade', e.target.value)}
                          size={{ base: "sm", md: "md" }}
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
                        size={{ base: "sm", md: "md" }}
                      />
                    </HStack>
                  </VStack>
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
            size={{ base: "sm", md: "md" }}
            fontSize={{ base: "sm", md: "md" }}
          >
            Add Another Course
          </Button>
        </VStack>

        {/* Right Column: GPA Display and Actions */}
        <Box>
          <Card 
            bg={cardBg} 
            borderWidth="1px" 
            borderColor={borderColor} 
            borderRadius="lg" 
            p={{ base: 4, md: 6 }} 
            position={{ base: "static", lg: "sticky" }} 
            top="80px"
          >
            <VStack spacing={4} align="stretch">
              <Heading size={{ base: "sm", md: "md" }}>Summary</Heading>
              <Divider />
              <Flex justify="space-between">
                <Text fontWeight="bold" fontSize={{ base: "sm", md: "md" }}>Total Courses:</Text>
                <Text fontSize={{ base: "sm", md: "md" }}>{courses.length}</Text>
              </Flex>
              <Flex justify="space-between">
                <Text fontWeight="bold" fontSize={{ base: "sm", md: "md" }}>Total Credits:</Text>
                <Text fontSize={{ base: "sm", md: "md" }}>{totalCredits}</Text>
              </Flex>
              <Divider />
              {gpa !== null && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <VStack spacing={2} bg={useColorModeValue('blue.50', 'blue.900')} p={{ base: 3, md: 4 }} borderRadius="md">
                    <Text fontSize={{ base: "md", md: "lg" }} color={mutedText}>Your Semester GPA is</Text>
                    <Heading size={{ base: "xl", md: "2xl" }} color={primaryColor}>{gpa}</Heading>
                  </VStack>
                </motion.div>
              )}
              <Button
                leftIcon={<FiCodesandbox />}
                colorScheme="blue"
                onClick={calculateGpa}
                size={{ base: "md", md: "lg" }}
                w="100%"
                fontSize={{ base: "sm", md: "md" }}
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
