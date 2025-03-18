import { Box, Flex, Heading, Text, Button, Stack, Divider, useColorModeValue, useBreakpointValue, Icon } from "@chakra-ui/react";
import { FiHome, FiUsers, FiBook, FiMessageSquare } from "react-icons/fi";
import { Link } from "react-router-dom";

const LeftSidebar = () => {
  const textColor = useColorModeValue("gray.800", "white");
  const mutedText = useColorModeValue("gray.500", "gray.400");
  const borderColor = useColorModeValue("gray.100", "gray.600");
  const isMobile = useBreakpointValue({ base: true, md: false });

  return (
    <Box p={4} width="100%">
      <Flex direction="column" gap={6}>
        {!isMobile && (
          <Heading size="md" mb={4} color={textColor}>
            MU Hub
          </Heading>
        )}
        
        <Stack spacing={2}>
          <Button
            leftIcon={<Icon as={FiHome} />}
            justifyContent={isMobile ? "center" : "flex-start"}
            variant="ghost"
            color={textColor}
            w="full"
          >
            {!isMobile && "Home"}
          </Button>
          
          <Button
            leftIcon={<Icon as={FiUsers} />}
            justifyContent={isMobile ? "center" : "flex-start"}
            variant="ghost"
            color={textColor}
            as={Link}
            to="/study-groups"
            w="full"
          >
            {!isMobile && "Study Groups"}
          </Button>
          
          <Button
            leftIcon={<Icon as={FiBook} />}
            justifyContent={isMobile ? "center" : "flex-start"}
            variant="ghost"
            color={textColor}
            as={Link}
            to="/courses"
            w="full"
          >
            {!isMobile && "Courses"}
          </Button>
          
          <Button
            leftIcon={<Icon as={FiMessageSquare} />}
            justifyContent={isMobile ? "center" : "flex-start"}
            variant="ghost"
            color={textColor}
            w="full"
          >
            {!isMobile && "Messages"}
          </Button>
        </Stack>

        {!isMobile && (
          <>
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
          </>
        )}
      </Flex>
    </Box>
  );
};

export default LeftSidebar;