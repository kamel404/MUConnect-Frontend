import { Select, HStack, Text } from "@chakra-ui/react";

const sortOptions = [
  { value: "created_at", label: "Newest" },
  { value: "updated_at", label: "Recently Updated" },
  { value: "applications_count", label: "Most Popular" },
];

const orderOptions = [
  { value: "desc", label: "Descending" },
  { value: "asc", label: "Ascending" },
];

export default function SortSelect({ sortBy, sortOrder, onSortByChange, onSortOrderChange, isLoading }) {
  return (
    <HStack spacing={2}>
      <Text fontSize="sm" color="gray.600">Sort by:</Text>
      <Select
        size="sm"
        value={sortBy}
        onChange={e => onSortByChange(e.target.value)}
        isDisabled={isLoading}
        width="auto"
      >
        {sortOptions.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </Select>
      <Select
        size="sm"
        value={sortOrder}
        onChange={e => onSortOrderChange(e.target.value)}
        isDisabled={isLoading}
        width="auto"
      >
        {orderOptions.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </Select>
    </HStack>
  );
}
