import {
    Flex,
    Box,
    Heading,
    Text,
    Button,
    Stack,
    Card,
    CardHeader,
    CardBody,
    useColorModeValue,
    Badge,
    Grid,
    Avatar,
    Input,
    InputGroup,
    InputLeftElement,
    Tag,
    IconButton,
    Divider,
    CardFooter,
    Tabs, 
    TabList, 
    TabPanels, 
    Tab, 
    TabPanel,
    HStack,
    Wrap,
    WrapItem,
    TagLabel,
    TagLeftIcon,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    FormControl,
    FormLabel,
    Textarea,
    Select,
    useDisclosure,
    useToast,
    SimpleGrid,
    Switch,
    Collapse
  } from "@chakra-ui/react";
  import { 
    FiSearch, 
    FiPlus, 
    FiUsers, 
    FiClock, 
    FiMessageSquare, 
    FiArrowLeft, 
    FiMapPin, 
    FiBook, 
    FiCalendar, 
    FiArrowRight, 
    FiCheck,
    FiVideo,
    FiCheckCircle,
    FiFilter,
    FiChevronUp
  } from "react-icons/fi";
  import { useState, useEffect } from "react";
  import { useNavigate, Link } from "react-router-dom";
  import { motion } from "framer-motion";
  
  const MotionCard = motion(Card);

