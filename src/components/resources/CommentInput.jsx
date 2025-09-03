import React, { useState, useCallback, memo, useRef } from "react";
import {
  HStack,
  Input,
  Button,
  Avatar,
  useColorModeValue,
  FormControl,
  FormErrorMessage
} from "@chakra-ui/react";
import { FiSend } from "react-icons/fi";

/**
 * Component for adding comments to resources
 */
const CommentInput = memo(({ resourceId, onAddComment, currentUser }) => {
  const [inputValue, setInputValue] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  // Immediate lock to prevent double submits before React state updates
  const submittingRef = useRef(false);
  const maxLength = 500; // Maximum comment length

  const handleInputChange = (e) => {
    const value = e.target.value;
    if (value.length <= maxLength) {
      setInputValue(value);
      setError("");
    } else {
      setError(`Comment cannot exceed ${maxLength} characters`);
    }
  };

  const handleSubmit = useCallback(async () => {
    if (submittingRef.current) return; // hard guard
    const trimmed = inputValue.trim();
    if (!trimmed) {
      setError("Comment cannot be empty");
      return;
    }

    submittingRef.current = true;
    setIsSubmitting(true);
    try {
      await onAddComment(resourceId, trimmed);
      setInputValue("");
      setError("");
    } catch (err) {
      // Error is handled by parent component
    } finally {
      setIsSubmitting(false);
      submittingRef.current = false;
    }
  }, [inputValue, resourceId, onAddComment]);

  const inputBg = useColorModeValue("white", "gray.700");
  const inputBorder = useColorModeValue("gray.200", "gray.600");

  return (
    <FormControl isInvalid={!!error} mt={2}>
      <HStack spacing={2}>
        <Avatar 
          size="xs" 
          src={currentUser?.avatar_url} 
          name={`${currentUser?.first_name} ${currentUser?.last_name}`}
        />
        <Input
          size="sm"
          placeholder="Write a comment..."
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              if (!isSubmitting) handleSubmit();
            }
          }}
          bg={inputBg}
          borderColor={inputBorder}
          isDisabled={isSubmitting}
        />
        <Button
          rightIcon={<FiSend />}
          size="sm"
          aria-label="Send"
          onClick={handleSubmit}
          isLoading={isSubmitting}
          isDisabled={!inputValue.trim() || isSubmitting}
          colorScheme="blue"
        >
          Send
        </Button>
      </HStack>
      {error && <FormErrorMessage fontSize="xs">{error}</FormErrorMessage>}
    </FormControl>
  );
});

export default CommentInput;
