import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  Check, 
  CheckCheck,
  Pin, 
  Archive, 
  Trash2, 
  Filter,
  Clock,
  AlertCircle,
  Info,
  Trophy,
  Video,
  BookOpen,
  Calendar
} from 'lucide-react';
import {
  getNotifications,
  getNotificationStatistics,
  markAsRead,
  markAllAsRead,
  togglePin,
  archiveNotification,
  archiveAllRead,
  deleteNotification,
  deleteAllRead
} from '../../services/notificationsApi';
import toast from 'react-hot-toast';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, unread, read, archived
  const [typeFilter, setTypeFilter] = useState(null);
  const [priorityFilter, setPriorityFilter] = useState(null);

  useEffect(() => {
    fetchNotifications();
    fetchStatistics();
  }, [filter, typeFilter, priorityFilter]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const params = {};
      
      if (filter === 'unread') {
        params.isRead = false;
        params.isArchived = false;
      } else if (filter === 'read') {
        params.isRead = true;
        params.isArchived = false;
      } else if (filter === 'archived') {
        params.isArchived = true;
      } else {
        // all - show non-archived
        params.isArchived = false;
      }
      
      if (typeFilter) params.notificationType = typeFilter;
      if (priorityFilter) params.priority = priorityFilter;

      const data = await getNotifications(params);
      setNotifications(data.notifications);
    } catch (error) {
      toast.error('Failed to load notifications');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStatistics = async () => {
    try {
      const stats = await getNotificationStatistics();
      setStatistics(stats);
    } catch (error) {
      console.error('Failed to load statistics:', error);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await markAsRead(id);
      fetchNotifications();
      fetchStatistics();
    } catch (error) {
      toast.error('Failed to mark as read');
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const result = await markAllAsRead();
      toast.success(result.message);
      fetchNotifications();
      fetchStatistics();
    } catch (error) {
      toast.error('Failed to mark all as read');
    }
  };

  const handleTogglePin = async (id) => {
    try {
      await togglePin(id);
      fetchNotifications();
    } catch (error) {
      toast.error('Failed to toggle pin');
    }
  };

  const handleArchive = async (id) => {
    try {
      await archiveNotification(id);
      toast.success('Notification archived');
      fetchNotifications();
      fetchStatistics();
    } catch (error) {
      toast.error('Failed to archive');
    }
  };

  const handleArchiveAllRead = async () => {
    if (!window.confirm('Archive all read notifications?')) return;
    
    try {
      const result = await archiveAllRead();
      toast.success(result.message);
      fetchNotifications();
      fetchStatistics();
    } catch (error) {
      toast.error('Failed to archive all read');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this notification?')) return;
    
    try {
      await deleteNotification(id);
      toast.success('Notification deleted');
      fetchNotifications();
      fetchStatistics();
    } catch (error) {
      toast.error('Failed to delete');
    }
  };

  const handleDeleteAllRead = async () => {
    if (!window.confirm('Permanently delete all read notifications?')) return;
    
    try {
      const result = await deleteAllRead();
      toast.success(result.message);
      fetchNotifications();
      fetchStatistics();
    } catch (error) {
      toast.error('Failed to delete all read');
    }
  };

  const getNotificationIcon = (type) => {
    const icons = {
      quiz_reminder: <BookOpen size={20} className="text-blue-600" />,
      video_added: <Video size={20} className="text-purple-600" />,
      assignment_due: <Calendar size={20} className="text-orange-600" />,
      study_reminder: <Clock size={20} className="text-green-600" />,
      achievement: <Trophy size={20} className="text-yellow-600" />,
      alarm: <Bell size={20} className="text-red-600" />,
      system: <Info size={20} className="text-gray-600" />,
      general: <Info size={20} className="text-gray-600" />
    };
    return icons[type] || icons.general;
  };

  const getPriorityColor = (priority) => {
    const colors = {
      low: 'border-l-4 border-gray-300',
      medium: 'border-l-4 border-blue-500',
      high: 'border-l-4 border-orange-500',
      urgent: 'border-l-4 border-red-500'
    };
    return colors[priority] || colors.medium;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
          <p className="text-gray-600 mt-1">Manage your notifications and alerts</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleMarkAllAsRead}
            className="btn flex items-center gap-2"
            disabled={!statistics || statistics.unread === 0}
          >
            <CheckCheck size={20} />
            Mark All Read
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      {statistics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="card">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Bell size={24} className="text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-2xl font-bold">{statistics.total}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <AlertCircle size={24} className="text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Unread</p>
                <p className="text-2xl font-bold">{statistics.unread}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Check size={24} className="text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Read</p>
                <p className="text-2xl font-bold">{statistics.read}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Clock size={24} className="text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Last 24h</p>
                <p className="text-2xl font-bold">{statistics.recent_count}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            {['all', 'unread', 'read', 'archived'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  filter === f
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>

          {filter === 'read' && (
            <div className="flex gap-2">
              <button
                onClick={handleArchiveAllRead}
                className="btn text-sm flex items-center gap-2"
              >
                <Archive size={16} />
                Archive All Read
              </button>
              <button
                onClick={handleDeleteAllRead}
                className="btn text-sm text-red-600 flex items-center gap-2"
              >
                <Trash2 size={16} />
                Delete All Read
              </button>
            </div>
          )}
        </div>

        {/* Type and Priority Filters */}
        <div className="flex gap-3">
          <select
            value={typeFilter || ''}
            onChange={(e) => setTypeFilter(e.target.value || null)}
            className="input text-sm"
          >
            <option value="">All Types</option>
            <option value="quiz_reminder">Quiz Reminders</option>
            <option value="video_added">New Videos</option>
            <option value="assignment_due">Assignments</option>
            <option value="study_reminder">Study Reminders</option>
            <option value="achievement">Achievements</option>
            <option value="alarm">Alarms</option>
            <option value="system">System</option>
          </select>

          <select
            value={priorityFilter || ''}
            onChange={(e) => setPriorityFilter(e.target.value || null)}
            className="input text-sm"
          >
            <option value="">All Priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
        </div>
      </div>

      {/* Notifications List */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      ) : notifications.length === 0 ? (
        <div className="card text-center py-12">
          <Bell size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications</h3>
          <p className="text-gray-600">
            {filter === 'unread' 
              ? "You're all caught up! No unread notifications."
              : filter === 'archived'
              ? "No archived notifications."
              : "No notifications yet."}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`card group hover:shadow-md transition-all ${
                !notification.is_read ? 'bg-blue-50' : ''
              } ${getPriorityColor(notification.priority)}`}
            >
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div className={`mt-1 ${notification.is_pinned ? 'text-yellow-500' : ''}`}>
                  {notification.is_pinned ? (
                    <Pin size={20} className="fill-current" />
                  ) : (
                    getNotificationIcon(notification.type)
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className={`font-semibold ${!notification.is_read ? 'text-gray-900' : 'text-gray-700'}`}>
                      {notification.title}
                    </h3>
                    <span className="text-xs text-gray-500 whitespace-nowrap">
                      {formatDate(notification.created_at)}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-600 mt-1">
                    {notification.message}
                  </p>

                  {/* Priority Badge */}
                  {notification.priority !== 'medium' && (
                    <span className={`inline-block text-xs px-2 py-1 rounded-full mt-2 ${
                      notification.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                      notification.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {notification.priority}
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {!notification.is_read && (
                    <button
                      onClick={() => handleMarkAsRead(notification.id)}
                      className="p-2 rounded-lg hover:bg-green-50 text-green-600"
                      title="Mark as read"
                    >
                      <Check size={18} />
                    </button>
                  )}
                  
                  <button
                    onClick={() => handleTogglePin(notification.id)}
                    className={`p-2 rounded-lg hover:bg-yellow-50 ${
                      notification.is_pinned ? 'text-yellow-600' : 'text-gray-400'
                    }`}
                    title={notification.is_pinned ? 'Unpin' : 'Pin'}
                  >
                    <Pin size={18} className={notification.is_pinned ? 'fill-current' : ''} />
                  </button>
                  
                  {!notification.is_archived && (
                    <button
                      onClick={() => handleArchive(notification.id)}
                      className="p-2 rounded-lg hover:bg-purple-50 text-purple-600"
                      title="Archive"
                    >
                      <Archive size={18} />
                    </button>
                  )}
                  
                  <button
                    onClick={() => handleDelete(notification.id)}
                    className="p-2 rounded-lg hover:bg-red-50 text-red-600"
                    title="Delete"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;