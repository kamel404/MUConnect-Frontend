import React, { useState, useEffect } from 'react';
import {
  Box, 
  Text, 
  Image, 
  AspectRatio, 
  Button, 
  Flex, 
  Spinner,
  IconButton,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  ModalHeader
} from '@chakra-ui/react';
import { FiX, FiMaximize, FiAlertCircle, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

// Video component with error handling
const VideoPlayer = ({ src, mimeType, autoPlay = false }) => {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  
  if (!src) {
    return (
      <Flex 
        justify="center" 
        align="center" 
        height="300px" 
        bg="gray.100" 
        direction="column"
        _dark={{ bg: "gray.700" }}
      >
        <FiAlertCircle size={40} color="red" />
        <Text mt={2}>Video source not found</Text>
      </Flex>
    );
  }
  
  // Basic MIME type fallback
  const videoType = mimeType || (src.startsWith('data:video/') 
    ? src.split(';')[0].replace('data:', '') 
    : 'video/mp4');
  
  return (
    <Box position="relative" className="video-player-container">
      {loading && (
        <Flex 
          position="absolute" 
          top="0" 
          left="0" 
          right="0" 
          bottom="0" 
          justify="center" 
          align="center"
          zIndex="1"
          bg="rgba(0,0,0,0.1)"
        >
          <Spinner size="xl" color="green.500" />
        </Flex>
      )}
      
      {error ? (
        <Flex 
          justify="center" 
          align="center" 
          height="300px" 
          bg="gray.100" 
          direction="column"
          _dark={{ bg: "gray.700" }}
        >
          <FiAlertCircle size={40} color="red" />
          <Text mt={2}>Failed to load video</Text>
          <Text fontSize="sm" color="gray.500" maxW="80%" textAlign="center" mb={2}>
            {mimeType ? `Format: ${mimeType}` : "Unknown format"}
          </Text>
          <Button 
            mt={2}
            onClick={() => window.open(src, '_blank')}
            size="sm"
            colorScheme="blue"
          >
            Open Video in New Tab
          </Button>
        </Flex>
      ) : (
        <video
          width="100%"
          height="300px"
          controls
          autoPlay={autoPlay}
          preload="metadata"
          onLoadStart={() => {
            setLoading(true);
          }}
          onLoadedData={() => {
            setLoading(false);
          }}
          onError={(e) => {
            setError(true);
            setLoading(false);
          }}
          style={{ backgroundColor: "#000" }}
        >
          <source src={src} type={videoType} />
          Your browser does not support the video tag.
        </video>
      )}
    </Box>
  );
};

const MediaPost = ({ post }) => {
  const [mediaItems, setMediaItems] = useState([]);
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {    
    // Process all media items
    const allMedia = [];
    
    // Process images
    if (post.images && Array.isArray(post.images)) {
      post.images.forEach(img => {
        if (img && img.url) {
          allMedia.push({
            id: img.id || `img-${Math.random()}`,
            url: img.url,
            type: 'image',
            mimeType: img.mimeType || 'image/jpeg'
          });
        }
      });
    }
    
    // Process videos
    if (post.videos && Array.isArray(post.videos)) {
      post.videos.forEach(video => {
        if (video && video.url) {
          allMedia.push({
            id: video.id || `video-${Math.random()}`,
            url: video.url,
            type: 'video',
            mimeType: video.mimeType || 'video/mp4'
          });
        }
      });
    }
    
    // Add main media if not included but specified
    if (post.media && post.mediaType && !allMedia.some(m => m.url === post.media)) {
      allMedia.unshift({
        id: 'main-media',
        url: post.media,
        type: post.mediaType,
        mimeType: post.mediaType === 'video' ? 'video/mp4' : 'image/jpeg'
      });
    }
    
    setMediaItems(allMedia);
    setLoading(false);
  }, [post]);
  
  const nextMedia = () => {
    setActiveMediaIndex(prev => (prev + 1) % mediaItems.length);
  };
  
  const prevMedia = () => {
    setActiveMediaIndex(prev => (prev - 1 + mediaItems.length) % mediaItems.length);
  };
  
  if (mediaItems.length === 0) {
    return (
      <Box width="100%">
        <Text mb={4}>{post.content}</Text>
      </Box>
    );
  }
  
  const activeMedia = mediaItems[activeMediaIndex] || null;
  
  return (
    <Box width="100%">
      {/* Post Content */}
      <Text mb={4}>{post.content}</Text>
      
      {/* Media Display */}
      <Box position="relative" mb={4}>
        {/* Media Navigation (only if more than one) */}
        {mediaItems.length > 1 && (
          <>
            <IconButton
              icon={<FiChevronLeft />}
              position="absolute"
              left="0"
              top="50%"
              transform="translateY(-50%)"
              zIndex="1"
              colorScheme="blackAlpha"
              onClick={prevMedia}
              aria-label="Previous media"
            />
            
            <IconButton
              icon={<FiChevronRight />}
              position="absolute"
              right="0"
              top="50%"
              transform="translateY(-50%)"
              zIndex="1"
              colorScheme="blackAlpha"
              onClick={nextMedia}
              aria-label="Next media"
            />
          </>
        )}
        
        {/* Loading State */}
        {loading && (
          <Flex 
            justify="center" 
            align="center" 
            height="300px" 
            bg="gray.100" 
            _dark={{ bg: "gray.700" }}
          >
            <Spinner color="green.500" size="xl" />
          </Flex>
        )}
        
        {/* Active Media Display */}
        {activeMedia && (
          <Box>
            {activeMedia.type === 'image' ? (
              <Box position="relative">
                <Image
                  src={activeMedia.url}
                  maxH="500px"
                  width="100%"
                  objectFit="contain"
                  borderRadius="md"
                  fallback={
                    <Flex 
                      justify="center" 
                      align="center" 
                      height="300px" 
                      bg="gray.100" 
                      direction="column"
                      _dark={{ bg: "gray.700" }}
                    >
                      <FiAlertCircle size={40} />
                      <Text mt={2}>Failed to load image</Text>
                    </Flex>
                  }
                />
                <IconButton
                  icon={<FiMaximize />}
                  position="absolute"
                  top="2"
                  right="2"
                  colorScheme="blackAlpha"
                  onClick={onOpen}
                  aria-label="View fullscreen"
                />
              </Box>
            ) : (
              <Box position="relative">
                <VideoPlayer 
                  src={activeMedia.url} 
                  mimeType={activeMedia.mimeType} 
                />
                <IconButton
                  icon={<FiMaximize />}
                  position="absolute"
                  top="2"
                  right="2"
                  colorScheme="blackAlpha"
                  onClick={onOpen}
                  aria-label="View fullscreen"
                />
              </Box>
            )}
          </Box>
        )}
      </Box>
      
      {/* Media Counter */}
      {mediaItems.length > 1 && (
        <Flex justify="center" mb={4}>
          <Text fontSize="sm">
            {activeMediaIndex + 1} / {mediaItems.length}
          </Text>
        </Flex>
      )}
      
      {/* Fullscreen Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="full">
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton zIndex="2" />
          <ModalBody p={0} display="flex" alignItems="center" justifyContent="center" bg="blackAlpha.900">
            {activeMedia && (
              activeMedia.type === 'image' ? (
                <Image
                  src={activeMedia.url}
                  maxH="90vh"
                  maxW="90vw"
                  objectFit="contain"
                />
              ) : (
                <VideoPlayer 
                  src={activeMedia.url} 
                  mimeType={activeMedia.mimeType}
                  autoPlay={true}
                />
              )
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default MediaPost;
