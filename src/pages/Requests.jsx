import {
  fetchAllRequests,
  fetchFilteredRequests,
  fetchMyRequests,
  fetchMyApplications,
  createSectionRequest,
  applyToRequest,
  fetchApplicationsForRequest,
  updateSectionRequest,
  approveApplication,
  deleteSectionRequest,
  deleteApplication,
  fetchRequestById,
  updateApplicationStatus
} from '../services/requestService.js';
import { fetchCourses } from '../services/courseService.js';
import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  Flex,
  Stack,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  ButtonGroup,
  Badge,
  Avatar,
  Tag,
  HStack,
  VStack,
  Grid,
  FormControl,
  FormLabel,
  Input,
  Select,
  Textarea,
  useColorModeValue,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  IconButton,
  useToast,
  Spinner,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
import Pagination from "../components/Pagination";
import { useState, useEffect, useCallback, forwardRef, useImperativeHandle, useRef } from 'react';
import usePaginatedCourses from "../hooks/usePaginatedCourses";
import { FiCalendar, FiClock, FiPlus, FiCheck, FiX, FiChevronLeft, FiTrash, FiFilter, FiEdit2, FiChevronRight } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Default avatar for users
const DEFAULT_AVATAR = "https://bit.ly/dan-abramov";

// Helper function to map API application data to UI format
const mapApiApplicationData = (app) => {
  if (!app) return {};
  return {
    id: app.id,
    userId: app.user_id,
    userName: app.user && app.user.first_name && app.user.last_name
      ? `${app.user.first_name} ${app.user.last_name}`
      : (app.user && app.user.username) || app.userName || "You",
    userAvatar: (app.user && app.user.avatar_url) || app.userAvatar || DEFAULT_AVATAR,
    reason: app.reason,
    createdAt: app.created_at || app.createdAt,
    status: app.status,
    request: app.request // for myApplications, attach the related request object
  };
};

// Helper function to map API data to UI format
const mapApiRequest = (apiRequest, currentUser) => {
  if (!apiRequest) return {};
  const requester = apiRequest.requester || currentUser || {};
  return {
    id: apiRequest.id,
    courseName: apiRequest.course_name,
    currentSection: apiRequest.current_section,
    desiredSection: apiRequest.desired_section,
    currentDay: apiRequest.current_day,
    currentTime: apiRequest.current_time,
    desiredDay: apiRequest.desired_day,
    desiredTime: apiRequest.desired_time,
    reason: apiRequest.reason,
    status: apiRequest.status,
    requesterId: requester.id,
    requesterName: requester.first_name && requester.last_name
      ? `${requester.first_name} ${requester.last_name}`
      : requester.name || "You",
    requesterAvatar: requester.avatar_url || DEFAULT_AVATAR,
    createdAt: apiRequest.created_at,
    applications: Array.isArray(apiRequest.applications)
      ? apiRequest.applications.map(app => ({
        id: app.id, // This is the application ID
        requestId: apiRequest.id, // The request ID from the parent object
        userId: app.user_id || (app.user ? app.user.id : undefined),
        status: app.status,
        user: app.user
          ? {
            id: app.user.id,
            // avatar: app.user.avatar_url || DEFAULT_AVATAR,
            name: `${app.user.first_name} ${app.user.last_name}`,
          }
          : {},
      }))
      : [],
  };
};

