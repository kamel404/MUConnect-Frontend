import { useEffect, useState, useCallback, useMemo } from "react";
import {
  Avatar,
  Badge,
  Box,
  Button,
  Center,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Icon,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Stack,
  Text,
  Textarea,
  Progress,
  useColorModeValue,
  useDisclosure,
  useToast
} from "@chakra-ui/react";
import { FiAlertCircle, FiBarChart2, FiCheck, FiClock, FiDownload, FiFileText, FiImage, FiPaperclip, FiX } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  approveResource,
  getPendingResources,
  rejectResource
} from "../services/resourceService";
import Pagination from "../components/Pagination";
import { FILES_BASE_URL } from "../config/env";

const ResourceModeration = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();
  const cardBg = useColorModeValue("rgba(255, 255, 255, 0.92)", "rgba(45, 55, 72, 0.85)");
  const borderColor = useColorModeValue("rgba(226, 232, 240, 0.8)", "rgba(74, 85, 104, 0.6)");
  const mutedText = useColorModeValue("gray.600", "gray.400");
  const accentBg = useColorModeValue("blue.50", "rgba(49, 130, 206, 0.12)");
  const attachmentBorder = useColorModeValue("rgba(226, 232, 240, 0.9)", "rgba(74, 85, 104, 0.7)");
  const pollBg = useColorModeValue("rgba(237, 242, 247, 0.7)", "rgba(45, 55, 72, 0.6)");
  const pollBorder = useColorModeValue("rgba(203, 213, 224, 0.9)", "rgba(74, 85, 104, 0.6)");

  const [resources, setResources] = useState([]);
  const [pagination, setPagination] = useState({ current_page: 1, last_page: 1, total: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  const [selectedResource, setSelectedResource] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [reasonError, setReasonError] = useState("");

  const {
    isOpen: isRejectModalOpen,
    onOpen: onRejectModalOpen,
    onClose: onRejectModalClose
  } = useDisclosure();

  const closeRejectModal = () => {
    onRejectModalClose();
    setSelectedResource(null);
    setRejectionReason("");
    setReasonError("");
  };

  const normalizeRoles = (roles) => {
    if (!roles) return [];
    if (Array.isArray(roles)) return roles.map((role) => role?.toLowerCase()).filter(Boolean);
    return [String(roles).toLowerCase()];
  };

  const canModerate = useMemo(() => {
    const storedRole = (localStorage.getItem("role") || "").toLowerCase();
    const userRoles = normalizeRoles(user?.roles);
    const namedRoles = normalizeRoles(user?.role_names);
    const directRole = normalizeRoles(user?.role);

    const combined = new Set([...userRoles, ...namedRoles, ...directRole, storedRole]);
    return combined.has("admin") || combined.has("moderator");
  }, [user]);

  const formatTimestamp = (value) => {
    if (!value) return "Unknown";
    const date = new Date(String(value).replace(" ", "T"));
    return Number.isNaN(date.getTime()) ? value : date.toLocaleString();
  };

  const resolveAttachmentUrl = (url) => {
    if (!url) return "#";
    if (/^https?:\/\//i.test(url)) return url;
    const base = FILES_BASE_URL || "";
    if (!base) return url;
    if (url.startsWith("/")) {
      return `${base}${url}`;
    }
    return `${base}/${url}`;
  };

  const getAttachmentIcon = (attachment) => {
    const type = (attachment?.type || "").toLowerCase();
    const mime = (attachment?.mime_type || "").toLowerCase();
    if (type === "image" || mime.startsWith("image")) return FiImage;
    if (type === "document" || mime.includes("pdf") || mime.includes("word")) return FiFileText;
    return FiPaperclip;
  };

  const getPollForResource = (resource) => {
    if (!resource) return null;
    if (resource.poll) return resource.poll;
    if (resource.polls && !Array.isArray(resource.polls)) return resource.polls;
    return null;
  };

  const loadPendingResources = useCallback(async (page = 1) => {
    if (!canModerate) return;
    setIsLoading(true);
    try {
      const data = await getPendingResources({ page });
      setResources(Array.isArray(data?.data) ? data.data : []);
      setPagination({
        current_page: data?.current_page || page,
        last_page: data?.last_page || 1,
        total: data?.total || 0
      });
    } catch (error) {
      toast({
        title: "Failed to load pending resources",
        description: error?.message || error?.error || "Please try again in a moment.",
        status: "error",
        duration: 4000,
        isClosable: true
      });
    } finally {
      setIsLoading(false);
    }
  }, [canModerate, toast]);

  useEffect(() => {
    if (user && !canModerate) {
      toast({
        title: "Access restricted",
        description: "You do not have permission to moderate resources.",
        status: "warning",
        duration: 3000,
        isClosable: true
      });
      navigate("/dashboard", { replace: true });
    }
  }, [user, canModerate, navigate, toast]);

  useEffect(() => {
    loadPendingResources(1);
  }, [loadPendingResources]);

  const handlePageChange = (nextPage) => {
    if (nextPage < 1 || nextPage > pagination.last_page || nextPage === pagination.current_page) {
      return;
    }
    loadPendingResources(nextPage);
  };

  const removeResourceFromList = (resourceId) => {
    setResources((prev) => prev.filter((item) => item.id !== resourceId));
    setPagination((prev) => ({
      ...prev,
      total: Math.max((prev.total || 1) - 1, 0)
    }));
  };

  const handleApprove = async (resourceId) => {
    setProcessingId(resourceId);
    try {
      await approveResource(resourceId);
      removeResourceFromList(resourceId);
      toast({
        title: "Resource approved",
        status: "success",
        duration: 2500,
        isClosable: true
      });
      if (resources.length <= 1 && pagination.current_page > 1) {
        loadPendingResources(pagination.current_page - 1);
      }
    } catch (error) {
      toast({
        title: "Approval failed",
        description: error?.message || error?.error || "Please try again.",
        status: "error",
        duration: 3500,
        isClosable: true
      });
    } finally {
      setProcessingId(null);
    }
  };

  const openRejectModal = (resource) => {
    setSelectedResource(resource);
    setRejectionReason("");
    setReasonError("");
    onRejectModalOpen();
  };

  const handleReject = async () => {
    const trimmedReason = rejectionReason.trim();
    if (!trimmedReason) {
      setReasonError("Please provide a reason for rejection.");
      return;
    }

    if (!selectedResource) return;

    setProcessingId(selectedResource.id);
    try {
      await rejectResource(selectedResource.id, trimmedReason);
      removeResourceFromList(selectedResource.id);
      toast({
        title: "Resource rejected",
        status: "info",
        duration: 2500,
        isClosable: true
      });
      closeRejectModal();
      if (resources.length <= 1 && pagination.current_page > 1) {
        loadPendingResources(pagination.current_page - 1);
      }
    } catch (error) {
      toast({
        title: "Rejection failed",
        description: error?.message || error?.error || "Please try again.",
        status: "error",
        duration: 3500,
        isClosable: true
      });
    } finally {
      setProcessingId(null);
    }
  };

  if (!canModerate) {
    return (
      <Center minH="70vh">
        <Stack spacing={4} align="center">
          <FiAlertCircle size={48} color="#DD6B20" />
          <Text color={mutedText}>Redirecting...</Text>
        </Stack>
      </Center>
    );
  }

  return (
    <Box
      position="relative"
      bg={useColorModeValue("gray.50", "gray.900")}
      minH="calc(100vh - 60px)"
      py={6}
      px={{ base: 4, md: 6, lg: 8 }}
    >
      <Flex direction="column" maxW="1200px" mx="auto" gap={6}>
        <Heading size="lg">Resource Moderation</Heading>
        <Text color={mutedText} maxW="720px">
          Review new resources submitted by the community. Approve high-quality contributions or reject those that do not meet the guidelines.
        </Text>

        <Box
          bg={cardBg}
          borderRadius="xl"
          border="1px solid"
          borderColor={borderColor}
          boxShadow="sm"
          px={{ base: 4, md: 6 }}
          py={6}
        >
          <HStack spacing={3} mb={4} color={mutedText}>
            <FiClock size={20} />
            <Text fontSize="sm">
              {pagination.total} pending {pagination.total === 1 ? "resource" : "resources"} in queue
            </Text>
          </HStack>

          {isLoading ? (
            <Center py={16}>
              <Spinner size="lg" color="blue.400" thickness="4px" />
            </Center>
          ) : resources.length === 0 ? (
            <Center py={20} flexDirection="column" gap={3}>
              <FiCheck size={36} color="#48BB78" />
              <Heading size="md">All caught up!</Heading>
              <Text color={mutedText}>No resources are waiting for review right now.</Text>
            </Center>
          ) : (
            <Stack spacing={5}>
              {resources.map((resource) => (
                <Box
                  key={resource.id}
                  borderRadius="lg"
                  border="1px solid"
                  borderColor={borderColor}
                  bg={useColorModeValue("white", "gray.800")}
                  p={{ base: 4, md: 5 }}
                >
                  <Flex direction={{ base: "column", md: "row" }} gap={5}>
                    <Box flex="1">
                      <HStack spacing={3} align="flex-start" mb={3}>
                        <Avatar
                          size="md"
                          name={resource?.user?.full_name || resource?.user?.username || "User"}
                          src={resource?.user?.avatar_url || undefined}
                        />
                        <Box>
                          <HStack spacing={3} align="center">
                            <Heading size="md">{resource.title || "Untitled"}</Heading>
                            <Badge colorScheme="yellow" textTransform="capitalize">
                              {resource.approval_status || "pending"}
                            </Badge>
                          </HStack>
                          <Text fontSize="sm" color={mutedText} mt={1}>
                            Submitted by {resource?.user?.full_name || resource?.user?.username || "Unknown"}
                          </Text>
                          <Text fontSize="xs" color={mutedText}>
                            {formatTimestamp(resource.created_at)}
                          </Text>
                        </Box>
                      </HStack>

                      <Text color={useColorModeValue("gray.700", "gray.200")} whiteSpace="pre-wrap">
                        {resource.description || "No description provided."}
                      </Text>

                      <Divider my={4} opacity={0.4} />

                      <Stack direction={{ base: "column", md: "row" }} spacing={3} fontSize="sm" color={mutedText}>
                        <Box bg={accentBg} borderRadius="md" px={3} py={2}>
                          Course: {resource?.course?.name || "General"}
                        </Box>
                        <Box bg={accentBg} borderRadius="md" px={3} py={2}>
                          Attachments: {Array.isArray(resource.attachments) ? resource.attachments.length : 0}
                        </Box>
                      </Stack>

                      {Array.isArray(resource.attachments) && resource.attachments.length > 0 && (
                        <Box mt={4}>
                          <Text fontSize="sm" fontWeight="semibold" mb={2}>
                            Attachments
                          </Text>
                          <Stack spacing={2}>
                            {resource.attachments.map((attachment) => {
                              const AttachmentIcon = getAttachmentIcon(attachment);
                              const attachmentUrl = resolveAttachmentUrl(attachment?.url);
                              return (
                                <Flex
                                  key={attachment.id || attachment.url}
                                  align="center"
                                  border="1px solid"
                                  borderColor={attachmentBorder}
                                  borderRadius="md"
                                  px={3}
                                  py={2}
                                  gap={3}
                                >
                                  <Icon as={AttachmentIcon} fontSize="lg" color="blue.400" />
                                  <Box flex="1" minW={0}>
                                    <Text noOfLines={1} fontWeight="medium">
                                      {attachment?.original_name || attachment?.name || "Attachment"}
                                    </Text>
                                    <Text fontSize="xs" color={mutedText}>
                                      {attachment?.mime_type || attachment?.type || "File"}
                                    </Text>
                                  </Box>
                                  <Button
                                    as={Link}
                                    href={attachmentUrl}
                                    isExternal
                                    variant="ghost"
                                    size="sm"
                                    leftIcon={<FiDownload />}
                                  >
                                    Open
                                  </Button>
                                </Flex>
                              );
                            })}
                          </Stack>
                        </Box>
                      )}

                      {(() => {
                        const poll = getPollForResource(resource);
                        if (!poll) {
                          return null;
                        }

                        const options = Array.isArray(poll.options) ? poll.options : [];
                        const totalVotes = options.reduce((sum, option) => sum + (option.vote_count || 0), 0);

                        return (
                          <Box mt={6} border="1px solid" borderColor={pollBorder} borderRadius="lg" bg={pollBg} p={4}>
                            <HStack spacing={2} mb={3} color={mutedText}>
                              <Icon as={FiBarChart2} />
                              <Text fontWeight="semibold">Poll Question</Text>
                            </HStack>
                            <Text fontWeight="bold" mb={3}>
                              {poll.question || "Poll"}
                            </Text>
                            <Stack spacing={3}>
                              {options.length === 0 ? (
                                <Text fontSize="sm" color={mutedText}>
                                  No poll options provided.
                                </Text>
                              ) : (
                                options.map((option) => {
                                  const voteCount = option.vote_count || 0;
                                  const percentage = totalVotes > 0 ? Math.round((voteCount / totalVotes) * 100) : 0;

                                  return (
                                    <Box key={option.id || option.option_text}>
                                      <Flex justify="space-between" fontSize="sm" mb={1}>
                                        <Text fontWeight="medium">{option.option_text}</Text>
                                        <Text color={mutedText}>{voteCount} votes</Text>
                                      </Flex>
                                      <Progress value={percentage} colorScheme="blue" borderRadius="md" />
                                      <Text fontSize="xs" color={mutedText} mt={1}>
                                        {percentage}%
                                      </Text>
                                    </Box>
                                  );
                                })
                              )}
                            </Stack>
                            <Text fontSize="xs" color={mutedText} mt={3}>
                              Total votes: {totalVotes}
                            </Text>
                          </Box>
                        );
                      })()}
                    </Box>

                    <Divider orientation="vertical" display={{ base: "none", md: "block" }} />

                    <Stack spacing={3} minW={{ md: "220px" }}>
                      <Button
                        colorScheme="green"
                        leftIcon={<FiCheck />}
                        isLoading={processingId === resource.id}
                        loadingText="Approving"
                        onClick={() => handleApprove(resource.id)}
                      >
                        Approve
                      </Button>
                      <Button
                        variant="outline"
                        colorScheme="red"
                        leftIcon={<FiX />}
                        isLoading={processingId === resource.id && selectedResource?.id === resource.id && isRejectModalOpen}
                        onClick={() => openRejectModal(resource)}
                      >
                        Reject
                      </Button>
                    </Stack>
                  </Flex>
                </Box>
              ))}
            </Stack>
          )}

          {!isLoading && resources.length > 0 && (
            <Pagination
              currentPage={pagination.current_page}
              totalPages={pagination.last_page}
              onPageChange={handlePageChange}
              isLoading={isLoading}
            />
          )}
        </Box>
      </Flex>

  <Modal isOpen={isRejectModalOpen} onClose={closeRejectModal} isCentered size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Reject resource</ModalHeader>
          <ModalCloseButton disabled={processingId === selectedResource?.id} onClick={closeRejectModal} />
          <ModalBody>
            <FormControl isInvalid={Boolean(reasonError)}>
              <FormLabel>Reason for rejection</FormLabel>
              <Textarea
                placeholder="Describe why this resource is being rejected"
                value={rejectionReason}
                onChange={(event) => {
                  setRejectionReason(event.target.value);
                  if (reasonError) {
                    setReasonError("");
                  }
                }}
                rows={5}
              />
              {reasonError && (
                <Text color="red.500" fontSize="sm" mt={2}>
                  {reasonError}
                </Text>
              )}
            </FormControl>
          </ModalBody>

          <ModalFooter gap={3}>
            <Button variant="ghost" onClick={closeRejectModal} isDisabled={processingId === selectedResource?.id}>
              Cancel
            </Button>
            <Button
              colorScheme="red"
              leftIcon={<FiX />}
              onClick={handleReject}
              isLoading={processingId === selectedResource?.id}
              loadingText="Rejecting"
            >
              Reject resource
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default ResourceModeration;
