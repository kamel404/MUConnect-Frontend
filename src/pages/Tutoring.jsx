import { useState, useEffect, useCallback } from "react";
import {
  Box, Flex, Heading, Text, Button, Stack, Badge, Avatar,
  Input, Select, Textarea, SimpleGrid, Skeleton, Divider,
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody,
  ModalFooter, ModalCloseButton, useDisclosure, useToast,
  useColorModeValue, Tabs, TabList, Tab, TabPanels, TabPanel,
  Icon, HStack, VStack, Tag, TagLabel, Tooltip, Switch,
  FormControl, FormLabel, FormErrorMessage, Alert, AlertIcon,
  AlertDescription,
  Menu, MenuButton, MenuList, MenuItem, InputGroup, InputLeftElement,
} from "@chakra-ui/react";
import {
  FiAward, FiPlus, FiSearch, FiMonitor, FiMapPin, FiBookOpen,
  FiEdit2, FiTrash2, FiCheck, FiX, FiSend, FiInbox, FiUser,
  FiClock, FiChevronLeft, FiChevronRight, FiChevronDown,
} from "react-icons/fi";
import {
  fetchTutoringOffers, fetchMyTutoringOffers, createTutoringOffer,
  updateTutoringOffer, deleteTutoringOffer, sendTutoringRequest,
  fetchIncomingTutoringRequests, fetchOutgoingTutoringRequests,
  updateTutoringRequest, withdrawTutoringRequest,
} from "../services/tutoringService";
import { fetchCourses } from "../services/courseService";

const GRADE_OPTIONS = ["A+", "A", "A-", "B+", "B", "B-", "C+", "C", "C-", "D", "Pass"];
const MODE_LABELS = { online: "Online", in_person: "In-Person", both: "Both" };
const STATUS_COLORS = { pending: "yellow", accepted: "green", rejected: "red" };
const COURSES_PER_PAGE = 10;

const emptyOffer = {
  title: "", course_id: "", description: "", grade_achieved: "", mode: "both", availability: "",
};

const getCourseLabel = (course) => {
  if (!course) return "Course";
  return course.code && course.title ? `${course.code} - ${course.title}` : (course.title || course.name || course.code || "Course");
};

