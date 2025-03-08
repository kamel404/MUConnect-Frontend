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
  Divider,
  Flex,
  Grid,
  Image,
} from "@chakra-ui/react";
import { FiUser, FiMail, FiLock, FiArrowRight } from "react-icons/fi";
import { register } from "../services/authService";
import { Link, useNavigate } from "react-router-dom";
import MaarefLogo from "../assets/maaref-logo.png";

const Register = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    username: "",
    email: "",
    password: "",
    password_confirmation: "",
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
      await register(formData);
      toast({
        title: "Registration successful",
        status: "success",
        duration: 3000,
      });
      navigate("/dashboard");
    } catch (error) {
      toast({
        title: error.message || "Registration failed",
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
                Join Our Community
              </Heading>
            </Box>

            <form onSubmit={handleSubmit}>
              <Stack spacing={6}>
                <Grid templateColumns={["1fr", "1fr 1fr"]} gap={6}>
                  <FormControl isRequired>
                    <FormLabel color="gray.600">First Name</FormLabel>
                    <InputGroup>
                      <InputLeftElement children={<FiUser color="gray.400" />} />
                      <Input
                        name="first_name"
                        placeholder="John"
                        focusBorderColor="blue.500"
                        size="lg"
                        value={formData.first_name}
                        onChange={handleChange}
                      />
                    </InputGroup>
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel color="gray.600">Last Name</FormLabel>
                    <InputGroup>
                      <InputLeftElement children={<FiUser color="gray.400" />} />
                      <Input
                        name="last_name"
                        placeholder="Doe"
                        focusBorderColor="blue.500"
                        size="lg"
                        value={formData.last_name}
                        onChange={handleChange}
                      />
                    </InputGroup>
                  </FormControl>
                </Grid>

                <FormControl isRequired>
                  <FormLabel color="gray.600">Username</FormLabel>
                  <InputGroup>
                    <InputLeftElement children={<FiUser color="gray.400" />} />
                    <Input
                      name="username"
                      placeholder="@johndoe"
                      focusBorderColor="blue.500"
                      size="lg"
                      value={formData.username}
                      onChange={handleChange}
                    />
                  </InputGroup>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel color="gray.600">Email</FormLabel>
                  <InputGroup>
                    <InputLeftElement children={<FiMail color="gray.400" />} />
                    <Input
                      type="email"
                      placeholder="john@mu.edu.lb"
                      focusBorderColor="blue.500"
                      size="lg"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </InputGroup>
                </FormControl>

                <Grid templateColumns={["1fr", "1fr 1fr"]} gap={6}>
                  <FormControl isRequired>
                    <FormLabel color="gray.600">Password</FormLabel>
                    <InputGroup>
                      <InputLeftElement children={<FiLock color="gray.400" />} />
                      <Input
                        type="password"
                        placeholder="••••••••"
                        focusBorderColor="blue.500"
                        size="lg"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                      />
                    </InputGroup>
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel color="gray.600">Confirm Password</FormLabel>
                    <InputGroup>
                      <InputLeftElement children={<FiLock color="gray.400" />} />
                      <Input
                        type="password"
                        placeholder="••••••••"
                        focusBorderColor="blue.500"
                        size="lg"
                        name="password_confirmation"
                        value={formData.password_confirmation}
                        onChange={handleChange}
                      />
                    </InputGroup>
                  </FormControl>
                </Grid>

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
                  Create Account
                </Button>
              </Stack>
            </form>

            <Flex align="center" gap={4}>
              <Divider />
              <Text color="gray.500" fontSize="sm">
                OR
              </Text>
              <Divider />
            </Flex>

            <Text textAlign="center" color="gray.600">
              Already part of MU Hub?{" "}
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
          </Stack>
        </Box>
      </Container>
    </Flex>
  );
};

export default Register;