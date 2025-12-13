import {
  Flex,
  Box,
  Text,
  Button,
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  useColorModeValue,
  Badge,
  Avatar,
  Icon,
  IconButton,
  Image,
  HStack,
  VStack,
  Divider,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Input,
  InputGroup,
  InputRightElement,
  Textarea,
  Tooltip,
  Skeleton,
  SkeletonText,
  SkeletonCircle,
  Progress,
  useDisclosure,
  useToast,
  Menu,
  MenuButton,
  MenuList,
  Grid,
  ModalCloseButton,
  MenuItem,
  ModalBody,
  SimpleGrid, // Changed from Grid
  GridItem,
  ModalOverlay,
  ModalContent,
  useColorMode,
  Modal,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  Heading
} from "@chakra-ui/react";
import {
  FiArrowLeft,
  FiBookOpen,
  FiBookmark,
  FiCalendar,
  FiCheck,
  FiChevronDown,
  FiChevronUp,
  FiClock,
  FiCopy,
  FiDownload,
  FiExternalLink,
  FiEye,
  FiFile,
  FiFileText,
  FiVideo ,
  FiLink,
  FiList,
  FiMaximize2,
  FiMessageCircle,
  FiMoreHorizontal,
  FiMoreVertical,
  FiSend,
  FiShare2,
  FiStar,
  FiTag,
  FiThumbsUp,
  FiTrendingUp,
  FiUser,
  FiUserPlus,
  FiX,
  FiZoomIn,
  FiZoomOut,
  FiEdit,
  FiTrash,
  FiChevronLeft,
  FiChevronRight
} from "react-icons/fi";
import { socialIcons } from "../assets/socialIcons";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef, lazy } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { getResourceById, toggleUpvote, toggleSaveResource, votePollOption, toggleCommentUpvote, addComment, updateComment, deleteComment, generateQuiz, generateSummary, pollAIJobStatus } from "../services/resourceService";
import { API_BASE_URL, FILES_BASE_URL } from "../config/env";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
// import ReactPlayer from 'react-player';
import QuickInfoCard from "../components/resources/QuickInfoCard";
import jsPDF from "jspdf";

const ReactPlayer = lazy(() => import('react-player'));


const MotionBox = motion(Box);

const CustomPrevArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <Box
      className={className}
      style={{
        ...style,
        left: "10px",
        zIndex: 1,
        background: "rgba(0,0,0,0.5)",
        borderRadius: "50%",
        width: "40px",
        height: "40px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}
      onClick={onClick}
    >
    </Box>
  );
};

const CustomNextArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <Box
      className={className}
      style={{
        ...style,
        right: "10px",
        zIndex: 1,
        background: "rgba(0,0,0,0.5)",
        borderRadius: "50%",
        width: "40px",
        height: "40px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}
      onClick={onClick}
    >
    </Box>
  );
};

