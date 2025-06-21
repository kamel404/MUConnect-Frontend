import React from "react";
import {
  Box,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Heading,
  HStack,
  Icon,
  Text,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react";
import { FiTrendingUp, FiMessageCircle } from "react-icons/fi";

/**
 * QuickInfoCard
 * Reusable sidebar card that shows last-updated date, upvote count and comment count.
 */
const QuickInfoCard = ({ lastUpdated, likes = 0, commentsCount = 0, courseName = "", courseCode = "" }) => {
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const mutedText = useColorModeValue("gray.600", "gray.400");

  const formattedDate = lastUpdated ? new Date(lastUpdated).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }) : '-';

  const hasCourseInfo = !!(courseName || courseCode);

  return (
    <Card mb={6} bg={cardBg} borderColor={borderColor} borderWidth="1px" boxShadow="sm">
      <CardHeader pb={2}>
        <Heading size="md">Quick Info</Heading>
      </CardHeader>
      <CardBody pt={0}>
        <VStack spacing={4} align="stretch">
          {hasCourseInfo && (
            <>
              <Box>
                <Text fontSize="sm" color={mutedText} mb={1}>Course</Text>
                <HStack>
                  <Text fontWeight="medium">
                    {courseCode && <>{courseCode}&nbsp;•&nbsp;</>}
                    {courseName}
                  </Text>
                </HStack>
              </Box>
              <Divider />
            </>
          )}
          {/* Last updated */}
          <Box>
            <Text fontSize="sm" color={mutedText} mb={1}>Last Updated</Text>
            <HStack>
              <Text fontWeight="medium">{formattedDate}</Text>
            </HStack>
          </Box>

          <Divider />

          {/* Upvotes */}
          <Box>
            <Text fontSize="sm" color={mutedText} mb={1}>Upvotes</Text>
            <HStack>
              <Icon as={FiTrendingUp} color={mutedText} boxSize={4} />
              <Text fontWeight="medium">{likes}</Text>
            </HStack>
          </Box>

          <Divider />

          {/* Comments */}
          <Box>
            <Text fontSize="sm" color={mutedText} mb={1}>Comments</Text>
            <HStack>
              <Icon as={FiMessageCircle} color={mutedText} boxSize={4} />
              <Text fontWeight="medium">{commentsCount}</Text>
            </HStack>
          </Box>
        </VStack>
      </CardBody>
    </Card>
  );
};

export default QuickInfoCard;
