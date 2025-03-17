import { Card, CardBody, Text, useColorModeValue } from "@chakra-ui/react";
import PostHeader from "./PostHeader";
import PostActions from "./PostActions";

const DefaultPost = ({ post }) => {
  const cardBg = useColorModeValue("white", "gray.700");
  const textColor = useColorModeValue("gray.800", "white");

  return (
    <Card bg={cardBg}>
      <PostHeader post={post} />
      <CardBody>
        <Text color={textColor}>{post.content}</Text>
      </CardBody>
      <PostActions post={post} />
    </Card>
  );
};

export default DefaultPost;
