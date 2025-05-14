import React from "react";
import {
  FormControl,
  FormLabel,
  Input,
  Select,
  Box,
  Icon,
  useColorModeValue
} from "@chakra-ui/react";
import {
  FiCalendar,
  FiBook,
  FiMapPin
} from "react-icons/fi";

const TypeSpecificFields = ({
  postType,
  course,
  setCourse,
  eventDate,
  setEventDate,
  location,
  setLocation,
  studyDate,
  setStudyDate
}) => {
  const accentColor = useColorModeValue("blue.500", "blue.200");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  if (!postType) return null;

  return (
    <>
      {postType === "Study Group" && (
        <FormControl>
          <FormLabel display="flex" alignItems="center" gap={2}>
            <Icon as={FiCalendar} /> Study Date
          </FormLabel>
          <Input
            type="datetime-local"
            value={studyDate}
            onChange={(e) => setStudyDate(e.target.value)}
            borderRadius="lg"
            borderColor={borderColor}
            _focus={{
              borderColor: accentColor,
              boxShadow: `0 0 0 1px ${accentColor}`,
            }}
          />
        </FormControl>
      )}

      {postType === "Course Material" && (
        <FormControl>
          <FormLabel display="flex" alignItems="center" gap={2}>
            <Icon as={FiBook} /> Related Course
          </FormLabel>
          <Select
            placeholder="Select course"
            value={course}
            onChange={(e) => setCourse(e.target.value)}
            borderRadius="lg"
            borderColor={borderColor}
            _focus={{
              borderColor: accentColor,
              boxShadow: `0 0 0 1px ${accentColor}`,
            }}
          >
            <option value="CS 101">CS 101</option>
            <option value="MATH 202">MATH 202</option>
            <option value="PHYS 301">PHYS 301</option>
          </Select>
        </FormControl>
      )}

      {postType === "Event" && (
        <Box>
          <FormControl mb={3}>
            <FormLabel display="flex" alignItems="center" gap={2}>
              <Icon as={FiCalendar} /> Event Date
            </FormLabel>
            <Input
              type="datetime-local"
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              borderRadius="lg"
              borderColor={borderColor}
              _focus={{
                borderColor: accentColor,
                boxShadow: `0 0 0 1px ${accentColor}`,
              }}
            />
          </FormControl>
          <FormControl>
            <FormLabel display="flex" alignItems="center" gap={2}>
              <Icon as={FiMapPin} /> Location
            </FormLabel>
            <Input
              placeholder="Enter location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              borderRadius="lg"
              borderColor={borderColor}
              _focus={{
                borderColor: accentColor,
                boxShadow: `0 0 0 1px ${accentColor}`,
              }}
            />
          </FormControl>
        </Box>
      )}
    </>
  );
};

export default TypeSpecificFields;
