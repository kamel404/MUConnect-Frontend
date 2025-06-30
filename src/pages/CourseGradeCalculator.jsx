import React, { useState, useMemo } from 'react';
import {
  Box,
  Heading,
  Text,
  Input,
  Button,
  VStack,
  HStack,
  FormControl,
  FormLabel,
  Card,
  CardBody,
  Flex,
  Divider,
  useColorModeValue,
  useToast,
  Icon,
  SimpleGrid,
  NumberInput,
  NumberInputField,
  IconButton,
  Alert,
  AlertIcon,
  Tooltip,
} from '@chakra-ui/react';
import { FiBookOpen, FiPlus, FiTrash2, FiStar } from 'react-icons/fi';
import { FaCalculator } from 'react-icons/fa6';
import { motion } from 'framer-motion';

const initialComponents = [
  { id: 1, name: 'Partial Exam 1', weight: 15, grade: '' },
  { id: 2, name: 'Partial Exam 2', weight: 15, grade: '' },
  { id: 3, name: 'Quizzes (Avg)', weight: 15, grade: '' },
  { id: 4, name: 'Assignment', weight: 10, grade: '' },
  { id: 5, name: 'Attendance', weight: 5, grade: '' },
  { id: 6, name: 'Participation', weight: 5, grade: '' },
  { id: 7, name: 'Final Exam', weight: 35, grade: '' },
];

const getLetterGrade = (score) => {
  if (score >= 95) return 'A+';
  if (score >= 90) return 'A';
  if (score >= 85) return 'B+';
  if (score >= 80) return 'B';
  if (score >= 75) return 'C+';
  if (score >= 70) return 'C';
  if (score >= 65) return 'D+';
  if (score >= 60) return 'D';
  return 'F';
};

