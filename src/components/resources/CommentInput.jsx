import React, { useState, useCallback, memo } from "react";
import {
  HStack,
  Input,
  IconButton,
  Avatar
} from "@chakra-ui/react";
import { FiSend } from "react-icons/fi";

/**
 * Component for adding comments to resources
 */
const CommentInput = memo(({ resourceId, onAddComment }) => {
  const [inputValue, setInputValue] = useState("");

  const handleSubmit = useCallback(() => {
    if (inputValue.trim()) {
      onAddComment(resourceId, inputValue);
      setInputValue("");
    }
  }, [inputValue, resourceId, onAddComment]);

  return (
    <HStack spacing={2} mt={2}>
      <Avatar size="xs" src="https://i.pravatar.cc/150?img=12" />
      <Input
        size="sm"
        placeholder="Write a comment..."
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
      />
      <IconButton
        icon={<FiSend />}
        size="sm"
        aria-label="Send"
        onClick={handleSubmit}
      />
    </HStack>
  );
});

export default CommentInput;
