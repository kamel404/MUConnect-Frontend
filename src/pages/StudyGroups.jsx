import {
  Flex, Box, Heading, Text, Button, Card, CardHeader, CardBody, CardFooter,
  useColorModeValue, Tag, Input, InputGroup, InputLeftElement, Divider,
  Tabs, TabList, TabPanels, Tab, TabPanel, HStack, Modal, ModalOverlay,
  ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton,
  FormControl, FormLabel, Textarea, Select, useDisclosure, useToast,
  SimpleGrid, Skeleton, SkeletonText, Stack, Collapse, IconButton,Switch 
} from "@chakra-ui/react";
import { 
  FiSearch, FiPlus, FiUsers, FiClock, FiMapPin, FiBook, 
  FiCalendar, FiArrowRight, FiCheck, FiVideo, FiCheckCircle, 
  FiFilter, FiChevronUp, FiArrowLeft, FiX
} from "react-icons/fi";
import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  fetchStudyGroups, createStudyGroup, joinStudyGroup, 
  leaveStudyGroup, fetchMyStudyGroups 
} from '../services/studyGroupService';
import { fetchCourses } from '../services/courseService';

const MotionCard = motion(Card);

// Helper functions outside component
const getCourseLabel = (course, courses) => {
  if (!course) return "Unknown Course";
  if (typeof course === "string") return course;
  if (course.code) return `${course.code}`;
  
  // Find in courses array if course is an ID
  const found = courses.find(c => c.id === course);
  return found ? `${found.code} - ${found.title}` : "Unknown Course";
};

const formatMeetingTime = (dateString) => {
  if (!dateString) return "TBD";
  const date = new Date(dateString);
  return date.toLocaleString("en-US", { 
    month: "short", 
    day: "numeric", 
    hour: "2-digit", 
    minute: "2-digit" 
  });
};