const CourseGradeCalculator = () => {
  const toast = useToast();
  const [components, setComponents] = useState(initialComponents);
  const [passingGrade, setPassingGrade] = useState(70);
  const [result, setResult] = useState(null);
  const [nextId, setNextId] = useState(7);
  const [finalExamId, setFinalExamId] = useState(7); // Default to the initial 'Final Exam' component

  const totalWeight = useMemo(() => {
    return components.reduce((sum, comp) => sum + Number(comp.weight || 0), 0);
  }, [components]);

  const handleComponentChange = (id, field, value) => {
    let processedValue = value;
    // For numeric fields, validate the range and type
    if (field === 'weight' || field === 'grade') {
      // Allow empty string to clear the field, otherwise validate
      if (value !== '') {
        const num = Number(value);
        if (isNaN(num) || num < 0 || num > 100) {
          return; // Invalid number, so we do nothing
        }
        processedValue = num;
      }
    }

    setComponents(components.map(c => c.id === id ? { ...c, [field]: processedValue } : c));
    setResult(null);
  };

  const addComponent = () => {
    setComponents([...components, { id: nextId, name: '', weight: 0, grade: '' }]);
    setNextId(nextId + 1);
  };

  const deleteComponent = (id) => {
    // If the deleted component was the designated final exam, reset the finalExamId
    if (id === finalExamId) {
      setFinalExamId(null);
    }
    setComponents(components.filter(c => c.id !== id));
    setResult(null);
  };

  const calculate = () => {
    if (totalWeight !== 100) {
      toast({ title: 'Invalid Weights', description: `Total weight must be 100%, but it is currently ${totalWeight}%.`, status: 'error', duration: 5000, isClosable: true });
      return;
    }

    const finalExam = finalExamId ? components.find(c => c.id === finalExamId) : null;
    const finalProvided = finalExam && finalExam.grade !== '';

    if (finalProvided) {
      let total = 0;
      components.forEach(comp => {
        const grade = parseFloat(comp.grade);
        const weight = parseFloat(comp.weight);
        if (!isNaN(grade) && !isNaN(weight)) {
          total += (grade * weight) / 100;
        }
      });
      const letterGrade = getLetterGrade(total);
      setResult({ overall: total.toFixed(2), passed: total >= passingGrade, letterGrade });
    } else {
      if (!finalExam) {
        toast({ title: 'Final Exam Not Set', description: 'Please select which component is the final exam to calculate the required score.', status: 'info', duration: 5000, isClosable: true });
        return;
      }

      let currentTotal = 0;
      components.forEach(comp => {
        if (comp.id !== finalExamId) {
          const grade = parseFloat(comp.grade);
          const weight = parseFloat(comp.weight);
          if (!isNaN(grade) && !isNaN(weight)) {
            currentTotal += (grade * weight) / 100;
          }
        }
      });

      const finalWeight = parseFloat(finalExam.weight);
      if (isNaN(finalWeight) || finalWeight === 0) {
        toast({ title: 'Invalid Final Weight', description: 'The final exam must have a weight greater than 0.', status: 'error', duration: 5000, isClosable: true });
        return;
      }

      const requiredFinal = ((passingGrade - currentTotal) * 100) / finalWeight;
      setResult({
        currentTotal: currentTotal.toFixed(2),
        neededFinal: requiredFinal,
      });
    }
  };

  const resetForm = () => {
    setComponents(initialComponents);
    setPassingGrade(70);
    setResult(null);
  };

  const cardBg = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'whiteAlpha.900');
  const mutedText = useColorModeValue('gray.600', 'gray.400');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  return (
    <Box>
      {/* Header, etc. */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Card mb={6} p={6} borderRadius="xl" borderWidth="1px" borderColor={borderColor} bg={cardBg}>
          <Flex alignItems="center" gap={4}>
            <Icon as={FiBookOpen} w={10} h={10} color={useColorModeValue('blue.600', 'blue.400')} />
            <Box>
              <Heading size="lg" color={textColor}>Dynamic Grade Calculator</Heading>
              <Text color={mutedText}>Add, remove, and edit grade components to match any course structure.</Text>
            </Box>
          </Flex>
        </Card>
      </motion.div>

      {/* Main Card */}
      <Card bg={cardBg} borderWidth="1px" borderColor={borderColor} borderRadius="lg">
        <CardBody>
          <VStack spacing={6} align="stretch">
            {/* --- Settings --- */}
            <VStack spacing={4} align="stretch" p={4} borderWidth="1px" borderRadius="md">
              <Heading size="sm">Settings</Heading>
              <FormControl>
                <FormLabel>Passing Grade (%)</FormLabel>
                <NumberInput value={passingGrade} onChange={(v) => setPassingGrade(Number(v))} min={0} max={100}>
                  <NumberInputField />
                </NumberInput>
              </FormControl>
              <Box>
                <Text fontWeight="bold">Total Weight: {totalWeight}%</Text>
                {totalWeight !== 100 && (
                  <Alert status="warning" mt={2} borderRadius="md">
                    <AlertIcon />
                    Must equal 100%.
                  </Alert>
                )}
              </Box>
            </VStack>

            {/* --- Components --- */}
            <VStack spacing={4} align="stretch">
              {components.map((comp, index) => (
                <motion.div key={comp.id} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
                  <HStack spacing={3} p={3} borderWidth="1px" borderRadius="md" bg={useColorModeValue('gray.50', 'gray.700')}>
                    <Tooltip label="Set as Final Exam" placement="top">
                      <IconButton
                        aria-label="Set as Final Exam"
                        icon={<FiStar />}
                        isRound
                        variant={finalExamId === comp.id ? 'solid' : 'ghost'}
                        colorScheme={finalExamId === comp.id ? 'yellow' : 'gray'}
                        onClick={() => setFinalExamId(comp.id)}
                      />
                    </Tooltip>
                    <Input
                      placeholder="Component Name (e.g., Midterm)"
                      value={comp.name}
                      onChange={(e) => handleComponentChange(comp.id, 'name', e.target.value)}
                      fontWeight="bold"
                    />
                    <NumberInput
                      value={comp.weight}
                      onChange={(v) => handleComponentChange(comp.id, 'weight', v)}
                      min={0}
                      max={100}
                      w="120px"
                    >
                      <NumberInputField placeholder="Weight %" />
                    </NumberInput>
                    <NumberInput
                      value={comp.grade}
                      onChange={(v) => handleComponentChange(comp.id, 'grade', v)}
                      min={0}
                      max={100}
                      w="120px"
                    >
                      <NumberInputField placeholder="/100" />
                    </NumberInput>
                    <IconButton
                      aria-label="Delete component"
                      icon={<FiTrash2 />}
                      colorScheme="red"
                      variant="ghost"
                      onClick={() => deleteComponent(comp.id)}
                    />
                  </HStack>
                </motion.div>
              ))}
            </VStack>

            {/* --- Actions --- */}
            <HStack spacing={4} mt={4} w="full">
              <Button leftIcon={<FiPlus />} onClick={addComponent} w="full">Add Component</Button>
            </HStack>
            <HStack spacing={4} mt={2} w="full">
              <Button leftIcon={<FaCalculator />} colorScheme="blue" onClick={calculate} w="full">Calculate</Button>
              <Button onClick={resetForm} w="full">Reset</Button>
            </HStack>
          </VStack>
        </CardBody>
      </Card>

      {/* Result Card */}
      {(() => {
        if (!result) return null;

        let status = 'info';
        let message = '';
        if (result.overall) {
          status = result.passed ? 'success' : 'error';
        } else if (result.neededFinal) {
          if (result.neededFinal <= 0) {
            status = 'success';
            message = 'You have already secured a passing grade! 🎉';
          } else if (result.neededFinal > 100) {
            status = 'error';
            message = 'It is impossible to reach the passing grade.';
          } else {
            status = 'info';
            message = 'This is the minimum score required on the final to pass.';
          }
        }

        const resultColors = {
          success: { bg: useColorModeValue('green.50', 'green.900'), borderColor: useColorModeValue('green.200', 'green.700') },
          error: { bg: useColorModeValue('red.50', 'red.900'), borderColor: useColorModeValue('red.200', 'red.700') },
          info: { bg: useColorModeValue('blue.50', 'blue.900'), borderColor: useColorModeValue('blue.200', 'blue.700') },
        };

        const props = resultColors[status];

        return (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Card mt={6} bg={props.bg} borderWidth="1px" borderColor={props.borderColor} borderRadius="lg" p={6}>
              <VStack spacing={2} textAlign="center">
                {result.overall && (
                  <>
                    <Heading size="lg">Result</Heading>
                    <Text fontSize="4xl" fontWeight="bold">
                      {result.overall} <Text as="span" fontSize="3xl" fontWeight="medium">({result.letterGrade})</Text>
                    </Text>
                    <Text fontSize="md" color={mutedText} mt={-2}>Overall Grade</Text>
                    <Divider my={3} />
                    <Text fontSize="lg" fontWeight="semibold">{result.passed ? 'Congratulations, you passed!' : 'You did not pass.'}</Text>
                  </>
                )}
                {result.currentTotal !== undefined && (
                  <>
                    <Heading size="lg">Calculation</Heading>
                    <Text fontSize="lg">Your current grade (without the final) is <strong>{result.currentTotal}%</strong>.</Text>
                    <Divider my={3} />
                    <Text fontSize="lg">To pass, you need at least:</Text>
                    <Text fontSize="4xl" fontWeight="bold">{result.neededFinal.toFixed(2)}%</Text>
                    <Text fontSize="md" color={mutedText} mt={-2}>on the Final Exam</Text>
                    <Text fontSize="sm" mt={2}>{message}</Text>
                  </>
                )}
              </VStack>
            </Card>
          </motion.div>
        );
      })()}
    </Box>
  );
};

export default CourseGradeCalculator;
