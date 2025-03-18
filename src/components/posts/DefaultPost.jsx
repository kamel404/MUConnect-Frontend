import { Text, useColorModeValue } from "@chakra-ui/react";

const DefaultPost = ({ post }) => {
  const textColor = useColorModeValue("gray.800", "white");

  return (
    <Text color={textColor}>{post.content}</Text>
  );
};

export default DefaultPost;
