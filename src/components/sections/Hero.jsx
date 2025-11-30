import { Container, Stack, VStack, Heading, Text, Button, Flex, Box, Image } from "@chakra-ui/react";
import { FiChevronRight } from "react-icons/fi";
import { float } from "../../styles/animations";
import HeroIllustration from "../../assets/maaref-logo.png";
import { useNavigate } from 'react-router-dom';

const Hero = () => {
  const floatAnimation = `${float} 6s ease-in-out infinite`;
  const navigate = useNavigate();

  return (
    <Box as="section" aria-label="Hero section">
      <Container maxW="container.xl" centerContent py={[12, 20]}>
        <Stack direction={{ base: "column", md: "row" }} spacing={[8, 10]} align="center">
          <VStack align={["center", "start"]} spacing={6} maxW="2xl" textAlign={["center", "left"]}>
            <Heading
              as="h1"
              color="blue.900"
              size={["2xl", "3xl"]}
              lineHeight="1.1"
              fontWeight="extrabold"
              px={[2, 0]}
            >
              Empower Your Learning Journey with{' '}
              <Box as="span" bgGradient="linear(to-r, blue.500, teal.500)" bgClip="text">
                MU&nbsp;Connect
              </Box>
            </Heading>
            <Text as="p" fontSize={["md", "xl"]} color="gray.600" lineHeight="1.7">
              Your all-in-one student hub: find study resources, swap course sections, join study groups, track grades, and never miss a deadline.
            </Text>
            
            <Flex as="nav" gap={4} align="center" direction={["column", "row"]} w="full" justify={["center", "start"]}>
              <Button
                size={["md", "lg"]}
                colorScheme="blue"
                px={[6, 10]}
                rightIcon={<FiChevronRight />}
                w={["full", "auto"]}
                onClick={() => navigate('/register')}
                aria-label="Sign up for MU Connect"
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
                aria-label="Login to MU Connect"
              >
                Login
              </Button>
            </Flex>
          </VStack>
          
          <Image 
            src={HeroIllustration} 
            boxSize={{ base: "250px", sm: "300px", md: "600px" }} 
            alt="MU Connect logo illustration - My University Connect platform"
            loading="eager"
          />
        </Stack>
      </Container>
    </Box>
  );
};

export default Hero;