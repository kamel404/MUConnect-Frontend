import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  Flex,
  Icon,
  Badge,
  Grid,
  GridItem,
  Card,
  CardBody,
  Divider,
  List,
  ListItem,
  ListIcon,
  AspectRatio,
  IconButton,
  useColorModeValue,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Skeleton,
  Tooltip,
  useToast
} from "@chakra-ui/react";
import {
  FiDownload,
  FiArrowLeft,
  FiCalendar,
  FiUser,
  FiFileText,
  FiFolder,
  FiClock,
  FiStar,
  FiShare2,
  FiBookmark,
  FiPrinter,
  FiChevronRight
} from "react-icons/fi";

const DocumentView = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const toast = useToast();
  const { docId } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [document, setDocument] = useState(null);

  // In a real app, this would come from the URL params, but for now we'll use state passed through location
  useEffect(() => {
    // Simulate loading document data
    setIsLoading(true);
    
    // In a real app, you would fetch the document by ID from an API
    // For now, we'll use the document data passed through location.state
    if (location.state?.document) {
      setTimeout(() => {
        setDocument(location.state.document);
        setIsLoading(false);
      }, 800); // Simulate network delay
    } else {
      // Handle case where document data isn't available
      setIsLoading(false);
      toast({
        title: "Document not found",
        description: "The requested document could not be loaded.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  }, [location, docId, toast]);

  const handleDownload = () => {
    if (document) {
      const link = document.createElement('a');
      link.href = document.url;
      link.setAttribute('download', document.name);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Download started",
        description: `${document.name} is downloading.`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleBookmark = () => {
    toast({
      title: "Document bookmarked",
      description: "You can access this document in your bookmarks.",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  const handleShare = () => {
    // In a real app, this would open a share dialog
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Link copied",
      description: "Document link copied to clipboard.",
      status: "info",
      duration: 3000,
      isClosable: true,
    });
  };

  const handlePrint = () => {
    window.print();
  };

  // Theme color values
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const mutedText = useColorModeValue("gray.600", "gray.400");
  const accentColor = useColorModeValue("brand.gold", "brand.goldDark");
  const primaryColor = useColorModeValue("brand.navy", "brand.navyDark");
  const secondaryBg = useColorModeValue("gray.50", "gray.800");

  return (
    <>
      <Box px={{ base: 4, md: 6 }} py={6} maxW="1400px" mx="auto" bg={secondaryBg}>
        {/* Back Button */}
        <Button
          leftIcon={<FiArrowLeft />}
          variant="ghost"
          mb={6}
          onClick={() => navigate(-1)}
          size="sm"
          color={primaryColor}
          _hover={{ bg: "transparent", color: accentColor }}
        >
          Back
        </Button>

        <Grid templateColumns={{ base: "1fr", lg: "3fr 1fr" }} gap={6}>
          {/* Main Content */}
          <GridItem>
            <Card bg={cardBg} shadow="md" borderRadius="lg" overflow="hidden">
              {/* Document Header */}
              <Flex 
                p={6} 
                borderBottom="1px" 
                borderColor={borderColor}
                direction={{ base: "column", md: "row" }}
                justify="space-between"
                align={{ base: "start", md: "center" }}
                gap={4}
              >
                <Box>
                  <Heading as="h1" size="lg" mb={2} color={primaryColor}>
                    {isLoading ? (
                      <Skeleton height="36px" width="300px" />
                    ) : (
                      document?.name || "Document not found"
                    )}
                  </Heading>
                  <Flex align="center" gap={3} color={mutedText} flexWrap="wrap">
                    {isLoading ? (
                      <Skeleton height="20px" width="180px" />
                    ) : (
                      <>
                        <Flex align="center" gap={1}>
                          <Icon as={FiFileText} color={accentColor} />
                          <Text>{document?.type || "Unknown type"}</Text>
                        </Flex>
                        {document?.size && (
                          <Flex align="center" gap={1}>
                            <Icon as={FiFolder} color={accentColor} />
                            <Text>{document.size}</Text>
                          </Flex>
                        )}
                        <Flex align="center" gap={1}>
                          <Icon as={FiClock} color={accentColor} />
                          <Text>Uploaded {document?.uploadDate || "recently"}</Text>
                        </Flex>
                      </>
                    )}
                  </Flex>
                </Box>
                <Flex gap={2}>
                  <Tooltip label="Download">
                    <IconButton
                      aria-label="Download document"
                      icon={<FiDownload />}
                      onClick={handleDownload}
                      isDisabled={isLoading || !document}
                      bg={primaryColor}
                      color="white"
                      _hover={{ bg: accentColor }}
                    />
                  </Tooltip>
                  <Tooltip label="Bookmark">
                    <IconButton
                      aria-label="Bookmark document"
                      icon={<FiBookmark />}
                      onClick={handleBookmark}
                      isDisabled={isLoading || !document}
                      bg={primaryColor}
                      color="white"
                      _hover={{ bg: accentColor }}
                    />
                  </Tooltip>
                  <Tooltip label="Share">
                    <IconButton
                      aria-label="Share document"
                      icon={<FiShare2 />}
                      onClick={handleShare}
                      isDisabled={isLoading || !document}
                      bg={primaryColor}
                      color="white"
                      _hover={{ bg: accentColor }}
                    />
                  </Tooltip>
                  <Tooltip label="Print">
                    <IconButton
                      aria-label="Print document"
                      icon={<FiPrinter />}
                      onClick={handlePrint}
                      isDisabled={isLoading || !document}
                      bg={primaryColor}
                      color="white"
                      _hover={{ bg: accentColor }}
                    />
                  </Tooltip>
                </Flex>
              </Flex>

              {/* Document Preview */}
              <Box p={6}>
                {isLoading ? (
                  <Skeleton height="600px" width="100%" />
                ) : document ? (
                  <AspectRatio ratio={4/3} maxH="800px">
                    <Box
                      as="iframe"
                      src={document.url}
                      borderRadius="md"
                      bg={secondaryBg}
                      border="1px"
                      borderColor={borderColor}
                      width="100%"
                      height="100%"
                      aria-label="Document preview"
                    />
                  </AspectRatio>
                ) : (
                  <Flex 
                    direction="column" 
                    align="center" 
                    justify="center" 
                    py={20}
                    bg={secondaryBg}
                    borderRadius="md"
                  >
                    <Icon as={FiFileText} boxSize={16} color={mutedText} mb={4} />
                    <Heading size="md" mb={2} color={primaryColor}>Document Not Found</Heading>
                    <Text color={mutedText}>
                      The document you're looking for could not be loaded.
                    </Text>
                    <Button 
                      mt={6} 
                      leftIcon={<FiArrowLeft />} 
                      onClick={() => navigate(-1)}
                      bg={primaryColor}
                      color="white"
                      _hover={{ bg: accentColor }}
                    >
                      Go Back
                    </Button>
                  </Flex>
                )}
              </Box>
            </Card>
          </GridItem>

          {/* Sidebar with Document Info */}
          <GridItem>
            <Card bg={cardBg} shadow="md" borderRadius="lg">
              <CardBody>
                <Heading size="md" mb={4} color={primaryColor}>Document Information</Heading>
                <Divider mb={4} borderColor={borderColor} />
                
                {isLoading ? (
                  <Flex direction="column" gap={3}>
                    {[...Array(5)].map((_, i) => (
                      <Skeleton key={i} height="24px" />
                    ))}
                  </Flex>
                ) : document ? (
                  <List spacing={3}>
                    <ListItem>
                      <ListIcon as={FiUser} color={accentColor} />
                      <Text as="span" fontWeight="bold" mr={2} color={primaryColor}>Owner:</Text>
                      <Text as="span">{document.owner || "Unknown"}</Text>
                    </ListItem>
                    <ListItem>
                      <ListIcon as={FiCalendar} color={accentColor} />
                      <Text as="span" fontWeight="bold" mr={2} color={primaryColor}>Created:</Text>
                      <Text as="span">{document.created || "Unknown"}</Text>
                    </ListItem>
                    <ListItem>
                      <ListIcon as={FiFileText} color={accentColor} />
                      <Text as="span" fontWeight="bold" mr={2} color={primaryColor}>File Type:</Text>
                      <Text as="span">{document.type || "Unknown"}</Text>
                    </ListItem>
                    <ListItem>
                      <ListIcon as={FiStar} color={accentColor} />
                      <Text as="span" fontWeight="bold" mr={2} color={primaryColor}>Rating:</Text>
                      <Badge px={2} py={1} borderRadius="full" bg={accentColor} color="white">
                        {document.rating || "Not rated"}
                      </Badge>
                    </ListItem>
                  </List>
                ) : (
                  <Text color={mutedText}>No document information available</Text>
                )}
                
                <Divider my={4} borderColor={borderColor} />
                
                <Heading size="md" mb={4} color={primaryColor}>Related Documents</Heading>
                {isLoading ? (
                  <Flex direction="column" gap={3}>
                    {[...Array(3)].map((_, i) => (
                      <Skeleton key={i} height="60px" />
                    ))}
                  </Flex>
                ) : document ? (
                  <List spacing={3}>
                    {(document.relatedDocuments || [
                      { id: 1, name: "Course Syllabus", type: "PDF" },
                      { id: 2, name: "Lecture Notes", type: "DOCX" },
                      { id: 3, name: "Assignment 1", type: "PDF" }
                    ]).map(doc => (
                      <ListItem key={doc.id} p={2} _hover={{ bg: secondaryBg }} borderRadius="md">
                        <Flex align="center">
                          <Icon as={FiFileText} mr={3} color={accentColor} />
                          <Box>
                            <Text fontWeight="medium" color={primaryColor}>{doc.name}</Text>
                            <Text fontSize="sm" color={mutedText}>{doc.type}</Text>
                          </Box>
                        </Flex>
                      </ListItem>
                    ))}
                  </List>
                ) : (
                  <Text color={mutedText}>No related documents available</Text>
                )}

                <Button 
                  mt={6} 
                  width="full" 
                  leftIcon={<FiDownload />} 
                  bg={primaryColor}
                  color="white"
                  _hover={{ bg: accentColor }}
                  onClick={handleDownload}
                  isDisabled={isLoading || !document}
                >
                  Download Document
                </Button>
              </CardBody>
            </Card>
          </GridItem>
        </Grid>
      </Box>
    </>
  );
};

export default DocumentView;
