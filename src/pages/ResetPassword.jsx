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
  Flex,
  Image,
  Icon,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Spinner,
  Center,
} from "@chakra-ui/react";
import { FiLock, FiArrowRight, FiCheck } from "react-icons/fi";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import MaarefLogo from "../assets/maaref-logo.png";
import { resetPassword, verifyResetToken } from "../services/authService";
import { logError } from "../utils/errorHandler";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState({
    password: "",
    passwordConfirmation: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  const email = searchParams.get("email");
  const token = searchParams.get("token");

  useEffect(() => {
    // Verify token on component mount
    const verifyToken = async () => {
      if (!email || !token) {
        toast({
          title: "Invalid Link",
          description: "The password reset link is invalid or incomplete.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        setIsVerifying(false);
        return;
      }

      try {
        await verifyResetToken(email, token);
        setTokenValid(true);
      } catch (error) {
        logError("ResetPassword verifyToken", error);
        
        const errorMessage = error?.message || "This password reset link is invalid or has expired.";
        
        toast({
          title: "Invalid or Expired Link",
          description: errorMessage,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        setTokenValid(false);
      } finally {
        setIsVerifying(false);
      }
    };

    verifyToken();
  }, [email, token, toast]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }
    
    if (!formData.passwordConfirmation) {
      newErrors.passwordConfirmation = "Please confirm your password";
    } else if (formData.password !== formData.passwordConfirmation) {
      newErrors.passwordConfirmation = "Passwords do not match";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const response = await resetPassword(
        email,
        token,
        formData.password,
        formData.passwordConfirmation
      );
      
      toast({
        title: "Password Reset Successful!",
        description: response.message || "Your password has been reset successfully.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      
      setIsSuccess(true);
      
      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      logError("ResetPassword handleSubmit", error);
      
      const errorMessage = error?.message || "Failed to reset password. Please try again.";
      
      toast({
        title: "Error",
        description: errorMessage,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  // Show loading spinner while verifying token
  if (isVerifying) {
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
            textAlign="center"
          >
            <Spinner size="xl" color="blue.500" mb={4} />
            <Text color="gray.600">Verifying reset link...</Text>
          </Box>
        </Container>
      </Flex>
    );
  }

  // Show error if token is invalid
  if (!tokenValid) {
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
          >
            <Flex align="center" mb={8} gap={3} justify="center">
              <Image src={MaarefLogo} boxSize="50px" alt="Maaref Logo" />
              <Heading size="xl" bgGradient="linear(to-r, blue.600, teal.500)" bgClip="text">
                MU Connect
              </Heading>
            </Flex>

            <Alert
              status="error"
              variant="subtle"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              textAlign="center"
              rounded="lg"
              mb={6}
            >
              <AlertIcon boxSize="40px" mr={0} />
              <AlertTitle mt={4} mb={1} fontSize="lg">
                Invalid or Expired Link
              </AlertTitle>
              <AlertDescription maxWidth="sm">
                This password reset link is no longer valid. Please request a new one.
              </AlertDescription>
            </Alert>

            <Stack spacing={4}>
              <Button
                as={Link}
                to="/forgot-password"
                colorScheme="blue"
                size="lg"
                height="60px"
                fontSize="lg"
                bgGradient="linear(to-r, blue.500, teal.400)"
                _hover={{ bgGradient: "linear(to-r, blue.600, teal.500)" }}
                w="full"
              >
                Request New Reset Link
              </Button>

              <Button
                as={Link}
                to="/login"
                variant="outline"
                size="lg"
                height="60px"
                fontSize="lg"
                colorScheme="blue"
                w="full"
              >
                Back to Login
              </Button>
            </Stack>
          </Box>
        </Container>
      </Flex>
    );
  }

  // Show success message
  if (isSuccess) {
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
            textAlign="center"
          >
            <Flex align="center" mb={8} gap={3} justify="center">
              <Image src={MaarefLogo} boxSize="50px" alt="Maaref Logo" />
              <Heading size="xl" bgGradient="linear(to-r, blue.600, teal.500)" bgClip="text">
                MU Connect
              </Heading>
            </Flex>

            <Box
              bg="green.50"
              borderRadius="full"
              w="80px"
              h="80px"
              display="flex"
              alignItems="center"
              justifyContent="center"
              mx="auto"
              mb={6}
            >
              <Icon as={FiCheck} color="green.500" boxSize="40px" />
            </Box>

            <Heading size="lg" mb={4} color="gray.800">
              Password Reset Successful!
            </Heading>
            <Text color="gray.600" mb={6}>
              Your password has been updated. You will be redirected to the login page shortly.
            </Text>

            <Button
              as={Link}
              to="/login"
              colorScheme="blue"
              size="lg"
              height="60px"
              fontSize="lg"
              bgGradient="linear(to-r, blue.500, teal.400)"
              _hover={{ bgGradient: "linear(to-r, blue.600, teal.500)" }}
              w="full"
            >
              Go to Login
            </Button>
          </Box>
        </Container>
      </Flex>
    );
  }

  // Show reset password form
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
              MU Connect
            </Heading>
          </Flex>

          <Stack spacing={8}>
            <Box textAlign="center">
              <Heading size="2xl" mb={2} bgGradient="linear(to-r, blue.600, teal.500)" bgClip="text">
                Reset Your Password
              </Heading>
              <Text color="gray.600" mt={4}>
                Enter your new password below.
              </Text>
            </Box>

            <form onSubmit={handleSubmit}>
              <Stack spacing={6}>
                <FormControl isRequired isInvalid={!!errors.password}>
                  <FormLabel color="gray.600">New Password</FormLabel>
                  <InputGroup>
                    <InputLeftElement pointerEvents="none">
                      <Icon as={FiLock} color="blue.500" aria-label="Password icon" />
                    </InputLeftElement>
                    <Input
                      type="password"
                      name="password"
                      placeholder="••••••••"
                      size="lg"
                      focusBorderColor="blue.500"
                      _placeholder={{ color: "gray.400" }}
                      color="gray.800"
                      value={formData.password}
                      onChange={handleChange}
                    />
                  </InputGroup>
                  {errors.password && (
                    <Text color="red.500" fontSize="sm" mt={1}>
                      {errors.password}
                    </Text>
                  )}
                  <Text color="gray.500" fontSize="xs" mt={1}>
                    Password must be at least 8 characters long
                  </Text>
                </FormControl>

                <FormControl isRequired isInvalid={!!errors.passwordConfirmation}>
                  <FormLabel color="gray.600">Confirm New Password</FormLabel>
                  <InputGroup>
                    <InputLeftElement pointerEvents="none">
                      <Icon as={FiLock} color="blue.500" aria-label="Password confirmation icon" />
                    </InputLeftElement>
                    <Input
                      type="password"
                      name="passwordConfirmation"
                      placeholder="••••••••"
                      size="lg"
                      focusBorderColor="blue.500"
                      _placeholder={{ color: "gray.400" }}
                      color="gray.800"
                      value={formData.passwordConfirmation}
                      onChange={handleChange}
                    />
                  </InputGroup>
                  {errors.passwordConfirmation && (
                    <Text color="red.500" fontSize="sm" mt={1}>
                      {errors.passwordConfirmation}
                    </Text>
                  )}
                </FormControl>

                <Button
                  type="submit"
                  colorScheme="blue"
                  size="lg"
                  height="60px"
                  fontSize="lg"
                  rightIcon={<Icon as={FiArrowRight} aria-label="Reset password" />}
                  isLoading={isLoading}
                  bgGradient="linear(to-r, blue.500, teal.400)"
                  _hover={{ bgGradient: "linear(to-r, blue.600, teal.500)" }}
                  _active={{ transform: "scale(0.98)" }}
                  w="full"
                >
                  Reset Password
                </Button>

                <Text textAlign="center" color="gray.600" fontSize="sm">
                  Remember your password?{" "}
                  <ChakraLink
                    as={Link}
                    to="/login"
                    color="blue.500"
                    fontWeight="600"
                    _hover={{ textDecoration: "underline" }}
                  >
                    Back to Login
                  </ChakraLink>
                </Text>
              </Stack>
            </form>
          </Stack>
        </Box>
      </Container>
    </Flex>
  );
};

export default ResetPassword;
