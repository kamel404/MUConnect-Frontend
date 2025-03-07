import { VStack, Flex, Icon, Text, Avatar, Box } from "@chakra-ui/react";
import { FiStar } from "react-icons/fi";

const TestimonialCard = ({ name, role, text, avatar, rating }) => (
  <VStack 
    bg="white" 
    p={[4, 8]} 
    borderRadius="2xl" 
    align="start" 
    spacing={4}
    boxShadow="xl"
    textAlign={["center", "left"]}
  >
    <Flex gap={1} justify={["center", "start"]}>
      {[...Array(rating)].map((_, i) => (
        <Icon as={FiStar} key={i} color="yellow.400" boxSize={5} />
      ))}
    </Flex>
    <Text color="gray.600" fontSize={["md", "lg"]} lineHeight="1.7">"{text}"</Text>
    <Flex align="center" gap={4} direction={["column", "row"]} w="full">
      <Avatar src={avatar} size={["md", "lg"]} />
      <Box textAlign={["center", "left"]}>
        <Text fontWeight="bold" color="blue.900">{name}</Text>
        <Text color="gray.500" fontSize="sm">{role}</Text>
      </Box>
    </Flex>
  </VStack>
);

export default TestimonialCard;