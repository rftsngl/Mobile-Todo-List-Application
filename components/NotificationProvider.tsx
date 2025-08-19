import React, { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';
import { toast } from 'sonner@2.0.3';
import { useLocalization } from './LocalizationProvider';

export interface Notification {
  id: string;
  type: 'task' | 'system' | 'reminder' | 'deadline' | 'completion' | 'collaboration';
  title: string;
  message: string;
  timeISO: string;
  read: boolean;
  priority?: 'low' | 'medium' | 'high';
  actionable?: boolean;
  taskId?: number;
  metadata?: Record<string, any>;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
  deleteSelected: (ids: string[]) => void;
  clearAll: () => void;
  togglePin: (id: string) => void;
  addNotification: (notification: Omit<Notification, 'id' | 'timeISO'>) => void;
  getFilteredNotifications: (filters?: NotificationFilters) => Notification[];
  isLoading: boolean;
  error: string | null;
  refresh: () => void;
}

interface NotificationFilters {
  type?: Notification['type'][];
  priority?: Notification['priority'][];
  unreadOnly?: boolean;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}

interface NotificationProviderProps {
  children: React.ReactNode;
  overdueTasks?: any[];
}

// Mock notification data with enhanced variety
const generateMockNotifications = (overdueTasks: any[] = []): Notification[] => {
  const baseNotifications: Notification[] = [
    {
      id: '1',
      type: 'deadline',
      title: 'Task Deadline Approaching',
      message: 'Design mobile app UI is due tomorrow',
      timeISO: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      read: false,
      priority: 'high',
      actionable: true,
      taskId: 1
    },
    {
      id: '2',
      type: 'reminder',
      title: 'Daily Review',
      message: 'Time for your daily task review',
      timeISO: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      read: false,
      priority: 'medium',
      actionable: true
    },
    {
      id: '3',
      type: 'completion',
      title: 'Task Completed',
      message: 'Setup development environment has been completed',
      timeISO: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      read: true,
      priority: 'low',
      actionable: false,
      taskId: 2
    },
    {
      id: '4',
      type: 'collaboration',
      title: 'Team Update',
      message: 'Sarah added a comment to your task',
      timeISO: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
      read: false,
      priority: 'medium',
      actionable: true,
      taskId: 3
    },
    {
      id: '5',
      type: 'system',
      title: 'Backup Complete',
      message: 'Your data has been successfully backed up',
      timeISO: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      read: true,
      priority: 'low',
      actionable: false
    },
    {
      id: '6',
      type: 'reminder',
      title: 'Meeting Reminder',
      message: 'Team standup meeting in 30 minutes',
      timeISO: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      read: false,
      priority: 'high',
      actionable: true
    }
  ];

  // Add overdue tasks as notifications
  const overdueNotifications: Notification[] = overdueTasks.map(task => ({
    id: `overdue-${task.id}`,
    type: 'deadline' as const,
    title: 'Overdue Task',
    message: `${task.title} was due on ${task.dueDate}`,
    timeISO: new Date().toISOString(),
    read: false,
    priority: 'high' as const,
    actionable: true,
    taskId: task.id
  }));

  return [...overdueNotifications, ...baseNotifications];
};

export function NotificationProvider({ children, overdueTasks = [] }: NotificationProviderProps) {
  const { t } = useLocalization();
  const [notifications, setNotifications] = useState<Notification[]>(() => 
    generateMockNotifications(overdueTasks)
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Update notifications when overdue tasks change
  useEffect(() => {
    setNotifications(generateMockNotifications(overdueTasks));
  }, [overdueTasks]);

  const unreadCount = useMemo(() => {
    return notifications.filter(n => !n.read).length;
  }, [notifications]);

  const markAsRead = useCallback((id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    toast.success(t('notifications.markedAllRead'));
  }, [t]);

  const deleteNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    toast.success(t('notifications.deleted'));
  }, [t]);

  const deleteSelected = useCallback((ids: string[]) => {
    setNotifications(prev => prev.filter(n => !ids.includes(n.id)));
    toast.success(t('notifications.deletedSelected', { count: ids.length }));
  }, [t]);

  const clearAll = useCallback(() => {
    setNotifications([]);
    toast.success(t('notifications.clearedAll'));
  }, [t]);

  const togglePin = useCallback((id: string) => {
    setNotifications(prev => 
      prev.map(n => 
        n.id === id 
          ? { ...n, metadata: { ...n.metadata, pinned: !n.metadata?.pinned } }
          : n
      )
    );
  }, []);

  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'timeISO'>) => {
    const newNotification: Notification = {
      ...notification,
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timeISO: new Date().toISOString()
    };
    setNotifications(prev => [newNotification, ...prev]);
  }, []);

  const getFilteredNotifications = useCallback((filters?: NotificationFilters) => {
    let filtered = [...notifications];

    if (filters?.unreadOnly) {
      filtered = filtered.filter(n => !n.read);
    }

    if (filters?.type && filters.type.length > 0) {
      filtered = filtered.filter(n => filters.type!.includes(n.type));
    }

    if (filters?.priority && filters.priority.length > 0) {
      filtered = filtered.filter(n => n.priority && filters.priority!.includes(n.priority));
    }

    // Sort by pinned, then unread, then by time
    return filtered.sort((a, b) => {
      // Pinned first
      const aPinned = a.metadata?.pinned || false;
      const bPinned = b.metadata?.pinned || false;
      if (aPinned && !bPinned) return -1;
      if (!aPinned && bPinned) return 1;

      // Then unread
      if (!a.read && b.read) return -1;
      if (a.read && !b.read) return 1;

      // Then by time (newest first)
      return new Date(b.timeISO).getTime() - new Date(a.timeISO).getTime();
    });
  }, [notifications]);

  const refresh = useCallback(() => {
    setIsLoading(true);
    setError(null);
    
    // Simulate API call
    setTimeout(() => {
      try {
        setNotifications(generateMockNotifications(overdueTasks));
        setIsLoading(false);
        toast.success(t('notifications.refreshed'));
      } catch (err) {
        setError(t('notifications.error'));
        setIsLoading(false);
        toast.error(t('notifications.error'));
      }
    }, 1000);
  }, [overdueTasks, t]);

  const value: NotificationContextType = useMemo(() => ({
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    deleteSelected,
    clearAll,
    togglePin,
    addNotification,
    getFilteredNotifications,
    isLoading,
    error,
    refresh
  }), [
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    deleteSelected,
    clearAll,
    togglePin,
    addNotification,
    getFilteredNotifications,
    isLoading,
    error,
    refresh
  ]);

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}