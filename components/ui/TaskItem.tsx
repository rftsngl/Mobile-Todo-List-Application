import React from 'react';
import { MoreVertical, Clock, Flag, CheckCircle2, Circle } from 'lucide-react';
import { motion } from 'motion/react';
import { StatusChip } from '../shared/StatusChip';
import { useLocalization } from '../LocalizationProvider';
import type { Task } from '../../types/Task';

// [FIX-LIST] Exported height constants for virtualization
export const TASK_ITEM_HEIGHT = {
  COMFORTABLE: 64,
  COMPACT: 56
} as const;

interface TaskItemProps {
  task?: Task;
  title?: string;
  description?: string;
  priority?: 'low' | 'medium' | 'high';
  completed?: boolean;
  dueDate?: string;
  assignee?: {
    id: number;
    name: string;
    email: string;
    avatar?: string;
  };
  subtasks?: Array<{ id: number; title: string; completed: boolean }>;
  onToggleComplete?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onViewDetails?: () => void;
  className?: string;
  density?: 'comfortable' | 'compact';
  showActions?: boolean;
}

export function TaskItem({
  task,
  title = task?.title || '',
  description = task?.description || '',
  priority = task?.priority || 'medium',
  completed = task?.completed || false,
  dueDate = task?.dueDate || '',
  assignee = task?.assignee,
  subtasks = task?.subtasks || [],
  onToggleComplete,
  onEdit,
  onDelete,
  onViewDetails,
  className = '',
  density = 'comfortable',
  showActions = true
}: TaskItemProps) {
  const { t } = useLocalization();

  // [FIX-LIST] Fixed row heights for virtualization - use exported constants
  const rowHeight = density === 'comfortable' ? TASK_ITEM_HEIGHT.COMFORTABLE : TASK_ITEM_HEIGHT.COMPACT;
  
  const priorityColors = {
    low: 'var(--color-success)',
    medium: 'var(--color-warning)', 
    high: 'var(--color-danger)'
  };

  const priorityBgColors = {
    low: 'rgba(16, 185, 129, 0.1)',
    medium: 'rgba(245, 158, 11, 0.1)',
    high: 'rgba(212, 24, 61, 0.1)'
  };

  // Format due date for display
  const formatDueDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const diffTime = date.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return t('common.today');
    if (diffDays === 1) return t('common.tomorrow');
    if (diffDays === -1) return t('common.yesterday');
    if (diffDays < 0) return t('common.overdue', { days: Math.abs(diffDays) });
    if (diffDays < 7) return t('common.in_days', { days: diffDays });
    
    return new Intl.DateTimeFormat('tr-TR', {
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  const isOverdue = dueDate && new Date(dueDate) < new Date() && !completed;

  return (
    <motion.div
      className={`
        bg-card border border-border rounded-lg 
        transition-smooth hover:shadow-md
        ${completed ? 'opacity-60' : ''}
        ${className}
      `}
      style={{ 
        height: `${rowHeight}px`, // [FIX-LIST] Fixed height
        minHeight: `${rowHeight}px`,
        maxHeight: `${rowHeight}px`
      }}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      onClick={onViewDetails}
    >
      <div className={`
        flex items-center gap-3 h-full
        ${density === 'comfortable' ? 'px-4' : 'px-3'}
      `}>
        {/* [FIX-TT] Completion toggle with proper touch target */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleComplete?.();
          }}
          className="flex-shrink-0 transition-smooth hover:scale-110 rounded-lg flex items-center justify-center"
          style={{ 
            minWidth: '44px', 
            minHeight: '44px',
            padding: '8px' // [FIX-TT] hitSlop for easier tapping
          }}
          aria-label={completed ? t('task.mark_incomplete') : t('task.mark_complete')}
        >
          {completed ? (
            <CheckCircle2 className="w-5 h-5 text-success" />
          ) : (
            <Circle className="w-5 h-5 text-muted-foreground hover:text-primary" />
          )}
        </button>

        {/* Main content area */}
        <div className="flex-1 min-w-0 space-y-1">
          {/* Title and priority */}
          <div className="flex items-center gap-2">
            <h3 className={`
              font-medium truncate
              ${completed ? 'line-through text-muted-foreground' : 'text-primary'}
              ${density === 'compact' ? 'text-sm' : 'text-base'}
            `}>
              {title || t('task.untitled')}
            </h3>
            
            {/* [FIX-CTR] Priority flag with proper contrast */}
            <div 
              className="flex-shrink-0 w-3 h-3 rounded-full"
              style={{ 
                backgroundColor: priorityColors[priority],
                opacity: completed ? 0.5 : 1
              }}
              title={t(`priority.${priority}`)}
            />
          </div>

          {/* Due date and subtasks info */}
          <div className="flex items-center gap-4 text-xs">
            {dueDate && (
              <div className={`
                flex items-center gap-1
                ${isOverdue ? 'text-danger' : 'text-secondary'}
              `}>
                <Clock className="w-3 h-3" />
                <span>{formatDueDate(dueDate)}</span>
              </div>
            )}
            
            {subtasks.length > 0 && (
              <div className="flex items-center gap-1 text-secondary">
                <Flag className="w-3 h-3" />
                <span>
                  {subtasks.filter(st => st.completed).length}/{subtasks.length} {t('task.subtasks')}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* [FIX-TT] More actions button with proper touch target */}
        {showActions && (
          <div className="flex-shrink-0">
            <button
              onClick={(e) => {
                e.stopPropagation();
                // Show context menu or dropdown
                console.log('[FIX-TT] More actions clicked');
              }}
              className="transition-smooth hover:bg-muted rounded-lg flex items-center justify-center"
              style={{ 
                minWidth: '44px', 
                minHeight: '44px',
                padding: '8px' // [FIX-TT] hitSlop for easier tapping
              }}
              aria-label={t('common.more_options')}
            >
              <MoreVertical className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
        )}

        {/* Assignee avatar (if present) */}
        {assignee && (
          <div className="flex-shrink-0">
            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
              {assignee.avatar ? (
                <img 
                  src={assignee.avatar} 
                  alt={assignee.name}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <span className="text-xs font-medium text-muted-foreground">
                  {assignee.name.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}