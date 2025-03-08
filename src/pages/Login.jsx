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
} from "@chakra-ui/react";
import { FiUser, FiLock, FiArrowRight } from "react-icons/fi";
import { login } from "../services/authService";
import { Link, useNavigate } from "react-router-dom";
import MaarefLogo from "../assets/maaref-logo.png";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    login: "",
    password: "",
  });
  const toast = useToast();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(formData);
      toast({
        title: "Login successful",
        status: "success",
        duration: 3000,
      });
      navigate("/dashboard");
    } catch (error) {
      toast({
        title: error.message || "Login failed",
        status: "error",
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Flex
      minH="100vh"
      bgGradient="linear(to-br, blue.50 0%, white 50%, blue.50 100%)"
      align="center"
    >
      <Container maxW="container.md" py={16}>
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
            <Image src={MaarefLogo} boxSize="50px" />
            <Heading size="xl" bgGradient="linear(to-r, blue.600, teal.500)" bgClip="text">
              MU Hub
            </Heading>
          </Flex>

          <Stack spacing={8}>
            <Box textAlign="center">
              <Heading size="2xl" mb={2}>
                Welcome Back!
              </Heading>
            </Box>

            <form onSubmit={handleSubmit}>
              <Stack spacing={6}>
                <FormControl isRequired>
                  <FormLabel color="gray.600">Username/Email</FormLabel>
                  <InputGroup>
                    <InputLeftElement children={<FiUser color="gray.400" />} />
                    <Input
                      name="login"
                      placeholder="john@mu.edu.lb"
                      size="lg"
                      focusBorderColor="blue.500"
                      value={formData.login}
                      onChange={handleChange}
                    />
                  </InputGroup>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel color="gray.600">Password</FormLabel>
                  <InputGroup>
                    <InputLeftElement children={<FiLock color="gray.400" />} />
                    <Input
                      type="password"
                      placeholder="••••••••"
                      size="lg"
                      focusBorderColor="blue.500"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                    />
                  </InputGroup>
                </FormControl>

                <Flex justify="space-between" align="center">
                  <Checkbox colorScheme="blue" size="md">
                    Remember me
                  </Checkbox>
                  <ChakraLink
                    as={Link}
                    to="/forgot-password"
                    color="blue.500"
                    fontSize="sm"
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
                  rightIcon={<FiArrowRight />}
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
              New to MU Hub?{" "}
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