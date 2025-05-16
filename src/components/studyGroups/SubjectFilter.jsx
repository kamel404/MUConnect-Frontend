import { Wrap, WrapItem, Tag, TagLabel } from "@chakra-ui/react";

const SubjectFilter = ({ subjects, selectedSubject, onSelectSubject }) => {
  return (
    <Wrap spacing={3} mb={6}>
      {subjects.map((subject) => (
        <WrapItem key={subject}>
          <Tag 
            size="md" 
            variant={subject === selectedSubject ? "solid" : "subtle"} 
            colorScheme={subject === selectedSubject ? "blue" : "gray"}
            borderRadius="full"
            cursor="pointer"
            onClick={() => onSelectSubject(subject)}
            _hover={{ opacity: 0.8 }}
          >
            <TagLabel>{subject}</TagLabel>
          </Tag>
        </WrapItem>
      ))}
    </Wrap>
  );
};

export default SubjectFilter;
