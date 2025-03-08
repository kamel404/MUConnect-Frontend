import { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Text,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react';
import { register, login } from '../../services/authService';

const AuthForm = ({ isOpen, onClose, initialMode = 'login' }) => {
  const [isLogin, setIsLogin] = useState(initialMode === 'login');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    username: '',
    email: '',
    password: '',
    password_confirmation: '',
    login: ''
  });
  const toast = useToast();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const loginData = {
          login: formData.login,
          password: formData.password
        };
        await login(loginData);
        toast({
          title: 'Login successful',
          status: 'success',
          duration: 3000,
        });
      } else {
        const registerData = {
          first_name: formData.first_name,
          last_name: formData.last_name,
          username: formData.username,
          email: formData.email,
          password: formData.password,
          password_confirmation: formData.password_confirmation
        };
        await register(registerData);
        toast({
          title: 'Registration successful',
          status: 'success',
          duration: 3000,
        });
      }
      onClose();
    } catch (error) {
      toast({
        title: error.message || 'An error occurred',
        status: 'error',
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{isLogin ? 'Login' : 'Register'}</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <form onSubmit={handleSubmit}>
            <Stack spacing={4}>
              {!isLogin && (
                <>
                  <FormControl isRequired>
                    <FormLabel>First Name</FormLabel>
                    <Input name="first_name" onChange={handleChange} />
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel>Last Name</FormLabel>
                    <Input name="last_name" onChange={handleChange} />
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel>Username</FormLabel>
                    <Input name="username" onChange={handleChange} />
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel>Email</FormLabel>
                    <Input name="email" type="email" onChange={handleChange} />
                  </FormControl>
                </>
              )}
              {isLogin && (
                <FormControl isRequired>
                  <FormLabel>Username or Email</FormLabel>
                  <Input name="login" onChange={handleChange} />
                </FormControl>
              )}
              <FormControl isRequired>
                <FormLabel>Password</FormLabel>
                <Input name="password" type="password" onChange={handleChange} />
              </FormControl>
              {!isLogin && (
                <FormControl isRequired>
                  <FormLabel>Confirm Password</FormLabel>
                  <Input name="password_confirmation" type="password" onChange={handleChange} />
                </FormControl>
              )}
              <Button
                type="submit"
                colorScheme="blue"
                isLoading={loading}
                w="full"
              >
                {isLogin ? 'Login' : 'Register'}
              </Button>
              <Text textAlign="center">
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <Button
                  variant="link"
                  color="blue.500"
                  onClick={() => setIsLogin(!isLogin)}
                >
                  {isLogin ? 'Register' : 'Login'}
                </Button>
              </Text>
            </Stack>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default AuthForm;
