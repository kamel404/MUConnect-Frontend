import { Box, Container, Text, Heading, Flex, Input, Button, InputGroup } from "@chakra-ui/react";

const CTA = () => (
  <Box py={[12, 20]} bg="white">
    <Container maxW="container.md" textAlign="center">
      <Box bg="blue.50" borderRadius={["xl", "3xl"]} p={[6, 12]} boxShadow="lg">
        <Text color="blue.500" fontWeight="bold" mb={4} fontSize={["sm", "md"]}>
          START LEARNING TODAY
        </Text>
        <Heading size={["xl", "2xl"]} color="blue.900" mb={[4, 6]}>
          Join Our Academic Community
        </Heading>
        <Text fontSize={["md", "xl"]} color="gray.600" mb={[4, 8]}>
          Get instant access with your university credentials
        </Text>
        
        <Flex justify="center">
          <InputGroup maxW={["100%", "400px"]} flexDirection={["column", "row"]} gap={4}>
            <Input 
              placeholder="Enter your university email" 
              size={["md", "lg"]} 
              borderRadius="xl" 
              mb={[2, 0]}
            />
            <Button 
              colorScheme="blue" 
              size={["md", "lg"]} 
              borderRadius="xl" 
              px={[6, 8]}
              w={["full", "auto"]}
            >
              Join Free
            </Button>
          </InputGroup>
        </Flex>
      </Box>
    </Container>
  </Box>
);

export default CTA;