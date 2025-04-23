import {
  Flex,
  Grid,
  Box,
  Heading,
  Text,
  Avatar,
  Button,
  IconButton,
  Card,
  CardBody,
  Stack,
  useColorModeValue,
  useBreakpointValue,
  Icon,
  Badge,
  Image,
  Link,
  Input,
  InputGroup,
  InputLeftElement,
  Skeleton,
  useToast,
  Container,
  HStack,
  VStack,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Divider,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { FiCalendar, FiMapPin, FiBell, FiVideo, FiChevronLeft, FiSearch, FiBookmark, FiFilter, FiChevronDown, FiUser, FiCheck, FiClock } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const MotionCard = motion(Card);

const EventsPage = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const bgColor = useColorModeValue("gray.50", "gray.900");
  const cardBg = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.800", "white");
  const mutedText = useColorModeValue("gray.500", "gray.400");
  const accentColor = useColorModeValue("purple.500", "purple.300");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const isMobile = useBreakpointValue({ base: true, md: false });
  
  // Modal controls
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedEvent, setSelectedEvent] = useState(null);
  
  // Filtering states
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [timeFilter, setTimeFilter] = useState("All");
  
  // Registration states
  const [registeredEvents, setRegisteredEvents] = useState([]);

  const events = [
    {
      id: 1,
      title: "AI Innovation Summit",
      date: "2025-04-15T15:00:00",
      location: "Tech Convention Center",
      organizer: "Future Tech Institute",
      description: "Explore cutting-edge AI advancements with industry leaders. Learn about the latest trends in machine learning, natural language processing, and computer vision. Network with professionals and academics at the forefront of artificial intelligence research.",
      attendees: 145,
      maxAttendees: 200,
      media: "https://images.unsplash.com/photo-1573164713988-8665fc963095?ixlib=rb-1.2.1&auto=format&fit=crop&w=900&q=80",
      mediaType: "image",
      category: "Conference",
      tags: ["AI", "Technology", "Networking"],
      speakers: [
        { name: "Dr. Sarah Chen", title: "AI Research Director, TechCorp" },
        { name: "Prof. James Wilson", title: "Head of Computer Science, MIT" }
      ]
    },
    {
      id: 2,
      title: "UX Design Masterclass",
      date: "2025-04-20T10:00:00",
      location: "Creative Design Studio",
      organizer: "Digital Arts Collective",
      description: "Hands-on workshop with Figma and prototyping tools. This interactive session will cover the fundamentals of user experience design, wireframing, prototyping, and usability testing. Bring your laptop to participate in practical exercises.",
      attendees: 89,
      maxAttendees: 100,
      media: "https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-1.2.1&auto=format&fit=crop&w=900&q=80",
      mediaType: "image",
      category: "Workshop",
      tags: ["Design", "UX/UI", "Figma"],
      speakers: [
        { name: "Maya Johnson", title: "Lead UX Designer, DesignWorks" }
      ]
    },
    {
      id: 3,
      title: "Startup Pitch Night",
      date: "2025-05-01T19:00:00",
      location: "Innovation Theater",
      organizer: "Entrepreneurship Network",
      description: "Witness tomorrow's unicorns pitch to top VCs. Ten selected startups will present their business ideas to a panel of venture capitalists and angel investors. Networking reception follows the pitch competition with opportunities to connect with founders and investors.",
      attendees: 212,
      maxAttendees: 300,
      media: "https://images.unsplash.com/photo-1531482615713-2afd69097998?ixlib=rb-1.2.1&auto=format&fit=crop&w=900&q=80",
      mediaType: "video",
      category: "Networking",
      tags: ["Startup", "Entrepreneurship", "Investing"],
      speakers: [
        { name: "Alex Rivera", title: "Partner, Sequoia Capital" },
        { name: "Tiffany Wong", title: "Founder & CEO, TechLaunch" }
      ]
    },
    {
      id: 4,
      title: "Blockchain Deep Dive",
      date: "2025-05-10T13:00:00",
      location: "Crypto Arena",
      organizer: "Web3 Foundation",
      description: "Understanding smart contracts and DeFi ecosystems. This technical workshop will explore blockchain architecture, consensus mechanisms, and decentralized applications. Participants will learn how to develop and deploy a simple smart contract.",
      attendees: 93,
      maxAttendees: 120,
      media: "https://images.unsplash.com/photo-1620336655055-088d06e36bf0?ixlib=rb-1.2.1&auto=format&fit=crop&w=900&q=80",
      mediaType: "image",
      category: "Workshop",
      tags: ["Blockchain", "Web3", "DeFi"],
      speakers: [
        { name: "Vitalik Chen", title: "Blockchain Developer, Ethereum Foundation" }
      ]
    },
    {
      id: 5,
      title: "Tech Leadership Forum",
      date: "2025-05-18T09:00:00",
      location: "Executive Conference Hall",
      organizer: "Tech Management Association",
      description: "Leadership strategies for engineering managers. This executive forum addresses the unique challenges of leading technical teams. Sessions cover topics such as managing remote teams, fostering innovation, and balancing technical debt with product development.",
      attendees: 67,
      maxAttendees: 80,
      media: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-1.2.1&auto=format&fit=crop&w=900&q=80",
      mediaType: "video",
      category: "Conference",
      tags: ["Leadership", "Management", "Career"],
      speakers: [
        { name: "Michelle Park", title: "CTO, Enterprise Solutions" },
        { name: "David Okafor", title: "VP Engineering, TechGiant" }
      ]
    },
    {
      id: 6,
      title: "DevOps Bootcamp",
      date: "2025-06-02T11:00:00",
      location: "Cloud Computing Lab",
      organizer: "SysOps Academy",
      description: "CI/CD pipelines and infrastructure as code. This intensive bootcamp provides hands-on training in containerization, Kubernetes orchestration, and cloud infrastructure management. Participants will build and deploy a microservices application using modern DevOps practices.",
      attendees: 124,
      maxAttendees: 150,
      media: "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-1.2.1&auto=format&fit=crop&w=900&q=80",
      mediaType: "image",
      category: "Workshop",
      tags: ["DevOps", "Cloud", "Kubernetes"],
      speakers: [
        { name: "Raj Patel", title: "DevOps Engineer, CloudScale" },
        { name: "Emma Thompson", title: "SRE Manager, ServerStack" }
      ]
    },
    {
      id: 7,
      title: "Capstone Project Showcase",
      date: "2025-05-25T14:00:00",
      location: "University Exhibition Hall",
      organizer: "Computer Science Department",
      description: "Senior students present their capstone projects. Come see innovative solutions developed by graduating students across various disciplines including mobile apps, web platforms, machine learning models, robotics, and more.",
      attendees: 180,
      maxAttendees: 250,
      media: "https://images.unsplash.com/photo-1595187139760-5cedf9ab5850?ixlib=rb-1.2.1&auto=format&fit=crop&w=900&q=80",
      mediaType: "image",
      category: "Exhibition",
      tags: ["Student Projects", "Innovation", "Showcase"],
      speakers: []
    },
    {
      id: 8,
      title: "Data Science Career Fair",
      date: "2025-04-28T10:00:00",
      location: "University Career Center",
      organizer: "Statistics & Data Department",
      description: "Connect with top employers hiring data scientists. This career fair brings together companies seeking talent in data science, machine learning, and analytics. Prepare your resume and portfolio to share with recruiters from technology, finance, healthcare, and other industries.",
      attendees: 230,
      maxAttendees: 300,
      media: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-1.2.1&auto=format&fit=crop&w=900&q=80",
      mediaType: "image",
      category: "Career",
      tags: ["Data Science", "Recruiting", "Jobs"],
      speakers: []
    }
  ];
  
  // Get all unique categories
  const categories = ["All", ...new Set(events.map(event => event.category))];
  
  // Filter events based on search and filters
  const filteredEvents = events.filter(event => {
    const matchesSearch = searchQuery === "" || 
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = categoryFilter === "All" || event.category === categoryFilter;
    
    // Time filter logic
    const eventDate = new Date(event.date);
    const today = new Date();
    const isToday = eventDate.toDateString() === today.toDateString();
    const isThisWeek = eventDate <= new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000) && eventDate >= today;
    const isThisMonth = eventDate.getMonth() === today.getMonth() && eventDate.getFullYear() === today.getFullYear();
    
    const matchesTime = timeFilter === "All" ||
      (timeFilter === "Today" && isToday) ||
      (timeFilter === "This Week" && isThisWeek) ||
      (timeFilter === "This Month" && isThisMonth);
    
    return matchesSearch && matchesCategory && matchesTime;
  });
  
  // Handle event registration
  const handleRegister = (eventId) => {
    if (registeredEvents.includes(eventId)) {
      setRegisteredEvents(prev => prev.filter(id => id !== eventId));
      toast({
        title: "Registration canceled",
        description: "You've been removed from the event",
        status: "info",
        duration: 3000,
        isClosable: true,
      });
    } else {
      setRegisteredEvents(prev => [...prev, eventId]);
      toast({
        title: "Registration successful!",
        description: "You're now registered for this event",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    }
    onClose();
  };
  
  // Open event details modal
  const openEventDetails = (event) => {
    setSelectedEvent(event);
    onOpen();
  };
  
  const handleGoBack = () => {
    navigate(-1); // Navigate back to the previous page
  };

  const EventCard = ({ event }) => (
    <MotionCard
      onClick={() => openEventDetails(event)}
      cursor="pointer"
      key={event.id}
      bg={cardBg}
      position="relative"
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
      boxShadow="md"
      borderRadius="xl"
      overflow="hidden"
      borderWidth="1px"
      borderColor={borderColor}
    >
      <CardBody p={0}>
        <Stack spacing={0}>
          {/* Media Section */}
          <Box 
            position="relative"
            height="180px"
            overflow="hidden"
          >
            <Image
              src={event.media}
              alt={event.title}
              objectFit="cover"
              width="100%"
              height="100%"
              filter="brightness(0.9)"
            />
            
            <Box
              position="absolute"
              top={3}
              left={3}
              bg="rgba(0,0,0,0.7)"
              py={1}
              px={2}
              borderRadius="md"
              color="white"
              textAlign="center"
            >
              <Text fontSize="xs" fontWeight="bold">
                {new Date(event.date).toLocaleDateString("en-US", { month: 'short' }).toUpperCase()}
              </Text>
              <Text fontSize="xl" fontWeight="bold">
                {new Date(event.date).getDate()}
              </Text>
            </Box>
            
            <IconButton
              aria-label="Bookmark event"
              icon={<FiBookmark />}
              position="absolute"
              top={3}
              right={3}
              colorScheme="purple"
              variant="ghost"
              size="sm"
              borderRadius="full"
              onClick={(e) => {
                e.stopPropagation();
                toast({
                  title: "Event saved",
                  description: "Added to your bookmarks",
                  status: "success",
                  duration: 2000,
                  isClosable: true,
                });
              }}
            />
            
            <Badge 
              position="absolute" 
              bottom={3} 
              right={3}
              colorScheme="purple" 
              variant="solid"
              borderRadius="md"
            >
              {event.category}
            </Badge>
          </Box>

          <Stack p={4} spacing={3}>
            <Heading size="md" color={textColor} noOfLines={1}>
              {event.title}
            </Heading>
            
            <Flex direction="column" gap={2}>
              <Flex align="center" gap={2}>
                <Icon as={FiMapPin} color={accentColor} boxSize={4} />
                <Text fontSize="sm" color={mutedText} noOfLines={1}>
                  {event.location}
                </Text>
              </Flex>
              
              <Flex align="center" gap={2}>
                <Icon as={FiCalendar} color={accentColor} boxSize={4} />
                <Text fontSize="sm" color={mutedText}>
                  {new Date(event.date).toLocaleTimeString("en-US", {
                    hour: 'numeric',
                    minute: '2-digit',
                  })}
                </Text>
              </Flex>
              
              <Flex align="center" gap={2}>
                <Icon as={FiUser} color={accentColor} boxSize={4} />
                <Text fontSize="sm" color={mutedText}>
                  {event.attendees}/{event.maxAttendees} Attending
                </Text>
              </Flex>
            </Flex>
            
            {registeredEvents.includes(event.id) && (
              <Badge colorScheme="green" alignSelf="flex-start" px={2} py={1} borderRadius="full">
                <Flex align="center" gap={1}>
                  <Icon as={FiCheck} />
                  <Text>Registered</Text>
                </Flex>
              </Badge>
            )}
          </Stack>
        </Stack>
      </CardBody>
    </MotionCard>
  );

  // Modal for event details
  const EventDetailsModal = () => {
    if (!selectedEvent) return null;
    
    const eventDate = new Date(selectedEvent.date);
    const isRegistered = registeredEvents.includes(selectedEvent.id);
    const isFull = selectedEvent.attendees >= selectedEvent.maxAttendees;
    
    return (
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(5px)" />
        <ModalContent bg={cardBg} borderRadius="xl">
          <ModalHeader color={textColor}>{selectedEvent.title}</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <Box position="relative" mb={6}>
              <Image
                src={selectedEvent.media}
                alt={selectedEvent.title}
                w="100%"
                h="250px"
                objectFit="cover"
                borderRadius="lg"
              />
              
              <Badge
                position="absolute"
                top={4}
                right={4}
                colorScheme="purple"
                fontSize="sm"
                px={3}
                py={1}
                borderRadius="md"
              >
                {selectedEvent.category}
              </Badge>
            </Box>
            
            <Grid templateColumns={{ base: "1fr", md: "2fr 1fr" }} gap={6}>
              <Box>
                <Heading size="md" mb={3} color={textColor}>About This Event</Heading>
                <Text color={textColor} mb={4}>
                  {selectedEvent.description}
                </Text>
                
                {selectedEvent.speakers && selectedEvent.speakers.length > 0 && (
                  <Box mt={5}>
                    <Heading size="sm" mb={3} color={textColor}>Featured Speakers</Heading>
                    <VStack align="start" spacing={3}>
                      {selectedEvent.speakers.map((speaker, index) => (
                        <HStack key={index} spacing={3}>
                          <Avatar size="sm" name={speaker.name} />
                          <Box>
                            <Text fontWeight="bold" fontSize="sm">{speaker.name}</Text>
                            <Text fontSize="xs" color={mutedText}>{speaker.title}</Text>
                          </Box>
                        </HStack>
                      ))}
                    </VStack>
                  </Box>
                )}
                
                {selectedEvent.tags && selectedEvent.tags.length > 0 && (
                  <HStack mt={5} spacing={2} flexWrap="wrap">
                    {selectedEvent.tags.map((tag, index) => (
                      <Badge key={index} colorScheme="gray" variant="subtle">
                        {tag}
                      </Badge>
                    ))}
                  </HStack>
                )}
              </Box>
              
              <Box>
                <VStack align="start" spacing={4} p={4} bg={useColorModeValue("gray.50", "gray.700")} borderRadius="lg">
                  <Heading size="sm" color={textColor}>Event Details</Heading>
                  
                  <HStack>
                    <Icon as={FiCalendar} color={accentColor} />
                    <VStack align="start" spacing={0}>
                      <Text fontSize="sm" fontWeight="bold">Date & Time</Text>
                      <Text fontSize="sm">
                        {eventDate.toLocaleDateString("en-US", {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </Text>
                      <Text fontSize="sm">
                        {eventDate.toLocaleTimeString("en-US", {
                          hour: 'numeric',
                          minute: '2-digit'
                        })}
                      </Text>
                    </VStack>
                  </HStack>
                  
                  <HStack>
                    <Icon as={FiMapPin} color={accentColor} />
                    <VStack align="start" spacing={0}>
                      <Text fontSize="sm" fontWeight="bold">Location</Text>
                      <Text fontSize="sm">{selectedEvent.location}</Text>
                    </VStack>
                  </HStack>
                  
                  <HStack>
                    <Icon as={FiUser} color={accentColor} />
                    <VStack align="start" spacing={0}>
                      <Text fontSize="sm" fontWeight="bold">Attendees</Text>
                      <Text fontSize="sm">{selectedEvent.attendees} of {selectedEvent.maxAttendees} spots filled</Text>
                    </VStack>
                  </HStack>
                  
                  <HStack>
                    <Icon as={FiClock} color={accentColor} />
                    <VStack align="start" spacing={0}>
                      <Text fontSize="sm" fontWeight="bold">Organizer</Text>
                      <Text fontSize="sm">{selectedEvent.organizer}</Text>
                    </VStack>
                  </HStack>
                </VStack>
              </Box>
            </Grid>
          </ModalBody>
          
          <ModalFooter>
            <Button variant="outline" mr={3} onClick={onClose}>
              Close
            </Button>
            <Button 
              colorScheme={isRegistered ? "red" : "purple"}
              onClick={() => handleRegister(selectedEvent.id)}
              isDisabled={!isRegistered && isFull}
            >
              {isRegistered ? "Cancel Registration" : isFull ? "Event Full" : "Register Now"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  };

  return (
    <Box minH="100vh" bg={bgColor} py={6} px={{ base: 4, md: 6 }}>
      <Container maxW="1200px">
        {/* Header */}
        <Flex mb={8} align="center">
          <IconButton
            icon={<FiChevronLeft />}
            onClick={handleGoBack}
            aria-label="Go back"
            variant="ghost"
            color={textColor}
            size="lg"
            mr={3}
            _hover={{ bg: useColorModeValue("gray.100", "gray.700") }}
          />
          
          <VStack align="start" spacing={1}>
            <Heading size="lg" color={textColor}>Campus Events</Heading>
            <Text fontSize="sm" color={mutedText}>
              Discover and register for upcoming events
            </Text>
          </VStack>
        </Flex>
        
        {/* Filter Section */}
        <Box bg={cardBg} p={5} borderRadius="xl" boxShadow="sm" mb={8} borderWidth="1px" borderColor={borderColor}>
          <Flex direction={{ base: "column", md: "row" }} gap={4} justify="space-between" align={{ base: "stretch", md: "center" }}>
            <InputGroup maxW={{ base: "100%", md: "400px" }}>
              <InputLeftElement pointerEvents="none">
                <Icon as={FiSearch} color={mutedText} />
              </InputLeftElement>
              <Input 
                placeholder="Search for events..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                focusBorderColor={accentColor}
              />
            </InputGroup>
            
            <HStack spacing={3}>
              <Menu>
                <MenuButton as={Button} rightIcon={<FiChevronDown />} variant="outline" size="md">
                  <Flex align="center">
                    <Icon as={FiFilter} mr={2} />
                    <Text>{categoryFilter}</Text>
                  </Flex>
                </MenuButton>
                <MenuList>
                  {categories.map((category) => (
                    <MenuItem 
                      key={category} 
                      onClick={() => setCategoryFilter(category)}
                      fontWeight={categoryFilter === category ? "bold" : "normal"}
                    >
                      {category}
                    </MenuItem>
                  ))}
                </MenuList>
              </Menu>
              
              <Menu>
                <MenuButton as={Button} rightIcon={<FiChevronDown />} variant="outline" size="md">
                  <Flex align="center">
                    <Icon as={FiCalendar} mr={2} />
                    <Text>{timeFilter}</Text>
                  </Flex>
                </MenuButton>
                <MenuList>
                  <MenuItem 
                    onClick={() => setTimeFilter("All")}
                    fontWeight={timeFilter === "All" ? "bold" : "normal"}
                  >
                    All
                  </MenuItem>
                  <MenuItem 
                    onClick={() => setTimeFilter("Today")}
                    fontWeight={timeFilter === "Today" ? "bold" : "normal"}
                  >
                    Today
                  </MenuItem>
                  <MenuItem 
                    onClick={() => setTimeFilter("This Week")}
                    fontWeight={timeFilter === "This Week" ? "bold" : "normal"}
                  >
                    This Week
                  </MenuItem>
                  <MenuItem 
                    onClick={() => setTimeFilter("This Month")}
                    fontWeight={timeFilter === "This Month" ? "bold" : "normal"}
                  >
                    This Month
                  </MenuItem>
                </MenuList>
              </Menu>
            </HStack>
          </Flex>
        </Box>
        
        {/* Event Tabs */}
        <Tabs variant="soft-rounded" colorScheme="purple">
          <TabList mb={6}>
            <Tab _selected={{ bg: `${accentColor}20`, color: accentColor, fontWeight: "semibold" }}>All Events ({filteredEvents.length})</Tab>
            <Tab _selected={{ bg: `${accentColor}20`, color: accentColor, fontWeight: "semibold" }}>
              My Events ({registeredEvents.length})
            </Tab>
          </TabList>
          
          <TabPanels>
            <TabPanel p={0}>
              {filteredEvents.length > 0 ? (
                <Grid 
                  templateColumns={{ 
                    base: "1fr", 
                    md: "repeat(2, 1fr)", 
                    lg: "repeat(3, 1fr)",
                    xl: "repeat(4, 1fr)" 
                  }}
                  gap={6}
                >
                  {filteredEvents.map((event) => (
                    <EventCard key={event.id} event={event} />
                  ))}
                </Grid>
              ) : (
                <Box
                  p={12}
                  textAlign="center"
                  borderWidth="2px"
                  borderStyle="dashed"
                  borderColor={borderColor}
                  borderRadius="lg"
                >
                  <Text color={mutedText}>No events found matching your filters</Text>
                </Box>
              )}
            </TabPanel>
            
            <TabPanel p={0}>
              {registeredEvents.length > 0 ? (
                <Grid 
                  templateColumns={{ 
                    base: "1fr", 
                    md: "repeat(2, 1fr)", 
                    lg: "repeat(3, 1fr)",
                    xl: "repeat(4, 1fr)" 
                  }}
                  gap={6}
                >
                  {events.filter(event => registeredEvents.includes(event.id))
                    .map((event) => (
                      <EventCard key={event.id} event={event} />
                    ))}
                </Grid>
              ) : (
                <Box
                  p={12}
                  textAlign="center"
                  borderWidth="2px"
                  borderStyle="dashed"
                  borderColor={borderColor}
                  borderRadius="lg"
                >
                  <Text color={mutedText}>You haven't registered for any events yet</Text>
                </Box>
              )}
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Container>
      
      {/* Event Details Modal */}
      <EventDetailsModal />
    </Box>
  );
};

export default EventsPage;