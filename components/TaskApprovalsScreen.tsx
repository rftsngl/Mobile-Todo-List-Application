import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Textarea } from './ui/textarea';
import { Alert, AlertDescription } from './ui/alert';
import { ScrollArea } from './ui/scroll-area';
import { StatusChip } from './shared/StatusChip';
import { AssigneePicker, TeamMember } from './shared/AssigneePicker';
import { 
  ArrowLeft,
  Search,
  Filter,
  Clock,
  CheckCircle2,
  AlertTriangle,
  User,
  Calendar,
  Flag,
  Tag,
  MessageSquare,
  Loader2,
  RotateCcw,
  UserCheck
} from 'lucide-react';
import { useSession } from './SessionProvider';
import type { TaskStatus } from '../constants/taskStatuses';

interface TaskApprovalRequest {
  id: string;
  title: string;
  description: string;
  assigneeId: string;
  assigneeName: string;
  assigneeAvatar?: string;
  submittedAt: string;
  dueDate?: string;
  priority: 'low' | 'medium' | 'high';
  status: TaskStatus;
  tags: string[];
  lastNote?: string;
  activity: TaskActivity[];
}

interface TaskActivity {
  id: string;
  type: 'status_change' | 'comment' | 'reassign';
  message: string;
  timestamp: string;
  author: string;
  note?: string;
}

interface TaskApprovalsScreenProps {
  onNavigate: (screen: string) => void;
}

// Mock team members for reassignment
const mockTeamMembers: TeamMember[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah@acme.com',
    role: 'member',
    isOnline: true
  },
  {
    id: '2',
    name: 'Mike Chen',
    email: 'mike@acme.com',
    role: 'admin',
    isOnline: false,
    lastActive: '2h ago'
  },
  {
    id: '3',
    name: 'Emma Rodriguez',
    email: 'emma@acme.com',
    role: 'member',
    isOnline: true
  }
];

// Mock task approval data
const mockTaskApprovals: TaskApprovalRequest[] = [
  {
    id: '1',
    title: 'Mobile App UI Design',
    description: 'Complete the mobile application user interface design for the new feature set.',
    assigneeId: '1',
    assigneeName: 'Sarah Johnson',
    submittedAt: '2024-01-15T14:30:00Z',
    dueDate: '2024-01-20T17:00:00Z',
    priority: 'high',
    status: 'pending-approval',
    tags: ['design', 'mobile', 'ui'],
    activity: [
      {
        id: '1',
        type: 'status_change',
        message: 'Task submitted for approval',
        timestamp: '2024-01-15T14:30:00Z',
        author: 'Sarah Johnson'
      }
    ]
  },
  {
    id: '2',
    title: 'API Integration Testing',
    description: 'Test and validate the new API endpoints for the payment system integration.',
    assigneeId: '2',
    assigneeName: 'Mike Chen',
    submittedAt: '2024-01-15T11:15:00Z',
    dueDate: '2024-01-18T12:00:00Z',
    priority: 'medium',
    status: 'changes-requested',
    tags: ['backend', 'testing', 'api'],
    lastNote: 'Please add more comprehensive error handling tests.',
    activity: [
      {
        id: '1',
        type: 'status_change',
        message: 'Task submitted for approval',
        timestamp: '2024-01-15T11:15:00Z',
        author: 'Mike Chen'
      },
      {
        id: '2',
        type: 'comment',
        message: 'Changes requested',
        timestamp: '2024-01-15T13:20:00Z',
        author: 'Admin',
        note: 'Please add more comprehensive error handling tests.'
      }
    ]
  },
  {
    id: '3',
    title: 'Database Migration Script',
    description: 'Create migration scripts for the new user profile schema changes.',
    assigneeId: '3',
    assigneeName: 'Emma Rodriguez',
    submittedAt: '2024-01-14T16:45:00Z',
    dueDate: '2024-01-17T09:00:00Z',
    priority: 'low',
    status: 'pending-approval',
    tags: ['database', 'migration'],
    activity: [
      {
        id: '1',
        type: 'status_change',
        message: 'Task submitted for approval',
        timestamp: '2024-01-14T16:45:00Z',
        author: 'Emma Rodriguez'
      }
    ]
  }
];

