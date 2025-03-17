import React from 'react';
import { Card, CardBody, useColorModeValue } from '@chakra-ui/react';
import StudyGroupPost from './StudyGroupPost';
import CourseMaterialPost from './CourseMaterialPost';
import EventPost from './EventPost';
import MediaPost from './MediaPost';
import DefaultPost from './DefaultPost';
import PostHeader from './PostHeader';

const PostFactory = ({ post }) => {
  // Styling
  const cardBg = useColorModeValue("white", "gray.700");
  const borderColor = getBorderColor(post);
  
  // Log incoming post data for debugging
  console.log(`PostFactory: rendering post with ID ${post.id || 'new'}, type "${post.type}"`, {
    hasImages: post.images?.length > 0,
    hasVideos: post.videos?.length > 0,
    hasDocuments: post.documents?.length > 0,
    hasFile: !!post.file,
    mediaType: post.mediaType
  });

  return (
    <Card bg={cardBg} borderLeft="4px" borderColor={borderColor} mb={4}>
      <PostHeader post={post} />
      <CardBody pt={0}>
        {renderPostContent(post)}
      </CardBody>
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
  switch (post.type) {
    case "Study Group":
      return <StudyGroupPost post={post} />;
    
    case "Course Material":
      return <CourseMaterialPost post={post} />;
    
    case "Event":
      return <EventPost post={post} />;
    
    case "Media":
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
  
  switch (post.type) {
    case "Study Group": return "blue.500";
    case "Course Material": return "green.500";
    case "Event": return "purple.500";
    case "Media": return "orange.500";
    default: return "gray.500";
  }
}

export default PostFactory;
