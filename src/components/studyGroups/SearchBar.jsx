import { InputGroup, InputLeftElement, Input, useColorModeValue } from "@chakra-ui/react";
import { FiSearch } from "react-icons/fi";

const SearchBar = ({ searchTerm, onSearchChange }) => {
  const mutedText = useColorModeValue("gray.500", "gray.400");
  const accentColor = useColorModeValue("blue.500", "blue.300");

  return (
    <InputGroup maxW="250px">
      <InputLeftElement pointerEvents="none">
        <FiSearch color={mutedText} />
      </InputLeftElement>
      <Input
        placeholder="Search groups..."
        size="sm"
        borderRadius="full"
        value={searchTerm}
        onChange={onSearchChange}
        _focus={{
          boxShadow: `0 0 0 2px ${accentColor}`,
        }}
      />
    </InputGroup>
  );
};

export default SearchBar;
