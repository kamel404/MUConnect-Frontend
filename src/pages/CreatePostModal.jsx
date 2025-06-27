import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Flex,
  Button,
  Text,
  Avatar,
  VStack,
  HStack,
  useColorModeValue,
  FormControl,
  FormLabel,
  Textarea,
  ModalFooter,
  useToast,
  Input,
  Icon,
  Box,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Spinner,
} from "@chakra-ui/react";
import { FiSend, FiBarChart2, FiPlus, FiTrash2, FiChevronDown } from "react-icons/fi";
import { useState, useRef, useEffect, useMemo } from "react";
import { updateResource as updateResourceService } from "../services/resourceService";
import { fetchCourses } from "../services/courseService";

// Import component files
import AttachmentControls from "../components/post/AttachmentControls";

import AttachmentPreview from "../components/post/AttachmentPreview";
import { useAuth } from "../context/AuthContext";
import { fileToBase64 } from "../components/post/FileUploadHelpers";

const CreatePostModal = ({ isOpen, onClose, addNewPost, updateResource, editResource, user }) => {
  const { user: authUser } = useAuth();
  const currentUser = user || authUser;
  // Theme variables
  const accentColor = useColorModeValue("blue.500", "blue.200");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const hoverBg = useColorModeValue("gray.50", "gray.700");
  const textColor = useColorModeValue("blue.500", "blue.200");
  const toast = useToast();

  // Form state
  const [postTitle, setPostTitle] = useState("");
  const [postContent, setPostContent] = useState("");
  const [postType, setPostType] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);
  const [course, setCourse] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [location, setLocation] = useState("");
  const [studyDate, setStudyDate] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Courses state
  const [courses, setCourses] = useState([]);
  const [coursesLoading, setCoursesLoading] = useState(false);
  const [currentCoursePage, setCurrentCoursePage] = useState(1);
  const [totalCoursePages, setTotalCoursePages] = useState(1);
  
  // Poll state
  const [isPollModalOpen, setIsPollModalOpen] = useState(false);
  const [pollQuestion, setPollQuestion] = useState("");
  const [pollOptions, setPollOptions] = useState(["", ""]);
  const [hasPoll, setHasPoll] = useState(false);

  // Attachment state
  const [attachments, setAttachments] = useState({
    images: [],
    videos: [],
    documents: [],
    polls: [],
  });

  // Keep track of raw file objects for API upload
  const [attachmentFiles, setAttachmentFiles] = useState([]);
  
  // Keep track of attachments to be removed (for edit mode)
  const [attachmentsToRemove, setAttachmentsToRemove] = useState([]);


  // Check if we have mixed attachment types
  const hasMixedAttachments = useMemo(() => {
    const types = [
      attachments.images.length > 0,
      attachments.videos.length > 0,
      attachments.documents.length > 0,
      attachments.polls.length > 0,
    ];
    return types.filter(Boolean).length > 1;
  }, [attachments]);

  // Refs for file inputs
  const fileInputRef = useRef(null);
  
  // Effect for setting edit mode and loading existing data
  useEffect(() => {
    if (editResource && isOpen) {
      // We're in edit mode
      setIsEditMode(true);
      setPostTitle(editResource.title || "");
      setPostContent(editResource.description || "");
      
      // If there are attachments, load them
      if (editResource.attachments && Array.isArray(editResource.attachments)) {
        const newAttachments = {
          images: [],
          videos: [],
          documents: [],
          polls: []
        };
        
        editResource.attachments.forEach(attachment => {
          const fileUrl = attachment.url 
            ? `http://127.0.0.1:8000${attachment.url}`
            : `http://127.0.0.1:8000/api/storage/${attachment.file_path}`;
            
          const item = {
            id: attachment.id,
            url: fileUrl,
            name: attachment.original_name || 'File',
            preview: fileUrl
          };
          
          switch(attachment.file_type) {
            case 'image':
              newAttachments.images.push(item);
              break;
            case 'video':
              newAttachments.videos.push(item);
              break;
            case 'document':
              newAttachments.documents.push(item);
              break;
            default:
              break;
          }
        });
        
        setAttachments(newAttachments);
      }
    } else {
      // Reset the form when not in edit mode
      setIsEditMode(false);
      setPostTitle("");
      setPostContent("");
      setPostType("");
      setCourse("");
      setEventDate("");
      setLocation("");
      setStudyDate("");
      setAttachments({
        images: [],
        videos: [],
        documents: [],
        polls: []
      });
      setAttachmentFiles([]);
    }
  }, [editResource, isOpen]);
  const videoInputRef = useRef(null);
  const documentInputRef = useRef(null);

  // ------------------- Course fetching -------------------
  useEffect(() => {
    const fetchCourseList = async (page = 1) => {
      setCoursesLoading(true);
      try {
        const major_id = localStorage.getItem('major_id');
        const faculty_id = localStorage.getItem('faculty_id');
        const params = {
          ...(major_id ? { major_id } : faculty_id ? { faculty_id } : {}),
          page,
          per_page: 10,
        };
        const res = await fetchCourses(params);
        setCourses(res.data || []);
        setCurrentCoursePage(res.current_page || 1);
        setTotalCoursePages(res.last_page || 1);
      } catch (error) {
        toast({
          title: "Failed to fetch courses",
          description: error.response?.data?.message || error.message || "Unknown error",
          status: "error",
          duration: 4000,
          isClosable: true,
        });
      } finally {
        setCoursesLoading(false);
      }
    };

    if (isOpen) {
      fetchCourseList(1);
    }
  }, [isOpen]);

  const onCoursePageChange = async (page) => {
    if (page < 1 || page > totalCoursePages) return;
    setCoursesLoading(true);
    try {
      const major_id = localStorage.getItem('major_id');
      const faculty_id = localStorage.getItem('faculty_id');
      const params = {
        ...(major_id ? { major_id } : faculty_id ? { faculty_id } : {}),
        page,
        per_page: 10,
      };
      const res = await fetchCourses(params);
      setCourses(res.data || []);
      setCurrentCoursePage(res.current_page || page);
      setTotalCoursePages(res.last_page || 1);
    } catch (error) {
      toast({
        title: "Failed to fetch courses",
        description: error.response?.data?.message || error.message || "Unknown error",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setCoursesLoading(false);
    }
  };
  // ------------------- End course fetching -------------------

  // Reset form state
  const resetForm = () => {
    setPostTitle("");
    setPostContent("");
    setPostType("");
    setCourse("");
    setEventDate("");
    setLocation("");
    setStudyDate("");
    setPollQuestion("");
    setPollOptions(["", ""]);
    setHasPoll(false);
    setAttachments({
      images: [],
      videos: [],
      documents: [],
      polls: [],
    });
    setAttachmentFiles([]);
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!postTitle.trim()) {
      toast({
        title: "Title required",
        description: "Please add a title for your post",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Create post data object
      const postData = {};
      postData.content = postContent;
      postData.title = postTitle;
      postData.type = postType || "Default";

      // Set the resource type based on attachments
      if (!postType && hasMixedAttachments) {
        postData.type = "Mixed Content";
      } else if (attachments.images.length > 0 && !postType && !hasMixedAttachments) {
        postData.type = "Media";
      } else if (attachments.videos.length > 0 && !postType && !hasMixedAttachments) {
        postData.type = "Media";
      } else if (attachments.documents.length > 0 && !postType && !hasMixedAttachments) {
        postData.type = "Course Material";
      } else if (attachments.polls.length > 0 && !postType && !hasMixedAttachments) {
        postData.type = "Poll";
      }
      
      // Check if we're in edit mode
      if (isEditMode && editResource) {
        try {
          console.log('Updating resource with ID:', editResource.id);
          
          // Create FormData for the update request
          const formData = new FormData();
          
          // Only add fields that are actually needed
          if (postTitle.trim()) {
            formData.append('title', postTitle.trim());
          }
          
          if (postContent.trim()) {
            formData.append('description', postContent.trim());
          }
          
          // Add new attachment files
          if (attachmentFiles && attachmentFiles.length > 0) {
            console.log(`Adding ${attachmentFiles.length} new attachment(s)`);
            console.log('Attachment files to add:', attachmentFiles);
            attachmentFiles.forEach(file => {
              formData.append('attachments[]', file);
              console.log('Added file to form data:', file.name);
            });
          } else {
            console.log('No new attachment files to add');
          }
          
          // Add attachments to remove
          if (attachmentsToRemove && attachmentsToRemove.length > 0) {
            console.log(`Removing ${attachmentsToRemove.length} attachment(s):`, attachmentsToRemove);
            
            // Add each attachment ID to remove as a separate field
            attachmentsToRemove.forEach(id => {
              formData.append('remove_attachments[]', id);
            });
          }
          
          console.log('Resource ID for update:', editResource.id);  // Debug log
          
          if (!editResource.id) {
            throw new Error('Cannot update resource: Missing resource ID');
          }
          
          if (typeof updateResource === 'function') {
            // Use the prop function if provided (legacy support)
            // This is the 'updateResource' prop from Resources.jsx
            const resourceDataForUpdate = {
              id: editResource.id,
              title: postTitle.trim(),
              description: postContent.trim(),
              newAttachments: attachmentFiles,       // Ensure these are the File objects
              removeAttachmentIds: attachmentsToRemove // Ensure these are the IDs
            };
            console.log('[CreatePostModal.jsx] Calling props.updateResource with:', JSON.stringify(resourceDataForUpdate, (key, value) => (value instanceof File ? value.name : value), 2));
            await updateResource(resourceDataForUpdate);
          } else {
            // Otherwise use our service function with attachment support
            console.log(`Updating resource ${editResource.id} with:`, {
              title: postTitle.trim(),
              description: postContent.trim(),
              newAttachments: attachmentFiles,
              removeAttachmentIds: attachmentsToRemove
            });
            console.log(`Attachment files count: ${attachmentFiles.length}`);
            console.log(`Attachments to remove count: ${attachmentsToRemove.length}`);
            
            // Call the service function with the expected parameter structure
            await updateResourceService(editResource.id, {
              title: postTitle.trim(),
              description: postContent.trim(),
              newAttachments: attachmentFiles,
              removeAttachmentIds: attachmentsToRemove
            });
          }
          
          toast({
            title: "Resource updated",
            description: "Your resource has been successfully updated with attachment changes",
            status: "success",
            duration: 3000,
            isClosable: true,
          });
          
          onClose();
        } catch (error) {
          console.error('Error updating resource with attachments:', error);
          toast({
            title: "Update failed",
            description: error.response?.data?.message || "Failed to update the resource. Please try again.",
            status: "error",
            duration: 4000,
            isClosable: true
          });
        }
      } else {
        // Creating a new resource
        // Validate required fields
        const majorId = localStorage.getItem('major_id') || (user && (user.major_id || user.major?.id));
        const facultyId = localStorage.getItem('faculty_id') || (user && (user.faculty_id || user.faculty?.id));
        if (!majorId || !facultyId) {
          toast({
            title: "Missing profile information",
            description: "Your major or faculty information is missing. Please re-login or complete your profile before posting.",
            status: "error",
            duration: 4000,
            isClosable: true,
          });
          setIsLoading(false);
          return;
        }
        // Create FormData for API submission
        const formData = new FormData();
        formData.append("title", postTitle.trim());
        formData.append("description", postContent.trim());
        formData.append("type", postData.type);

        // Add user context (major & faculty) – they are guaranteed to exist after validation
        formData.append("major_id", majorId);
        formData.append("faculty_id", facultyId);

        // Add selected course
        if (course) {
          formData.append("course_id", course);
        }
        
        // Add type-specific fields
        if (postType === "event") {
          formData.append("event_date", eventDate);
          formData.append("location", location);
        } else if (postType === "study_group") {
          formData.append("study_date", studyDate);
        }

        // Add polls if any
        if (hasPoll) { // If hasPoll is true, a poll has been configured
          formData.append("poll[question]", pollQuestion);
          pollOptions.forEach((option) => { // Use state pollOptions
            if (option.trim()) {
              formData.append("poll[options][]", option.trim());
            }
          });
        }

        // Add files
        attachmentFiles.forEach(file => {
          formData.append("attachments[]", file);
        });
        
        // The 'postData' object here refers to the one defined around line 198,
        // which holds the resolved title, content (description), and type.
        // formData is already prepared using these resolved values.

        // For compatibility with the handleAddNewPost function in Resources.jsx
        // which expects parameters in a different format (e.g., content, type, detailsObject)
        if (typeof addNewPost === 'function') {
          const majorIdProp = localStorage.getItem('major_id');
          const facultyIdProp = localStorage.getItem('faculty_id');
          const detailsObjectForProp = {
            title: postData.title,
            type: postData.type,
            attachments: attachmentFiles,
            course_id: course,
            major_id: majorIdProp,
            faculty_id: facultyIdProp,
          };

          if (hasPoll) {
            detailsObjectForProp.poll = { // Add poll data as a nested object
              question: pollQuestion,
              options: pollOptions.filter(opt => opt.trim() !== "")
            };
          }
          
          // Call the prop: addNewPost(actualContent, actualType, actualDetailsObject)
          await addNewPost(postData.content, detailsObjectForProp.type, detailsObjectForProp);

        } else {
          // If addNewPost is a direct service call expecting FormData
          await addNewPost(formData); // formData already contains poll[question] and poll[options][]
        }
        
        // Reset form
        resetForm();
        onClose();
      }
    } catch (error) {
      console.error("Error with resource:", error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to process resource. Please try again.",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle image upload
  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    try {
      toast({
        title: "Uploading images...",
        status: "info",
        duration: 2000,
        isClosable: true,
      });

      const uploadedImages = [];
      const validFiles = [];

      for (const file of files) {
        // Validate file type
        if (!file.type.startsWith('image/')) {
          toast({
            title: "Invalid file type",
            description: `${file.name} is not an image file.`,
            status: "error",
            duration: 3000,
            isClosable: true,
          });
          continue;
        }

        // Store valid file for actual upload
        validFiles.push(file);

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          toast({
            title: "File too large",
            description: `${file.name} exceeds the 5MB limit.`,
            status: "error",
            duration: 3000,
            isClosable: true,
          });
          continue;
        }

        // Generate a unique ID for the image
        const timestamp = Date.now();
        const randomString = Math.random().toString(36).substring(2, 9);
        const imageId = `img-${timestamp}-${randomString}`;

        const base64 = await fileToBase64(file);
        uploadedImages.push({
          id: imageId,
          name: file.name,
          type: file.type,
          size: file.size,
          url: base64,
        });
      }

      // Store the raw files for API upload
      setAttachmentFiles(prev => [...prev, ...validFiles]);

      setAttachments((prev) => {
        // Check if this will create mixed attachments
        const willHaveMixedAttachments = prev.videos.length > 0 || prev.documents.length > 0;
        if (willHaveMixedAttachments && !postType) {
          setPostType("Mixed Content");
        } else if (!willHaveMixedAttachments && !postType) {
          setPostType("Media");
        }

        return {
          ...prev,
          images: [...prev.images, ...uploadedImages],
        };
      });

      // Success notification
      if (uploadedImages.length > 0) {
        toast({
          title: "Images uploaded successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: "Error uploading images",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // Handle video upload
  const handleVideoUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    try {
      setIsLoading(true);
      const validFiles = files.filter(
        (file) =>
          file.type.startsWith("video/") ||
          file.name.match(/\.(mp4|mov|avi|wmv|flv|webm|mkv)$/i)
      );

      if (validFiles.length !== files.length) {
        toast({
          title: "Invalid file type",
          description: "Only video files are allowed for video upload",
          status: "warning",
          duration: 3000,
          isClosable: true,
        });
      }

      const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB
      const sizeValidFiles = validFiles.filter(
        (file) => file.size <= MAX_FILE_SIZE
      );

      if (sizeValidFiles.length !== validFiles.length) {
        toast({
          title: "File too large",
          description:
            "Some videos exceed the 20MB size limit and will be skipped",
          status: "warning",
          duration: 3000,
          isClosable: true,
        });
      }

      const newVideos = await Promise.all(
        sizeValidFiles.map(async (file) => {
          try {
            const base64 = await fileToBase64(file);
            return {
              id: `video-${Date.now()}-${Math.random()
                .toString(36)
                .substring(2, 9)}`,
              name: file.name,
              url: base64,
              size: file.size,
              type: "video",
              mimeType: file.type || "video/mp4",
            };
          } catch (err) {
            console.error(`Error processing video ${file.name}:`, err);
            return null;
          }
        })
      );

      const successfulVideos = newVideos.filter((video) => video !== null);

      if (successfulVideos.length > 0) {
        setAttachments((prev) => {
          // Only auto-set type if we don't have mixed attachments
          const willHaveMixedAttachments = prev.images.length > 0 || prev.documents.length > 0;
          if (postType !== "Media" && !willHaveMixedAttachments) {
            setPostType("Media");
          } else if (willHaveMixedAttachments && !postType) {
            setPostType("Mixed Content");
          }
          return {
            ...prev,
            videos: [...prev.videos, ...successfulVideos].slice(0, 2), // Limit to 2 videos
          };
        });

        // Store the raw files for API upload
        setAttachmentFiles(prev => [...prev, ...sizeValidFiles]);

        toast({
          title: "Videos uploaded",
          description: `Successfully added ${successfulVideos.length} videos`,
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } else {
        toast({
          title: "Upload failed",
          description:
            "Failed to process any videos. Please try different files.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }

      e.target.value = null;
    } catch (error) {
      console.error("Error processing videos:", error);
      toast({
        title: "Error uploading videos",
        description: "Please try again with different videos",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle document upload
  const handleDocumentUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    try {
      setIsLoading(true);
      const validFiles = files.filter((file) =>
        file.name.match(/\.(pdf|doc|docx|xls|xlsx|ppt|pptx|txt)$/i)
      );

      if (validFiles.length !== files.length) {
        toast({
          title: "Invalid file type",
          description:
            "Only document file types (PDF, Word, Excel, PowerPoint, etc.) are allowed",
          status: "warning",
          duration: 3000,
          isClosable: true,
        });
      }

      const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
      const sizeValidFiles = validFiles.filter(
        (file) => file.size <= MAX_FILE_SIZE
      );

      if (sizeValidFiles.length !== validFiles.length) {
        toast({
          title: "File too large",
          description:
            "Some documents exceed the 10MB size limit and will be skipped",
          status: "warning",
          duration: 3000,
          isClosable: true,
        });
      }

      const newDocuments = await Promise.all(
        sizeValidFiles.map(async (file) => {
          try {
            const base64 = await fileToBase64(file);
            const extension = file.name.split(".").pop().toLowerCase();
            let mimeType = file.type || "application/octet-stream";
            if (!file.type || file.type === "application/octet-stream") {
              if (extension === "pdf") mimeType = "application/pdf";
              else if (["doc", "docx"].includes(extension))
                mimeType = "application/msword";
              else if (["xls", "xlsx"].includes(extension))
                mimeType = "application/vnd.ms-excel";
              else if (["ppt", "pptx"].includes(extension))
                mimeType = "application/vnd.ms-powerpoint";
              else if (extension === "txt") mimeType = "text/plain";
            }

            return {
              id: `doc-${Date.now()}-${Math.random()
                .toString(36)
                .substring(2, 9)}`,
              name: file.name,
              url: base64,
              size: file.size,
              type: "document",
              mimeType: mimeType,
            };
          } catch (err) {
            console.error(`Error processing document ${file.name}:`, err);
            return null;
          }
        })
      );

      const successfulDocuments = newDocuments.filter((doc) => doc !== null);

      if (successfulDocuments.length > 0) {
        setAttachments((prev) => {
          // Only auto-set type if we don't have mixed attachments
          const willHaveMixedAttachments = prev.images.length > 0 || prev.videos.length > 0;
          if (postType !== "Course Material" && !willHaveMixedAttachments) {
            setPostType("Course Material");
          } else if (willHaveMixedAttachments && !postType) {
            setPostType("Mixed Content");
          }
          return {
            ...prev,
            documents: [...prev.documents, ...successfulDocuments].slice(0, 4), // Limit to 4 documents
          };
        });

        // Store the raw files for API upload
        setAttachmentFiles(prev => [...prev, ...sizeValidFiles]);

        toast({
          title: "Documents uploaded",
          description: `Successfully added ${successfulDocuments.length} documents`,
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } else {
        toast({
          title: "Upload failed",
          description:
            "Failed to process any documents. Please try different files.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }

      e.target.value = null;
    } catch (error) {
      console.error("Error processing documents:", error);
      toast({
        title: "Error uploading documents",
        description: "Please try again with different documents",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Remove an attachment by type and id
  const removeAttachment = (type, id) => {
    // First, get the attachment that's being removed
    const attachmentToRemove = attachments[type].find(item => item.id === id);
    
    // Remove from the attachments display state
    setAttachments(prev => {
      const updated = { ...prev };
      updated[type] = prev[type].filter(item => item.id !== id);
      return updated;
    });
    
    // If we're in edit mode and this is an existing attachment (has a numeric ID)
    // add it to the list of attachments to remove
    if (isEditMode && attachmentToRemove && !isNaN(parseInt(attachmentToRemove.id))) {
      console.log(`Adding attachment ${attachmentToRemove.id} to removal list`);
      setAttachmentsToRemove(prev => [...prev, attachmentToRemove.id]);
    }
    
    // Remove from raw files array by matching filename
    if (attachmentToRemove) {
      setAttachmentFiles(prev => 
        prev.filter(file => file.name !== attachmentToRemove.name)
      );
    }
  };

  // Handle poll creation
  const handlePollAdd = () => {
    setIsPollModalOpen(true);
  };

  // Add a poll option
  const addPollOption = () => {
    if (pollOptions.length < 6) { // Limit to 6 options
      setPollOptions([...pollOptions, ""]);
    } else {
      toast({
        title: "Maximum poll options reached",
        description: "You can add up to 6 options",
        status: "warning",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  // Remove a poll option
  const removePollOption = (index) => {
    if (pollOptions.length > 1) { // Keep at least 1 option
      const newOptions = [...pollOptions];
      newOptions.splice(index, 1);
      setPollOptions(newOptions);
    } else {
      toast({
        title: "Minimum poll options required",
        description: "You need at least 1 option for a poll",
        status: "warning",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  // Save poll to attachments
  const savePoll = () => {
    // Validate poll data
    if (!pollQuestion.trim()) {
      toast({
        title: "Poll question is required",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
      return;
    }

    // Filter out empty options and check if we have at least 1
    const validOptions = pollOptions.filter(option => option.trim() !== "");
    if (validOptions.length < 1) {
      toast({
        title: "At least 1 poll option is required",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
      return;
    }

    // Create poll object
    const pollId = `poll-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    const newPoll = {
      id: pollId,
      question: pollQuestion,
      options: validOptions.map((option, index) => ({
        id: `option-${index}-${pollId}`,
        text: option,
        votes: 0
      })),
      createdAt: new Date().toISOString(),
      voters: []
    };

    // Clear existing polls (only one poll per post)
    setAttachments(prev => {
      const willHaveMixedAttachments = 
        prev.images.length > 0 || 
        prev.videos.length > 0 || 
        prev.documents.length > 0;

      if (willHaveMixedAttachments && !postType) {
        setPostType("Mixed Content");
      } else if (!willHaveMixedAttachments && !postType) {
        setPostType("Poll");
      }

      return {
        ...prev,
        polls: [newPoll]
      };
    });

    setHasPoll(true);
    setIsPollModalOpen(false);
    
    toast({
      title: "Poll added successfully",
      status: "success",
      duration: 2000,
      isClosable: true,
    });
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay bg="blackAlpha.600" backdropFilter="blur(4px)" />
        <ModalContent borderRadius="2xl" mx={4} overflow="hidden">
        <ModalHeader bg={useColorModeValue("gray.50", "gray.800")} borderBottomWidth="1px" borderColor={borderColor} pb={4} pt={3}>
          <Flex align="center" gap={3}>
            <Avatar
              src={currentUser?.avatar_url || currentUser?.avatar || "https://i.pravatar.cc/150?img=12"}
              size="md"
              name={`${currentUser?.first_name || ''} ${currentUser?.last_name || ''}`.trim() || 'You'}
              border="2px solid"
              borderColor={accentColor}
            />
            <VStack align="start" spacing={0}>
              <Text fontWeight="bold" lineHeight="short" color={textColor}>
                {`${currentUser?.first_name || ''} ${currentUser?.last_name || ''}`.trim() || 'You'}
              </Text>
              <HStack spacing={1} mt={1}>
                <Text fontSize="xs" color={useColorModeValue("gray.500", "gray.400")}>
                  Visible to everyone
                </Text>
              </HStack>
            </VStack>
          </Flex>
        </ModalHeader>
        <ModalCloseButton size="lg" mt={1} />

        <ModalBody pt={5} pb={2}>
          <VStack spacing={5} align="stretch">
            {/* Title input */}
            <FormControl>
              <FormLabel fontSize="sm" fontWeight="semibold" mb={1} ml={1} color={useColorModeValue("gray.700", "gray.300")}>
                Title
              </FormLabel>
              <Input
                placeholder="Enter a title for your post..."
                value={postTitle}
                onChange={(e) => setPostTitle(e.target.value)}
                size="md"
                borderRadius="md"
                borderWidth="2px"
                bg={useColorModeValue("white", "gray.700")}
                p={3}
                _placeholder={{ color: useColorModeValue("gray.400", "gray.400") }}
                _focus={{
                  borderColor: accentColor,
                  boxShadow: `0 0 0 1px ${accentColor}`,
                }}
              />
            </FormControl>
            
            {/* Content textarea */}
            <FormControl>
              <FormLabel fontSize="sm" fontWeight="semibold" mb={1} ml={1} color={useColorModeValue("gray.700", "gray.300")}>
                Content
              </FormLabel>
              <Textarea
                placeholder="Share your knowledge, resources, or ask a question..."
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
                size="md"
                borderRadius="md"
                borderWidth="2px"
                bg={useColorModeValue("white", "gray.700")}
                minHeight="140px"
                p={3}
                _placeholder={{ color: useColorModeValue("gray.400", "gray.400") }}
                _focus={{
                  borderColor: accentColor,
                  boxShadow: `0 0 0 1px ${accentColor}`,
                }}
              />
              <Flex justify="flex-end" mt={1.5}>
                <Text fontSize="xs" color={postContent.length > 480 ? "orange.500" : "gray.500"}>
                  {postContent.length}/500 characters
                </Text>
              </Flex>
            </FormControl>

            {/* Course selection */}
            <FormControl>
              <FormLabel fontSize="sm" fontWeight="semibold" mb={1} ml={1}>
                Course
              </FormLabel>
              <Menu>
                <MenuButton
                  as={Button}
                  rightIcon={<FiChevronDown />}
                  w="100%"
                  variant="outline"
                  textAlign="left"
                  fontWeight="normal"
                  overflow="hidden"
                  textOverflow="ellipsis"
                  whiteSpace="nowrap"
                >
                  {course && courses.length > 0
                    ? `${courses.find(c => c.id === Number(course))?.code} - ${courses.find(c => c.id === Number(course))?.title}`
                    : "Select course"}
                </MenuButton>
                <MenuList maxH="320px" overflowY="auto">
                  {coursesLoading ? (
                    <Flex justify="center" align="center" h="100px">
                      <Spinner />
                    </Flex>
                  ) : (
                    courses.map(c => (
                      <MenuItem key={c.id} onClick={() => setCourse(c.id)}>
                        <Box>
                          <Text fontWeight="medium">
                            {c.code} - {c.title}
                          </Text>
                          <Text fontSize="sm" color="gray.500">
                            {c.major?.name}
                          </Text>
                        </Box>
                      </MenuItem>
                    ))
                  )}
                  {totalCoursePages > 1 && (
                    <Box borderTop="1px solid" borderColor={borderColor} mt={2} pt={2} px={2}>
                      <Flex justify="space-between" align="center">
                        <Button
                          size="xs"
                          variant="outline"
                          onClick={e => {
                            e.stopPropagation();
                            onCoursePageChange(currentCoursePage - 1);
                          }}
                          isDisabled={currentCoursePage <= 1 || coursesLoading}
                        >
                          Prev
                        </Button>
                        <Text fontSize="xs" color="gray.500">
                          Page {currentCoursePage} of {totalCoursePages}
                        </Text>
                        <Button
                          size="xs"
                          variant="outline"
                          onClick={e => {
                            e.stopPropagation();
                            onCoursePageChange(currentCoursePage + 1);
                          }}
                          isDisabled={currentCoursePage >= totalCoursePages || coursesLoading}
                        >
                          Next
                        </Button>
                      </Flex>
                    </Box>
                  )}
                </MenuList>
              </Menu>
            </FormControl>

       
            {/* Attachments preview */}
            <AttachmentPreview 
              attachments={attachments} 
              removeAttachment={removeAttachment} 
            />
            
            {/* Attachment controls */}
            <AttachmentControls
              handleImageUpload={handleImageUpload}
              handleVideoUpload={handleVideoUpload}
              handleDocumentUpload={handleDocumentUpload}
              handlePollAdd={handlePollAdd}
            />
          </VStack>
        </ModalBody>

        <ModalFooter justifyContent="end" px={4} py={3} borderTopWidth="1px" borderColor={borderColor}>
          <Button 
            colorScheme="blue" 
            leftIcon={<FiSend />} 
            isLoading={isLoading}
            onClick={handleSubmit}
          >
            Post
          </Button>
        </ModalFooter>
      </ModalContent>
      </Modal>

      {/* Poll Modal */}
      <Modal isOpen={isPollModalOpen} onClose={() => setIsPollModalOpen(false)} size="md">
        <ModalOverlay bg="blackAlpha.600" backdropFilter="blur(4px)" />
        <ModalContent borderRadius="xl">
          <ModalHeader>Create Poll</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <VStack spacing={4} align="stretch">
              <FormControl isRequired>
                <FormLabel>Poll Question</FormLabel>
                <Input 
                  placeholder="Enter your question" 
                  value={pollQuestion}
                  onChange={(e) => setPollQuestion(e.target.value)}
                  autoFocus
                />
              </FormControl>
              
              <FormControl isRequired>
                <FormLabel>Poll Options</FormLabel>
                <VStack spacing={2} align="stretch">
                  {pollOptions.map((option, index) => (
                    <Flex key={index} alignItems="center">
                      <Input 
                        placeholder={`Option ${index + 1}`} 
                        value={option}
                        onChange={(e) => {
                          const newOptions = [...pollOptions];
                          newOptions[index] = e.target.value;
                          setPollOptions(newOptions);
                        }}
                        mr={2}
                      />
                      {pollOptions.length > 2 && (
                        <Button 
                          size="sm" 
                          colorScheme="red" 
                          variant="ghost"
                          onClick={() => removePollOption(index)}
                        >
                          <Icon as={FiTrash2} />
                        </Button>
                      )}
                    </Flex>
                  ))}
                </VStack>
              </FormControl>
              
              <Button 
                leftIcon={<Icon as={FiPlus} />} 
                variant="outline" 
                colorScheme="blue" 
                size="sm"
                onClick={addPollOption}
                isDisabled={pollOptions.length >= 6}
              >
                Add Option
              </Button>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button 
              colorScheme="blue" 
              mr={3}
              leftIcon={<Icon as={FiBarChart2} />}
              onClick={savePoll}
            >
              Create Poll
            </Button>
            <Button onClick={() => {
              setPollQuestion("");
              setPollOptions(["", ""]);
              setIsPollModalOpen(false);
            }}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default CreatePostModal;