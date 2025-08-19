import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { NotificationButton } from './NotificationButton';
import { useLocalization } from './LocalizationProvider';
import { useSession } from './SessionProvider';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { CalendarDays, List } from 'lucide-react';

interface SharedHeaderProps {
  currentScreen: string;
  onNavigate: (screen: string) => void;
  overdueTasks: any[];
  // Board view mode controls
  boardViewMode?: 'list' | 'calendar';
  onBoardViewModeChange?: (mode: 'list' | 'calendar') => void;
}

export function SharedHeader({
  currentScreen,
  onNavigate,
  overdueTasks,
  boardViewMode,
  onBoardViewModeChange
}: SharedHeaderProps) {
  const { t } = useLocalization();
  const { session, isInCompanyWorkspace, currentWorkspace } = useSession();

  const getScreenTitle = () => {
    switch (currentScreen) {
      case 'home': return t('nav.home');
      case 'board': return t('nav.board');
      case 'profile': return t('nav.profile');
      case 'admin-dashboard': return t('nav.admin');
      default: return 'TaskFlow';
    }
  };

  const getScreenSubtitle = () => {
    if (!currentWorkspace) return null;
    
    if (currentWorkspace.type === 'company') {
      return (
        <div className="flex items-center space-x-2 text-xs text-muted-foreground">
          <span>{currentWorkspace.name}</span>
          {session?.membershipStatus === 'pending' && (
            <Badge variant="secondary" className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 text-xs px-2 py-0">
              Pending
            </Badge>
          )}
        </div>
      );
    }
    
    return null;
  };

  return (
    <motion.div 
      className="h-14 bg-card/80 backdrop-blur-xl border-b border-border/50 relative z-30"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{
        duration: 0.6,
        delay: 0.2,
        ease: [0.16, 1, 0.3, 1]
      }}
    >
      <div className="flex items-center justify-between h-full px-4">
        
        {/* Left Section - Tab Title */}
        <div className="flex items-center min-w-0 flex-1">
          <motion.h1 
            className="text-lg truncate"
            key={currentScreen}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            {getScreenTitle()}
          </motion.h1>
        </div>

        {/* Right Section - View Controls & Notifications */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Board View Mode Toggle - Only show on board screen */}
          {currentScreen === 'board' && boardViewMode && onBoardViewModeChange && (
            <motion.button
              onClick={() => onBoardViewModeChange(boardViewMode === 'list' ? 'calendar' : 'list')}
              className="h-9 w-9 rounded-xl bg-background/60 backdrop-blur-sm border border-border/60 flex items-center justify-center transition-all duration-200 hover:bg-background hover:border-border touch-target-small"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title={boardViewMode === 'list' ? t('board.calendarView') : t('board.listView')}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={boardViewMode}
                  initial={{ rotate: -90, opacity: 0, scale: 0.8 }}
                  animate={{ rotate: 0, opacity: 1, scale: 1 }}
                  exit={{ rotate: 90, opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                >
                  {boardViewMode === 'list' ? (
                    <CalendarDays className="w-4 h-4 text-muted-foreground" />
                  ) : (
                    <List className="w-4 h-4 text-muted-foreground" />
                  )}
                </motion.div>
              </AnimatePresence>
            </motion.button>
          )}
          
          <NotificationButton
            overdueTasks={overdueTasks || []}
            onNavigateToNotifications={() => onNavigate('notifications')}
          />
        </div>
      </div>

      {/* Pending Membership Banner */}
      <AnimatePresence>
        {session?.membershipStatus === 'pending' && isInCompanyWorkspace && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-amber-500/5 border-t border-amber-500/20 px-4 py-2"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
                <p className="text-xs text-amber-600 dark:text-amber-400">
                  Your membership is pending approval. Some features may be limited.
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onNavigate('pending-approval')}
                className="h-6 px-2 text-xs text-amber-600 dark:text-amber-400 hover:bg-amber-500/10"
              >
                View Status
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}