import {
  Flex, Box, Heading, Text, Button, Card, CardHeader, CardBody, CardFooter,
  useColorModeValue, Tag, Input, InputGroup, InputLeftElement, Divider,
  Tabs, TabList, TabPanels, Tab, TabPanel, HStack, Modal, ModalOverlay,
  ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton,
  FormControl, FormLabel, Textarea, Select, useDisclosure, useToast,
  SimpleGrid, Skeleton, SkeletonText, Stack, Collapse, IconButton,Switch,
  AlertDialog, AlertDialogBody, AlertDialogFooter, AlertDialogHeader,
  AlertDialogContent, AlertDialogOverlay, InputRightElement, VStack,
  Checkbox, Badge, Grid, GridItem, Spinner, Menu, MenuButton, MenuList, MenuItem, Portal, ButtonGroup
} from "@chakra-ui/react";
import { 
  FiSearch, FiPlus, FiUsers, FiClock, FiMapPin, FiBook, 
  FiCalendar, FiArrowRight, FiCheck, FiVideo, FiCheckCircle, 
  FiFilter, FiChevronUp, FiChevronDown, FiArrowLeft, FiX, FiChevronLeft, FiChevronRight
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
import CreateGroupModal from '../components/studyGroups/CreateGroupModal';

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
  const [coursesLoading, setCoursesLoading] = useState(false);
  const [currentCoursePage, setCurrentCoursePage] = useState(1);
  const [totalCoursePages, setTotalCoursePages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [myGroupsLoading, setMyGroupsLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalGroups, setTotalGroups] = useState(0);
    // Filter state
  const [filters, setFilters] = useState({
    is_online: null,
    is_complete: null,
    course_id: "",
  });
  
  // Form state
  const [newGroup, setNewGroup] = useState({
    name: "",
    course_id: "",
    description: "",
    meeting_time: "",
    location: "",
    isOnline: false,
  });

// Handle course page change for paginated dropdown
const onCoursePageChange = async (page) => {
  if (page < 1 || page > totalCoursePages) return;
  setCoursesLoading(true);
  try {
    const major_id = localStorage.getItem('major_id');
    const faculty_id = localStorage.getItem('faculty_id');
    const params = {
      ...(major_id ? { major_id } : faculty_id ? { faculty_id } : {}),
      page,
      per_page: 10
    };
    const res = await fetchCourses(params);
    setCourses(res.data || []);
    setCurrentCoursePage(res.current_page || page);
    setTotalCoursePages(res.last_page || 1);
  } catch (error) {
    showErrorToast('Failed to fetch courses', error);
  } finally {
    setCoursesLoading(false);
  }
};

// Ensure selected course is reflected in newGroup state
const handleToggleOnline = (e) => {
  setNewGroup(prev => ({
    ...prev,
    isOnline: e.target.checked,
    // When toggled to online, location is not applicable
    location: e.target.checked ? "" : prev.location
  }));
};

const handleInputChange = (e) => {
  const { name, value, type, checked } = e.target;
  setNewGroup(prev => ({
    ...prev,
    [name]: type === 'checkbox' ? checked : value
  }));
};

// Fetch data on mount
useEffect(() => {
  const fetchData = async () => {
    setLoading(true);
    setMyGroupsLoading(true);
    setCoursesLoading(true);
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
        fetchCourses({
          ...(major_id ? { major_id } : faculty_id ? { faculty_id } : {}),
          page: 1,
          per_page: 10
        })
      ]);
      setCourses(coursesRes.data || []);
      setCurrentCoursePage(coursesRes.current_page || 1);
      setTotalCoursePages(coursesRes.last_page || 1);
      // Process groups
      const processGroup = (group) => ({
        ...group,
        meetings: group.meeting_time ? [group.meeting_time] : [],
        members: group.members_count || 1,
        tags: group.major ? [group.major.name] : [],
        leader: group.creator || {},
        course: getCourseLabel(group.course, coursesRes.data || []),
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
      
      // Set pagination data if available
      if (allGroupsRes.current_page !== undefined) {
        setCurrentPage(allGroupsRes.current_page);
        setTotalPages(allGroupsRes.last_page || 1);
        setTotalGroups(allGroupsRes.total || 0);
      }
      
      setMyGroups(myGroupsList.map(g => ({
        ...processGroup(g),
        isJoined: true // Always set isJoined to true for groups in myGroups
      })));
    } catch (error) {
      showErrorToast('Failed to load data', error);
    } finally {
      setLoading(false);
      setMyGroupsLoading(false);
      setCoursesLoading(false);
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
  };  // Search and filter functionality
  const handleSearch = useCallback(async (query = searchTerm, appliedFilters = filters, page = 1) => {
    setSearchLoading(true);
    try {
      const major_id = localStorage.getItem('major_id');
      const faculty_id = localStorage.getItem('faculty_id');
      
      // Prepare combined search and filter parameters
      const searchParams = {
        // Add search query if present
        ...(query.trim() && { q: query.trim() }),
        // Add filters
        ...appliedFilters,
        // Always include user's context
        ...(major_id && { major_id }),
        ...(faculty_id && { faculty_id }),
        // Pagination
        page: page,
        per_page: 4
      };
      
      // Remove empty filter values
      Object.keys(searchParams).forEach(key => {
        if (searchParams[key] === "" || searchParams[key] === null) {
          delete searchParams[key];
        }
      });

      // Use fetchStudyGroups which now handles both search and filters
      const response = await fetchStudyGroups(searchParams);

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

      const myGroupsList = Array.isArray(myGroups) ? myGroups : [];
      const joinedIds = new Set(myGroupsList.map(g => g.id));
      
      const processedGroups = (response.data || response).map(g => ({
        ...processGroup(g),
        isJoined: joinedIds.has(g.id)
      }));

      setGroups(processedGroups);
      
      // Update pagination state
      if (response.current_page !== undefined) {
        setCurrentPage(response.current_page);
        setTotalPages(response.last_page || 1);
        setTotalGroups(response.total || 0);
      }
    } catch (error) {
      showErrorToast('Search failed', error);
    } finally {
      setSearchLoading(false);
    }
  }, [searchTerm, filters, courses, myGroups]);
  // Filter handlers
  const handleFilterChange = useCallback((filterName, value) => {
    const newFilters = { ...filters, [filterName]: value };
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when filters change
    handleSearch(searchTerm, newFilters, 1);
  }, [filters, searchTerm, handleSearch]);

  const clearFilters = useCallback(() => {
    const clearedFilters = {
      is_online: null,
      is_complete: null,
      course_id: "",
    };
    setFilters(clearedFilters);
    setCurrentPage(1); // Reset to first page when clearing filters
    handleSearch(searchTerm, clearedFilters, 1);
  }, [searchTerm, handleSearch]);

  // Pagination handlers
  const handlePageChange = useCallback((newPage) => {
    setCurrentPage(newPage);
    handleSearch(searchTerm, filters, newPage);
  }, [searchTerm, filters, handleSearch]);
  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      handleSearch();
    }, 500);
    
    return () => clearTimeout(timer);
  }, [searchTerm, handleSearch]);

  // Filter groups for display (now just returns groups as search/filter is handled by backend)
  const filteredGroups = useMemo(() => groups, [groups]);
  const myGroupsFiltered = useMemo(() => {
    if (!searchTerm) return myGroups;
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
          <Flex justify="space-between" align="center" gap={4} mb={4} flexWrap="wrap">
            <TabList>
              <Tab>All Groups</Tab>
              <Tab>My Groups</Tab>
            </TabList>
            
            <HStack spacing={2}>
              <Button
                leftIcon={<FiFilter />}
                variant="outline"
                size="sm"
                onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                colorScheme={Object.values(filters).some(v => v !== null && v !== "") ? "blue" : "gray"}
              >
                Filters
                {Object.values(filters).some(v => v !== null && v !== "") && (
                  <Badge ml={2} colorScheme="blue" variant="solid">
                    {Object.values(filters).filter(v => v !== null && v !== "").length}
                  </Badge>
                )}
              </Button>
              
              <InputGroup maxW={{ base: "250px", md: "300px" }}>
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
                {(searchTerm || searchLoading) && (
                  <InputRightElement>
                    {searchLoading ? (
                      <Spinner size="sm" />
                    ) : (
                      <IconButton
                        icon={<FiX />}
                        size="sm"
                        variant="ghost"
                        aria-label="Clear search"
                        onClick={() => setSearchTerm("")}
                      />
                    )}
                  </InputRightElement>
                )}
              </InputGroup>
            </HStack>
          </Flex>

          {/* Advanced Filters Collapse */}
          <Collapse in={isFiltersOpen} animateOpacity>
            <Box 
              p={4} 
              bg={useColorModeValue("gray.50", "gray.700")} 
              borderRadius="lg" 
              mb={4}
              border="1px solid"
              borderColor={dividerColor}
            >
              <VStack spacing={4} align="stretch">
                <HStack justify="space-between" align="center">
                  <Text fontWeight="medium" fontSize="sm" color={textColor}>
                    Filter Groups
                  </Text>
                  <Button 
                    size="xs" 
                    variant="ghost" 
                    onClick={clearFilters}
                    disabled={!Object.values(filters).some(v => v !== null && v !== "")}
                  >
                    Clear All
                  </Button>
                </HStack>                <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }} gap={4}>
                  {/* Course Filter */}
                  <FormControl>
                    <FormLabel fontSize="sm" mb={1}>Course</FormLabel>
                    <Menu>
                      <MenuButton
                        as={Button}
                        size="sm"
                        w="100%"
                        rightIcon={<FiChevronDown />}
                        textAlign="left"
                        fontWeight="normal"
                        bg={useColorModeValue("white", "gray.600")}
                        overflow="hidden"
                        textOverflow="ellipsis"
                        whiteSpace="nowrap"
                      >
                        {filters.course_id && courses.find(c => c.id === Number(filters.course_id))
                          ? `${courses.find(c => c.id === Number(filters.course_id)).code} - ${courses.find(c => c.id === Number(filters.course_id)).title}`
                          : "Any course"}
                      </MenuButton>
                      <Portal><MenuList maxH="320px" overflowY="auto" minW="400px">
                        <MenuItem onClick={() => handleFilterChange('course_id', '')}>Any course</MenuItem>
                        {coursesLoading ? (
                          <Flex justify="center" align="center" h="100px"><Spinner /></Flex>
                        ) : (
                          courses.map(course => (
                            <MenuItem key={course.id} onClick={() => handleFilterChange('course_id', course.id)}>
                              <Box>
                                <Text fontWeight="medium">{course.code} - {course.title}</Text>
                                <Text fontSize="sm" color={mutedText}>{course.major?.name}</Text>
                              </Box>
                            </MenuItem>
                          ))
                        )}
                        {totalCoursePages > 1 && (
                          <Box borderTop="1px solid" borderColor={dividerColor} mt={2} pt={2} px={2}>
                            <Flex justify="space-between" align="center">
                              <Button size="xs" onClick={e => { e.stopPropagation(); onCoursePageChange(currentCoursePage - 1); }} isDisabled={currentCoursePage <= 1 || coursesLoading} variant="outline" borderRadius="md">Prev</Button>
                              <Text fontSize="xs" color={mutedText} mx={2}>Page {currentCoursePage} of {totalCoursePages}</Text>
                              <Button size="xs" onClick={e => { e.stopPropagation(); onCoursePageChange(currentCoursePage + 1); }} isDisabled={currentCoursePage >= totalCoursePages || coursesLoading} variant="outline" borderRadius="md">Next</Button>
                            </Flex>
                          </Box>
                        )}
                      </MenuList></Portal>
                    </Menu>
                  </FormControl>

                  {/* Meeting Type Filter */}
                  <FormControl>
                    <FormLabel fontSize="sm" mb={1}>Meeting Type</FormLabel>
                    <Select
                      size="sm"
                      value={filters.is_online === null ? "" : filters.is_online.toString()}
                      onChange={(e) => handleFilterChange('is_online', e.target.value === "" ? null : e.target.value === "true")}
                      placeholder="Any type"
                      bg={useColorModeValue("white", "gray.600")}
                    >
                      <option value="true">Online</option>
                      <option value="false">In-person</option>
                    </Select>
                  </FormControl>

                  {/* Status Filter */}
                  <FormControl>
                    <FormLabel fontSize="sm" mb={1}>Status</FormLabel>
                    <Select
                      size="sm"
                      value={filters.is_complete === null ? "" : filters.is_complete.toString()}
                      onChange={(e) => handleFilterChange('is_complete', e.target.value === "" ? null : e.target.value === "true")}
                      placeholder="Any status"
                      bg={useColorModeValue("white", "gray.600")}
                    >
                      <option value="false">Active</option>
                      <option value="true">Completed</option>
                    </Select>
                  </FormControl>
                </Grid>

                {/* Active Filters Display */}
                {Object.entries(filters).some(([key, value]) => value !== null && value !== "") && (
                  <Box>
                    <Text fontSize="xs" color={mutedText} mb={2}>Active Filters:</Text>
                    <HStack spacing={2} flexWrap="wrap">
                      {Object.entries(filters).map(([key, value]) => {
                        if (value === null || value === "") return null;
                        
                        let label = "";
                        let displayValue = value;
                        
                        switch (key) {
                          case 'course_id':
                            const course = courses.find(c => c.id.toString() === value.toString());
                            label = "Course";
                            displayValue = course ? course.code : value;
                            break;
                          case 'is_online':
                            label = "Type";
                            displayValue = value ? "Online" : "In-person";
                            break;
                          case 'is_complete':
                            label = "Status";
                            displayValue = value ? "Completed" : "Active";
                            break;
                        }
                        
                        return (
                          <Tag
                            key={key}
                            size="sm"
                            colorScheme="blue"
                            variant="solid"
                            cursor="pointer"
                            onClick={() => handleFilterChange(key, key === 'is_online' || key === 'is_complete' ? null : "")}
                          >
                            {label}: {displayValue}
                            <FiX style={{ marginLeft: '4px' }} />
                          </Tag>
                        );
                      })}
                    </HStack>
                  </Box>
                )}
              </VStack>
            </Box>
          </Collapse>
            <TabPanels>
            {/* All Groups Tab */}
            <TabPanel px={0}>
              {loading ? renderSkeleton() : 
                filteredGroups.length > 0 ? (
                  <>
                    {renderGroupCards(filteredGroups)}
                      {/* Pagination Controls */}
                    {totalPages > 1 && (
                      <Box mt={8}>
                        {/* Pagination Info - Mobile responsive */}
                        <Flex 
                          justify="center" 
                          mb={4}
                          display={{ base: "flex", md: "none" }}
                        >
                          <Text 
                            fontSize="sm" 
                            color={mutedText}
                            textAlign="center"
                            px={4}
                          >
                            Page {currentPage} of {totalPages}
                          </Text>
                        </Flex>

                        {/* Main Pagination Container */}
                        <Flex 
                          justify="space-between" 
                          align="center" 
                          p={6} 
                          bg={useColorModeValue("white", "gray.700")} 
                          borderRadius="xl"
                          borderWidth="1px"
                          borderColor={dividerColor}
                          shadow="sm"
                          _hover={{
                            shadow: "md",
                            borderColor: useColorModeValue("gray.300", "gray.600")
                          }}
                          transition="all 0.2s"
                          flexDirection={{ base: "column", md: "row" }}
                          gap={{ base: 4, md: 0 }}
                        >
                          {/* Pagination Info - Desktop */}
                          <Text 
                            fontSize="sm" 
                            color={mutedText}
                            fontWeight="medium"
                            display={{ base: "none", md: "block" }}
                          >
                            Showing page {currentPage} of {totalPages} • {totalGroups} total groups
                          </Text>
                          
                          {/* Pagination Controls */}
                          <HStack spacing={2}>
                            {/* Previous Button */}
                            <Button
                              leftIcon={<FiChevronLeft />}
                              onClick={() => handlePageChange(currentPage - 1)}
                              isDisabled={currentPage === 1 || searchLoading}
                              variant="outline"
                              size="md"
                              borderRadius="lg"
                              _hover={{
                                bg: useColorModeValue("blue.50", "blue.900"),
                                borderColor: "blue.300",
                                transform: "translateY(-1px)"
                              }}
                              _active={{
                                transform: "translateY(0)"
                              }}
                              transition="all 0.2s"
                              isLoading={searchLoading}
                              loadingText="Previous"
                            >
                              Previous
                            </Button>
                            
                            {/* Page Numbers Container */}
                            <HStack spacing={1} mx={2}>
                              {(() => {
                                const pages = [];
                                const maxPagesToShow = window.innerWidth < 768 ? 3 : 5;
                                let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
                                let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
                                
                                // Adjust start page if we're near the end
                                if (endPage - startPage + 1 < maxPagesToShow) {
                                  startPage = Math.max(1, endPage - maxPagesToShow + 1);
                                }

                                // Add first page and ellipsis if needed
                                if (startPage > 1) {
                                  pages.push(
                                    <Button
                                      key={1}
                                      onClick={() => handlePageChange(1)}
                                      isDisabled={searchLoading}
                                      variant="outline"
                                      size="md"
                                      minW="44px"
                                      h="44px"
                                      borderRadius="lg"
                                      _hover={{
                                        bg: useColorModeValue("blue.50", "blue.900"),
                                        borderColor: "blue.300",
                                        transform: "translateY(-1px)"
                                      }}
                                      _active={{
                                        transform: "translateY(0)"
                                      }}
                                      transition="all 0.2s"
                                    >
                                      1
                                    </Button>
                                  );
                                  
                                  if (startPage > 2) {
                                    pages.push(
                                      <Text key="ellipsis1" color={mutedText} px={2} fontSize="lg">
                                        ...
                                      </Text>
                                    );
                                  }
                                }
                                
                                // Add page number buttons
                                for (let i = startPage; i <= endPage; i++) {
                                  const isCurrentPage = i === currentPage;
                                  pages.push(
                                    <Button
                                      key={i}
                                      onClick={() => handlePageChange(i)}
                                      isDisabled={searchLoading}
                                      colorScheme={isCurrentPage ? "blue" : undefined}
                                      variant={isCurrentPage ? "solid" : "outline"}
                                      size="md"
                                      minW="44px"
                                      h="44px"
                                      borderRadius="lg"
                                      fontWeight={isCurrentPage ? "bold" : "medium"}
                                      _hover={!isCurrentPage ? {
                                        bg: useColorModeValue("blue.50", "blue.900"),
                                        borderColor: "blue.300",
                                        transform: "translateY(-1px)"
                                      } : {}}
                                      _active={{
                                        transform: "translateY(0)"
                                      }}
                                      transition="all 0.2s"
                                      shadow={isCurrentPage ? "md" : "sm"}
                                    >
                                      {i}
                                    </Button>
                                  );
                                }

                                // Add ellipsis and last page if needed
                                if (endPage < totalPages) {
                                  if (endPage < totalPages - 1) {
                                    pages.push(
                                      <Text key="ellipsis2" color={mutedText} px={2} fontSize="lg">
                                        ...
                                      </Text>
                                    );
                                  }
                                  
                                  pages.push(
                                    <Button
                                      key={totalPages}
                                      onClick={() => handlePageChange(totalPages)}
                                      isDisabled={searchLoading}
                                      variant="outline"
                                      size="md"
                                      minW="44px"
                                      h="44px"
                                      borderRadius="lg"
                                      _hover={{
                                        bg: useColorModeValue("blue.50", "blue.900"),
                                        borderColor: "blue.300",
                                        transform: "translateY(-1px)"
                                      }}
                                      _active={{
                                        transform: "translateY(0)"
                                      }}
                                      transition="all 0.2s"
                                    >
                                      {totalPages}
                                    </Button>
                                  );
                                }
                                
                                return pages;
                              })()}
                            </HStack>
                            
                            {/* Next Button */}
                            <Button
                              rightIcon={<FiChevronRight />}
                              onClick={() => handlePageChange(currentPage + 1)}
                              isDisabled={currentPage === totalPages || searchLoading}
                              variant="outline"
                              size="md"
                              borderRadius="lg"
                              _hover={{
                                bg: useColorModeValue("blue.50", "blue.900"),
                                borderColor: "blue.300",
                                transform: "translateY(-1px)"
                              }}
                              _active={{
                                transform: "translateY(0)"
                              }}
                              transition="all 0.2s"
                              isLoading={searchLoading}
                              loadingText="Next"
                            >
                              Next
                            </Button>
                          </HStack>
                        </Flex>
                      </Box>
                    )}
                  </>
                ) : 
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
      
      <CreateGroupModal
        isOpen={isOpen}
        onClose={onClose}
        newGroup={newGroup}
        onInputChange={handleInputChange}
        onCreateGroup={handleCreateGroup}
        onToggleOnline={handleToggleOnline}
        subjects={['All', ...new Set(courses.map(c => c.major?.name).filter(Boolean))]}
        courses={courses}
        coursesLoading={coursesLoading}
        currentCoursePage={currentCoursePage}
        totalCoursePages={totalCoursePages}
        onCoursePageChange={onCoursePageChange}
      />

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