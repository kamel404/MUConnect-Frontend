import { Box, Stack, Heading, Flex, Button, Card, CardBody, Text, useColorModeValue } from "@chakra-ui/react";
import { FiBook } from "react-icons/fi";
import { Link } from "react-router-dom";

const RightSidebar = ({ events = [], isMobile }) => {
  const textColor = useColorModeValue("gray.800", "white");
  const mutedText = useColorModeValue("gray.500", "gray.400");
  const cardBg = useColorModeValue("white", "gray.700");

  return (
    <Box p={4} width="100%">
      <Stack spacing={6}>
        <Box>
          <Heading size="md" mb={4} color={textColor}>
            Trending Topics
          </Heading>
          <Stack spacing={3}>
            {[
              { name: "Midterm Prep" },
              { name: "Internship Opportunities" },
              { name: "Hackathon Team Forming"},
            ].map((topic) => (
              <Flex key={topic.name} justify="space-between">
                <Button 
                  variant="ghost" 
                  justifyContent={isMobile ? "center" : "flex-start"} 
                  color='blue.500' 
                  as={Link} 
                  to={`/search?query=${topic.name}`}
                  w="full"
                >
                  #{topic.name}
                </Button>
              </Flex>
            ))}
          </Stack>
        </Box>
        <Box>
          <Heading size="md" mb={4} color={textColor}>
            Upcoming Events
          </Heading>
          <Stack spacing={3}>
            {events.map((event) => (
              <Card key={event.title || event.id} variant="outline" bg={cardBg}>
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
        {!isMobile && (
          <Box>
            <Heading size="md" mb={4} color={textColor}>
              Recommended Resources
            </Heading>
            <Stack spacing={3}>
              <Button variant="ghost" leftIcon={<FiBook />} color={textColor}>
                CS 301 Lecture Notes
              </Button>
              <Button variant="ghost" leftIcon={<FiBook />} color={textColor}>
                MATH 202 Practice Exams
              </Button>
            </Stack>
          </Box>
        )}
      </Stack>
    </Box>
  );
};

export default RightSidebar;
