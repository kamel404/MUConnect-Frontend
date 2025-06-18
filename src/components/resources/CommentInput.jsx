import React, { useState, useCallback, memo } from "react";
import {
  HStack,
  Input,
  IconButton,
  Avatar,
  useColorModeValue,
  Tooltip,
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
    if (!inputValue.trim()) {
      setError("Comment cannot be empty");
      return;
    }
    
    setIsSubmitting(true);
    try {
      await onAddComment(resourceId, inputValue);
      setInputValue("");
      setError("");
    } catch (err) {
      // Error is handled by parent component
    } finally {
      setIsSubmitting(false);
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
          onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSubmit()}
          bg={inputBg}
          borderColor={inputBorder}
          isDisabled={isSubmitting}
        />
        <Tooltip label={inputValue.trim() ? "Send comment" : "Write something first"}>
          <IconButton
            icon={<FiSend />}
            size="sm"
            aria-label="Send"
            onClick={handleSubmit}
            isLoading={isSubmitting}
            isDisabled={!inputValue.trim() || isSubmitting}
            colorScheme={inputValue.trim() ? "blue" : "gray"}
          />
        </Tooltip>
      </HStack>
      {error && <FormErrorMessage fontSize="xs">{error}</FormErrorMessage>}
    </FormControl>
  );
});

export default CommentInput;
