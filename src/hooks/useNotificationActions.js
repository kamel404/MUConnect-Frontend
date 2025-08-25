import { useNotifications } from '../context/NotificationsContext';
import { useToast } from '@chakra-ui/react';

/**
 * Custom hook that provides common notification actions with toast feedback
 * This is useful for components that need notification actions with UI feedback
 * 
 * @returns {Object} Object containing notification action functions with toast feedback
 */
export const useNotificationActions = () => {
  const {
    markAsRead,
    markAllAsRead,
    deleteNotification,
    refreshNotifications,
  } = useNotifications();
  
  const toast = useToast();

  const markAsReadWithToast = async (id, showToast = false) => {
    try {
      await markAsRead(id);
      if (showToast) {
        toast({
          title: 'Notification marked as read',
          status: 'success',
          duration: 2000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: 'Failed to mark as read',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const markAllAsReadWithToast = async () => {
    try {
      await markAllAsRead();
      toast({
        title: 'All notifications marked as read',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Failed to mark all as read',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const deleteNotificationWithToast = async (id) => {
    try {
      await deleteNotification(id);
      toast({
        title: 'Notification deleted',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Failed to delete notification',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return {
    markAsReadWithToast,
    markAllAsReadWithToast,
    deleteNotificationWithToast,
    refreshNotifications,
  };
};
