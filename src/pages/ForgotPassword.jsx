import { useState } from "react";
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
} from "@chakra-ui/react";
import { FiMail, FiArrowRight, FiArrowLeft } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import MaarefLogo from "../assets/maaref-logo.png";
import { forgotPassword } from "../services/authService";
import { logError } from "../utils/errorHandler";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!email) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const response = await forgotPassword(email);
      
      toast({
        title: "Reset link sent!",
        description: response.message || "Check your email for the password reset link.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      
      setIsSubmitted(true);
    } catch (error) {
      logError("ForgotPassword handleSubmit", error);
      
      const errorMessage = error?.message || "Failed to send reset link. Please try again.";
      
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
    setEmail(e.target.value);
    setErrors({ ...errors, email: "" });
  };

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
                {isSubmitted ? "Check Your Email" : "Forgot Password?"}
              </Heading>
              <Text color="gray.600" mt={4}>
                {isSubmitted
                  ? "We've sent a password reset link to your email address. Please check your inbox and follow the instructions."
                  : "Enter your email address and we'll send you a link to reset your password."}
              </Text>
            </Box>

            {!isSubmitted ? (
              <form onSubmit={handleSubmit}>
                <Stack spacing={6}>
                  <FormControl isRequired isInvalid={!!errors.email}>
                    <FormLabel color="gray.600">Email Address</FormLabel>
                    <InputGroup>
                      <InputLeftElement pointerEvents="none">
                        <Icon as={FiMail} color="blue.500" aria-label="Email icon" />
                      </InputLeftElement>
                      <Input
                        name="email"
                        type="email"
                        placeholder="your.email@mu.edu.lb"
                        size="lg"
                        focusBorderColor="blue.500"
                        _placeholder={{ color: "gray.400" }}
                        color="gray.800"
                        value={email}
                        onChange={handleChange}
                      />
                    </InputGroup>
                    {errors.email && (
                      <Text color="red.500" fontSize="sm" mt={1}>
                        {errors.email}
                      </Text>
                    )}
                  </FormControl>

                  <Button
                    type="submit"
                    colorScheme="blue"
                    size="lg"
                    height="60px"
                    fontSize="lg"
                    rightIcon={<Icon as={FiArrowRight} aria-label="Send reset link" />}
                    isLoading={isLoading}
                    bgGradient="linear(to-r, blue.500, teal.400)"
                    _hover={{ bgGradient: "linear(to-r, blue.600, teal.500)" }}
                    _active={{ transform: "scale(0.98)" }}
                    w="full"
                  >
                    Send Reset Link
                  </Button>

                  <Flex justify="center">
                    <ChakraLink
                      as={Link}
                      to="/login"
                      color="blue.500"
                      fontSize="sm"
                      display="flex"
                      alignItems="center"
                      gap={2}
                      _hover={{ textDecoration: "underline" }}
                    >
                      <Icon as={FiArrowLeft} />
                      Back to Login
                    </ChakraLink>
                  </Flex>
                </Stack>
              </form>
            ) : (
              <Stack spacing={6}>
                <Button
                  onClick={() => navigate("/login")}
                  colorScheme="blue"
                  size="lg"
                  height="60px"
                  fontSize="lg"
                  leftIcon={<Icon as={FiArrowLeft} />}
                  bgGradient="linear(to-r, blue.500, teal.400)"
                  _hover={{ bgGradient: "linear(to-r, blue.600, teal.500)" }}
                  _active={{ transform: "scale(0.98)" }}
                  w="full"
                >
                  Return to Login
                </Button>

                <Text textAlign="center" color="gray.600" fontSize="sm">
                  Didn't receive the email?{" "}
                  <ChakraLink
                    color="blue.500"
                    fontWeight="600"
                    cursor="pointer"
                    onClick={() => setIsSubmitted(false)}
                    _hover={{ textDecoration: "underline" }}
                  >
                    Try again
                  </ChakraLink>
                </Text>
              </Stack>
            )}
          </Stack>
        </Box>
      </Container>
    </Flex>
  );
};

export default ForgotPassword;
