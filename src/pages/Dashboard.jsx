import {
  Box,
  Heading,
  Text,
  Card,
  CardBody,
  useColorModeValue,
  useBreakpointValue,
  SimpleGrid,
  Button,
  Stack,
  HStack,
  Icon,
  VStack,
  Tooltip,
  Flex
} from "@chakra-ui/react";
import {
  FiBookOpen,
  FiCalendar,
  FiFileText,
  FiUsers,
  FiArrowRight
} from "react-icons/fi";
import { motion } from "framer-motion";
import { useState } from "react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const cardBg = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.800", "whiteAlpha.900");
  const mutedText = useColorModeValue("gray.600", "gray.400");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const primaryColor = useColorModeValue("blue.600", "blue.400");
  const accentColor = useColorModeValue("yellow.400", "yellow.500");
  const highlightBg = useColorModeValue("gray.100", "gray.700");
  const isMobile = useBreakpointValue({ base: true, md: false });
  

  // Example overview stats (replace with real data as needed)
  const overview = {
    events: { count: 2, label: "Registered Events", link: "/events", icon: FiCalendar },
    clubs: { count: 3, label: "Joined Clubs", link: "/clubs", icon: FiUsers },
    resources: { count: 5, label: "New Resources", link: "/resources", icon: FiBookOpen },
    news: { count: 1, label: "Unread News", link: "/news", icon: FiFileText },
  };

  // Card data for portal sections with specific icons and preview content
  const portalSections = [
    {
      title: "Resources",
      description: "Access study materials, guides, and educational resources.",
      icon: FiBookOpen,
      link: "/resources",
      stat: `${overview.resources.count} new`,
      preview: "Latest: Linear Algebra Solutions",
    },
    {
      title: "Events",
      description: "See upcoming campus events and register.",
      icon: FiCalendar,
      link: "/events",
      stat: `${overview.events.count} upcoming`,
      preview: "Next: Workshop on AI Ethics (Apr 18)",
    },
    {
      title: "News & Announcements",
      description: "Stay updated with official news and academic notices.",
      icon: FiFileText,
      link: "/news",
      stat: `${overview.news.count} new`,
      preview: "Update: Midterm Schedule Released",
    },
    {
      title: "Clubs",
      description: "Discover, join, and interact with campus clubs.",
      icon: FiUsers,
      link: "/clubs",
      stat: `${overview.clubs.count} joined`,
      preview: "Meeting: Coding Club (Today @ 5 PM)",
    },
  ];



  return (
    <Box>
      {/* Subtle Hero Banner */}
      <Box
        mb={6}
        display="flex"
        alignItems="center"
        justifyContent="center"
        color="white"
        textAlign="center"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Heading size="lg">Welcome back, Student!</Heading>
          <Text fontSize="md" mt={1}>Your place for university resources and activities.</Text>
        </motion.div>
      </Box>
      
      {/* Overview Section */}
      <Box mb={8}>
        <Heading size="md" mb={4} color={primaryColor}>
          My Overview
        </Heading>
        <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4}>
          {Object.values(overview).map((item) => (
            <motion.div
              key={item.label}
              whileHover={{ y: -3, scale: 1.03 }}
              transition={{ duration: 0.15 }}
            >
              <Card
                bg={cardBg}
                borderRadius="lg"
                borderWidth="1px"
                borderColor={borderColor}
                p={4}
                variant="outline"
                as={Link}
                to={item.link}
                _hover={{ textDecoration: 'none', shadow: 'md', bg: `${accentColor}10` }}
              >
                <Tooltip label={item.label} placement="top" hasArrow>
                  <HStack spacing={3} align="center">
                    <Icon as={item.icon} boxSize={6} color={accentColor} />
                    <VStack align="start" spacing={0}>
                      <Text fontSize="xl" fontWeight="bold" color={textColor}>{item.count}</Text>
                      <Text fontSize="xs" color={mutedText} whiteSpace="nowrap" display={{ base: 'none', md: 'block' }}>{item.label}</Text>
                    </VStack>
                  </HStack>
                </Tooltip>
              </Card>
            </motion.div>
          ))}
        </SimpleGrid>
      </Box>
        
      {/* Portal Sections Grid */}
      <Heading size="md" mb={4} color={primaryColor}>
        Explore Sections
      </Heading>
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} mb={6}>
        {portalSections.map((section) => (
          <Link key={section.title} to={section.link} style={{ textDecoration: "none" }}>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              whileHover={{ scale: 1.02, y: -4 }}
            >
              <Card
                bg={cardBg}
                borderColor={borderColor}
                borderWidth="1px"
                borderRadius="xl"
                boxShadow="md"
                p={6}
                _hover={{ bg: `${accentColor}10` }}
                transition="all 0.2s ease"
              >
                <Flex direction="column" h="100%">
                  <Flex align="center" mb={3} gap={3}>
                    <Box fontSize="2xl" as={section.icon} color={accentColor} />
                    <Heading size="md" color={primaryColor}>{section.title}</Heading>
                  </Flex>
                  <Text color={mutedText} mb={4} flexGrow={1}>{section.description}</Text>
                  <Text fontWeight="bold" color={accentColor} mb={2}>{section.stat}</Text>
                  <HStack mt="auto" pt={3} borderTopWidth="1px" borderColor={borderColor} spacing={2}>
                    <Text fontSize="xs" color={mutedText} noOfLines={1}>{section.preview}</Text>
                    <Icon as={FiArrowRight} boxSize={4} color={mutedText} ml="auto" />
                  </HStack>
                </Flex>
              </Card>
            </motion.div>
          </Link>
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default Dashboard;
