import React, { useState, useMemo } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from './ui/sheet';
import { ScrollArea } from './ui/scroll-area';
import { Switch } from './ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
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
  Filter,
  Trash2,
  Check,
  Zap,
  Pin,
  PinOff
} from 'lucide-react';
import { useNotifications } from './NotificationProvider';
import { useLocalization } from './LocalizationProvider';

interface NotificationSidePanelProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function NotificationSidePanel({ open, onOpenChange }: NotificationSidePanelProps) {
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

  const hasUnread = unreadCount > 0;

  // Get filtered notifications
  const filteredNotifications = useMemo(() => {
    const filters = {
      unreadOnly,
      type: typeFilter === 'all' ? undefined : [typeFilter as any],
      priority: priorityFilter === 'all' ? undefined : [priorityFilter as any]
    };
    return getFilteredNotifications(filters);
  }, [getFilteredNotifications, unreadOnly, typeFilter, priorityFilter]);

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

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent 
        side="right" 
        className="w-[90%] sm:w-[400px] p-0 bg-card/95 backdrop-blur-xl border-l border-border/50"
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          <SheetHeader className="p-4 border-b border-border/50 bg-card/80 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <SheetTitle className="text-left text-lg flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  {t('notifications.title')}
                </SheetTitle>
                <SheetDescription className="text-sm text-muted-foreground text-left">
                  {hasUnread ? (
                    <span className="text-destructive">
                      {t('notifications.unreadCount', { count: unreadCount })}
                    </span>
                  ) : (
                    t('notifications.allCaughtUp')
                  )}
                </SheetDescription>
              </motion.div>
              
