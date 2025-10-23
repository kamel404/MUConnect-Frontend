import React, { useState, useEffect } from "react";
import {
  Box,
  Text,
  Heading,
  Flex,
  Avatar,
  VStack,
  HStack,
  Badge,
  Tooltip,
  Skeleton,
  SkeletonCircle,
  SkeletonText,
  useColorModeValue,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { FiFileText, FiThumbsUp } from "react-icons/fi";
import { getTopContributors } from "../../services/resourceService";

const TopContributors = ({ limit }) => {
  const [contributors, setContributors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("brand.navy", "gray.700");
  const headingColor = useColorModeValue("brand.navy", "blue.300");
  const textColor = useColorModeValue("gray.700", "gray.300");
  const bgGradient = useColorModeValue(
    "linear-gradient(to bottom, white, blue.50)",
    "linear-gradient(to bottom, gray.800, gray.900)"
  );

  useEffect(() => {
    const fetchTopContributors = async () => {
      setIsLoading(true);
      try {
        const response = await getTopContributors(limit);
        // Handle the nested data structure where contributors are in response.data
        const contributorsData = response.data || [];
        setContributors(contributorsData);
      } catch (err) {
        console.error("Error fetching top contributors:", err);
        setError("Failed to load top contributors");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTopContributors();
  }, [limit]);

  if (error) {
    return (
      <Box
        p={4}
        bg={bgColor}
        borderRadius="md"
        boxShadow="sm"
        border="1px"
        borderColor={borderColor}
      >
        <Heading size="sm" mb={3} color="red.500">
          Error
        </Heading>
        <Text fontSize="sm">{error}</Text>
      </Box>
    );
  }

  return (
    <Box
      p={4}
      bg={bgGradient}
      borderRadius="lg"
      boxShadow="md"
      border="1px"
      borderColor={borderColor}
      position="sticky"
      top="20px"
    >
      <Heading size="md" mb={4} color={headingColor} textAlign="center">
        Top Contributors
      </Heading>

      {isLoading ? (
        <VStack spacing={4} align="stretch">
          {[...Array(limit)].map((_, i) => (
            <HStack key={i} spacing={3}>
              <SkeletonCircle size="10" />
              <Box flex="1">
                <SkeletonText noOfLines={2} spacing="2" />
              </Box>
            </HStack>
          ))}
        </VStack>
      ) : (
        <VStack spacing={3} align="stretch">
          {contributors.length === 0 ? (
            <Text fontSize="sm" textAlign="center" color={textColor}>
              No contributors found
            </Text>
          ) : (
            contributors.map((contributor, index) => (
              <Box
                key={contributor.id}
                p={3}
                borderRadius="md"
                bg={index === 0 ? "yellow.100" : index === 1 ? "gray.100" : index === 2 ? "orange.100" : "transparent"}
                _dark={{
                  bg: index === 0 ? "yellow.900" : index === 1 ? "gray.700" : index === 2 ? "orange.900" : "transparent",
                }}
                _hover={{ transform: "translateY(-2px)", transition: "transform 0.2s" }}
              >
                <HStack spacing={3}>
                  <Avatar 
                    size="sm" 
                    name={`${contributor.first_name} ${contributor.last_name}`} 
                    src={contributor.avatar_url} 
                    border={index < 3 ? "2px solid" : "none"}
                    borderColor={
                      index === 0 ? "yellow.500" : 
                      index === 1 ? "gray.400" : 
                      index === 2 ? "orange.500" : "transparent"
                    }
                  />
                  <VStack spacing={1} align="start" flex="1">
                    <HStack>
                      <Text fontWeight="medium" fontSize="sm">
                        {contributor.first_name} {contributor.last_name}
                      </Text>
                      {index < 3 && (
                        <Badge 
                          colorScheme={index === 0 ? "yellow" : index === 1 ? "gray" : "orange"}
                          variant="solid"
                          fontSize="xs"
                        >
                          #{index + 1}
                        </Badge>
                      )}
                    </HStack>
                    <Text fontSize="xs" color="gray.500" _dark={{ color: "gray.400" }}>
                      {contributor.major_name ? ` ${contributor.major_name}` : ""}
                    </Text>
                  </VStack>
                </HStack>
                <HStack mt={2} spacing={4} fontSize="xs" color="gray.500">
                  <Tooltip label="Resources created">
                    <Flex align="center">
                      <FiFileText style={{ marginRight: '4px' }} />
                      <Text>{contributor.resources_count}</Text>
                    </Flex>
                  </Tooltip>
                  <Tooltip label="Total upvotes received">
                    <Flex align="center">
                      <FiThumbsUp style={{ marginRight: '4px' }} />
                      <Text>{contributor.user_upvote_count + contributor.resource_upvote_count}</Text>
                    </Flex>
                  </Tooltip>
                  <Badge colorScheme="blue" variant="outline" ml="auto">
                    Score: {contributor.contribution_score}
                  </Badge>
                </HStack>
              </Box>
            ))
          )}
        </VStack>
      )}
    </Box>
  );
};

export default TopContributors;
