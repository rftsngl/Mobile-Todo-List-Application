import React, { useState } from 'react';
import { Button } from './ui/button';
import { Switch } from './ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { 
  ArrowLeft, 
  Bell, 
  CheckSquare, 
  Calendar, 
  Award, 
  Clock, 
  Users, 
  AlertTriangle,
  Check,
  MoreVertical,
  Trash2,
  Eye,
  Filter,
  X,
  Settings,
  FileText,
  RotateCcw,
  Pin,
  PinOff
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useLocalization } from './LocalizationProvider';
import { useNotifications } from './NotificationProvider';

interface NotificationScreenProps {
  onNavigate: (screen: string) => void;
  onBack?: () => void;
  previousScreen?: string;
}

export function NotificationScreen({ 
  onNavigate, 
  onBack,
  previousScreen 
}: NotificationScreenProps) {
  const { t } = useLocalization();
  const { 
    notifications, 
    unreadCount, 
    markAsRead, 
    markAllAsRead, 
    deleteNotification, 
    deleteSelected,
    clearAll,
    togglePin,
    getFilteredNotifications,
    isLoading,
    error,
    refresh
  } = useNotifications();

  const [selectedNotifications, setSelectedNotifications] = useState<string[]>([]);
  const [isSelecting, setIsSelecting] = useState(false);
  const [unreadOnly, setUnreadOnly] = useState(false);
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      // Fallback behavior
      onNavigate('profile');
    }
  };

  const getNotificationIcon = (type: string, priority?: string) => {
    const iconProps = {
      className: `w-5 h-5 ${
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
        return <CheckSquare {...iconProps} />;
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

  const toggleSelection = (id: string) => {
    setSelectedNotifications(prev => 
      prev.includes(id) 
        ? prev.filter(nId => nId !== id)
        : [...prev, id]
    );
  };

  const handleDeleteSelected = () => {
    deleteSelected(selectedNotifications);
    setSelectedNotifications([]);
    setIsSelecting(false);
  };

  const clearFilters = () => {
    setUnreadOnly(false);
    setTypeFilter('all');
    setPriorityFilter('all');
  };

  // Get filtered notifications
  const filteredNotifications = React.useMemo(() => {
    const filters = {
      unreadOnly,
      type: typeFilter === 'all' ? undefined : [typeFilter as any],
      priority: priorityFilter === 'all' ? undefined : [priorityFilter as any]
    };
    return getFilteredNotifications(filters);
  }, [getFilteredNotifications, unreadOnly, typeFilter, priorityFilter]);

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <motion.div 
        className="flex items-center justify-between p-4 border-b border-border/60 bg-card/60 backdrop-blur-sm relative z-10"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="flex items-center space-x-3">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleBack}
              className="touch-target-small"
              title={previousScreen ? `Back to ${previousScreen}` : 'Go back'}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </motion.div>
          <div>
            <h1 className="text-lg font-medium">{t('notifications.title')}</h1>
            {unreadCount > 0 && (
              <p className="text-xs text-muted-foreground">
                {t('notifications.unreadCount', { count: unreadCount })}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {isSelecting ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center space-x-2"
            >
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDeleteSelected}
                disabled={selectedNotifications.length === 0}
                className="touch-target-small text-destructive"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setIsSelecting(false);
                  setSelectedNotifications([]);
                }}
                className="touch-target-small"
              >
                {t('common.cancel')}
              </Button>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center space-x-2"
            >
              <Button
                variant="ghost"
                size="sm"
                onClick={refresh}
                disabled={isLoading}
                className="touch-target-small"
              >
                <RotateCcw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              </Button>
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={markAllAsRead}
                  className="touch-target-small"
                >
                  <Check className="w-4 h-4" />
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsSelecting(true)}
                className="touch-target-small"
              >
                <MoreVertical className="w-4 h-4" />
              </Button>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div 
        className="p-4 border-b border-border/40 bg-muted/20"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center space-x-2">
            <Switch
              id="unread-only"
              checked={unreadOnly}
              onCheckedChange={setUnreadOnly}
            />
            <label htmlFor="unread-only" className="text-sm text-muted-foreground">
              {t('notifications.unreadOnly')}
            </label>
          </div>

          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-36 h-8 text-sm">
              <SelectValue placeholder={t('notifications.filter.type')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('common.all')}</SelectItem>
              <SelectItem value="task">{t('notifications.type.task')}</SelectItem>
              <SelectItem value="deadline">{t('notifications.type.deadline')}</SelectItem>
              <SelectItem value="reminder">{t('notifications.type.reminder')}</SelectItem>
              <SelectItem value="collaboration">{t('notifications.type.collaboration')}</SelectItem>
              <SelectItem value="system">{t('notifications.type.system')}</SelectItem>
            </SelectContent>
          </Select>

          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="w-32 h-8 text-sm">
              <SelectValue placeholder={t('notifications.filter.priority')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('common.all')}</SelectItem>
              <SelectItem value="high">{t('common.priority.high')}</SelectItem>
              <SelectItem value="medium">{t('common.priority.medium')}</SelectItem>
              <SelectItem value="low">{t('common.priority.low')}</SelectItem>
            </SelectContent>
          </Select>

          {(unreadOnly || typeFilter !== 'all' || priorityFilter !== 'all') && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-sm h-8 px-3"
            >
              <X className="w-3 h-3 mr-1" />
              {t('common.clear')}
            </Button>
          )}
        </div>
      </motion.div>

      {/* Notifications List */}
      <div className="flex-1 overflow-y-auto">
        <AnimatePresence mode="popLayout">
          {error ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center h-full p-8 text-center"
            >
              <AlertTriangle className="w-16 h-16 text-destructive mb-4" />
              <h3 className="text-lg font-medium mb-2 text-destructive">{t('notifications.error')}</h3>
              <p className="text-muted-foreground mb-4">{error}</p>
              <Button onClick={refresh} size="sm">
                {t('notifications.retry')}
              </Button>
            </motion.div>
          ) : filteredNotifications.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center h-full p-8 text-center"
            >
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.5, 0.8, 0.5]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4"
              >
                <Bell className="w-8 h-8 text-muted-foreground" />
              </motion.div>
              <h3 className="text-lg font-medium mb-2">
                {unreadOnly || typeFilter !== 'all' || priorityFilter !== 'all'
                  ? t('notifications.noResults')
                  : t('notifications.empty')
                }
              </h3>
              <p className="text-muted-foreground mb-4">
                {unreadOnly || typeFilter !== 'all' || priorityFilter !== 'all'
                  ? t('notifications.noResultsWithFilters')
                  : t('notifications.emptyDescription')
                }
              </p>
              {(unreadOnly || typeFilter !== 'all' || priorityFilter !== 'all') && (
                <Button onClick={clearFilters} variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  {t('common.clearFilters')}
                </Button>
              )}
            </motion.div>
          ) : (
            <div className="p-4 space-y-3">
              {filteredNotifications.map((notification, index) => {
                const isSelected = selectedNotifications.includes(notification.id);
                const isPinned = notification.metadata?.pinned;
                
                return (
                  <motion.div
                    key={notification.id}
                    layout
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.95 }}
                    transition={{
                      delay: index * 0.05,
                      duration: 0.3,
                      ease: [0.16, 1, 0.3, 1]
                    }}
                    className={`relative p-4 rounded-2xl border transition-all duration-200 cursor-pointer group ${
                      isSelected
                        ? 'ring-2 ring-primary border-primary bg-primary/5'
                        : notification.read
                        ? 'bg-card border-border/60 hover:border-border hover:shadow-sm'
                        : 'bg-primary/5 border-border/60 hover:border-border hover:shadow-md'
                    }`}
                    whileHover={{ scale: 1.01, y: -2 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => {
                      if (isSelecting) {
                        toggleSelection(notification.id);
                      } else {
                        markAsRead(notification.id);
                      }
                    }}
                  >
                    {/* Selection Indicator */}
                    <AnimatePresence>
                      {isSelecting && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0 }}
                          className="absolute top-3 right-3 z-10"
                        >
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            isSelected 
                              ? 'bg-primary border-primary' 
                              : 'border-muted-foreground bg-background'
                          }`}>
                            {isSelected && (
                              <Check className="w-3 h-3 text-primary-foreground" />
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Unread Indicator */}
                    {!notification.read && !isSelecting && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute top-4 right-4 w-2 h-2 bg-primary rounded-full"
                      />
                    )}

                    <div className="flex items-start space-x-3">
                      {/* Icon */}
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        className="w-10 h-10 rounded-xl bg-muted/50 flex items-center justify-center"
                      >
                        {getNotificationIcon(notification.type, notification.priority)}
                      </motion.div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <h4 className={`text-sm leading-tight ${
                              notification.read ? 'text-muted-foreground' : 'text-foreground font-medium'
                            }`}>
                              {notification.title}
                            </h4>
                            {isPinned && (
                              <Pin className="w-3 h-3 text-muted-foreground" />
                            )}
                          </div>
                        </div>
                        
                        <p className={`text-sm leading-relaxed mb-2 ${
                          notification.read ? 'text-muted-foreground' : 'text-foreground'
                        }`}>
                          {notification.message}
                        </p>
                        
                        <p className="text-xs text-muted-foreground">
                          {formatTime(notification.timeISO)}
                        </p>
                      </div>
                    </div>

                    {/* Hover Actions */}
                    {!isSelecting && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        whileHover={{ opacity: 1 }}
                        className="absolute top-4 right-8 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1"
                      >
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            togglePin(notification.id);
                          }}
                          className="p-1 hover:bg-muted rounded"
                        >
                          {isPinned ? (
                            <PinOff className="w-4 h-4 text-muted-foreground" />
                          ) : (
                            <Pin className="w-4 h-4 text-muted-foreground" />
                          )}
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteNotification(notification.id);
                          }}
                          className="p-1 hover:bg-muted rounded"
                        >
                          <Trash2 className="w-4 h-4 text-muted-foreground hover:text-destructive" />
                        </button>
                      </motion.div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Actions */}
      {filteredNotifications.length > 0 && (
        <motion.div 
          className="p-4 border-t border-border/50 bg-muted/20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <div className="flex items-center justify-between gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setIsSelecting(!isSelecting)}
              className="text-sm h-9 px-4"
            >
              <Check className="w-4 h-4 mr-1" />
              {isSelecting ? t('common.cancel') : t('common.select')}
            </Button>
            
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={clearAll}
              className="text-sm h-9 px-4 text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <RotateCcw className="w-4 h-4 mr-1" />
              {t('notifications.clearAll')}
            </Button>
          </div>
        </motion.div>
      )}

      {/* Bottom Safe Area */}
      <div className="h-4" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }} />
    </div>
  );
}