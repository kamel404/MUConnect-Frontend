import React from "react";
import {
  Flex,
  Button,
  InputGroup,
  InputLeftElement,
  Input,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Text,
  Icon
} from "@chakra-ui/react";
import { FiSearch, FiChevronDown } from "react-icons/fi";
import { resourceTypes, categories } from "./ResourceData";
import { getTypeIcon } from "./ResourceUtils";

/**
 * Component for handling resource filtering
 */
const ResourceFilters = ({
  typeFilter,
  setTypeFilter,
  categoryFilter,
  setCategoryFilter,
  searchQuery,
  setSearchQuery,
  cardBg,
  mutedText,
  accentColor
}) => {
  return (
    <Flex mb={8} gap={4} direction={{ base: "column", md: "row" }} align={{ base: "stretch", md: "center" }}>
      <Menu>
        <MenuButton as={Button} rightIcon={<FiChevronDown />} variant="outline" minW="120px">
          <Flex align="center">
            <Icon as={getTypeIcon(typeFilter === "All" ? "PDF" : typeFilter)} mr={2} />
            <Text>{typeFilter}</Text>
          </Flex>
        </MenuButton>
        <MenuList>
          {resourceTypes.map(type => (
            <MenuItem 
              key={type} 
              onClick={() => setTypeFilter(type)} 
              fontWeight={typeFilter === type ? "bold" : "normal"}
            >
              <Icon as={getTypeIcon(type)} mr={2} />
              {type}
            </MenuItem>
          ))}
        </MenuList>
      </Menu>

      <Menu>
        <MenuButton as={Button} rightIcon={<FiChevronDown />} variant="outline" minW="140px">
          <Text>{categoryFilter}</Text>
        </MenuButton>
        <MenuList>
          {categories.map(cat => (
            <MenuItem 
              key={cat} 
              onClick={() => setCategoryFilter(cat)} 
              fontWeight={categoryFilter === cat ? "bold" : "normal"}
            >
              {cat}
            </MenuItem>
          ))}
        </MenuList>
      </Menu>

      <InputGroup maxW="350px">
        <InputLeftElement pointerEvents="none">
          <FiSearch color={mutedText} />
        </InputLeftElement>
        <Input
          placeholder="Search resources..."
          borderRadius="full"
          bg={cardBg}
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          _focus={{ boxShadow: `0 0 0 2px ${accentColor}` }}
        />
      </InputGroup>
    </Flex>
  );
};

export default ResourceFilters;
