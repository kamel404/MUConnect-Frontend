import { Button, HStack, Text } from "@chakra-ui/react";

const Pagination = ({ currentPage, totalPages, onPageChange, isLoading }) => {
  return (
    <HStack spacing={2} justify="center" mt={4}>
      <Button
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        isDisabled={isLoading || currentPage <= 1}
      >
        Prev
      </Button>
      <Text fontSize="sm">
        Page {currentPage} of {totalPages}
      </Text>
      <Button
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        isDisabled={isLoading || currentPage >= totalPages}
      >
        Next
      </Button>
    </HStack>
  );
};

export default Pagination;
