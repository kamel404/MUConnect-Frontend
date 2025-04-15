import {
  Flex,
  Box,
  Heading,
  Text,
  Avatar,
  IconButton,
  Card,
  CardBody,
  CardHeader,
  useColorMode,
  useColorModeValue,
  useBreakpointValue,
  useDisclosure,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerBody,
  CloseButton,
  SimpleGrid,
  Button,
  Stack,
  HStack,
  Icon,
  VStack,
  Tooltip
} from "@chakra-ui/react";
import {
  FiSun,
  FiMoon,
  FiMoreHorizontal,
  FiBookOpen,
  FiCalendar,
  FiFileText,
  FiUsers,
  FiArrowRight
} from "react-icons/fi";
import { motion } from "framer-motion";
import { useState } from "react";
import { Link } from "react-router-dom";
import NotificationsBox from "../components/ui/NotificationsBox";
import RightSidebar from "./RightSideBar";
import DashboardTopNav from '../components/dashboard/DashboardTopNav';

const Dashboard = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const textColor = useColorModeValue("brand.navy", "white");
  const mutedText = useColorModeValue("gray.600", "gray.400");
  const accentColor = useColorModeValue("brand.gold", "brand.goldDark");
  const primaryColor = useColorModeValue("brand.navy", "brand.navyDark");
  const highlightBg = useColorModeValue("rgba(242, 217, 68, 0.1)", "rgba(217, 194, 38, 0.15)");
  const isMobile = useBreakpointValue({ base: true, md: false });
  const { isOpen: isRightOpen, onOpen: onRightOpen, onClose: onRightClose } = useDisclosure();

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

  // Featured content (example)
  const featuredContent = {
    title: "Registration Deadline",
    description: "Last day to register for Fall 2025 courses is April 20th.",
    link: "/news/registration",
  };

  return (
    <Flex direction={{ base: "column", lg: "row" }} width="100%">
      <Box flexGrow={1} pr={{ base: 0, lg: 4 }}>
        {/* Subtle Hero Banner */}
        <Box
          bgGradient={useColorModeValue(
            "linear(to-r, brand.navy 0%, brand.gold 100%)",
            "linear(to-r, brand.navyDark 0%, brand.goldDark 100%)"
          )}
          mb={6}
          display="flex"
          alignItems="center"
          justifyContent="center"
          color="white"
          textAlign="center"
          p={{ base: 4, md: 6 }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Heading size="lg">Welcome back, Student!</Heading>
            <Text fontSize="md" mt={1}>Your hub for university resources and activities.</Text>
          </motion.div>
        </Box>
        <Flex
          direction={{ base: "column", md: "row" }}
          align={{ base: "flex-start", md: "center" }}
          justify="space-between"
          mb={8}
          gap={4}
          px={{ base: 4, md: 6 }}
        >
          <Flex align="center" gap={2}>
            <Heading size="lg" color={textColor}>
              Campus Portal
            </Heading>
          </Flex>
          <DashboardTopNav colorMode={colorMode} toggleColorMode={toggleColorMode} isMobile={isMobile} onRightOpen={onRightOpen} />
        </Flex>
        {/* Overview Section */}
        <Box mb={8} px={{ base: 4, md: 6 }}>
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
                  _hover={{ textDecoration: 'none', shadow: 'md' }}
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
        {/* Featured Content */}
        <Box mb={8} px={{ base: 4, md: 6 }}>
          <Heading size="md" mb={4} color={primaryColor}>
            Featured
          </Heading>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            whileHover={{ y: -3, scale: 1.02 }}
          >
            <Card
              bg={useColorModeValue("yellow.50", "gray.700")}
              borderColor={accentColor}
              borderWidth="1px"
              borderRadius="xl"
              boxShadow="md"
              p={6}
              _hover={{ boxShadow: "lg" }}
              as={Link}
              to={featuredContent.link}
              style={{ textDecoration: "none" }}
            >
              <Heading size="sm" color={primaryColor} mb={1}>{featuredContent.title}</Heading>
              <Text color={mutedText}>{featuredContent.description}</Text>
            </Card>
          </motion.div>
        </Box>
        {/* Portal Sections Grid */}
        <Heading size="md" mb={4} color={primaryColor} px={{ base: 4, md: 6 }}>
          Explore Sections
        </Heading>
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} px={{ base: 4, md: 6 }} mb={6}>
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
      {/* Right Sidebar for Desktop */}
      {!isMobile && (
        <Box 
          bg={cardBg} 
          p={{ base: 4, md: 6 }} 
          borderLeft="1px solid" 
          borderColor={borderColor}
          width="300px"
          flexShrink={0}
        >
          <RightSidebar 
            textColor={textColor} 
            mutedText={mutedText} 
            highlightBg={highlightBg} 
            primaryColor={primaryColor} 
            cardBg={cardBg} 
          />
        </Box>
      )}
      {/* Mobile Right Drawer */}
      <Drawer isOpen={isRightOpen} placement="right" onClose={onRightClose}>
        <DrawerOverlay />
        <DrawerContent bg={cardBg}>
          <DrawerCloseButton />
          <DrawerBody p={4} pt={12}>
            <RightSidebar 
              textColor={textColor} 
              mutedText={mutedText} 
              highlightBg={highlightBg} 
              primaryColor={primaryColor} 
              cardBg={cardBg} 
            />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Flex>
  );
};

export default Dashboard;
