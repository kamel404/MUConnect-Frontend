import { CardFooter, Flex, Button, IconButton, Menu, MenuButton, MenuList, MenuItem, Portal, useColorModeValue } from "@chakra-ui/react";
import { FiTrendingUp, FiMessageSquare, FiMoreHorizontal, FiShare, FiEdit, FiTrash } from "react-icons/fi";

const PostActions = ({ post }) => {
  const mutedText = useColorModeValue("gray.500", "gray.400");
  const hoverBg = useColorModeValue("gray.100", "gray.700");

  return (
    <CardFooter>
      <Flex gap={4} color={mutedText} justify="space-between" width="100%">
        <Flex gap={4}>
          <Button variant="ghost" leftIcon={<FiTrendingUp />} size="sm">
            {post.likes}
          </Button>
          <Button variant="ghost" leftIcon={<FiMessageSquare />} size="sm">
            {post.comments}
          </Button>
        </Flex>
        <Menu placement="bottom-end">
          <MenuButton 
            as={IconButton} 
            icon={<FiMoreHorizontal />} 
            variant="ghost" 
            size="sm"
            aria-label="More options"
            borderRadius="full"
            _hover={{ bg: hoverBg }}
          />
          <Portal>
            <MenuList minW="150px" shadow="lg">
              <MenuItem icon={<FiShare />} fontSize="sm">Share</MenuItem>
              <MenuItem icon={<FiEdit />} fontSize="sm">Edit</MenuItem>
              <MenuItem icon={<FiTrash />} fontSize="sm" color="red.500">Delete</MenuItem>
            </MenuList>
          </Portal>
        </Menu>
      </Flex>
    </CardFooter>
  );
};

export default PostActions;
