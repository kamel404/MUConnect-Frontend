import {
  Box,
  Heading,
  Text,
  Card,
  useColorModeValue,
  SimpleGrid,
  Button,
  HStack,
  Icon,
  VStack,
  Tooltip,
  Flex,
  Avatar,
  Spinner,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
import {
  FiBookOpen,
  FiCalendar,
  FiUsers,
  FiArrowRight,
  FiAward,
  FiTrendingUp,
  FiFlag,
} from "react-icons/fi";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { http } from "../services/httpClient";
import { API_BASE_URL } from "../config/env";


const Dashboard = () => {
  const cardBg = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.800", "whiteAlpha.900");
  const mutedText = useColorModeValue("gray.600", "gray.400");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const primaryColor = useColorModeValue("blue.600", "blue.400");
  const accentColor = useColorModeValue("yellow.400", "yellow.500");

  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const base_URL = API_BASE_URL; // retained variable name for minimal change

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
  const response = await http.get('/overview');
        setDashboardData(response.data);
      } catch (err) {
        setError(err.message || 'Failed to fetch dashboard data.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  if (isLoading) {
    return (
      <Flex justify="center" align="center" minH="50vh">
        <Spinner size="xl" />
      </Flex>
    );
  }

  if (error) {
    return (
      <Alert status="error" borderRadius="md">
        <AlertIcon />
        <Text>There was an error fetching your dashboard data. Please try again later.</Text>
      </Alert>
    );
  }
  
  if (!dashboardData) return null;

  const { user, overview, general } = dashboardData;

  const overviewStats = {
    events: { count: overview.events.registered, label: "Registered Events", link: "/events", icon: FiCalendar },
    clubs: { count: overview.clubs.joined, label: "Joined Clubs", link: "/clubs", icon: FiFlag },
    resources: { count: general.latest_resources.length, label: "Latest Resources", link: "/resources", icon: FiBookOpen },
    studyGroups: { count: overview.study_groups.total, label: "Study Groups", link: "/study-groups", icon: FiUsers },
  };

  const portalSections = [
    {
      title: "Resources",
      description: "Access study materials, guides, and educational resources.",
      icon: FiBookOpen,
      link: "/resources",
      stat: `${overview.resources.saved} saved`,
      preview: general.latest_resources.length > 0 ? `Latest: ${general.latest_resources[0].title}` : "No new resources",
    },
    {
      title: "Events",
      description: "See upcoming campus events and register.",
      icon: FiCalendar,
      link: "/events",
      stat: `${overview.events.upcoming} upcoming`,
      preview: general.upcoming_events.length > 0 ? `Next: ${general.upcoming_events[0].title}` : "No upcoming events",
    },
    {
      title: "Clubs",
      description: "Discover, join, and interact with campus clubs.",
      icon: FiFlag,
      link: "/clubs",
      stat: `${overview.clubs.joined} joined`,
      preview: "Check out the latest club activities and news.",
    },
    {
      title: "Study Groups",
      description: "Collaborate with peers and excel in your courses.",
      icon: FiUsers,
      link: "/study-groups",
      stat: `${overview.study_groups.leading} led by you`,
      preview: `Find or create a study group for your classes.`,
    },
  ];

  return (
    <Box>
      {general.voting_status === 'open' && (
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Alert status="info" borderRadius="xl" mb={6} p={4} variant="subtle">
            <AlertIcon as={FiAward} />
            <Box flex="1">
              <Text fontWeight="bold">Student Elections are now open!</Text>
              <Text fontSize="sm">Your voice matters. Cast your vote for student representatives now.</Text>
            </Box>
            <Button as={Link} to="/clubs" colorScheme="blue" size="sm">Vote Now</Button>
          </Alert>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card 
          mb={6} 
          p={6} 
          borderRadius="xl" 
          borderWidth="1px"
          borderColor={borderColor}
          bg={cardBg}
          boxShadow="md"
        >
          <Flex direction={{ base: "column", md: "row" }} alignItems="center" justifyContent="space-between">
            <HStack spacing={4} mb={{ base: 4, md: 0 }}>
              <Avatar size="lg" src={user.avatar} name={`${user.first_name} ${user.last_name}`} />
              <VStack align="start" spacing={1}>
                <Heading size="md" color={textColor}>{getGreeting()}, {user.first_name}!</Heading>
                <Text fontSize="sm" color={mutedText}>{user.major.name}</Text>
              </VStack>
            </HStack>
          </Flex>
        </Card>
      </motion.div>
      
      <Box mb={6}>
        <Heading size="md" mb={4} color={primaryColor}>
          My Overview
        </Heading>
        <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4}>
          {Object.values(overviewStats).map((item) => (
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
                    <VStack align="start"spacing={0}>
                      <Text fontSize="xl" fontWeight="bold" color={textColor}>{item.count}</Text>
                      <Text fontSize="xs" color={mutedText} whiteSpace="nowrap">{item.label}</Text>
                    </VStack>
                  </HStack>
                </Tooltip>
              </Card>
            </motion.div>
          ))}
        </SimpleGrid>
      </Box>
      
      <Box mb={6}>
        <Heading size="md" mb={4} color={primaryColor}>
          Explore Sections
        </Heading>
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
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
                  boxShadow="sm"
                  p={6}
                  _hover={{ bg: `${accentColor}10` }}
                  transition="all 0.2s ease"
                  h="100%"
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
    </Box>
  );
};

export default Dashboard;
