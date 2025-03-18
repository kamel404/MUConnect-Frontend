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
  
  // Enhanced logging for debugging
  console.log(`PostFactory: rendering post with ID ${post.id || 'new'}, type "${post.type}"`, {
    hasImages: post.images?.length > 0,
    hasVideos: post.videos?.length > 0,
    hasDocuments: post.documents?.length > 0,
    hasFile: !!post.file,
    mediaType: post.mediaType,
    documentCount: post.documents?.length || 0,
    videoCount: post.videos?.length || 0,
    // Detailed content check
    documents: post.documents ? JSON.stringify(post.documents).substring(0, 100) + '...' : 'undefined',
    videos: post.videos ? JSON.stringify(post.videos).substring(0, 100) + '...' : 'undefined'
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
  // Enhanced logging
  console.log("PostFactory.renderPostContent: determining component for post", {
    type: post.type,
    hasMedia: Boolean((post.images && post.images.length > 0) || 
                      (post.videos && post.videos.length > 0) ||
                      post.mediaType === 'video' || post.mediaType === 'image'),
    hasDocuments: Boolean((post.documents && post.documents.length > 0) || post.file)
  });
  
  // First, check if the post has media attachments
  if ((post.images && post.images.length > 0) || 
      (post.videos && post.videos.length > 0) ||
      post.mediaType === 'video' || post.mediaType === 'image') {
    console.log("Rendering MediaPost due to media content");
    return <MediaPost post={post} />;
  }
  
  // Then check if it has document attachments
  if ((post.documents && post.documents.length > 0) || post.file) {
    console.log("Rendering CourseMaterialPost due to documents");
    return <CourseMaterialPost post={post} />;
  }
  
  // Otherwise, use the explicit type
  console.log(`Using post type ${post.type} to determine component`);
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
