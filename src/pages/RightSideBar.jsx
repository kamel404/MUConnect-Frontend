import { Box, Heading, Stack, Flex, Button, Card, CardBody, Text, useColorModeValue } from "@chakra-ui/react";
import { FiBook } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";

const RightSidebar = ({ textColor, mutedText, primaryColor, cardBg, highlightBg, onClose }) => {
  const navigate = useNavigate();
  const accentColor = useColorModeValue("rgba(250, 202, 21, 0.3)", "rgba(202, 162, 18, 0.3)");

  
  // Handle navigation with closing
  const handleNavigation = (path) => {
    navigate(path);
    if (onClose) onClose();
  };

  return (
    <Box>
      <Stack spacing={6}>
        <Box>
          <Stack spacing={3}>
          </Stack>
        </Box>
        <Box>
          <Flex justify="space-between" align="center" mb={4}>
            <Heading size="md" color={textColor}>
              Upcoming Events
            </Heading>
            <Button variant="ghost" border color={primaryColor} _hover={{ bg: accentColor }} size="sm" onClick={() => handleNavigation("/events")}>
              See all
            </Button>
          </Flex>

          <Stack spacing={3}>
            {[
              { title: "AI Workshop", date: "Mar 15", time: "3:00 PM" },
              { title: "Career Fair", date: "Mar 20", time: "10:00 AM" },
            ].map((event) => (
              <Card key={event.title} variant="outline" bg={cardBg} borderLeft="3px solid" borderColor={accentColor}>
                <CardBody>
                  <Text fontWeight="600" color={textColor}>
                    {event.title}
                  </Text>
                  <Text fontSize="sm" color={mutedText}>
                    {event.date} • {event.time}
                  </Text>
                </CardBody>
              </Card>
            ))}
          </Stack>
        </Box>
        <Box>
          <Heading size="md" mb={4} color={textColor}>
            Recommended Resources
          </Heading>
          <Stack spacing={3}>
            <Button variant="ghost" leftIcon={<FiBook />} color={textColor} _hover={{ bg: accentColor }} onClick={() => handleNavigation("/resources/cs301")}>
              CS 301 Lecture Notes
            </Button>
            <Button variant="ghost" leftIcon={<FiBook />} color={textColor} _hover={{ bg: accentColor }} onClick={() => handleNavigation("/resources/math202")}>
              MATH 202 Practice Exams
            </Button>
          </Stack>
        </Box>
      </Stack>
    </Box>
  );
};

export default RightSidebar;
