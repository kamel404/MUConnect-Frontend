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
    SimpleGrid
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
    FiCheck 
  } from "react-icons/fi";
  import { useState } from "react";
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
    
    // State for search and filters
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedSubject, setSelectedSubject] = useState("All");
    const [activeTab, setActiveTab] = useState(0);
    
    // Sample study groups data
    const [groups, setGroups] = useState([
      {
        id: 1,
        name: "Digital Logic Study Group",
        course: "CS 301",
        subject: "Computer Science",
        members: 12,
        capacity: 15,
        active: "2h ago",
        description: "Weekly problem solving sessions for Computer Architecture and Digital Logic Design. We focus on solving complex problems and preparing for exams.",
        meetings: ["Mon 3 PM", "Wed 3 PM"],
        location: "Computer Science Building, Room 105",
        joinedMembers: [
          { id: 1, name: "Alex Johnson", avatar: "https://via.placeholder.com/150" },
          { id: 2, name: "Maria Garcia", avatar: "https://via.placeholder.com/150" },
          { id: 3, name: "David Kim", avatar: "https://via.placeholder.com/150" }
        ],
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
        active: "5h ago",
        description: "Collaborative learning group for matrix operations, vector spaces, and linear transformations. We work on problem sets together and discuss challenging concepts.",
        meetings: ["Tue 10 AM", "Thu 10 AM"],
        location: "Mathematics Building, Room 203",
        joinedMembers: [
          { id: 4, name: "Emily Wilson", avatar: "https://via.placeholder.com/150" },
          { id: 5, name: "James Moore", avatar: "https://via.placeholder.com/150" }
        ],
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
        active: "1d ago",
        description: "Preparation for organic chemistry lab experiments. We go over lab procedures, safety protocols, and expected results to ensure everyone is well-prepared.",
        meetings: ["Fri 2 PM"],
        location: "Chemistry Building, Lab 3",
        joinedMembers: [
          { id: 6, name: "Sarah Lee", avatar: "https://via.placeholder.com/150" },
          { id: 7, name: "Michael Brown", avatar: "https://via.placeholder.com/150" }
        ],
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
        active: "3h ago",
        description: "Weekly discussions about world history topics, focusing on analyzing historical events and their impact on modern society.",
        meetings: ["Wed 4 PM"],
        location: "History Department, Room 210",
        joinedMembers: [
          { id: 8, name: "Daniel Taylor", avatar: "https://via.placeholder.com/150" },
          { id: 9, name: "Sophia Martinez", avatar: "https://via.placeholder.com/150" }
        ],
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
        active: "1h ago",
        description: "Working through challenging calculus problems together, focusing on integration techniques, sequences, and series.",
        meetings: ["Mon 5 PM", "Thu 5 PM"],
        location: "Mathematics Building, Room 105",
        joinedMembers: [
          { id: 10, name: "Ryan Johnson", avatar: "https://via.placeholder.com/150" },
          { id: 11, name: "Emma Davis", avatar: "https://via.placeholder.com/150" }
        ],
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
  
  // Toggle joining a group
  const handleJoinGroup = (id) => {
    setGroups(groups.map(group => 
      group.id === id ? { ...group, isJoined: !group.isJoined, members: group.isJoined ? group.members - 1 : group.members + 1 } : group
    ));
    
    const selectedGroup = groups.find(group => group.id === id);
    const isCurrentlyJoined = selectedGroup.isJoined;
    
    toast({
      title: isCurrentlyJoined ? "Left study group" : "Joined study group",
      description: isCurrentlyJoined ? `You have left ${selectedGroup.name}` : `You have joined ${selectedGroup.name}`,
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
    location: ""
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
      active: "Just now",
      description: newGroup.description,
      meetings: newGroup.meetings.split(",").map(m => m.trim()),
      location: newGroup.location,
      joinedMembers: [], // Empty initially
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
      location: ""
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
            
            <HStack spacing={4}>
              <InputGroup maxW="250px">
                <InputLeftElement pointerEvents="none">
                  <FiSearch color={mutedText} />
                </InputLeftElement>
                <Input
                  placeholder="Search groups..."
                  size="sm"
                  borderRadius="full"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  _focus={{
                    boxShadow: `0 0 0 2px ${accentColor}`,
                  }}
                />
              </InputGroup>
            </HStack>
          </Flex>
          
          {/* Subject Tags */}
          <Wrap spacing={3} mb={6}>
            {subjects.map((subject) => (
              <WrapItem key={subject}>
                <Tag 
                  size="md" 
                  variant={subject === selectedSubject ? "solid" : "subtle"} 
                  colorScheme={subject === selectedSubject ? "blue" : "gray"}
                  borderRadius="full"
                  cursor="pointer"
                  onClick={() => handleSubjectChange(subject)}
                  _hover={{ opacity: 0.8 }}
                >
                  <TagLabel>{subject}</TagLabel>
                </Tag>
              </WrapItem>
            ))}
          </Wrap>
          
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
                            <Text>Meetings: {group.meetings.join(", ")}</Text>
                          </Flex>
                          <Flex align="center" color={mutedText}>
                            <FiMapPin style={{ marginRight: "8px" }} />
                            <Text noOfLines={1}>{group.location}</Text>
                          </Flex>
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
                            colorScheme={group.isJoined ? "red" : "blue"}
                            variant={group.isJoined ? "outline" : "solid"}
                            size="sm"
                            borderRadius="full"
                            onClick={() => handleJoinGroup(group.id)}
                            leftIcon={group.isJoined ? undefined : <FiPlus />}
                          >
                            {group.isJoined ? "Leave Group" : "Join Group"}
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
                            <Text>Meetings: {group.meetings.join(", ")}</Text>
                          </Flex>
                          <Flex align="center" color={mutedText}>
                            <FiMapPin style={{ marginRight: "8px" }} />
                            <Text noOfLines={1}>{group.location}</Text>
                          </Flex>
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
            <Heading size="md">Create a New Study Group</Heading>
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
              
              <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={4}>
                <FormControl isRequired>
                  <FormLabel fontWeight="medium">Meeting Times</FormLabel>
                  <Input 
                    name="meetings" 
                    value={newGroup.meetings} 
                    onChange={handleInputChange} 
                    placeholder="e.g., Mon 5 PM, Thu 5 PM"
                    borderRadius="md"
                  />
                  <Text fontSize="sm" color={mutedText} mt={1}>
                    Separate multiple meeting times with commas
                  </Text>
                </FormControl>
                
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
              </Grid>
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
              isDisabled={!newGroup.name || !newGroup.course || !newGroup.description || !newGroup.meetings || !newGroup.location}
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