import React, { createContext, useContext, useState, useEffect } from 'react';

const ResourceCacheContext = createContext();

export const useResourceCache = () => useContext(ResourceCacheContext);

export const ResourceCacheProvider = ({ children }) => {
  // Initialize cache from localStorage if available
  const [resourceCache, setResourceCache] = useState(() => {
    const savedCache = localStorage.getItem('resourceCache');
    return savedCache ? JSON.parse(savedCache) : {};
  });

  // Cache expiration time in milliseconds (5 minutes)
  const CACHE_EXPIRATION = 5 * 60 * 1000;

  // Save cache to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('resourceCache', JSON.stringify(resourceCache));
  }, [resourceCache]);

  // Get resources from cache or fetch them
  const getCachedResources = (cacheKey) => {
    const cachedData = resourceCache[cacheKey];
    
    // Check if cache exists and is still valid
    if (cachedData && (Date.now() - cachedData.timestamp) < CACHE_EXPIRATION) {
      return cachedData.data;
    }
    
    return null;
  };

  // Store resources in cache
  const cacheResources = (cacheKey, data) => {
    setResourceCache(prevCache => ({
      ...prevCache,
      [cacheKey]: {
        data,
        timestamp: Date.now()
      }
    }));
  };

  // Clear the entire cache
  const clearCache = () => {
    setResourceCache({});
    localStorage.removeItem('resourceCache');
  };

  // Clear specific cache entry
  const clearCacheEntry = (cacheKey) => {
    setResourceCache(prevCache => {
      const newCache = { ...prevCache };
      delete newCache[cacheKey];
      return newCache;
    });
  };

  return (
    <ResourceCacheContext.Provider value={{ 
      getCachedResources, 
      cacheResources, 
      clearCache,
      clearCacheEntry
    }}>
      {children}
    </ResourceCacheContext.Provider>
  );
};

export default ResourceCacheContext;
