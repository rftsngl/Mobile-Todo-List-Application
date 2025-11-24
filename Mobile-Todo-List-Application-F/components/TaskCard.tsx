import React from 'react';
import { motion } from 'motion/react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { 
  Calendar,
  Clock,
  ChevronRight,
  AlertCircle,
  CheckCircle2,
  User
} from 'lucide-react';
import { TaskCardMoreMenu, type Task } from './shared/TaskCardMoreMenu';

const priorityColors = {
  low: 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-400',
  medium: 'bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-950 dark:text-amber-400',
  high: 'bg-red-50 text-red-600 border-red-200 dark:bg-red-950 dark:text-red-400'
};

const categoryColors = [
  'bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-950 dark:text-blue-400',
  'bg-purple-50 text-purple-600 border-purple-200 dark:bg-purple-950 dark:text-purple-400',
  'bg-pink-50 text-pink-600 border-pink-200 dark:bg-pink-950 dark:text-pink-400',
  'bg-indigo-50 text-indigo-600 border-indigo-200 dark:bg-indigo-950 dark:text-indigo-400'
];

interface TaskCardProps {
  task: Task;
  onClick?: () => void;
  onView?: (task: Task) => void;
  onEdit?: (task: Task) => void;
  onToggle?: (taskId: number) => void;
  onDelete?: (taskId: number) => void;
  onArchive?: (taskId: number) => void;
  onShare?: (task: Task) => void;
  showMoreMenu?: boolean;
  className?: string;
}

export const TaskCard = React.forwardRef<HTMLDivElement, TaskCardProps>(({ 
  task, 
  onClick, 
  onView,
  onEdit,
  onToggle,
  onDelete,
  onArchive,
  onShare,
  showMoreMenu = true,
  className = '' 
}, ref) => {
  const isOverdue = !task.completed && new Date(task.dueDate) < new Date();
  const isDueToday = !task.completed && new Date(task.dueDate).toDateString() === new Date().toDateString();
  
  const getCategoryColor = (category: string) => {
    const hash = category.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return categoryColors[hash % categoryColors.length];
  };

  const formatDueDate = (date: string) => {
    const dueDate = new Date(date);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (dueDate.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (dueDate.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return dueDate.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  // Handle card click, but prevent if clicking on more menu
  const handleCardClick = (e: React.MouseEvent) => {
    // Don't trigger card click if clicking on more menu or its trigger
    if (e.target instanceof Element && 
        (e.target.closest('[data-radix-dropdown-menu-trigger]') || 
         e.target.closest('[data-radix-dropdown-menu-content]'))) {
      return;
    }
    onClick?.();
  };

  return (
    <motion.div
      ref={ref}
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      transition={{ 
        duration: 0.2, 
        ease: [0.16, 1, 0.3, 1] 
      }}
    >
      <Card 
        className={`
          p-4 cursor-pointer border transition-all duration-200
          ${task.completed 
            ? 'bg-muted/30 border-muted text-muted-foreground' 
            : 'bg-card hover:shadow-md hover:border-primary/20'
          }
          ${isOverdue && !task.completed 
            ? 'border-destructive/40 bg-destructive/5' 
            : ''
          }
          ${className}
        `}
        onClick={handleCardClick}
      >
        {/* Header with Title and More Menu */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              {/* Completion Status Icon */}
              <div className="shrink-0">
                {task.completed ? (
                  <CheckCircle2 className="w-4 h-4 text-success" />
                ) : (
                  <div className={`w-4 h-4 rounded-full border-2 ${
                    isOverdue 
                      ? 'border-destructive' 
                      : 'border-muted-foreground/40'
                  }`} />
                )}
              </div>

              {/* Title */}
              <h3 className={`font-medium truncate ${
                task.completed ? 'line-through' : ''
              }`}>
                {task.title}
              </h3>
            </div>

            {/* Description */}
            {task.description && (
              <p className="text-sm text-muted-foreground line-clamp-2 ml-6">
                {task.description}
              </p>
            )}
          </div>

          {/* More Menu */}
          {showMoreMenu && (
            <div className="shrink-0">
              <TaskCardMoreMenu
                task={task}
                onView={onView}
                onEdit={onEdit}
                onToggle={onToggle}
                onDelete={onDelete}
                onArchive={onArchive}
                onShare={onShare}
              />
            </div>
          )}
        </div>

        {/* Metadata Row */}
        <div className="flex items-center justify-between gap-2 ml-6">
          <div className="flex items-center gap-2 flex-wrap">
            {/* Priority Badge */}
            <Badge 
              variant="outline" 
              className={`text-xs ${priorityColors[task.priority]}`}
            >
              {task.priority}
            </Badge>

            {/* Category Badge */}
            {task.category && (
              <Badge 
                variant="outline" 
                className={`text-xs ${getCategoryColor(task.category)}`}
              >
                {task.category}
              </Badge>
            )}

            {/* Assignee */}
            {task.assignee && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <User className="w-3 h-3" />
                <span>{task.assignee}</span>
              </div>
            )}
          </div>

          {/* Due Date */}
          <div className="flex items-center gap-1 text-xs shrink-0">
            {isOverdue ? (
              <>
                <AlertCircle className="w-3 h-3 text-destructive" />
                <span className="text-destructive">
                  {formatDueDate(task.dueDate)}
                </span>
              </>
            ) : isDueToday ? (
              <>
                <Clock className="w-3 h-3 text-warning" />
                <span className="text-warning">
                  {formatDueDate(task.dueDate)}
                </span>
              </>
            ) : (
              <>
                <Calendar className="w-3 h-3 text-muted-foreground" />
                <span className="text-muted-foreground">
                  {formatDueDate(task.dueDate)}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Click indicator for non-interactive cards */}
        {onClick && !showMoreMenu && (
          <div className="flex justify-end mt-2">
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </div>
        )}
      </Card>
    </motion.div>
  );
});

TaskCard.displayName = 'TaskCard';