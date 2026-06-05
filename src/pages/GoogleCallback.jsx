import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useToast } from '@chakra-ui/react';
import {
  Box,
  Center,
  Spinner,
  Text,
  VStack,
  Heading,
  Image,
} from '@chakra-ui/react';
import { useAuth } from '../context/AuthContext';
import { exchangeOAuthCode, storeGoogleTempToken } from '../services/googleAuthService';
import MaarefLogo from '../assets/maaref-logo.png';

const GoogleCallback = () => {
  const [status, setStatus] = useState('processing');
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  const { handleGoogleAuthSuccess } = useAuth();

  useEffect(() => {
    const processCallback = async () => {
      const params = new URLSearchParams(location.search);

      // Backend signals domain/auth errors via ?error=
      const errorParam = params.get('error');
      if (errorParam) {
        toast({
          title: 'Authentication Error',
          description: decodeURIComponent(errorParam),
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
        setStatus('error');
        setTimeout(() => navigate('/login'), 2000);
        return;
      }

      const code = params.get('code');
      if (!code) {
        toast({
          title: 'Authentication Error',
          description: 'Missing OAuth code. Please try signing in again.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
        setStatus('error');
        setTimeout(() => navigate('/login'), 2000);
        return;
      }

      try {
        // Exchange the single-use code for the real token. The code is
        // destroyed server-side on the first call so it cannot be replayed.
        const responseData = await exchangeOAuthCode(code);

        if (responseData.is_new_user) {
          setStatus('new-user');
          storeGoogleTempToken(responseData.temp_token);
          setTimeout(() => {
            navigate('/complete-google-registration', {
              state: {
                email:      responseData.email,
                name:       responseData.name,
                temp_token: responseData.temp_token,
              },
            });
          }, 1000);
          return;
        }

        // Existing user — store token and hydrate auth state
        setStatus('success');
        localStorage.setItem('authToken', responseData.token);

        if (responseData.user?.faculty) {
          localStorage.setItem('userFaculty', responseData.user.faculty.name);
          localStorage.setItem('faculty_id', responseData.user.faculty.id);
        }
        if (responseData.user?.major) {
          localStorage.setItem('userMajor', responseData.user.major.name);
          localStorage.setItem('major_id', responseData.user.major.id);
        }
        const roleSource = responseData.user?.role_names ?? responseData.user?.roles ?? [];
        if (roleSource.length > 0) {
          localStorage.setItem('role', roleSource[0]);
        }

        await handleGoogleAuthSuccess(responseData.user);

        toast({
          title: 'Login Successful',
          description: 'You have been signed in with Google.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });

        navigate('/dashboard');
      } catch (error) {
        console.error('Error processing Google callback:', error);
        setStatus('error');
        toast({
          title: 'Authentication Error',
          description: error?.message || 'Failed to process Google authentication.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
        setTimeout(() => navigate('/login'), 2000);
      }
    };

    processCallback();
  }, [location.search, navigate, toast, handleGoogleAuthSuccess]);

  return (
    <Center minH="100vh" bgGradient="linear(to-br, blue.50 0%, white 50%, blue.50 100%)">
      <VStack spacing={6}>
        <Image src={MaarefLogo} boxSize="80px" alt="Maaref Logo" />

        <Heading
          size="xl"
          bgGradient="linear(to-r, blue.600, teal.500)"
          bgClip="text"
        >
          {status === 'processing' && 'Processing Authentication'}
          {status === 'success'    && 'Authentication Successful'}
          {status === 'new-user'   && 'Almost There!'}
          {status === 'error'      && 'Authentication Error'}
        </Heading>

        <Box>
          {status === 'processing' && <Spinner size="xl" color="blue.500" />}
          {status === 'success'    && <Text>Redirecting to the dashboard…</Text>}
          {status === 'new-user'   && <Text>Redirecting to complete your registration…</Text>}
          {status === 'error'      && <Text>Redirecting back to login page…</Text>}
        </Box>
      </VStack>
    </Center>
  );
};

export default GoogleCallback;
