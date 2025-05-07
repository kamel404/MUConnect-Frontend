import React from 'react';
import { Box, Heading, Text, Button, VStack, Image, useColorModeValue } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import logo from "../assets/maaref-logo.png";

const NotFound = () => {
  const bgColor = useColorModeValue('gray.50', 'gray.800');
  const textColor = useColorModeValue('gray.600', 'gray.300');
  const headingColor = useColorModeValue('brand.navy', 'white');
  
  return (
    <Box 
      bg={bgColor}
      minH="100vh" 
      display="flex" 
      alignItems="center" 
      justifyContent="center" 
      p={4}
    >
      <VStack spacing={8} textAlign="center" maxW="xl">
        <Heading 
          fontSize={{ base: '6xl', md: '8xl' }}
          fontWeight="bold"
          color={headingColor}
        >
          404
        </Heading>
        
        <Image 
          src= {logo}
          alt="Page not found" 
          boxSize={{ base: '400px', md: '300px' }}
        />
        
        <Heading size="xl" color={headingColor}>Page Not Found</Heading>
        
        <Text fontSize="lg" color={textColor}>
          The page you're looking for doesn't exist or has been moved.
        </Text>
        
        <Button
          as={RouterLink}
          to="/dashboard"
          variant="primary"
          size="lg"
          mt={4}
        >
          Return to Dashboard
        </Button>
      </VStack>
    </Box>
  );
};

export default NotFound;
