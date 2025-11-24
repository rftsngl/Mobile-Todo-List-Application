import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from './utils';
import { TaskItem, TASK_ITEM_HEIGHT } from './TaskItem';

interface TaskItemProps {
  id: string;
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
}

interface VirtualizedListProps {
  items: TaskItemProps[];
  renderItem?: (item: TaskItemProps, index: number) => React.ReactNode;
  emptyState?: React.ReactNode;
  loading?: boolean;
  variant?: 'comfortable' | 'compact';
  className?: string;
  itemClassName?: string;
  onItemClick?: (item: TaskItemProps) => void;
  onItemToggle?: (itemId: string) => void;
  onItemEdit?: (itemId: string) => void;
  onItemDelete?: (itemId: string) => void;
  onItemArchive?: (itemId: string) => void;
}

// Empty State Component
function EmptyState({ 
  title = "No tasks found",
  description = "Create your first task to get started",
  icon,
  action
}: {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col items-center justify-center py-16 px-8 text-center"
    >
      {icon && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 15 }}
          className="mb-6 p-4 rounded-2xl bg-muted/50"
        >
          {icon}
        </motion.div>
      )}
      
      <motion.h3
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.3 }}
        className="text-lg text-muted-foreground mb-2"
      >
        {title}
      </motion.h3>
      
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.3 }}
        className="text-sm text-muted-foreground/80 mb-6 max-w-xs"
      >
        {description}
      </motion.p>
      
      {action && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.3 }}
        >
          {action}
        </motion.div>
      )}
    </motion.div>
  );
}

export function VirtualizedList({
  items,
  renderItem,
  emptyState,
  loading = false,
  variant = 'comfortable',
  className,
  itemClassName,
  onItemClick,
  onItemToggle,
  onItemEdit,
  onItemDelete,
  onItemArchive
}: VirtualizedListProps) {
  // [FIX-LIST] Use exported constants for consistent height
  const rowHeight = variant === 'compact' ? TASK_ITEM_HEIGHT.COMPACT : TASK_ITEM_HEIGHT.COMFORTABLE;
  const estimatedItemSize = rowHeight;
  
  // Default item renderer
  const defaultRenderItem = (item: TaskItemProps, index: number) => (
    <TaskItem
      {...item}
      density={variant}
      onClick={onItemClick ? () => onItemClick(item) : undefined}
      onToggleComplete={onItemToggle}
      onEdit={onItemEdit}
      onDelete={onItemDelete}
      onArchive={onItemArchive}
    />
  );

  const itemRenderer = renderItem || defaultRenderItem;

  if (loading) {
    return (
      <div className={cn('space-y-3 p-4', className)}>
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="rounded-xl bg-muted/20 animate-pulse"
            style={{ 
              height: `${rowHeight}px`,
              animationDelay: `${i * 100}ms` 
            }}
          />
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    if (emptyState) {
      return <div className={className}>{emptyState}</div>;
    }
    
    return (
      <div className={className}>
        <EmptyState />
      </div>
    );
  }

  // [FIX-LIST] For virtualization threshold (250+ items), use react-window
  const shouldVirtualize = items.length > 250;
  
  if (shouldVirtualize) {
    // TODO: Implement react-window FixedSizeList for large datasets
    console.log(`[FIX-LIST] Should virtualize ${items.length} items with estimatedItemSize=${estimatedItemSize}px`);
  }

  return (
    <div className={cn('space-y-3', className)}>
      <AnimatePresence mode="popLayout">
        {items.map((item, index) => (
          <motion.div
            key={item.id}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -100, scale: 0.95 }}
            transition={{
              duration: 0.2,
              ease: [0.16, 1, 0.3, 1],
              delay: Math.min(index * 0.05, 0.3), // [FIX-LIST] Cap animation delay
              layout: { duration: 0.2 }
            }}
            className={itemClassName}
            style={{ 
              height: `${rowHeight}px`, // [FIX-LIST] Fixed height for consistency
              minHeight: `${rowHeight}px`,
              maxHeight: `${rowHeight}px`
            }}
          >
            {itemRenderer(item, index)}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

// Export EmptyState for standalone use
export { EmptyState };