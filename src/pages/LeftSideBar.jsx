import { Box, Flex, Heading, Stack, Button, Divider, Text } from "@chakra-ui/react";
import { FiHome, FiUsers, FiBook, FiMessageSquare } from "react-icons/fi";
import { Link } from "react-router-dom";

const LeftSidebar = ({ textColor, mutedText, accentColor, primaryColor, highlightBg }) => {
  return (
    <Box>
      <Flex direction="column" gap={6}>
        <Heading size="md" mb={4} color={textColor}>
          MU Hub
        </Heading>
        <Stack spacing={2}>
          <Button leftIcon={<FiHome />} justifyContent="flex-start" variant="ghost" color={textColor} _hover={{ bg: accentColor }}>
            Home
          </Button>
          <Button leftIcon={<FiUsers />} justifyContent="flex-start" variant="ghost" color={textColor} as={Link} to="/study-groups" _hover={{ bg: accentColor }}>
            Study Groups
          </Button>
          <Button leftIcon={<FiBook />} justifyContent="flex-start" variant="ghost" color={textColor} as={Link} to="/courses" _hover={{ bg: accentColor }}>
            Courses
          </Button>
          <Button leftIcon={<FiMessageSquare />} justifyContent="flex-start" variant="ghost" color={textColor} _hover={{ bg: accentColor }}>
            Messages
          </Button>
        </Stack>
        <Divider />
        <Text fontSize="sm" color={mutedText} mt={4}>
          Your Courses
        </Text>
        <Stack spacing={2}>
          <Button variant="ghost" justifyContent="flex-start" color={textColor} _hover={{ bg: accentColor }}>
            CS 301
          </Button>
          <Button variant="ghost" justifyContent="flex-start" color={textColor} _hover={{ bg: accentColor }}>
            MATH 202
          </Button>
        </Stack>
      </Flex>
    </Box>
  );
};

export default LeftSidebar;
