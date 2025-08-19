import React from 'react';
import { Badge } from '../ui/badge';
import { 
  FileText, 
  Play, 
  Clock, 
  AlertTriangle, 
  CheckCircle2,
  CircleDot
} from 'lucide-react';
import { motion } from 'motion/react';
import type { TaskStatus } from '../../constants/taskStatuses';

interface StatusChipProps {
  status: TaskStatus;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  animated?: boolean;
  className?: string;
}

const statusConfig = {
  'new': {
    label: 'New',
    i18nKey: 'task.status.new',
    icon: FileText,
    className: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/30 dark:text-blue-300 dark:border-blue-800/50',
    dotColor: 'bg-blue-500',
    bgGradient: 'from-blue-50/80 to-blue-100/50 dark:from-blue-950/20 dark:to-blue-900/30'
  },
  'in-progress': {
    label: 'In Progress',
    i18nKey: 'task.status.inProgress', 
    icon: Play,
    className: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-300 dark:border-amber-800/50',
    dotColor: 'bg-amber-500',
    bgGradient: 'from-amber-50/80 to-amber-100/50 dark:from-amber-950/20 dark:to-amber-900/30'
  },
  'pending-approval': {
    label: 'Pending Approval',
    i18nKey: 'task.status.pendingApproval',
    icon: Clock,
    className: 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950/30 dark:text-orange-300 dark:border-orange-800/50 animate-pulse',
    dotColor: 'bg-orange-500 animate-pulse',
    bgGradient: 'from-orange-50/80 to-orange-100/50 dark:from-orange-950/20 dark:to-orange-900/30'
  },
  'changes-requested': {
    label: 'Changes Requested',
    i18nKey: 'task.status.changesRequested',
    icon: AlertTriangle,
    className: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/30 dark:text-red-300 dark:border-red-800/50',
    dotColor: 'bg-red-500',
    bgGradient: 'from-red-50/80 to-red-100/50 dark:from-red-950/20 dark:to-red-900/30'
  },
  'done': {
    label: 'Done',
    i18nKey: 'task.status.done',
    icon: CheckCircle2,
    className: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-300 dark:border-emerald-800/50',
    dotColor: 'bg-emerald-500',
    bgGradient: 'from-emerald-50/80 to-emerald-100/50 dark:from-emerald-950/20 dark:to-emerald-900/30'
  }
} as const;

const sizeConfig = {
  sm: {
    className: 'px-2 py-0.5 text-xs',
    iconSize: 'w-3 h-3',
    dotSize: 'w-1.5 h-1.5'
  },
  md: {
    className: 'px-2.5 py-1 text-sm',
    iconSize: 'w-3.5 h-3.5', 
    dotSize: 'w-2 h-2'
  },
  lg: {
    className: 'px-3 py-1.5 text-sm',
    iconSize: 'w-4 h-4',
    dotSize: 'w-2.5 h-2.5'
  }
};

export function StatusChip({ 
  status, 
  size = 'md', 
  showIcon = true, 
  animated = false,
  className = '' 
}: StatusChipProps) {
  const config = statusConfig[status];
  const sizeStyles = sizeConfig[size];
  const IconComponent = config.icon;

  if (!config) {
    console.warn(`Unknown status: ${status}`);
    return null;
  }

  const badgeContent = (
    <div className="flex items-center space-x-1.5">
      {showIcon && (
        <div className="relative">
          <IconComponent className={sizeStyles.iconSize} />
          {status === 'pending-approval' && (
            <motion.div
              className={`absolute inset-0 ${config.dotColor} rounded-full blur-sm opacity-50`}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 0.8, 0.5]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          )}
        </div>
      )}
      
      <span className="relative">
        {config.label}
        
        {/* Subtle background gradient for enhanced visual appeal */}
        <div className={`absolute inset-0 bg-gradient-to-r ${config.bgGradient} opacity-0 group-hover:opacity-100 rounded-full transition-opacity duration-200`} />
      </span>

      {/* Status indicator dot */}
      <div className={`${sizeStyles.dotSize} ${config.dotColor} rounded-full flex-shrink-0`} />
    </div>
  );

  return animated ? (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{
        type: "spring",
        stiffness: 500,
        damping: 30
      }}
      whileHover={{ 
        scale: 1.05,
        transition: { duration: 0.15 }
      }}
      className="inline-block group"
    >
      <Badge 
        variant="secondary"
        className={`
          ${config.className} 
          ${sizeStyles.className} 
          ${className}
          font-medium
          border
          backdrop-blur-sm
          transition-all
          duration-200
          group-hover:shadow-sm
          relative
          overflow-hidden
        `}
      >
        {badgeContent}
      </Badge>
    </motion.div>
  ) : (
    <Badge 
      variant="secondary"
      className={`
        ${config.className} 
        ${sizeStyles.className} 
        ${className}
        font-medium
        border
        backdrop-blur-sm
        transition-all
        duration-200
        hover:shadow-sm
        group
      `}
    >
      {badgeContent}
    </Badge>
  );
}

// Export for use in other components
export { statusConfig };

// Helper function to get status color for use in other components
export function getStatusColor(status: TaskStatus): string {
  return statusConfig[status]?.className || statusConfig.new.className;
}

// Helper function to get status icon
export function getStatusIcon(status: TaskStatus) {
  return statusConfig[status]?.icon || statusConfig.new.icon;
}