import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CheckCircle2, 
  Circle, 
  ChevronDown, 
  ChevronUp,
  Flag,
  Users,
  Calendar,
  MoreVertical,
  Archive,
  Edit,
  Trash2,
  Plus
} from 'lucide-react';
import { cn } from './utils';
import { StatusChip } from '../shared/StatusChip';

export interface TaskItemExpandedProps {
  // Core task data
  id: string;
  title: string;
  description?: string;
  completed?: boolean;
  dueDate?: string; // ISO 8601 format
  priority?: 'low' | 'medium' | 'high';
  assignee?: {
    id: string;
    name: string;
    avatar?: string;
  };
  subtasks?: Array<{
    id: string;
    title: string;
    completed: boolean;
  }>;
  tags?: string[];
  
  // Visual state
  state?: 'normal' | 'completed' | 'overdue';
  
  // Interaction handlers
  onToggleComplete?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onArchive?: (id: string) => void;
  onClick?: (id: string) => void;
  onSubtaskToggle?: (taskId: string, subtaskId: string) => void;
  onAddSubtask?: (taskId: string) => void;
  onEditSubtask?: (taskId: string, subtaskId: string) => void;
}

export function TaskItemExpanded({
  id,
  title,
  description,
  completed = false,
  dueDate,
  priority = 'medium',
  assignee,
  subtasks = [],
  tags = [],
  state = 'normal',
  onToggleComplete,
  onEdit,
  onDelete,
  onArchive,
  onClick,
  onSubtaskToggle,
  onAddSubtask,
  onEditSubtask
}: TaskItemExpandedProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [showActions, setShowActions] = useState(false);

  // Determine visual state using design system rules
  const isCompleted = completed || state === 'completed';
  const isOverdue = state === 'overdue' || (!completed && dueDate && new Date(dueDate) < new Date());
  const hasSubtasks = subtasks.length > 0;

  // Priority colors using semantic tokens
  const priorityColorMap = {
    low: 'text-[var(--priority-low)]',
    medium: 'text-[var(--priority-medium)]', 
    high: 'text-[var(--priority-high)]'
  };

  const stateStyles = {
    normal: 'bg-[var(--ui-card)] border-[var(--ui-border)]',
    completed: 'bg-[var(--ui-surface)] border-[var(--ui-border)] opacity-75',
    overdue: 'bg-[var(--ui-card)] border-[var(--status-danger)]/30 shadow-[var(--elevation-1)]'
  };

  return (
    <div className={cn(
      'relative overflow-hidden border transition-smooth rounded-[var(--radius-16)]',
      stateStyles[isOverdue ? 'overdue' : isCompleted ? 'completed' : 'normal'],
      'hover:shadow-[var(--elevation-2)]'
    )}>
      {/* Main Content */}
      <div className="p-6">
        {/* Header Section */}
        <div className="flex items-start gap-4 mb-4">
          {/* Completion Toggle - Large touch target for detail view */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onToggleComplete?.(id)}
            className="flex-shrink-0 w-8 h-8 flex items-center justify-center transition-smooth rounded-full"
            aria-label={isCompleted ? 'Mark as incomplete' : 'Mark as complete'}
          >
            {isCompleted ? (
              <CheckCircle2 className="w-8 h-8 text-[var(--action-primary)]" />
            ) : (
              <Circle className={cn(
                'w-8 h-8',
                isOverdue ? 'text-[var(--status-danger)]' : 'text-[var(--text-muted)] hover:text-[var(--action-primary)]'
              )} />
            )}
          </motion.button>

          {/* Content Area */}
          <div className="flex-1 min-w-0">
            {/* Title and Priority */}
            <div className="flex items-start justify-between gap-3 mb-2">
              <h2 
                className={cn(
                  'text-lg font-medium leading-tight',
                  isCompleted && 'line-through text-muted-foreground',
                  isOverdue && !isCompleted && 'text-destructive'
                )}
                onClick={() => onClick?.(id)}
              >
                {title}
              </h2>
              
              {/* Priority Flag */}
              {priority !== 'medium' && (
                <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-muted/20">
                  <Flag className={cn('w-4 h-4', priorityColorMap[priority])} />
                  <span className={cn('text-xs font-medium capitalize', priorityColorMap[priority])}>
                    {priority}
                  </span>
                </div>
              )}
            </div>

            {/* Description */}
            {description && (
              <p className={cn(
                'text-sm text-muted-foreground mb-4 leading-relaxed',
                isCompleted && 'line-through'
              )}>
                {description}
              </p>
            )}

            {/* Metadata Row */}
            <div className="flex items-center gap-3 flex-wrap mb-4">
              {/* Due Date */}
              {dueDate && (
                <div className={cn(
                  'flex items-center gap-2 text-sm px-3 py-2 rounded-lg bg-muted/30',
                  isOverdue && !isCompleted && 'bg-destructive/10 text-destructive'
                )}>
                  <Calendar className="w-4 h-4" />
                  <span>Due {new Date(dueDate).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric',
                    year: 'numeric'
                  })}</span>
                </div>
              )}

              {/* Assignee */}
              {assignee && (
                <div className="flex items-center gap-2 text-sm px-3 py-2 rounded-lg bg-muted/30">
                  <Users className="w-4 h-4" />
                  <span>{assignee.name}</span>
                </div>
              )}
            </div>

            {/* Tags */}
            {tags.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap mb-4">
                {tags.map((tag, index) => (
                  <StatusChip
                    key={index}
                    status={tag as any}
                    size="sm"
                  />
                ))}
              </div>
            )}
          </div>

          {/* Actions Menu */}
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowActions(!showActions)}
              className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-foreground transition-smooth rounded-lg hover:bg-muted/20"
              aria-label="More options"
            >
              <MoreVertical className="w-5 h-5" />
            </motion.button>

            {/* Actions Menu Dropdown */}
            <AnimatePresence>
              {showActions && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  className="absolute right-0 top-full mt-2 bg-[var(--ui-card)] border border-[var(--ui-border)] rounded-lg shadow-lg z-10 min-w-32"
                >
                  <button
                    onClick={() => { onEdit?.(id); setShowActions(false); }}
                    className="w-full px-3 py-2 text-left text-sm hover:bg-muted/20 transition-smooth flex items-center gap-2 first:rounded-t-lg"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => { onArchive?.(id); setShowActions(false); }}
                    className="w-full px-3 py-2 text-left text-sm hover:bg-muted/20 transition-smooth flex items-center gap-2"
                  >
                    <Archive className="w-4 h-4" />
                    Archive
                  </button>
                  <button
                    onClick={() => { onDelete?.(id); setShowActions(false); }}
                    className="w-full px-3 py-2 text-left text-sm hover:bg-destructive/10 text-destructive transition-smooth flex items-center gap-2 last:rounded-b-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Subtasks Section */}
        {hasSubtasks && (
          <div className="border-t border-[var(--ui-border)] pt-4">
            {/* Subtasks Header */}
            <div className="flex items-center justify-between mb-3">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-smooth"
              >
                {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
                Subtasks ({subtasks.filter(st => st.completed).length}/{subtasks.length})
              </button>
              
              {onAddSubtask && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onAddSubtask(id)}
                  className="w-6 h-6 flex items-center justify-center text-primary hover:bg-primary/10 rounded transition-smooth"
                  aria-label="Add subtask"
                >
                  <Plus className="w-4 h-4" />
                </motion.button>
              )}
            </div>

            {/* Subtasks List */}
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                  className="space-y-2 overflow-hidden"
                >
                  {subtasks.map((subtask) => (
                    <motion.div
                      key={subtask.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/10 transition-smooth group"
                    >
                      <button
                        onClick={() => onSubtaskToggle?.(id, subtask.id)}
                        className="flex-shrink-0"
                      >
                        {subtask.completed ? (
                          <CheckCircle2 className="w-5 h-5 text-primary" />
                        ) : (
                          <Circle className="w-5 h-5 text-muted-foreground hover:text-primary transition-smooth" />
                        )}
                      </button>
                      
                      <span className={cn(
                        'flex-1 text-sm',
                        subtask.completed && 'line-through text-muted-foreground'
                      )}>
                        {subtask.title}
                      </span>
                      
                      {onEditSubtask && (
                        <button
                          onClick={() => onEditSubtask(id, subtask.id)}
                          className="opacity-0 group-hover:opacity-100 w-6 h-6 flex items-center justify-center text-muted-foreground hover:text-foreground transition-smooth rounded"
                          aria-label="Edit subtask"
                        >
                          <Edit className="w-3 h-3" />
                        </button>
                      )}
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Overdue Indicator */}
      {isOverdue && !isCompleted && (
        <div className="absolute top-0 right-0 w-3 h-3 bg-destructive rounded-bl-lg" />
      )}

      {/* Completion Overlay */}
      {isCompleted && (
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          className="absolute inset-0 bg-primary/5 backdrop-blur-[0.5px] origin-left pointer-events-none"
        />
      )}
    </div>
  );
}