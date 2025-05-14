import React from "react";
import {
  Box, 
  Flex, 
  Text, 
  Badge, 
  Icon, 
  Image, 
  CloseButton, 
  SimpleGrid, 
  AspectRatio,
  useColorModeValue
} from "@chakra-ui/react";
import { FiImage, FiVideo, FiFileText, FiLink, FiExternalLink } from "react-icons/fi";

// Helper function to sort attachments for a social media style grid
const sortAttachmentsByType = (attachments) => {
  // Make sure attachment properties exist and are arrays
  const images = attachments.images || [];
  const videos = attachments.videos || [];
  const documents = attachments.documents || [];
  const links = attachments.links || [];

  // Combine all attachment types for a unified gallery
  const allItems = [
    ...images.map(item => ({ ...item, mediaType: 'image' })),
    ...videos.map(item => ({ ...item, mediaType: 'video' })),
    ...documents.map(item => ({ ...item, mediaType: 'document' })),
    ...links.map(item => ({ ...item, mediaType: 'link' }))
  ];

  // Sort by creation time (using ID since it contains timestamp)
  return allItems.sort((a, b) => {
    if (!a.id || !b.id) return 0;
    const aTime = a.id.split('-')[1] || 0;
    const bTime = b.id.split('-')[1] || 0;
    return bTime - aTime;
  });
};

// Format file size for documents
const formatFileSize = (bytes) => {
  if (bytes < 1024) return bytes + " B";
  else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
  else return (bytes / 1048576).toFixed(1) + " MB";
};

