import { Box, Flex, Heading, Stack, Button, Divider, Text } from "@chakra-ui/react";
import { FiHome, FiUsers, FiBook, FiInbox } from "react-icons/fi";
import { Link } from "react-router-dom";
import logo from "../assets/maaref-logo.png";

const LeftSidebar = ({ textColor, mutedText, highlightBg }) => {
  return (
    <Box>
      <Flex direction="column" gap={5} >
        <Heading size="md" mb={4} color={textColor}>
          <img src={logo} alt="maaref Logo" style={{ maxWidth: "60px", height: "auto"}} />
        </Heading>
        <Stack spacing={2}>
          <Button leftIcon={<FiHome />} justifyContent="flex-start" variant="ghost" color={textColor} as={Link} to="/dashboard" _hover={{ bg: highlightBg }}>
            Home
          </Button>
          <Button leftIcon={<FiUsers />} justifyContent="flex-start" variant="ghost" color={textColor} as={Link} to="/study-groups" _hover={{ bg: highlightBg }}>
            Study Groups
          </Button>
          <Button leftIcon={<FiBook />} justifyContent="flex-start" variant="ghost" color={textColor} as={Link} to="/courses" _hover={{ bg: highlightBg }}>
            Courses
          </Button>
          <Button leftIcon={<FiInbox />} justifyContent="flex-start" variant="ghost" color={textColor} as={Link} to="/requests" _hover={{ bg: highlightBg }}>
            Requests
          </Button>
        </Stack>
        <Divider mt={4} mb={4} />
        <Text fontSize="sm" color={mutedText} mt={4}>
          Your Courses
        </Text>
        <Stack spacing={2}>
          <Button variant="ghost" justifyContent="flex-start" color={textColor} _hover={{ bg: highlightBg }}>
            CS 301
          </Button>
          <Button variant="ghost" justifyContent="flex-start" color={textColor} _hover={{ bg: highlightBg }}>
            MATH 202
          </Button>
        </Stack>
      </Flex>
    </Box>
  );
};

export default LeftSidebar;
