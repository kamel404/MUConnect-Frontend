import { Box } from "@chakra-ui/react";
import PostCard from "../../pages/PostCard";

const PostFeed = ({ posts, cardBg, textColor, mutedText, accentColor, primaryColor }) => (
  <Box>
    {posts.map((post) => (
      <PostCard
        key={post.id}
        post={post}
        cardBg={cardBg}
        textColor={textColor}
        mutedText={mutedText}
        accentColor={accentColor}
        primaryColor={primaryColor}
        showTypeBadge
      />
    ))}
  </Box>
);

export default PostFeed;
