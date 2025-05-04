import React from "react";
import {
  Flex,
  HStack,
  Button,
  Tag,
  TagLabel,
  TagCloseButton,
  Box,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Text,
  Icon,
  Wrap,
  WrapItem,
  useColorModeValue,
  Badge
} from "@chakra-ui/react";
import { FiChevronDown, FiTag, FiFilter } from "react-icons/fi";
import { resourceTypes } from "./ResourceData";
import { getTypeIcon } from "./ResourceUtils";

/**
 * Component for handling resource filtering with a cleaner UI that's always visible
 */
const ResourceFilters = ({
  typeFilter,
  setTypeFilter,
  searchQuery,
  cardBg,
  mutedText,
  accentColor
}) => {
  // Theme colors
  const tagBg = useColorModeValue("blue.50", "blue.900");
  const activeBg = useColorModeValue("blue.100", "blue.800");
  const hoverBg = useColorModeValue("gray.100", "gray.700");
  
  // Helper function to check if any filters are applied
  const isFiltering = typeFilter !== "All" || searchQuery !== "";
  
  // Handle clearing all filters
  const clearAllFilters = () => {
    setTypeFilter("All");
  };
  
  return (
    <Flex direction="column" w="full" gap={3}>
      <Flex justify="space-between" align="center" w="full" mb={2}>
        <HStack>
          <Icon as={FiFilter} />
          <Text fontWeight="medium">Filters</Text>
          {isFiltering && (
            <Badge ml={1} colorScheme="blue" borderRadius="full" px={2}>
              {(typeFilter !== "All" ? 1 : 0)}
            </Badge>
          )}
        </HStack>
        
        {isFiltering && (
          <Button 
            size="xs" 
            variant="ghost" 
            colorScheme="blue" 
            onClick={clearAllFilters}
          >
            Clear All
          </Button>
        )}
      </Flex>
      
      {/* Type filters */}
      <Box mb={2}>
        <Text fontSize="sm" fontWeight="medium" mb={2} color={mutedText}>Resource Type</Text>
        <Wrap spacing={2}>
          <WrapItem>
            <Button 
              size="sm" 
              variant={typeFilter === "All" ? "solid" : "outline"}
              colorScheme={typeFilter === "All" ? "blue" : "gray"}
              onClick={() => setTypeFilter("All")}
              mb={1}
            >
              All Types
            </Button>
          </WrapItem>
          {resourceTypes.filter(type => type !== "All").map(type => (
            <WrapItem key={type}>
              <Button 
                size="sm" 
                variant={typeFilter === type ? "solid" : "outline"}
                colorScheme={typeFilter === type ? "blue" : "gray"}
                onClick={() => setTypeFilter(type)}
                mb={1}
                leftIcon={<Icon as={getTypeIcon(type)} />}
              >
                {type}
              </Button>
            </WrapItem>
          ))}
        </Wrap>
      </Box>
      
      {/* Active filter tags for quick reference */}
      {isFiltering && (
        <Box mt={3}>
          <Wrap spacing={2}>
            {typeFilter !== "All" && (
              <WrapItem>
                <Tag size="md" borderRadius="full" variant="subtle" colorScheme="blue">
                  <TagLabel>
                    <HStack spacing={1}>
                      <Text fontSize="xs">Type:</Text>
                      <Text fontSize="sm" fontWeight="medium">{typeFilter}</Text>
                    </HStack>
                  </TagLabel>
                  <TagCloseButton onClick={() => setTypeFilter("All")} />
                </Tag>
              </WrapItem>
            )}
            {searchQuery && (
              <WrapItem>
                <Tag size="md" borderRadius="full" variant="subtle" colorScheme="purple">
                  <TagLabel>
                    <HStack spacing={1}>
                      <Text fontSize="xs">Search:</Text>
                      <Text fontSize="sm" fontWeight="medium">"{searchQuery}"</Text>
                    </HStack>
                  </TagLabel>
                </Tag>
              </WrapItem>
            )}
          </Wrap>
        </Box>
      )}
    </Flex>
  );
};

export default ResourceFilters;
