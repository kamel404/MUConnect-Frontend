import { VStack, Box, Icon, Heading, Text } from "@chakra-ui/react";

const FeatureCard = ({ icon, title, description, color = "blue" }) => (
  <VStack 
    bg="white" 
    p={[4, 8]} 
    borderRadius="2xl" 
    boxShadow="xl" 
    align="start" 
    spacing={4}
    transition="all 0.3s"
    _hover={{ transform: "translateY(-8px)" }}
    position="relative"
    overflow="hidden"
    textAlign={["center", "left"]}
  >
    <Box 
      position="absolute" 
      top="-20px" 
      right="-20px" 
      w="100px" 
      h="100px" 
      bg={`${color}.100`} 
      borderRadius="full"
    />
    <Icon as={icon} boxSize={[6, 8]} color={`${color}.600`} mx={["auto", "0"]} />
    <Heading size={["md", "lg"]} color="blue.900" textAlign={["center", "left"]}>
      {title}
    </Heading>
    <Text color="gray.600" lineHeight="1.7" fontSize={["sm", "md"]}>
      {description}
    </Text>
  </VStack>
);

export default FeatureCard;