const StudyGroupsPage = () => {
    const navigate = useNavigate();
    const cardBg = useColorModeValue("white", "gray.700");
    const textColor = useColorModeValue("gray.800", "white");
    const mutedText = useColorModeValue("gray.500", "gray.400");
    const accentColor = useColorModeValue("blue.500", "blue.300");
    const hoverBg = useColorModeValue("gray.100", "gray.600");
    const dividerColor = useColorModeValue("gray.200", "gray.700");
    const toast = useToast();
    const { isOpen, onOpen, onClose } = useDisclosure();
    
    // Function to check if a study session has passed its scheduled time
    const checkSessionCompletion = (sessionDate) => {
      // Parse the session date (format: "June 10, 5 PM")
      const [monthDay, time] = sessionDate.split(", ");
      const [month, day] = monthDay.split(" ");
      
      // Create date object for the session
      const months = { "January": 0, "February": 1, "March": 2, "April": 3, "May": 4, "June": 5, 
                      "July": 6, "August": 7, "September": 8, "October": 9, "November": 10, "December": 11 };
      
      const sessionYear = 2025; // Assuming current year
      const sessionMonth = months[month];
      const sessionDay = parseInt(day);
      
      const sessionDateTime = new Date(sessionYear, sessionMonth, sessionDay);
      const currentDate = new Date();
      
      // Session is complete if its date/time has passed
      return currentDate > sessionDateTime;
    };
    
    // State for search and filters
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedSubject, setSelectedSubject] = useState("All");
    const [activeTab, setActiveTab] = useState(0);
    const [isFiltersOpen, setIsFiltersOpen] = useState(false);
    
    // Check for completed sessions when component loads
    useEffect(() => {
      // Update completion status based on session date
      const updatedGroups = groups.map(group => {
        // Check if any session time has passed
        const sessionPassed = group.meetings.some(meeting => checkSessionCompletion(meeting));
        return {
          ...group,
          isComplete: sessionPassed ? true : group.isComplete
        };
      });
      
      setGroups(updatedGroups);
      
      // Re-check every minute (useful if a session is ending soon)
      const interval = setInterval(() => {
        setGroups(prevGroups => 
          prevGroups.map(group => {
            const sessionPassed = group.meetings.some(meeting => checkSessionCompletion(meeting));
            return {
              ...group,
              isComplete: sessionPassed ? true : group.isComplete
            };
          })
        );
      }, 60000); // Check every minute
      
      return () => clearInterval(interval);
    }, []);
    
    // Sample study groups data
    const [groups, setGroups] = useState([
      {
        id: 1,
        name: "Digital Logic Study Group",
        course: "CS 301",
        subject: "Computer Science",
        members: 12,
        capacity: 15,
        description: "One-time problem solving session for Computer Architecture and Digital Logic Design. We focus on solving complex problems and preparing for exams.",
        meetings: ["June 5, 3 PM"],
        location: "Computer Science Building, Room 105",
        isOnline: false,
        isComplete: false,
        tags: ["Programming", "Computer Architecture", "Digital Logic"],
        leader: { id: 1, name: "Alex Johnson", avatar: "https://via.placeholder.com/150" },
        isJoined: false
      },
      {
        id: 2,
        name: "Linear Algebra Masters",
        course: "MATH 202",
        subject: "Mathematics",
        members: 8,
        capacity: 12,
        description: "Collaborative learning group for matrix operations, vector spaces, and linear transformations. We work on problem sets together and discuss challenging concepts.",
        meetings: ["June 15, 10 AM"],
        location: "Mathematics Building, Room 203",
        isOnline: false,
        isComplete: false,
        tags: ["Linear Algebra", "Matrices", "Vector Spaces"],
        leader: { id: 4, name: "Emily Wilson", avatar: "https://via.placeholder.com/150" },
        isJoined: false
      },
      {
        id: 3,
        name: "Organic Chemistry Lab Prep",
        course: "CHEM 241",
        subject: "Chemistry",
        members: 10,
        capacity: 15,
        description: "Preparation for organic chemistry lab experiments. We go over lab procedures, safety protocols, and expected results to ensure everyone is well-prepared.",
        meetings: ["May 29, 2 PM"],
        location: "Chemistry Building, Lab 3",
        isOnline: false,
        isComplete: true, // Past session - already completed
        tags: ["Organic Chemistry", "Lab Preparation", "Chemistry"],
        leader: { id: 6, name: "Sarah Lee", avatar: "https://via.placeholder.com/150" },
        isJoined: false
      },
      {
        id: 4,
        name: "World History Discussion",
        course: "HIST 101",
        subject: "History",
        members: 15,
        capacity: 20,
        description: "One-time discussion about world history topics, focusing on analyzing historical events and their impact on modern society.",
        meetings: ["June 2, 4 PM"],
        location: "Online",
        isOnline: true,
        isComplete: false,
        tags: ["World History", "Historical Analysis", "Discussions"],
        leader: { id: 8, name: "Daniel Taylor", avatar: "https://via.placeholder.com/150" },
        isJoined: true
      },
      {
        id: 5,
        name: "Calculus II Problem Solvers",
        course: "MATH 152",
        subject: "Mathematics",
        members: 12,
        capacity: 15,
        description: "Working through challenging calculus problems together, focusing on integration techniques, sequences, and series.",
        meetings: ["June 10, 5 PM"],
        location: "Mathematics Building, Room 105",
        isOnline: false,
        isComplete: false,
        tags: ["Calculus", "Integration", "Series"],
        leader: { id: 10, name: "Ryan Johnson", avatar: "https://via.placeholder.com/150" },
        isJoined: false
      }
    ]);
    
    // Subjects for filtering
    const subjects = ["All", "Computer Science", "Mathematics", "Chemistry", "Biology", "Physics", "Engineering", "History", "Literature", "Psychology"];
  
    // Handle search input
  const handleSearchChange = (e) => setSearchTerm(e.target.value);
  
  // Handle subject filter change
  const handleSubjectChange = (subject) => setSelectedSubject(subject);
  
  // Toggle joining a group (prevents joining completed sessions)
  const handleJoinGroup = (id) => {
    const selectedGroup = groups.find(group => group.id === id);
    const isCurrentlyJoined = selectedGroup.isJoined;
    
    // If trying to join (not leave) a completed session, show error and don't allow
    if (!isCurrentlyJoined && selectedGroup.isComplete) {
      toast({
        title: "Cannot join completed session",
        description: `${selectedGroup.name} has already been completed and cannot be joined.`,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top"
      });
      return; // Exit without joining
    }
    
    // Proceed with joining/leaving if not trying to join a completed session
    setGroups(groups.map(group => 
      group.id === id ? { 
        ...group, 
        isJoined: !group.isJoined, 
        members: group.isJoined ? group.members - 1 : group.members + 1
        // Note: No longer marking as complete when joining
        // Completion is determined by session time passing
      } : group
    ));
    
    toast({
      title: isCurrentlyJoined ? "Left study group" : "Joined study session",
      description: isCurrentlyJoined 
        ? `You have left ${selectedGroup.name}` 
        : `You have joined ${selectedGroup.name}`,
      status: isCurrentlyJoined ? "info" : "success",
      duration: 5000,
      isClosable: true,
      position: "top"
    });
  };
  
  // Filter groups based on search and filters
  const filteredGroups = groups.filter(group => {
    const matchesSearch = searchTerm === "" || 
      group.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      group.course.toLowerCase().includes(searchTerm.toLowerCase()) || 
      group.description.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesSubject = selectedSubject === "All" || group.subject === selectedSubject;
    
    return matchesSearch && matchesSubject;
  });
  
  // Filter for "My Groups" tab
  const myGroups = groups.filter(group => group.isJoined);
  
  // Form state for creating a new group
  const [newGroup, setNewGroup] = useState({
    name: "",
    course: "",
    subject: "Computer Science",
    description: "",
    meetings: "",
    location: "",
    isOnline: false,  // Default to on-site
    isComplete: false // Track if the study group has been completed
  });

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewGroup({ ...newGroup, [name]: value });
  };

  // Handle form submission
  const handleCreateGroup = () => {
    // Create a new group with the form data
    const group = {
      id: groups.length + 1,
      name: newGroup.name,
      course: newGroup.course,
      subject: newGroup.subject,
      members: 1, // Start with just the creator
      capacity: 15,
      description: newGroup.description,
      meetings: newGroup.meetings.split(",").map(m => m.trim()),
      location: newGroup.isOnline ? "Online" : newGroup.location,
      isOnline: newGroup.isOnline,
      isComplete: false, // One-time study group that will be marked complete after attended
      tags: [newGroup.subject], // Initial tag based on subject
      leader: { id: 1, name: "Current User", avatar: "https://via.placeholder.com/150" },
      isJoined: true // Creator is automatically joined
    };

    // Add the new group to the list
    setGroups([...groups, group]);

    // Show success message
    toast({
      title: "Study group created",
      description: `Your group "${group.name}" has been created successfully`,
      status: "success",
      duration: 5000,
      isClosable: true,
      position: "top"
    });

    // Reset form and close modal
    setNewGroup({
      name: "",
      course: "",
      subject: "Computer Science",
      description: "",
      meetings: "",
      location: "",
      isOnline: false,
      isComplete: false
    });
    onClose();
  };

  return (
    <Flex minH="100vh" p={{ base: 4, md: 8 }} bg={useColorModeValue("gray.50", "gray.800")}>
      <Box maxW="container.lg" mx="auto" w="full">
        {/* Header */}
        <Flex justify="space-between" align="center" mb={6}>
          <HStack spacing={4}>
            <IconButton
              icon={<FiArrowLeft />}
              aria-label="Go back"
              onClick={() => navigate(-1)}
              variant="ghost"
              borderRadius="full"
            />
            <Heading size="xl" color={textColor} fontWeight="700" >
              Study Groups
            </Heading>
          </HStack>
          <Button 
            leftIcon={<FiPlus />} 
            colorScheme="blue" 
            onClick={onOpen}
            borderRadius="full"
          >
            Create Group
          </Button>
        </Flex>
        
        {/* Tabs and Controls */}
        <Tabs colorScheme="blue" mb={6} variant="soft-rounded" index={activeTab} onChange={setActiveTab}>
          <Flex 
            justify="space-between" 
            align="center" 
            direction={{ base: "column", md: "row" }}
            gap={4}
            mb={4}
          >
            <TabList>
              <Tab>All Groups</Tab>
              <Tab>My Groups</Tab>
            </TabList>
          </Flex>
          
          {/* Search and Filters */}
          <Flex direction="column" gap={4} mb={6}>
            <Flex direction={{ base: "column", md: "row" }} gap={4} align="center">
              {/* Search Bar */}
              <InputGroup maxW={{ base: "full", md: "400px" }} flexShrink={0}>
                <InputLeftElement pointerEvents="none">
                  <FiSearch color={mutedText} />
                </InputLeftElement>
                <Input
                  placeholder="Search study sessions..."
                  size="md"
                  borderRadius="lg"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  _focus={{
                    borderColor: accentColor,
                    boxShadow: `0 0 0 1px ${accentColor}`,
                  }}
                  bg={useColorModeValue("white", "gray.700")}
                />
              </InputGroup>

              {/* Toggle Filters Button */}
              <Button 
                size="md"
                variant={selectedSubject !== 'All' ? 'solid' : 'outline'}
                colorScheme={selectedSubject !== 'All' ? 'blue' : 'gray'}
                leftIcon={<FiFilter />}
                rightIcon={isFiltersOpen ? <FiChevronUp /> : <FiChevronUp style={{ transform: 'rotate(180deg)' }} />}
                onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                borderRadius="lg"
                px={4}
                _hover={{
                  transform: 'translateY(-1px)',
                  boxShadow: 'sm'
                }}
                transition="all 0.2s"
              >
                {selectedSubject !== 'All' ? `Filtered: ${selectedSubject}` : 'Filters'}
                {selectedSubject !== 'All' && (
                  <Box
                    as="span"
                    ml={2}
                    bg={useColorModeValue('white', 'gray.800')}
                    color={useColorModeValue('blue.500', 'blue.200')}
                    borderRadius="full"
                    px={2}
                    py={0.5}
                    fontSize="xs"
                    fontWeight="bold"
                  >
                    {selectedSubject}
                  </Box>
                )}
              </Button>
            </Flex>
            
            {/* Collapsible Filters */}
            <Collapse in={isFiltersOpen} animateOpacity>
              <Box 
                mt={2}
                p={5}
                bg={useColorModeValue("white", "gray.700")}
                borderRadius="lg"
                boxShadow="sm"
                borderWidth="1px"
                borderColor={useColorModeValue("gray.200", "gray.600")}
              >
                <Text 
                  fontSize="sm" 
                  fontWeight="semibold" 
                  mb={4} 
                  color={mutedText}
                  textTransform="uppercase"
                  letterSpacing="wider"
                >
                  Filter by Subject
                </Text>
                <Wrap spacing={3}>
                  {subjects.map((subject) => (
                    <WrapItem key={subject}>
                      <Tag 
                        size="md"
                        variant={subject === selectedSubject ? "solid" : "outline"}
                        colorScheme={subject === selectedSubject ? "blue" : "gray"}
                        borderRadius="full"
                        cursor="pointer"
                        py={1.5}
                        px={4}
                        onClick={() => handleSubjectChange(subject)}
                        _hover={{
                          transform: 'translateY(-1px)',
                          boxShadow: 'sm',
                          bg: subject === selectedSubject 
                            ? useColorModeValue("blue.500", "blue.400")
                            : useColorModeValue("gray.50", "gray.600")
                        }}
                        transition="all 0.2s"
                        borderWidth={subject === selectedSubject ? 0 : '1px'}
                      >
                        {subject === "All" && <TagLeftIcon as={FiCheck} />}
                        <TagLabel>{subject}</TagLabel>
                      </Tag>
                    </WrapItem>
                  ))}
                </Wrap>
              </Box>
            </Collapse>
          </Flex>
          
          <TabPanels>
            {/* All Groups Tab */}
            <TabPanel px={0}>
              {filteredGroups.length > 0 ? (
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                  {filteredGroups.map(group => (
                    <MotionCard
                      key={group.id}
                      bg={cardBg}
                      boxShadow="md"
                      borderRadius="lg"
                      overflow="hidden"
                      whileHover={{ y: -5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <CardHeader>
                        <Flex justify="space-between" align="center">
                          <Heading size="md" color={textColor}>{group.name}</Heading>
                          <Tag colorScheme="blue">{group.course}</Tag>
                        </Flex>
                      </CardHeader>
                      
                      <CardBody>
                        <Text color={textColor} mb={3} noOfLines={2}>
                          {group.description}
                        </Text>
                        
                        <HStack spacing={2} mb={4} flexWrap="wrap">
                          {group.tags.map((tag, index) => (
                            <Tag key={index} size="sm" colorScheme="gray" borderRadius="full">
                              {tag}
                            </Tag>
                          ))}
                        </HStack>
                        
                        <Divider my={4} borderColor={dividerColor} />
                        
                        <Stack spacing={3}>
                          <Flex align="center" color={mutedText}>
                            <FiUsers style={{ marginRight: "8px" }} />
                            <Text>{group.members} / {group.capacity} Members</Text>
                          </Flex>
                          <Flex align="center" color={mutedText}>
                            <FiClock style={{ marginRight: "8px" }} />
                            <Text>Session: {group.meetings.join(", ")}</Text>
                          </Flex>
                          <Flex align="center" color={mutedText}>
                            {group.isOnline ? (
                              <FiVideo style={{ marginRight: "8px" }} />
                            ) : (
                              <FiMapPin style={{ marginRight: "8px" }} />
                            )}
                            <Text noOfLines={1}>{group.location}</Text>
                          </Flex>
                          {group.isComplete && (
                            <Flex align="center" color="green.500">
                              <FiCheckCircle style={{ marginRight: "8px" }} />
                              <Text>Completed</Text>
                            </Flex>
                          )}
                        </Stack>
                      </CardBody>
                      
                      <CardFooter 
                        pt={0}
                        borderTop="1px solid"
                        borderColor={dividerColor}
                      >
                        <Flex justify="space-between" align="center" w="full">
                          <Button
                            as={Link}
                            to={`/study-groups/${group.id}`}
                            rightIcon={<FiArrowRight />}
                            variant="ghost"
                            size="sm"
                            borderRadius="full"
                            _hover={{ bg: hoverBg }}
                          >
                            View Details
                          </Button>
                          
                          <Button 
                            colorScheme={group.isJoined ? "red" : group.isComplete ? "gray" : "blue"}
                            variant={group.isJoined ? "outline" : "solid"}
                            size="sm"
                            borderRadius="full"
                            onClick={() => handleJoinGroup(group.id)}
                            leftIcon={group.isJoined ? undefined : <FiPlus />}
                            isDisabled={!group.isJoined && group.isComplete}
                            _hover={{
                              opacity: !group.isJoined && group.isComplete ? 1 : 0.9
                            }}
                          >
                            {group.isJoined ? "Leave Group" : group.isComplete ? "Completed" : "Join Group"}
                          </Button>
                        </Flex>
                      </CardFooter>
                    </MotionCard>
                  ))}
                </SimpleGrid>
              ) : (
                <Flex direction="column" align="center" justify="center" py={10}>
                  <Box textAlign="center" maxW="400px">
                    <FiBook size={50} style={{ margin: '0 auto 20px', opacity: 0.3 }} />
                    <Heading size="md" mb={2}>No study groups found</Heading>
                    <Text color={mutedText} mb={6}>
                      Try changing your search terms or filters
                    </Text>
                  </Box>
                </Flex>
              )}
            </TabPanel>
            
            {/* My Groups Tab */}
            <TabPanel px={0}>
              {myGroups.length > 0 ? (
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                  {myGroups.map(group => (
                    <MotionCard
                      key={group.id}
                      bg={cardBg}
                      boxShadow="md"
                      borderRadius="lg"
                      overflow="hidden"
                      whileHover={{ y: -5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <CardHeader>
                        <Flex justify="space-between" align="center">
                          <Heading size="md" color={textColor}>{group.name}</Heading>
                          <Tag colorScheme="blue">{group.course}</Tag>
                        </Flex>
                      </CardHeader>
                      
                      <CardBody>
                        <Text color={textColor} mb={3} noOfLines={2}>
                          {group.description}
                        </Text>
                        
                        <HStack spacing={2} mb={4} flexWrap="wrap">
                          {group.tags.map((tag, index) => (
                            <Tag key={index} size="sm" colorScheme="gray" borderRadius="full">
                              {tag}
                            </Tag>
                          ))}
                        </HStack>
                        
                        <Divider my={4} borderColor={dividerColor} />
                        
                        <Stack spacing={3}>
                          <Flex align="center" color={mutedText}>
                            <FiUsers style={{ marginRight: "8px" }} />
                            <Text>{group.members} / {group.capacity} Members</Text>
                          </Flex>
                          <Flex align="center" color={mutedText}>
                            <FiClock style={{ marginRight: "8px" }} />
                            <Text>Session: {group.meetings.join(", ")}</Text>
                          </Flex>
                          <Flex align="center" color={mutedText}>
                            {group.isOnline ? (
                              <FiVideo style={{ marginRight: "8px" }} />
                            ) : (
                              <FiMapPin style={{ marginRight: "8px" }} />
                            )}
                            <Text noOfLines={1}>{group.location}</Text>
                          </Flex>
                          {group.isComplete && (
                            <Flex align="center" color="green.500">
                              <FiCheckCircle style={{ marginRight: "8px" }} />
                              <Text>Completed</Text>
                            </Flex>
                          )}
                        </Stack>
                      </CardBody>
                      
                      <CardFooter 
                        pt={0}
                        borderTop="1px solid"
                        borderColor={dividerColor}
                      >
                        <Flex justify="space-between" align="center" w="full">
                          <Button
                            as={Link}
                            to={`/study-groups/${group.id}`}
                            rightIcon={<FiArrowRight />}
                            variant="ghost"
                            size="sm"
                            borderRadius="full"
                            _hover={{ bg: hoverBg }}
                          >
                            View Details
                          </Button>
                          
                          <Button 
                            colorScheme="red"
                            variant="outline"
                            size="sm"
                            borderRadius="full"
                            onClick={() => handleJoinGroup(group.id)}
                          >
                            Leave Group
                          </Button>
                        </Flex>
                      </CardFooter>
                    </MotionCard>
                  ))}
                </SimpleGrid>
              ) : (
                <Flex direction="column" align="center" justify="center" py={10}>
                  <Box textAlign="center" maxW="400px">
                    <FiUsers size={50} style={{ margin: '0 auto 20px', opacity: 0.3 }} />
                    <Heading size="md" mb={2}>You haven't joined any study groups yet</Heading>
                    <Text color={mutedText} mb={6}>
                      Join a study group to collaborate with others and improve your learning
                    </Text>
                  </Box>
                </Flex>
              )}
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
      
      {/* Create Group Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent borderRadius="xl">
          <ModalHeader borderBottomWidth="1px" borderColor={dividerColor} pb={4}>
            <Heading size="md">Create a One-time Study Session</Heading>
          </ModalHeader>
          <ModalCloseButton />
          
          <ModalBody py={6}>
            <Stack spacing={5}>
              <FormControl isRequired>
                <FormLabel fontWeight="medium">Group Name</FormLabel>
                <Input 
                  name="name" 
                  value={newGroup.name} 
                  onChange={handleInputChange} 
                  placeholder="e.g., Calculus II Problem Solvers"
                  borderRadius="md"
                />
              </FormControl>
              
              <FormControl isRequired>
                <FormLabel fontWeight="medium">Course Code</FormLabel>
                <Input 
                  name="course" 
                  value={newGroup.course} 
                  onChange={handleInputChange} 
                  placeholder="e.g., MATH 152"
                  borderRadius="md"
                />
              </FormControl>
              
              <FormControl isRequired>
                <FormLabel fontWeight="medium">Subject</FormLabel>
                <Select 
                  name="subject" 
                  value={newGroup.subject} 
                  onChange={handleInputChange}
                  borderRadius="md"
                >
                  {subjects.filter(s => s !== "All").map((subject) => (
                    <option key={subject} value={subject}>{subject}</option>
                  ))}
                </Select>
              </FormControl>
              
              <FormControl isRequired>
                <FormLabel fontWeight="medium">Description</FormLabel>
                <Textarea 
                  name="description" 
                  value={newGroup.description} 
                  onChange={handleInputChange} 
                  placeholder="Describe the purpose, goals, and activities of your study group..."
                  borderRadius="md"
                  minHeight="120px"
                />
              </FormControl>
              
              <FormControl isRequired mb={4}>
                <FormLabel fontWeight="medium">Meeting Times</FormLabel>
                <Input 
                  name="meetings" 
                  value={newGroup.meetings} 
                  onChange={handleInputChange} 
                  placeholder="e.g., May 15, 5 PM"
                  borderRadius="md"
                />
                <Text fontSize="sm" color={mutedText} mt={1}>
                  One-time study session date and time
                </Text>
              </FormControl>

              <FormControl display="flex" alignItems="center" mb={4}>
                <FormLabel htmlFor="is-online" mb="0" fontWeight="medium">
                  Online Meeting?
                </FormLabel>
                <Switch 
                  id="is-online" 
                  colorScheme="blue"
                  isChecked={newGroup.isOnline}
                  onChange={(e) => setNewGroup({ ...newGroup, isOnline: e.target.checked })}
                />
              </FormControl>
              
              {!newGroup.isOnline && (
                <FormControl isRequired>
                  <FormLabel fontWeight="medium">Location</FormLabel>
                  <Input 
                    name="location" 
                    value={newGroup.location} 
                    onChange={handleInputChange} 
                    placeholder="e.g., Library, Room 203"
                    borderRadius="md"
                  />
                </FormControl>
              )}
            </Stack>
          </ModalBody>
          
          <ModalFooter borderTopWidth="1px" borderColor={dividerColor} pt={4}>
            <Button variant="ghost" mr={3} onClick={onClose} borderRadius="md">
              Cancel
            </Button>
            <Button 
              colorScheme="blue" 
              leftIcon={<FiCheck />} 
              onClick={handleCreateGroup}
              isDisabled={!newGroup.name || !newGroup.course || !newGroup.description || !newGroup.meetings || (!newGroup.isOnline && !newGroup.location)}
              borderRadius="md"
            >
              Create Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      
    </Flex>
  );
  
};

export default StudyGroupsPage;