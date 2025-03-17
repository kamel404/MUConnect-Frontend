import { Box, Flex, Heading, Text, Button, Stack, Divider, useColorModeValue } from "@chakra-ui/react";
import { FiHome, FiUsers, FiBook, FiMessageSquare } from "react-icons/fi";
import { Link } from "react-router-dom";

const LeftSidebar = () => {
  const textColor = useColorModeValue("gray.800", "white");
  const mutedText = useColorModeValue("gray.500", "gray.400");
  const borderColor = useColorModeValue("gray.100", "gray.600");

  return (
    <Box>
      <Flex direction="column" gap={6}>
        <Heading size="md" mb={4} color={textColor}>
          MU Hub
        </Heading>
        <Stack spacing={2}>
          <Button
            leftIcon={<FiHome />}
            justifyContent="flex-start"
            variant="ghost"
            color={textColor}
          >
            Home
          </Button>
          <Button
            leftIcon={<FiUsers />}
            justifyContent="flex-start"
            variant="ghost"
            color={textColor}
            as={Link}
            to="/study-groups"
          >
            Study Groups
          </Button>
          <Button
            leftIcon={<FiBook />}
            justifyContent="flex-start"
            variant="ghost"
            color={textColor}
            as={Link}
            to="/courses"
          >
            Courses
          </Button>
          <Button
            leftIcon={<FiMessageSquare />}
            justifyContent="flex-start"
            variant="ghost"
            color={textColor}
          >
            Messages
          </Button>
        </Stack>
        <Divider borderColor={borderColor} />
        <Text fontSize="sm" color={mutedText} mt={4}>
          Your Courses
        </Text>
        <Stack spacing={2}>
          <Button variant="ghost" justifyContent="flex-start" color={textColor}>
            CS 301
          </Button>
          <Button variant="ghost" justifyContent="flex-start" color={textColor}>
            MATH 202
          </Button>
        </Stack>
      </Flex>
    </Box>
  );
};

export default LeftSidebar;
