import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Text,
  useToast,
  Container,
  Heading,
  Flex,
  Image,
  Icon,
  Select,
  InputGroup,
  InputLeftElement,
  FormErrorMessage,
  Alert,
  AlertIcon,
  Spinner,
  Center,
  VStack,
} from "@chakra-ui/react";
import { FiUser, FiMail, FiArrowRight, FiBookOpen, FiBookmark } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import { useAcademicData } from "../context/AcademicDataContext";
import { getStoredGoogleTempToken } from "../services/googleAuthService";
import MaarefLogo from "../assets/maaref-logo.png";

const CompleteGoogleRegistration = () => {
  const [formData, setFormData] = useState({
    username: "",
    faculty_id: "",
    major_id: "",
    temp_token: "",
    email: "",
    name: "",
  });

  // States for form handling
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tokenExpired, setTokenExpired] = useState(false);
  const [formProcessing, setFormProcessing] = useState(false);

  // Get academic data from context
  const {
    faculties,
    majors,
    selectedFaculty,
    selectedMajor,
    isLoading: academicDataLoading,
    updateSelectedFaculty,
    updateSelectedMajor,
  } = useAcademicData();
  const [formError, setFormError] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(null);

  // Hooks
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const { completeGoogleSignUp, user } = useAuth();

  // Initialize form data from location state or local storage
  useEffect(() => {
    // Try to get data from location state first (direct navigation from GoogleCallback)
    if (location.state?.temp_token) {
      setFormData(prevData => ({
        ...prevData,
        temp_token: location.state.temp_token,
        email: location.state.email || "",
        name: location.state.name || "",
      }));
    } else {
      // If no location state, try to get token from localStorage
      const storedToken = getStoredGoogleTempToken();
      if (!storedToken) {
        // No token found - user may have navigated here directly
        toast({
          title: "Session expired",
          description: "Your registration session has expired or is invalid. Please start over.",
          status: "error",
          duration: 5000,
        });
        setTokenExpired(true);
        setTimeout(() => navigate("/login"), 2000);
        return;
      }
      
      // We have a token but no email/name - set what we have
      setFormData(prevData => ({
        ...prevData,
        temp_token: storedToken,
      }));
    }

    // Calculate token expiration time (30 minutes from when it was issued)
    // For simplicity, we'll assume the token was issued when this component mounted
    // In a production app, the token should include its issue time
    const expirationTime = 30 * 60 * 1000; // 30 minutes in milliseconds
    const timer = setInterval(() => {
      const remaining = Math.max(0, expirationTime - (Date.now() - new Date().getTime()));
      if (remaining <= 0) {
        clearInterval(timer);
        setTokenExpired(true);
        toast({
          title: "Session expired",
          description: "Your registration token has expired. Please start over.",
          status: "warning",
          duration: 5000,
        });
        navigate("/login");
        return;
      }
      setTimeRemaining(Math.floor(remaining / 1000 / 60)); // remaining in minutes
    }, 60000); // Check every minute

    return () => clearInterval(timer);
  }, [location.state, navigate, toast]);

  // If user is already authenticated, redirect to dashboard
  useEffect(() => {
    if (user) {
      navigate("/dashboard", { replace: true });
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
    
    // Handle faculty/major changes with context
    if (name === 'faculty_id') {
      updateSelectedFaculty(value);
      // Reset major when faculty changes
      setFormData(prevData => ({ ...prevData, major_id: "" }));
    } else if (name === 'major_id') {
      updateSelectedMajor(value);
    }
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prevErrors => ({ ...prevErrors, [name]: undefined }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    } else if (formData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    }
    
    if (!formData.faculty_id) {
      newErrors.faculty_id = "Please select your faculty";
    }
    
    if (!formData.major_id) {
      newErrors.major_id = "Please select your major";
    }
    
    if (!formData.temp_token) {
      newErrors.temp_token = "Registration session has expired";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormProcessing(true);
    setFormError(null);

    try {
      // Validate form
      if (!formData.username) {
        throw new Error('Username is required');
      }
      if (!formData.faculty_id) {
        throw new Error('Faculty selection is required');
      }
      if (!formData.major_id) {
        throw new Error('Major selection is required');
      }

      // Get the token from location state or localStorage
      const tempToken = location.state?.temp_token || localStorage.getItem('googleTempToken');
      
      if (!tempToken) {
        throw new Error('Registration token not found. Please try signing in with Google again.');
      }

      // Submit registration data to API - match the exact format from the backend specification
      // Format: { temp_token, username, faculty_id, major_id }
      const registrationResponse = await completeGoogleSignUp({
        temp_token: tempToken,
        username: formData.username,
        faculty_id: parseInt(formData.faculty_id), // Convert to number to ensure proper format
        major_id: parseInt(formData.major_id)      // Convert to number to ensure proper format
      });
      
      console.log('Registration completed, response:', registrationResponse);
      
      // Check if Sanctum token was returned and store it
      if (registrationResponse && registrationResponse.token) {
        console.log('Sanctum token received from backend after registration');
        localStorage.setItem('authToken', registrationResponse.token);
      } else {
        console.warn('No Sanctum token found in registration response');
      }

      // Show success message
      toast({
        title: 'Registration Complete!',
        description: 'Your account has been created successfully.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      // Clear temporary token
      localStorage.removeItem('googleTempToken');
      localStorage.removeItem('googleTokenExpiry');

      // Redirect to dashboard
      navigate('/dashboard');
    } catch (error) {
      console.error('Registration error:', error);
      
      // Extract error message from response if available
      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          'Failed to complete registration. Please try again.';
      setFormError(errorMessage);
      
      // Check if the error is due to an expired token
      if (errorMessage.includes('expired') || 
          errorMessage.includes('invalid') ||
          error.response?.status === 400) {
        setTokenExpired(true);
      }
    } finally {
      setFormProcessing(false);
    }
  };

  // Token has expired, show expired view
  if (tokenExpired) {
    return (
      <Center minH="100vh" bgGradient="linear(to-br, blue.50 0%, white 50%, blue.50 100%)">
        <VStack spacing={6}>
          <Image src={MaarefLogo} boxSize="80px" alt="Maaref Logo" />
          <Heading size="xl" color="red.500">Session Expired</Heading>
          <Text>Redirecting to login page...</Text>
          <Spinner size="md" color="blue.500" />
        </VStack>
      </Center>
    );
  }

  return (
    <Flex
      minH="100vh"
      bgGradient="linear(to-br, blue.50 0%, white 50%, blue.50 100%)"
      align="center"
      justify="center"
    >
      <Container maxW="container.md" px={[4, 8]}>
        <Box
          bg="white"
          p={[6, 12]}
          rounded="2xl"
          shadow="xl"
          position="relative"
          _before={{
            content: '""',
            position: "absolute",
            top: "-4px",
            left: "-4px",
            right: "-4px",
            bottom: "-4px",
            bgGradient: "linear(to-r, blue.500, teal.400)",
            borderRadius: "2xl",
            zIndex: -1,
          }}
        >
          <Flex align="center" mb={8} gap={3} justify="center">
            <Image src={MaarefLogo} boxSize="50px" alt="Maaref Logo" />
            <Heading size="xl" bgGradient="linear(to-r, blue.600, teal.500)" bgClip="text">
              Complete Your Registration
            </Heading>
          </Flex>

          {timeRemaining !== null && (
            <Alert status="info" mb={6} borderRadius="md">
              <AlertIcon />
              Please complete your registration within {timeRemaining} minutes.
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <Stack spacing={6}>
              {/* Email field (non-editable) */}
              <FormControl isReadOnly>
                <FormLabel color="gray.600">Email</FormLabel>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <Icon as={FiMail} color="blue.500" aria-label="Email icon" />
                  </InputLeftElement>
                  <Input
                    name="email"
                    value={formData.email}
                    placeholder="your.email@mu.edu.lb"
                    size="lg"
                    bg="gray.50"
                    focusBorderColor="blue.500"
                    color="gray.600"
                  />
                </InputGroup>
              </FormControl>

              {/* Username field */}
              <FormControl isRequired isInvalid={!!errors.username}>
                <FormLabel color="gray.600">Username</FormLabel>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <Icon as={FiUser} color="blue.500" aria-label="Username icon" />
                  </InputLeftElement>
                  <Input
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Choose a unique username"
                    size="lg"
                    focusBorderColor="blue.500"
                    _placeholder={{ color: 'gray.400' }}
                    color="gray.800"
                  />
                </InputGroup>
                {errors.username && (
                  <FormErrorMessage>{errors.username}</FormErrorMessage>
                )}
              </FormControl>

              {/* Faculty dropdown */}
              <FormControl isRequired isInvalid={!!errors.faculty_id}>
                <FormLabel color="gray.600">Faculty</FormLabel>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <Icon as={FiBookOpen} color="blue.500" aria-label="Faculty icon" />
                  </InputLeftElement>
                  <Select
                    name="faculty_id"
                    value={formData.faculty_id}
                    onChange={handleChange}
                    placeholder={academicDataLoading ? "Loading faculties..." : "Select your faculty"}
                    size="lg"
                    focusBorderColor="blue.500"
                    color="gray.800"
                    isDisabled={academicDataLoading}
                  >
                    {faculties.map(faculty => (
                      <option key={faculty.id} value={faculty.id}>
                        {faculty.name}
                      </option>
                    ))}
                  </Select>
                </InputGroup>
                {errors.faculty_id && (
                  <FormErrorMessage>{errors.faculty_id}</FormErrorMessage>
                )}
              </FormControl>

              {/* Major dropdown */}
              <FormControl isRequired isInvalid={!!errors.major_id}>
                <FormLabel color="gray.600">Major</FormLabel>
                <InputGroup>
                  <InputLeftElement pointerEvents="none">
                    <Icon as={FiBookmark} color="blue.500" aria-label="Major icon" />
                  </InputLeftElement>
                  <Select
                    name="major_id"
                    value={formData.major_id}
                    onChange={handleChange}
                    placeholder={
                      !formData.faculty_id
                        ? "Select a faculty first"
                        : academicDataLoading
                        ? "Loading majors..."
                        : "Select your major"
                    }
                    size="lg"
                    focusBorderColor="blue.500"
                    color="gray.800"
                    isDisabled={!formData.faculty_id || academicDataLoading}
                  >
                    {majors.map(major => (
                      <option key={major.id} value={major.id}>
                        {major.name}
                      </option>
                    ))}
                  </Select>
                </InputGroup>
                {errors.major_id && (
                  <FormErrorMessage>{errors.major_id}</FormErrorMessage>
                )}
              </FormControl>

              {/* Display form error if any */}
              {formError && (
                <Alert status="error" borderRadius="md">
                  <AlertIcon />
                  {formError}
                </Alert>
              )}

              <Button
                type="submit"
                colorScheme="blue"
                size="lg"
                height="60px"
                fontSize="lg"
                rightIcon={<Icon as={FiArrowRight} aria-label="Complete" />}
                isLoading={formProcessing}
                loadingText="Submitting"
                bgGradient="linear(to-r, blue.500, teal.400)"
                _hover={{ bgGradient: "linear(to-r, blue.600, teal.500)" }}
                _active={{ transform: "scale(0.98)" }}
              >
                Complete Registration
              </Button>
            </Stack>
          </form>
        </Box>
      </Container>
    </Flex>
  );
};

export default CompleteGoogleRegistration;
