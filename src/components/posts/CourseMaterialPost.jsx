import React, { useState, useEffect } from 'react';
import {
  Box, 
  Text, 
  Icon, 
  Button, 
  Flex, 
  Spinner,
  HStack,
  VStack,
  Link,
  Badge,
  Divider,
  useToast
} from '@chakra-ui/react';
import { 
  FiFileText, 
  FiFile, 
  FiDownload, 
  FiAlertCircle,
  FiFilm,
  FiImage,
  FiPaperclip
} from 'react-icons/fi';

// Helper to determine the icon based on file extension
const getFileIcon = (fileName) => {
  if (!fileName) return FiFile;
  
  const extension = fileName.split('.').pop().toLowerCase();
  
  switch (extension) {
    case 'pdf':
      return FiFileText;
    case 'doc':
    case 'docx':
      return FiFileText;
    case 'xls':
    case 'xlsx':
      return FiFileText;
    case 'ppt':
    case 'pptx':
      return FiFilm;
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
      return FiImage;
    default:
      return FiFile;
  }
};

const CourseMaterialPost = ({ post }) => {
  const [documents, setDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const toast = useToast();
  
  useEffect(() => {
    const docs = [];
    
    // Process document attachments
    if (post.documents?.length) {
      post.documents.forEach(doc => {
        if (doc && doc.url) {
          docs.push({
            id: doc.id || `doc-${Math.random()}`,
            url: doc.url,
            name: doc.name || 'Document',
            type: 'document',
            mimeType: doc.mimeType || 'application/octet-stream'
          });
        }
      });
    }
    
    // Add primary file if present
    if (post.file && (!docs.length || !docs.some(d => d.url === post.file))) {
      docs.unshift({
        id: 'primary',
        url: post.file,
        name: post.fileName || 'Document',
        type: 'document',
        mimeType: 'application/pdf' // Default to PDF
      });
    }
    
    setDocuments(docs);
    setIsLoading(false);
    setHasError(false);
  }, [post]);
  
  const handleDocumentDownload = (document) => {
    try {
      // For base64 data URLs, create a download link
      if (document.url.startsWith('data:')) {
        const a = document.createElement('a');
        a.href = document.url;
        a.download = document.name || 'document';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        toast({
          title: "Download initiated",
          description: `Downloading ${document.name}...`,
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } else {
        // For regular URLs, open in new tab
        window.open(document.url, '_blank');
      }
    } catch (error) {
      toast({
        title: "Download failed",
        description: "There was an error downloading the document. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };
  
  // If no documents, show placeholder
  if (documents.length === 0) {
    return (
      <Box width="100%">
        <Text mb={4}>{post.content}</Text>
      </Box>
    );
  }
  
  return (
    <Box width="100%">
      {/* Post Content */}
      <Text mb={4}>{post.content}</Text>
      
      {/* Document List */}
      <VStack spacing={3} align="stretch" mt={2}>
        <Divider />
        <Text fontWeight="bold" fontSize="sm">Attached Documents</Text>
        
        {documents.map((doc, index) => (
          <Box 
            key={doc.id || index}
            p={3}
            borderWidth="1px"
            borderRadius="md"
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            _hover={{ bg: "gray.50" }}
            _dark={{ _hover: { bg: "gray.700" } }}
          >
            <Flex align="center">
              <Icon 
                as={getFileIcon(doc.name)} 
                boxSize={6} 
                color="green.500" 
                mr={3}
              />
              
              <Box>
                <Text fontWeight="medium">{doc.name}</Text>
                <Text fontSize="xs" color="gray.500">
                  {doc.mimeType?.split('/')[1] || 'document'}
                </Text>
              </Box>
            </Flex>
            
            <Button
              leftIcon={<FiDownload />}
              colorScheme="green"
              size="sm"
              onClick={() => handleDocumentDownload(doc)}
            >
              Download
            </Button>
          </Box>
        ))}
      </VStack>
    </Box>
  );
};

export default CourseMaterialPost;
