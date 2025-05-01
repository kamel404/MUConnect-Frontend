import { FiBookOpen, FiVideo, FiLink } from "react-icons/fi";

/**
 * Returns the appropriate icon component for a resource type
 * @param {string} type - Resource type (PDF, Video, Web)
 * @returns Icon component from react-icons
 */
export const getTypeIcon = (type) => {
  switch (type) {
    case "PDF": return FiBookOpen;
    case "Video": return FiVideo;
    case "Web": return FiLink;
    default: return FiBookOpen;
  }
};

/**
 * Filters resources based on type, category and search query
 * @param {Array} resources - Array of resource objects
 * @param {string} typeFilter - Selected type filter
 * @param {string} categoryFilter - Selected category filter
 * @param {string} searchQuery - Search text
 * @returns Filtered array of resources
 */
export const filterResources = (resources, typeFilter, categoryFilter, searchQuery) => {
  return resources.filter(resource => {
    const matchesType = typeFilter === "All" || resource.type === typeFilter;
    const matchesCategory = categoryFilter === "All" || resource.category === categoryFilter;
    const matchesSearch = 
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      resource.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesType && matchesCategory && matchesSearch;
  });
};
