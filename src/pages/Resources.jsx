import {
  Flex,
  Box,
  Heading,
  HStack,
  VStack,
  Text,
  Button,
  IconButton,
  Avatar,
  AvatarGroup,
  Badge,
  Tab,
  Tabs,
  TabList,
  TabPanel,
  TabPanels,
  Tooltip,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Divider,
  useColorModeValue,
  useToast,
  useDisclosure,
  SimpleGrid,
  Skeleton,
  SkeletonText,
  Container,
  Progress,
  Grid,
  GridItem,
  Textarea,
  color,
  AspectRatio,
  Image,
  Tag,
  TagLabel
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useState, useCallback, useEffect, useRef, lazy, Suspense } from "react";
import ResourceList from '../components/resources/ResourceList';
import ResourceFilters from '../components/resources/ResourceFilters';

import { FiArrowLeft, FiSearch, FiFilter, FiFileText, FiTrendingUp, FiVideo, FiImage, FiPaperclip, FiSend, FiEdit, FiBookOpen, FiX } from "react-icons/fi";
import CreatePostModal from './CreatePostModal';
import { getAllResources, createResource, toggleSaveResource, toggleUpvote, deleteResource, updateResourceSimple } from "../services/resourceService";
import { useAuth } from '../context/AuthContext';
import { getFaculties, getMajorsByFaculty, getCoursesByMajor } from "../services/filterService";
/**
 * Main Resources page component that resembles a LinkedIn-style feed
 */
