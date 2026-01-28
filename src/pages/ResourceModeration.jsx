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
  Progress,
  useColorModeValue,
  useToast
} from "@chakra-ui/react";
import { FiAlertCircle, FiBarChart2, FiCheck, FiDownload, FiFileText, FiImage, FiPaperclip } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  getReportedResources,
  markReportsReviewed,
  dismissReports
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

  const [reportedResources, setReportedResources] = useState([]);
  const [reportedPagination, setReportedPagination] = useState({ current_page: 1, last_page: 1, total: 0 });
  const [isLoadingReported, setIsLoadingReported] = useState(false);
  const [processingId, setProcessingId] = useState(null);

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

  const loadReportedResources = useCallback(async (page = 1) => {
    if (!canModerate) return;
    setIsLoadingReported(true);
    try {
      const data = await getReportedResources({ 
        page, 
        min_reports: 1,
        per_page: 10 
      });
      setReportedResources(Array.isArray(data?.data) ? data.data : []);
      setReportedPagination({
        current_page: data?.current_page || page,
        last_page: data?.last_page || 1,
        total: data?.total || 0
      });
    } catch (error) {
      toast({
        title: "Failed to load reported resources",
        description: error?.message || error?.error || "Please try again in a moment.",
        status: "error",
        duration: 4000,
        isClosable: true
      });
    } finally {
      setIsLoadingReported(false);
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
    loadReportedResources(1);
  }, [loadReportedResources]);

  const handlePageChange = (nextPage) => {
    if (nextPage < 1 || nextPage > reportedPagination.last_page || nextPage === reportedPagination.current_page) {
      return;
    }
    loadReportedResources(nextPage);
  };

  const removeResourceFromList = (resourceId) => {
    setReportedResources((prev) => prev.filter((item) => item.id !== resourceId));
    setReportedPagination((prev) => ({
      ...prev,
      total: Math.max((prev.total || 1) - 1, 0)
    }));
  };

  const handleMarkReviewed = async (resourceId) => {
    setProcessingId(resourceId);
    try {
      const result = await markReportsReviewed(resourceId);
      removeResourceFromList(resourceId);
      toast({
        title: "Reports marked as reviewed",
        description: `${result.count || 0} report(s) have been marked as reviewed.`,
        status: "success",
        duration: 2500,
        isClosable: true
      });
      if (reportedResources.length <= 1 && reportedPagination.current_page > 1) {
        loadReportedResources(reportedPagination.current_page - 1);
      }
    } catch (error) {
      toast({
        title: "Failed to mark reports as reviewed",
        description: error?.message || error?.error || "Please try again.",
        status: "error",
        duration: 3500,
        isClosable: true
      });
    } finally {
      setProcessingId(null);
    }
  };

  const handleDismiss = async (resourceId) => {
    setProcessingId(resourceId);
    try {
      const result = await dismissReports(resourceId);
      removeResourceFromList(resourceId);
      toast({
        title: "Reports dismissed",
        description: `${result.count || 0} report(s) have been dismissed.`,
        status: "info",
        duration: 2500,
        isClosable: true
      });
      if (reportedResources.length <= 1 && reportedPagination.current_page > 1) {
        loadReportedResources(reportedPagination.current_page - 1);
      }
    } catch (error) {
      toast({
        title: "Failed to dismiss reports",
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
          Manage reported content from the community.
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
            <FiAlertCircle size={20} />
            <Text fontSize="sm">
              {reportedPagination.total} reported {reportedPagination.total === 1 ? "resource" : "resources"} awaiting review
            </Text>
          </HStack>

          {isLoadingReported ? (
            <Center py={16}>
              <Spinner size="lg" color="blue.400" thickness="4px" />
            </Center>
          ) : reportedResources.length === 0 ? (
            <Center py={20} flexDirection="column" gap={3}>
              <FiCheck size={36} color="#48BB78" />
              <Heading size="md">All caught up!</Heading>
              <Text color={mutedText}>No reported resources need your attention right now.</Text>
            </Center>
          ) : (
            <Stack spacing={5}>
              {reportedResources.map((resource) => (
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
                                  <Badge colorScheme="red" textTransform="capitalize">
                                    {resource.open_reports_count || 0} {resource.open_reports_count === 1 ? 'Report' : 'Reports'}
                                  </Badge>
                                </HStack>
                                <Text fontSize="sm" color={mutedText} mt={1}>
                                  Posted by {resource?.user?.full_name || resource?.user?.username || "Unknown"}
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

                            {/* Display Reports */}
                            {Array.isArray(resource.open_reports) && resource.open_reports.length > 0 && (
                              <Box mb={4} p={3} bg={useColorModeValue("red.50", "red.900")} borderRadius="md" borderLeft="4px solid" borderColor="red.500">
                                <Text fontWeight="semibold" mb={2} color={useColorModeValue("red.700", "red.200")}>
                                  Reports ({resource.open_reports.length})
                                </Text>
                                <Stack spacing={2}>
                                  {resource.open_reports.slice(0, 3).map((report, idx) => (
                                    <Box key={report.id || idx} fontSize="sm">
                                      <HStack spacing={2} mb={1}>
                                        <Avatar size="xs" name={report.reporter?.username || "User"} src={report.reporter?.avatar} />
                                        <Text fontWeight="medium">
                                          {report.reporter?.first_name && report.reporter?.last_name 
                                            ? `${report.reporter.first_name} ${report.reporter.last_name}`
                                            : report.reporter?.username || "Anonymous"}
                                        </Text>
                                        <Text color={mutedText}>reported for:</Text>
                                        <Badge colorScheme="red" fontSize="xs">{report.reason || "No reason"}</Badge>
                                      </HStack>
                                      {report.details && (
                                        <Text color={mutedText} fontSize="xs" ml={6}>
                                          {report.details}
                                        </Text>
                                      )}
                                    </Box>
                                  ))}
                                  {resource.open_reports.length > 3 && (
                                    <Text fontSize="xs" color={mutedText}>
                                      +{resource.open_reports.length - 3} more report(s)
                                    </Text>
                                  )}
                                </Stack>
                              </Box>
                            )}

                            <Stack direction={{ base: "column", md: "row" }} spacing={3} fontSize="sm" color={mutedText}>
                              <Box bg={accentBg} borderRadius="md" px={3} py={2}>
                                Course: {resource?.course?.name || "General"}
                              </Box>
                              <Box bg={accentBg} borderRadius="md" px={3} py={2}>
                                Attachments: {Array.isArray(resource.attachments) ? resource.attachments.length : 0}
                              </Box>
                            </Stack>
                          </Box>

                          <Divider orientation="vertical" display={{ base: "none", md: "block" }} />

                          <Stack spacing={3} minW={{ md: "220px" }}>
                            <Button
                              colorScheme="green"
                              leftIcon={<FiCheck />}
                              isLoading={processingId === resource.id}
                              loadingText="Processing"
                              onClick={() => handleMarkReviewed(resource.id)}
                            >
                              Mark Reviewed
                            </Button>
                            <Button
                              variant="outline"
                              colorScheme="orange"
                              leftIcon={<FiX />}
                              isLoading={processingId === resource.id}
                              loadingText="Processing"
                              onClick={() => handleDismiss(resource.id)}
                            >
                              Dismiss Reports
                            </Button>
                          </Stack>
                        </Flex>
                      </Box>
                    ))}
                  </Stack>
                )}

                {!isLoadingReported && reportedResources.length > 0 && (
                  <Pagination
                    currentPage={reportedPagination.current_page}
                    totalPages={reportedPagination.last_page}
                    onPageChange={handlePageChange}
                    isLoading={isLoadingReported}
                  />
                )}
        </Box>
      </Flex>
    </Box>
  );
};

export default ResourceModeration;