// Request card component
const RequestCard = ({ request, userId, onApply, onCancel, onDelete, onViewApplications, onUpdateApplication, onUpdateApplicationStatus, onEdit }) => {
  // Get user role from localStorage
  const userRole = typeof window !== 'undefined' ? localStorage.getItem('role') : null;

  // Policy: owner, admin, moderator can update/delete
  const canEditOrDelete = request.requesterId === userId;
  const cardBg = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.800", "white");
  const mutedText = useColorModeValue("gray.600", "gray.400");
  const accentColor = useColorModeValue("yellow.400", "yellow.500");
  const borderColor = useColorModeValue("gray.100", "gray.700");



  // Check if current user has already applied to this request
  const hasApplied = request.applications?.some(app => app.userId === userId && (app.status === 'pending' || app.status === 'accepted'));
  const statusColor = {
    pending: "orange",
    accepted: "green",
    declined: "red",
    cancelled: "gray",
  };

  const formatTime = (time) => {
    if (!time) return "";

    try {
      const [hours, minutes] = time.split(':');
      const hour = parseInt(hours, 10);
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const formattedHour = hour % 12 || 12;
      return `${formattedHour}:${minutes} ${ampm}`;
    } catch (error) {
      return time;
    }
  };

  return (
    <Card
      bg={cardBg}
      boxShadow="sm"
      border="1px solid"
      borderColor={borderColor}
      borderRadius="lg"
      overflow="hidden"
      transition="all 0.2s"
      _hover={{ transform: "translateY(-2px)", boxShadow: "md" }}
    >
      {request.status !== "pending" && (
        <Badge
          position="absolute"
          top={2}
          right={2}
          colorScheme={statusColor[request.status]}
          variant="solid"
          borderRadius="md"
          px={2}
          textTransform="capitalize"
          fontSize="xs"
        >
          {request.status}
        </Badge>
      )}

      <CardHeader pb={3}>
        <Flex justify="space-between" align="start">
          <VStack align="start" spacing={1}>
            <Heading size="sm" color={textColor}>
              {request.courseName}
            </Heading>
            <Text fontSize="xs" color={mutedText}>
              Created: {new Date(request.createdAt).toLocaleDateString()}
            </Text>
          </VStack>
          <HStack spacing={2}>
            <Tag size="sm" colorScheme="blue" variant="subtle" minW="max-content">
              {request.currentSection}
            </Tag>
            <Text fontSize="sm" color="gray.500">→</Text>
            <Tag size="sm" colorScheme="green" variant="subtle" minW="max-content">
              {request.desiredSection}
            </Tag>
          </HStack>
        </Flex>
      </CardHeader>

      <CardBody py={0}>
        <Grid templateColumns={{ base: "1fr", sm: "repeat(2, 1fr)" }} gap={4} py={3}>
          <VStack align="start" spacing={2}>
            <Flex align="center">
              <Box as={FiCalendar} mr={2} color={accentColor} />
              <VStack spacing={0} align="start">
                <Text fontSize="xs" color={mutedText}>Current Day</Text>
                <Text fontSize="sm" color={textColor}>{request.currentDay}</Text>
              </VStack>
            </Flex>
            <Flex align="center">
              <Box as={FiClock} mr={2} color={accentColor} />
              <VStack spacing={0} align="start">
                <Text fontSize="xs" color={mutedText}>Time</Text>
                <Text fontSize="sm" color={textColor}>{formatTime(request.currentTime)}</Text>
              </VStack>
            </Flex>
          </VStack>

          <VStack align="start" spacing={2}>
            <Flex align="center">
              <Box as={FiCalendar} mr={2} color={accentColor} />
              <VStack spacing={0} align="start">
                <Text fontSize="xs" color={mutedText}>Desired Day</Text>
                <Text fontSize="sm" color={textColor}>{request.desiredDay}</Text>
              </VStack>
            </Flex>
            <Flex align="center">
              <Box as={FiClock} mr={2} color={accentColor} />
              <VStack spacing={0} align="start">
                <Text fontSize="xs" color={mutedText}>Time</Text>
                <Text fontSize="sm" color={textColor}>{formatTime(request.desiredTime)}</Text>
              </VStack>
            </Flex>
          </VStack>
        </Grid>

        {request.reason && (
          <Box mt={2} p={3} bg={useColorModeValue("gray.50", "gray.700")} borderRadius="md">
            <Text fontSize="sm" color={mutedText} noOfLines={2}>
              {request.reason}
            </Text>

            {/* Applicants List for My Requests */}
            {onUpdateApplicationStatus && request.applications && request.applications.length > 0 && (
              <Box pt={4} mt={4} borderTopWidth="1px" borderColor={borderColor}>
                <Heading size="sm" mb={3} color={textColor}>Applicants</Heading>
                <VStack spacing={4} align="stretch">
                  {request.applications.map(app => (
                    <Flex key={app.id} justify="space-between" align="center">
                      <Flex align="center">
                        <Avatar size="sm" name={app.user.username} src={app.user.avatar} />
                        <Box ml={3}>
                          <Text fontWeight="bold" color={textColor}>{app.user.username}</Text>
                          <Text fontSize="sm" color={mutedText}>{app.reason}</Text>
                        </Box>
                      </Flex>
                      <Box textAlign="right">
                        {app.status === 'pending' ? (
                          <HStack spacing={2}>
                            <Button size="xs" colorScheme="green" onClick={() => onUpdateApplicationStatus(app.id, 'approved')}>Approve</Button>
                            <Button size="xs" colorScheme="red" onClick={() => onUpdateApplicationStatus(app.id, 'declined')}>Decline</Button>
                          </HStack>
                        ) : (
                          <Badge colorScheme={app.status === 'approved' ? 'green' : 'red'}>
                            {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                          </Badge>
                        )}
                      </Box>
                    </Flex>
                  ))}
                </VStack>
              </Box>
            )}
          </Box>
        )}
      </CardBody>

      <CardFooter pt={3}>
        <Flex w="100%" justify="space-between" align="center">
          <HStack spacing={2}>
            {/* Fix: define requesterAvatar and requesterName from request object */}
            <Avatar
              size="xs"
              src={request.requesterAvatar}
              name={request.requesterName}
            />
            <Text fontSize="sm" color={textColor} fontWeight="medium">
              {request.requesterName}
            </Text>
          </HStack>

          {request.status === "pending" && (
            <HStack spacing={2}>
              {canEditOrDelete && (
                <>
                  <Button
                    size="sm"
                    variant="solid"
                    colorScheme="blue"
                    onClick={() => onViewApplications(request.id)}
                  >
                    {request.applications && request.applications.length > 0
                      ? `View Applicants (${request.applications.length})`
                      : "No Applicants"}
                  </Button>
                  <Menu>
                    <MenuButton
                      as={IconButton}
                      aria-label="More actions"
                      icon={<FiChevronLeft style={{ transform: 'rotate(-90deg)' }} />}
                      size="sm"
                      variant="ghost"
                    />
                    <MenuList>
                      <MenuItem icon={<FiX />} onClick={() => onCancel(request.id)}>
                        Cancel
                      </MenuItem>
                      <MenuItem icon={<FiEdit2 />} onClick={() => onEdit(request)}>
                        Edit
                      </MenuItem>
                      <MenuItem icon={<FiTrash />} color="red.500" onClick={() => onDelete(request.id)}>
                        Delete
                      </MenuItem>
                    </MenuList>
                  </Menu>
                </>
              )}
              {!canEditOrDelete && hasApplied && (
                <Button
                  size="sm"
                  colorScheme="gray"
                  variant="solid"
                  isDisabled
                >
                  Applied
                </Button>
              )}
              {!canEditOrDelete && !hasApplied && typeof onApply === 'function' && (
                <Button
                  size="sm"
                  colorScheme="green"
                  variant="solid"
                  leftIcon={<FiCheck />}
                  onClick={() => onApply(request.id)}
                >
                  Apply
                </Button>
              )}
            </HStack>
          )}
        </Flex>
      </CardFooter>
    </Card>
  );
};

// Application card for My Applications tab
const ApplicationCard = ({ application, onWithdraw }) => {
  const [isWithdrawDialogOpen, setIsWithdrawDialogOpen] = useState(false);
  const cancelRef = useRef();
  const cardBg = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.800", "white");
  const mutedText = useColorModeValue("gray.600", "gray.400");
  const borderColor = useColorModeValue("gray.100", "gray.700");



  // Status color scheme
  const statusColor = {
    pending: "orange",
    accepted: "green",
    declined: "red",
    cancelled: "gray",
  };

  const request = application.request;

  // Use mapped request fields from mapApiRequest
  const courseName = request?.courseName || `Request #${application.request_id}`;
  const currentSection = request?.currentSection || '-';
  const desiredSection = request?.desiredSection || '-';
  const currentDay = request?.currentDay || '-';
  const desiredDay = request?.desiredDay || '-';
  const currentTime = request?.currentTime || '-';
  const desiredTime = request?.desiredTime || '-';
  const requesterAvatar = request?.requesterAvatar || DEFAULT_AVATAR;
  const requesterName = request?.requesterName || '-';

  return (
    <Card
      bg={cardBg}
      boxShadow="sm"
      border="1px solid"
      borderColor={borderColor}
      borderRadius="lg"
      overflow="hidden"
      transition="all 0.2s"
      _hover={{ transform: "translateY(-2px)", boxShadow: "md" }}
    >
      <Badge
        position="absolute"
        top={2}
        right={2}
        colorScheme={statusColor[application.status]}
        variant="solid"
        borderRadius="md"
        px={2}
        textTransform="capitalize"
        fontSize="xs"
      >
        {application.status}
      </Badge>

      <CardHeader pb={3}>
        <Flex justify="space-between" align="start">
          <VStack align="start" spacing={1}>
            <Heading size="sm" color={textColor}>
              {courseName}
            </Heading>
            <Text fontSize="xs" color={mutedText}>
              Applied: {new Date(application.createdAt).toLocaleDateString()}
            </Text>
          </VStack>
        </Flex>
      </CardHeader>

      <CardBody py={0}>
        <Grid templateColumns="repeat(2, 1fr)" gap={4} py={3}>
          <VStack align="start" spacing={2}>
            <Text fontSize="sm" fontWeight="medium" color={textColor}>Current Section</Text>
            <Tag size="md" colorScheme="blue" variant="subtle" minW="max-content">
              {currentSection || "-"}
            </Tag>
            <Text fontSize="sm" color={mutedText} mt={2}>Current Day</Text>
            <Text fontSize="sm" color={textColor}>{currentDay}</Text>
            <Text fontSize="sm" color={mutedText} mt={2}>Current Time</Text>
            <Text fontSize="sm" color={textColor}>{currentTime}</Text>
          </VStack>
          <VStack align="start" spacing={2}>
            <Text fontSize="sm" fontWeight="medium" color={textColor}>Desired Section</Text>
            <Tag size="md" colorScheme="green" variant="subtle" minW="max-content">
              {desiredSection || "-"}
            </Tag>
            <Text fontSize="sm" color={mutedText} mt={2}>Desired Day</Text>
            <Text fontSize="sm" color={textColor}>{desiredDay}</Text>
            <Text fontSize="sm" color={mutedText} mt={2}>Desired Time</Text>
            <Text fontSize="sm" color={textColor}>{desiredTime}</Text>
          </VStack>
        </Grid>

        <Box mt={2} p={3} bg={useColorModeValue("gray.50", "gray.700")} borderRadius="md">
          <Text fontSize="sm" fontWeight="medium" color={textColor}>Your Reason:</Text>
          <Text fontSize="sm" color={mutedText}>
            {application.reason}
          </Text>
        </Box>
      </CardBody>

      <CardFooter pt={3}>
        <Flex w="100%" justify="space-between" align="center">
          {onWithdraw && application.status === "pending" && (
            <>
              <Button
                size="sm"
                colorScheme="red"
                variant="outline"
                onClick={() => setIsWithdrawDialogOpen(true)}
                aria-label="Withdraw Application"
              >
                Withdraw
              </Button>
              <AlertDialog
                isOpen={isWithdrawDialogOpen}
                leastDestructiveRef={cancelRef}
                onClose={() => setIsWithdrawDialogOpen(false)}
              >
                <AlertDialogOverlay>
                  <AlertDialogContent>
                    <AlertDialogHeader fontSize="lg" fontWeight="bold">
                      Withdraw Application
                    </AlertDialogHeader>
                    <AlertDialogBody>
                      Are you sure you want to withdraw this application? This action cannot be undone.
                    </AlertDialogBody>
                    <AlertDialogFooter>
                      <Button ref={cancelRef} onClick={() => setIsWithdrawDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button colorScheme="red" ml={3} onClick={() => { setIsWithdrawDialogOpen(false); onWithdraw(application.id); }}>
                        Confirm
                      </Button>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialogOverlay>
              </AlertDialog>
            </>
          )}
        </Flex>
      </CardFooter>
    </Card>
  );
};

const Requests = forwardRef(({ onEditRequest }, ref) => {
  // Modal open/close
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Filters modal state (needs to be declared before it is referenced below)
  const {
    isOpen: isFiltersOpen,
    onOpen: openFilters,
    onClose: closeFilters
  } = useDisclosure();

  // Paginated course logic for modal
  const {
    courses,
    coursesLoading,
    coursesError,
    coursesPage,
    coursesTotalPages,
    setCoursesPage,
    fetchPaginatedCourses,
  } = usePaginatedCourses({ trigger: isOpen || isFiltersOpen });

  // Colors
  const bgColor = useColorModeValue("gray.50", "gray.900");
  const cardBg = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.800", "white");
  const mutedText = useColorModeValue("gray.600", "gray.400");
  const accentColor = useColorModeValue("yellow.400", "yellow.500");
  const borderColor = useColorModeValue("gray.100", "gray.700");



  // Pagination, sorting, and API state
  // Available Requests
  const [availableRequests, setAvailableRequests] = useState([]);
  const [availableRequestsPage, setAvailableRequestsPage] = useState(1);
  const [availableRequestsTotalPages, setAvailableRequestsTotalPages] = useState(1);
  const [availableRequestsSortBy, setAvailableRequestsSortBy] = useState("created_at");
  const [availableRequestsSortOrder, setAvailableRequestsSortOrder] = useState("desc");
  // My Requests
  const [myRequests, setMyRequests] = useState([]);
  const [myRequestsPage, setMyRequestsPage] = useState(1);
  const [myRequestsTotalPages, setMyRequestsTotalPages] = useState(1);
  const [myRequestsSortBy, setMyRequestsSortBy] = useState("created_at");
  const [myRequestsSortOrder, setMyRequestsSortOrder] = useState("desc");
  // My Applications (paginated)
  const [myApplications, setMyApplications] = useState([]);
  const [myApplicationsPage, setMyApplicationsPage] = useState(1);
  const [myApplicationsTotalPages, setMyApplicationsTotalPages] = useState(1);
  const [myApplicationsSortBy, setMyApplicationsSortBy] = useState("created_at");
  const [myApplicationsSortOrder, setMyApplicationsSortOrder] = useState("desc");
  const [isloading, setIsloading] = useState(true);



  // (filters disclosure declared above)
  const [filters, setFilters] = useState({
    course_code: '',
    current_day: '',
    desired_day: ''
  });
  const [filteredLoading, setFilteredLoading] = useState(false);

  // Expose fetch functions to parent component via ref
  useImperativeHandle(ref, () => ({
    fetchAvailableRequestsPaginated,
    fetchMyRequestsPaginated,
    fetchMyApplicationsPaginated
  }));

  // Courses for filter dropdown with pagination (for filter modal only)
  // If you have a filter modal with its own paginated course dropdown, you can keep this block,
  // but consider renaming the variables to avoid conflicts, e.g. filterCourses, filterCoursesLoading, etc.

  // Application state and modals
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [isViewApplicationsModalOpen, setIsViewApplicationsModalOpen] = useState(false);
  const [currentRequestId, setCurrentRequestId] = useState(null);
  const [applicationReason, setApplicationReason] = useState("");
  const [currentRequestApplications, setCurrentRequestApplications] = useState([]);

  // Fetch paginated data for Available Requests
  const fetchAvailableRequestsPaginated = async (page = 1, sortBy = availableRequestsSortBy, sortOrder = availableRequestsSortOrder) => {
    setIsloading(true);
    try {
      const res = await fetchAllRequests({ page, sort_by: sortBy, sort_order: sortOrder });
      setAvailableRequests(Array.isArray(res.data) ? res.data.map(mapApiRequest) : []);
      setAvailableRequestsTotalPages(res.last_page || 1);
      setAvailableRequestsPage(res.current_page || 1);
    } catch (error) {
      toast({
        title: "Failed to load available requests",
        description: error.message || "Please try again later",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsloading(false);
    }
  };

  // Fetch paginated data for My Requests
  const fetchMyRequestsPaginated = async (page = 1, sortBy = myRequestsSortBy, sortOrder = myRequestsSortOrder) => {
    setIsloading(true);
    try {
      const res = await fetchMyRequests({ page, sort_by: sortBy, sort_order: sortOrder });
      let mappedMyRequests = [];
      if (Array.isArray(res.data)) {
        mappedMyRequests = res.data.map(req => mapApiRequest(req, user));
      }
      setMyRequests(mappedMyRequests);
      setMyRequestsTotalPages(res.last_page || 1);
      setMyRequestsPage(res.current_page || 1);
    } catch (error) {
      toast({
        title: "Failed to load your requests",
        description: error.message || "Please try again later",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsloading(false);
    }
  };

  // Fetch My Applications (paginated)
  const fetchMyApplicationsPaginated = async (page = 1, sortBy = myApplicationsSortBy, sortOrder = myApplicationsSortOrder) => {
    setIsloading(true);
    try {
      const res = await fetchMyApplications({ page, sort_by: sortBy, sort_order: sortOrder });

      // Extract pagination metadata
      setMyApplicationsTotalPages(res.last_page || 1);
      setMyApplicationsPage(res.current_page || 1);

      const myApplicationsRes = res.data || [];

      // Map applications with their requests (fetch missing request details if needed)
      const requestIds = Array.isArray(myApplicationsRes) ? myApplicationsRes.map(app => app && app.request_id).filter(Boolean) : [];
      // Fetch all missing requests in parallel
      const requestDetails = await Promise.all(requestIds.map(id => fetchRequestById(id).catch(() => null)));
      const requestDetailsMap = {};
      requestDetails.forEach((req, idx) => {
        if (req && req.id) requestDetailsMap[req.id] = req;
      });
      const mappedApps = Array.isArray(myApplicationsRes) ? myApplicationsRes.map(app => {
        const mappedApp = mapApiApplicationData(app);
        // Prefer app.request if present, else use fetched details
        const reqData = app && app.request ? mapApiRequest(app.request) : (app && requestDetailsMap[app.request_id] ? mapApiRequest(requestDetailsMap[app.request_id]) : undefined);
        return {
          ...mappedApp,
          request: reqData
        };
      }) : [];
      setMyApplications(mappedApps);
    } catch (error) {
      toast({
        title: "Failed to load applications",
        description: error.message || "Please try again later",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsloading(false);
    }
  };

  // Fetch on mount and when page/sort changes
  useEffect(() => {
    fetchAvailableRequestsPaginated(availableRequestsPage, availableRequestsSortBy, availableRequestsSortOrder);
  }, [availableRequestsPage, availableRequestsSortBy, availableRequestsSortOrder]);

  useEffect(() => {
    fetchMyRequestsPaginated(myRequestsPage, myRequestsSortBy, myRequestsSortOrder);
  }, [myRequestsPage, myRequestsSortBy, myRequestsSortOrder]);

  useEffect(() => {
    fetchMyApplicationsPaginated(myApplicationsPage, myApplicationsSortBy, myApplicationsSortOrder);
  }, [myApplicationsPage, myApplicationsSortBy, myApplicationsSortOrder]);

  // Handle filter input change
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleApplyFilters = async () => {
    setFilteredLoading(true);
    try {
      const response = await fetchFilteredRequests({
        course_name: filters.course_code,
        current_day: filters.current_day,
        desired_day: filters.desired_day
      });
      setAvailableRequests(Array.isArray(response.data) ? response.data.map(mapApiRequest) : []);
      closeFilters();
    } catch (error) {
      toast({
        title: 'Failed to apply filters',
        description: error.message || 'Please try again later',
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setFilteredLoading(false);
    }
  };


  // Withdraw Application
  const handleWithdrawApplication = async (applicationId) => {
    try {
      await deleteApplication(applicationId);

      // Update My Applications list first
      setMyApplications(prev => prev.filter(app => app.id !== applicationId));

      // Refetch available requests to ensure the list is up-to-date
      fetchAvailableRequestsPaginated();

      toast({
        title: "Application withdrawn",
        description: "Your application has been successfully withdrawn.",
        status: "info",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Failed to withdraw application",
        description: error.message || "Please try again later",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  // Delete Request
  const handleDeleteRequest = async (requestId) => {
    if (!window.confirm("Are you sure you want to delete this request? This cannot be undone.")) return;
    try {
      await deleteSectionRequest(requestId);
      setMyRequests(prev => prev.filter(req => req.id !== requestId));
      toast({
        title: "Request deleted",
        status: "info",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Failed to delete request",
        description: error.message || "Please try again later",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  // Handle request actions
  const handleApplyToRequest = (requestId) => {
    setCurrentRequestId(requestId);
    setApplicationReason("");
    setIsApplyModalOpen(true);
  };

  const handleSubmitApplication = async () => {
    try {
      await applyToRequest(currentRequestId, { reason: applicationReason });

      // Update UI optimistically
      setAvailableRequests(prev =>
        prev.map(req =>
          req.id === currentRequestId
            ? {
              ...req,
              applications: [
                ...(req.applications || []),
                {
                  id: Date.now().toString(), // Temporary ID
                  userId: user.id,
                  userName: "You",
                  userAvatar: DEFAULT_AVATAR,
                  reason: applicationReason,
                  createdAt: new Date().toISOString(),
                  status: "pending"
                }
              ]
            }
            : req
        )
      );

      // Immediately re-fetch the user's applications to ensure UI is up-to-date
      await fetchMyApplicationsPaginated();

      toast({
        title: "Application submitted",
        description: "Your application has been submitted to the request owner.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      setIsApplyModalOpen(false);
      setApplicationReason("");
      setCurrentRequestId(null);
    } catch (error) {
      toast({
        title: "Failed to submit application",
        description: error.message || "Please try again later",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleViewApplications = async (requestId) => {
    try {
      const applications = await fetchApplicationsForRequest(requestId);
      setCurrentRequestId(requestId);
      setCurrentRequestApplications(applications.map(mapApiApplicationData));
      setIsViewApplicationsModalOpen(true);
    } catch (error) {
      toast({
        title: "Failed to load applications",
        description: error.message || "Please try again later",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleAcceptApplication = async (applicationId) => {
    try {
      await approveApplication(applicationId, { status: "accepted" });

      // Update UI optimistically
      const updatedApplications = currentRequestApplications.map(app =>
        app.id === applicationId
          ? { ...app, status: "accepted" }
          : { ...app, status: app.status === "pending" ? "declined" : app.status }
      );
      setCurrentRequestApplications(updatedApplications);

      setMyRequests(prev =>
        prev.map(req => {
          if (req.id === currentRequestId) {
            return {
              ...req,
              status: "accepted",
              applications: updatedApplications
            };
          }
          return req;
        })
      );

      setIsViewApplicationsModalOpen(false);

      toast({
        title: "Application accepted",
        description: "You have accepted the application for your class exchange request.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Failed to accept application",
        description: error.message || "Please try again later",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleDeclineApplication = async (applicationId) => {
    try {
      await approveApplication(applicationId, { status: "declined" });

      // Update UI optimistically
      const updatedApplications = currentRequestApplications.map(app =>
        app.id === applicationId
          ? { ...app, status: "declined" }
          : app
      );
      setCurrentRequestApplications(updatedApplications);

      setMyRequests(prev =>
        prev.map(req => {
          if (req.id === currentRequestId) {
            return {
              ...req,
              applications: updatedApplications
            };
          }
          return req;
        })
      );

      toast({
        title: "Application declined",
        description: "You have declined the application for your class exchange request.",
        status: "info",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Failed to decline application",
        description: error.message || "Please try again later",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleCancelRequest = async (requestId) => {
    try {
      await updateSectionRequest(requestId, { status: "cancelled" });

      // Update UI optimistically
      setMyRequests(prev =>
        prev.map(req =>
          req.id === requestId
            ? { ...req, status: "cancelled" }
            : req
        )
      );

      toast({
        title: "Request cancelled",
        description: "Your class exchange request has been cancelled.",
        status: "info",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Failed to cancel request",
        description: error.message || "Please try again later",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <Box minH="100vh" bg={bgColor} p={{ base: 4, md: 6 }}>
      <Container maxW="7xl">
        {/* Header Section */}
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
            <Heading size="lg" color={textColor}>Class Exchange Requests</Heading>
            <Text fontSize="sm" color={mutedText}>
              Manage your class time exchange requests
            </Text>
          </VStack>
        </Flex>

        {/* Main Content */}
        <Box bg={cardBg} borderRadius="xl" boxShadow="sm" borderWidth="1px" borderColor={borderColor}>
          {/* Filters Button and Modal */}
          <Flex justify="flex-end" p={6} borderBottomWidth="1px" borderColor={borderColor}>
            <Button
              colorScheme="yellow"
              leftIcon={<FiFilter />}
              mr={3}
              onClick={openFilters}
            >
              Filters
            </Button>
            <Button
              leftIcon={<FiPlus />}
              onClick={onOpen}
              colorScheme="yellow"
              size="md"
            >
              New Request
            </Button>
          </Flex>
          {/* Filter Modal */}
          <Modal isOpen={isFiltersOpen} onClose={closeFilters} isCentered>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Filter Requests</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <Stack spacing={4}>
                  <FormControl>
                    <FormLabel>Course</FormLabel>
                    <Menu isLazy>
                      <MenuButton as={Button} width="100%" rightIcon={<span style={{ marginLeft: 8 }}>&#x25BC;</span>} isLoading={coursesLoading} isDisabled={coursesLoading || !!coursesError} textAlign="left">
                        {filters.course_code
                          ? (() => {
                            const selected = courses.find(c => c.code === filters.course_code);
                            return selected ? `${selected.code} - ${selected.title}` : filters.course_code;
                          })()
                          : (coursesLoading ? 'Loading courses...' : 'Select course')}
                      </MenuButton>
                      <MenuList maxH="250px" overflowY="auto" minW="250px" px={0}>
                        {coursesError ? (
                          <MenuItem isDisabled>Failed to load courses</MenuItem>
                        ) : courses.length === 0 && !coursesLoading ? (
                          <MenuItem isDisabled>No courses found</MenuItem>
                        ) : (
                          courses.map(course => (
                            <MenuItem
                              key={course.id}
                              value={course.title}
                              onClick={() => setFilters(f => ({ ...f, course_code: course.code }))}
                              _active={{ bg: 'gray.100' }}
                              _selected={{ fontWeight: 'bold', bg: 'gray.200' }}
                              style={filters.course_code === course.code ? { fontWeight: 'bold', background: '#f7fafc' } : {}}
                            >
                              {course.code ? `${course.code} - ${course.title}` : course.title}
                            </MenuItem>
                          ))
                        )}
                        <Box borderTop="1px solid #eee" mt={2} pt={2} px={2}>
                          <Flex justify="space-between" align="center">
                            <Button size="xs" onClick={e => { e.stopPropagation(); setCoursesPage(p => Math.max(1, p - 1)); }} isDisabled={coursesLoading || coursesPage <= 1}>
                              Prev
                            </Button>
                            <Text fontSize="xs">Page {coursesPage} of {coursesTotalPages}</Text>
                            <Button size="xs" onClick={e => { e.stopPropagation(); setCoursesPage(p => Math.min(coursesTotalPages, p + 1)); }} isDisabled={coursesLoading || coursesPage >= coursesTotalPages}>
                              Next
                            </Button>
                          </Flex>
                        </Box>
                      </MenuList>
                    </Menu>
                  </FormControl>
                  <FormControl>
                    <FormLabel>Current Day</FormLabel>
                    <Select
                      placeholder="Select current day"
                      name="current_day"
                      value={filters.current_day}
                      onChange={handleFilterChange}
                    >
                      <option value="Monday">Monday</option>
                      <option value="Tuesday">Tuesday</option>
                      <option value="Wednesday">Wednesday</option>
                      <option value="Thursday">Thursday</option>
                      <option value="Friday">Friday</option>
                    </Select>
                  </FormControl>
                  <FormControl>
                    <FormLabel>Desired Day</FormLabel>
                    <Select
                      placeholder="Select desired day"
                      name="desired_day"
                      value={filters.desired_day}
                      onChange={handleFilterChange}
                    >
                      <option value="Monday">Monday</option>
                      <option value="Tuesday">Tuesday</option>
                      <option value="Wednesday">Wednesday</option>
                      <option value="Thursday">Thursday</option>
                      <option value="Friday">Friday</option>
                    </Select>
                  </FormControl>
                </Stack>
              </ModalBody>
              <ModalFooter>
                <Button onClick={closeFilters} mr={3} variant="ghost">
                  Cancel
                </Button>
                <Button
                  colorScheme="yellow"
                  onClick={handleApplyFilters}
                  isLoading={filteredLoading}
                >
                  Apply Filters
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>

          <Tabs variant="soft-rounded" colorScheme="yellow">
            <TabList px={6} pt={4}>
              <Tab fontSize="sm" _selected={{ fontWeight: "semibold", color: textColor }}>
                Available
              </Tab>
              <Tab fontSize="sm" _selected={{ fontWeight: "semibold", color: textColor }}>
                My Requests ({myRequests.length})
              </Tab>
              <Tab fontSize="sm" _selected={{ fontWeight: "semibold", color: textColor }}>
                My Applications
              </Tab>
            </TabList>

            <TabPanels p={6}>
              {/* Available Requests Panel */}
              <TabPanel p={0}>
                {isloading ? (
                  <Flex justify="center" py={10}>
                    <Spinner size="xl" />
                  </Flex>
                ) : availableRequests.length > 0 ? (
                  <>
                    <Grid
                      templateColumns={{
                        base: "1fr",
                        md: "repeat(2, 1fr)",
                        xl: "repeat(3, 1fr)"
                      }}
                      gap={6}
                    >
                      {availableRequests.map(request => (
                        <RequestCard
                          key={request.id}
                          request={request}
                          userId={user.id}
                          onApply={handleApplyToRequest}
                          onViewApplications={handleViewApplications}
                          onEdit={onEditRequest}
                          onDelete={handleDeleteRequest}
                        />
                      ))}
                    </Grid>
                    <Pagination
                      currentPage={availableRequestsPage}
                      totalPages={availableRequestsTotalPages}
                      onPageChange={setAvailableRequestsPage}
                      isLoading={isloading}
                    />
                  </>
                ) : (
                  <Box
                    p={12}
                    textAlign="center"
                    borderWidth="2px"
                    borderStyle="dashed"
                    borderColor={borderColor}
                    borderRadius="lg"
                  >
                    <Text color={mutedText}>No available requests at this time</Text>
                  </Box>
                )}
              </TabPanel>

              {/* My Requests Panel */}
              <TabPanel p={0}>
                {isloading ? (
                  <Flex justify="center" py={10}>
                    <Spinner size="xl" />
                  </Flex>
                ) : myRequests.length > 0 ? (
                  <>
                    <Grid
                      templateColumns={{
                        base: "1fr",
                        md: "repeat(2, 1fr)",
                        xl: "repeat(3, 1fr)"
                      }}
                      gap={6}
                    >
                      {myRequests.map(request => (
                        <RequestCard
                          key={request.id}
                          request={request}
                          userId={user.id}
                          onCancel={handleCancelRequest}
                          onDelete={handleDeleteRequest}
                          onViewApplications={handleViewApplications}
                          onEdit={onEditRequest}
                        />
                      ))}
                    </Grid>
                    <Pagination
                      currentPage={myRequestsPage}
                      totalPages={myRequestsTotalPages}
                      onPageChange={setMyRequestsPage}
                      isLoading={isloading}
                    />
                  </>
                ) : (
                  <Box
                    p={12}
                    textAlign="center"
                    borderWidth="2px"
                    borderStyle="dashed"
                    borderColor={borderColor}
                    borderRadius="lg"
                  >
                    <Text color={mutedText}>No personal requests found</Text>
                  </Box>
                )}
              </TabPanel>

              {/* My Applications Panel */}
              <TabPanel p={0}>
                {isloading ? (
                  <Flex justify="center" py={10}>
                    <Spinner size="xl" />
                  </Flex>
                ) : myApplications.length > 0 ? (
                  <>
                    <Grid
                      templateColumns={{
                        base: "1fr",
                        md: "repeat(2, 1fr)",
                        xl: "repeat(3, 1fr)"
                      }}
                      gap={6}
                      mb={6}
                    >
                      {myApplications.map(application => (
                        <ApplicationCard
                          key={application.id}
                          application={application}
                          onWithdraw={handleWithdrawApplication}
                        />
                      ))}
                    </Grid>

                    {/* Pagination Controls */}
                    <Flex justify="center" mt={6} mb={4}>
                      <ButtonGroup isAttached variant="outline" size="sm">
                        <IconButton
                          icon={<FiChevronLeft />}
                          isDisabled={myApplicationsPage <= 1}
                          onClick={() => setMyApplicationsPage(prev => Math.max(prev - 1, 1))}
                          aria-label="Previous page"
                        />
                        <Button isDisabled>
                          Page {myApplicationsPage} of {myApplicationsTotalPages}
                        </Button>
                        <IconButton
                          icon={<FiChevronRight />}
                          isDisabled={myApplicationsPage >= myApplicationsTotalPages}
                          onClick={() => setMyApplicationsPage(prev => Math.min(prev + 1, myApplicationsTotalPages))}
                          aria-label="Next page"
                        />
                      </ButtonGroup>
                    </Flex>
                  </>
                ) : (
                  <Box
                    p={12}
                    textAlign="center"
                    borderWidth="2px"
                    borderStyle="dashed"
                    borderColor={borderColor}
                    borderRadius="lg"
                  >
                    <Text color={mutedText}>No applications submitted yet</Text>
                  </Box>
                )}
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
      </Container>

      {/* Unified Request Modal for Create and Edit */}
      <RequestModal
        isOpen={isOpen}
        onClose={onClose}
        mode="create"
        initialData={{}}
        onSubmit={async (values) => {
          try {
            const newRequest = await createSectionRequest({
              course_name: values.courseName,
              current_section: values.currentSection,
              desired_section: values.desiredSection,
              current_day: values.currentDay,
              current_time: values.currentTime,
              desired_day: values.desiredDay,
              desired_time: values.desiredTime,
              reason: values.reason
            });
            // Refresh lists to ensure new request appears immediately
            await fetchAvailableRequestsPaginated();
            await fetchMyRequestsPaginated();
            toast({
              title: "Request created",
              description: "Your class exchange request has been submitted.",
              status: "success",
              duration: 3000,
              isClosable: true,
            });
            onClose();
          } catch (error) {
            toast({
              title: "Failed to create request",
              description: error.response?.data?.message || "Please try again later",
              status: "error",
              duration: 5000,
              isClosable: true,
            });
          }
        }}
        isLoading={false}
        courses={courses}
        coursesLoading={coursesLoading}
        coursesError={coursesError}
        coursesPage={coursesPage}
        coursesTotalPages={coursesTotalPages}
        onCoursePageChange={setCoursesPage}
      />

      {/* Apply to Request Modal */}
      <Modal isOpen={isApplyModalOpen} onClose={() => setIsApplyModalOpen(false)} size="md">
        <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(5px)" />
        <ModalContent bg={cardBg} borderRadius="xl">
          <ModalHeader color={textColor}>Apply for Class Exchange</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4} align="stretch">
              <Text fontSize="sm" color={mutedText}>
                Submit your application to exchange class times with the requester. The requester will review all applications and select one to accept.
              </Text>

              <FormControl isRequired>
                <FormLabel color={textColor}>Why do you want to exchange?</FormLabel>
                <Textarea
                  value={applicationReason}
                  onChange={(e) => setApplicationReason(e.target.value)}
                  placeholder="Explain why this exchange works for you..."
                  color={textColor}
                  resize="vertical"
                  rows={3}
                />
              </FormControl>
            </VStack>

            <Flex justify="flex-end" mt={6} gap={3}>
              <Button variant="ghost" onClick={() => setIsApplyModalOpen(false)}>Cancel</Button>
              <Button
                type="button"
                colorScheme="green"
                isDisabled={!applicationReason.trim()}
                onClick={handleSubmitApplication}
              >
                Submit Application
              </Button>
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* View Applications Modal */}
      <Modal
        isOpen={isViewApplicationsModalOpen}
        onClose={() => setIsViewApplicationsModalOpen(false)}
        size="xl"
      >
        <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(5px)" />
        <ModalContent bg={cardBg} borderRadius="xl">
          <ModalHeader color={textColor}>Applications for Your Request</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {currentRequestApplications.length > 0 ? (
              <VStack spacing={4} align="stretch">
                {currentRequestApplications.map(app => (
                  <Card
                    key={app.id}
                    p={4}
                    borderRadius="md"
                    borderWidth="1px"
                    borderColor={borderColor}
                    position="relative"
                  >
                    {app.status !== "pending" && (
                      <Badge
                        position="absolute"
                        top={2}
                        right={2}
                        colorScheme={app.status === "accepted" ? "green" : "red"}
                        variant="solid"
                        borderRadius="md"
                        px={2}
                        textTransform="capitalize"
                        fontSize="xs"
                      >
                        {app.status}
                      </Badge>
                    )}
                    <Flex mb={3}>
                      <Avatar size="sm" src={app.userAvatar} name={app.user?.name} mr={3} />
                      <VStack align="start" spacing={0}>
                        <Text fontWeight="medium" color={textColor}>
                          {app.userName}
                        </Text>
                        <Text fontSize="xs" color={mutedText}>
                          Applied: {new Date(app.createdAt).toLocaleDateString()}
                        </Text>
                      </VStack>
                    </Flex>
                    <Box
                      p={3}
                      bg={useColorModeValue("gray.50", "gray.700")}
                      borderRadius="md"
                      mb={3}
                    >
                      <Text fontSize="sm" color={mutedText}>
                        {app.reason}
                      </Text>
                    </Box>
                    {app.status === "pending" && (
                      <Flex justifyContent="flex-end" gap={2}>
                        <Button
                          size="sm"
                          colorScheme="green"
                          onClick={() => handleAcceptApplication(app.id)}
                        >
                          Accept
                        </Button>
                        <Button
                          size="sm"
                          colorScheme="red"
                          variant="outline"
                          onClick={() => handleDeclineApplication(app.id)}
                        >
                          Decline
                        </Button>
                      </Flex>
                    )}
                  </Card>
                ))}
              </VStack>
            ) : (
              <Box
                p={8}
                textAlign="center"
                borderWidth="2px"
                borderStyle="dashed"
                borderColor={borderColor}
                borderRadius="lg"
              >
                <Text color={mutedText}>No applications received yet</Text>
              </Box>
            )}
          </ModalBody>
          <ModalFooter>
            <Button onClick={() => setIsViewApplicationsModalOpen(false)}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
});

// Unified Request Modal for Create and Edit
function RequestModal({
  isOpen,
  onClose,
  mode = 'create', // 'create' | 'edit'
  initialData = {},
  onSubmit,
  isLoading,
  courses = [],
  coursesLoading = false,
  coursesError = null,
  coursesPage = 1,
  coursesTotalPages = 1,
  onCoursePageChange,
}) {
  const emptyForm = {
    id: '',
    courseName: '',
    currentSection: '',
    desiredSection: '',
    currentDay: '',
    currentTime: '',
    desiredDay: '',
    desiredTime: '',
    reason: '',
  };
  const [form, setForm] = useState({ ...emptyForm, ...initialData });
  useEffect(() => {
    setForm({ ...emptyForm, ...initialData });
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(5px)" />
      <ModalContent borderRadius="xl">
        <ModalHeader>{mode === 'edit' ? 'Edit Exchange Request' : 'Create Exchange Request'}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Alert status="info" variant="left-accent" mb={4} borderRadius="md">
            <AlertIcon />
            <Text fontSize="sm">You can only make up to 2 exchange requests per day.</Text>
          </Alert>
          <form onSubmit={handleSubmit}>
            <Stack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Course</FormLabel>
                <Menu isLazy>
                  <MenuButton as={Button} w="100%" rightIcon={<span style={{ marginLeft: 8 }}>&#9660;</span>} isLoading={coursesLoading} isDisabled={coursesLoading} variant="outline" textAlign="left">
                    {form.courseName
                      ? (courses.find(c => (c.code || c.name) === form.courseName)?.code
                        ? `${courses.find(c => (c.code || c.name) === form.courseName)?.code} - ${courses.find(c => (c.code || c.name) === form.courseName)?.title}`
                        : courses.find(c => (c.code || c.name) === form.courseName)?.name)
                      : (coursesLoading ? 'Loading courses...' : 'Select course')}
                  </MenuButton>
                  <MenuList maxH="320px" overflowY="auto" minW="320px" px={0}>
                    {coursesError && (
                      <Box px={4} py={2}><Text color="red.500" fontSize="sm">{coursesError}</Text></Box>
                    )}
                    {coursesLoading ? (
                      <Box px={4} py={2}><Text fontSize="sm">Loading...</Text></Box>
                    ) : (
                      courses.length === 0 ? (
                        <Box px={4} py={2}><Text fontSize="sm" color="gray.500">No courses found.</Text></Box>
                      ) : (
                        courses.map((course) => (
                          <MenuItem
                            key={course.id || course.code}
                            value={course.code || course.name}
                            onClick={() => setForm(f => ({ ...f, courseName: course.code || course.name }))}
                            bg={(course.code || course.name) === form.courseName ? 'blue.50' : undefined}
                            fontWeight={(course.code || course.name) === form.courseName ? 'bold' : 'normal'}
                          >
                            {course.code ? `${course.code} - ${course.title}` : course.name}
                          </MenuItem>
                        ))
                      )
                    )}
                    <Box borderTop="1px solid" borderColor="gray.100" mt={2} px={2} py={1}>
                      <Pagination
                        currentPage={coursesPage}
                        totalPages={coursesTotalPages}
                        onPageChange={onCoursePageChange}
                        isLoading={coursesLoading}
                      />
                    </Box>
                  </MenuList>
                </Menu>
              </FormControl>

              <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                <FormControl isRequired>
                  <FormLabel>Current Section</FormLabel>
                  <Input
                    name="currentSection"
                    value={form.currentSection}
                    onChange={handleChange}
                    placeholder="e.g., A, B, C"
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Desired Section</FormLabel>
                  <Input
                    name="desiredSection"
                    value={form.desiredSection}
                    onChange={handleChange}
                    placeholder="e.g., B, C, D"
                  />
                </FormControl>
              </Grid>

              <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                <FormControl isRequired>
                  <FormLabel>Current Day</FormLabel>
                  <Select
                    name="currentDay"
                    value={form.currentDay}
                    onChange={handleChange}
                    placeholder="Select day"
                  >
                    <option value="Monday">Monday</option>
                    <option value="Tuesday">Tuesday</option>
                    <option value="Wednesday">Wednesday</option>
                    <option value="Thursday">Thursday</option>
                    <option value="Friday">Friday</option>
                  </Select>
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Current Time</FormLabel>
                  <Input
                    name="currentTime"
                    value={form.currentTime}
                    onChange={handleChange}
                    type="time"
                  />
                </FormControl>
              </Grid>

              <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                <FormControl isRequired>
                  <FormLabel>Desired Day</FormLabel>
                  <Select
                    name="desiredDay"
                    value={form.desiredDay}
                    onChange={handleChange}
                    placeholder="Select day"
                  >
                    <option value="Monday">Monday</option>
                    <option value="Tuesday">Tuesday</option>
                    <option value="Wednesday">Wednesday</option>
                    <option value="Thursday">Thursday</option>
                    <option value="Friday">Friday</option>
                  </Select>
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Desired Time</FormLabel>
                  <Input
                    name="desiredTime"
                    value={form.desiredTime}
                    onChange={handleChange}
                    type="time"
                  />
                </FormControl>
              </Grid>

              <FormControl>
                <FormLabel>Reason (Optional)</FormLabel>
                <Textarea
                  name="reason"
                  value={form.reason}
                  onChange={handleChange}
                  placeholder="Explain why you need to exchange class times..."
                  resize="vertical"
                  rows={2}
                />
              </FormControl>
            </Stack>

            <Flex justify="flex-end" mt={6} gap={3}>
              <Button variant="ghost" onClick={onClose}>Cancel</Button>
              <Button
                type="submit"
                colorScheme={mode === 'edit' ? 'blue' : 'yellow'}
                isLoading={isLoading}
              >
                {mode === 'edit' ? 'Update' : 'Create Request'}
              </Button>
            </Flex>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}


// Render modal at root
function RequestsWithEditModal(props) {
  const requestsRef = useRef();
  const toast = useToast();
  // Modal course pagination for edit modal only
  const {
    courses,
    coursesLoading,
    coursesError,
    coursesPage,
    coursesTotalPages,
    setCoursesPage,
    fetchPaginatedCourses,
  } = usePaginatedCourses({ trigger: props.editRequestModalOpen });

  const [editRequestModalOpen, setEditRequestModalOpen] = useState(false);
  const [editRequestData, setEditRequestData] = useState(null);
  const [editRequestLoading, setEditRequestLoading] = useState(false);

  // Handler to open edit modal
  const handleEditRequest = (request) => {
    setEditRequestData(request);
    setEditRequestModalOpen(true);
  };

  // Handler to submit update
  const handleUpdateRequest = async (values) => {
    setEditRequestLoading(true);
    try {
      const payload = {
        course_name: values.courseName,
        current_section: values.currentSection,
        desired_section: values.desiredSection,
        current_day: values.currentDay,
        desired_day: values.desiredDay,
        current_time: values.currentTime,
        desired_time: values.desiredTime,
        reason: values.reason,
      };
      await updateSectionRequest(values.id, payload);
      setEditRequestModalOpen(false);
      setEditRequestData(null);
      if (requestsRef.current) {
        requestsRef.current.fetchAvailableRequestsPaginated();
        requestsRef.current.fetchMyRequestsPaginated();
      }
      toast({ title: 'Request updated', status: 'success', duration: 3000, isClosable: true });
    } catch (err) {
      toast({ title: 'Failed to update request', description: err.message, status: 'error', duration: 4000, isClosable: true });
    } finally {
      setEditRequestLoading(false);
    }
  };

  return <>
    <Requests ref={requestsRef} onEditRequest={handleEditRequest} />
    <RequestModal
      isOpen={editRequestModalOpen}
      onClose={() => setEditRequestModalOpen(false)}
      mode="edit"
      initialData={editRequestData || {}}
      onSubmit={handleUpdateRequest}
      isLoading={editRequestLoading}
      courses={courses}
      coursesLoading={coursesLoading}
      coursesError={coursesError}
      coursesPage={coursesPage}
      coursesTotalPages={coursesTotalPages}
      onCoursePageChange={setCoursesPage}
    />
  </>;
}

export default RequestsWithEditModal;