const AttachmentPreview = ({ attachments, removeAttachment }) => {
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const hoverBg = useColorModeValue("gray.50", "gray.700");
  
  // Check if we have mixed attachment types
  const hasMixedAttachments = React.useMemo(() => {
    const types = [
      attachments.images.length > 0,
      attachments.videos.length > 0,
      attachments.documents.length > 0,
      attachments.links?.length > 0,
    ];
    return types.filter(Boolean).length > 1;
  }, [attachments]);

  if (attachments.images.length === 0 && 
      attachments.videos.length === 0 && 
      attachments.documents.length === 0 &&
      (!attachments.links || attachments.links.length === 0)) {
    return null;
  }

  return (
    <Box
      borderWidth="1px"
      borderRadius="lg"
      p={3}
      borderColor={borderColor}
      bg={hoverBg}
    >
      <Flex justify="space-between" align="center" mb={2}>
        <Text fontSize="sm" fontWeight="medium">
          Attachments:
        </Text>
        {hasMixedAttachments && (
          <Badge colorScheme="purple" px={2} py={1} borderRadius="full" fontSize="xs">
            Mixed Content
          </Badge>
        )}
      </Flex>

      {/* Mixed content counter */}
      {hasMixedAttachments && (
        <Flex mb={3} gap={3} justify="flex-start">
          {attachments.images.length > 0 && (
            <Flex align="center" gap={1}>
              <Icon as={FiImage} color="green.500" />
              <Text fontSize="xs">{attachments.images.length} image{attachments.images.length !== 1 ? 's' : ''}</Text>
            </Flex>
          )}
          {attachments.videos.length > 0 && (
            <Flex align="center" gap={1}>
              <Icon as={FiVideo} color="red.500" />
              <Text fontSize="xs">{attachments.videos.length} video{attachments.videos.length !== 1 ? 's' : ''}</Text>
            </Flex>
          )}
          {attachments.documents.length > 0 && (
            <Flex align="center" gap={1}>
              <Icon as={FiFileText} color="blue.500" />
              <Text fontSize="xs">{attachments.documents.length} document{attachments.documents.length !== 1 ? 's' : ''}</Text>
            </Flex>
          )}
          {attachments.links && attachments.links.length > 0 && (
            <Flex align="center" gap={1}>
              <Icon as={FiLink} color="purple.500" />
              <Text fontSize="xs">{attachments.links.length} link{attachments.links.length !== 1 ? 's' : ''}</Text>
            </Flex>
          )}
        </Flex>
      )}

      {/* Unified Social Media Grid for All Attachment Types */}
      {sortAttachmentsByType({ images: attachments.images, videos: attachments.videos, documents: attachments.documents, links: attachments.links }).length > 0 && (
        <Box>
          {/* For a single item */}
          {sortAttachmentsByType({ images: attachments.images, videos: attachments.videos, documents: attachments.documents, links: attachments.links }).length === 1 ? (
            // Single item layout
            <Box position="relative" borderRadius="md" overflow="hidden">
              {(() => {
                const item = sortAttachmentsByType({ images: attachments.images, videos: attachments.videos, documents: attachments.documents, links: attachments.links })[0];
                if (item.mediaType === 'video') {
                  return (
                    <AspectRatio ratio={16 / 9}>
                      <Box
                        as="video"
                        src={item.url}
                        controls
                        borderRadius="md"
                      />
                    </AspectRatio>
                  );
                } else if (item.mediaType === 'image') {
                  return (
                    <AspectRatio ratio={4 / 3}>
                      <Image
                        src={item.url}
                        alt={item.name}
                        borderRadius="md"
                        objectFit="cover"
                      />
                    </AspectRatio>
                  );
                } else { // document
                  return (
                    <Flex
                      p={4}
                      borderRadius="md"
                      bg="blackAlpha.50"
                      align="center"
                      justify="space-between"
                      height="100px"
                    >
                      <Flex align="center">
                        <Icon as={FiFileText} boxSize={10} mr={3} color="blue.500" />
                        <Box>
                          <Text fontSize="md" fontWeight="medium" noOfLines={1}>
                            {item.name}
                          </Text>
                          <Text fontSize="sm" color="gray.500">
                            {formatFileSize(item.size)}
                          </Text>
                        </Box>
                      </Flex>
                    </Flex>
                  );
                }
              })()}
              <CloseButton
                position="absolute"
                top={1}
                right={1}
                size="sm"
                bg="blackAlpha.700"
                color="white"
                onClick={() => {
                  const item = sortAttachmentsByType({ images: attachments.images, videos: attachments.videos, documents: attachments.documents, links: attachments.links })[0];
                  const type = item.mediaType === 'image' ? 'images' : item.mediaType === 'video' ? 'videos' : item.mediaType === 'link' ? 'links' : 'documents';
                  removeAttachment(type, item.id);
                }}
                _hover={{ bg: "blackAlpha.800" }}
              />
            </Box>
          ) : (
            // Multiple items layout
            <SimpleGrid columns={Math.min(sortAttachmentsByType({ images: attachments.images, videos: attachments.videos, documents: attachments.documents, links: attachments.links }).length, 3)} spacing={2}>
              {sortAttachmentsByType({ images: attachments.images, videos: attachments.videos, documents: attachments.documents, links: attachments.links }).map((item) => (
                <Box key={item.id} position="relative" borderRadius="md" overflow="hidden">
                  {item.mediaType === 'video' ? (
                    <AspectRatio ratio={1}>
                      <Box
                        as="video"
                        src={item.url}
                        controls
                        borderRadius="md"
                      />
                    </AspectRatio>
                  ) : item.mediaType === 'image' ? (
                    <AspectRatio ratio={1}>
                      <Image
                        src={item.url}
                        alt={item.name}
                        borderRadius="md"
                        objectFit="cover"
                      />
                    </AspectRatio>
                  ) : item.mediaType === 'link' ? (
                    <Flex
                      p={4}
                      borderRadius="md"
                      bg="blackAlpha.50"
                      align="center"
                      justify="space-between"
                      height="100px"
                      width="100%"
                    >
                      <Flex align="center">
                        <Icon as={FiExternalLink} boxSize={8} mr={3} color="purple.500" />
                        <Box>
                          <Text fontSize="md" fontWeight="medium" noOfLines={1}>
                            {item.title}
                          </Text>
                          <Text fontSize="sm" color="gray.500" noOfLines={1}>
                            {item.url}
                          </Text>
                        </Box>
                      </Flex>
                    </Flex>
                  ) : (
                    // Document card
                    <AspectRatio ratio={1}>
                      <Flex
                        direction="column"
                        p={3}
                        bg="blackAlpha.50"
                        align="center"
                        justify="center"
                        borderRadius="md"
                        height="100%"
                        width="100%"
                      >
                        <Icon as={FiFileText} boxSize={10} mb={2} color="blue.500" />
                        <Text fontSize="sm" fontWeight="medium" noOfLines={1} textAlign="center">
                          {item.name}
                        </Text>
                        <Text fontSize="xs" color="gray.500">
                          {formatFileSize(item.size)}
                        </Text>
                      </Flex>
                    </AspectRatio>
                  )}
                  <CloseButton
                    position="absolute"
                    top={1}
                    right={1}
                    size="sm"
                    bg="blackAlpha.700"
                    color="white"
                    onClick={() => {
                      const type = item.mediaType === 'image' ? 'images' : item.mediaType === 'video' ? 'videos' : item.mediaType === 'link' ? 'links' : 'documents';
                      removeAttachment(type, item.id);
                    }}
                    _hover={{ bg: "blackAlpha.800" }}
                  />
                </Box>
              ))}
            </SimpleGrid>
          )}
        </Box>
      )}
    </Box>
  );
};

export default AttachmentPreview;
