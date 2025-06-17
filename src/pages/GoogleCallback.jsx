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
import { storeGoogleTempToken } from '../services/googleAuthService';
import MaarefLogo from '../assets/maaref-logo.png';

const GoogleCallback = () => {
  const [status, setStatus] = useState('processing');
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  const { handleGoogleAuthSuccess } = useAuth();
  
  useEffect(() => {
    const processCallback = async () => {
      // Parse the URL parameters from the query string
      const params = new URLSearchParams(location.search);
      
      // Check if there's an error parameter
      if (params.get('error')) {
        toast({
          title: 'Authentication Error',
          description: params.get('error') || 'Failed to authenticate with Google',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
        setStatus('error');
        setTimeout(() => navigate('/login'), 2000);
        return;
      }
      
      try {
        // Parse the response data (it should be provided as JSON in a 'data' parameter)
        // The data will be in the format described in the API spec
        const dataParam = params.get('data');
        console.log('Raw data from URL:', dataParam);
        
        const responseData = JSON.parse(dataParam || '{}');
        console.log('Parsed response data:', responseData);
        
        if (responseData.is_new_user) {
          // For new users who need to complete registration
          setStatus('new-user');
          
          // Store the temporary token and email
          storeGoogleTempToken(responseData.temp_token);
          
          // Redirect to the complete registration page
          setTimeout(() => {
            navigate('/complete-google-registration', {
              state: {
                email: responseData.email,
                name: responseData.name,
                temp_token: responseData.temp_token
              }
            });
          }, 1000);
        } else {
          // For existing users, handle successful authentication
          // Format: { message: "User authenticated successfully", user: {...} }
          setStatus('success');
          
          console.log('Processing existing user login:', responseData);
          
          // The user object is directly in the response
          if (responseData.user) {
            // Store authentication data - make sure we're getting the token
            console.log('Token from response:', responseData.token);
            
            // Get the Sanctum token from the Laravel backend response 
            // This token is now provided for both new and existing users
            const token = responseData.token;
            
            if (token) {
              console.log('Sanctum token received from backend');
              localStorage.setItem('authToken', token);
            } else {
              console.error('No Sanctum token found in response - authentication may fail');
              
              // For debugging - show the response structure
              console.log('Response structure:', Object.keys(responseData));
            }
            
            // Store additional user info if available
            if (responseData.user.faculty) {
              localStorage.setItem('userFaculty', responseData.user.faculty.name);
              localStorage.setItem('faculty_id', responseData.user.faculty.id);
            }
            
            if (responseData.user.major) {
              localStorage.setItem('userMajor', responseData.user.major.name);
              localStorage.setItem('major_id', responseData.user.major.id);
            }
            
            if (responseData.user.role_names && responseData.user.role_names.length > 0) {
              localStorage.setItem('role', responseData.user.role_names[0]);
            } else if (responseData.user.roles && responseData.user.roles.length > 0) {
              localStorage.setItem('role', responseData.user.roles[0]);
            }
            
            try {
              // First update auth context with user data
              console.log('Updating auth context with user data');
              await handleGoogleAuthSuccess(responseData.user);
              
              // Show success message
              toast({
                title: 'Login Successful',
                description: responseData.message || 'You have been logged in with Google',
                status: 'success',
                duration: 3000,
                isClosable: true,
              });
              
              console.log('Authentication successful, redirecting to dashboard');
              
              // Force a small delay to ensure state updates complete
              setTimeout(() => {
                // Check if token was successfully stored
                const token = localStorage.getItem('authToken');
                console.log('Before redirect - Auth token exists:', !!token);
                
                // Redirect to dashboard
                navigate('/dashboard');
              }, 1500);  // Slightly longer delay to ensure context updates
            } catch (authError) {
              console.error('Error updating auth context:', authError);
              toast({
                title: 'Authentication Error',
                description: 'Error setting up your user profile',
                status: 'error',
                duration: 5000,
              });
              setTimeout(() => navigate('/login'), 2000);
            }
          } else {
            throw new Error('User data not found in response');
          }
        }
      } catch (error) {
        console.error('Error processing Google callback:', error);
        setStatus('error');
        toast({
          title: 'Authentication Error',
          description: 'Failed to process Google authentication',
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
          {status === 'success' && 'Authentication Successful'}
          {status === 'new-user' && 'Almost There!'}
          {status === 'error' && 'Authentication Error'}
        </Heading>
        
        <Box>
          {status === 'processing' && <Spinner size="xl" color="blue.500" />}
          
          {status === 'success' && (
            <Text>You will be redirected to the dashboard momentarily...</Text>
          )}
          
          {status === 'new-user' && (
            <Text>Redirecting to complete your registration...</Text>
          )}
          
          {status === 'error' && (
            <Text>Redirecting back to login page...</Text>
          )}
        </Box>
      </VStack>
    </Center>
  );
};

export default GoogleCallback;
