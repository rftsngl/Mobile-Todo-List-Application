import React, { useState, useRef, useEffect } from 'react';
import { SharedHeader } from './SharedHeader';
import { BottomNavigation } from './BottomNavigation';
import { motion, AnimatePresence } from 'motion/react';
import { useSession } from './SessionProvider';
import { GlobalPendingBanner } from './shared/GlobalPendingBanner';
import { useLocalization } from './LocalizationProvider';

interface ApplicationShellProps {
  currentScreen: string;
  onNavigate: (screen: string) => void;
  overdueTasks: any[];
  onSwitchToPersonal?: () => void;
  onEditRequest?: () => void;
  onScrollToTop: (screen: string) => void;
  children: React.ReactNode;
  // Board view mode state
  boardViewMode?: 'list' | 'calendar';
  onBoardViewModeChange?: (mode: 'list' | 'calendar') => void;
}

export function ApplicationShell({
  currentScreen,
  onNavigate,
  overdueTasks,
  onSwitchToPersonal,
  onEditRequest,
  onScrollToTop,
  children,
  boardViewMode: externalBoardViewMode,
  onBoardViewModeChange: externalOnBoardViewModeChange
}: ApplicationShellProps) {
  const { session, isAdmin, isInCompanyWorkspace } = useSession();
  const { t } = useLocalization();
  const contentRef = useRef<HTMLDivElement>(null);
  const [lastActiveTab, setLastActiveTab] = useState(currentScreen);
  
  // Board view mode state - use external if provided, otherwise internal
  const [internalBoardViewMode, setInternalBoardViewMode] = useState<'list' | 'calendar'>('list');
  const boardViewMode = externalBoardViewMode || internalBoardViewMode;
  const setBoardViewMode = externalOnBoardViewModeChange || setInternalBoardViewMode;

  // [FIX-SHELL] Handle tab reselection for scroll-to-top
  const handleNavigation = (newScreen: string) => {
    if (newScreen === lastActiveTab && newScreen === currentScreen) {
      // Tab reselected - scroll to top
      onScrollToTop(newScreen);
      if (contentRef.current) {
        contentRef.current.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else {
      setLastActiveTab(newScreen);
      onNavigate(newScreen);
    }
  };

  // Determine if admin-only mode is active (admin user viewing admin screens)
  const adminOnlyMode = currentScreen === 'admin-dashboard' || currentScreen === 'admin-settings';

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* [FIX-SAFE] Global pending approval banner */}
      {session?.membershipStatus === 'pending' && (
        <GlobalPendingBanner
          companyName={session.workspaces.find(w => w.type === 'company')?.name || ''}
          onSwitchToPersonal={onSwitchToPersonal}
          onEditRequest={onEditRequest}
        />
      )}

      {/* [FIX-SHELL] SharedHeader - Always mounted, never unmounts */}
      <SharedHeader
        currentScreen={currentScreen}
        onNavigate={onNavigate}
        overdueTasks={overdueTasks}
        boardViewMode={boardViewMode}
        onBoardViewModeChange={setBoardViewMode}
      />

      {/* [FIX-SHELL] ContentSlot - Only this area changes content */}
      <main 
        ref={contentRef}
        className="flex-1 overflow-auto px-2 py-4 pb-20" // Added pb-20 for footer space
        style={{
          paddingBottom: 'max(5rem, env(safe-area-inset-bottom))' // Extra bottom padding for footer
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentScreen}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ 
              duration: 0.2, // [FIX-PERF] Reduced duration
              ease: [0.16, 1, 0.3, 1] 
            }}
          >
            {/* Clone children and pass boardViewMode props if it's BoardContent */}
            {React.Children.map(children, (child) => {
              if (React.isValidElement(child) && child.type && 
                  typeof child.type === 'function' && 
                  child.type.name === 'BoardContent') {
                return React.cloneElement(child, {
                  viewMode: boardViewMode,
                  onViewModeChange: setBoardViewMode
                } as any);
              }
              return child;
            })}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* [FIX-SHELL] BottomNavigation - Fixed at bottom */}
      <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md z-50">
        <BottomNavigation
          currentScreen={currentScreen}
          onNavigate={handleNavigation} // [FIX-SHELL] Use enhanced navigation
          showAdminTab={adminOnlyMode || (isAdmin && isInCompanyWorkspace)} // Allow admin tab in admin-only mode or when in company workspace
          adminOnlyMode={adminOnlyMode}
        />
      </div>

    </div>
  );
}