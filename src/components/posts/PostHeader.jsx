import { CardHeader, Flex, Avatar, Box, Heading, Text, useColorModeValue } from "@chakra-ui/react";

const PostHeader = ({ post }) => {
  const textColor = useColorModeValue("gray.800", "white");
  const mutedText = useColorModeValue("gray.500", "gray.400");

  return (
    <CardHeader>
      <Flex gap={3} align="center">
        <Avatar src={post.avatar} />
        <Box>
          <Heading size="sm" color={textColor}>
            {post.user}
          </Heading>
          <Text fontSize="sm" color={mutedText}>
            {post.time} {post.course && `• ${post.course}`}
          </Text>
        </Box>
      </Flex>
    </CardHeader>
  );
};

export default PostHeader;
