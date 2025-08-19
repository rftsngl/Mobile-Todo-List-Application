import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '../ui/button';
import { 
  Clock, 
  X, 
  ArrowRight, 
  Edit3,
  User,
  AlertCircle
} from 'lucide-react';
import { useSession } from '../SessionProvider';

interface GlobalPendingBannerProps {
  onSwitchToPersonal?: () => void;
  onEditRequest?: () => void;
  className?: string;
}

export function GlobalPendingBanner({ 
  onSwitchToPersonal, 
  onEditRequest,
  className = '' 
}: GlobalPendingBannerProps) {
  const { session, currentWorkspace, isInCompanyWorkspace } = useSession();
  const [isDismissed, setIsDismissed] = useState(false);

  // Only show if user has pending membership in a company workspace
  const shouldShow = session?.membershipStatus === 'pending' && 
                    isInCompanyWorkspace && 
                    !isDismissed;

  if (!shouldShow) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: 'auto', opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        transition={{ 
          duration: 0.3,
          ease: [0.16, 1, 0.3, 1]
        }}
        className={`
          bg-gradient-to-r from-amber-50/80 via-amber-50/60 to-orange-50/80 
          dark:from-amber-950/30 dark:via-amber-950/20 dark:to-orange-950/30
          border-b border-amber-200/60 dark:border-amber-800/50
          backdrop-blur-sm
          relative overflow-hidden
          ${className}
        `}
        style={{
          /* @dev-annotation: i18n key - banner.pendingMembership.container */
        }}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-20">
          <motion.div
            className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-amber-300/30 to-transparent"
            animate={{
              x: [100, -100],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        </div>

        <div className="relative z-10 px-4 py-3">
          <div className="flex items-center justify-between max-w-md mx-auto">
            
            {/* Left Section - Status Info */}
            <div className="flex items-center space-x-3 min-w-0 flex-1">
              {/* Animated Status Icon */}
              <motion.div
                className="relative flex-shrink-0"
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <div className="w-8 h-8 bg-amber-100 dark:bg-amber-900/50 rounded-full flex items-center justify-center backdrop-blur-sm border border-amber-200/60 dark:border-amber-700/50">
                  <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                </div>
                
                {/* Pulsing Ring */}
                <motion.div
                  className="absolute inset-0 border-2 border-amber-400/50 rounded-full"
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.5, 0, 0.5]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeOut"
                  }}
                />
              </motion.div>

              {/* Message */}
              <div className="min-w-0 flex-1">
                <p className="text-sm text-amber-700 dark:text-amber-300 leading-tight">
                  {/* @dev-annotation: i18n key - banner.pendingMembership.title */}
                  <span className="font-medium">Membership pending</span>
                  {currentWorkspace && (
                    <span className="text-amber-600/80 dark:text-amber-400/80">
                      {' '}for {currentWorkspace.name}
                    </span>
                  )}
                </p>
                <p className="text-xs text-amber-600/80 dark:text-amber-400/80 mt-0.5">
                  {/* @dev-annotation: i18n key - banner.pendingMembership.subtitle */}
                  Some features are limited during review
                </p>
              </div>
            </div>

            {/* Right Section - Actions */}
            <div className="flex items-center space-x-2 flex-shrink-0">
              {/* Switch to Personal */}
              {onSwitchToPersonal && (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onSwitchToPersonal}
                    className="h-7 px-2 text-xs text-amber-700 dark:text-amber-300 hover:bg-amber-100/50 dark:hover:bg-amber-900/30 transition-all duration-200"
                  >
                    <User className="w-3 h-3 mr-1" />
                    {/* @dev-annotation: i18n key - banner.pendingMembership.cta.switch */}
                    <span>Switch to Personal</span>
                  </Button>
                </motion.div>
              )}

              {/* Edit Request */}
              {onEditRequest && (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onEditRequest}
                    className="h-7 px-2 text-xs text-amber-700 dark:text-amber-300 hover:bg-amber-100/50 dark:hover:bg-amber-900/30 transition-all duration-200"
                  >
                    <Edit3 className="w-3 h-3 mr-1" />
                    {/* @dev-annotation: i18n key - banner.pendingMembership.cta.edit */}
                    <span>Edit Request</span>
                  </Button>
                </motion.div>
              )}

              {/* Dismiss Button */}
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <button
                  onClick={() => setIsDismissed(true)}
                  className="w-6 h-6 rounded-full bg-amber-100/50 dark:bg-amber-900/30 hover:bg-amber-200/50 dark:hover:bg-amber-800/40 flex items-center justify-center transition-all duration-200 backdrop-blur-sm border border-amber-200/60 dark:border-amber-700/50"
                  aria-label="Dismiss banner"
                >
                  <X className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                </button>
              </motion.div>
            </div>
          </div>

          {/* Progress Indicator */}
          <motion.div
            className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-amber-400 to-orange-400"
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ 
              duration: 8,
              ease: "easeInOut",
              repeat: Infinity,
              repeatType: "reverse"
            }}
          />
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

// Export for use with session hooks
export function useGlobalPendingBanner() {
  const { session, isInCompanyWorkspace } = useSession();
  
  return {
    shouldShowBanner: session?.membershipStatus === 'pending' && isInCompanyWorkspace,
    companyName: session?.workspaces.find(w => w.type === 'company')?.name
  };
}