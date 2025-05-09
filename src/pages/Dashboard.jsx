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
  Flex,
  Avatar,
  Badge,
  Divider,
  Grid,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Progress
} from "@chakra-ui/react";
import {
  FiBookOpen,
  FiCalendar,
  FiFileText,
  FiUsers,
  FiArrowRight,
  FiPlus,
  FiBell,
  FiClock,
  FiActivity,
  FiPlusCircle,
  FiCheckCircle,
  FiFlag,
  FiMessageSquare,
  FiMoreVertical,
  FiChevronDown,
  FiSearch,
  FiEdit
} from "react-icons/fi";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const cardBg = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.800", "whiteAlpha.900");
  const mutedText = useColorModeValue("gray.600", "gray.400");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const primaryColor = useColorModeValue("blue.600", "blue.400");
  const accentColor = useColorModeValue("yellow.400", "yellow.500");
  const highlightBg = useColorModeValue("gray.100", "gray.700");
  const notificationBg = useColorModeValue("blue.50", "blue.900");
  const warningBg = useColorModeValue("yellow.50", "yellow.900");
  const successBg = useColorModeValue("green.50", "green.900");
  const sectionBg = useColorModeValue("gray.50", "gray.700");
  const isMobile = useBreakpointValue({ base: true, md: false });

  // Modal controls
  const { isOpen: isQuickPostOpen, onOpen: onQuickPostOpen, onClose: onQuickPostClose } = useDisclosure();
  
  // User data - would come from authentication in a real app
  const [userData, setUserData] = useState({
    name: "Alex Johnson",
    avatar: "https://randomuser.me/api/portraits/people/22.jpg",
    major: "Computer Science",
    yearLevel: "3rd Year",
    completedCourses: 24,
    totalRequiredCourses: 40,
    gpa: 3.78
  });

  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

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
      {/* Personalized Hero Banner with User Profile */}
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
              <Avatar size="lg" src={userData.avatar} name={userData.name} />
              <VStack align="start" spacing={1}>
                <Heading size="md" color={textColor}>{getGreeting()}, {userData.name}!</Heading>
                <Text fontSize="sm" color={mutedText}>{userData.major} • {userData.yearLevel}</Text>
                <HStack mt={1}>
                  <Badge colorScheme="blue" variant="subtle" px={2} py={1} borderRadius="full">
                    GPA: {userData.gpa}
                  </Badge>
                  <Badge colorScheme="green" variant="subtle" px={2} py={1} borderRadius="full">
                    {userData.completedCourses}/{userData.totalRequiredCourses} Courses
                  </Badge>
                </HStack>
              </VStack>
            </HStack>
          </Flex>
          
          {/* Academic Progress Indicator */}
          <Box mt={4}>
            <Flex justify="space-between" mb={1}>
              <Text fontSize="sm">Degree Progress</Text>
              <Text fontSize="sm" fontWeight="bold">
                {Math.round((userData.completedCourses / userData.totalRequiredCourses) * 100)}%
              </Text>
            </Flex>
            <Progress 
              value={(userData.completedCourses / userData.totalRequiredCourses) * 100} 
              size="sm" 
              colorScheme="green" 
              borderRadius="full" 
            />
          </Box>
        </Card>
      </motion.div>
      
      {/* Main Content Grid */}
        {/* Left Column */}
        <Box>
          {/* Overview Stats */}
          <Box mb={6}>
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
                          <Text fontSize="xs" color={mutedText} whiteSpace="nowrap">{item.label}</Text>
                        </VStack>
                      </HStack>
                    </Tooltip>
                  </Card>
                </motion.div>
              ))}
            </SimpleGrid>
          </Box>
          
          {/* Portal Sections Grid */}
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
    </Box>
  );
};

export default Dashboard;
