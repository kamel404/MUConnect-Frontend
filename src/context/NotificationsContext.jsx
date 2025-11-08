import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { 
  getNotifications, 
  markNotificationAsRead, 
  deleteNotification as deleteNotificationApi, 
  markAllNotificationsAsRead 
} from "../services/notificationService";

const NotificationsContext = createContext();

export const NotificationsProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  // Helper function to map notification data
  const mapNotification = useCallback((n) => ({
    id: n.id,
    user: n.sender_name || 'System',
    avatar: n.sender_avatar,
    content: n.data?.message || '',
    isRead: !!n.read,
    time: formatTime(n.created_at),
    url: n.url || n.data?.url,
    created_at: n.created_at,
    type: n.type,
    reason: n.data?.reason,
  }), []);

  // Helper: Format time as relative (e.g., '2h ago') or date
  const formatTime = useCallback((isoString) => {
    if (!isoString) return '';
    const now = new Date();
    const date = new Date(isoString);
    const diff = (now - date) / 1000; // seconds
    if (diff < 60) return `${Math.floor(diff)}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
    return date.toLocaleDateString();
  }, []);

  // Fetch notifications from API
  const fetchNotifications = useCallback(async (page = 1, append = false) => {
    try {
      if (!append) {
        setLoading(true);
      }
      setError(null);

      const data = await getNotifications(page);
      
      let allNotifications = [];
      if (Array.isArray(data)) {
        allNotifications = data;
      } else if (Array.isArray(data.data)) {
        // Laravel pagination style: { data: [...], current_page: 1, ... }
        allNotifications = data.data;
        setCurrentPage(data.current_page || page);
        setTotalPages(data.last_page || 1);
        setHasMore((data.current_page || page) < (data.last_page || 1));
      } else if (Array.isArray(data.notifications)) {
        // Fallback for alternate structure
        allNotifications = data.notifications;
      }

      const mappedNotifications = allNotifications.map(mapNotification);

      if (append && page > 1) {
        setNotifications(prev => [...prev, ...mappedNotifications]);
      } else {
        setNotifications(mappedNotifications);
      }

      // Calculate unread count
      const unreadNotifications = mappedNotifications.filter(n => !n.isRead);
      if (!append) {
        setUnreadCount(unreadNotifications.length);
      }

    } catch (err) {
      setError("Failed to load notifications");
      console.error("Error fetching notifications:", err);
    } finally {
      setLoading(false);
    }
  }, [mapNotification]);

  // Get unread notifications (for popover - latest 3)
  const getUnreadNotifications = useCallback(() => {
    return notifications
      .filter(n => !n.isRead)
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, 3);
  }, [notifications]);

  // Mark notification as read
  const markAsRead = useCallback(async (id) => {
    // Optimistic update
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, isRead: true } : notif
      )
    );

    // Update unread count
    const newCount = Math.max(0, unreadCount - 1);
    setUnreadCount(newCount);

    try {
      await markNotificationAsRead(id);
    } catch (err) {
      console.error("Error marking notification as read:", err);
      // Revert optimistic update
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === id ? { ...notif, isRead: false } : notif
        )
      );
      setUnreadCount(prev => prev + 1);
    }
  }, [unreadCount]);

  // Mark all notifications as read
  const markAllAsRead = useCallback(async () => {
    const unreadNotifications = notifications.filter(n => !n.isRead);
    
    // Optimistic update
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, isRead: true }))
    );
    setUnreadCount(0);

    try {
      await markAllNotificationsAsRead();
    } catch (err) {
      console.error("Error marking all notifications as read:", err);
      // Revert optimistic update
      setNotifications(prev => 
        prev.map(notif => {
          const wasUnread = unreadNotifications.find(un => un.id === notif.id);
          return wasUnread ? { ...notif, isRead: false } : notif;
        })
      );
      setUnreadCount(unreadNotifications.length);
    }
  }, [notifications]);

  // Delete notification
  const deleteNotification = useCallback(async (id) => {
    const notificationToDelete = notifications.find(n => n.id === id);
    
    // Optimistic update
    setNotifications(prev => prev.filter(notif => notif.id !== id));
    
    if (notificationToDelete && !notificationToDelete.isRead) {
      setUnreadCount(prev => Math.max(0, prev - 1));
    }

    try {
      await deleteNotificationApi(id);
    } catch (err) {
      console.error("Error deleting notification:", err);
      // Revert optimistic update
      setNotifications(prev => [...prev, notificationToDelete].sort((a, b) => 
        new Date(b.created_at) - new Date(a.created_at)
      ));
      
      if (notificationToDelete && !notificationToDelete.isRead) {
        setUnreadCount(prev => prev + 1);
      }
      throw err;
    }
  }, [notifications]);

  // Refresh notifications (useful after certain actions)
  const refreshNotifications = useCallback(() => {
    fetchNotifications(1, false);
  }, [fetchNotifications]);

  // Load more notifications (for pagination)
  const loadMoreNotifications = useCallback(() => {
    if (hasMore && !loading && currentPage < totalPages) {
      fetchNotifications(currentPage + 1, true);
    }
  }, [hasMore, loading, currentPage, totalPages, fetchNotifications]);

  // Initial fetch on mount
  useEffect(() => {
    fetchNotifications(1, false);
  }, [fetchNotifications]);

  // Auto-refresh notifications every 30 seconds (when user is active)
  useEffect(() => {
    const interval = setInterval(() => {
      if (document.visibilityState === 'visible') {
        refreshNotifications();
      }
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [refreshNotifications]);

  const value = {
    // State
    notifications,
    loading,
    error,
    unreadCount,
    currentPage,
    totalPages,
    hasMore,
    
    // Computed values
    unreadNotifications: getUnreadNotifications(),
    
    // Actions
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    refreshNotifications,
    loadMoreNotifications,
  };

  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationsContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationsProvider');
  }
  return context;
};
