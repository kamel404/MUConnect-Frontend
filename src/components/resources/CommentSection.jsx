import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Heading,
  Text,
  Divider,
  VStack,
  useColorModeValue,
  Spinner,
  Center,
  Button,
  useToast,
  Flex
} from "@chakra-ui/react";
import CommentInput from "./CommentInput";
import CommentItem from "./CommentItem";
import { getResourceComments, addComment } from "../../services/resourceService";

const CommentSection = ({ resourceId, currentUser }) => {
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [commentCount, setCommentCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMoreComments, setHasMoreComments] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const COMMENTS_PER_PAGE = 5;
  const toast = useToast();

  const loadComments = useCallback(async (page = 1, reset = true) => {
    if (!resourceId) return;
    
    if (reset) {
      setIsLoading(true);
      setError(null);
    } else {
      setIsLoadingMore(true);
    }
    
    try {
      const response = await getResourceComments(resourceId, page, COMMENTS_PER_PAGE);
      
      if (reset) {
        setComments(response.comments);
      } else {
        setComments(prev => [...prev, ...response.comments]);
      }
      
      setCommentCount(response.count);
      setCurrentPage(page);
      
      // Check if there are more comments to load
      setHasMoreComments(response.comments.length === COMMENTS_PER_PAGE && 
                        response.count > page * COMMENTS_PER_PAGE);
    } catch (err) {
      console.error("Error loading comments:", err);
      setError("Failed to load comments. Please try again.");
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  }, [resourceId]);
  
  const loadMoreComments = useCallback(() => {
    loadComments(currentPage + 1, false);
  }, [currentPage, loadComments]);

  useEffect(() => {
    loadComments(1, true);
  }, [loadComments]);

  const handleAddComment = useCallback(async (resourceId, body) => {
    try {
      const response = await addComment(resourceId, body);
      setComments(prevComments => [response.comment, ...prevComments]);
      setCommentCount(response.comment_count);
      
      // Reset pagination after adding a new comment
      setCurrentPage(1);
      setHasMoreComments(response.comment_count > COMMENTS_PER_PAGE);
      
      toast({
        title: "Comment added",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    } catch (err) {
      console.error("Error adding comment:", err);
      toast({
        title: "Failed to add comment",
        description: err.response?.data?.message || "Please try again",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  }, [toast]);

  const handleCommentUpdate = useCallback((updatedComment) => {
    setComments(prevComments => 
      prevComments.map(comment => 
        comment.id === updatedComment.id ? updatedComment : comment
      )
    );
  }, []);

  const handleCommentDelete = useCallback((commentId) => {
    setComments(prevComments => prevComments.filter(comment => comment.id !== commentId));
    setCommentCount(prevCount => prevCount - 1);
    
    // Check if we need to load more comments after deletion
    if (comments.length <= COMMENTS_PER_PAGE && hasMoreComments) {
      loadMoreComments();
    }
  }, [comments.length, hasMoreComments, loadMoreComments]);

  const bgColor = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.800", "white");
  const dividerColor = useColorModeValue("gray.200", "gray.700");

  return (
    <Box 
      p={4}
      bg={bgColor}
      borderRadius="md"
      shadow="sm"
    >
      <Heading as="h3" size="sm" mb={4} color={textColor}>
        Comments ({commentCount})
      </Heading>
      
      <CommentInput resourceId={resourceId} onAddComment={handleAddComment} currentUser={currentUser} />
      
      <Divider my={4} borderColor={dividerColor} />
      
      {isLoading ? (
        <Center py={4}>
          <Spinner size="md" />
        </Center>
      ) : error ? (
        <Center py={4}>
          <VStack>
            <Text color="red.500">{error}</Text>
            <Button size="sm" onClick={loadComments}>Retry</Button>
          </VStack>
        </Center>
      ) : comments.length === 0 ? (
        <Center py={4}>
          <Text color="gray.500">No comments yet. Be the first to comment!</Text>
        </Center>
      ) : (
        <VStack spacing={3} align="stretch">
          {comments.map(comment => (
            <CommentItem
              key={comment.id}
              comment={comment}
              onCommentUpdate={handleCommentUpdate}
              onCommentDelete={handleCommentDelete}
              currentUser={currentUser}
            />
          ))}
          
          {hasMoreComments && (
            <Flex justify="center" mt={2}>
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={loadMoreComments} 
                isLoading={isLoadingMore}
                loadingText="Loading"
              >
                Load more comments
              </Button>
            </Flex>
          )}
        </VStack>
      )}
    </Box>
  );
};

export default CommentSection;