const StudyGroupsPage = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  
  // Theme colors
  const cardBg = useColorModeValue("white", "gray.700");
  const textColor = useColorModeValue("gray.800", "white");
  const mutedText = useColorModeValue("gray.500", "gray.400");
  const accentColor = useColorModeValue("blue.500", "blue.300");
  const hoverBg = useColorModeValue("gray.100", "gray.600");
  const dividerColor = useColorModeValue("gray.200", "gray.700");
  
  // State management
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState(0);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [groups, setGroups] = useState([]);
  const [myGroups, setMyGroups] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [myGroupsLoading, setMyGroupsLoading] = useState(false);
  
  // Form state
  const [newGroup, setNewGroup] = useState({
    name: "",
    course_id: "",
    description: "",
    meeting_time: "",
    location: "",
    isOnline: false,
  });

  // Fetch data on mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setMyGroupsLoading(true);
      try {
        // Get user info from localStorage
        const major_id = localStorage.getItem('major_id');
        const faculty_id = localStorage.getItem('faculty_id');
        // Fetch study groups filtered by major or faculty
        let groupParams = {};
        if (major_id) groupParams.major_id = major_id;
        else if (faculty_id) groupParams.faculty_id = faculty_id;
        const [allGroupsRes, myGroupsRes, coursesRes] = await Promise.all([
          fetchStudyGroups(groupParams),
          fetchMyStudyGroups(),
          fetchCourses(major_id ? { major_id } : faculty_id ? { faculty_id } : {})
        ]);
        setCourses(coursesRes);
        // Process groups
        const processGroup = (group) => ({
          ...group,
          meetings: group.meeting_time ? [group.meeting_time] : [],
          members: group.members_count || 1,
          tags: group.major ? [group.major.name] : [],
          leader: group.creator || {},
          course: getCourseLabel(group.course, coursesRes),
          formattedTime: formatMeetingTime(group.meeting_time),
          isPast: group.meeting_time ? new Date(group.meeting_time) < new Date() : false
        });
        setGroups(allGroupsRes.data.map(processGroup));
        // Create set of joined group IDs
        const joinedIds = new Set(
          (Array.isArray(myGroupsRes)
            ? myGroupsRes
            : myGroupsRes.data || []
          ).map(g => g.id)
        );
        setGroups(prev => prev.map(g => ({
          ...g,
          isJoined: joinedIds.has(g.id)
        })));
        setMyGroups(
          (Array.isArray(myGroupsRes)
            ? myGroupsRes
            : myGroupsRes.data || []
          ).map(processGroup)
        );
      } catch (error) {
        showErrorToast('Failed to load data', error);
      } finally {
        setLoading(false);
        setMyGroupsLoading(false);
      }
    };
    fetchData();
  }, []);

  // Toast helper
  const showErrorToast = (title, error) => {
    toast({
      title,
      description: error?.response?.data?.message || error.message || "Unknown error",
      status: "error",
      duration: 4000,
      isClosable: true
    });
  };

  // Filter groups based on search term
  const filteredGroups = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return groups.filter(group => 
      group.name.toLowerCase().includes(term) || 
      group.course.toLowerCase().includes(term) || 
      group.description.toLowerCase().includes(term)
    );
  }, [groups, searchTerm]);

  const myGroupsFiltered = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return myGroups.filter(group => 
      group.name.toLowerCase().includes(term) || 
      group.course.toLowerCase().includes(term) || 
      group.description.toLowerCase().includes(term)
    );
  }, [myGroups, searchTerm]);

  // API call handlers
  const handleJoinGroup = useCallback(async (id) => {
    try {
      const group = groups.find(g => g.id === id);
      if (group.isPast) {
        toast({
          title: "Cannot join past session",
          status: "error",
          duration: 3000
        });
        return;
      }
      await joinStudyGroup(id);
      // Always refresh user's groups after join
      setMyGroupsLoading(true);
      const myGroupsRes = await fetchMyStudyGroups();
      const joinedIds = new Set(
        (Array.isArray(myGroupsRes)
          ? myGroupsRes
          : myGroupsRes.data || []
        ).map(g => g.id)
      );
      setGroups(prev => prev.map(g => ({
        ...g,
        isJoined: joinedIds.has(g.id)
      })));
      setMyGroups(
        (Array.isArray(myGroupsRes)
          ? myGroupsRes
          : myGroupsRes.data || []
        ).map(g => ({
          ...g,
          meetings: g.meeting_time ? [g.meeting_time] : [],
          members: g.members_count || 1,
          tags: g.major ? [g.major.name] : [],
          leader: g.creator || {},
          course: getCourseLabel(g.course, courses),
          formattedTime: formatMeetingTime(g.meeting_time),
          isPast: g.meeting_time ? new Date(g.meeting_time) < new Date() : false,
          isJoined: true
        }))
      );
      setMyGroupsLoading(false);
      toast({ title: `Joined ${group.name}`, status: "success" });
    } catch (error) {
      showErrorToast("Failed to join group", error);
      setMyGroupsLoading(false);
    }
  }, [groups, courses]);

  const handleLeaveGroup = useCallback(async (id) => {
    try {
      const response = await leaveStudyGroup(id);
      setLoading(true);
      setMyGroupsLoading(true);
      // Always refresh groups and myGroups after leave
      const major_id = localStorage.getItem('major_id');
      const faculty_id = localStorage.getItem('faculty_id');
      let groupParams = {};
      if (major_id) groupParams.major_id = major_id;
      else if (faculty_id) groupParams.faculty_id = faculty_id;
      const [allGroupsRes, myGroupsRes] = await Promise.all([
        fetchStudyGroups(groupParams),
        fetchMyStudyGroups()
      ]);
      const processGroup = (group) => ({
        ...group,
        meetings: group.meeting_time ? [group.meeting_time] : [],
        members: group.members_count || 1,
        tags: group.major ? [group.major.name] : [],
        leader: group.creator || {},
        course: getCourseLabel(group.course, courses),
        formattedTime: formatMeetingTime(group.meeting_time),
        isPast: group.meeting_time ? new Date(group.meeting_time) < new Date() : false
      });
      setGroups(allGroupsRes.data.map(processGroup));
      setMyGroups((Array.isArray(myGroupsRes) ? myGroupsRes : myGroupsRes.data || []).map(processGroup));
      setLoading(false);
      setMyGroupsLoading(false);
      if (response && response.message && response.message.includes('The group has been deleted')) {
        toast({
          title: 'Group deleted',
          description: response.message,
          status: 'info',
          duration: 4000
        });
      } else {
        toast({
          title: 'Left group',
          description: response?.message || undefined,
          status: 'info',
          duration: 3000
        });
      }
    } catch (error) {
      showErrorToast('Failed to leave group', error);
      setLoading(false);
      setMyGroupsLoading(false);
    }
  }, [courses]);

  const handleCreateGroup = useCallback(async () => {
    try {
      // Get major_id and faculty_id from localStorage
      const major_id = localStorage.getItem('major_id');
      const faculty_id = localStorage.getItem('faculty_id');
      if (!major_id || !faculty_id) {
        toast({
          title: "Missing Profile Information",
          description: "Please complete your profile (major and faculty) before creating a group.",
          status: "error",
          duration: 4000,
        });
        return;
      }
      const payload = {
        ...newGroup,
        course_id: parseInt(newGroup.course_id),
        meeting_time: newGroup.meeting_time,
        capacity: 15,
        is_online: newGroup.isOnline,
        location: newGroup.isOnline ? "Online" : newGroup.location,
        major_id: parseInt(major_id),
        faculty_id: parseInt(faculty_id),
      };
      const createdGroup = await createStudyGroup(payload);
      toast({ title: "Group created!", status: "success" });
      onClose();
      setNewGroup({
        name: "",
        course_id: "",
        description: "",
        meeting_time: "",
        location: "",
        isOnline: false
      });
      const processedGroup = {
        ...createdGroup,
        meetings: [createdGroup.meeting_time],
        formattedTime: formatMeetingTime(createdGroup.meeting_time),
        isPast: createdGroup.meeting_time ? new Date(createdGroup.meeting_time) < new Date() : false,
        isJoined: true,
        members: 1,
        course: getCourseLabel(createdGroup.course, courses)
      };
      setGroups(prev => [processedGroup, ...prev]);
      setMyGroups(prev => [processedGroup, ...prev]);
    } catch (error) {
      showErrorToast("Failed to create group", error);
    }
  }, [newGroup, courses]);

  // Input handlers
  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setNewGroup(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleToggleOnline = useCallback(() => {
    setNewGroup(prev => ({ ...prev, isOnline: !prev.isOnline }));
  }, []);

  // Render components
  const renderGroupCards = (groupList, isMyGroups = false) => (
    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
      {groupList.map(group => (
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
              <Heading size="md" color={textColor} noOfLines={1}>
                {group.name}
              </Heading>
              <Tag colorScheme="blue" noOfLines={1}>
                {group.course}
              </Tag>
            </Flex>
          </CardHeader>
          <CardBody>
            <Text color={textColor} mb={3} noOfLines={2}>
              {group.description}
            </Text>
            <HStack spacing={2} mb={4} flexWrap="wrap">
              {(group.tags || []).map((tag, index) => (
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
                <Text>Session: {group.formattedTime}</Text>
              </Flex>
              <Flex align="center" color={mutedText}>
                {group.isOnline ? (
                  <FiVideo style={{ marginRight: "8px" }} />
                ) : (
                  <FiMapPin style={{ marginRight: "8px" }} />
                )}
                <Text noOfLines={1}>{group.location}</Text>
              </Flex>
              {group.isPast && (
                <Flex align="center" color="green.500">
                  <FiCheckCircle style={{ marginRight: "8px" }} />
                  <Text>Completed</Text>
                </Flex>
              )}
            </Stack>
          </CardBody>
          <CardFooter pt={0} borderTopWidth="1px" borderColor={dividerColor}>
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
              {isMyGroups ? (
                <Button
                  colorScheme={group.isJoined ? "red" : group.isPast ? "gray" : "blue"}
                  variant={group.isJoined ? "outline" : "solid"}
                  size="sm"
                  borderRadius="full"
                  onClick={() => group.isJoined ? handleLeaveGroup(group.id) : handleJoinGroup(group.id)}
                  isDisabled={group.isPast && !group.isJoined}
                >
                  {group.isJoined ? "Leave Group" : group.isPast ? "Completed" : "Join Group"}
                </Button>
              ) : (
                <Button
                  colorScheme={group.isJoined ? "red" : group.isPast ? "gray" : "blue"}
                  variant={group.isJoined ? "outline" : "solid"}
                  size="sm"
                  borderRadius="full"
                  onClick={() => group.isJoined ? handleLeaveGroup(group.id) : handleJoinGroup(group.id)}
                  isDisabled={group.isPast && !group.isJoined}
                >
                  {group.isJoined ? "Leave Group" : group.isPast ? "Completed" : "Join Group"}
                </Button>
              )}
            </Flex>
          </CardFooter>
        </MotionCard>
      ))}
    </SimpleGrid>
  );

  const renderEmptyState = (icon, title, description) => (
    <Flex direction="column" align="center" justify="center" py={10}>
      <Box textAlign="center" maxW="400px">
        {icon}
        <Heading size="md" mb={2}>{title}</Heading>
        <Text color={mutedText} mb={6}>{description}</Text>
        {activeTab === 0 && (
          <Button colorScheme="blue" onClick={onOpen}>
            Create Your First Group
          </Button>
        )}
      </Box>
    </Flex>
  );

  const renderSkeleton = () => (
    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
      {[...Array(4)].map((_, i) => (
        <Box key={i} p={6} bg={cardBg} borderRadius="lg" boxShadow="md">
          <Skeleton height="32px" mb={4} />
          <SkeletonText noOfLines={3} spacing="4" />
          <HStack mt={4} spacing={2}>
            <Skeleton height="24px" width="60px" />
            <Skeleton height="24px" width="60px" />
          </HStack>
          <Divider my={4} />
          <Stack spacing={3}>
            <Skeleton height="20px" />
            <Skeleton height="20px" />
            <Skeleton height="20px" />
          </Stack>
          <Divider my={4} />
          <Flex justify="space-between" mt={4}>
            <Skeleton height="32px" width="100px" />
            <Skeleton height="32px" width="100px" />
          </Flex>
        </Box>
      ))}
    </SimpleGrid>
  );

  return (
    <Flex minH="100vh" p={{ base: 4, md: 8 }} bg={useColorModeValue("gray.50", "gray.800")}>
      <Box maxW="container.lg" mx="auto" w="full">
        {/* Header */}
        <Flex justify="space-between" align="center" mb={6} flexWrap="wrap" gap={4}>
          <HStack spacing={4}>
            <IconButton
              icon={<FiArrowLeft />}
              aria-label="Go back"
              onClick={() => navigate(-1)}
              variant="ghost"
              borderRadius="full"
            />
            <Heading size="xl" color={textColor} fontWeight="700">
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
        <Tabs 
          colorScheme="blue" 
          mb={6} 
          variant="soft-rounded" 
          index={activeTab} 
          onChange={setActiveTab}
        >
          <Flex justify="space-between" align="center" gap={4} mb={4}>
            <TabList>
              <Tab>All Groups</Tab>
              <Tab>My Groups</Tab>
            </TabList>
            
            <InputGroup maxW={{ base: "full", md: "400px" }}>
              <InputLeftElement pointerEvents="none">
                <FiSearch color={mutedText} />
              </InputLeftElement>
              <Input
                placeholder="Search study sessions..."
                size="md"
                borderRadius="lg"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                _focus={{
                  borderColor: accentColor,
                  boxShadow: `0 0 0 1px ${accentColor}`,
                }}
                bg={useColorModeValue("white", "gray.700")}
              />
              {searchTerm && (
                <InputRightElement>
                  <IconButton
                    icon={<FiX />}
                    size="sm"
                    variant="ghost"
                    aria-label="Clear search"
                    onClick={() => setSearchTerm("")}
                  />
                </InputRightElement>
              )}
            </InputGroup>
          </Flex>
          
          <TabPanels>
            {/* All Groups Tab */}
            <TabPanel px={0}>
              {loading ? renderSkeleton() : 
                filteredGroups.length > 0 ? renderGroupCards(filteredGroups) : 
                renderEmptyState(
                  <FiBook size={50} style={{ margin: '0 auto 20px', opacity: 0.3 }} />,
                  "No study groups found",
                  "Try changing your search terms or create a new group"
                )
              }
            </TabPanel>
            
            {/* My Groups Tab */}
            <TabPanel px={0}>
              {myGroupsLoading ? renderSkeleton() : 
                myGroupsFiltered.length > 0 ? renderGroupCards(myGroupsFiltered, true) : 
                renderEmptyState(
                  <FiUsers size={50} style={{ margin: '0 auto 20px', opacity: 0.3 }} />,
                  "You haven't joined any groups yet",
                  "Join a study group to collaborate with others"
                )
              }
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
      
      {/* Create Group Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="lg" isCentered>
        <ModalOverlay />
        <ModalContent borderRadius="xl">
          <ModalHeader borderBottomWidth="1px" borderColor={dividerColor} pb={4}>
            <Heading size="md">Create Study Group</Heading>
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
                  placeholder="e.g., Calculus Study Group"
                  borderRadius="md"
                />
              </FormControl>
              
              <FormControl isRequired>
                <FormLabel fontWeight="medium">Course</FormLabel>
                <Select
                  name="course_id"
                  value={newGroup.course_id}
                  onChange={handleInputChange}
                  placeholder="Select course"
                  borderRadius="md"
                >
                  {courses.map(course => (
                    <option key={course.id} value={course.id}>
                      {course.code} - {course.title}
                    </option>
                  ))}
                </Select>
              </FormControl>
              
              <FormControl isRequired>
                <FormLabel fontWeight="medium">Description</FormLabel>
                <Textarea 
                  name="description" 
                  value={newGroup.description} 
                  onChange={handleInputChange} 
                  placeholder="Describe your study group..."
                  borderRadius="md"
                  minH="120px"
                />
              </FormControl>
              
              <FormControl isRequired>
                <FormLabel fontWeight="medium">Meeting Time</FormLabel>
                <Input
                  type="datetime-local"
                  name="meeting_time"
                  value={newGroup.meeting_time}
                  onChange={handleInputChange}
                  borderRadius="md"
                />
              </FormControl>

              <FormControl display="flex" alignItems="center">
                <FormLabel htmlFor="is-online" mb="0" fontWeight="medium">
                  Online Meeting?
                </FormLabel>
                <Switch 
                  id="is-online" 
                  colorScheme="blue"
                  isChecked={newGroup.isOnline}
                  onChange={handleToggleOnline}
                />
              </FormControl>
              
              {!newGroup.isOnline && (
                <FormControl isRequired>
                  <FormLabel fontWeight="medium">Location</FormLabel>
                  <Input 
                    name="location" 
                    value={newGroup.location} 
                    onChange={handleInputChange} 
                    placeholder="e.g., Library Room 203"
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
              isDisabled={
                !newGroup.name || 
                !newGroup.course_id || 
                !newGroup.description || 
                !newGroup.meeting_time ||
                (!newGroup.isOnline && !newGroup.location)
              }
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