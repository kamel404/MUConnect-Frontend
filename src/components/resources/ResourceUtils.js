import { FiBookOpen, FiVideo, FiLink } from "react-icons/fi";


export const getTypeIcon = (type) => {
  switch (type) {
    case "PDF": return FiBookOpen;
    case "Video": return FiVideo;
    default: return FiBookOpen;
  }
};



/**
 * Personalizes resources based on user's faculty and major
 * @param {Array} resources - The resources to personalize
 * @param {Boolean} applyPersonalization - Whether to apply personalization or not
 * @returns {Array} - The personalized resources
 */
export const personalizeResources = (resources, applyPersonalization = true) => {
  // If personalization is disabled, return original resources
  if (!applyPersonalization) return resources;
  
  // Get user preferences
  const { faculty, major } = getUserPreferences();
  
  // If no preferences are set, return original resources
  if (!faculty && !major) return resources;
  
  // Create a copy of resources to avoid modifying the original
  const personalizedResources = [...resources];
  
  // Add relevance score to each resource based on faculty and major
  return personalizedResources
    .map(resource => {
      let relevanceScore = 0;
      
      // Check faculty relevance in tags, category, and description
      if (faculty) {
        // Check if faculty appears in tags
        if (resource.tags && resource.tags.some(tag => 
          tag.toLowerCase().includes(faculty.toLowerCase()))) {
          relevanceScore += 3;
        }
        
        // Check if faculty appears in category
        if (resource.category && 
          resource.category.toLowerCase().includes(faculty.toLowerCase())) {
          relevanceScore += 2;
        }
        
        // Check if faculty appears in description
        if (resource.description && 
          resource.description.toLowerCase().includes(faculty.toLowerCase())) {
          relevanceScore += 1;
        }
      }
      
      // Check major relevance in tags, category, and description
      if (major) {
        // Normalize major string for comparison (replace underscores with spaces)
        const normalizedMajor = major.replace(/_/g, ' ');
        
        // Check if major appears in tags
        if (resource.tags && resource.tags.some(tag => 
          tag.toLowerCase().includes(normalizedMajor.toLowerCase()))) {
          relevanceScore += 5;
        }
        
        // Check if major appears in category
        if (resource.category && 
          resource.category.toLowerCase().includes(normalizedMajor.toLowerCase())) {
          relevanceScore += 4;
        }
        
        // Check if major appears in description
        if (resource.description && 
          resource.description.toLowerCase().includes(normalizedMajor.toLowerCase())) {
          relevanceScore += 2;
        }
      }
      
      // Add relevance score to resource
      return { ...resource, relevanceScore };
    })
    // Sort by relevance score (highest first)
    .sort((a, b) => b.relevanceScore - a.relevanceScore);
};

/**
 * Returns highly relevant resources based on a user's faculty and major
 * @param {Array} resources - All available resources
 * @returns {Array} - Filtered array of resources relevant to the user
 */
export const getRecommendedResources = (resources) => {
  const personalizedResults = personalizeResources(resources);
  // Return top resources with some relevance
  return personalizedResults.filter(resource => resource.relevanceScore > 0);
};
