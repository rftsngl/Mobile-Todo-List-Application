export type TaskStatus = 'new' | 'in-progress' | 'pending-approval' | 'changes-requested' | 'done';

export interface TaskStatusConfig {
  id: TaskStatus;
  label: string;
  description: string;
  color: string;
  bgColor: string;
  borderColor: string;
  textColor: string;
  icon: string;
  allowedTransitions: TaskStatus[];
  requiresApproval: boolean;
  adminOnly?: boolean;
}

export const taskStatuses: Record<TaskStatus, TaskStatusConfig> = {
  'new': {
    id: 'new',
    label: 'New',
    description: 'Task is newly created and ready to be worked on',
    color: 'bg-blue-50 dark:bg-blue-950/30',
    bgColor: 'from-blue-50/80 via-blue-50/40 to-background dark:from-blue-950/20 dark:via-blue-950/10 dark:to-background',
    borderColor: 'border-blue-200/60 dark:border-blue-800/50',
    textColor: 'text-blue-700 dark:text-blue-300',
    icon: '📝',
    allowedTransitions: ['in-progress'],
    requiresApproval: false
  },
  'in-progress': {
    id: 'in-progress',
    label: 'In Progress',
    description: 'Task is currently being worked on',
    color: 'bg-amber-50 dark:bg-amber-950/30',
    bgColor: 'from-amber-50/80 via-amber-50/40 to-background dark:from-amber-950/20 dark:via-amber-950/10 dark:to-background',
    borderColor: 'border-amber-200/60 dark:border-amber-800/50',
    textColor: 'text-amber-700 dark:text-amber-300',
    icon: '⚡',
    allowedTransitions: ['pending-approval', 'done', 'new'],
    requiresApproval: false
  },
  'pending-approval': {
    id: 'pending-approval',
    label: 'Pending Approval',
    description: 'Task is submitted and waiting for admin approval',
    color: 'bg-orange-50 dark:bg-orange-950/30',
    bgColor: 'from-orange-50/80 via-orange-50/40 to-background dark:from-orange-950/20 dark:via-orange-950/10 dark:to-background',
    borderColor: 'border-orange-200/60 dark:border-orange-800/50',
    textColor: 'text-orange-700 dark:text-orange-300',
    icon: '⏳',
    allowedTransitions: ['done', 'changes-requested', 'in-progress'],
    requiresApproval: true,
    adminOnly: true
  },
  'changes-requested': {
    id: 'changes-requested',
    label: 'Changes Requested',
    description: 'Admin has requested changes to this task',
    color: 'bg-red-50 dark:bg-red-950/30',
    bgColor: 'from-red-50/80 via-red-50/40 to-background dark:from-red-950/20 dark:via-red-950/10 dark:to-background',
    borderColor: 'border-red-200/60 dark:border-red-800/50',
    textColor: 'text-red-700 dark:text-red-300',
    icon: '⚠️',
    allowedTransitions: ['in-progress', 'pending-approval'],
    requiresApproval: false
  },
  'done': {
    id: 'done',
    label: 'Done',
    description: 'Task has been completed and approved',
    color: 'bg-emerald-50 dark:bg-emerald-950/30',
    bgColor: 'from-emerald-50/80 via-emerald-50/40 to-background dark:from-emerald-950/20 dark:via-emerald-950/10 dark:to-background',
    borderColor: 'border-emerald-200/60 dark:border-emerald-800/50',
    textColor: 'text-emerald-700 dark:text-emerald-300',
    icon: '✅',
    allowedTransitions: ['in-progress'], // Allow reopening if needed
    requiresApproval: false,
    adminOnly: true // Only admins can mark as done in corporate environment
  }
};

// Helper functions
export const getTaskStatus = (status: TaskStatus) => taskStatuses[status];

export const canTransitionTo = (currentStatus: TaskStatus, targetStatus: TaskStatus) => {
  return taskStatuses[currentStatus].allowedTransitions.includes(targetStatus);
};

export const getAvailableTransitions = (currentStatus: TaskStatus, isAdmin: boolean = false) => {
  const availableTransitions = taskStatuses[currentStatus].allowedTransitions;
  
  if (!isAdmin) {
    // Filter out admin-only transitions
    return availableTransitions.filter(status => !taskStatuses[status].adminOnly);
  }
  
  return availableTransitions;
};

export const requiresApprovalToTransition = (fromStatus: TaskStatus, toStatus: TaskStatus) => {
  // If transitioning to a status that requires approval
  if (taskStatuses[toStatus].requiresApproval) return true;
  
  // Special cases where approval is needed
  if (fromStatus === 'in-progress' && toStatus === 'done') return true;
  
  return false;
};

// Status chips configuration for UI
export const statusChipConfig = {
  'new': {
    className: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200',
    icon: '📝'
  },
  'in-progress': {
    className: 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-200',
    icon: '⚡'
  },
  'pending-approval': {
    className: 'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-200 animate-pulse',
    icon: '⏳'
  },
  'changes-requested': {
    className: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200',
    icon: '⚠️'
  },
  'done': {
    className: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-200',
    icon: '✅'
  }
} as const;