const ResourcesPage = () => {
  // Theme colors
  const cardBg = useColorModeValue("rgba(255, 255, 255, 0.8)", "rgba(45, 55, 72, 0.8)");
  const textColor = useColorModeValue("gray.800", "white");
  const mutedText = useColorModeValue("gray.500", "gray.400");
  const accentColor = useColorModeValue("blue.500", "blue.200");
  const borderColor = useColorModeValue("rgba(226, 232, 240, 0.8)", "rgba(74, 85, 104, 0.3)");
  const bgColor = useColorModeValue("gray.50", "gray.800");
  const highlightColor = useColorModeValue("blue.50", "blue.900");
  const bgGradient = useColorModeValue(
    "linear-gradient(135deg, #f0f4f8 0%, #eff6ff 50%, #f0f4f8 100%)",
    "linear-gradient(135deg, #1a202c 0%, #2d3748 50%, #1a202c 100%)"
  );

  // Hooks
  const toast = useToast();
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isOpen: isPostModalOpen, onOpen: onPostModalOpen, onClose: handlePostModalClose } = useDisclosure();
  
  // Custom modal close handler to reset edit state
  const onPostModalClose = () => {
    setResourceToEdit(null);
    handlePostModalClose();
  };

  // State for feed options
  const [feedType, setFeedType] = useState('feed'); // 'feed' or 'grid'
  const [isLoading, setIsLoading] = useState(true);

  // Filtering and search state
  
  const [facultyFilter, setFacultyFilter] = useState("All");
  const [courseFilter, setCourseFilter] = useState("All");
  const [majorFilter, setMajorFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
    const [showFilters, setShowFilters] = useState(false);

  // State for filter dropdown options
  const [faculties, setFaculties] = useState([]);
  const [majors, setMajors] = useState([]);
    const [courses, setCourses] = useState({ data: [], current_page: 1, last_page: 1 });
  const [coursePage, setCoursePage] = useState(1);
  const [isLoadingFilters, setIsLoadingFilters] = useState(false);

  // User interaction states
  
  // Upvotes are now handled directly from API response data
  
  
  // Current authenticated user
  const { user: currentUser } = useAuth();

  // Resource data state
  const [loadedResourceData, setLoadedResourceData] = useState([]);
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);

  // State for editing a resource
    const [resourceToEdit, setResourceToEdit] = useState(null);

  // useEffect to fetch all faculties on mount and set default
  useEffect(() => {
    const fetchFaculties = async () => {
      setIsLoadingFilters(true);
      const data = await getFaculties();
      setFaculties(data);
      
      const userDetails = JSON.parse(localStorage.getItem('user'));
      if (userDetails?.faculty_id) {
        setFacultyFilter(userDetails.faculty_id);
      }
      setIsLoadingFilters(false);
    };
    fetchFaculties();
  }, []);

  // useEffect to fetch majors when faculty changes
  useEffect(() => {
    if (!facultyFilter || facultyFilter === 'All') {
      setMajors([]);
      setMajorFilter('All');
      return;
    }
    
    const fetchMajors = async () => {
      setIsLoadingFilters(true);
      const data = await getMajorsByFaculty(facultyFilter);
      setMajors(data);
      
      const userDetails = JSON.parse(localStorage.getItem('user'));
      if (userDetails?.major_id && parseInt(userDetails.faculty_id) === parseInt(facultyFilter)) {
        setMajorFilter(userDetails.major_id);
      } else {
        setMajorFilter('All');
      }
      setIsLoadingFilters(false);
    };
    
    fetchMajors();
  }, [facultyFilter]);

  // useEffect to fetch courses when major changes
  useEffect(() => {
    if (!majorFilter || majorFilter === 'All') {
      setCourses({ data: [], current_page: 1, last_page: 1 });
      setCourseFilter('All');
      setCoursePage(1);
      return;
    }

    const fetchCourses = async (page) => {
      setIsLoadingFilters(true);
      const data = await getCoursesByMajor(majorFilter, page);
      setCourses(data);
      // Do not reset courseFilter here to keep selection across pages
      setIsLoadingFilters(false);
    };

    fetchCourses(coursePage);
  }, [majorFilter, coursePage]);

  const loadResources = useCallback(async (page = 1) => {
    setIsLoading(true);
    try {
      const filters = {
        page,
        per_page: 10,
        faculty_id: facultyFilter !== 'All' ? facultyFilter : undefined,
        major_id: majorFilter !== 'All' ? majorFilter : undefined,
        course_id: courseFilter !== 'All' ? courseFilter : undefined,
        search: searchQuery || undefined,
      };
      
      // Clean up undefined filters to avoid sending them as empty params
      Object.keys(filters).forEach(key => filters[key] === undefined && delete filters[key]);

      const res = await getAllResources(filters);
      const resources = Array.isArray(res) ? res : (res.data || []);
      const pagination = res.pagination || {};

      setLoadedResourceData(resources);
      setCurrentPage(pagination.current_page || page);
      setLastPage(pagination.last_page || 1);
    } catch (error) {
      console.error('Error loading resource data:', error);
      toast({
        title: "Error loading resources",
        description: error.response?.data?.message || 'There was a problem loading the API resource data.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  }, [facultyFilter, majorFilter, courseFilter, searchQuery, toast]);

  useEffect(() => {
    loadResources(1); // Load initial data and on filter change, reset to page 1
  }, [loadResources]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= lastPage) {
      loadResources(page);
    }
  };



  // Event handlers
  const handleCardClick = useCallback((id) => {
    navigate(`/resources/${id}`);
  }, [navigate]);

  const handleBookmark = useCallback((id, title) => {
    const resourceIndex = loadedResourceData.findIndex(r => r.id === id);
    if (resourceIndex === -1) return;

    const resource = loadedResourceData[resourceIndex];
    const previousState = resource.is_saved;

    // Optimistically update UI
    const updatedResources = [...loadedResourceData];
    updatedResources[resourceIndex] = { ...resource, is_saved: !previousState };
    setLoadedResourceData(updatedResources);

    toggleSaveResource(id)
      .then(response => {
        toast({
          title: `${previousState ? "Removed from" : "Added to"} bookmarks: ${title}`,
          status: "success",
          duration: 1500,
          isClosable: true,
        });
        // Optionally, you can update the resource with the response from the server
        const finalResources = [...loadedResourceData];
        finalResources[resourceIndex] = { ...finalResources[resourceIndex], is_saved: response.is_saved };
        setLoadedResourceData(finalResources);
      })
      .catch(error => {
        console.error(`Error ${previousState ? 'unsaving' : 'saving'} resource:`, error);
        // Revert the change
        const revertedResources = [...loadedResourceData];
        revertedResources[resourceIndex] = { ...resource, is_saved: previousState };
        setLoadedResourceData(revertedResources);
        toast({
          title: `Failed to ${previousState ? 'remove from' : 'add to'} bookmarks`,
          description: error.response?.data?.message || 'Please try again later',
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      });
  }, [loadedResourceData, toast]);

  const handleUpvote = useCallback((id) => {
    // Find the resource to update
    const resourceIndex = loadedResourceData.findIndex(r => r.id === id);
    if (resourceIndex === -1) return;
    
    // Get current resource state
    const resource = loadedResourceData[resourceIndex];
    
    // Optimistically update UI
    const updatedResource = {
      ...resource,
      is_upvoted: !resource.is_upvoted,
      upvote_count: resource.upvote_count + (resource.is_upvoted ? -1 : 1)
    };
    
    const updatedResources = [...loadedResourceData];
    updatedResources[resourceIndex] = updatedResource;
    setLoadedResourceData(updatedResources);
    
    // Call API to toggle upvote
    toggleUpvote(id)
      .then(response => {
        // Find resource again (index might have changed)
        const currentResourceIndex = loadedResourceData.findIndex(r => r.id === id);
        if (currentResourceIndex === -1) return;
        
        // Update with actual server values
        const updatedResources = [...loadedResourceData];
        updatedResources[currentResourceIndex] = {
          ...updatedResources[currentResourceIndex],
          is_upvoted: response.upvoted,
          upvote_count: response.upvote_count
        };
        
        setLoadedResourceData(updatedResources);
      })
      .catch(error => {
        // Revert to previous state if API call fails
        console.error('Error toggling upvote:', error);
        
        // Find resource again
        const currentResourceIndex = loadedResourceData.findIndex(r => r.id === id);
        if (currentResourceIndex === -1) return;
        
        // Revert the change
        const revertedResource = {
          ...loadedResourceData[currentResourceIndex],
          is_upvoted: resource.is_upvoted,
          upvote_count: resource.upvote_count
        };
        
        const revertedResources = [...loadedResourceData];
        revertedResources[currentResourceIndex] = revertedResource;
        setLoadedResourceData(revertedResources);
        
        toast({
          title: 'Failed to update upvote',
          description: error.response?.data?.message || 'Please try again later',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      });
  }, [loadedResourceData, toast]);
  
  const handleAddComment = useCallback(async (resourceId, body) => {
    try {
      // Call API to add comment
      const response = await addComment(resourceId, body);
      
      // Find the resource to update
      const resourceIndex = loadedResourceData.findIndex(r => r.id === resourceId);
      if (resourceIndex === -1) return;
      
      // Update comment count for the resource
      const updatedResources = [...loadedResourceData];
      updatedResources[resourceIndex] = {
        ...updatedResources[resourceIndex],
        comment_count: response.comment_count
      };
      
      setLoadedResourceData(updatedResources);
      
      toast({
        title: "Comment added",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
      
      return response.comment;
    } catch (error) {
      console.error('Error adding comment:', error);
      
      toast({
        title: "Failed to add comment",
        description: error.response?.data?.message || "Please try again later",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  }, [loadedResourceData, toast]);

  const handleShare = useCallback((id, method) => {
    // Track the share event with the method
    console.log(`Resource ${id} shared via ${method || 'general'}`);

    // If this were a real app, we would track analytics here
    // analytics.trackEvent('resource_shared', { id, method });

    // Only show toast for the copy method since other methods open external windows
    if (!method || method === 'general') {
      toast({
        title: `Shared resource #${id}`,
        status: "info",
        duration: 1500,
        isClosable: true,
      });
    }
  }, [toast]);


  const handleCreateResource = () => {
    onPostModalOpen();
  };

  const handleAddNewPost = (content, type, postData) => {
    // Set loading state
    setIsLoading(true);

    // Prepare the resource data for API submission using FormData format
    const title = postData.title || 'New Resource';
    const description = content;
    
    // Extract attachment files from postData if available
    const attachments = postData.attachments || [];
    
    // Log the files being uploaded
    if (attachments.length > 0) {
      console.log(`Uploading ${attachments.length} attachments with resource`);
    }

    // Prepare data for the createResource service
    const resourcePayload = {
      title,
      description,
      attachments,
      course_id: postData.course_id,
      major_id: postData.major_id,
      faculty_id: postData.faculty_id,
      type
    };

    // Check if poll data exists in postData and add it to the payload
    if (postData.poll && postData.poll.question && postData.poll.options) {
      resourcePayload.poll = {
        question: postData.poll.question,
        options: postData.poll.options
      };
      console.log('Adding poll data to createResource payload:', resourcePayload.poll);
    }

    // Call the API to create the resource using updated service function
    createResource(resourcePayload)
      .then(response => {
        // Add the new resource to the top of the list
        const newResource = response;
        setLoadedResourceData(prev => [newResource, ...prev]);

        toast({
          title: 'Resource created successfully',
          description: attachments.length > 0 ? 
            `Added resource with ${attachments.length} attachments` : 
            'Resource has been created',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      })
      .catch(error => {
        console.error('Error creating resource:', error);
        toast({
          title: 'Failed to create resource',
          description: error.message || error.response?.data?.message || 'Please try again later',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  // Handle resource edit
  const handleEdit = useCallback((resource) => {
    // Set the resource to edit in the modal
    setResourceToEdit({
      id: resource.id,
      title: resource.title,
      description: resource.description,
      attachments: resource.attachments || []
    });
    // Open the edit modal
    onPostModalOpen();
  }, [onPostModalOpen]);
  
  // Handle resource deletion
  const handleDelete = useCallback(async (resourceId) => {
    try {
      // Resources are deleted in the ResourceCard component
      // Update our local state to remove the resource
      setLoadedResourceData(prevResources => 
        prevResources.filter(resource => resource.id !== resourceId)
      );
      
      toast({
        title: "Resource deleted",
        status: "success",
        duration: 3000,
        isClosable: true
      });
      
    } catch (error) {
      console.error('Error handling resource deletion:', error);
      toast({
        title: "Error",
        description: "There was a problem updating the UI after deletion.",
        status: "error",
        duration: 3000,
        isClosable: true
      });
    }
  }, [toast]);

  return (
    <Box
      position="relative"
      bg={bgGradient}
      minH="calc(100vh - 60px)"
      py={5}
      px={{ base: 4, md: 6, lg: 8 }}
      overflow="hidden"
    >
      {/* Add abstract decorative elements */}
      <Box
        position="absolute"
        top="5%"
        right="5%"
        width="300px"
        height="300px"
        borderRadius="full"
        bg="brand.navy"
        opacity="0.05"
        filter="blur(70px)"
        zIndex={0}
      />
      <Box
        position="absolute"
        bottom="10%"
        left="5%"
        width="250px"
        height="250px"
        borderRadius="full"
        bg="brand.gold"
        opacity="0.08"
        filter="blur(60px)"
        zIndex={0}
      />

      {/* Progress loader */}
      {isLoading && loadingProgress < 100 && (
        <Box position="fixed" top="0" left="0" right="0" zIndex="1000">
          <Progress size="xs" value={loadingProgress} colorScheme="blue" isAnimated />
        </Box>
      )}

      {/* Main layout with separate feed and sidebar */}
      <Flex maxW="1400px" mx="auto" gap={{ base: 2, md: 4, lg: 6 }} px={{ base: 2, md: 4 }}>
        {/* Create Post Modal */}
        <CreatePostModal
          isOpen={isPostModalOpen}
          onClose={onPostModalClose}
          user={currentUser}
          addNewPost={handleAddNewPost}
          editResource={resourceToEdit}
          updateResource={async (updatedResource) => {
            try {
              // Import the full updateResource function that handles attachments
              const { updateResource } = await import('../services/resourceService');
              
              console.log('Updating resource with full data:', updatedResource);
              console.log('Attachments data received:', {
                newAttachments: updatedResource.newAttachments || [],
                attachmentFiles: updatedResource.attachmentFiles || [],
                removeAttachmentIds: updatedResource.removeAttachmentIds || [],
                attachmentsToRemove: updatedResource.attachmentsToRemove || []
              });
              
              // Use the full updateResource function that properly handles attachments
              // and ensure we pass ALL possible attachment data formats to catch any naming inconsistencies
              const result = await updateResource(updatedResource.id, {
                title: updatedResource.title,
                description: updatedResource.description,
                // Handle all possible names for attachment data for maximum compatibility
                newAttachments: updatedResource.attachmentFiles || updatedResource.newAttachments || [],
                removeAttachmentIds: updatedResource.attachmentsToRemove || updatedResource.removeAttachmentIds || []
              });
              
              // Update the resource in our local state
              setLoadedResourceData(prevResources => 
                prevResources.map(res => 
                  res.id === updatedResource.id ? {...res, ...result} : res
                )
              );
              
              toast({
                title: "Resource updated",
                description: updatedResource.attachmentsToRemove?.length > 0 || updatedResource.newAttachments?.length > 0 ?
                  "Resource and attachments updated successfully" : "Resource updated successfully",
                status: "success",
                duration: 3000,
                isClosable: true
              });
              
              return result;
            } catch (error) {
              console.error('Error updating resource:', error);
              toast({
                title: "Update failed",
                description: error.response?.data?.message || "Failed to update the resource.",
                status: "error",
                duration: 3000,
                isClosable: true
              });
              throw error;
            }
          }}
        />
        {/* Main content area */}
        <Box flex="1" maxW={{ base: "100%", lg: "calc(100% - 340px)" }} order={{ base: 1, lg: 1 }}>
          <VStack spacing={6} align="stretch">
            <HStack spacing={4}>
            <IconButton
              icon={<FiArrowLeft />}
              aria-label="Go back"
              onClick={() => navigate(-1)}
              variant="ghost"
              borderRadius="full"
            />
            <Heading size="xl" color={textColor} fontWeight="700" >
              Resources Feed
            </Heading>
            </HStack>
            {/* Search Bar */}
            <Box
              position="sticky"
              top="0"
              zIndex="10"
              py={4}
              backdropFilter="blur(10px)"
              mb={4}
            >
              <Flex align="center" gap={4} maxW="1000px" mx="auto">
                <InputGroup size="lg" flex="1">
                  <InputLeftElement pointerEvents="none">
                    <FiSearch color="gray.400" />
                  </InputLeftElement>
                  <Input
                    placeholder="Search resources..."
                    bg={useColorModeValue("white", "gray.700")}
                    borderRadius="full"
                    boxShadow="sm"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    _focus={{
                      boxShadow: "0 0 0 3px rgba(66, 153, 225, 0.2)",
                      borderColor: "brand.navy"
                    }}
                  />
                  {searchQuery && (
                    <InputRightElement>
                      <IconButton
                        size="sm"
                        variant="ghost"
                        icon={<FiArrowLeft />}
                        onClick={() => setSearchQuery("")}
                        aria-label="Clear search"
                        borderRadius="full"
                      />
                    </InputRightElement>
                  )}
                </InputGroup>
                <Button
                  leftIcon={<FiFilter />}
                  onClick={() => setShowFilters(!showFilters)}
                  bg={showFilters ? "brand.navy" : useColorModeValue("white", "gray.700")}
                  color={showFilters ? "white" : textColor}
                  borderRadius="full"
                  boxShadow="sm"
                  _hover={{
                    bg: showFilters ? "brand.navy" : useColorModeValue("gray.100", "gray.600")
                  }}
                  transition="all 0.2s"
                >
                  <Text as="span">Filter</Text>
                </Button>
              </Flex>
              {showFilters && (
                <Box mt={4} bg={cardBg} p={4} borderRadius="lg" boxShadow="md">
                  <ResourceFilters 
                    searchQuery={searchQuery}
                    facultyFilter={facultyFilter}
                    setFacultyFilter={setFacultyFilter}
                    courseFilter={courseFilter}
                    setCourseFilter={setCourseFilter}
                    majorFilter={majorFilter}
                    setMajorFilter={setMajorFilter}
                    faculties={faculties}
                    majors={majors}
                    courses={courses.data}
            coursePagination={courses}
            onCoursePageChange={setCoursePage}
                    isLoadingFilters={isLoadingFilters}
                    showFilters={showFilters}
                    onToggleFilters={() => setShowFilters(!showFilters)}
                    onClearFilters={() => {
                      setFacultyFilter("All");
                      setCourseFilter("All");
                      setMajorFilter("All");
                    }}
                  />
                </Box>
              )}
            </Box>

            {/* Create Post Card */}
            <Box
              bg={cardBg}
              borderRadius="xl"
              boxShadow="sm"
              p={3}
              mb={6}
              border="1px solid"
              borderColor={borderColor}
              _hover={{
                boxShadow: 'md',
                transform: 'translateY(-1px)'
              }}
              transition="all 0.2s ease"
            >
              <HStack spacing={3}>
                <Avatar
                  size="md"
                  name={currentUser ? `${currentUser.first_name} ${currentUser.last_name}` : 'User'}
                  src={currentUser?.avatar_url || currentUser?.avatar}
                  cursor="pointer"
                  border="2px solid"
                  borderColor={useColorModeValue('blue.200', 'blue.700')}
                />
                <Box
                  flex="1"
                  bg={useColorModeValue("gray.50", "gray.700")}
                  borderRadius="full"
                  px={4}
                  py={2.5}
                  cursor="pointer"
                  onClick={onPostModalOpen}
                  _hover={{
                    bg: useColorModeValue("gray.100", "gray.600")
                  }}
                  transition="all 0.2s"
                  border="1px solid"
                  borderColor={useColorModeValue("gray.200", "gray.600")}
                >
                  <Text color={mutedText} fontSize="sm">
                    What's on your mind?
                  </Text>
                </Box>
              </HStack>
            </Box>

            {/* Main Content Feed */}
            <Box w="full" maxW={{ base: "100%", md: "650px", lg: "100%" }} mx="auto" position="relative">
              <ResourceList 
                resources={loadedResourceData} 
                cardBg={cardBg} 
                textColor={textColor} 
                mutedText={mutedText} 
                borderColor={borderColor}
                isLoading={isLoading}
                feedType={feedType}
                currentUser={currentUser}
                onCardClick={handleCardClick}
                onBookmark={handleBookmark}
                onUpvote={handleUpvote}
                onShare={handleShare}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
              {lastPage > 1 && (
                <HStack justify="center" spacing={4} mt={8}>
                  <Button
                    onClick={() => handlePageChange(currentPage - 1)}
                    isDisabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  <Text>
                    Page {currentPage} of {lastPage}
                  </Text>
                  <Button
                    onClick={() => handlePageChange(currentPage + 1)}
                    isDisabled={currentPage === lastPage}
                  >
                    Next
                  </Button>
                </HStack>
              )}
            </Box>
          </VStack>
        </Box>

        {/* Right sidebar with trending topics */}
        <Box
          display={{ base: "none", lg: "block" }}
          order={{ base: 2, lg: 2 }}
          width="320px"
          flexShrink="0"
        >
          <Box
            position="sticky"
            top="20px"
            width="320px"
            maxHeight="calc(100vh - 40px)"
            overflowY="auto"
            paddingRight="2"
            css={{
              '&::-webkit-scrollbar': {
                width: '4px',
              },
              '&::-webkit-scrollbar-track': {
                width: '6px',
                backgroundColor: 'transparent'
              },
              '&::-webkit-scrollbar-thumb': {
                background: useColorModeValue('rgba(0,0,0,0.1)', 'rgba(255,255,255,0.1)'),
                borderRadius: '24px',
              }
            }}
          >
            <VStack spacing={4} align="stretch" width="100%" pb="20px">
              {/* Trending Hashtags - Improved Design */}
              <Box
                bg={cardBg}
                borderRadius="xl"
                boxShadow="md"
                overflow="hidden"
              >
                <Box
                  p={4}
                  borderBottomWidth="1px"
                  borderColor={borderColor}
                  bg={useColorModeValue("blue.50", "blue.900")}
                >
                  <Flex align="center" justify="space-between">
                    <HStack>
                      <FiTrendingUp size={18} color={useColorModeValue("#4299E1", "#90CDF4")} />
                      <Heading size="md" fontWeight="600" color={useColorModeValue("blue.600", "blue.200")}>Trending Topics</Heading>
                    </HStack>
                  </Flex>
                </Box>

                <VStack align="start" color={"blue.500"} spacing={0} divider={<Divider />} pb={2}>
                  {[
                    { hashtag: "#MachineLearning" },
                    { hashtag: "#ResearchMethods" },
                    { hashtag: "#CalculusII" },
                    { hashtag: "#ComputerScience" },
                    { hashtag: "#Statistics" }
                  ].map((item, index) => (
                    <Box
                      key={index}
                      py={3}
                      px={4}
                      w="full"
                      _hover={{ bg: useColorModeValue("gray.50", "gray.700") }}
                      cursor="pointer"
                      transition="all 0.2s"
                      role="group"
                    >
                      <Flex align="center" justify="space-between">
                        <VStack align="start" spacing={0}>
                          <Text fontWeight="600" fontSize="md">{item.hashtag}</Text>
                        </VStack>
                      </Flex>
                    </Box>
                  ))}
                </VStack>

                <Box
                  p={4}
                  borderTopWidth="1px"
                  borderColor={borderColor}
                  bg={useColorModeValue("gray.50", "gray.700")}
                  textAlign="center"
                  cursor="pointer"
                  _hover={{ bg: useColorModeValue("gray.100", "gray.600") }}
                >
                  <Text fontSize="sm" color={mutedText}>View all trending topics</Text>
                </Box>
              </Box>

              {/* Resource Contributors */}
              <Box
                bg={cardBg}
                borderRadius="xl"
                boxShadow="sm"
                overflow="hidden"
                mt={4}
              >
              </Box>
            </VStack>
          </Box>
        </Box>
      </Flex>
    </Box>
  );
};

export default ResourcesPage;