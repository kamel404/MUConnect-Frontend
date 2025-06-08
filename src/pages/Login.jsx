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
  Checkbox,
  Image,
  Icon,
  Divider,
  Center,
  Spinner
} from "@chakra-ui/react";
import { FiUser, FiLock, FiArrowRight } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import MaarefLogo from "../assets/maaref-logo.png";


import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

const Login = () => {
  const [formData, setFormData] = useState({
    login: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const toast = useToast();
  const navigate = useNavigate();
  const { user, loading, login: contextLogin } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" }); // Clear error on input change
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.login) newErrors.login = "Username/Email is required";
    if (!formData.password) newErrors.password = "Password is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
  
    try {
      // Use contextLogin instead of authService login
      await contextLogin(formData);
      
      toast({
        title: "Login successful",
        status: "success",
        duration: 3000,
      });
      
      // Remove this - redirect is handled by the condition below
      // navigate("/dashboard"); 
    } catch (error) {
      toast({
        title: error.message || "Login failed",
        status: "error",
        duration: 3000,
      });
    }
  };
  


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
                Welcome Back!
              </Heading>
              {/* <Text color="gray.600">Sign in to continue to your account</Text> */}
            </Box>

            <form onSubmit={handleSubmit}>
              <Stack spacing={6}>
                <FormControl isRequired isInvalid={!!errors.login}>
                  <FormLabel color="gray.600">Username/Email</FormLabel>
                  <InputGroup>
                    <InputLeftElement pointerEvents="none">
                      <Icon as={FiUser} color="blue.500" aria-label="Username icon" />
                    </InputLeftElement>
                    <Input
                      name="login"
                      placeholder="id@mu.edu.lb"
                      size="lg"
                      focusBorderColor="blue.500"
                      _placeholder={{ color: 'gray.400' }}
                      color="gray.800"
                      value={formData.login}
                      onChange={handleChange}
                    />
                  </InputGroup>
                  {errors.login && (
                    <Text color="red.500" fontSize="sm" mt={1}>
                      {errors.login}
                    </Text>
                  )}
                </FormControl>

                <FormControl isRequired isInvalid={!!errors.password}>
                  <FormLabel color="gray.600">Password</FormLabel>
                  <InputGroup>
                    <InputLeftElement pointerEvents="none">
                      <Icon as={FiLock} color="blue.500" aria-label="Password icon" />
                    </InputLeftElement>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      size="lg"
                      focusBorderColor="blue.500"
                      _placeholder={{ color: 'gray.400' }}
                      color="gray.800"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                    />
                  </InputGroup>
                  {errors.password && (
                    <Text color="red.500" fontSize="sm" mt={1}>
                      {errors.password}
                    </Text>
                  )}
                </FormControl>

                <Flex justify="space-between" align="center">
                  <Checkbox colorScheme="blue" size="md" color="gray.600">
                    Remember me
                  </Checkbox>
                  <ChakraLink
                    as={Link}
                    to="/forgot-password"
                    color="blue.500"
                    fontSize="sm"
                    _hover={{ textDecoration: "underline" }}
                  >
                    Forgot Password?
                  </ChakraLink>
                </Flex>

                <Button
                  type="submit"
                  colorScheme="blue"
                  size="lg"
                  height="60px"
                  fontSize="lg"
                  rightIcon={<Icon as={FiArrowRight} aria-label="Sign in" />}
                  isLoading={loading}
                  bgGradient="linear(to-r, blue.500, teal.400)"
                  _hover={{ bgGradient: "linear(to-r, blue.600, teal.500)" }}
                  _active={{ transform: "scale(0.98)" }}
                >
                  Sign In
                </Button>
              </Stack>
            </form>

            <Text textAlign="center" color="gray.600">
              New to MU Connect?{" "}
              <ChakraLink
                as={Link}
                to="/register"
                color="blue.500"
                fontWeight="600"
                _hover={{ textDecoration: "underline" }}
              >
                Create account
              </ChakraLink>
            </Text>
          </Stack>
        </Box>
      </Container>
    </Flex>
  );
};

export default Login;