              <motion.div 
                className="flex items-center space-x-2"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                {isSelecting ? (
                  <div className="flex items-center space-x-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={handleDeleteSelected}
                      disabled={selectedNotifications.length === 0}
                      className="text-xs h-8 px-3 text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      {t('common.delete')} ({selectedNotifications.length})
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => {
                        setIsSelecting(false);
                        setSelectedNotifications([]);
                      }}
                      className="text-xs h-8 px-3"
                    >
                      {t('common.cancel')}
                    </Button>
                  </div>
                ) : (
                  <>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={refresh}
                      disabled={isLoading}
                      className="text-xs h-8 px-3"
                    >
                      <RotateCcw className={`w-4 h-4 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
                      {t('notifications.refresh')}
                    </Button>
                    {hasUnread && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={markAllAsRead}
                        className="text-xs h-8 px-3"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        {t('notifications.markAllRead')}
                      </Button>
                    )}
                  </>
                )}
              </motion.div>
            </div>

            {/* Filters */}
            <motion.div 
              className="flex flex-wrap items-center gap-3 mt-4 pt-4 border-t border-border/50"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              <div className="flex items-center space-x-2">
                <Switch
                  id="unread-only"
                  checked={unreadOnly}
                  onCheckedChange={setUnreadOnly}
                />
                <label htmlFor="unread-only" className="text-xs text-muted-foreground">
                  {t('notifications.unreadOnly')}
                </label>
              </div>

              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-32 h-8 text-xs">
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
                <SelectTrigger className="w-28 h-8 text-xs">
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
                  className="text-xs h-8 px-3"
                >
                  <X className="w-3 h-3 mr-1" />
                  {t('common.clear')}
                </Button>
              )}
            </motion.div>
          </SheetHeader>
        </motion.div>

        {/* Notifications List */}
        <ScrollArea className="flex-1 h-[calc(100vh-200px)]">
          <AnimatePresence mode="popLayout">
            {error ? (
              <motion.div 
                className="p-8 text-center"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <AlertTriangle className="w-12 h-12 text-destructive mx-auto mb-3" />
                <h4 className="text-sm font-medium text-destructive mb-2">{t('notifications.error')}</h4>
                <p className="text-xs text-muted-foreground mb-4">{error}</p>
                <Button onClick={refresh} size="sm">
                  {t('notifications.retry')}
                </Button>
              </motion.div>
            ) : filteredNotifications.length > 0 ? (
              <motion.div 
                className="divide-y divide-border/50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                {filteredNotifications.map((notification, index) => {
                  const isSelected = selectedNotifications.includes(notification.id);
                  const isPinned = notification.metadata?.pinned;
                  
                  return (
                    <motion.div
                      key={notification.id}
                      layout
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -50 }}
                      transition={{ 
                        duration: 0.3,
                        delay: index * 0.03,
                        ease: [0.16, 1, 0.3, 1]
                      }}
                      className={`p-4 transition-all duration-200 cursor-pointer group relative ${
                        isSelected 
                          ? 'ring-2 ring-primary border-primary bg-primary/5'
                          : !notification.read 
                          ? 'bg-primary/5 hover:bg-primary/10' 
                          : 'hover:bg-muted/50'
                      }`}
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
                              {isSelected && <Check className="w-3 h-3 text-primary-foreground" />}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Unread Indicator */}
                      {!notification.read && !isSelecting && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute left-0 top-0 bottom-0 w-1 bg-primary"
                        />
                      )}

                      <div className="flex items-start space-x-4">
                        {/* Icon */}
                        <motion.div 
                          className="flex-shrink-0 mt-1"
                          whileHover={{ scale: 1.1 }}
                        >
                          {getNotificationIcon(notification.type, notification.priority)}
                        </motion.div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1 pr-2">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className={`text-sm leading-tight ${
                                  !notification.read ? 'font-medium text-foreground' : 'text-muted-foreground'
                                }`}>
                                  {notification.title}
                                </h4>
                                {isPinned && (
                                  <Pin className="w-3 h-3 text-muted-foreground" />
                                )}
                                {notification.priority === 'high' && (
                                  <Badge variant="destructive" className="text-xs px-1 py-0">
                                    {t('common.priority.high')}
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                                {notification.message}
                              </p>
                              <p className="text-xs text-muted-foreground flex items-center">
                                <Clock className="w-3 h-3 mr-1" />
                                {formatTime(notification.timeISO)}
                              </p>
                            </div>
                            
                            {/* Action buttons */}
                            {!isSelecting && (
                              <div className="flex flex-col items-center space-y-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    togglePin(notification.id);
                                  }}
                                  className="h-8 w-8 p-0"
                                >
                                  {isPinned ? (
                                    <PinOff className="w-4 h-4" />
                                  ) : (
                                    <Pin className="w-4 h-4" />
                                  )}
                                </Button>
                                
                                {!notification.read && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      markAsRead(notification.id);
                                    }}
                                    className="h-8 w-8 p-0"
                                  >
                                    <Eye className="w-4 h-4" />
                                  </Button>
                                )}
                                
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    deleteNotification(notification.id);
                                  }}
                                  className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            ) : (
              <motion.div 
                className="p-8 text-center"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Bell className="w-8 h-8 text-muted-foreground" />
                </div>
                <h4 className="text-lg mb-2">{t('notifications.empty')}</h4>
                <p className="text-sm text-muted-foreground mb-4">
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
            )}
          </AnimatePresence>
        </ScrollArea>

        {/* Footer Actions */}
        {filteredNotifications.length > 0 && (
          <motion.div 
            className="p-3 border-t border-border/50 bg-muted/20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
          >
            <div className="flex items-center justify-between gap-2">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setIsSelecting(!isSelecting)}
                className="text-xs h-8 px-3"
              >
                <Check className="w-3 h-3 mr-1" />
                {isSelecting ? t('common.cancel') : t('common.select')}
              </Button>
              
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={clearAll}
                className="text-xs h-8 px-3 text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <RotateCcw className="w-3 h-3 mr-1" />
                {t('notifications.clearAll')}
              </Button>
            </div>
          </motion.div>
        )}
      </SheetContent>
    </Sheet>
  );
}