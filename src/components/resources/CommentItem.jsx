import React, { useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import {
  HStack,
  Avatar,
  Text,
  Box,
  Flex,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useColorModeValue,
  Input,
  useToast,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Button,
} from "@chakra-ui/react";
import { FiMoreVertical, FiEdit2, FiTrash2, FiTrendingUp } from "react-icons/fi";
import { formatDistanceToNow } from "date-fns";
import { deleteComment, updateComment, toggleCommentUpvote } from "../../services/resourceService";

const CommentItem = ({ 
  comment, 
  onCommentUpdate, 
  onCommentDelete, 
  currentUser 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(comment.body);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const inputRef = useRef(null);
  const cancelRef = useRef();
  const deletingRef = useRef(false);
  const toast = useToast();
  
  const isOwnComment = currentUser && comment.user.id === currentUser.id;
  const bgColor = useColorModeValue("gray.50", "gray.700");
  const textColor = useColorModeValue("gray.800", "white");
  const mutedColor = useColorModeValue("gray.500", "gray.400");
  
  const formattedTime = formatDistanceToNow(new Date(comment.created_at), { addSuffix: true });
  
  const handleEdit = () => {
    setIsEditing(true);
    setTimeout(() => inputRef.current?.focus(), 0);
  };
  
  const handleSaveEdit = async () => {
    if (editValue.trim() === "") return;
    if (editValue === comment.body) {
      setIsEditing(false);
      return;
    }
    
    setIsUpdating(true);
    try {
      const result = await updateComment(comment.id, editValue);
      onCommentUpdate(result.comment);
      setIsEditing(false);
      toast({
        title: "Comment updated",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Failed to update comment",
        description: error.response?.data?.message || "Please try again",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsUpdating(false);
    }
  };
  
  const openDeleteDialog = () => {
    setIsDeleteDialogOpen(true);
  };
  
  const closeDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
  };
  
  const handleDelete = useCallback(async () => {
    if (deletingRef.current) return;
    deletingRef.current = true;
    setIsDeleting(true);
    try {
      await deleteComment(comment.id);
      onCommentDelete(comment.id);
      toast({
        title: "Comment deleted",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
      closeDeleteDialog();
    } catch (error) {
      toast({
        title: "Failed to delete comment",
        description: error.response?.data?.message || "Please try again",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsDeleting(false);
      deletingRef.current = false;
    }
  }, [comment.id, onCommentDelete, toast]);
  
  const handleUpvote = async () => {
    try {
      // Optimistic update
      onCommentUpdate({
        ...comment,
        is_upvoted: !comment.is_upvoted,
        upvote_count: comment.upvote_count + (comment.is_upvoted ? -1 : 1)
      });
      
      const response = await toggleCommentUpvote(comment.id);
      
      // Update with actual server response
      onCommentUpdate({
        ...comment,
        is_upvoted: response.upvoted,
        upvote_count: response.upvote_count
      });
    } catch (error) {
      // Revert optimistic update
      onCommentUpdate(comment);
      toast({
        title: "Failed to upvote comment",
        description: error.response?.data?.message || "Please try again",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };
  
  const MotionBox = motion(Box);

  return (
    <MotionBox 
      mb={2} 
      width="100%"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <HStack align="flex-start" spacing={2}>
        <Avatar 
          size="xs" 
          name={`${comment.user.first_name} ${comment.user.last_name}`} 
          src={comment.user.avatar_url} 
        />
        <Box flex={1}>
          <Flex 
            direction="column" 
            bg={bgColor} 
            borderRadius="md" 
            px={3} 
            py={2}
          >
            <Flex justifyContent="space-between" alignItems="center">
              <Text fontWeight="medium" fontSize="sm" color={textColor}>
                {comment.user.first_name} {comment.user.last_name}
              </Text>
              {isOwnComment && !isEditing && (
        <Menu placement="bottom-end" isLazy>
                  <MenuButton
                    as={IconButton}
                    icon={<FiMoreVertical />}
                    variant="ghost"
                    size="xs"
                    aria-label="Comment options"
          isDisabled={isDeleting}
                  />
                  <MenuList fontSize="sm">
                    <MenuItem icon={<FiEdit2 />} onClick={handleEdit}>
                      Edit
                    </MenuItem>
          <MenuItem icon={<FiTrash2 />} onClick={openDeleteDialog} isDisabled={isDeleting}>
                      Delete
                    </MenuItem>
                  </MenuList>
                </Menu>
              )}
            </Flex>
            
            {isEditing ? (
              <Box mt={1}>
                <Input
                  ref={inputRef}
                  size="sm"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSaveEdit()}
                  onBlur={handleSaveEdit}
                  isDisabled={isUpdating}
                  autoFocus
                />
              </Box>
            ) : (
              <Text fontSize="sm" color={textColor} mt={0.5}>
                {comment.body}
              </Text>
            )}
          </Flex>
          
          <Flex mt={1} alignItems="center" fontSize="xs" color={mutedColor}>
            <Text>{formattedTime}</Text>
            <HStack spacing={1} ml={3}>
              <IconButton
                icon={<FiTrendingUp />}
                size="xs"
                variant="ghost"
                color={comment.is_upvoted ? "red.500" : mutedColor}
                aria-label="Upvote comment"
                onClick={handleUpvote}
              />
              <Text>{comment.upvote_count || 0}</Text>
            </HStack>
          </Flex>
        </Box>
      </HStack>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog
        isOpen={isDeleteDialogOpen}
        leastDestructiveRef={cancelRef}
        onClose={isDeleting ? () => {} : closeDeleteDialog}
        closeOnOverlayClick={!isDeleting}
        closeOnEsc={!isDeleting}
        size="sm"
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="md" fontWeight="bold">
              Delete Comment
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to delete this comment? This action cannot be undone.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={closeDeleteDialog} size="sm" isDisabled={isDeleting}>
                Cancel
              </Button>
              <Button 
                colorScheme="red" 
                onClick={handleDelete} 
                ml={3} 
                size="sm"
                isLoading={isDeleting}
                loadingText="Deleting"
              >
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </MotionBox>
  );
};

export default CommentItem;