type FilterType = 'all' | 'new' | 'changes-requested';

export function TaskApprovalsScreen({ onNavigate }: TaskApprovalsScreenProps) {
  const { currentWorkspace } = useSession();
  const [selectedTask, setSelectedTask] = useState<TaskApprovalRequest | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [isLoading, setIsLoading] = useState(false);

  // Filter tasks based on search and filter type
  const filteredTasks = mockTaskApprovals.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         task.assigneeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         task.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesFilter = activeFilter === 'all' || 
                         (activeFilter === 'new' && task.status === 'pending-approval') ||
                         (activeFilter === 'changes-requested' && task.status === 'changes-requested');

    return matchesSearch && matchesFilter;
  });

  const pendingCount = mockTaskApprovals.filter(t => t.status === 'pending-approval').length;
  const changesRequestedCount = mockTaskApprovals.filter(t => t.status === 'changes-requested').length;

  const handleTaskAction = async (taskId: string, action: 'approve' | 'request-changes' | 'reassign', data?: any) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    console.log(`${action} task ${taskId}:`, data);
    setIsLoading(false);
    setSelectedTask(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-500 bg-red-50 border-red-200 dark:bg-red-950/30 dark:border-red-800/50';
      case 'medium':
        return 'text-amber-500 bg-amber-50 border-amber-200 dark:bg-amber-950/30 dark:border-amber-800/50';
      default:
        return 'text-blue-500 bg-blue-50 border-blue-200 dark:bg-blue-950/30 dark:border-blue-800/50';
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  if (selectedTask) {
    return <TaskApprovalDetail 
      task={selectedTask}
      onBack={() => setSelectedTask(null)}
      onAction={handleTaskAction}
      isLoading={isLoading}
      teamMembers={mockTeamMembers}
    />;
  }

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-background via-background/98 to-muted/20 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-16 right-8 w-24 h-24 bg-gradient-to-br from-blue-500/10 to-transparent rounded-full blur-2xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <div className="flex-1 overflow-hidden p-6 relative z-10">
        {/* Header */}
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <motion.div
                whileHover={{ scale: 1.05, x: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <button
                  onClick={() => onNavigate('admin-dashboard')}
                  className="p-2 rounded-xl bg-card/50 backdrop-blur-sm border border-border hover:bg-card/80 transition-all duration-200"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
              </motion.div>
              
              <div>
                <h1 className="text-2xl mb-1">
                  {/* @dev-annotation: i18n key - admin.approvals.tasks.title */}
                  Task Approvals
                </h1>
                <p className="text-sm text-muted-foreground">
                  {/* @dev-annotation: i18n key - admin.approvals.tasks.subtitle */}
                  Review and approve submitted tasks for {currentWorkspace?.name}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20">
                <Clock className="w-3 h-3 mr-1" />
                {pendingCount} pending
              </Badge>
              {changesRequestedCount > 0 && (
                <Badge variant="secondary" className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20">
                  <AlertTriangle className="w-3 h-3 mr-1" />
                  {changesRequestedCount} changes
                </Badge>
              )}
            </div>
          </div>

          {/* Search and Filters */}
          <div className="space-y-3">
            <div className="relative">
              <Input
                placeholder="Search by title, assignee, or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 bg-card/50 backdrop-blur-sm border-border/60"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            </div>

            {/* Filter Chips */}
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              {[
                { id: 'all', label: 'All', count: mockTaskApprovals.length },
                { id: 'new', label: 'New', count: pendingCount },
                { id: 'changes-requested', label: 'Changes Requested', count: changesRequestedCount }
              ].map((filter) => (
                <motion.div
                  key={filter.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant={activeFilter === filter.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setActiveFilter(filter.id as FilterType)}
                    className={`
                      h-8 px-3 text-xs transition-all duration-200
                      ${activeFilter === filter.id 
                        ? 'bg-primary text-primary-foreground shadow-sm' 
                        : 'bg-card/50 backdrop-blur-sm hover:bg-card/80'
                      }
                    `}
                  >
                    {filter.label}
                    {filter.count > 0 && (
                      <Badge variant="secondary" className="ml-2 h-4 px-1 text-xs">
                        {filter.count}
                      </Badge>
                    )}
                  </Button>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Content */}
        <motion.div
          className="flex-1 overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {filteredTasks.length > 0 ? (
            /* @dev-annotation: Virtualization recommended for >50 items */
            <ScrollArea className="h-96">
              <div className="space-y-3 pr-4">
                {filteredTasks.map((task, index) => (
                  <motion.div
                    key={task.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.05 }}
                    whileHover={{ scale: 1.01 }}
                    className="cursor-pointer"
                    onClick={() => setSelectedTask(task)}
                  >
                    <div className="p-4 bg-card/50 backdrop-blur-sm border border-border/60 rounded-xl hover:bg-card/80 transition-all duration-200">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="text-sm truncate">{task.title}</h3>
                            <StatusChip status={task.status} size="sm" />
                          </div>
                          <p className="text-xs text-muted-foreground line-clamp-2">
                            {task.description}
                          </p>
                        </div>

                        <Badge 
                          variant="outline" 
                          className={`text-xs px-2 py-0.5 ${getPriorityColor(task.priority)}`}
                        >
                          <Flag className="w-3 h-3 mr-1" />
                          {task.priority}
                        </Badge>
                      </div>

                      {/* Meta Information */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-2">
                            <Avatar className="w-6 h-6">
                              <AvatarFallback className="bg-primary/10 text-primary text-xs">
                                {getInitials(task.assigneeName)}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-xs text-muted-foreground">{task.assigneeName}</span>
                          </div>

                          <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                            <Calendar className="w-3 h-3" />
                            <span>{formatDate(task.submittedAt)}</span>
                          </div>

                          {task.dueDate && (
                            <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                              <Clock className="w-3 h-3" />
                              <span>Due {formatDate(task.dueDate)}</span>
                            </div>
                          )}
                        </div>

                        {/* Tags */}
                        {task.tags.length > 0 && (
                          <div className="flex items-center space-x-1">
                            {task.tags.slice(0, 2).map((tag, tagIndex) => (
                              <Badge key={tagIndex} variant="secondary" className="text-xs px-1.5 py-0.5 bg-muted/50">
                                {tag}
                              </Badge>
                            ))}
                            {task.tags.length > 2 && (
                              <Badge variant="secondary" className="text-xs px-1.5 py-0.5 bg-muted/50">
                                +{task.tags.length - 2}
                              </Badge>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Last Note */}
                      {task.lastNote && (
                        <div className="mt-3 p-3 bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-800/50 rounded-lg">
                          <div className="flex items-center space-x-2 mb-1">
                            <MessageSquare className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                            <span className="text-xs text-amber-600 dark:text-amber-400">
                              {/* @dev-annotation: i18n key - admin.approvals.tasks.lastNote */}
                              Last feedback:
                            </span>
                          </div>
                          <p className="text-xs text-amber-700 dark:text-amber-300">"{task.lastNote}"</p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </ScrollArea>
          ) : (
            /* Empty State */
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col items-center justify-center h-96 text-center"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 via-blue-400/10 to-transparent rounded-2xl flex items-center justify-center mb-4">
                <CheckCircle2 className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-lg mb-2">
                {/* @dev-annotation: i18n key - admin.approvals.tasks.empty.title */}
                {activeFilter === 'all' ? 'No tasks to review' : `No ${activeFilter.replace('-', ' ')} tasks`}
              </h3>
              <p className="text-muted-foreground max-w-sm">
                {/* @dev-annotation: i18n key - admin.approvals.tasks.empty.description */}
                {activeFilter === 'all' 
                  ? 'All submitted tasks have been reviewed. New submissions will appear here.'
                  : `No tasks match the current filter. Try switching filters or searching.`
                }
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

// Task Approval Detail Component
interface TaskApprovalDetailProps {
  task: TaskApprovalRequest;
  onBack: () => void;
  onAction: (taskId: string, action: 'approve' | 'request-changes' | 'reassign', data?: any) => void;
  isLoading: boolean;
  teamMembers: TeamMember[];
}

function TaskApprovalDetail({ task, onBack, onAction, isLoading, teamMembers }: TaskApprovalDetailProps) {
  const [showChangesForm, setShowChangesForm] = useState(false);
  const [showReassignForm, setShowReassignForm] = useState(false);
  const [changesNote, setChangesNote] = useState('');
  const [selectedAssignee, setSelectedAssignee] = useState<string[]>([]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-500 bg-red-50 border-red-200 dark:bg-red-950/30 dark:border-red-800/50';
      case 'medium':
        return 'text-amber-500 bg-amber-50 border-amber-200 dark:bg-amber-950/30 dark:border-amber-800/50';
      default:
        return 'text-blue-500 bg-blue-50 border-blue-200 dark:bg-blue-950/30 dark:border-blue-800/50';
    }
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-background via-background/98 to-muted/20">
      <div className="flex-1 overflow-y-auto p-6">
        {/* Header */}
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center space-x-3 mb-4">
            <motion.div
              whileHover={{ scale: 1.05, x: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <button
                onClick={onBack}
                className="p-2 rounded-xl bg-card/50 backdrop-blur-sm border border-border hover:bg-card/80 transition-all duration-200"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            </motion.div>
            
            <div className="flex-1">
              <h1 className="text-xl mb-1">{task.title}</h1>
              <div className="flex items-center space-x-2">
                <StatusChip status={task.status} size="sm" />
                <Badge variant="outline" className={`text-xs px-2 py-0.5 ${getPriorityColor(task.priority)}`}>
                  <Flag className="w-3 h-3 mr-1" />
                  {task.priority} priority
                </Badge>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Task Details */}
        <motion.div
          className="space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {/* Description */}
          <div className="bg-card/50 backdrop-blur-sm border border-border/60 rounded-2xl p-6">
            <h3 className="text-lg mb-3">
              {/* @dev-annotation: i18n key - admin.approvals.tasks.detail.description */}
              Task Description
            </h3>
            <p className="text-muted-foreground leading-relaxed">{task.description}</p>
          </div>

          {/* Assignment & Timing */}
          <div className="bg-card/50 backdrop-blur-sm border border-border/60 rounded-2xl p-6">
            <h3 className="text-lg mb-4">
              {/* @dev-annotation: i18n key - admin.approvals.tasks.detail.assignment */}
              Assignment Details
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Avatar className="w-10 h-10">
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {getInitials(task.assigneeName)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm">{task.assigneeName}</p>
                  <p className="text-xs text-muted-foreground">Current assignee</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground mb-1">Submitted</p>
                  <p>{formatDate(task.submittedAt)}</p>
                </div>
                {task.dueDate && (
                  <div>
                    <p className="text-muted-foreground mb-1">Due Date</p>
                    <p>{formatDate(task.dueDate)}</p>
                  </div>
                )}
              </div>

              {/* Tags */}
              {task.tags.length > 0 && (
                <div>
                  <p className="text-muted-foreground mb-2 text-sm">Tags</p>
                  <div className="flex flex-wrap gap-2">
                    {task.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        <Tag className="w-3 h-3 mr-1" />
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Activity History */}
          <div className="bg-card/50 backdrop-blur-sm border border-border/60 rounded-2xl p-6">
            <h3 className="text-lg mb-4">
              {/* @dev-annotation: i18n key - admin.approvals.tasks.detail.activity */}
              Activity History
            </h3>
            
            <div className="space-y-3">
              {task.activity.map((activity, index) => (
                <div key={activity.id} className="flex items-start space-x-3 pb-3 border-b border-border/30 last:border-b-0">
                  <div className="w-8 h-8 bg-muted/50 rounded-full flex items-center justify-center flex-shrink-0">
                    {activity.type === 'status_change' && <RotateCcw className="w-4 h-4 text-muted-foreground" />}
                    {activity.type === 'comment' && <MessageSquare className="w-4 h-4 text-muted-foreground" />}
                    {activity.type === 'reassign' && <UserCheck className="w-4 h-4 text-muted-foreground" />}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-sm">{activity.message}</p>
                    <p className="text-xs text-muted-foreground">
                      {activity.author} • {formatDate(activity.timestamp)}
                    </p>
                    {activity.note && (
                      <div className="mt-2 p-2 bg-muted/30 rounded-lg">
                        <p className="text-xs">"{activity.note}"</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Forms */}
          <AnimatePresence>
            {showChangesForm && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-amber-50/50 dark:bg-amber-950/20 backdrop-blur-sm border border-amber-200/60 dark:border-amber-800/50 rounded-2xl p-6"
              >
                <h3 className="text-lg mb-3 text-amber-700 dark:text-amber-400">
                  {/* @dev-annotation: i18n key - admin.approvals.tasks.requestChanges.title */}
                  Request Changes
                </h3>
                <Textarea
                  placeholder="Describe what changes are needed (required)..."
                  value={changesNote}
                  onChange={(e) => setChangesNote(e.target.value)}
                  className="mb-4 bg-background/50"
                  required
                />
                <div className="flex items-center space-x-3">
                  <Button
                    onClick={() => onAction(task.id, 'request-changes', { note: changesNote })}
                    disabled={isLoading || !changesNote.trim()}
                    className="bg-amber-500 hover:bg-amber-600 text-white"
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 mr-2" />
                    )}
                    {/* @dev-annotation: i18n key - actions.requestChanges */}
                    Request Changes
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowChangesForm(false)}
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                </div>
              </motion.div>
            )}

            {showReassignForm && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-blue-50/50 dark:bg-blue-950/20 backdrop-blur-sm border border-blue-200/60 dark:border-blue-800/50 rounded-2xl p-6"
              >
                <h3 className="text-lg mb-3 text-blue-700 dark:text-blue-400">
                  {/* @dev-annotation: i18n key - admin.approvals.tasks.reassign.title */}
                  Reassign Task
                </h3>
                <div className="mb-4">
                  <AssigneePicker
                    members={teamMembers}
                    selectedMembers={selectedAssignee}
                    onSelectionChange={setSelectedAssignee}
                    multiSelect={false}
                    placeholder="Select new assignee..."
                  />
                </div>
                <div className="flex items-center space-x-3">
                  <Button
                    onClick={() => onAction(task.id, 'reassign', { assigneeId: selectedAssignee[0] })}
                    disabled={isLoading || selectedAssignee.length === 0}
                    className="bg-blue-500 hover:bg-blue-600 text-white"
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : (
                      <UserCheck className="w-4 h-4 mr-2" />
                    )}
                    {/* @dev-annotation: i18n key - actions.reassign */}
                    Reassign Task
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowReassignForm(false)}
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Sticky Action Bar */}
      <motion.div
        className="p-6 border-t border-border/50 bg-card/30 backdrop-blur-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="grid grid-cols-3 gap-3">
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              onClick={() => onAction(task.id, 'approve')}
              disabled={isLoading}
              className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <CheckCircle2 className="w-4 h-4" />
              )}
            </Button>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              variant="outline"
              onClick={() => setShowChangesForm(true)}
              disabled={isLoading || showChangesForm}
              className="w-full py-3 border-amber-200 text-amber-600 hover:bg-amber-50 dark:border-amber-800 dark:text-amber-400 dark:hover:bg-amber-950/30"
            >
              <AlertTriangle className="w-4 h-4" />
            </Button>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              variant="outline"
              onClick={() => setShowReassignForm(true)}
              disabled={isLoading || showReassignForm}
              className="w-full py-3"
            >
              <UserCheck className="w-4 h-4" />
            </Button>
          </motion.div>
        </div>
        
        <div className="grid grid-cols-3 gap-3 mt-2 text-xs text-center text-muted-foreground">
          <span>
            {/* @dev-annotation: i18n key - actions.approve */}
            Approve
          </span>
          <span>
            {/* @dev-annotation: i18n key - actions.requestChanges */}
            Changes
          </span>
          <span>
            {/* @dev-annotation: i18n key - actions.reassign */}
            Reassign
          </span>
        </div>
      </motion.div>
    </div>
  );
}