import React from 'react';
import { Card, CardBody, useColorModeValue } from '@chakra-ui/react';
import StudyGroupPost from './StudyGroupPost';
import CourseMaterialPost from './CourseMaterialPost';
import EventPost from './EventPost';
import MediaPost from './MediaPost';
import DefaultPost from './DefaultPost';
import PostHeader from './PostHeader';
import PostActions from './PostActions';

const PostFactory = ({ post }) => {
  // Styling
  const cardBg = useColorModeValue("white", "gray.700");
  const borderColor = getBorderColor(post);

  return (
    <Card bg={cardBg} borderLeft="4px" borderColor={borderColor} mb={4}>
      <PostHeader post={post} />
      <CardBody pt={0}>
        {renderPostContent(post)}
      </CardBody>
      <PostActions post={post} />
    </Card>
  );
};

// Helper function to determine which component to render
function renderPostContent(post) {  
  // First, check if the post has media attachments
  if ((post.images && post.images.length > 0) || 
      (post.videos && post.videos.length > 0) ||
      post.mediaType === 'video' || post.mediaType === 'image') {
    return <MediaPost post={post} />;
  }
  
  // Then check if it has document attachments
  if ((post.documents && post.documents.length > 0) || post.file) {
    return <CourseMaterialPost post={post} />;
  }
  
  // Otherwise, use the explicit type
  switch (post.type?.toLowerCase()) {
    case "study group":
      return <StudyGroupPost post={post} />;
    
    case "course material":
      return <CourseMaterialPost post={post} />;
    
    case "event":
      return <EventPost post={post} />;
    
    case "media":
      return <MediaPost post={post} />;
    
    default:
      return <DefaultPost post={post} />;
  }
}

// Helper function to determine border color
function getBorderColor(post) {
  if (post.images?.length > 0 || post.videos?.length > 0 || post.mediaType === 'video' || post.mediaType === 'image') {
    return "orange.500"; // Media
  }
  
  if (post.documents?.length > 0 || post.file) {
    return "green.500"; // Documents
  }
  
  switch (post.type?.toLowerCase()) {
    case "study group": return "blue.500";
    case "course material": return "green.500";
    case "event": return "purple.500";
    case "media": return "orange.500";
    default: return "gray.500";
  }
}

export default PostFactory;
