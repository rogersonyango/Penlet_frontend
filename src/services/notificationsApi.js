const API_BASE_URL = 'http://localhost:8000/api/v1';

/**
 * Create a new notification
 * @param {Object} notificationData - Notification data
 * @returns {Promise<Object>} Created notification
 */
export const createNotification = async (notificationData) => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    const userId = user?.id;

    if (!userId) {
      throw new Error('User not authenticated');
    }

    const response = await fetch(
      `${API_BASE_URL}/notifications/?user_id=${userId}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(notificationData),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to create notification: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Create notification error:', error);
    throw error;
  }
};

/**
 * Get all notifications with filters
 * @param {Object} params - Query parameters
 * @returns {Promise<Object>} List of notifications with pagination
 */
export const getNotifications = async ({
  isRead = null,
  isArchived = null,
  notificationType = null,
  priority = null,
  page = 1,
  pageSize = 50
} = {}) => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    const userId = user?.id;

    if (!userId) {
      throw new Error('User not authenticated');
    }

    const params = new URLSearchParams({ user_id: userId, page, page_size: pageSize });
    
    if (isRead !== null) params.append('is_read', isRead);
    if (isArchived !== null) params.append('is_archived', isArchived);
    if (notificationType) params.append('notification_type', notificationType);
    if (priority) params.append('priority', priority);

    const response = await fetch(
      `${API_BASE_URL}/notifications/?${params}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch notifications: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Get notifications error:', error);
    throw error;
  }
};

/**
 * Get recent notifications
 * @param {number} hours - Hours to look back (default: 24)
 * @param {number} limit - Max notifications (default: 10)
 * @returns {Promise<Object>} Recent notifications
 */
export const getRecentNotifications = async (hours = 24, limit = 10) => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    const userId = user?.id;

    if (!userId) {
      throw new Error('User not authenticated');
    }

    const response = await fetch(
      `${API_BASE_URL}/notifications/recent?user_id=${userId}&hours=${hours}&limit=${limit}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch recent notifications: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Get recent notifications error:', error);
    throw error;
  }
};

/**
 * Get notification statistics
 * @returns {Promise<Object>} Notification statistics
 */
export const getNotificationStatistics = async () => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    const userId = user?.id;

    if (!userId) {
      throw new Error('User not authenticated');
    }

    const response = await fetch(
      `${API_BASE_URL}/notifications/statistics?user_id=${userId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch statistics: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Get statistics error:', error);
    throw error;
  }
};

/**
 * Mark notification as read
 * @param {string} notificationId - Notification ID
 * @returns {Promise<Object>} Updated notification
 */
export const markAsRead = async (notificationId) => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    const userId = user?.id;

    if (!userId) {
      throw new Error('User not authenticated');
    }

    const response = await fetch(
      `${API_BASE_URL}/notifications/${notificationId}/read?user_id=${userId}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to mark as read: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Mark as read error:', error);
    throw error;
  }
};

/**
 * Mark all notifications as read
 * @returns {Promise<Object>} Success message with count
 */
export const markAllAsRead = async () => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    const userId = user?.id;

    if (!userId) {
      throw new Error('User not authenticated');
    }

    const response = await fetch(
      `${API_BASE_URL}/notifications/read-all?user_id=${userId}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to mark all as read: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Mark all as read error:', error);
    throw error;
  }
};

/**
 * Toggle pin status
 * @param {string} notificationId - Notification ID
 * @returns {Promise<Object>} Updated notification
 */
export const togglePin = async (notificationId) => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    const userId = user?.id;

    if (!userId) {
      throw new Error('User not authenticated');
    }

    const response = await fetch(
      `${API_BASE_URL}/notifications/${notificationId}/pin?user_id=${userId}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to toggle pin: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Toggle pin error:', error);
    throw error;
  }
};

/**
 * Archive notification
 * @param {string} notificationId - Notification ID
 * @returns {Promise<Object>} Updated notification
 */
export const archiveNotification = async (notificationId) => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    const userId = user?.id;

    if (!userId) {
      throw new Error('User not authenticated');
    }

    const response = await fetch(
      `${API_BASE_URL}/notifications/${notificationId}/archive?user_id=${userId}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to archive: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Archive notification error:', error);
    throw error;
  }
};

/**
 * Archive all read notifications
 * @returns {Promise<Object>} Success message with count
 */
export const archiveAllRead = async () => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    const userId = user?.id;

    if (!userId) {
      throw new Error('User not authenticated');
    }

    const response = await fetch(
      `${API_BASE_URL}/notifications/archive-all-read?user_id=${userId}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to archive all read: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Archive all read error:', error);
    throw error;
  }
};

/**
 * Delete notification
 * @param {string} notificationId - Notification ID
 * @returns {Promise<Object>} Success message
 */
export const deleteNotification = async (notificationId) => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    const userId = user?.id;

    if (!userId) {
      throw new Error('User not authenticated');
    }

    const response = await fetch(
      `${API_BASE_URL}/notifications/${notificationId}?user_id=${userId}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to delete notification: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Delete notification error:', error);
    throw error;
  }
};

/**
 * Delete all read notifications
 * @returns {Promise<Object>} Success message with count
 */
export const deleteAllRead = async () => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    const userId = user?.id;

    if (!userId) {
      throw new Error('User not authenticated');
    }

    const response = await fetch(
      `${API_BASE_URL}/notifications/delete-all-read?user_id=${userId}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to delete all read: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Delete all read error:', error);
    throw error;
  }
};