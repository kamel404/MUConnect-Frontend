import React, { useState, useEffect, useCallback } from 'react';
import {
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Button, useToast,
  Tabs, TabList, Tab, TabPanels, TabPanel, VStack, Text, Checkbox, CheckboxGroup, Spinner, Alert, AlertIcon,
  Input, HStack, Box, Progress, Flex, Heading
} from '@chakra-ui/react';
import { getCandidates, addCandidate, voteForCandidate, getVoteResults, getVoteStatus } from '../../services/clubService';

const VotingModal = ({ isOpen, onClose, club, isMember }) => {
  const userRole = localStorage.getItem('role') || '';
  const isAdminOrModerator = userRole === 'admin' || userRole === 'moderator';
  const toast = useToast();
  const [tabIndex, setTabIndex] = useState(0);
  const [candidates, setCandidates] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedCandidates, setSelectedCandidates] = useState([]);
  const [newCandidateName, setNewCandidateName] = useState('');
  const [hasVoted, setHasVoted] = useState(false);
  const [votesCast, setVotesCast] = useState(0);
  const [votedForCandidates, setVotedForCandidates] = useState([]);

  const fetchData = useCallback(async () => {
    if (!club?.id) return;
    setLoading(true);
    setError(null);
    try {
      const promises = [
        getCandidates(club.id),
        getVoteResults(club.id),
      ];

      if (isMember) {
        promises.push(getVoteStatus(club.id));
      }

      const [candidatesData, resultsData, voteStatusData] = await Promise.all(promises);

      setCandidates(candidatesData || []);
      setResults(resultsData || []);
      if (isMember && voteStatusData) {
        setHasVoted((voteStatusData.votes_cast || 0) > 0);
        setVotesCast(voteStatusData.votes_cast || 0);
        setVotedForCandidates(voteStatusData.voted_for_candidates || []);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch voting data.');
    } finally {
      setLoading(false);
    }
  }, [club?.id, isMember]);

  useEffect(() => {
    if (isOpen) {
      fetchData();
    }
  }, [isOpen, fetchData]);

  const handleAddCandidate = async () => {
    if (!newCandidateName.trim()) {
      toast({ title: 'Error', description: 'Candidate name cannot be empty.', status: 'error' });
      return;
    }
    try {
      await addCandidate(club.id, newCandidateName);
      toast({ title: 'Success', description: 'Candidate added successfully.', status: 'success' });
      setNewCandidateName('');
      fetchData(); // Refresh data
    } catch (err) {
      toast({ title: 'Error', description: err.message, status: 'error' });
    }
  };

  const handleVote = async () => {
    if (selectedCandidates.length === 0) {
      toast({ title: 'Error', description: 'Please select at least one candidate.', status: 'error' });
      return;
    }
    if (selectedCandidates.length > 6) {
      toast({ title: 'Error', description: 'You cannot vote for more than 6 candidates.', status: 'error' });
      return;
    }

    try {
      const candidateIds = selectedCandidates.map(id => parseInt(id, 10));
      await voteForCandidate(club.id, { candidate_ids: candidateIds });
      toast({ title: 'Success', description: 'Your vote has been cast successfully!', status: 'success' });
      setHasVoted(true);
      fetchData(); // Refresh results
      setTabIndex(1); // Switch to results tab
    } catch (err) {
      toast({ title: 'Error', description: err.message || 'Failed to cast vote. You may have already voted.', status: 'error' });
      if (err.message?.includes('already voted')) {
        setHasVoted(true);
      }
    }
  };

  const totalVotes = results.reduce((sum, r) => sum + r.votes_count, 0);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Club Election: {club?.name}</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <Tabs index={tabIndex} onChange={setTabIndex}>
            <TabList>
              <Tab>Vote</Tab>
              {isAdminOrModerator && <Tab>Results</Tab>}
            </TabList>
            <TabPanels>
              <TabPanel>
                {loading ? <Spinner /> : error ? <Alert status="error"><AlertIcon />{error}</Alert> : (
                  <VStack spacing={6} align="stretch">
                    {(userRole === 'admin' || userRole === 'moderator') && (
                      <Box>
                        <Heading size="sm" mb={2}>Add Candidate</Heading>
                        <HStack>
                          <Input 
                            placeholder="Candidate Name" 
                            value={newCandidateName} 
                            onChange={(e) => setNewCandidateName(e.target.value)} 
                          />
                          <Button onClick={handleAddCandidate} colorScheme="blue">Add</Button>
                        </HStack>
                      </Box>
                    )}
                    
                    <Box>
                      <Heading size="sm" mb={3}>Candidates</Heading>
                      {!isMember ? (
                        <Alert status="warning"><AlertIcon />You must be a member of this club to vote.</Alert>
                      ) : hasVoted ? (
                        <Alert status="info" flexDirection="column" alignItems="flex-start">
                          <AlertIcon />
                          <Box>
                            You have already voted in this election.<br/>
                            <b>Votes cast:</b> {votesCast}<br/>
                            <b>Your votes:</b> {candidates.filter(c => votedForCandidates.includes(c.id)).map(c => c.name).join(', ') || 'N/A'}
                          </Box>
                        </Alert>
                      ) : candidates.length > 0 ? (
                        <Box>
                          <Alert status="info" mb={4} borderRadius="md">
                            <AlertIcon />
                            You can vote for up to 6 candidates.
                          </Alert>
                          <CheckboxGroup onChange={setSelectedCandidates} value={selectedCandidates}>
                            <VStack align="stretch" spacing={3}>
                              {candidates.map(c => (
                                <Checkbox 
                                  key={c.id} 
                                  value={String(c.id)}
                                  isDisabled={selectedCandidates.length >= 6 && !selectedCandidates.includes(String(c.id))}
                                >
                                  {c.name}
                                </Checkbox>
                              ))}
                            </VStack>
                          </CheckboxGroup>
                        </Box>
                      ) : (
                        <Text>No candidates have been added yet.</Text>
                      )}
                    </Box>
                  </VStack>
                )}
              </TabPanel>
              {isAdminOrModerator && (
                <TabPanel>
                  {loading ? <Spinner /> : error ? <Alert status="error"><AlertIcon />{error}</Alert> : (
                    <VStack spacing={4} align="stretch">
                      <Heading size="md">Live Results</Heading>
                      <Text>Total Votes: {totalVotes}</Text>
                      {results.length > 0 ? results.sort((a, b) => b.votes_count - a.votes_count).map(r => (
                        <Box key={r.id}>
                          <Flex justify="space-between" mb={1}>
                            <Text fontWeight="bold">{r.name}</Text>
                            <Text>{r.votes_count} ({totalVotes > 0 ? ((r.votes_count / totalVotes) * 100).toFixed(1) : 0}%)</Text>
                          </Flex>
                          <Progress value={totalVotes > 0 ? (r.votes_count / totalVotes) * 100 : 0} size="lg" colorScheme="blue" />
                        </Box>
                      )) : <Text>No votes have been cast yet.</Text>}
                    </VStack>
                  )}
                </TabPanel>
              )}
            </TabPanels>
          </Tabs>
        </ModalBody>
        <ModalFooter>
          {tabIndex === 0 && isMember && !hasVoted && candidates.length > 0 && (
            <Button 
              colorScheme="green" 
              mr={3} 
              onClick={handleVote} 
              isDisabled={selectedCandidates.length === 0 || selectedCandidates.length > 6}
            >
              Submit Vote
            </Button>
          )}
          <Button onClick={onClose}>Close</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default VotingModal;
