import React, { useState, useEffect, useCallback } from 'react';
import {
  Flex,
  Box,
  Heading,
  Text,
  Button,
  ButtonGroup,
  Stack,
  Card,
  CardBody,
  CardFooter,
  Image,
  useColorModeValue,
  Badge,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  SimpleGrid,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  useBreakpointValue,
  useToast,
  Spinner,
  HStack,
  useDisclosure,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from '@chakra-ui/react';
import {
  FiSearch,
  FiUsers,
  FiCalendar,
  FiArrowLeft,
  FiPlus,
  FiEdit,
  FiTrash,
  FiMoreVertical,
  FiInfo,
} from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getClubs, deleteClub } from '../services/clubService';
import CreateClubModal from '../components/clubs/CreateClubModal';
import CreateEventModal from '../components/clubs/CreateEventModal';
import EditClubModal from '../components/clubs/EditClubModal';
import ClubDetailsModal from '../components/clubs/ClubDetailsModal';

const MotionCard = motion(Card);

const ClubsPage = () => {
  // States for All Clubs
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

  // General State
  const userRole = localStorage.getItem('role');
  const isAdminOrModerator = userRole === 'admin' || userRole === 'moderator';

  // UI Hooks
  const cardBg = useColorModeValue('white', 'gray.700');
  const textColor = useColorModeValue('gray.800', 'white');
  const mutedText = useColorModeValue('gray.500', 'gray.400');
  const accentColor = useColorModeValue('blue.500', 'blue.200');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const navigate = useNavigate();
  const isMobile = useBreakpointValue({ base: true, md: false });
  const toast = useToast();

  // Modal Hooks
  const { isOpen: isCreateClubOpen, onOpen: onCreateClubOpen, onClose: onCreateClubClose } = useDisclosure();
  const { isOpen: isCreateEventOpen, onOpen: onCreateEventOpen, onClose: onCreateEventClose } = useDisclosure();
  const [selectedClubForEvent, setSelectedClubForEvent] = useState(null);
  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();
  const [selectedClubForEdit, setSelectedClubForEdit] = useState(null);
  const { isOpen: isDetailsOpen, onOpen: onDetailsOpen, onClose: onDetailsClose } = useDisclosure();
  const [selectedClubForDetails, setSelectedClubForDetails] = useState(null);

  // Data Fetching for All Clubs
  const fetchClubs = useCallback(async (page, query) => {
    setLoading(true);
    setError(null);
    try {
      const allClubsData = await getClubs(page, query);

      if (!allClubsData || !allClubsData.data) {
        setClubs([]);
        return;
      }

      setClubs(allClubsData.data);
      setTotalPages(allClubsData.last_page || 1);
      setCurrentPage(allClubsData.current_page || 1);

    } catch (err) {
      setError(err.message || 'Failed to fetch clubs.');
      toast({ title: 'Error', description: err.message, status: 'error', duration: 5000, isClosable: true });
    } finally {
      setLoading(false);
    }
  }, [toast, getClubs]);

  // Main data fetching effects
  useEffect(() => {
    const handler = setTimeout(() => {
      fetchClubs(currentPage, searchQuery);
    }, 300); // Debounce search for All Clubs
    return () => clearTimeout(handler);
  }, [currentPage, searchQuery, fetchClubs]);

  const handleCreateEventClick = (club) => {
    setSelectedClubForEvent(club);
    onCreateEventOpen();
  };

  const handleEditClick = (club) => {
    setSelectedClubForEdit(club);
    onEditOpen();
  };

  const handleViewDetails = (club) => {
    setSelectedClubForDetails(club);
    onDetailsOpen();
  };

  const handleDeleteClub = async (club) => {
    if (!window.confirm(`Are you sure you want to delete ${club.name}? This action cannot be undone.`)) return;
    try {
      await deleteClub(club.id);
      toast({ title: 'Club deleted', status: 'success', duration: 3000, isClosable: true });
      // Refresh list
      fetchClubs(currentPage, searchQuery);
    } catch (err) {
      toast({ title: 'Error', description: err.message, status: 'error', duration: 5000, isClosable: true });
    }
  };

  const renderClubCard = (club) => {
    return (
    <MotionCard
      key={club.id}
      bg={cardBg}
      boxShadow="md"
      borderRadius="lg"
      overflow="hidden"
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <Box position="relative">
        <Image
          src={`${import.meta.env.VITE_API_BASE_URL}/storage/${club.logo}`}
          alt={`${club.name} logo`}
          height="130px"
          width="100%"
          objectFit="cover"
        />
      </Box>

      <CardBody pt={3}>
        <Heading size="md" mb={2} color={textColor}>
          {club.name}
        </Heading>
        <Text fontSize="sm" color={mutedText} noOfLines={2} mb={3}>
          {club.description}
        </Text>
        <Stack spacing={2} mb={4}>
          <HStack>
            <FiUsers size={14} color={accentColor} />
            <Text fontSize="sm" color={textColor}>{club.members} members</Text>
          </HStack>
          {club.upcoming_event && (
            <HStack>
              <FiCalendar size={14} color={accentColor} />
              <Text fontSize="sm" color={textColor}>Upcoming: {club.upcoming_event.title}</Text>
            </HStack>
          )}
        </Stack>
      </CardBody>

      <CardFooter
        pt={0}
        borderTop="1px solid"
        borderColor={borderColor}
      >
        <Flex justify="space-between" align="center" w="full">
          <Button
            leftIcon={<FiInfo />}
            variant="ghost"
            colorScheme="blue"
            size="sm"
            onClick={() => handleViewDetails(club)}
          >
            View Members
          </Button>
          {(userRole === 'admin' || userRole === 'moderator') && (
            <Menu>
              <MenuButton as={IconButton} icon={<FiMoreVertical />} size="sm" variant="ghost" />
              <MenuList>
                <MenuItem icon={<FiPlus />} onClick={() => handleCreateEventClick(club)}>
                  Create Event
                </MenuItem>
                <MenuItem icon={<FiEdit />} onClick={() => handleEditClick(club)}>
                  Edit Club
                </MenuItem>
                <MenuItem icon={<FiTrash />} onClick={() => handleDeleteClub(club)} color="red.500">
                  Delete Club
                </MenuItem>
              </MenuList>
            </Menu>
          )}
        </Flex>
      </CardFooter>
    </MotionCard>
  );
  };

  const handleSearchChange = (e) => {
    // Reset to page 1 on new search
    setCurrentPage(1);
    setSearchQuery(e.target.value);
  };

  return (
    <Flex minH="100vh" p={{ base: 4, md: 8 }} bg={useColorModeValue('gray.50', 'gray.800')}>
      <Box maxW="container.lg" mx="auto" w="full">
        <Flex justify="space-between" align="center" mb={6} direction={isMobile ? 'column' : 'row'} gap={4}>
          <HStack spacing={4}>
            <IconButton
              icon={<FiArrowLeft />}
              aria-label="Go back"
              onClick={() => navigate('/dashboard')}
              variant="ghost"
              borderRadius="full"
            />
            <Heading size="xl" color={textColor} fontWeight="800" letterSpacing="tight">
              Students Clubs
            </Heading>
          </HStack>
          {isAdminOrModerator && (
            <Button
              leftIcon={<FiPlus />}
              colorScheme="blue"
              onClick={onCreateClubOpen}
              size="sm"
            >
              Create Club
            </Button>
          )}
      </Flex>

      <Flex justify="space-between" align={isMobile ? 'flex-start' : 'center'} direction={isMobile ? 'column' : 'row'} gap={4} mb={6}>
        <InputGroup maxW="250px">
          <InputLeftElement pointerEvents="none">
            <FiSearch color={mutedText} />
          </InputLeftElement>
          <Input
            placeholder="Search clubs..."
            size="sm"
            borderRadius="full"
            value={searchQuery}
            onChange={handleSearchChange}
            _focus={{ boxShadow: `0 0 0 2px ${accentColor}` }}
          />
        </InputGroup>
      </Flex>

      {loading ? (
        <Flex justify="center" py={10}><Spinner size="xl" /></Flex>
      ) : error ? (
        <Text color="red.500">{error}</Text>
      ) : clubs.length > 0 ? (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          {clubs.map(club => renderClubCard(club))}
        </SimpleGrid>
      ) : (
        <Flex direction="column" align="center" justify="center" py={10}>
          <Box textAlign="center" maxW="400px">
            <FiSearch size={50} style={{ margin: '0 auto 20px', opacity: 0.3 }} />
            <Heading size="md" mb={2} color={textColor}>No clubs found</Heading>
            <Text color={mutedText}>
              {searchQuery 
                ? `No clubs match your search "${searchQuery}". Try a different search term.`
                : "No clubs are available at the moment."}
            </Text>
          </Box>
        </Flex>
      )}

      {clubs.length > 0 && (
        <Flex justify="center" mt={8}>
          <HStack>
            <Button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} isDisabled={currentPage <= 1}>Previous</Button>
            <Text>Page {currentPage} of {totalPages}</Text>
            <Button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} isDisabled={currentPage >= totalPages}>Next</Button>
          </HStack>
        </Flex>
      )}

        <CreateClubModal isOpen={isCreateClubOpen} onClose={onCreateClubClose} onClubCreated={() => fetchClubs(1, '')} />
        <CreateEventModal
          isOpen={isCreateEventOpen}
          onClose={onCreateEventClose}
          club={selectedClubForEvent}
          onEventCreated={() => fetchClubs(currentPage, searchQuery)}
        />
        <EditClubModal
          isOpen={isEditOpen}
          onClose={onEditClose}
          club={selectedClubForEdit}
          onClubUpdated={() => fetchClubs(currentPage, searchQuery)}
        />
        <ClubDetailsModal
          isOpen={isDetailsOpen}
          onClose={onDetailsClose}
          clubId={selectedClubForDetails?.id}
        />
      </Box>
    </Flex>
  );
};

export default ClubsPage;