const ResourceContentPage = () => {
  // Delete confirmation dialog
  const { isOpen: isDeleteOpen, onOpen: openDeleteDialog, onClose: closeDeleteDialog } = useDisclosure();
  const cancelDeleteRef = useRef();
  const [commentToDelete, setCommentToDelete] = useState(null);
  // State for comment editing
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingText, setEditingText] = useState("");
  // Router hooks
  const { id } = useParams();
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();

  // UI hooks
  const toast = useToast();
  const { isOpen: isCommentsOpen, onToggle: toggleComments, onClose: closeComments, onOpen: openComments } = useDisclosure({ defaultIsOpen: true });
  const commentInputRef = useRef(null);
  const contentRef = useRef(null);
  const { colorMode } = useColorMode();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedImage, setSelectedImage] = useState(null);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const addCommentLockRef = useRef(false);
  const [isDeletingComment, setIsDeletingComment] = useState(false);
  const deleteCommentLockRef = useRef(false);

  // --------------------------------- QUIZ GENERATION ---------------------------------
  const handleGenerateQuiz = async (attachmentId, docName = 'quiz') => {
    if (!resource?.id || !attachmentId) return;

    // Mark loading for this attachment
    setQuizMap(prev => ({
      ...prev,
      [attachmentId]: {
        ...(prev[attachmentId] || {}),
        loading: true,
        url: null,
        name: docName,
        error: null
      }
    }));

    try {
      // Call API to generate quiz
      const response = await generateQuiz(resource.id, attachmentId);

      // Use result from response
      const quiz = response.result || response.quiz || response;

      if (!quiz || quiz.length === 0) {
        setQuizMap(prev => ({
          ...prev,
          [attachmentId]: {
            ...(prev[attachmentId] || {}),
            loading: false,
            error: 'No quiz content generated. Please try again.'
          }
        }));
        toast({ title: 'No quiz content generated', description: 'Please try again', status: 'error', duration: 5000, isClosable: true });
        return;
      }

      // Generate PDF
      const doc = new jsPDF();

      /* ---------------- Questions Section ---------------- */
      let y = 10;
      quiz.forEach((q, idx) => {
        doc.setFontSize(12);
        const questionLines = doc.splitTextToSize(`${idx + 1}. ${stripHtml(q.question)}`, 180);
        doc.text(questionLines, 10, y);
        y += questionLines.length * 6 + 4;

        (q.options || []).forEach((opt, optIdx) => {
          const optionLines = doc.splitTextToSize(`${String.fromCharCode(65 + optIdx)}. ${stripHtml(opt)}`, 170);
          doc.text(optionLines, 14, y);
          y += optionLines.length * 6 + 2;
        });

        y += 6; // space between questions
        if (y > 280) {
          doc.addPage();
          y = 10;
        }
      });

      /* ---------------- Answer Key Section ---------------- */
      doc.addPage();
      doc.setFontSize(14);
      doc.text('Answer Key', 10, 10);
      let ay = 20;

      quiz.forEach((q, idx) => {
        doc.setFontSize(12);
        const answerLine = `${idx + 1}. ${stripHtml(q.correct_answer)}`;
        const answerLines = doc.splitTextToSize(answerLine, 180);
        doc.text(answerLines, 10, ay);
        ay += answerLines.length * 6 + 2;

        if (q.explanation) {
          doc.setFontSize(10);
          const expLines = doc.splitTextToSize(`Explanation: ${stripHtml(q.explanation)}`, 180);
          doc.text(expLines, 12, ay);
          ay += expLines.length * 5 + 4;
        }

        if (ay > 280) {
          doc.addPage();
          ay = 10;
        }
      });

      const blob = doc.output('blob');
      const url = URL.createObjectURL(blob);
      setQuizMap(prev => ({
        ...prev,
        [attachmentId]: {
          url,
          loading: false,
          name: docName,
          error: null
        }
      }));
      toast({ title: 'Quiz generated successfully', status: 'success', duration: 3000, isClosable: true });

    } catch (err) {
      setQuizMap(prev => ({
        ...prev,
        [attachmentId]: {
          ...(prev[attachmentId] || {}),
          loading: false,
          error: err.message || 'Failed to generate quiz'
        }
      }));
      toast({ title: 'Failed to generate quiz', description: err.message || 'Try again later', status: 'error', duration: 3000, isClosable: true });
    }
  };

  // --------------------------------- SUMMARY GENERATION ---------------------------------
  const handleGenerateSummary = async (attachmentId, docName = 'summary') => {
    if (!resource?.id || !attachmentId) return;

    setSummaryMap(prev => ({
      ...prev,
      [attachmentId]: {
        ...(prev[attachmentId] || {}),
        loading: true,
        url: null,
        name: docName,
        error: null
      }
    }));

    try {
      // Call API to generate summary
      const response = await generateSummary(resource.id, attachmentId);

      // Use result from response
      const summaryObj = response.result || response.summary || response;
      const introduction = summaryObj.introduction || '';
      const conceptSummaries = summaryObj.concept_summaries || {};
      const order = Array.isArray(summaryObj.key_topics) && summaryObj.key_topics.length
        ? summaryObj.key_topics
        : Object.keys(conceptSummaries);

      if (!summaryObj || (!introduction && Object.keys(conceptSummaries).length === 0)) {
        setSummaryMap(prev => ({
          ...prev,
          [attachmentId]: {
            ...(prev[attachmentId] || {}),
            loading: false,
            error: 'No summary content generated. Please try again.'
          }
        }));
        toast({ title: 'No summary content generated', description: 'Please try again', status: 'error', duration: 5000, isClosable: true });
        return;
      }

      const doc = new jsPDF();
      let y = 10;

      // ---------------- Introduction ----------------
      if (introduction) {
        doc.setFontSize(14);
        doc.text('Introduction', 10, y);
        y += 8;
        doc.setFontSize(11);
        const introLines = doc.splitTextToSize(introduction, 180);
        introLines.forEach(line => {
          doc.text(line, 10, y);
          y += 6;
          if (y > 280) { doc.addPage(); y = 10; }
        });
        y += 4;
      }

      // ---------------- Concepts ----------------
      order.forEach(topic => {
        const brief = conceptSummaries[topic] || '';
        if (!brief) return;
        doc.setFontSize(13);
        doc.text(topic, 10, y);
        y += 7;
        doc.setFontSize(11);
        const briefLines = doc.splitTextToSize(brief, 180);
        briefLines.forEach(line => {
          doc.text(line, 10, y);
          y += 6;
          if (y > 280) { doc.addPage(); y = 10; }
        });
        y += 6;
      });

      const blob = doc.output('blob');
      const url = URL.createObjectURL(blob);
      setSummaryMap(prev => ({
        ...prev,
        [attachmentId]: {
          url,
          loading: false,
          name: docName,
          error: null
        }
      }));
      toast({ title: 'Summary generated successfully', status: 'success', duration: 3000, isClosable: true });

    } catch (err) {
      setSummaryMap(prev => ({
        ...prev,
        [attachmentId]: {
          ...(prev[attachmentId] || {}),
          loading: false,
          error: err.message || 'Failed to generate summary'
        }
      }));
      toast({ title: 'Failed to generate summary', description: err.message || 'Try again later', status: 'error', duration: 3000, isClosable: true });
    }
  };

  // Theme colors
  const cardBg = useColorModeValue("white", "gray.700");
  const textColor = useColorModeValue("gray.800", "white");
  const mutedText = useColorModeValue("gray.500", "gray.400");
  const accentColor = useColorModeValue("blue.500", "blue.300");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const hoverBg = useColorModeValue("gray.100", "gray.600");
  const bgColor = useColorModeValue("gray.50", "gray.800");
  const highlightBg = useColorModeValue("blue.50", "blue.900");

  // State for interactive elements
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState([]);
  const [likes, setLikes] = useState(47);
  const [isLoading, setIsLoading] = useState(true);
  const [showAllComments, setShowAllComments] = useState(false);
  const [resource, setResource] = useState(null);

  // Simple reading preferences
  const [fontSize, setFontSize] = useState(16);
  const [readingProgress, setReadingProgress] = useState(0);
  // Poll voting state
  const [userVotes, setUserVotes] = useState({}); // { [pollId]: optionId }
  const [votedPolls, setVotedPolls] = useState({}); // { [pollId]: true }
  // local poll data with up-to-date counts
  const [pollData, setPollData] = useState([]);
  // Quiz generation per-document state: { [docId]: { url: string|null, loading: boolean, name: string } }
  const [quizMap, setQuizMap] = useState({});
  // Summary generation per-document state: { [docId]: { url: string|null, loading: boolean, name: string } }
  const [summaryMap, setSummaryMap] = useState({});
  // Check if any PDF documents are attached
  const hasPdf = resource?.documents?.some((doc) => (doc.original_name && doc.original_name.toLowerCase().endsWith('.pdf')) || (doc.url && doc.url.toLowerCase().endsWith('.pdf')));

  // Utility function to resolve URLs (handle both relative and absolute URLs)
  const resolveUrl = (url) => {
    if (!url) return '';
    
    // If it's already a full URL (starts with http:// or https://), return as is
    if (/^https?:\/\//i.test(url)) {
      return url;
    }
    
    // If it's a relative path, it should already be a CDN URL from the API
    // Just return it as is since the API now returns direct CDN URLs
    return url;
  };

  // Debug function to log image URLs
  const debugImageUrls = () => {
    if (resource?.images?.length) {
      console.log("Image URLs:", resource.images.map(img => ({
        original: img.url,
        resolved: resolveUrl(img.url)
      })));
    }
  };

  // Function to handle bookmarking the resource
  const handleBookmark = async () => {
    try {
      // Toggle saved state optimistically
      setIsSaved(prev => !prev);

      if (resource?.id) {
        // Call API to update resource saved status
        await toggleSaveResource(resource.id);

        // Show success toast
        toast({
          title: isSaved ? "Resource removed from saved items" : "Resource saved successfully",
          status: "success",
          duration: 2000,
          isClosable: true
        });
      }
    } catch (error) {
      // Revert optimistic update if there's an error
      setIsSaved(prev => !prev);

      toast({
        title: "Error",
        description: "Could not update saved status. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true
      });

      console.error("Error updating bookmark status:", error);
    }
  };

  // Fetch resource data from backend
  useEffect(() => {
    const fetchResource = async () => {
      setIsLoading(true);
      try {
        const data = await getResourceById(id);
        console.log("Resource data:", data);

        // Transform API response to match UI expectations
        const formatted = {
          id: data.id,
          type: data.attachments?.[0]?.file_type?.toUpperCase() || "Resource",
          title: data.title,
          difficulty: "",
          fileSize: "",
          dateAdded: data.created_at,
          lastUpdated: data.updated_at,
          readTime: "",
          author: {
            id: data.user?.id,
            name: `${data.user?.first_name || ""} ${data.user?.last_name || ""}`.trim() || data.user?.username || "Unknown",
            avatar: data.user?.avatar_url,
            verified: data.user?.primary_role === 'admin' || data.user?.primary_role === 'moderator',
            resources: null,
          },
          likes: data.upvote_count ?? 0,
          shares: 0,
          comments: data.comments || [],
          images: (data.attachments || []).filter(att => att.file_type === "image"),
          videos: (data.attachments || []).filter(att => att.file_type === "video"),
          documents: (data.attachments || []).filter(att => att.file_type === "document"),
          content: data.description,
          courseName: data.course?.title || data.course_name || "",
          courseCode: data.course?.code || data.course_code || "",
          related: [],
          // Normalize polls similar to ResourceCard
          polls: (() => {
            if (!data.polls) return [];
            const pollsArray = Array.isArray(data.polls) ? data.polls : [data.polls];
            return pollsArray.map((poll) => ({
              id: poll.id,
              question: poll.question,
              options: (poll.options || []).map((opt) => ({
                id: opt.id,
                text: opt.option_text ?? opt.text ?? '',
                votes: opt.vote_count ?? opt.votes ?? 0,
              })),
            }));
          })(),
        };

        setResource(formatted);

        // Initialize poll data from formatted resource
        if (formatted.polls && formatted.polls.length > 0) {
          setPollData(formatted.polls);

          // Initialize user vote state if user has voted
          const poll = data.polls;
          if (poll && poll.user_option_id) {
            setUserVotes({ [poll.id]: poll.user_option_id });
            setVotedPolls({ [poll.id]: true });
          }
        }

        // Initialize saved state from API data - explicitly check for is_saved property
        console.log("Resource saved status:", data.is_saved);
        setIsSaved(data.is_saved === true);

        setIsLiked(!!data.is_upvoted);
        setLikes(data.upvote_count ?? 0);
        // Map comments from API response to component structure
        const mappedComments = (data.comments || []).map(comment => ({
          id: comment.id,
          text: comment.body,
          date: comment.created_at,
          user: comment.user,
          likes: comment.upvote_count || 0,
          isUpvoted: comment.is_upvoted || false
        }));

        setComments(mappedComments);

        // Debug image URLs after setting resource
        setTimeout(() => {
          console.log('Resource images:', formatted.images);
          if (formatted.images?.length) {
            formatted.images.forEach(img => {
              console.log('Image URL:', img.url);
              console.log('Resolved URL:', resolveUrl(img.url));
            });
          }
        }, 100);
      } catch (err) {
        console.error("Failed to fetch resource", err);
        toast({
          title: "Failed to load resource",
          description: err.message || "An unexpected error occurred",
          status: "error",
          duration: 3000,
          isClosable: true
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchResource();
    }
  }, [id]);

  // Track scroll position for progress bar
  useEffect(() => {
    const trackScroll = () => {
      if (contentRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = contentRef.current;
        const progress = (scrollTop / (scrollHeight - clientHeight)) * 100;
        setReadingProgress(Math.min(progress, 100));
      }
    };

    const contentElement = contentRef.current;
    if (contentElement) {
      contentElement.addEventListener('scroll', trackScroll);
      return () => contentElement.removeEventListener('scroll', trackScroll);
    }
  }, []);

  // Enhanced handler functions
  const handleLike = async () => {
    const previousLiked = isLiked;
    const previousLikes = likes;
    setIsLiked(!previousLiked);
    setLikes(previousLiked ? previousLikes - 1 : previousLikes + 1);
    try {
      await toggleUpvote(id);
      toast({
        title: previousLiked ? "Upvote removed" : "Resource upvoted",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    } catch (err) {
      // Revert state on error
      setIsLiked(previousLiked);
      setLikes(previousLikes);
      toast({
        title: "Unable to update upvote",
        description: err.message || "An unexpected error occurred",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // Handle comment upvotes via API
  const handleCommentUpvote = async (commentId) => {
    try {
      const { message, upvote_count, is_upvoted } = await toggleCommentUpvote(commentId);

      // Update comment upvote state
      setComments(prev => prev.map(comment =>
        comment.id === commentId
          ? { ...comment, isUpvoted: is_upvoted, likes: upvote_count }
          : comment
      ).sort((a, b) => b.likes - a.likes)); // Sort by likes count after update

      toast({
        title: message || (is_upvoted ? "Comment upvoted" : "Upvote removed"),
        status: "success",
        duration: 2000,
        isClosable: true
      });
    } catch (error) {
      console.error("Error upvoting comment:", error);
      toast({
        title: "Error",
        description: "Could not update upvote. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true
      });
    }
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
    toast({
      title: isSaved ? "Removed from collection" : "Saved to collection",
      status: "success",
      duration: 2000,
      isClosable: true,
    });
  };

  const handleShare = async () => {
    try {
      const shareUrl = window.location.href;
      if (navigator.share) {
        await navigator.share({
          title: resource?.title || 'Resource',
          url: shareUrl,
        });
      } else {
        await navigator.clipboard.writeText(shareUrl);
        toast({
          title: "Link copied",
          description: "Resource link copied to clipboard",
          status: "success",
          duration: 2000,
          isClosable: true,
        });
      }
    } catch (err) {
      console.error('Share failed', err);
      toast({
        title: 'Unable to share',
        status: 'error',
        duration: 2000,
        isClosable: true,
      });
    }
  };



  // Start editing a comment
  const startEditingComment = (comment) => {
    setEditingCommentId(comment.id);
    setEditingText(comment.text);
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingCommentId(null);
    setNewCommentText("");
    setEditingText("");
  };

  // Submit edited comment
  const submitEditedComment = async () => {
    if (!editingCommentId || !editingText.trim()) return;
    try {
      await updateComment(editingCommentId, editingText.trim());
      toast({ title: "Comment updated", status: "success", duration: 2000, isClosable: true });
      // Refresh resource to get latest comments
      const data = await getResourceById(id);
      const mapped = (data.comments || []).map(c => ({
        id: c.id, text: c.body, date: c.created_at, user: c.user, likes: c.upvote_count || 0, isUpvoted: c.is_upvoted || false
      }));
      setComments(mapped);
      setEditingText("");
      cancelEditing();
    } catch (err) {
      console.error('Update comment error', err);
      // toast({ title: 'Failed to update comment', status: 'error', duration: 3000, isClosable: true });
    }
  };

  // Open delete confirmation
  const openDeleteConfirm = (commentId) => {
    setCommentToDelete(commentId);
    openDeleteDialog();
  };

  // Confirm deletion
  const confirmDeleteComment = async () => {
    if (!commentToDelete || deleteCommentLockRef.current) return;
    deleteCommentLockRef.current = true;
    setIsDeletingComment(true);
    try {
      await deleteComment(commentToDelete);
      setComments(prev => prev.filter(c => c.id !== commentToDelete));
      toast({ title: 'Comment deleted', status: 'success', duration: 2000, isClosable: true });
    } catch (err) {
      console.error('Delete comment error', err);
      toast({ title: 'Failed to delete comment', status: 'error', duration: 3000, isClosable: true });
    } finally {
      setCommentToDelete(null);
      setIsDeletingComment(false);
      deleteCommentLockRef.current = false;
      closeDeleteDialog();
    }
  };

  const handleAddComment = async () => {
    const text = (commentText || '').trim();
    if (addCommentLockRef.current || !text) return;

    addCommentLockRef.current = true;
    setIsSubmittingComment(true);

    try {
      // Call API to add comment
      await addComment(id, text);

      // Clear comment input right away for better UX
      setCommentText("");

      // Open comments section if closed
      if (!isCommentsOpen) {
        openComments();
      }

      // Show toast notification
      toast({
        title: "Comment added",
        status: "success",
        duration: 2000,
        isClosable: true,
      });

      // Fetch updated resource data to get complete comment information
      const data = await getResourceById(id);

      // Map comments from API response with all required fields
      const mappedComments = (data.comments || []).map(comment => ({
        id: comment.id,
        text: comment.body,
        date: comment.created_at,
        user: comment.user,
        likes: comment.upvote_count || 0,
        isUpvoted: comment.is_upvoted || false
      }));

      // Update comments state with fresh data
      setComments(mappedComments);
    } catch (error) {
      console.error('Error adding comment:', error);
      toast({
        title: "Failed to add comment",
        description: error.message || "Please try again later",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsSubmittingComment(false);
      addCommentLockRef.current = false;
    }
  };

  const focusCommentInput = () => {
    toggleComments();
    setTimeout(() => {
      if (commentInputRef.current) {
        commentInputRef.current.focus();
      }
    }, 100);
  };

  // Utility functions
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);

    if (diffDay > 30) {
      return formatDate(dateString);
    } else if (diffDay > 0) {
      return `${diffDay}d ago`;
    } else if (diffHour > 0) {
      return `${diffHour}h ago`;
    } else if (diffMin > 0) {
      return `${diffMin}m ago`;
    } else {
      return 'Just now';
    }
  };

  if (!isLoading && !resource) {
    return (
      <Box bg={bgColor} minH="100vh" display="flex" alignItems="center" justifyContent="center" p={4}>
        <Text fontSize="lg">Resource not found.</Text>
      </Box>
    );
  }

  return (
    <Box bg={bgColor} minH="100vh">

      <Box maxW="container.xl" mx="auto" px={{ base: 4, md: 6 }} py={6}>
        {/* Simple Top Navigation */}
        <Flex
          w="full"
          align="center"
          justify="space-between"
          mb={4}
          p={3}
          bg={cardBg}
          borderRadius="md"
          boxShadow="sm"
          position="sticky"
          top="2"
          zIndex="sticky"
        >
          <Button
            leftIcon={<FiArrowLeft />}
            as={Link}
            to="/resources"
            variant="ghost"
            size="md"
          >
            Back to Resources
          </Button>
        </Flex>

        {/* Main content area with 2-column layout */}
        <Grid templateColumns={{ base: "1fr", lg: "2fr 1fr" }} gap={{ base: 4, md: 6 }}>
          {/* Main Content Column */}
          <GridItem>
            <Card overflow="hidden" bg={cardBg} boxShadow="sm" mb={6}>
              {isLoading ? (
                <CardBody>
                  <SkeletonText mt="4" noOfLines={1} spacing="4" skeletonHeight="10" mb={6} />
                  <SkeletonText mt="4" noOfLines={4} spacing="4" mb={6} />
                  <Skeleton height="300px" mb={6} />
                  <SkeletonText mt="4" noOfLines={8} spacing="4" />
                </CardBody>
              ) : (
                <>
                  {/* Post Header */}
                  <CardHeader pb={3} px={{ base: 3, md: 6 }}>
                    <Flex justify="space-between" align="center" mb={{ base: 3, md: 4 }}>
                      <HStack spacing={{ base: 2, md: 3 }}>
                        <Avatar src={resource.author.avatar} name={resource.author.name} size={{ base: "sm", md: "md" }} />
                        <Box>
                          <HStack spacing={2}>
                            {/* if user is resource author, show name as You */}
                            <Text fontWeight="medium" fontSize={{ base: "sm", md: "md" }}>{resource.author.id === currentUser?.id ? "You" : resource.author.name}</Text>
                            {resource.author.verified && <Icon as={FiCheck} color="blue.500" boxSize={{ base: 3, md: 3.5 }} />}
                          </HStack>
                          <Text fontSize={{ base: "xs", md: "sm" }} color={mutedText}>
                            {formatTimeAgo(resource.dateAdded)}
                          </Text>
                        </Box>
                      </HStack>
                    </Flex>
                  </CardHeader>

                  {/* Post Content */}
                  <CardBody pt={2} px={{ base: 3, md: 6 }}>
                    <Heading size={{ base: "sm", md: "md" }} mb={{ base: 3, md: 4 }}>{resource.title}</Heading>
                    <Box mb={{ base: 3, md: 4 }}>
                      <Text fontSize={{ base: "md", md: "lg" }} lineHeight="1.6" whiteSpace="pre-wrap">
                        {resource.content}
                      </Text>
                    </Box>
                  </CardBody>
                </>
              )}
            </Card>



            {/* Attachments */}
            <Card overflow="hidden" bg={cardBg} boxShadow="sm" mb={6}>
              <Tabs variant="enclosed" isLazy colorScheme="blue">
                <TabList overflowX="auto" overflowY="hidden" whiteSpace="nowrap" px={{ base: 2, md: 4 }} sx={{ '&::-webkit-scrollbar': { display: 'none' } }}>
                  {(resource?.images?.length || resource?.videos?.length) > 0 && <Tab fontSize={{ base: 'sm', md: 'md' }} px={{ base: 2, md: 4 }}>Media</Tab>}
                  {resource?.documents?.length > 0 && <Tab fontSize={{ base: 'sm', md: 'md' }} px={{ base: 2, md: 4 }}>Documents</Tab>}
                  {pollData.length > 0 && <Tab fontSize={{ base: 'sm', md: 'md' }} px={{ base: 2, md: 4 }}>Polls</Tab>}
                </TabList>

                <TabPanels>
                  {/* MEDIA ---------------------------------------------------- */}
                  {(resource?.images?.length || resource?.videos?.length) > 0 && (
                    <TabPanel px={4} py={4}>
                      <VStack spacing={6} align="stretch">
                        {/* Images Section */}
                        {resource?.images?.length > 0 && (
                          <Box>
                            {resource.images.length > 1 && (
                              <Flex justify="space-between" align="center" mb={3}>
                                <HStack>
                                  <Icon as={FiImage} color={accentColor} boxSize={5} />
                                  <Text fontWeight="semibold" fontSize="md">Images ({resource.images.length})</Text>
                                </HStack>
                              </Flex>
                            )}
                            <Card bg={cardBg} borderColor={borderColor} borderWidth="1px" boxShadow="sm" overflow="hidden">
                              <CardBody p={0}>
                                {resource.images.length > 1 ? (
                                  <Box position="relative" width="full">
                                    <Slider
                                      dots={true}
                                      infinite={false}
                                      speed={500}
                                      slidesToShow={1}
                                      slidesToScroll={1}
                                      adaptiveHeight={false}
                                      arrows={true}
                                      prevArrow={<CustomPrevArrow />}
                                      nextArrow={<CustomNextArrow />}
                                    >
                                      {resource.images.map((img, idx) => (
                                        <Box key={img.id || img.url}>
                                          <Box
                                            height={{ base: "250px", sm: "300px", md: "350px", lg: "400px" }}
                                            width="100%"
                                            bg="gray.100"
                                            display="flex"
                                            alignItems="center"
                                            justifyContent="center"
                                            overflow="hidden"
                                            position="relative"
                                            cursor="pointer"
                                            onClick={() => {
                                              setSelectedImage(resolveUrl(img.url));
                                              onOpen();
                                            }}
                                            _hover={{ '& img': { transform: 'scale(1.05)' } }}
                                          >
                                            <Image
                                              src={resolveUrl(img.url)}
                                              alt={img.original_name || `Image ${idx + 1}`}
                                              maxH={{ base: "250px", sm: "300px", md: "350px", lg: "400px" }}
                                              maxW="100%"
                                              objectFit="contain"
                                              transition="transform 0.3s ease"
                                              onError={(e) => {
                                                console.error(`Failed to load image: ${img.url}`, e);
                                                e.target.src = 'https://via.placeholder.com/400x300?text=Image+Error';
                                              }}
                                            />
                                          </Box>
                                          {img.original_name && (
                                            <Box p={3} bg={useColorModeValue("gray.50", "gray.800")}>
                                              <Text fontSize="sm" fontWeight="medium" isTruncated>{img.original_name}</Text>
                                            </Box>
                                          )}
                                        </Box>
                                      ))}
                                    </Slider>
                                  </Box>
                                ) : (
                                  <Box>
                                    <Box
                                      height={{ base: "250px", sm: "300px", md: "350px", lg: "400px" }}
                                      width="100%"
                                      bg="gray.100"
                                      display="flex"
                                      alignItems="center"
                                      justifyContent="center"
                                      overflow="hidden"
                                      position="relative"
                                      cursor="pointer"
                                      onClick={() => {
                                        setSelectedImage(resolveUrl(resource.images[0].url));
                                        onOpen();
                                      }}
                                      _hover={{ '& img': { transform: 'scale(1.05)' } }}
                                    >
                                      <Image
                                        src={resolveUrl(resource.images[0].url)}
                                        alt={resource.images[0].original_name || resource.title}
                                        maxH={{ base: "250px", sm: "300px", md: "350px", lg: "400px" }}
                                        maxW="100%"
                                        objectFit="contain"
                                        transition="transform 0.3s ease"
                                        onError={(e) => {
                                          console.error(`Failed to load image: ${resource.images[0].url}`, e);
                                          e.target.src = 'https://via.placeholder.com/400x300?text=Image+Error';
                                        }}
                                      />
                                    </Box>
                                    {resource.images[0].original_name && (
                                      <Box p={3} bg={useColorModeValue("gray.50", "gray.800")}>
                                        <Text fontSize="sm" fontWeight="medium" isTruncated>{resource.images[0].original_name}</Text>
                                      </Box>
                                    )}
                                  </Box>
                                )}
                              </CardBody>
                            </Card>
                          </Box>
                        )}

                        {/* Videos Section */}
                        {resource?.videos?.length > 0 && (
                          <Box>
                            <Flex justify="space-between" align="center" mb={3}>
                              <HStack>
                                <Icon as={FiVideo} color={accentColor} boxSize={5} />
                                <Text fontWeight="semibold" fontSize="md">Videos ({resource.videos.length})</Text>
                              </HStack>
                            </Flex>
                            <VStack spacing={4} align="stretch">
                              {resource.videos.map((vid, idx) => (
                                <Card key={vid.id || vid.url} bg={cardBg} borderColor={borderColor} borderWidth="1px" boxShadow="sm" overflow="hidden">
                                  <CardBody p={0}>
                                    <Box
                                      height={{ base: "250px", sm: "300px", md: "350px", lg: "400px" }}
                                      width="100%"
                                      bg="black"
                                      display="flex"
                                      alignItems="center"
                                      justifyContent="center"
                                      position="relative"
                                    >
                                      <ReactPlayer
                                        url={resolveUrl(vid.url)}
                                        width="100%"
                                        height="100%"
                                        controls
                                        playing={false}
                                        style={{ maxWidth: '100%' }}
                                        onError={(e) => console.error(`Failed to load video: ${vid.url}`, e)}
                                      />
                                    </Box>
                                    {vid.original_name && (
                                      <Box p={3} bg={useColorModeValue("gray.50", "gray.800")}>
                                        <Text fontSize="sm" fontWeight="medium" isTruncated>{vid.original_name}</Text>
                                      </Box>
                                    )}
                                  </CardBody>
                                </Card>
                              ))}
                            </VStack>
                          </Box>
                        )}
                      </VStack>
                    </TabPanel>
                  )}

                  {/* DOCUMENTS ------------------------------------------------ */}
                  {resource?.documents?.length > 0 && (
                    <TabPanel px={{ base: 2, md: 4 }} py={4}>
                      <VStack spacing={{ base: 3, md: 4 }} align="stretch">
                        {resource.documents.map((doc, idx) => (
                          <Card
                            key={doc.id || idx}
                            bg={cardBg}
                            borderColor={borderColor}
                            borderWidth="1px"
                            boxShadow="sm"
                            overflow="hidden"
                            _hover={{ borderColor: accentColor, boxShadow: "md" }}
                            transition="all 0.2s"
                          >
                            <CardBody p={{ base: 3, md: 4 }}>
                              <VStack align="stretch" spacing={{ base: 3, md: 4 }}>
                                {/* Document Header */}
                                <HStack spacing={{ base: 2, md: 3 }}>
                                  <Icon
                                    as={FiFile}
                                    boxSize={{ base: 6, md: 7 }}
                                    color={accentColor}
                                    flexShrink={0}
                                  />
                                  <Box flex="1" minW="0">
                                    <Text
                                      fontWeight="semibold"
                                      fontSize={{ base: "sm", md: "md" }}
                                      noOfLines={2}
                                      wordBreak="break-word"
                                    >
                                      {doc.original_name || `Document-${idx + 1}`}
                                    </Text>
                                    {quizMap[doc.id]?.url && (
                                      <HStack spacing={1} mt={1}>
                                        <Icon as={FiCheck} color="green.500" boxSize={3} />
                                        <Text fontSize="xs" color="green.500">Quiz generated</Text>
                                      </HStack>
                                    )}
                                  </Box>
                                </HStack>
                              </VStack>
                              {/* Action Buttons - Stack vertically on mobile, horizontally on desktop */}
                              <Flex
                                direction={{ base: "column", sm: "row" }}
                                gap={2}
                                w="full"
                              >
                                <Button
                                  leftIcon={<FiExternalLink />}
                                  size={{ base: "sm", md: "md" }}
                                  colorScheme="blue"
                                  variant="outline"
                                  flex={{ base: "1", sm: "unset" }}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    window.open(resolveUrl(doc.url), '_blank');
                                  }}
                                  fontSize={{ base: "xs", md: "sm" }}
                                >
                                  Preview
                                </Button>
                                {/* {((doc.original_name || '').toLowerCase().endsWith('.pdf') || (doc.url || '').toLowerCase().endsWith('.pdf')) && (
                                  <Menu strategy="fixed">
                                    <MenuButton
                                      as={IconButton}
                                      icon={<FiMoreVertical />}
                                      size="sm"
                                      variant="ghost"
                                      onClick={(e) => e.stopPropagation()}
                                      aria-label="AI options"
                                    />
                                    <MenuList zIndex={9999} bg={cardBg}>
                                      {!quizMap[doc.id]?.url ? (
                                        <MenuItem
                                          icon={<FiList />}
                                          isDisabled={quizMap[doc.id]?.loading}
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleGenerateQuiz(doc.id, doc.original_name || `Document-${idx + 1}`);
                                          }}
                                        >
                                          {quizMap[doc.id]?.loading ? (
                                            <Text>Generating quiz...</Text>
                                          ) : quizMap[doc.id]?.error ? (
                                            <VStack align="start" spacing={1}>
                                              <Text color="red.500">Generation failed</Text>
                                              <Text fontSize="xs" color="gray.500">{quizMap[doc.id].error}</Text>
                                              <Button size="xs" colorScheme="red" variant="link" onClick={(e) => {
                                                e.stopPropagation();
                                                handleGenerateQuiz(doc.id, doc.original_name || `Document-${idx + 1}`);
                                              }}>
                                                Retry
                                              </Button>
                                            </VStack>
                                          ) : (
                                            'Generate quiz'
                                          )}
                                        </MenuItem>
                                      ) : (
                                        <MenuItem
                                          as="a"
                                          icon={<FiDownload />}
                                          href={quizMap[doc.id].url}
                                          download={`Quiz-${doc.original_name || 'quiz'}.pdf`}
                                        >
                                          Download quiz
                                        </MenuItem>
                                      )}

                                      {!summaryMap[doc.id]?.url ? (
                                        <MenuItem
                                          icon={<FiFileText />}
                                          isDisabled={summaryMap[doc.id]?.loading}
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleGenerateSummary(doc.id, doc.original_name || `Document-${idx + 1}`);
                                          }}
                                        >
                                          {summaryMap[doc.id]?.loading ? (
                                            <Text>Generating summary...</Text>
                                          ) : summaryMap[doc.id]?.error ? (
                                            <VStack align="start" spacing={1}>
                                              <Text color="red.500">Generation failed</Text>
                                              <Text fontSize="xs" color="gray.500">{summaryMap[doc.id].error}</Text>
                                              <Button size="xs" colorScheme="red" variant="link" onClick={(e) => {
                                                e.stopPropagation();
                                                handleGenerateSummary(doc.id, doc.original_name || `Document-${idx + 1}`);
                                              }}>
                                                Retry
                                              </Button>
                                            </VStack>
                                          ) : (
                                            'Generate summary'
                                          )}
                                        </MenuItem>
                                      ) : (
                                        <MenuItem
                                          as="a"
                                          icon={<FiDownload />}
                                          href={summaryMap[doc.id].url}
                                          download={`Summary-${doc.original_name || 'summary'}.pdf`}
                                        >
                                          Download summary
                                        </MenuItem>
                                      )}
                                    </MenuList>
                                  </Menu>
                                )} */}
                              </Flex>
                            </CardBody>
                          </Card>
                        ))}
                      </VStack>
                    </TabPanel>
                  )}

                  {/* POLLS ---------------------------------------------------- */}
                  {pollData.length > 0 && (
                    <TabPanel px={0}>
                      <Box mb={4}>
                        {pollData.slice(0, 1).map((poll, index) => {
                          const pollId = poll.id || `poll-${index}`;
                          const totalVotes = poll.options.reduce((sum, opt) => sum + (opt.votes || 0), 0);
                          const hasVoted = votedPolls[pollId];
                          const selectedOption = userVotes[pollId];

                          const handleVote = async (optionId) => {
                            try {
                              const { message, poll: updated } = await votePollOption(optionId);
                              const updatedPoll = {
                                id: updated.id,
                                question: updated.question,
                                options: (updated.options || []).map((opt) => ({
                                  id: opt.id,
                                  text: opt.option_text ?? opt.text ?? '',
                                  votes: opt.vote_count ?? opt.votes ?? 0,
                                })),
                              };
                              setPollData(prev => prev.map(p => p.id === updatedPoll.id ? updatedPoll : p));

                              if (message.startsWith('Vote removed')) {
                                setUserVotes(prev => ({ ...prev, [poll.id]: null }));
                                setVotedPolls(prev => ({ ...prev, [poll.id]: false }));
                              } else {
                                setUserVotes(prev => ({ ...prev, [poll.id]: optionId }));
                                setVotedPolls(prev => ({ ...prev, [poll.id]: true }));
                              }
                              toast({ title: message, status: 'success', duration: 2000, isClosable: true });
                            } catch (err) {
                              console.error('Vote error', err);
                              toast({ title: 'Failed to record vote', description: err.message || 'Try again later', status: 'error', duration: 3000, isClosable: true });
                            }
                          };


                          return (
                            <Box key={pollId} bg={useColorModeValue("gray.50", "gray.700")} p={4} borderRadius="xl">
                              <Text fontWeight="semibold" mb={3}>{poll.question}</Text>
                              <VStack spacing={2} align="stretch">
                                {poll.options.map((option, optIdx) => {
                                  const optionId = option.id || `option-${optIdx}`;
                                  const isSelected = selectedOption === optionId;
                                  const optionVotes = option.votes || 0;
                                  const percentage = totalVotes > 0 ? Math.round((optionVotes / totalVotes) * 100) : 0;
                                  return (
                                    <Box key={optionId} position="relative" p={3} borderRadius="lg" cursor="pointer" onClick={() => handleVote(optionId)} bg={useColorModeValue("white", "gray.800")} border="2px solid" borderColor={isSelected ? "blue.400" : "transparent"} _hover={{ borderColor: isSelected ? "blue.500" : useColorModeValue("gray.200", "gray.600") }}>
                                      <Box position="absolute" left={0} top={0} bottom={0} width={`${percentage}%`} bg={isSelected ? "blue.100" : useColorModeValue("gray.100", "gray.700")} opacity={0.3} borderRadius="lg" />
                                      <Flex justify="space-between" align="center" position="relative">
                                        <Text>{option.text}</Text>
                                        <Text fontWeight="bold" color={isSelected ? "blue.500" : mutedText}>{percentage}%</Text>
                                      </Flex>
                                    </Box>
                                  );
                                })}
                              </VStack>
                              <Text fontSize="sm" color={mutedText} mt={2} textAlign="center">{totalVotes} {totalVotes === 1 ? "vote" : "votes"}</Text>
                            </Box>
                          );
                        })}
                      </Box>
                    </TabPanel>
                  )}
                </TabPanels>
              </Tabs>
            </Card>






            {/* Comments Section */}
            <Card overflow="hidden" bg={cardBg} boxShadow="sm" mb={6}>
              <CardBody>
                <Flex justify="space-between" align="center" mb={4}>
                  <Heading size="md">Discussion ({comments.length})</Heading>
                  <Button
                    rightIcon={isCommentsOpen ? <FiChevronUp /> : <FiChevronDown />}
                    variant="ghost"
                    size="sm"
                    onClick={toggleComments}
                  >
                    {isCommentsOpen ? "Hide" : "Show"}
                  </Button>
                </Flex>

                {isCommentsOpen && (
                  <VStack align="stretch" spacing={{ base: 4, md: 6 }}>
                    <Box p={{ base: 3, md: 4 }} borderWidth="1px" borderRadius="lg" bg={cardBg}>
                      <HStack align="start" spacing={{ base: 2, md: 3 }}>
                        <Avatar
                          size={{ base: "xs", md: "sm" }}
                          name={currentUser ? `${currentUser.first_name} ${currentUser.last_name}` : 'User'}
                          src={currentUser?.avatar_url || (currentUser?.avatar ? resolveUrl(currentUser.avatar) : undefined)}
                        />
                        <Textarea
                          ref={commentInputRef}
                          value={commentText}
                          onChange={(e) => setCommentText(e.target.value)}
                          placeholder="Add to the discussion..."
                          variant="unstyled"
                          rows={2}
                          resize="none"
                          fontSize={{ base: "sm", md: "md" }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault();
                              if (!isSubmittingComment) handleAddComment();
                            }
                          }}
                        />
                        <Button
                          rightIcon={<FiSend />}
                          aria-label={editingCommentId ? "Save edited comment" : "Send comment"}
                          onClick={handleAddComment}
                          colorScheme="blue"
                          size={{ base: "xs", md: "sm" }}
                          isLoading={isSubmittingComment}
                          isDisabled={!commentText?.trim() || isSubmittingComment}
                        >
                          {/* Hide text on mobile */}
                          <Text display={{ base: "none", sm: "block" }}>Send</Text>
                        </Button>
                      </HStack>
                    </Box>

                    {comments.map((comment) => (
                      <MotionBox
                        key={comment.id}
                        p={{ base: 3, md: 4 }}
                        borderWidth="1px"
                        borderRadius="lg"
                        bg={cardBg}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <HStack align="start" spacing={{ base: 2, md: 3 }}>
                          <Avatar
                            size={{ base: "xs", md: "sm" }}
                            name={comment.user ? `${comment.user.first_name} ${comment.user.last_name}` : 'Anonymous'}
                            src={comment.user?.avatar_url || (comment.user?.avatar ? resolveUrl(comment.user.avatar) : undefined)}
                          />
                          <Box flex="1">
                            <HStack justify="space-between" flexWrap={{ base: "wrap", md: "nowrap" }}>
                              <Box>
                                <Text fontWeight="600" fontSize={{ base: "sm", md: "md" }}>{comment.user.id === currentUser?.id ? "You" : `${comment.user.first_name} ${comment.user.last_name}`}</Text>
                                <Text fontSize={{ base: "xs", md: "sm" }} color={mutedText}>
                                  {formatTimeAgo(comment.date)}
                                </Text>
                              </Box>
                              <HStack spacing={{ base: 1, md: 2 }}>
                                <Button
                                  variant="ghost"
                                  size={{ base: "xs", md: "sm" }}
                                  leftIcon={<Icon as={FiTrendingUp} color={comment.isUpvoted ? "green.500" : undefined} boxSize={{ base: 3, md: 4 }} />}
                                  color={comment.isUpvoted ? "green.500" : undefined}
                                  fontWeight={comment.isUpvoted ? "bold" : "normal"}
                                  onClick={() => handleCommentUpvote(comment.id)}
                                  fontSize={{ base: "xs", md: "sm" }}
                                >
                                  {comment.likes || 0}
                                </Button>
                                {comment.user.id === currentUser?.id && (
                                  <HStack spacing={{ base: 0, md: 1 }}>
                                    <IconButton aria-label="Edit" variant="ghost" size={{ base: "xs", md: "sm" }} icon={<FiEdit />} onClick={() => startEditingComment(comment)} />
                                    <IconButton aria-label="Delete" variant="ghost" size={{ base: "xs", md: "sm" }} icon={<FiTrash />} onClick={() => openDeleteConfirm(comment.id)} />
                                  </HStack>
                                )}
                              </HStack>
                            </HStack>
                            {editingCommentId === comment.id ? (
                              <Box mt={2}>
                                <Textarea
                                  value={editingText}
                                  onChange={(e) => setEditingText(e.target.value)}
                                  rows={2}
                                  resize="vertical"
                                />
                                <HStack mt={2} spacing={2}>
                                  <Button size="sm" colorScheme="blue" onClick={submitEditedComment}>Save</Button>
                                  <Button size="sm" variant="ghost" onClick={cancelEditing}>Cancel</Button>
                                </HStack>
                              </Box>
                            ) : (
                              <Text mt={2} fontSize={{ base: "sm", md: "md" }}>{comment.text}</Text>
                            )}
                          </Box>
                        </HStack>
                      </MotionBox>
                    ))}
                  </VStack>
                )}
              </CardBody>
            </Card>
          </GridItem>


          {/* Right Sidebar - Study Tools */}
          <GridItem display={{ base: "none", lg: "block" }}>
            <Box position="sticky" top="24">
              <QuickInfoCard
                courseName={resource?.courseName}
                courseCode={resource?.courseCode}
                lastUpdated={resource?.lastUpdated}
                likes={likes}
                commentsCount={comments?.length}
              />
            </Box>
          </GridItem>
        </Grid>

        {/* Floating Action Bar */}
        <Box
          position="fixed"
          bottom={{ base: 4, md: 8 }}
          right={{ base: 4, md: 8 }}
          zIndex="tooltip"
        >
          <VStack spacing={{ base: 2, md: 3 }}>
            <IconButton
              icon={<FiTrendingUp />}
              variant={isLiked ? 'solid' : 'outline'}
              colorScheme={isLiked ? 'blue' : 'gray'}
              size={{ base: "md", md: "lg" }}
              aria-label="Upvote"
              onClick={handleLike}
            />
            <IconButton
              icon={<FiBookmark />}
              variant={isSaved ? 'solid' : 'outline'}
              colorScheme={isSaved ? 'blue' : 'gray'}
              size={{ base: "md", md: "lg" }}
              aria-label="Save"
              onClick={handleBookmark}
            />
            <IconButton
              icon={<FiShare2 />}
              variant="outline"
              colorScheme="gray"
              size={{ base: "md", md: "lg" }}
              aria-label="Share"
              onClick={handleShare}
            />
          </VStack>
        </Box>

        {/* Delete Confirmation Dialog */}
        <AlertDialog
          isOpen={isDeleteOpen}
          leastDestructiveRef={cancelDeleteRef}
          onClose={isDeletingComment ? () => { } : closeDeleteDialog}
          closeOnOverlayClick={!isDeletingComment}
          closeOnEsc={!isDeletingComment}
        >
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader fontSize="lg" fontWeight="bold">
                Delete Comment
              </AlertDialogHeader>
              <AlertDialogBody>
                Are you sure you want to delete this comment? This action cannot be undone.
              </AlertDialogBody>
              <AlertDialogFooter>
                <Button ref={cancelDeleteRef} onClick={closeDeleteDialog} isDisabled={isDeletingComment}>
                  Cancel
                </Button>
                <Button colorScheme="red" onClick={confirmDeleteComment} ml={3} isLoading={isDeletingComment} isDisabled={isDeletingComment}>
                  Delete
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>

        <Modal isOpen={isOpen} onClose={onClose} size="full" isCentered>
          <ModalOverlay />
          <ModalContent bg="transparent" boxShadow="none" maxW="90vw" maxH="90vh" m="auto">
            <ModalCloseButton color="white" />
            <ModalBody p={0} display="flex" alignItems="center" justifyContent="center">
              <Image src={selectedImage} alt="Preview" borderRadius="md" maxW="90vw" maxH="90vh" objectFit="contain" />
            </ModalBody>
          </ModalContent>
        </Modal>
      </Box>
    </Box>
  );
}

export default ResourceContentPage;