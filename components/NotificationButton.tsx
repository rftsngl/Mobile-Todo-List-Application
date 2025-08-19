import React, { useState, useCallback } from 'react';
import { Button } from './ui/button';
import { Bell, BellRing } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useLocalization } from './LocalizationProvider';
import { useNotifications } from './NotificationProvider';
import { NotificationDropdown } from './NotificationDropdown';
import { NotificationSidePanel } from './NotificationSidePanel';

interface NotificationButtonProps {
  onNavigateToNotifications?: () => void;
  className?: string;
}

export function NotificationButton({ onNavigateToNotifications, className = '' }: NotificationButtonProps) {
  const { t } = useLocalization();
  const { unreadCount } = useNotifications();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showSidePanel, setShowSidePanel] = useState(false);
  
  const hasUnread = unreadCount > 0;

  // Detect screen size for responsive behavior
  const isLargeScreen = typeof window !== 'undefined' && window.innerWidth >= 768;

  const handleClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isLargeScreen) {
      // Desktop: Show dropdown on normal click
      if (e.shiftKey || e.metaKey) {
        // Shift/Cmd + Click: Open side panel
        setShowSidePanel(true);
      } else {
        // Normal click: Toggle dropdown
        setShowDropdown(!showDropdown);
      }
    } else {
      // Mobile: Navigate to full screen
      onNavigateToNotifications?.();
    }
  }, [isLargeScreen, showDropdown, onNavigateToNotifications]);

  const handleSeeAll = useCallback(() => {
    setShowDropdown(false);
    
    if (isLargeScreen) {
      // Desktop: Open side panel
      setShowSidePanel(true);
    } else {
      // Mobile: Navigate to full screen
      onNavigateToNotifications?.();
    }
  }, [isLargeScreen, onNavigateToNotifications]);

  return (
    <>
      <Button 
        variant="ghost" 
        size="sm" 
        className={`relative touch-target-small h-9 w-9 rounded-xl transition-colors duration-200 hover:bg-muted/80 ${className}`}
        onClick={handleClick}
        aria-label={t('notifications.title')}
        title={hasUnread ? t('notifications.unreadCount', { count: unreadCount }) : t('notifications.title')}
      >
        {/* Bell Icon with Animation */}
        <motion.div
          animate={hasUnread ? {
            rotate: [0, -10, 10, -10, 0],
            transition: {
              duration: 0.6,
              ease: "easeInOut",
              repeat: Infinity,
              repeatDelay: 4
            }
          } : {}}
        >
          {hasUnread ? (
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ 
                duration: 0.3,
                ease: [0.16, 1, 0.3, 1]
              }}
            >
              <BellRing className="w-5 h-5 text-primary" />
            </motion.div>
          ) : (
            <Bell className="w-5 h-5 text-muted-foreground" />
          )}
        </motion.div>
        
        {/* Unread Count Badge */}
        <AnimatePresence>
          {hasUnread && (
            <motion.div 
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute -top-1 -right-1"
            >
              <motion.div 
                className="w-5 h-5 bg-destructive rounded-full flex items-center justify-center shadow-sm"
                animate={{
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <span className="text-xs text-destructive-foreground font-medium">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pulse Ring Effect */}
        <AnimatePresence>
          {hasUnread && (
            <motion.div
              className="absolute inset-0 rounded-xl border-2 border-destructive/30 pointer-events-none"
              initial={{ scale: 1, opacity: 0.5 }}
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.5, 0, 0.5]
              }}
              exit={{ scale: 1, opacity: 0 }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          )}
        </AnimatePresence>
      </Button>

      {/* Desktop Dropdown */}
      {isLargeScreen && (
        <NotificationDropdown
          open={showDropdown}
          onOpenChange={setShowDropdown}
          onSeeAll={handleSeeAll}
        />
      )}

      {/* Desktop Side Panel */}
      {isLargeScreen && (
        <NotificationSidePanel
          open={showSidePanel}
          onOpenChange={setShowSidePanel}
        />
      )}
    </>
  );
}