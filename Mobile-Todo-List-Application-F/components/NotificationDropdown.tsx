import React, { useState, useMemo } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { ScrollArea } from './ui/scroll-area';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Bell, 
  Clock, 
  Calendar,
  AlertTriangle,
  CheckCircle,
  X,
  Settings,
  Eye,
  RotateCcw,
  Users,
  FileText,
  Zap
} from 'lucide-react';
import { useNotifications } from './NotificationProvider';
import { useLocalization } from './LocalizationProvider';

interface NotificationDropdownProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSeeAll?: () => void;
}

export function NotificationDropdown({ open, onOpenChange, onSeeAll }: NotificationDropdownProps) {
  const { t } = useLocalization();
  const { 
    notifications, 
    unreadCount, 
    markAsRead, 
    markAllAsRead, 
    deleteNotification, 
    clearAll,
    getFilteredNotifications
  } = useNotifications();

  const hasUnread = unreadCount > 0;

  // Get recent notifications for dropdown (max 5)
  const recentNotifications = useMemo(() => {
    return getFilteredNotifications().slice(0, 5);
  }, [getFilteredNotifications]);

  const getNotificationIcon = (type: string, priority?: string) => {
    const iconProps = {
      className: `w-4 h-4 ${
        priority === 'high' ? 'text-red-500' : 
        priority === 'medium' ? 'text-yellow-500' : 
        'text-blue-500'
      }`
    };

    switch (type) {
      case 'deadline':
        return <AlertTriangle {...iconProps} />;
      case 'reminder':
        return <Clock {...iconProps} />;
      case 'completion':
        return <CheckCircle {...iconProps} />;
      case 'collaboration':
        return <Users {...iconProps} />;
      case 'task':
        return <FileText {...iconProps} />;
      case 'system':
        return <Settings {...iconProps} />;
      default:
        return <Bell {...iconProps} />;
    }
  };

  const formatTime = (timeISO: string) => {
    const now = new Date();
    const time = new Date(timeISO);
    const diff = now.getTime() - time.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return t('time.now');
    if (minutes < 60) return t('time.minutesAgo', { minutes });
    if (hours < 24) return t('time.hoursAgo', { hours });
    return t('time.daysAgo', { days });
  };

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <button style={{ display: 'none' }} aria-hidden="true" />
      </PopoverTrigger>
      
      <PopoverContent 
        className="w-80 p-0 shadow-lg border border-border/50" 
        align="end" 
        sideOffset={8}

      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -10 }}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Header */}
          <div className="p-4 border-b border-border/60 bg-card/60 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-foreground">
                  {t('notifications.title')}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {hasUnread 
                    ? t('notifications.unreadCount', { count: unreadCount })
                    : t('notifications.allCaughtUp')
                  }
                </p>
              </div>
              <div className="flex items-center space-x-1">
                {hasUnread && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                  >
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={markAllAsRead}
                      className="text-xs h-7 px-2 touch-target-small"
                    >
                      <Eye className="w-3 h-3 mr-1" />
                      {t('notifications.markAllRead')}
                    </Button>
                  </motion.div>
                )}
              </div>
            </div>
          </div>

          {/* Notifications List */}
          <ScrollArea className="max-h-96">
            {recentNotifications.length > 0 ? (
              <div className="divide-y divide-border/50">
                <AnimatePresence mode="popLayout">
                  {recentNotifications.map((notification, index) => (
                    <motion.div
                      key={notification.id}
                      layout
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ 
                        duration: 0.2,
                        delay: index * 0.03,
                        ease: [0.16, 1, 0.3, 1]
                      }}
                      className={`p-3 hover:bg-muted/50 transition-colors cursor-pointer group ${
                        !notification.read ? 'bg-primary/5' : ''
                      }`}
                      onClick={() => markAsRead(notification.id)}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 mt-0.5">
                          {getNotificationIcon(notification.type, notification.priority)}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <p className={`text-xs leading-tight ${
                                !notification.read ? 'font-medium text-foreground' : 'text-muted-foreground'
                              }`}>
                                {notification.title}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                {notification.message}
                              </p>
                              <p className="text-xs text-muted-foreground mt-2 flex items-center">
                                <Clock className="w-3 h-3 mr-1" />
                                {formatTime(notification.timeISO)}
                              </p>
                            </div>
                            
                            <div className="flex items-center space-x-1 ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              {!notification.read && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    markAsRead(notification.id);
                                  }}
                                  className="h-6 w-6 p-0"
                                >
                                  <Eye className="w-3 h-3" />
                                </Button>
                              )}
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteNotification(notification.id);
                                }}
                                className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                              >
                                <X className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                          
                          {!notification.read && (
                            <div className="w-2 h-2 bg-primary rounded-full mt-1"></div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              <motion.div 
                className="p-8 text-center"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
              >
                <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-3">
                  <Bell className="w-6 h-6 text-muted-foreground" />
                </div>
                <h4 className="text-sm text-muted-foreground">{t('notifications.empty')}</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  {t('notifications.emptyDescription')}
                </p>
              </motion.div>
            )}
          </ScrollArea>

          {/* Footer Actions */}
          <div className="p-3 border-t border-border/50 bg-muted/20">
            <div className="flex items-center justify-between gap-2">
              {recentNotifications.length >= 5 && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => {
                    onOpenChange?.(false);
                    onSeeAll?.();
                  }}
                  className="text-xs h-7 px-3 flex-1"
                >
                  <Zap className="w-3 h-3 mr-1" />
                  {t('notifications.seeAll')}
                </Button>
              )}
              
              {recentNotifications.length > 0 && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => {
                    clearAll();
                    onOpenChange?.(false);
                  }}
                  className="text-xs h-7 px-3 text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <RotateCcw className="w-3 h-3 mr-1" />
                  {t('notifications.clearAll')}
                </Button>
              )}
            </div>
          </div>
        </motion.div>
      </PopoverContent>
    </Popover>
  );
}