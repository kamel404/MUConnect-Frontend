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

const Register = () => {
  const [loading, setLoading] = useState(false);
  const [preparingFeed, setPreparingFeed] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    username: "",
    email: "",
    password: "",
    password_confirmation: "",
    faculty: "",
    major: "",
  });
  
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
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Helper function to check if current step is valid
  const isCurrentStepValid = () => {
    switch (currentStep) {
      case 0: // Welcome
        return true;
      case 1: // Name step
        return formData.first_name.trim() !== "" && formData.last_name.trim() !== "";
      case 2: // Username step
        return formData.username.trim() !== "";
      case 3: // Email step
        return formData.email.includes("@") && formData.email.includes(".");
      case 4: // Password step
        return formData.password.length >= 6 && formData.password === formData.password_confirmation;
      case 5: // Faculty step
        return formData.faculty !== "";
      case 6: // Major step
        return formData.major !== "";
      case 7: // Complete
        return true;
      default:
        return false;
    }
  };

  // Navigate to next step if validation passes
  const goToNextStep = () => {
    if (isCurrentStepValid()) {
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1);
      }
    } else {
      toast({
        title: "Please complete the current step",
        status: "warning",
        duration: 2000,
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
    setLoading(true);

    try {
      await register(formData);
      startPreparingFeed();
    } catch (error) {
      toast({
        title: error.message || "Registration failed",
        status: "error",
        duration: 3000,
      });
      setLoading(false);
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
  
  // Set major to empty when faculty changes
  useEffect(() => {
    if (currentStep === 5) {
      setFormData(prev => ({ ...prev, major: "" }));
    }
  }, [formData.faculty]);

  // Render the step by step registration flow
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
                    
                    <FormControl isRequired width="100%">
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
                        />
                      </InputGroup>
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
                    
                    <FormControl isRequired width="100%">
                      <FormLabel color="gray.600">Select your faculty</FormLabel>
                      <InputGroup>
                        <InputLeftElement pointerEvents="none">
                          <Icon as={FiBookOpen} color="blue.500" />
                        </InputLeftElement>
                        <Select
                          name="faculty"
                          placeholder="Choose a faculty"
                          focusBorderColor="blue.500"
                          size="lg"
                          color="gray.800"
                          value={formData.faculty}
                          onChange={handleChange}
                          pl={10}
                        >
                          <option value="engineering">Engineering</option>
                          <option value="business">Business</option>
                          <option value="science">Science</option>
                          <option value="arts">Arts & Humanities</option>
                          <option value="medicine">Medicine & Health Sciences</option>
                          <option value="law">Law</option>
                          <option value="education">Education</option>
                          <option value="social_sciences">Social Sciences</option>
                        </Select>
                      </InputGroup>
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
                    
                    <FormControl isRequired width="100%">
                      <FormLabel color="gray.600">Select your major</FormLabel>
                      <InputGroup>
                        <InputLeftElement pointerEvents="none">
                          <Icon as={FiBookmark} color="blue.500" />
                        </InputLeftElement>
                        <Select
                          name="major"
                          placeholder="Choose a major"
                          focusBorderColor="blue.500"
                          size="lg"
                          color="gray.800"
                          value={formData.major}
                          onChange={handleChange}
                          pl={10}
                          isDisabled={!formData.faculty}
                        >
                          {formData.faculty === 'engineering' && (
                            <>
                              <option value="computer_science">Computer Science</option>
                              <option value="electrical">Electrical Engineering</option>
                              <option value="mechanical">Mechanical Engineering</option>
                              <option value="civil">Civil Engineering</option>
                              <option value="chemical">Chemical Engineering</option>
                            </>
                          )}
                          {formData.faculty === 'business' && (
                            <>
                              <option value="accounting">Accounting</option>
                              <option value="finance">Finance</option>
                              <option value="marketing">Marketing</option>
                              <option value="management">Management</option>
                              <option value="economics">Economics</option>
                            </>
                          )}
                          {formData.faculty === 'science' && (
                            <>
                              <option value="biology">Biology</option>
                              <option value="chemistry">Chemistry</option>
                              <option value="physics">Physics</option>
                              <option value="mathematics">Mathematics</option>
                              <option value="environmental_science">Environmental Science</option>
                            </>
                          )}
                          {formData.faculty === 'arts' && (
                            <>
                              <option value="english">English</option>
                              <option value="history">History</option>
                              <option value="philosophy">Philosophy</option>
                              <option value="visual_arts">Visual Arts</option>
                              <option value="performing_arts">Performing Arts</option>
                            </>
                          )}
                          {formData.faculty === 'medicine' && (
                            <>
                              <option value="medicine">Medicine</option>
                              <option value="nursing">Nursing</option>
                              <option value="pharmacy">Pharmacy</option>
                              <option value="public_health">Public Health</option>
                              <option value="dentistry">Dentistry</option>
                            </>
                          )}
                          {formData.faculty === 'law' && (
                            <>
                              <option value="law">Law</option>
                              <option value="international_law">International Law</option>
                              <option value="criminal_law">Criminal Law</option>
                              <option value="business_law">Business Law</option>
                            </>
                          )}
                          {formData.faculty === 'education' && (
                            <>
                              <option value="elementary_education">Elementary Education</option>
                              <option value="secondary_education">Secondary Education</option>
                              <option value="special_education">Special Education</option>
                              <option value="educational_leadership">Educational Leadership</option>
                            </>
                          )}
                          {formData.faculty === 'social_sciences' && (
                            <>
                              <option value="psychology">Psychology</option>
                              <option value="sociology">Sociology</option>
                              <option value="anthropology">Anthropology</option>
                              <option value="political_science">Political Science</option>
                              <option value="international_relations">International Relations</option>
                            </>
                          )}
                        </Select>
                      </InputGroup>
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
                          <Text fontWeight="medium" mb={2} color="gray.800" textTransform="capitalize">{formData.faculty.replace('_', ' ')}</Text>
                          <Text fontWeight="medium" mb={2} color="gray.800" textTransform="capitalize">{formData.major.replace('_', ' ')}</Text>
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