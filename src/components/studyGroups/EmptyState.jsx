import { Flex, Box, Heading, Text, useColorModeValue } from "@chakra-ui/react";
import { FiBook, FiUsers } from "react-icons/fi";

const EmptyState = ({ type = "filter", title, message }) => {
  const mutedText = useColorModeValue("gray.500", "gray.400");
  
  // Default messages
  const defaultTitles = {
    filter: "No study groups found",
    myGroups: "You haven't joined any study groups yet"
  };
  
  const defaultMessages = {
    filter: "Try changing your search terms or filters",
    myGroups: "Join a study group to collaborate with others and improve your learning"
  };
  
  // Use provided or default content
  const displayTitle = title || defaultTitles[type];
  const displayMessage = message || defaultMessages[type];
  
  return (
    <Flex direction="column" align="center" justify="center" py={10}>
      <Box textAlign="center" maxW="400px">
        {type === "filter" ? (
          <FiBook size={50} style={{ margin: '0 auto 20px', opacity: 0.3 }} />
        ) : (
          <FiUsers size={50} style={{ margin: '0 auto 20px', opacity: 0.3 }} />
        )}
        <Heading size="md" mb={2}>{displayTitle}</Heading>
        <Text color={mutedText} mb={6}>
          {displayMessage}
        </Text>
      </Box>
    </Flex>
  );
};

export default EmptyState;
