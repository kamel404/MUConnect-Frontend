import {
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Flex,
    Box,
    Heading,
    Text,
    Avatar,
    Stack,
    Button,
    IconButton,
    Badge,
    Image,
    Icon,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    Portal,
    SimpleGrid,
    AspectRatio,
    useColorModeValue,
  } from "@chakra-ui/react";
  import {
    FiTrendingUp,
    FiMessageSquare,
    FiMoreHorizontal,
    FiShare,
    FiEdit,
    FiTrash,
    FiCalendar,
    FiUsers,
    FiDownload,
    FiMapPin,
    FiVideo,
    FiFileText,
  } from "react-icons/fi";
  
  // Common Post Header component
  const PostHeader = ({ post, textColor, mutedText }) => (
    <CardHeader>
      <Flex gap={3} align="center">
        <Avatar src={post.avatar} />
        <Box>
          <Heading size="sm" color={textColor}>
            {post.user}
          </Heading>
          <Text fontSize="sm" color={mutedText}>
            {post.time} {post.course && `• ${post.course}`}
          </Text>
        </Box>
      </Flex>
    </CardHeader>
  );
  
  // Common Post Actions component
  const PostActions = ({ post, mutedText, primaryColor, highlightBg }) => (
    <CardFooter>
      <Flex gap={4} color={mutedText} justify="space-between" width="100%">
        <Flex gap={4}>
          <Button
            variant="ghost"
            leftIcon={<FiTrendingUp />}
            size="sm"
            _hover={{ bg: highlightBg, color: primaryColor }}
          >
            {post.likes}
          </Button>
          <Button
            variant="ghost"
            leftIcon={<FiMessageSquare />}
            size="sm"
            _hover={{ bg: highlightBg, color: primaryColor }}
          >
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
            _hover={{ bg: highlightBg }}
          />
          <Portal>
            <MenuList minW="150px" shadow="lg">
              <MenuItem icon={<FiShare />} fontSize="sm">
                Share
              </MenuItem>
              <MenuItem icon={<FiEdit />} fontSize="sm">
                Edit
              </MenuItem>
              <MenuItem icon={<FiTrash />} fontSize="sm" color="red.500">
                Delete
              </MenuItem>
            </MenuList>
          </Portal>
        </Menu>
      </Flex>
    </CardFooter>
  );
  
  // Component to render media attachments (images and videos)
  const MediaContent = ({ post, iconColors }) => {
    if (post.images && post.images.length > 0) {
      return (
        <SimpleGrid
          columns={post.images.length === 1 ? 1 : { base: 2, md: 3 }}
          spacing={2}
        >
          {post.images.map((image) => (
            <Box key={image.id} borderRadius="md" overflow="hidden">
              <Image
                src={image.url}
                alt={image.name}
                borderRadius="md"
                objectFit="cover"
                width="100%"
                height="100px"
              />
            </Box>
          ))}
        </SimpleGrid>
      );
    } else if (post.videos && post.videos.length > 0) {
      return (
        <SimpleGrid
          columns={post.videos.length === 1 ? 1 : { base: 1, md: 2 }}
          spacing={2}
        >
          {post.videos.map((video) => (
            <Box key={video.id} borderRadius="md" overflow="hidden">
              <AspectRatio ratio={16 / 9}>
                <Box
                  as="video"
                  src={video.url}
                  controls
                  style={{ borderRadius: "0.5rem" }}
                />
              </AspectRatio>
            </Box>
          ))}
        </SimpleGrid>
      );
    }
    return null;
  };
  
  // Component to render document attachments
  const DocumentContent = ({ post }) => {
    if (post.documents && post.documents.length > 0) {
      return (
        <Stack spacing={2} mt={2}>
          {post.documents.map((doc) => (
            <Flex
              key={doc.id}
              p={2}
              borderRadius="md"
              bg="blackAlpha.50"
              align="center"
              justify="space-between"
            >
              <Flex align="center">
                <Icon as={FiFileText} mr={2} color="blue.500" />
                <Box>
                  <Text fontSize="sm" noOfLines={1}>
                    {doc.name}
                  </Text>
                </Box>
              </Flex>
              <Button
                size="sm"
                colorScheme="blue"
                variant="outline"
                onClick={() => window.open(doc.url, "_blank")}
              >
                View
              </Button>
            </Flex>
          ))}
        </Stack>
      );
    }
    return null;
  };
  
  const PostCard = ({
    post,
    cardBg,
    textColor,
    mutedText,
    accentColor,
    primaryColor,
  }) => {
    const highlightBg = useColorModeValue(
      "rgba(242, 217, 68, 0.1)",
      "rgba(217, 194, 38, 0.15)"
    );
    const iconColors = useColorModeValue("brand.gold", "brand.goldDark");
  
    // Define border color for each post type
    const postTypeColors = {
      "Study Group": "brand.navy",
      "Course Material": "brand.navy",
      Event: "brand.navy",
      Media: "brand.navy",
    };
  
    // Main body content based on post type
    let bodyContent;
    switch (post.type) {
      case "Study Group":
        bodyContent = (
          <Stack spacing={4}>
            <Text fontWeight="600" color={textColor}>
              {post.content}
            </Text>
            <Flex align="center" gap={2}>
              <Icon as={FiCalendar} color={iconColors} />
              <Text fontSize="sm">
                {new Date(post.date).toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Text>
            </Flex>
            <Badge width="fit-content" bg={accentColor} color={primaryColor} px={2} py={1}>
              <Flex align="center" gap={2}>
                <FiUsers /> {post.members} Members
              </Flex>
            </Badge>
            {/* Render any media attachments */}
            {post.images || post.videos ? (
              <MediaContent post={post} iconColors={iconColors} />
            ) : null}
          </Stack>
        );
        break;
      case "Course Material":
        bodyContent = (
          <Stack spacing={4}>
            <Text fontWeight="600" color={textColor}>
              {post.content}
            </Text>
            {/* Display image if exists */}
            {post.images || post.videos ? (
              <MediaContent post={post} iconColors={iconColors} />
            ) : (
              <Box borderRadius="lg" overflow="hidden" position="relative">
                <Image src={post.file} alt="Course material" />
                <Box
                  position="absolute"
                  bottom={0}
                  left={0}
                  right={0}
                  bg="linear-gradient(transparent, rgba(0,0,0,0.7))"
                  p={4}
                >
                  <Button
                    leftIcon={<FiDownload />}
                    bg={accentColor}
                    color={primaryColor}
                    size="sm"
                    variant="solid"
                    _hover={{
                      bg: useColorModeValue("brand.gold", "brand.goldDark"),
                      opacity: 0.9,
                    }}
                  >
                    Download Notes
                  </Button>
                </Box>
              </Box>
            )}
            {/* Render document attachments if available */}
            {post.documents ? <DocumentContent post={post} /> : null}
          </Stack>
        );
        break;
      case "Event":
        bodyContent = (
          <Stack spacing={4}>
            <Text fontWeight="600" color={textColor}>
              {post.content}
            </Text>
            <Flex direction="column" gap={2}>
              <Flex align="center" gap={2}>
                <Icon as={FiCalendar} color={iconColors} />
                <Text fontSize="sm">
                  {new Date(post.date).toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Text>
              </Flex>
              <Flex align="center" gap={2}>
                <Icon as={FiMapPin} color={iconColors} />
                <Text fontSize="sm">{post.location}</Text>
              </Flex>
            </Flex>
            <Button
              bg={accentColor}
              color={primaryColor}
              width="fit-content"
              _hover={{
                bg: useColorModeValue("brand.gold", "brand.goldDark"),
                opacity: 0.9,
              }}
            >
              RSVP Now
            </Button>
            {post.images || post.videos ? (
              <MediaContent post={post} iconColors={iconColors} />
            ) : null}
          </Stack>
        );
        break;
      case "Media":
        bodyContent = (
          <Stack spacing={4}>
            <Text fontWeight="600" color={textColor}>
              {post.content}
            </Text>
            {post.images || post.videos ? (
              <MediaContent post={post} iconColors={iconColors} />
            ) : null}
          </Stack>
        );
        break;
      default:
        bodyContent = (
          <CardBody>
            <Text color={textColor}>{post.content}</Text>
          </CardBody>
        );
        break;
    }
  
    return (
      <Card
        bg={cardBg}
        borderLeft="4px"
        borderColor={postTypeColors[post.type] || "transparent"}
        mb={6}
      >
        <PostHeader post={post} textColor={textColor} mutedText={mutedText} />
        <CardBody>{bodyContent}</CardBody>
        <PostActions
          post={post}
          mutedText={mutedText}
          primaryColor={primaryColor}
          highlightBg={highlightBg}
        />
      </Card>
    );
  };
  
  export default PostCard;
  