import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Heading,
  Text,
  Flex,
  Stack,
  Tag,
  HStack,
  Button,
  Divider,
  useColorModeValue,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  useToast
} from "@chakra-ui/react";
import { FiUsers, FiClock, FiMapPin, FiPlus, FiMoreHorizontal, FiEdit, FiTrash2, FiShare2 } from "react-icons/fi";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const MotionCard = motion(Card);

const StudyGroupCard = ({ group, onJoinLeave, onEdit, onDelete, currentUser }) => {
  const cardBg = useColorModeValue("white", "gray.700");
  const textColor = useColorModeValue("gray.800", "white");
  const mutedText = useColorModeValue("gray.500", "gray.400");
  const hoverBg = useColorModeValue("gray.100", "gray.600");
  const dividerColor = useColorModeValue("gray.200", "gray.700");
  const toast = useToast();

  // Check if current user is the creator
  const isCreator = currentUser && group.creator && currentUser.id === group.creator.id;

  const handleShareGroup = () => {
    const shareUrl = `${window.location.origin}/study-groups/${group.id}`;
    
    if (navigator.share) {
      navigator.share({
        title: `Join "${group.name}" Study Group`,
        text: `Join our study group for ${group.course}`,
        url: shareUrl,
      }).catch(() => {
        // Fallback to clipboard
        navigator.clipboard.writeText(shareUrl);
        toast({
          title: "Link copied to clipboard",
          status: "success",
          duration: 2000,
        });
      });
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(shareUrl);
      toast({
        title: "Group link copied to clipboard",
        status: "success",
        duration: 2000,
      });
    }
  };

  return (
    <MotionCard
      bg={cardBg}
      boxShadow="md"
      borderRadius="lg"
      overflow="hidden"
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <CardHeader>
        <Flex justify="space-between" align="center">
          <Heading size="md" color={textColor}>{group.name || "Untitled Group"}</Heading>
          <Tag colorScheme="blue">{group.course || "Unknown Course"}</Tag>
        </Flex>
      </CardHeader>
      
      <CardBody>
        <Text color={textColor} mb={3} noOfLines={2}>
          {group.description}
        </Text>
        
        <HStack spacing={2} mb={4} flexWrap="wrap">
          {(group.tags || []).map((tag, index) => (
            <Tag key={index} size="sm" colorScheme="gray" borderRadius="full">
              {tag}
            </Tag>
          ))}
        </HStack>
        
        <Divider my={4} borderColor={dividerColor} />
        
        <Stack spacing={3}>
          <Flex align="center" color={mutedText}>
            <FiUsers style={{ marginRight: "8px" }} />
            <Text>{group.members || 0} / {group.capacity || 15} Members</Text>
          </Flex>
          <Flex align="center" color={mutedText}>
            <FiClock style={{ marginRight: "8px" }} />
            <Text>Session: {group.formattedTime || "TBD"}</Text>
          </Flex>
          <Flex align="center" color={mutedText}>
            <FiMapPin style={{ marginRight: "8px" }} />
            <Text noOfLines={1}>{group.location || "TBD"}</Text>
          </Flex>
        </Stack>
      </CardBody>
      
      <CardFooter 
        pt={0}
        borderTop="1px solid"
        borderColor={dividerColor}
      >
        <Flex justify="space-between" align="center" w="full">
          {/* Options Menu */}
          <Menu>
            <MenuButton
              as={IconButton}
              aria-label="Options"
              icon={<FiMoreHorizontal />}
              variant="ghost"
              size="sm"
              borderRadius="full"
              _hover={{ bg: hoverBg }}
            />
            <MenuList>
              {isCreator && (
                <>
                  <MenuItem icon={<FiEdit />} onClick={() => onEdit && onEdit(group)}>
                    Edit Group
                  </MenuItem>
                  <MenuItem 
                    icon={<FiTrash2 />} 
                    onClick={() => onDelete && onDelete(group)}
                    color="red.500"
                    _hover={{ bg: "red.50" }}
                  >
                    Delete Group
                  </MenuItem>
                </>
              )}
              <MenuItem icon={<FiShare2 />} onClick={handleShareGroup}>
                Share Group Link
              </MenuItem>
            </MenuList>
          </Menu>
          
          <Button 
            colorScheme={group.isJoined ? "red" : "blue"}
            variant={group.isJoined ? "outline" : "solid"}
            size="sm"
            borderRadius="full"
            onClick={() => onJoinLeave(group.id)}
            leftIcon={group.isJoined ? undefined : <FiPlus />}
          >
            {group.isJoined ? "Leave Group" : "Join Group"}
          </Button>
        </Flex>
      </CardFooter>
    </MotionCard>
  );
};

export default StudyGroupCard;