export default function Tutoring() {
  const toast = useToast();

  // Colors
  const cardBg       = useColorModeValue("white", "gray.700");
  const pageBg       = useColorModeValue("gray.50", "gray.900");
  const borderColor  = useColorModeValue("gray.200", "gray.600");
  const textColor    = useColorModeValue("gray.800", "whiteAlpha.900");
  const mutedText    = useColorModeValue("gray.500", "gray.400");
  const accentBg     = useColorModeValue("blue.50", "blue.900");
  const accentColor  = useColorModeValue("blue.600", "blue.300");
  const goldColor    = useColorModeValue("yellow.500", "yellow.300");
  const menuBg       = useColorModeValue("white", "gray.800");

  // Tabs
  const [activeTab, setActiveTab] = useState(0);

  // Browse state
  const [offers, setOffers]               = useState([]);
  const [browsePage, setBrowsePage]       = useState(1);
  const [browseTotalPages, setBrowseTotal]= useState(1);
  const [browseLoading, setBrowseLoading] = useState(true);
  const [searchTerm, setSearchTerm]       = useState("");
  const [filterCourse, setFilterCourse]   = useState("");
  const [filterMode, setFilterMode]       = useState("");
  const [filterCourseSearch, setFilterCourseSearch] = useState("");

  // My offers state
  const [myOffers, setMyOffers]               = useState([]);
  const [myPage, setMyPage]                   = useState(1);
  const [myTotalPages, setMyTotalPages]       = useState(1);
  const [myOffersLoading, setMyOffersLoading] = useState(false);

  // Requests state
  const [incoming, setIncoming]               = useState([]);
  const [outgoing, setOutgoing]               = useState([]);
  const [requestsLoading, setRequestsLoading] = useState(false);
  const [requestsTab, setRequestsTab]         = useState(0);

  // Paginated courses for browse filter
  const [browseCourses, setBrowseCourses] = useState([]);
  const [browseCoursesLoading, setBrowseCoursesLoading] = useState(false);
  const [browseCoursesPage, setBrowseCoursesPage] = useState(1);
  const [browseCoursesTotalPages, setBrowseCoursesTotalPages] = useState(1);

  // Create / Edit modal
  const { isOpen: isFormOpen, onOpen: onFormOpen, onClose: onFormClose } = useDisclosure();
  const [formData, setFormData]   = useState(emptyOffer);
  const [editingId, setEditingId] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [formCourseSearch, setFormCourseSearch] = useState("");
  const [formCourses, setFormCourses] = useState([]);
  const [formCoursesLoading, setFormCoursesLoading] = useState(false);
  const [formCoursesPage, setFormCoursesPage] = useState(1);
  const [formCoursesTotalPages, setFormCoursesTotalPages] = useState(1);

  // Delete confirm modal
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
  const [deletingId, setDeletingId] = useState(null);

  // Request modal
  const { isOpen: isRequestOpen, onOpen: onRequestOpen, onClose: onRequestClose } = useDisclosure();
  const [requestTarget, setRequestTarget]   = useState(null);
  const [requestMessage, setRequestMessage] = useState("");
  const [requestSubmitting, setRequestSubmitting] = useState(false);

  // Course loaders (paginated)
  const buildCourseParams = (page, search) => {
    const major_id = localStorage.getItem("major_id");
    const faculty_id = localStorage.getItem("faculty_id");
    return {
      ...(major_id ? { major_id } : {}),
      ...(faculty_id ? { faculty_id } : {}),
      page,
      per_page: COURSES_PER_PAGE,
      ...(search.trim() ? { search: search.trim() } : {}),
    };
  };

  const loadBrowseCourses = useCallback(async (page = 1, search = "") => {
    setBrowseCoursesLoading(true);
    try {
      const res = await fetchCourses(buildCourseParams(page, search));
      setBrowseCourses(res.data || []);
      setBrowseCoursesPage(res.current_page || 1);
      setBrowseCoursesTotalPages(res.last_page || 1);
    } catch {
      toast({ title: "Failed to load courses", status: "error", duration: 3000, isClosable: true });
    } finally {
      setBrowseCoursesLoading(false);
    }
  }, [toast]);

  const loadFormCourses = useCallback(async (page = 1, search = "") => {
    setFormCoursesLoading(true);
    try {
      const res = await fetchCourses(buildCourseParams(page, search));
      setFormCourses(res.data || []);
      setFormCoursesPage(res.current_page || 1);
      setFormCoursesTotalPages(res.last_page || 1);
    } catch {
      toast({ title: "Failed to load courses", status: "error", duration: 3000, isClosable: true });
    } finally {
      setFormCoursesLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadBrowseCourses(1, "");
    loadFormCourses(1, "");
  }, [loadBrowseCourses, loadFormCourses]);

  // ── Browse offers ───────────────────────────────────────────────────────────
  const loadOffers = useCallback(async (page = 1, q = searchTerm, course = filterCourse, mode = filterMode) => {
    setBrowseLoading(true);
    try {
      const params = { page, per_page: 8 };
      if (q.trim())  params.q = q.trim();
      if (course)    params.course_id = course;
      if (mode)      params.mode = mode;
      const res = await fetchTutoringOffers(params);
      setOffers(res.data || []);
      setBrowsePage(res.current_page);
      setBrowseTotal(res.last_page);
    } catch {
      toast({ title: "Failed to load offers", status: "error", duration: 3000, isClosable: true });
    } finally {
      setBrowseLoading(false);
    }
  }, [searchTerm, filterCourse, filterMode, toast]);

  useEffect(() => {
    if (activeTab === 0) loadOffers(1);
  }, [activeTab]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (activeTab === 0) loadOffers(1, searchTerm, filterCourse, filterMode);
    }, 450);
    return () => clearTimeout(timer);
  }, [searchTerm, filterCourse, filterMode]);

  // ── My Offers ───────────────────────────────────────────────────────────────
  const loadMyOffers = useCallback(async (page = 1) => {
    setMyOffersLoading(true);
    try {
      const res = await fetchMyTutoringOffers({ page, per_page: 8 });
      setMyOffers(res.data || []);
      setMyPage(res.current_page);
      setMyTotalPages(res.last_page);
    } catch {
      toast({ title: "Failed to load your offers", status: "error", duration: 3000, isClosable: true });
    } finally {
      setMyOffersLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    if (activeTab === 1) loadMyOffers(1);
  }, [activeTab]);

  // ── Requests ────────────────────────────────────────────────────────────────
  const loadRequests = useCallback(async () => {
    setRequestsLoading(true);
    try {
      const [inc, out] = await Promise.all([
        fetchIncomingTutoringRequests({ per_page: 50 }),
        fetchOutgoingTutoringRequests({ per_page: 50 }),
      ]);
      setIncoming(inc.data || []);
      setOutgoing(out.data || []);
    } catch {
      toast({ title: "Failed to load requests", status: "error", duration: 3000, isClosable: true });
    } finally {
      setRequestsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    if (activeTab === 2) loadRequests();
  }, [activeTab]);

  // ── Form helpers ────────────────────────────────────────────────────────────
  const validateForm = () => {
    const errs = {};
    if (!formData.title.trim())   errs.title = "Title is required";
    if (!formData.course_id)      errs.course_id = "Course is required";
    if (!formData.mode)           errs.mode = "Mode is required";
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const openCreate = () => {
    setFormData(emptyOffer);
    setFormErrors({});
    setEditingId(null);
    setFormCourseSearch("");
    loadFormCourses(1, "");
    onFormOpen();
  };

  const openEdit = (offer) => {
    setFormData({
      title: offer.title,
      course_id: String(offer.course_id),
      description: offer.description || "",
      grade_achieved: offer.grade_achieved || "",
      mode: offer.mode,
      availability: offer.availability || "",
    });
    setFormErrors({});
    setEditingId(offer.id);
    setFormCourseSearch("");
    loadFormCourses(1, "");
    onFormOpen();
  };

  useEffect(() => {
    const timer = setTimeout(() => loadBrowseCourses(1, filterCourseSearch), 350);
    return () => clearTimeout(timer);
  }, [filterCourseSearch, loadBrowseCourses]);

  useEffect(() => {
    const timer = setTimeout(() => loadFormCourses(1, formCourseSearch), 350);
    return () => clearTimeout(timer);
  }, [formCourseSearch, loadFormCourses]);

  const handleFormSubmit = async () => {
    if (!validateForm()) return;
    setSubmitting(true);
    try {
      const payload = { ...formData, course_id: parseInt(formData.course_id) };
      if (editingId) {
        const updated = await updateTutoringOffer(editingId, payload);
        setMyOffers(prev => prev.map(o => o.id === editingId ? updated : o));
        toast({ title: "Offer updated", status: "success", duration: 3000, isClosable: true });
      } else {
        const created = await createTutoringOffer(payload);
        setMyOffers(prev => [created, ...prev]);
        toast({ title: "Offer posted!", status: "success", duration: 3000, isClosable: true });
      }
      onFormClose();
    } catch (err) {
      toast({ title: err?.message || "Failed to save offer", status: "error", duration: 3000, isClosable: true });
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleActive = async (offer) => {
    try {
      const updated = await updateTutoringOffer(offer.id, { is_active: !offer.is_active });
      setMyOffers(prev => prev.map(o => o.id === offer.id ? { ...o, is_active: updated.is_active } : o));
    } catch {
      toast({ title: "Failed to update offer", status: "error", duration: 3000, isClosable: true });
    }
  };

  const confirmDelete = (id) => { setDeletingId(id); onDeleteOpen(); };

  const handleDelete = async () => {
    try {
      await deleteTutoringOffer(deletingId);
      setMyOffers(prev => prev.filter(o => o.id !== deletingId));
      toast({ title: "Offer deleted", status: "success", duration: 3000, isClosable: true });
      onDeleteClose();
    } catch {
      toast({ title: "Failed to delete offer", status: "error", duration: 3000, isClosable: true });
    }
  };

  // ── Request actions ─────────────────────────────────────────────────────────
  const openRequestModal = (offer) => {
    setRequestTarget(offer);
    setRequestMessage("");
    onRequestOpen();
  };

  const handleSendRequest = async () => {
    setRequestSubmitting(true);
    try {
      await sendTutoringRequest(requestTarget.id, { message: requestMessage });
      setOffers(prev => prev.map(o => o.id === requestTarget.id ? { ...o, already_requested: true } : o));
      toast({ title: "Request sent!", description: "The tutor will be in touch.", status: "success", duration: 4000, isClosable: true });
      onRequestClose();
    } catch (err) {
      toast({ title: err?.message || "Failed to send request", status: "error", duration: 3000, isClosable: true });
    } finally {
      setRequestSubmitting(false);
    }
  };

  const handleRespondRequest = async (requestId, status) => {
    try {
      const updated = await updateTutoringRequest(requestId, { status });
      setIncoming(prev => prev.map(r => r.id === requestId ? { ...r, status: updated.status } : r));
      toast({ title: `Request ${status}`, status: status === "accepted" ? "success" : "info", duration: 3000, isClosable: true });
    } catch {
      toast({ title: "Failed to update request", status: "error", duration: 3000, isClosable: true });
    }
  };

  const handleWithdraw = async (requestId) => {
    try {
      await withdrawTutoringRequest(requestId);
      setOutgoing(prev => prev.filter(r => r.id !== requestId));
      toast({ title: "Request withdrawn", status: "info", duration: 3000, isClosable: true });
    } catch (err) {
      toast({ title: err?.message || "Failed to withdraw", status: "error", duration: 3000, isClosable: true });
    }
  };

  // ── Pagination helper ───────────────────────────────────────────────────────
  const Pagination = ({ current, total, onChange }) => {
    if (total <= 1) return null;
    const pages = [];
    const start = Math.max(1, current - 2);
    const end   = Math.min(total, current + 2);
    for (let i = start; i <= end; i++) pages.push(i);
    return (
      <HStack justify="center" mt={6} spacing={1}>
        <Button size="sm" variant="ghost" onClick={() => onChange(current - 1)} isDisabled={current === 1}>
          <FiChevronLeft />
        </Button>
        {start > 1 && <><Button size="sm" variant="ghost" onClick={() => onChange(1)}>1</Button><Text px={1} color={mutedText}>…</Text></>}
        {pages.map(p => (
          <Button key={p} size="sm" onClick={() => onChange(p)}
            colorScheme={p === current ? "blue" : undefined}
            variant={p === current ? "solid" : "ghost"}>
            {p}
          </Button>
        ))}
        {end < total && <><Text px={1} color={mutedText}>…</Text><Button size="sm" variant="ghost" onClick={() => onChange(total)}>{total}</Button></>}
        <Button size="sm" variant="ghost" onClick={() => onChange(current + 1)} isDisabled={current === total}>
          <FiChevronRight />
        </Button>
      </HStack>
    );
  };

  // ── Offer card ──────────────────────────────────────────────────────────────
  const OfferCard = ({ offer, showActions = false }) => {
    const userId = parseInt(localStorage.getItem("user_id"));
    const isOwn  = offer.tutor_id === userId;
    const modeIcon = offer.mode === "online" ? FiMonitor : offer.mode === "in_person" ? FiMapPin : FiBookOpen;
    return (
      <Box bg={cardBg} border="1px solid" borderColor={borderColor} borderRadius="xl" p={5}
        shadow="sm" _hover={{ shadow: "md", borderColor: accentColor }} transition="all 0.2s">
        {/* Header */}
        <Flex justify="space-between" align="flex-start" mb={3}>
          <HStack spacing={3} flex={1} minW={0}>
            <Avatar size="sm" name={`${offer.tutor?.first_name} ${offer.tutor?.last_name}`}
              src={offer.tutor?.avatar_url || offer.tutor?.avatar} />
            <Box minW={0}>
              <Text fontWeight="semibold" fontSize="sm" color={textColor} noOfLines={1}>
                {offer.tutor?.first_name} {offer.tutor?.last_name}
              </Text>
              <Text fontSize="xs" color={mutedText} noOfLines={1}>
                {offer.tutor?.major?.name || "Student"}
              </Text>
            </Box>
          </HStack>
          {offer.grade_achieved && (
            <Tag colorScheme="yellow" size="sm" flexShrink={0} ml={2}>
              <Icon as={FiAward} mr={1} />
              <TagLabel>{offer.grade_achieved}</TagLabel>
            </Tag>
          )}
        </Flex>

        {/* Title + course */}
        <Heading size="sm" color={textColor} mb={1} noOfLines={2}>{offer.title}</Heading>
        <HStack spacing={2} mb={3} flexWrap="wrap">
          <Tag size="sm" colorScheme="blue" variant="subtle">
            <Icon as={FiBookOpen} mr={1} />
            <TagLabel noOfLines={1}>{offer.course?.name || offer.course?.title || offer.course?.code || "Course"}</TagLabel>
          </Tag>
          <Tag size="sm" colorScheme="purple" variant="subtle">
            <Icon as={modeIcon} mr={1} />
            <TagLabel>{MODE_LABELS[offer.mode]}</TagLabel>
          </Tag>
        </HStack>

        {/* Description */}
        {offer.description && (
          <Text fontSize="sm" color={mutedText} noOfLines={3} mb={3}>{offer.description}</Text>
        )}

        {/* Availability */}
        {offer.availability && (
          <HStack spacing={1} mb={3}>
            <Icon as={FiClock} color={mutedText} boxSize={3.5} />
            <Text fontSize="xs" color={mutedText} noOfLines={1}>{offer.availability}</Text>
          </HStack>
        )}

        {/* Actions */}
        {!showActions && (
          <Button
            size="sm" colorScheme="blue" w="full" mt={1}
            leftIcon={<FiSend />}
            isDisabled={isOwn || offer.already_requested}
            onClick={() => openRequestModal(offer)}
          >
            {isOwn ? "Your Offer" : offer.already_requested ? "Requested" : "Request Tutoring"}
          </Button>
        )}

        {showActions && (
          <HStack mt={2} justify="space-between">
            <HStack spacing={2}>
              <Switch size="sm" isChecked={offer.is_active} onChange={() => handleToggleActive(offer)}
                colorScheme="green" />
              <Text fontSize="xs" color={offer.is_active ? "green.500" : mutedText}>
                {offer.is_active ? "Active" : "Inactive"}
              </Text>
            </HStack>
            <HStack spacing={1}>
              <Tooltip label="Edit">
                <Button size="xs" variant="ghost" colorScheme="blue" onClick={() => openEdit(offer)}>
                  <FiEdit2 />
                </Button>
              </Tooltip>
              <Tooltip label="Delete">
                <Button size="xs" variant="ghost" colorScheme="red" onClick={() => confirmDelete(offer.id)}>
                  <FiTrash2 />
                </Button>
              </Tooltip>
            </HStack>
          </HStack>
        )}
      </Box>
    );
  };

  // ── Request row ─────────────────────────────────────────────────────────────
  const RequestRow = ({ req, isIncoming }) => (
    <Box bg={cardBg} border="1px solid" borderColor={borderColor} borderRadius="lg" p={4}>
      <Flex justify="space-between" align="center" flexWrap="wrap" gap={3}>
        <Box flex={1} minW={0}>
          <HStack spacing={2} mb={1}>
            <Avatar size="xs"
              name={isIncoming
                ? `${req.student?.first_name} ${req.student?.last_name}`
                : `${req.offer?.tutor?.first_name} ${req.offer?.tutor?.last_name}`}
              src={isIncoming
                ? (req.student?.avatar_url || req.student?.avatar)
                : (req.offer?.tutor?.avatar_url || req.offer?.tutor?.avatar)} />
            <Text fontSize="sm" fontWeight="medium" color={textColor} noOfLines={1}>
              {isIncoming
                ? `${req.student?.first_name} ${req.student?.last_name}`
                : `${req.offer?.tutor?.first_name} ${req.offer?.tutor?.last_name}`}
            </Text>
          </HStack>
          <Text fontSize="sm" color={accentColor} fontWeight="medium" noOfLines={1}>
            {req.offer?.course?.name || req.offer?.course?.title || req.offer?.course?.code || req.offer?.title}
          </Text>
          {req.message && (
            <Text fontSize="xs" color={mutedText} mt={1} noOfLines={2}>{req.message}</Text>
          )}
        </Box>
        <HStack spacing={2} flexShrink={0}>
          <Badge colorScheme={STATUS_COLORS[req.status]} borderRadius="full" px={2}>
            {req.status}
          </Badge>
          {isIncoming && req.status === "pending" && (
            <>
              <Tooltip label="Accept">
                <Button size="xs" colorScheme="green" onClick={() => handleRespondRequest(req.id, "accepted")}>
                  <FiCheck />
                </Button>
              </Tooltip>
              <Tooltip label="Reject">
                <Button size="xs" colorScheme="red" variant="outline" onClick={() => handleRespondRequest(req.id, "rejected")}>
                  <FiX />
                </Button>
              </Tooltip>
            </>
          )}
          {!isIncoming && req.status === "pending" && (
            <Tooltip label="Withdraw">
              <Button size="xs" colorScheme="orange" variant="outline" onClick={() => handleWithdraw(req.id)}>
                Withdraw
              </Button>
            </Tooltip>
          )}
        </HStack>
      </Flex>
    </Box>
  );

  // ── Skeletons ───────────────────────────────────────────────────────────────
  const GridSkeleton = () => (
    <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
      {[...Array(6)].map((_, i) => <Skeleton key={i} height="220px" borderRadius="xl" />)}
    </SimpleGrid>
  );

  const EmptyState = ({ icon, title, desc }) => (
    <Flex direction="column" align="center" justify="center" py={16} gap={3}>
      <Icon as={icon} boxSize={10} color={mutedText} />
      <Heading size="md" color={textColor}>{title}</Heading>
      <Text color={mutedText} textAlign="center" maxW="340px">{desc}</Text>
    </Flex>
  );

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <Box bg={pageBg} minH="100vh" pb={10}>

      {/* Page header */}
      <Box bg={cardBg} border="1px solid" borderColor={borderColor} borderRadius="xl" p={6} mb={6} shadow="sm">
        <Flex justify="space-between" align="center" flexWrap="wrap" gap={4}>
          <Box>
            <HStack mb={1}>
              <Icon as={FiAward} color={goldColor} boxSize={6} />
              <Heading size="lg" color={textColor}>Tutoring</Heading>
            </HStack>
            <Text color={mutedText}>
              Offer or find peer tutoring sessions for specific courses.
            </Text>
          </Box>
          <Button leftIcon={<FiPlus />} colorScheme="blue" onClick={() => { setActiveTab(1); openCreate(); }}>
            Offer Tutoring
          </Button>
        </Flex>
      </Box>

      {/* Main tabs */}
      <Tabs index={activeTab} onChange={setActiveTab} isLazy>
        <TabList
          bg={cardBg} border="1px solid" borderColor={borderColor}
          borderRadius="xl" px={4} mb={6} shadow="sm" overflowX="auto" overflowY="hidden"
        >
          <Tab _selected={{ color: accentColor, borderColor: accentColor }} fontWeight="medium">
            <HStack spacing={2}><Icon as={FiSearch} /><Text>Browse Offers</Text></HStack>
          </Tab>
          <Tab _selected={{ color: accentColor, borderColor: accentColor }} fontWeight="medium">
            <HStack spacing={2}><Icon as={FiUser} /><Text>My Offers</Text></HStack>
          </Tab>
          <Tab _selected={{ color: accentColor, borderColor: accentColor }} fontWeight="medium">
            <HStack spacing={2}><Icon as={FiInbox} /><Text>Requests</Text></HStack>
          </Tab>
        </TabList>

        <TabPanels>

          {/* ── BROWSE ─────────────────────────────────────────────────────── */}
          <TabPanel p={0}>
            {/* Filters */}
            <Box bg={cardBg} border="1px solid" borderColor={borderColor} borderRadius="xl"
              p={4} mb={5} shadow="sm">
              <Flex gap={3} flexWrap="wrap">
                <Input
                  placeholder="Search tutoring offers…"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  maxW={{ base: "full", md: "280px" }}
                  leftElement={<Icon as={FiSearch} color={mutedText} />}
                />
                <Menu>
                  <MenuButton
                    as={Button}
                    rightIcon={<FiChevronDown />}
                    maxW={{ base: "full", md: "220px" }}
                    w={{ base: "full", md: "220px" }}
                    textAlign="left"
                    fontWeight="normal"
                    variant="outline"
                  >
                    {filterCourse
                      ? getCourseLabel(browseCourses.find(c => String(c.id) === String(filterCourse)))
                      : "All Courses"}
                  </MenuButton>
                  <MenuList maxH="360px" overflowY="auto">
                    <Box px={3} py={2} position="sticky" top={0} bg={menuBg} zIndex={1}>
                      <InputGroup size="sm">
                        <InputLeftElement pointerEvents="none">
                          <Icon as={FiSearch} color="gray.400" />
                        </InputLeftElement>
                        <Input
                          placeholder="Search courses..."
                          value={filterCourseSearch}
                          onChange={(e) => setFilterCourseSearch(e.target.value)}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </InputGroup>
                    </Box>
                    <MenuItem onClick={() => setFilterCourse("")}>All Courses</MenuItem>
                    {browseCoursesLoading ? (
                      <MenuItem isDisabled>Loading courses...</MenuItem>
                    ) : browseCourses.length > 0 ? (
                      browseCourses.map((c) => (
                        <MenuItem key={c.id} onClick={() => setFilterCourse(String(c.id))}>
                          <Text fontSize="sm">{getCourseLabel(c)}</Text>
                        </MenuItem>
                      ))
                    ) : (
                      <MenuItem isDisabled>
                        <Text fontSize="sm" color="gray.500">No courses found</Text>
                      </MenuItem>
                    )}
                    {browseCoursesTotalPages > 1 && (
                      <Box px={3} py={2} borderTop="1px solid" borderColor={borderColor}>
                        <Flex justify="space-between" align="center">
                          <Button
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              loadBrowseCourses(browseCoursesPage - 1);
                            }}
                            isDisabled={browseCoursesLoading || browseCoursesPage <= 1}
                          >
                            Prev
                          </Button>
                          <Text fontSize="sm">Page {browseCoursesPage} of {browseCoursesTotalPages}</Text>
                          <Button
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              loadBrowseCourses(browseCoursesPage + 1);
                            }}
                            isDisabled={browseCoursesLoading || browseCoursesPage >= browseCoursesTotalPages}
                          >
                            Next
                          </Button>
                        </Flex>
                      </Box>
                    )}
                  </MenuList>
                </Menu>
                <Select
                  placeholder="Any Mode"
                  value={filterMode}
                  onChange={e => setFilterMode(e.target.value)}
                  maxW={{ base: "full", md: "160px" }}
                >
                  <option value="online">Online</option>
                  <option value="in_person">In-Person</option>
                  <option value="both">Both</option>
                </Select>
                {(searchTerm || filterCourse || filterMode) && (
                  <Button variant="ghost" colorScheme="red" onClick={() => {
                    setSearchTerm(""); setFilterCourse(""); setFilterMode("");
                  }}>
                    Clear
                  </Button>
                )}
              </Flex>
            </Box>

            {browseLoading ? <GridSkeleton /> : offers.length === 0
              ? <EmptyState icon={FiAward} title="No tutoring offers found"
                  desc="Try adjusting your filters, or be the first to offer tutoring for this course!" />
              : <>
                  <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
                    {offers.map(offer => <OfferCard key={offer.id} offer={offer} />)}
                  </SimpleGrid>
                  <Pagination current={browsePage} total={browseTotalPages}
                    onChange={p => { setBrowsePage(p); loadOffers(p); }} />
                </>}
          </TabPanel>

          {/* ── MY OFFERS ──────────────────────────────────────────────────── */}
          <TabPanel p={0}>
            <Flex justify="flex-end" mb={4}>
              <Button leftIcon={<FiPlus />} colorScheme="blue" onClick={openCreate}>New Offer</Button>
            </Flex>
            {myOffersLoading ? <GridSkeleton /> : myOffers.length === 0
              ? <EmptyState icon={FiBookOpen} title="You haven't posted any offers"
                  desc="Share your knowledge — post a tutoring offer for a course you excelled in." />
              : <>
                  <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
                    {myOffers.map(offer => <OfferCard key={offer.id} offer={offer} showActions />)}
                  </SimpleGrid>
                  <Pagination current={myPage} total={myTotalPages}
                    onChange={p => { setMyPage(p); loadMyOffers(p); }} />
                </>}
          </TabPanel>

          {/* ── REQUESTS ───────────────────────────────────────────────────── */}
          <TabPanel p={0}>
            <Tabs index={requestsTab} onChange={setRequestsTab} variant="soft-rounded" colorScheme="blue" mb={4}>
              <TabList>
                <Tab fontSize="sm">
                  <HStack spacing={1}><Icon as={FiInbox} /><Text>Incoming</Text>
                    {incoming.filter(r => r.status === "pending").length > 0 && (
                      <Badge colorScheme="red" borderRadius="full">
                        {incoming.filter(r => r.status === "pending").length}
                      </Badge>
                    )}
                  </HStack>
                </Tab>
                <Tab fontSize="sm">
                  <HStack spacing={1}><Icon as={FiSend} /><Text>Outgoing</Text></HStack>
                </Tab>
              </TabList>
            </Tabs>

            {requestsLoading ? (
              <Stack spacing={3}>{[...Array(4)].map((_, i) => <Skeleton key={i} height="90px" borderRadius="lg" />)}</Stack>
            ) : requestsTab === 0 ? (
              incoming.length === 0
                ? <EmptyState icon={FiInbox} title="No incoming requests"
                    desc="When students request tutoring from your offers, they'll appear here." />
                : <Stack spacing={3}>{incoming.map(r => <RequestRow key={r.id} req={r} isIncoming />)}</Stack>
            ) : (
              outgoing.length === 0
                ? <EmptyState icon={FiSend} title="No outgoing requests"
                    desc="Browse tutoring offers and send a request to a tutor." />
                : <Stack spacing={3}>{outgoing.map(r => <RequestRow key={r.id} req={r} isIncoming={false} />)}</Stack>
            )}
          </TabPanel>

        </TabPanels>
      </Tabs>

      {/* ── Create / Edit Modal ─────────────────────────────────────────────── */}
      <Modal isOpen={isFormOpen} onClose={onFormClose} size="lg">
        <ModalOverlay />
        <ModalContent bg={cardBg}>
          <ModalHeader color={textColor}>{editingId ? "Edit Offer" : "Post Tutoring Offer"}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack spacing={4}>
              <FormControl isInvalid={!!formErrors.title} isRequired>
                <FormLabel color={textColor}>Title</FormLabel>
                <Input placeholder="e.g. Calculus I – I scored A+, happy to help!"
                  value={formData.title}
                  onChange={e => setFormData(p => ({ ...p, title: e.target.value }))} />
                <FormErrorMessage>{formErrors.title}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!formErrors.course_id} isRequired>
                <FormLabel color={textColor}>Course</FormLabel>
                <Menu>
                  <MenuButton as={Button} rightIcon={<FiChevronDown />} w="100%" textAlign="left" fontWeight="normal" variant="outline">
                    {formData.course_id
                      ? getCourseLabel(formCourses.find(c => String(c.id) === String(formData.course_id)))
                      : "Select a course"}
                  </MenuButton>
                  <MenuList maxH="360px" overflowY="auto">
                    <Box px={3} py={2} position="sticky" top={0} bg={menuBg} zIndex={1}>
                      <InputGroup size="sm">
                        <InputLeftElement pointerEvents="none">
                          <Icon as={FiSearch} color="gray.400" />
                        </InputLeftElement>
                        <Input
                          placeholder="Search courses..."
                          value={formCourseSearch}
                          onChange={(e) => setFormCourseSearch(e.target.value)}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </InputGroup>
                    </Box>
                    {formCoursesLoading ? (
                      <MenuItem isDisabled>Loading courses...</MenuItem>
                    ) : formCourses.length > 0 ? (
                      formCourses.map((c) => (
                        <MenuItem key={c.id} onClick={() => setFormData(p => ({ ...p, course_id: String(c.id) }))}>
                          <Text fontSize="sm">{getCourseLabel(c)}</Text>
                        </MenuItem>
                      ))
                    ) : (
                      <MenuItem isDisabled>
                        <Text fontSize="sm" color="gray.500">No courses found</Text>
                      </MenuItem>
                    )}
                    {formCoursesTotalPages > 1 && (
                      <Box px={3} py={2} borderTop="1px solid" borderColor={borderColor}>
                        <Flex justify="space-between" align="center">
                          <Button
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              loadFormCourses(formCoursesPage - 1);
                            }}
                            isDisabled={formCoursesLoading || formCoursesPage <= 1}
                          >
                            Prev
                          </Button>
                          <Text fontSize="sm">Page {formCoursesPage} of {formCoursesTotalPages}</Text>
                          <Button
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              loadFormCourses(formCoursesPage + 1);
                            }}
                            isDisabled={formCoursesLoading || formCoursesPage >= formCoursesTotalPages}
                          >
                            Next
                          </Button>
                        </Flex>
                      </Box>
                    )}
                  </MenuList>
                </Menu>
                <FormErrorMessage>{formErrors.course_id}</FormErrorMessage>
              </FormControl>

              <Flex gap={3}>
                <FormControl flex={1}>
                  <FormLabel color={textColor}>Grade Achieved</FormLabel>
                  <Select placeholder="Select grade"
                    value={formData.grade_achieved}
                    onChange={e => setFormData(p => ({ ...p, grade_achieved: e.target.value }))}>
                    {GRADE_OPTIONS.map(g => <option key={g} value={g}>{g}</option>)}
                  </Select>
                </FormControl>

                <FormControl flex={1} isInvalid={!!formErrors.mode} isRequired>
                  <FormLabel color={textColor}>Session Mode</FormLabel>
                  <Select value={formData.mode}
                    onChange={e => setFormData(p => ({ ...p, mode: e.target.value }))}>
                    <option value="online">Online</option>
                    <option value="in_person">In-Person</option>
                    <option value="both">Both</option>
                  </Select>
                  <FormErrorMessage>{formErrors.mode}</FormErrorMessage>
                </FormControl>
              </Flex>

              <FormControl>
                <FormLabel color={textColor}>Availability</FormLabel>
                <Input placeholder="e.g. Weekday evenings, weekends"
                  value={formData.availability}
                  onChange={e => setFormData(p => ({ ...p, availability: e.target.value }))} />
              </FormControl>

              <FormControl>
                <FormLabel color={textColor}>Description</FormLabel>
                <Textarea placeholder="Tell students how you can help them…"
                  rows={4}
                  value={formData.description}
                  onChange={e => setFormData(p => ({ ...p, description: e.target.value }))} />
              </FormControl>
            </Stack>
          </ModalBody>
          <ModalFooter gap={3}>
            <Button variant="ghost" onClick={onFormClose}>Cancel</Button>
            <Button colorScheme="blue" isLoading={submitting} onClick={handleFormSubmit}>
              {editingId ? "Save Changes" : "Post Offer"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* ── Delete Confirm Modal ────────────────────────────────────────────── */}
      <Modal isOpen={isDeleteOpen} onClose={onDeleteClose} size="sm">
        <ModalOverlay />
        <ModalContent bg={cardBg}>
          <ModalHeader color={textColor}>Delete Offer</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Alert status="warning" borderRadius="md">
              <AlertIcon />
              <AlertDescription>This will permanently delete the offer and all its requests.</AlertDescription>
            </Alert>
          </ModalBody>
          <ModalFooter gap={3}>
            <Button variant="ghost" onClick={onDeleteClose}>Cancel</Button>
            <Button colorScheme="red" onClick={handleDelete}>Delete</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* ── Send Request Modal ──────────────────────────────────────────────── */}
      <Modal isOpen={isRequestOpen} onClose={onRequestClose} size="md">
        <ModalOverlay />
        <ModalContent bg={cardBg}>
          <ModalHeader color={textColor}>Request Tutoring Session</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {requestTarget && (
              <Box bg={accentBg} borderRadius="lg" p={3} mb={4}>
                <Text fontSize="sm" fontWeight="medium" color={accentColor}>{requestTarget.title}</Text>
                <Text fontSize="xs" color={mutedText}>
                  by {requestTarget.tutor?.first_name} {requestTarget.tutor?.last_name}
                  {" · "}{requestTarget.course?.name || requestTarget.course?.title || requestTarget.course?.code || "Course"}
                </Text>
              </Box>
            )}
            <FormControl>
              <FormLabel color={textColor}>Message (optional)</FormLabel>
              <Textarea
                placeholder="Introduce yourself and describe what topics you need help with…"
                rows={4}
                value={requestMessage}
                onChange={e => setRequestMessage(e.target.value)}
              />
            </FormControl>
          </ModalBody>
          <ModalFooter gap={3}>
            <Button variant="ghost" onClick={onRequestClose}>Cancel</Button>
            <Button colorScheme="blue" leftIcon={<FiSend />} isLoading={requestSubmitting} onClick={handleSendRequest}>
              Send Request
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

    </Box>
  );
}

