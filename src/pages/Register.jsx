import { useState, useEffect } from "react";
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
  Link as ChakraLink,
  InputGroup,
  InputLeftElement,
  Divider,
  Flex,
  Grid,
  Image,
  Icon,
  Select,
  Progress,
  VStack,
  HStack,
  Circle,
  Fade,
  ScaleFade,
  SlideFade,
  useDisclosure,
  Center,
  Spinner,
  useColorModeValue,
} from "@chakra-ui/react";
import {
  FiUser,
  FiMail,
  FiLock,
  FiArrowRight,
  FiBookOpen,
  FiBookmark,
  FiCheck,
  FiArrowLeft,
} from "react-icons/fi";
import { register } from "../services/authService";
import { Link, useNavigate } from "react-router-dom";
import MaarefLogo from "../assets/maaref-logo.png";

import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

const Register = () => {
  const [preparingFeed, setPreparingFeed] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    username: "",
    email: "",
    password: "",
    password_confirmation: "",
    faculty_id: "",
    major_id: "",
  });

  // Faculties and majors state
  const [faculties, setFaculties] = useState([]);
  const [majors, setMajors] = useState([]);
  const [facultiesLoading, setFacultiesLoading] = useState(true);
  const [majorsLoading, setMajorsLoading] = useState(false);
  const [facultiesError, setFacultiesError] = useState("");
  const [majorsError, setMajorsError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  // For loading animations
  const [loadingProgress, setLoadingProgress] = useState(0);
  
  const toast = useToast();
  const navigate = useNavigate();
  
  // Define colors - using light theme to match Login page
  const bgGradient = "linear(to-br, blue.50 0%, white 50%, blue.50 100%)";
  const cardBg = "white";
  const accentGradient = "linear(to-r, blue.500, teal.400)";
  const accentHoverGradient = "linear(to-r, blue.600, teal.500)";
  const questionColor = "gray.700";
  const borderColor = "gray.200";

  // Array of steps in the registration process
  const steps = [
    { id: "welcome", title: "Welcome" },
    { id: "name", title: "Your Name" },
    { id: "username", title: "Create Username" },
    { id: "email", title: "Your Email" },
    { id: "password", title: "Set Password" },
    { id: "faculty", title: "Your Faculty" },
    { id: "major", title: "Your Major" },
    { id: "complete", title: "Complete" }
  ];

  // Handler for form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear username error when editing username
    if (name === "username" && fieldErrors.username) {
      setFieldErrors(prev => ({ ...prev, username: undefined }));
    }
  };

  // Handler for faculty selection
  const handleFacultyChange = (e) => {
    const facultyId = e.target.value;
    setFormData(prev => ({ ...prev, faculty_id: facultyId, major_id: "" }));
  };

  // Handler for major selection
  const handleMajorChange = (e) => {
    const majorId = e.target.value;
    setFormData(prev => ({ ...prev, major_id: majorId }));
  };

  // Field validation logic
  const validateFields = (step = currentStep) => {
    const errors = {};
    switch (step) {
      case 1: // Name step
        if (!formData.first_name.trim()) errors.first_name = "First name is required.";
        if (!formData.last_name.trim()) errors.last_name = "Last name is required.";
        break;
      case 2: // Username step
        if (!formData.username.trim()) errors.username = "Username is required.";
        break;
      case 3: // Email step
        if (!formData.email.trim()) {
          errors.email = "Email is required.";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
          errors.email = "Invalid email address format.";
        } else if (!formData.email.endsWith("@mu.edu.lb")) {
          errors.email = "Email must be a university email (@mu.edu.lb).";
        }
        break;
      case 4: // Password step
        if (!formData.password) errors.password = "Password is required.";
        else if (formData.password.length < 6) errors.password = "Password must be at least 6 characters.";
        if (!formData.password_confirmation) errors.password_confirmation = "Please confirm your password.";
        else if (formData.password !== formData.password_confirmation) errors.password_confirmation = "Passwords do not match.";
        break;
      case 5: // Faculty step
        if (!formData.faculty_id) errors.faculty_id = "Faculty is required.";
        break;
      case 6: // Major step
        if (!formData.major_id) errors.major_id = "Major is required.";
        break;
      default:
        break;
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Helper function to check if current step is valid
  const isCurrentStepValid = () => {
    return validateFields(currentStep);
  };

  // Navigate to next step if validation passes
  const goToNextStep = () => {
    // Prevent moving forward if there's a username uniqueness error
    if (currentStep === 2 && fieldErrors.username) {
      toast({
        title: fieldErrors.username,
        status: "error",
        duration: 3000,
      });
      return;
    }
    if (isCurrentStepValid()) {
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1);
      }
    } else {
      toast({
        title: "Please correct the errors",
        status: "error",
        duration: 2500,
      });
    }
  };
  
  // Handle key down events for inputs (Enter key)
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && isCurrentStepValid() && currentStep < 7) {
      e.preventDefault();
      goToNextStep();
    }
  };

  // Go back to previous step
  const goToPreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Start the feed preparation animation
  const startPreparingFeed = () => {
    setPreparingFeed(true);
    setLoadingProgress(0);
    
    // Simulate progress for the feed preparation
    const interval = setInterval(() => {
      setLoadingProgress(prev => {
        const newProgress = prev + Math.random() * 10;
        if (newProgress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            completeRegistration();
          }, 500);
          return 100;
        }
        return newProgress;
      });
    }, 300);
  };

  // Handle final submission
  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setLoadingProgress(true);

    try {
      // Validate all fields before submit
      let allValid = true;
      for (let step = 1; step <= 6; step++) {
        if (!validateFields(step)) {
          allValid = false;
          setCurrentStep(step);
          break;
        }
      }
      if (!allValid) {
        toast({
          title: "Please fix the highlighted errors before submitting.",
          status: "error",
          duration: 4000,
        });
        setLoadingProgress(false);
        return;
      }
      // Prepare payload for backend
      const payload = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        username: formData.username,
        email: formData.email,
        password: formData.password,
        password_confirmation: formData.password_confirmation,
        faculty_id: formData.faculty_id,
        major_id: formData.major_id,
      };
      await register(payload);
      startPreparingFeed();
    } catch (error) {
      // If backend returns field errors, display them under the relevant fields
      if (error && typeof error === 'object' && error.errors) {
        setFieldErrors(prev => ({ ...prev, ...error.errors }));
        // Go to the first step containing a backend error
        const fieldStepMap = {
          first_name: 1,
          last_name: 1,
          username: 2,
          email: 3,
          password: 4,
          password_confirmation: 4,
          faculty_id: 5,
          major_id: 6
        };
        const errorFields = Object.keys(error.errors);
        if (errorFields.length > 0) {
          const firstErrorStep = Math.min(...errorFields.map(f => fieldStepMap[f] || 1));
          setCurrentStep(firstErrorStep);
        }
        // Prevent progression if username is taken
        if (error.errors.username) {
          // Stay on username step
          setCurrentStep(2);
        }
      } else {
        toast({
          title: error.message || "Registration failed",
          status: "error",
          duration: 3000,
        });
      }
      setLoadingProgress(false);
    }
  };
  
  // Complete registration and redirect
  const completeRegistration = () => {
    toast({
      title: "Registration successful",
      description: "Your personalized feed is ready",
      status: "success",
      duration: 3000,
    });
    navigate("/dashboard");
  };
  
  // Fetch faculties on mount
  useEffect(() => {
    setFacultiesLoading(true);
    import('../services/authService').then(({ getFaculties }) => {
      getFaculties().then(data => {
        setFaculties(data);
        setFacultiesLoading(false);
        setFacultiesError("");
      }).catch((err) => {
        setFaculties([]);
        setFacultiesLoading(false);
        setFacultiesError("Failed to load faculties. Please try again later.");
        toast({
          title: "Failed to load faculties",
          description: err?.message || "Please check your connection and try again.",
          status: "error",
          duration: 5000,
        });
      });
    });
  }, []);

  // Fetch majors when faculty_id changes
  useEffect(() => {
    if (formData.faculty_id) {
      setMajorsLoading(true);
      setMajors([]);
      import('../services/authService').then(({ getMajors }) => {
        getMajors(formData.faculty_id).then(data => {
          setMajors(data);
          setMajorsLoading(false);
          setMajorsError("");
        }).catch((err) => {
          setMajors([]);
          setMajorsLoading(false);
          setMajorsError("Failed to load majors. Please try again later.");
          toast({
            title: "Failed to load majors",
            description: err?.message || "Please check your connection and try again.",
            status: "error",
            duration: 5000,
          });
        });
      });
    } else {
      setMajors([]);
    }
    // Reset major_id when faculty changes
    setFormData(prev => ({ ...prev, major_id: "" }));
  }, [formData.faculty_id]);

  // Render the step by step registration flow
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <Center minH="100vh">
        <Spinner size="xl" color="blue.500" />
      </Center>
    );
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <Flex
      minH="100vh"
      bgGradient={bgGradient}
      align="center"
      justify="center"
    >
      {/* Loading Screen for preparing personalized feed */}
      {preparingFeed ? (
        <Box
          position="fixed"
          top="0"
          left="0"
          right="0"
          bottom="0"
          zIndex="1000"
          bg={bgGradient}
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
        >
          <ScaleFade initialScale={0.9} in={preparingFeed}>
            <VStack spacing={8} maxW="500px" textAlign="center" p={4}>
              <Image src={MaarefLogo} boxSize="80px" alt="Maaref Logo" />
              
              <Heading
                fontSize="3xl"
                bgGradient="linear(to-r, blue.500, teal.400)"
                bgClip="text"
                letterSpacing="tight"
              >
                Setting up your personalized experience
              </Heading>
              
              <Box w="full">
                <Text mb={2} fontWeight="medium" color={questionColor}>
                  {loadingProgress < 30 ? "Analyzing your academic profile..." :
                   loadingProgress < 60 ? "Finding relevant resources..." :
                   loadingProgress < 90 ? "Preparing your personalized feed..." :
                   "Almost done!"}
                </Text>
                <Progress 
                  value={loadingProgress} 
                  colorScheme="blue" 
                  h="10px" 
                  rounded="full" 
                  mb={3}
                  hasStripe
                  isAnimated
                />
              </Box>
              
              <Text color="gray.500" fontSize="md">
                Customizing your campus experience based on your major.
                <br />
                This will only take a moment...
              </Text>
            </VStack>
          </ScaleFade>
        </Box>
      ) : (
        <Container maxW="container.md" py={8}>
          <Box
            bg={cardBg}
            p={[6, 8]}
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
              bgGradient: accentGradient,
              borderRadius: "2xl",
              zIndex: -1,
            }}
          >
            <Flex align="center" mb={6} gap={3} justify="center">
              <Image src={MaarefLogo} boxSize="50px" alt="Maaref Logo" />
              <Heading size="xl" bgGradient={accentGradient} bgClip="text">
                MU Connect
              </Heading>
            </Flex>

            {/* Progress bar */}
            {currentStep > 0 && currentStep < steps.length - 1 && (
              <Box mb={6}>
                <Progress
                  value={(currentStep / (steps.length - 2)) * 100}
                  size="sm"
                  colorScheme="blue"
                  borderRadius="full"
                />
                <Flex justify="space-between" mt={2}>
                  <Text fontSize="sm" color="gray.500">
                    Step {currentStep} of {steps.length - 2}
                  </Text>
                  <Text fontSize="sm" color="gray.500">
                    {steps[currentStep].title}
                  </Text>
                </Flex>
              </Box>
            )}
            
            <Box minH="320px" display="flex" flexDirection="column" justifyContent="center">
              {/* Welcome Step */}
              {currentStep === 0 && (
                <SlideFade in={currentStep === 0} offsetY="20px">
                  <VStack spacing={6} textAlign="center" py={4}>
                    <Heading bgGradient={accentGradient} bgClip="text" size="xl">
                      Welcome to MU Connect
                    </Heading>
                    <Text fontSize="lg" color={questionColor}>
                      Let's set up your personalized academic experience.
                    </Text>
                    <Text color="gray.500">
                      We'll ask you a few questions to customize your campus experience
                      and show you resources relevant to your academic interests.
                    </Text>
                    <Button
                      colorScheme="blue"
                      size="lg"
                      rightIcon={<FiArrowRight />}
                      onClick={goToNextStep}
                      bgGradient={accentGradient}
                      _hover={{ bgGradient: accentHoverGradient }}
                      mt={4}
                    >
                      Get Started
                    </Button>
                  </VStack>
                </SlideFade>
              )}
              
              {/* Name Step */}
              {currentStep === 1 && (
                <SlideFade in={currentStep === 1} offsetY="20px">
                  <VStack spacing={8} py={4}>
                    <Heading fontSize="2xl" color={questionColor} textAlign="center">
                      What's your name?
                    </Heading>
                    
                    <Grid templateColumns={["1fr", "1fr 1fr"]} gap={6} width="100%">
                      <FormControl isRequired>
                        <FormLabel color="gray.600">First Name</FormLabel>
                        <InputGroup>
                          <InputLeftElement pointerEvents="none">
                            <Icon as={FiUser} color="blue.500" />
                          </InputLeftElement>
                          <Input
                            name="first_name"
                            placeholder="John"
                            focusBorderColor="blue.500"
                            size="lg"
                            color="gray.800"
                            value={formData.first_name}
                            onChange={handleChange}
                            onKeyDown={handleKeyDown}
                          />
                        </InputGroup>
                      </FormControl>

                      <FormControl isRequired>
                        <FormLabel color="gray.600">Last Name</FormLabel>
                        <InputGroup>
                          <InputLeftElement pointerEvents="none">
                            <Icon as={FiUser} color="blue.500" />
                          </InputLeftElement>
                          <Input
                            name="last_name"
                            placeholder="Doe"
                            focusBorderColor="blue.500"
                            size="lg"
                            color="gray.800"
                            value={formData.last_name}
                            onChange={handleChange}
                            onKeyDown={handleKeyDown}
                          />
                        </InputGroup>
                      </FormControl>
                    </Grid>
                  </VStack>
                </SlideFade>
              )}
              
              {/* Username Step */}
              {currentStep === 2 && (
                <SlideFade in={currentStep === 2} offsetY="20px">
                  <VStack spacing={8} py={4}>
                    <Heading fontSize="2xl" color={questionColor} textAlign="center">
                      Create a username
                    </Heading>
                    
                    <FormControl isRequired width="100%">
                      <FormLabel color="gray.600">Username</FormLabel>
                      <InputGroup>
                        <InputLeftElement pointerEvents="none">
                          <Icon as={FiUser} color="blue.500" />
                        </InputLeftElement>
                        <Input
                          name="username"
                          placeholder="@johndoe"
                          focusBorderColor="blue.500"
                          size="lg"
                          color="gray.800"
                          value={formData.username}
                          onChange={handleChange}
                          onKeyDown={handleKeyDown}
                          _placeholder={{ color: 'gray.400' }}
                        />
                      </InputGroup>
                      <Text fontSize="sm" color="gray.500" mt={2}>
                        This will be your unique identifier on MU Connect
                      </Text>
                    </FormControl>
                  </VStack>
                </SlideFade>
              )}
              
              {/* Email Step */}
              {currentStep === 3 && (
                <SlideFade in={currentStep === 3} offsetY="20px">
                  <VStack spacing={8} py={4}>
                    <Heading fontSize="2xl" color={questionColor} textAlign="center">
                      What's your email address?
                    </Heading>
                    
                    <FormControl isRequired width="100%" isInvalid={!!fieldErrors.email}>
                      <FormLabel color="gray.600">Email</FormLabel>
                      <InputGroup>
                        <InputLeftElement pointerEvents="none">
                          <Icon as={FiMail} color="blue.500" />
                        </InputLeftElement>
                        <Input
                          type="email"
                          name="email"
                          placeholder="id@mu.edu.lb"
                          focusBorderColor="blue.500"
                          size="lg"
                          color="gray.800"
                          value={formData.email}
                          onChange={handleChange}
                          onKeyDown={handleKeyDown}
                          _placeholder={{ color: 'gray.400' }}
                        />
                      </InputGroup>
                      {fieldErrors.email && (
                        <Text color="red.500" fontSize="sm" mt={1}>{fieldErrors.email}</Text>
                      )}
                      <Text fontSize="sm" color="gray.500" mt={2}>
                        We'll use this to verify your account
                      </Text>
                    </FormControl>
                  </VStack>
                </SlideFade>
              )}
              
              {/* Password Step */}
              {currentStep === 4 && (
                <SlideFade in={currentStep === 4} offsetY="20px">
                  <VStack spacing={8} py={4}>
                    <Heading fontSize="2xl" color={questionColor} textAlign="center">
                      Create a secure password
                    </Heading>
                    
                    <Grid templateColumns={["1fr", "1fr 1fr"]} gap={6} width="100%">
                      <FormControl isRequired>
                        <FormLabel color="gray.600">Password</FormLabel>
                        <InputGroup>
                          <InputLeftElement pointerEvents="none">
                            <Icon as={FiLock} color="blue.500" />
                          </InputLeftElement>
                          <Input
                            type="password"
                            name="password"
                            placeholder="••••••••"
                            focusBorderColor="blue.500"
                            size="lg"
                            color="gray.800"
                            value={formData.password}
                            onChange={handleChange}
                            onKeyDown={handleKeyDown}
                            _placeholder={{ color: 'gray.400' }}
                          />
                        </InputGroup>
                      </FormControl>

                      <FormControl isRequired>
                        <FormLabel color="gray.600">Confirm Password</FormLabel>
                        <InputGroup>
                          <InputLeftElement pointerEvents="none">
                            <Icon as={FiLock} color="blue.500" />
                          </InputLeftElement>
                          <Input
                            type="password"
                            name="password_confirmation"
                            placeholder="••••••••"
                            focusBorderColor="blue.500"
                            size="lg"
                            color="gray.800"
                            value={formData.password_confirmation}
                            onChange={handleChange}
                            onKeyDown={handleKeyDown}
                            _placeholder={{ color: 'gray.400' }}
                          />
                        </InputGroup>
                      </FormControl>
                    </Grid>
                  </VStack>
                </SlideFade>
              )}
              
              {/* Faculty Step */}
              {currentStep === 5 && (
                <SlideFade in={currentStep === 5} offsetY="20px">
                  <VStack spacing={8} py={4}>
                    <Heading fontSize="2xl" color={questionColor} textAlign="center">
                      What faculty are you in?
                    </Heading>
                    <FormControl isRequired width="100%" isInvalid={!!fieldErrors.faculty_id}>
                      <FormLabel color="gray.600">Select your faculty</FormLabel>
                      <InputGroup>
                        <InputLeftElement pointerEvents="none">
                          <Icon as={FiBookOpen} color="blue.500" />
                        </InputLeftElement>
                        <Select
                          name="faculty_id"
                          placeholder={facultiesLoading ? "Loading..." : "Choose a faculty"}
                          focusBorderColor="blue.500"
                          size="lg"
                          color="gray.800"
                          value={formData.faculty_id}
                          onChange={handleFacultyChange}
                          pl={10}
                          isDisabled={facultiesLoading}
                          _placeholder={{ color: 'gray.400' }}
                        >
                          {faculties.map(faculty => (
                            <option key={faculty.id} value={faculty.id}>{faculty.name}</option>
                          ))}
                        </Select>
                      </InputGroup>
                      {facultiesError && (
                        <Text color="red.500" fontSize="sm" mt={1}>{facultiesError}</Text>
                      )}
                      {fieldErrors.faculty_id && (
                        <Text color="red.500" fontSize="sm" mt={1}>{fieldErrors.faculty_id}</Text>
                      )}
                      <Text fontSize="sm" color="gray.500" mt={2}>
                        This helps us show you relevant resources
                      </Text>
                    </FormControl>
                  </VStack>
                </SlideFade>
              )}
              
              {/* Major Step */}
              {currentStep === 6 && (
                <SlideFade in={currentStep === 6} offsetY="20px">
                  <VStack spacing={8} py={4}>
                    <Heading fontSize="2xl" color={questionColor} textAlign="center">
                      What's your major?
                    </Heading>
                    <FormControl isRequired width="100%" isInvalid={!!fieldErrors.major_id}>
                      <FormLabel color="gray.600">Select your major</FormLabel>
                      <InputGroup>
                        <InputLeftElement pointerEvents="none">
                          <Icon as={FiBookmark} color="blue.500" />
                        </InputLeftElement>
                        <Select
                          name="major_id"
                          placeholder={majorsLoading ? "Loading..." : (!formData.faculty_id ? "Choose a faculty first" : "Choose a major")}
                          focusBorderColor="blue.500"
                          size="lg"
                          color="gray.800"
                          value={formData.major_id}
                          onChange={handleMajorChange}
                          pl={10}
                          isDisabled={!formData.faculty_id || majorsLoading}
                          _placeholder={{ color: 'gray.400' }}
                        >
                          {majors.map(major => (
                            <option key={major.id} value={major.id}>{major.name}</option>
                          ))}
                        </Select>
                      </InputGroup>
                      {majorsError && (
                        <Text color="red.500" fontSize="sm" mt={1}>{majorsError}</Text>
                      )}
                      {fieldErrors.major_id && (
                        <Text color="red.500" fontSize="sm" mt={1}>{fieldErrors.major_id}</Text>
                      )}
                      <Text fontSize="sm" color="gray.500" mt={2}>
                        We'll personalize your experience based on your major
                      </Text>
                    </FormControl>
                  </VStack>
                </SlideFade>
              )}
              
              {/* Complete Step - with improved information display */}
              {currentStep === 7 && (
                <SlideFade in={currentStep === 7} offsetY="20px">
                  <VStack spacing={8} py={6} textAlign="center">
                    <Circle size="80px" bg="green.100" color="green.500">
                      <Icon as={FiCheck} boxSize="40px" />
                    </Circle>
                    
                    <Heading fontSize="2xl" color={questionColor}>
                      Ready to create your account
                    </Heading>
                    
                    <Box 
                      borderWidth="1px" 
                      borderColor={borderColor} 
                      borderRadius="lg" 
                      p={6} 
                      w="full"
                      bg="white"
                      boxShadow="lg"
                    >
                      <Grid templateColumns="1fr 2fr" gap={4} textAlign="left">
                        <Box>
                          <Text fontWeight="bold" mb={2} color="gray.500">Name:</Text>
                          <Text fontWeight="bold" mb={2} color="gray.500">Username:</Text>
                          <Text fontWeight="bold" mb={2} color="gray.500">Email:</Text>
                          <Text fontWeight="bold" mb={2} color="gray.500">Faculty:</Text>
                          <Text fontWeight="bold" mb={2} color="gray.500">Major:</Text>
                        </Box>
                        <Box>
                          <Text fontWeight="medium" mb={2} color="gray.800">{formData.first_name} {formData.last_name}</Text>
                          <Text fontWeight="medium" mb={2} color="gray.800">@{formData.username}</Text>
                          <Text fontWeight="medium" mb={2} color="gray.800">{formData.email}</Text>
                          <Text fontWeight="medium" mb={2} color="gray.800">{faculties.find(f => f.id === formData.faculty_id)?.name || ''}</Text>
                          <Text fontWeight="medium" mb={2} color="gray.800">{majors.find(m => m.id === formData.major_id)?.name || ''}</Text>
                        </Box>
                      </Grid>
                    </Box>
                    
                    <Stack spacing={4}>
                      <Button
                        type="submit"
                        colorScheme="blue"
                        size="lg"
                        width="full"
                        height="60px"
                        fontSize="lg"
                        rightIcon={<Icon as={FiCheck} />}
                        isLoading={loading}
                        bgGradient={accentGradient}
                        _hover={{ bgGradient: accentHoverGradient }}
                        onClick={handleSubmit}
                      >
                        Create Account
                      </Button>
                      <Button
                        variant="outline"
                        colorScheme="blue"
                        size="md"
                        leftIcon={<FiArrowLeft />}
                        onClick={goToPreviousStep}
                      >
                        Go Back
                      </Button>
                    </Stack>
                  </VStack>
                </SlideFade>
              )}
            </Box>
            
            {/* Navigation buttons */}
            {currentStep > 0 && currentStep < 7 && (
              <Flex justify="space-between" mt={6}>
                <Button 
                  leftIcon={<FiArrowLeft />} 
                  onClick={goToPreviousStep}
                  variant="outline"
                  colorScheme="blue"
                  color="blue.600"
                >
                  Back
                </Button>
                <Button 
                  rightIcon={<FiArrowRight />} 
                  onClick={goToNextStep}
                  colorScheme="blue"
                  bgGradient={accentGradient}
                  _hover={{ bgGradient: accentHoverGradient }}
                >
                  Next
                </Button>
              </Flex>
            )}
            
            {/* Sign in link */}
            {currentStep !== 7 && (
              <Box mt={8} textAlign="center">
                <Flex align="center" gap={4} justify="center" mb={2}>
                  <Divider flex="1" maxW="100px" />
                  <Text color="gray.500" fontSize="sm" fontWeight="medium">
                    OR
                  </Text>
                  <Divider flex="1" maxW="100px" />
                </Flex>
                
                <Text color="gray.500" fontWeight="medium">
                  Already part of MU Connect?{" "}
                  <ChakraLink
                    as={Link}
                    to="/login"
                    color="blue.500"
                    fontWeight="600"
                    _hover={{ textDecoration: "underline" }}
                  >
                    Sign in here
                  </ChakraLink>
                </Text>
              </Box>
            )}
          </Box>
        </Container>
      )}
    </Flex>
  );
};

export default Register;