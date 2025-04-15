import { Box, Heading, Stack, Flex, Button, Card, CardBody, Text } from "@chakra-ui/react";
import { FiBook } from "react-icons/fi";
import { Link } from "react-router-dom";

const RightSidebar = ({ textColor, mutedText, primaryColor, cardBg, highlightBg }) => {
  return (
    <Box>
      <Stack spacing={6}>
        <Box>
          <Heading size="md" mb={4} color={textColor}>
            Trending Topics
          </Heading>
          <Stack spacing={3}>
            {[
              { name: "Midterm Prep" },
              { name: "Internship Opportunities" },
              { name: "Hackathon Team Forming" },
            ].map((topic) => (
              <Flex key={topic.name} justify="space-between">
                <Button
                  variant="ghost"
                  justifyContent="flex-start"
                  color={primaryColor}
                  fontWeight="bold"
                  as={Link}
                  to={`/search?query=${topic.name}`}
                  _hover={{ bg: highlightBg }}
                >
                  #{topic.name}
                </Button>
              </Flex>
            ))}
          </Stack>
        </Box>
        <Box>
          <Flex justify="space-between" align="center" mb={4}>
            <Heading size="md" color={textColor}>
              Upcoming Events
            </Heading>
            <Button variant="ghost" border color={primaryColor} _hover={{ bg: highlightBg }} size="sm" as={Link} to="/events">
              See all
            </Button>
          </Flex>

          <Stack spacing={3}>
            {[
              { title: "AI Workshop", date: "Mar 15", time: "3:00 PM" },
              { title: "Career Fair", date: "Mar 20", time: "10:00 AM" },
            ].map((event) => (
              <Card key={event.title} variant="outline" bg={cardBg} borderLeft="3px solid" borderColor={highlightBg}>
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
            <Button variant="ghost" leftIcon={<FiBook />} color={textColor} _hover={{ bg: highlightBg }}>
              CS 301 Lecture Notes
            </Button>
            <Button variant="ghost" leftIcon={<FiBook />} color={textColor} _hover={{ bg: highlightBg }}>
              MATH 202 Practice Exams
            </Button>
          </Stack>
        </Box>
      </Stack>
    </Box>
  );
};

export default RightSidebar;
