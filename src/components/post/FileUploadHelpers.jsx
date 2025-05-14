import React from "react";

// Convert file to base64 for more reliable storage
export const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
};

// Format file size for documents
export const formatFileSize = (bytes) => {
  if (bytes < 1024) return bytes + " B";
  else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
  else return (bytes / 1048576).toFixed(1) + " MB";
};

// Helper function to sort attachments for a social media style grid
export const sortAttachmentsByType = (attachments) => {
  // Make sure attachment properties exist and are arrays
  const images = attachments.images || [];
  const videos = attachments.videos || [];
  const documents = attachments.documents || [];

  // Combine all attachment types for a unified gallery
  const allItems = [
    ...images.map(item => ({ ...item, mediaType: 'image' })),
    ...videos.map(item => ({ ...item, mediaType: 'video' })),
    ...documents.map(item => ({ ...item, mediaType: 'document' }))
  ];

  // Sort by creation time (using ID since it contains timestamp)
  return allItems.sort((a, b) => {
    if (!a.id || !b.id) return 0;
    const aTime = a.id.split('-')[1] || 0;
    const bTime = b.id.split('-')[1] || 0;
    return bTime - aTime;
  });
};
