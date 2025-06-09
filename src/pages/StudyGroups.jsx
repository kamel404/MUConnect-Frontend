import {
  Flex, Box, Heading, Text, Button, Card, CardHeader, CardBody, CardFooter,
  useColorModeValue, Tag, Input, InputGroup, InputLeftElement, Divider,
  Tabs, TabList, TabPanels, Tab, TabPanel, HStack, Modal, ModalOverlay,
  ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton,
  FormControl, FormLabel, Textarea, Select, useDisclosure, useToast,
  SimpleGrid, Skeleton, SkeletonText, Stack, Collapse, IconButton,Switch,
  AlertDialog, AlertDialogBody, AlertDialogFooter, AlertDialogHeader,
  AlertDialogContent, AlertDialogOverlay
} from "@chakra-ui/react";
import { 
  FiSearch, FiPlus, FiUsers, FiClock, FiMapPin, FiBook, 
  FiCalendar, FiArrowRight, FiCheck, FiVideo, FiCheckCircle, 
  FiFilter, FiChevronUp, FiArrowLeft, FiX
} from "react-icons/fi";
import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from '../context/AuthContext';
import { 
  fetchStudyGroups, createStudyGroup, joinStudyGroup, 
  leaveStudyGroup, fetchMyStudyGroups, updateStudyGroup, deleteStudyGroup
} from '../services/studyGroupService';
import { fetchCourses } from '../services/courseService';
import StudyGroupList from '../components/studyGroups/StudyGroupList';

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
  const { user } = useAuth(); // Get current user
  
  // Delete confirmation dialog
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
  const [groupToDelete, setGroupToDelete] = useState(null);
  const cancelRef = useRef();
  
  // Edit group modal
  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();
  const [groupToEdit, setGroupToEdit] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  
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
      // Create set of joined group IDs
      const myGroupsList = Array.isArray(myGroupsRes) ? myGroupsRes : (myGroupsRes.data || []);
      const joinedIds = new Set(myGroupsList.map(g => g.id));
      
      setGroups(allGroupsRes.data.map(g => ({
        ...processGroup(g),
        isJoined: joinedIds.has(g.id)
      })));
      
      setMyGroups(myGroupsList.map(g => ({
        ...processGroup(g),
        isJoined: true // Always set isJoined to true for groups in myGroups
      })));
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
    setMyGroupsLoading(true);
    
    // Fetch both sets of data to get accurate information
    const major_id = localStorage.getItem('major_id');
    const faculty_id = localStorage.getItem('faculty_id');
    let groupParams = {};
    if (major_id) groupParams.major_id = major_id;
    else if (faculty_id) groupParams.faculty_id = faculty_id;
    
    const [updatedGroupsRes, myGroupsRes] = await Promise.all([
      fetchStudyGroups(groupParams),
      fetchMyStudyGroups()
    ]);
    
    // Map all groups with their latest data for reference
    const groupsMap = {};
    updatedGroupsRes.data.forEach(g => {
      groupsMap[g.id] = {
        ...g,
        members_count: g.members_count
      };
    });
    
    // Process groups function
    const processGroup = (group) => {
      // If this group exists in the all groups response, use its members_count
      const latestData = groupsMap[group.id];
      return {
        ...group,
        meetings: group.meeting_time ? [group.meeting_time] : [],
        // Use the count from all groups API if available (it's more reliable)
        members: latestData ? latestData.members_count || 1 : (group.members_count || 1),
        tags: group.major ? [group.major.name] : [],
        leader: group.creator || {},
        course: getCourseLabel(group.course, courses),
        formattedTime: formatMeetingTime(group.meeting_time),
        isPast: group.meeting_time ? new Date(group.meeting_time) < new Date() : false
      };
    };
    
    // Create set of joined group IDs
    const myGroupsList = Array.isArray(myGroupsRes) ? myGroupsRes : (myGroupsRes.data || []);
    const joinedIds = new Set(myGroupsList.map(g => g.id));
    
    // Update all groups
    setGroups(updatedGroupsRes.data.map(g => ({
      ...processGroup(g),
      isJoined: joinedIds.has(g.id)
    })));
    
    // Update my groups, using data from all groups for member count consistency
    setMyGroups(myGroupsList.map(g => {
      // If this group exists in the all groups response, use its members_count
      const latestData = groupsMap[g.id];
      
      return {
        ...processGroup(g),
        // Ensure we use the latest member count
        members: latestData ? latestData.members_count || 1 : (g.members_count || 1),
        isJoined: true
      };
    }));
    
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
    
    // Create set of joined group IDs
    const myGroupsList = Array.isArray(myGroupsRes) ? myGroupsRes : (myGroupsRes.data || []);
    const joinedIds = new Set(myGroupsList.map(g => g.id));
    
    // Update all groups
    setGroups(allGroupsRes.data.map(g => ({
      ...processGroup(g),
      isJoined: joinedIds.has(g.id)
    })));
    
    // Update my groups - all should have isJoined: true
    setMyGroups(myGroupsList.map(g => ({
      ...processGroup(g),
      isJoined: true // Always true for myGroups
    })));
    
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
      });      const processedGroup = {
        ...createdGroup,
        meetings: createdGroup.meeting_time ? [createdGroup.meeting_time] : [],
        tags: createdGroup.major ? [createdGroup.major.name] : [],
        formattedTime: formatMeetingTime(createdGroup.meeting_time),
        isPast: createdGroup.meeting_time ? new Date(createdGroup.meeting_time) < new Date() : false,
        isJoined: true,
        members: 1,
        course: getCourseLabel(createdGroup.course, courses),
        capacity: createdGroup.capacity || 15
      };
      setGroups(prev => [processedGroup, ...prev]);
      setMyGroups(prev => [processedGroup, ...prev]);
    } catch (error) {
      showErrorToast("Failed to create group", error);
    }  }, [newGroup, courses]);

  // Edit and Delete handlers
  const handleEditGroup = useCallback((group) => {
    setGroupToEdit(group);
    setEditFormData({
      name: group.name,
      description: group.description,
      meeting_time: group.meeting_time ? new Date(group.meeting_time).toISOString().slice(0, 16) : "",
      location: group.location || "",
      isOnline: group.isOnline || false
    });
    onEditOpen();
  }, [onEditOpen]);

  const handleDeleteGroup = useCallback((group) => {
    setGroupToDelete(group);
    onDeleteOpen();
  }, [onDeleteOpen]);
  const confirmDeleteGroup = useCallback(async () => {
    if (!groupToDelete) return;
    
    try {
      await deleteStudyGroup(groupToDelete.id);
      
      // Remove from local state
      setGroups(prev => prev.filter(g => g.id !== groupToDelete.id));
      setMyGroups(prev => prev.filter(g => g.id !== groupToDelete.id));
      
      toast({
        title: "Group deleted",
        description: "The study group has been successfully deleted.",
        status: "success",
        duration: 3000,
      });
    } catch (error) {
      showErrorToast("Failed to delete group", error);
    } finally {
      onDeleteClose();
      setGroupToDelete(null);
    }
  }, [groupToDelete, onDeleteClose, toast]);
  const handleUpdateGroup = useCallback(async () => {
    if (!groupToEdit || !editFormData.name || !editFormData.description) {
      toast({
        title: "Please fill in all required fields",
        status: "error",
        duration: 3000,
      });
      return;
    }

    try {
      const updatedData = {
        name: editFormData.name,
        description: editFormData.description,
        meeting_time: editFormData.meeting_time || null,
        location: editFormData.isOnline ? "Online" : editFormData.location,
        is_online: editFormData.isOnline
      };
      
      await updateStudyGroup(groupToEdit.id, updatedData);
      
      // Update local state with the new data
      const updatedGroup = {
        ...groupToEdit,
        ...updatedData,
        formattedTime: formatMeetingTime(editFormData.meeting_time)
      };
      
      setGroups(prev => prev.map(g => g.id === groupToEdit.id ? updatedGroup : g));
      setMyGroups(prev => prev.map(g => g.id === groupToEdit.id ? updatedGroup : g));
      
      toast({
        title: "Group updated",
        description: "The study group has been successfully updated.",
        status: "success",
        duration: 3000,
      });
        onEditClose();
      setGroupToEdit(null);
      setEditFormData({});
    } catch (error) {
      showErrorToast("Failed to update group", error);
    }
  }, [groupToEdit, editFormData, onEditClose, toast]);

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
    <StudyGroupList 
      groups={groupList}
      onJoinLeave={(groupId) => {
        const group = groupList.find(g => g.id === groupId);
        if (group && group.isJoined) {
          handleLeaveGroup(groupId);
        } else {
          handleJoinGroup(groupId);
        }
      }}
      onEdit={handleEditGroup}
      onDelete={handleDeleteGroup}
      currentUser={user}
      emptyStateType={isMyGroups ? "myGroups" : "allGroups"}
    />
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
            </Button>          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Edit Group Modal */}
      <Modal isOpen={isEditOpen} onClose={onEditClose} size="lg" isCentered>
        <ModalOverlay />
        <ModalContent borderRadius="xl">
          <ModalHeader borderBottomWidth="1px" borderColor={dividerColor} pb={4}>
            Edit Study Group
          </ModalHeader>
          <ModalCloseButton />
          
          <ModalBody py={6}>
            <Stack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Group Name</FormLabel>
                <Input
                  value={editFormData.name || ''}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter group name"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Description</FormLabel>
                <Textarea
                  value={editFormData.description || ''}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe your study group"
                  rows={3}
                />
              </FormControl>

              <FormControl>
                <FormLabel>Meeting Time</FormLabel>
                <Input
                  type="datetime-local"
                  value={editFormData.meeting_time || ''}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, meeting_time: e.target.value }))}
                />
              </FormControl>

              <FormControl display="flex" alignItems="center">
                <FormLabel mb="0">Online Meeting</FormLabel>
                <Switch
                  isChecked={editFormData.isOnline || false}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, isOnline: e.target.checked }))}
                />
              </FormControl>

              {!editFormData.isOnline && (
                <FormControl>
                  <FormLabel>Location</FormLabel>
                  <Input
                    value={editFormData.location || ''}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="Enter meeting location"
                  />
                </FormControl>
              )}
            </Stack>
          </ModalBody>

          <ModalFooter borderTopWidth="1px" borderColor={dividerColor} pt={4}>
            <Button variant="ghost" mr={3} onClick={onEditClose}>
              Cancel
            </Button>
            <Button 
              colorScheme="blue" 
              onClick={handleUpdateGroup}
              isDisabled={!editFormData.name || !editFormData.description}
            >
              Update Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        isOpen={isDeleteOpen}
        leastDestructiveRef={cancelRef}
        onClose={onDeleteClose}
        isCentered
      >
        <AlertDialogOverlay>
          <AlertDialogContent borderRadius="xl">
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Study Group
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to delete "{groupToDelete?.name}"? This action cannot be undone and will remove all group data.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onDeleteClose}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={confirmDeleteGroup} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Flex>
  );
};

export default StudyGroupsPage;