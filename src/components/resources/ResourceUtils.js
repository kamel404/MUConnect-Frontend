import { FiBookOpen, FiVideo, FiLink } from "react-icons/fi";

export const getTypeIcon = (type) => {
  switch (type) {
    case "PDF": return FiBookOpen;
    case "Video": return FiVideo;
    case "Web": return FiLink;
    default: return FiBookOpen;
  }
};

export const filterResources = (resources, typeFilter, searchQuery) => {
  return resources.filter(resource => {
    const matchesType = typeFilter === "All" || resource.type === typeFilter;
    const matchesSearch = 
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      resource.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesType && matchesSearch;
  });
};
