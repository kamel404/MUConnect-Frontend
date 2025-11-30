import { Box, Container, Text, Heading, Flex, Input, Button, InputGroup, VStack } from "@chakra-ui/react";
import { FiArrowRight } from "react-icons/fi";

const CTA = () => (
  <Box py={[12, 20]} bg="white">
    <Container maxW="container.lg" textAlign="center">
      <Box 
        bgGradient="linear(to-br, blue.600, blue.800)" 
        borderRadius={["xl", "3xl"]} 
        p={[8, 16]} 
        boxShadow="2xl"
        position="relative"
        overflow="hidden"
        color="white"
      >
        {/* Decorative circles */}
        <Box position="absolute" top="-50px" left="-50px" w="200px" h="200px" bg="whiteAlpha.100" borderRadius="full" />
        <Box position="absolute" bottom="-50px" right="-50px" w="300px" h="300px" bg="whiteAlpha.100" borderRadius="full" />
        
        <VStack spacing={6} position="relative" zIndex="1">
          <Text color="blue.200" fontWeight="bold" fontSize={["sm", "md"]} letterSpacing="wider">
            READY TO GET STARTED?
          </Text>
          <Heading size={["xl", "2xl"]} mb={2}>
            Join Our Academic Community
          </Heading>
          <Text fontSize={["md", "xl"]} color="blue.100" maxW="2xl" mx="auto">
            Sign up free with your university email and instantly access study resources, section swaps, and study groups.
          </Text>
          
          <Flex justify="center" w="full" pt={4}>
            <InputGroup maxW={["100%", "500px"]} flexDirection={["column", "row"]} gap={3} alignItems="center">
              <Input 
                placeholder="you@stu.maaraf.edu" 
                size="lg" 
                borderRadius="full" 
                bg="white"
                color="gray.800"
                _placeholder={{ color: 'gray.400' }}
                border="none"
                h="3.5rem"
              />
              <Button 
                colorScheme="orange" 
                size="lg" 
                borderRadius="full" 
                px={8}
                h="3.5rem"
                w={["full", "auto"]}
                rightIcon={<FiArrowRight />}
                boxShadow="lg"
                _hover={{ transform: 'translateY(-2px)', boxShadow: 'xl' }}
              >
                Join Free
              </Button>
            </InputGroup>
          </Flex>
        </VStack>
      </Box>
    </Container>
  </Box>
);

export default CTA;