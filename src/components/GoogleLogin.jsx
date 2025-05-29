import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { Box, VStack, Text, useToast, Spinner, Center } from '@chakra-ui/react';

const GoogleLoginButton = ({ onLoginSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const handleSuccess = async (credentialResponse) => {
    try {
      setIsLoading(true);
      
      // Decode the JWT token to get user info
      const decoded = jwtDecode(credentialResponse.credential);
      console.log("Google user info:", decoded);
      
      // User data from Google
      const userData = {
        google_id: decoded.sub,
        name: decoded.name,
        email: decoded.email,
        picture: decoded.picture,
        given_name: decoded.given_name,
        family_name: decoded.family_name,
        locale: decoded.locale,
      };

      // Call your backend API to login/register the user
      // Replace this URL with your actual Laravel backend URL
      const API_URL = 'http://localhost:8000'; // Change this to your actual Laravel backend URL
      const response = await fetch(`${API_URL}/api/auth/google`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          google_token: credentialResponse.credential,
          user_data: userData
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        // Store the token in localStorage
        localStorage.setItem('auth_token', data.token);
        
        // Call the success callback if provided
        if (onLoginSuccess) {
          onLoginSuccess(data.user);
        }
        
        toast({
          title: 'Login successful',
          description: `Welcome, ${userData.name}!`,
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
      } else {
        throw new Error(data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Google login error:', error);
      toast({
        title: 'Login failed',
        description: error.message || 'Could not login with Google. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleError = () => {
    toast({
      title: 'Login failed',
      description: 'Google authentication failed. Please try again.',
      status: 'error',
      duration: 5000,
      isClosable: true,
    });
  };

  return (
    <Box position="relative" width="fit-content">
      {isLoading && (
        <Box 
          position="absolute" 
          top="0" 
          left="0" 
          width="100%" 
          height="100%" 
          display="flex" 
          alignItems="center" 
          justifyContent="center"
          bg="rgba(255, 255, 255, 0.8)"
          zIndex="10"
          borderRadius="md"
        >
          <Spinner color="blue.500" />
        </Box>
      )}
      <VStack spacing={3}>
        <GoogleLogin
          onSuccess={handleSuccess}
          onError={handleError}
          useOneTap
          shape="rectangular"
          text="continue_with"
          theme="filled_blue"
          locale="en"
        />
        <Text fontSize="xs" color="gray.500">
          By signing in, you agree to our Terms of Service and Privacy Policy.
        </Text>
      </VStack>
    </Box>
  );
};

export default GoogleLoginButton;
