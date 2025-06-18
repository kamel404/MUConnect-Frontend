import React, { useState, useEffect, useCallback } from 'react';
import {
  Flex,
  Box,
  Heading,
  Text,
  Button,
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
} from '@chakra-ui/react';
import {
  FiSearch,
  FiUsers,
  FiCalendar,
  FiArrowLeft,
  FiPlus,
  FiLogIn,
  FiLogOut,
  FiMapPin
} from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getClubs, joinClub, leaveClub, getMyClubs, updateVotingSystemStatus, getVotingSystemStatus } from '../services/clubService';
import CreateClubModal from '../components/clubs/CreateClubModal';
import CreateEventModal from '../components/clubs/CreateEventModal';
import VotingModal from '../components/clubs/VotingModal';

const MotionCard = motion(Card);

const ClubsPage = () => {
  // States for All Clubs
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

  // States for My Clubs
  const [myClubs, setMyClubs] = useState([]); // Paginated and filtered list for display
  const [allMyClubs, setAllMyClubs] = useState([]); // Full list of user's clubs for client-side search
  const [myClubsLoading, setMyClubsLoading] = useState(false);
  const [myClubsError, setMyClubsError] = useState(null);
  const [myClubsCurrentPage, setMyClubsCurrentPage] = useState(1);
  const [myClubsTotalPages, setMyClubsTotalPages] = useState(1);

  // General State
  const [tabIndex, setTabIndex] = useState(0);
  const userRole = localStorage.getItem('role');
  const [votingStatus, setVotingStatus] = useState('closed');
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [isLoadingVotingStatus, setIsLoadingVotingStatus] = useState(true);

  // UI Hooks
  const cardBg = useColorModeValue('white', 'gray.700');
  const textColor = useColorModeValue('gray.800', 'white');
  const mutedText = useColorModeValue('gray.500', 'gray.400');
  const accentColor = useColorModeValue('blue.500', 'blue.200');
  const navigate = useNavigate();
  const isMobile = useBreakpointValue({ base: true, md: false });
  const toast = useToast();

  // Modal Hooks
  const { isOpen: isCreateClubOpen, onOpen: onCreateClubOpen, onClose: onCreateClubClose } = useDisclosure();
  const { isOpen: isCreateEventOpen, onOpen: onCreateEventOpen, onClose: onCreateEventClose } = useDisclosure();
  const { isOpen: isVotingOpen, onOpen: onVotingOpen, onClose: onVotingClose } = useDisclosure();
  const [selectedClubForEvent, setSelectedClubForEvent] = useState(null);
  const [selectedClubForVoting, setSelectedClubForVoting] = useState(null);

  // Data Fetching for All Clubs
  const fetchClubs = useCallback(async (page, query) => {
    setLoading(true);
    setError(null);
    try {
      // Fetch all clubs for the current page/query and ALL of the user's joined clubs in parallel
      const allClubsPromise = getClubs(page, query);
      const myClubsPromise = (async () => {
        const myClubsList = [];
        let currentPage = 1;
        let totalPages = 1;
        do {
          const data = await getMyClubs(currentPage);
          if (data && data.data) {
            myClubsList.push(...data.data);
            totalPages = data.last_page;
          } else {
            break; // Exit if data format is unexpected
          }
          currentPage++;
        } while (currentPage <= totalPages);
        return myClubsList;
      })();

      const [allClubsData, myClubsList] = await Promise.all([allClubsPromise, myClubsPromise]);

      if (!allClubsData || !allClubsData.data) {
        setClubs([]);
        return;
      }

      const myClubIdSet = new Set(myClubsList.map(c => c.id));

      const updatedClubs = allClubsData.data.map(club => ({
        ...club,
        is_member: myClubIdSet.has(club.id),
      }));

      setClubs(updatedClubs);
      setTotalPages(allClubsData.last_page || 1);
      setCurrentPage(allClubsData.current_page || 1);

    } catch (err) {
      setError(err.message || 'Failed to fetch clubs.');
      toast({ title: 'Error', description: err.message, status: 'error', duration: 5000, isClosable: true });
    } finally {
      setLoading(false);
    }
  }, [toast, getMyClubs, getClubs]);

  // Fetches the complete list of clubs the user has joined to enable frontend search
  const fetchAllMyClubs = useCallback(async () => {
    setMyClubsLoading(true);
    setMyClubsError(null);
    try {
      const myClubsList = [];
      let currentPage = 1;
      let totalPages = 1;
      do {
        const data = await getMyClubs(currentPage);
        if (data && data.data) {
          myClubsList.push(...data.data);
          totalPages = data.last_page;
        } else {
          break;
        }
        currentPage++;
      } while (currentPage <= totalPages);
      setAllMyClubs(myClubsList);
    } catch (err) {
      setMyClubsError(err.message || 'Failed to fetch your clubs.');
      toast({ title: 'Error', description: err.message, status: 'error', duration: 5000, isClosable: true });
    } finally {
      setMyClubsLoading(false);
    }
  }, [toast, getMyClubs]);

  // Fetch voting system status
  const fetchVotingStatus = useCallback(async () => {
    try {
      const status = await getVotingSystemStatus();
      setVotingStatus(status);
    } catch (error) {
      console.error('Failed to fetch voting status:', error);
      // Don't show error to user for status fetch, just use default 'closed' state
    } finally {
      setIsLoadingVotingStatus(false);
    }
  }, []);

  // Main data fetching effects
  useEffect(() => {
    fetchVotingStatus();
  }, [fetchVotingStatus]);

  useEffect(() => {
    if (tabIndex === 0) {
      const handler = setTimeout(() => {
        fetchClubs(currentPage, searchQuery);
      }, 300); // Debounce search for All Clubs
      return () => clearTimeout(handler);
    }
  }, [tabIndex, currentPage, searchQuery, fetchClubs]);

  useEffect(() => {
    if (tabIndex === 1) {
      fetchAllMyClubs();
    }
  }, [tabIndex, fetchAllMyClubs]);

  // Effect for client-side filtering and pagination of My Clubs
  useEffect(() => {
    if (tabIndex !== 1) return;

    const filtered = searchQuery
      ? allMyClubs.filter(club =>
          club.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : allMyClubs;

    const itemsPerPage = 10;
    const total = Math.ceil(filtered.length / itemsPerPage);
    setMyClubsTotalPages(total > 0 ? total : 1);

    // Reset to page 1 if current page is out of bounds and there are results
    if (myClubsCurrentPage > total && total > 0) {
      setMyClubsCurrentPage(1);
    }

    const start = (myClubsCurrentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    setMyClubs(filtered.slice(start, end));

  }, [searchQuery, allMyClubs, myClubsCurrentPage, tabIndex]);

  const handleJoinLeave = async (club, action) => {
    try {
      const apiAction = action === 'join' ? joinClub : leaveClub;
      const response = await apiAction(club.id);
      toast({ title: 'Success', description: response.message, status: 'success', duration: 3000, isClosable: true });

      // Refetch all data to ensure both tabs are in sync
      fetchClubs(currentPage, searchQuery);
      fetchAllMyClubs();

    } catch (err) {
      toast({ title: 'Error', description: err.message, status: 'error', duration: 5000, isClosable: true });
    }
  };

  const handleCreateEventClick = (club) => {
    setSelectedClubForEvent(club);
    onCreateEventOpen();
  };

  const handleVoteClick = (club) => {
    setSelectedClubForVoting(club);
    onVotingOpen();
  };

  const toggleVotingSystem = async () => {
    const newStatus = votingStatus === 'open' ? 'closed' : 'open';
    setIsUpdatingStatus(true);
    try {
      await updateVotingSystemStatus(newStatus);
      setVotingStatus(newStatus); // Update local state immediately for better UX
      toast({
        title: 'Success',
        description: `Voting system has been ${newStatus === 'open' ? 'opened' : 'closed'}.`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      toast({
        title: 'Error',
        description: err.message || 'Failed to update voting system status',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const renderClubCard = (club, isMember) => {
    const showVoteButton = (votingStatus === 'open' || userRole === 'admin' || userRole === 'moderator') && votingStatus !== 'closed';
    
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
          src={`http://127.0.0.1:8000/api/storage/${club.logo}`}
          alt={`${club.name} logo`}
          height="130px"
          width="100%"
          objectFit="cover"
          fallbackSrc="https://via.placeholder.com/300x130?text=Club+Image"
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
        borderColor={useColorModeValue('gray.200', 'gray.700')}
      >
        <Flex justify="space-between" align="center" w="full">
          <HStack spacing={1}>
            <Button
              rightIcon={isMember ? <FiLogOut /> : <FiLogIn />}
              colorScheme={isMember ? 'red' : 'green'}
              variant="ghost"
              size="sm"
              borderRadius="full"
              onClick={() => handleJoinLeave(club, isMember ? 'leave' : 'join')}
            >
              {isMember ? 'Leave' : 'Join'}
            </Button>
            {showVoteButton && (
              <Button
                variant="ghost"
                colorScheme="purple"
                size="sm"
                borderRadius="full"
                onClick={() => handleVoteClick(club)}
                isDisabled={!isMember}
              >
                Vote
              </Button>
            )}
          </HStack>
          {(userRole === 'admin' || userRole === 'moderator') && (
            <Button
              rightIcon={<FiPlus />}
              colorScheme="blue"
              variant="outline"
              size="sm"
              borderRadius="full"
              onClick={() => handleCreateEventClick(club)}
            >
              Create Event
            </Button>
          )}
        </Flex>
      </CardFooter>
    </MotionCard>
  );
  };

  const handleTabChange = (index) => {
    setTabIndex(index);
    setSearchQuery(''); // Reset search when switching tabs
    setCurrentPage(1);
    setMyClubsCurrentPage(1);
  };

  const handleSearchChange = (e) => {
    // Reset to page 1 on new search
    setCurrentPage(1);
    setMyClubsCurrentPage(1);
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
              University Clubs
            </Heading>
          </HStack>
          <HStack spacing={4} align="center">
            {votingStatus === 'open' && (
              <Badge colorScheme="green" px={2} py={1} borderRadius="md">
                Voting is currently open
              </Badge>
            )}
            {(userRole === 'admin' || userRole === 'moderator') && (
              <Button
                leftIcon={<FiPlus />}
                colorScheme="blue"
                onClick={onCreateClubOpen}
              >
                Create Club
              </Button>
            )}
            {(userRole === 'admin' || userRole === 'moderator') && (
              <Button
                leftIcon={votingStatus === 'open' ? <FiLogOut /> : <FiLogIn />}
                colorScheme={votingStatus === 'open' ? 'red' : 'green'}
                variant="outline"
                onClick={toggleVotingSystem}
                isLoading={isUpdatingStatus}
                loadingText={votingStatus === 'open' ? 'Closing...' : 'Opening...'}
                title={votingStatus === 'open' ? 'Close the voting system' : 'Open the voting system'}
              >
                {votingStatus === 'open' ? 'Close Voting' : 'Open Voting'}
              </Button>
            )}
          </HStack>
        </Flex>

        <Tabs colorScheme="blue" mb={6} variant="soft-rounded" onChange={handleTabChange}>
          <Flex justify="space-between" align={isMobile ? 'flex-start' : 'center'} direction={isMobile ? 'column' : 'row'} gap={4} mb={4}>
            <TabList>
              <Tab>All Clubs</Tab>
              <Tab>My Clubs</Tab>
            </TabList>
            <InputGroup maxW="250px">
              <InputLeftElement pointerEvents="none">
                <FiSearch color={mutedText} />
              </InputLeftElement>
              <Input
                placeholder={tabIndex === 0 ? "Search all clubs..." : "Search your clubs..."}
                size="sm"
                borderRadius="full"
                value={searchQuery}
                onChange={handleSearchChange}
                _focus={{ boxShadow: `0 0 0 2px ${accentColor}` }}
              />
            </InputGroup>
          </Flex>

          <TabPanels>
            <TabPanel>
              {loading ? (
                <Flex justify="center" py={10}><Spinner size="xl" /></Flex>
              ) : error ? (
                <Text color="red.500">{error}</Text>
              ) : clubs.length > 0 ? (
                <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                  {clubs.map(club => renderClubCard(club, club.is_member))}
                </SimpleGrid>
              ) : (
                <Text>No clubs found.</Text>
              )}
            </TabPanel>
            <TabPanel>
              {myClubsLoading ? (
                <Flex justify="center" py={10}><Spinner size="xl" /></Flex>
              ) : myClubsError ? (
                <Text color="red.500">{myClubsError}</Text>
              ) : myClubs.length > 0 ? (
                <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                  {myClubs.map(club => renderClubCard(club, true))}
                </SimpleGrid>
              ) : (
                <Flex direction="column" align="center" justify="center" py={10}>
                  <Box textAlign="center" maxW="400px">
                    <FiUsers size={50} style={{ margin: '0 auto 20px', opacity: 0.3 }} />
                    <Heading size="md" mb={2}>You haven't joined any clubs yet</Heading>
                    <Text color={mutedText}>Explore and join clubs to see them here.</Text>
                  </Box>
                </Flex>
              )}
            </TabPanel>
          </TabPanels>
        </Tabs>

        {tabIndex === 0 && clubs.length > 0 && (
            <Flex justify="center" mt={8}>
                <HStack>
                    <Button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} isDisabled={currentPage <= 1}>Previous</Button>
                    <Text>Page {currentPage} of {totalPages}</Text>
                    <Button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} isDisabled={currentPage >= totalPages}>Next</Button>
                </HStack>
            </Flex>
        )}

        {tabIndex === 1 && myClubs.length > 0 && (
            <Flex justify="center" mt={8}>
                <HStack>
                    <Button onClick={() => setMyClubsCurrentPage(p => Math.max(1, p - 1))} isDisabled={myClubsCurrentPage <= 1}>Previous</Button>
                    <Text>Page {myClubsCurrentPage} of {myClubsTotalPages}</Text>
                    <Button onClick={() => setMyClubsCurrentPage(p => Math.min(myClubsTotalPages, p + 1))} isDisabled={myClubsCurrentPage >= myClubsTotalPages}>Next</Button>
                </HStack>
            </Flex>
        )}

        <CreateClubModal isOpen={isCreateClubOpen} onClose={onCreateClubClose} onClubCreated={() => fetchClubs(1, '')} />
        <CreateEventModal
          isOpen={isCreateEventOpen}
          onClose={onCreateEventClose}
          club={selectedClubForEvent}
          onEventCreated={() => { fetchClubs(currentPage, searchQuery); fetchMyClubs(myClubsCurrentPage); }}
        />
        <VotingModal
          isOpen={isVotingOpen}
          onClose={onVotingClose}
          club={selectedClubForVoting}
          userRole={userRole}
          isMember={selectedClubForVoting?.is_member || false}
        />
      </Box>
    </Flex>
  );
};

export default ClubsPage;