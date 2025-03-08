import { Container, Stack, VStack, Heading, Text, Button, Flex, Box, Image, AvatarGroup, Avatar } from "@chakra-ui/react";
import { FiChevronRight, FiUsers } from "react-icons/fi";
import { float } from "../../styles/animations";
import HeroIllustration from "../../assets/maaref-logo.png";
import StudentAvatar1 from "../../assets/maaref-logo.png";
import StudentAvatar2 from "../../assets/maaref-logo.png";
import { useNavigate } from 'react-router-dom';

const Hero = () => {
  const floatAnimation = `${float} 6s ease-in-out infinite`;
  const navigate = useNavigate();

  return (
    <Container maxW="container.xl" centerContent py={[12, 20]}>
      <Stack direction={{ base: "column", md: "row" }} spacing={[8, 10]} align="center">
        <VStack align={["center", "start"]} spacing={6} maxW="2xl" textAlign={["center", "left"]}>
          <Heading
            color="blue.900"
            size={["2xl", "3xl"]}
            lineHeight="1.1"
            fontWeight="extrabold"
            px={[2, 0]}
          >
            Collaborate & Grow in Our{' '}
            <Box as="span" bgGradient="linear(to-r, blue.500, teal.500)" bgClip="text">
              Student Ecosystem
            </Box>
          </Heading>
          <Text fontSize={["md", "xl"]} color="gray.600" lineHeight="1.7">
            Join 5,000+ students in a vibrant network featuring real-time collaboration, resource sharing, and smart academic tracking.
          </Text>
          
          <Flex gap={4} align="center" direction={["column", "row"]} w="full" justify={["center", "start"]}>
            <Button
              size={["md", "lg"]}
              colorScheme="blue"
              px={[6, 10]}
              rightIcon={<FiChevronRight />}
              w={["full", "auto"]}
              onClick={() => navigate('/register')}
            >
              Sign Up
            </Button>
            <Button
              size={["md", "lg"]}
              variant="outline"
              colorScheme="blue"
              px={[6, 10]}
              w={["full", "auto"]}
              onClick={() => navigate('/login')}
            >
              Login
            </Button>
          </Flex>
          
          <Flex align="center" gap={3} mt={4} direction={["column", "row"]} textAlign="center">
            <AvatarGroup size="md" max={4}>
              <Avatar src={StudentAvatar1} />
              <Avatar src={StudentAvatar2} />
              <Avatar icon={<FiUsers />} />
            </AvatarGroup>
            <Text color="gray.600" fontSize="sm">Join students from 12+ departments</Text>
          </Flex>
        </VStack>
        
        <Box position="relative" sx={{ animation: floatAnimation }} mt={[8, 0]}>
          <Image 
            src={HeroIllustration} 
            boxSize={{ base: "250px", sm: "300px", md: "600px" }} 
            alt="Collaboration illustration"
          />
        </Box>
      </Stack>
    </Container>
  );
};

export default Hero;