import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { 
  User,
  Users,
  Clock,
  CheckCircle2,
  AlertCircle,
  Plus,
  Send,
  Briefcase,
  Target,
  Calendar,
  MessageSquare,
  TrendingUp,
  FileText,
  ChevronRight,
  Star,
  Filter,
  Search,
  ArrowRight,
  Activity,
  Zap,
  Timer,
  UserCheck
} from 'lucide-react';
import { StatusChip } from './shared/StatusChip';
import { useSession } from './SessionProvider';

interface AssignedTask {
  id: string;
  title: string;
  description: string;
  assignedBy: {
    name: string;
    role: string;
  };
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'in_progress' | 'review' | 'completed';
  dueDate: string;
  estimatedHours?: number;
  tags: string[];
}

interface MyTaskRequest {
  id: string;
  title: string;
  description: string;
  justification: string;
  status: 'pending' | 'approved' | 'rejected';
  requestedAt: string;
  priority: 'high' | 'medium' | 'low';
  estimatedHours?: number;
}

interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar?: string;
  status: 'online' | 'away' | 'offline';
  currentTask?: string;
}

// Mock data
const mockAssignedTasks: AssignedTask[] = [
  {
    id: '1',
    title: 'Q4 Financial Report Analysis',
    description: 'Analyze Q4 financial data and prepare insights for stakeholder meeting',
    assignedBy: { name: 'John Doe', role: 'Admin' },
    priority: 'high',
    status: 'pending',
    dueDate: '2024-01-20',
    estimatedHours: 8,
    tags: ['Finance', 'Analysis', 'Urgent']
  },
  {
    id: '2',
    title: 'Customer Feedback Review',
    description: 'Review and categorize customer feedback from last quarter',
    assignedBy: { name: 'John Doe', role: 'Admin' },
    priority: 'medium',
    status: 'in_progress',
    dueDate: '2024-01-25',
    estimatedHours: 4,
    tags: ['Customer', 'Review']
  },
  {
    id: '3',
    title: 'Team Onboarding Documentation',
    description: 'Update onboarding documentation for new team members',
    assignedBy: { name: 'John Doe', role: 'Admin' },
    priority: 'low',
    status: 'completed',
    dueDate: '2024-01-15',
    estimatedHours: 3,
    tags: ['Documentation', 'HR']
  }
];

const mockMyTaskRequests: MyTaskRequest[] = [
  {
    id: '1',
    title: 'Process Improvement Research',
    description: 'Research best practices for improving our current workflow processes',
    justification: 'I noticed several inefficiencies in our current process that could be optimized',
    status: 'pending',
    requestedAt: '2024-01-10',
    priority: 'medium',
    estimatedHours: 6
  },
  {
    id: '2',
    title: 'Training Material Development',
    description: 'Create training materials for new software tools',
    justification: 'New team members need proper training materials for the tools we use',
    status: 'approved',
    requestedAt: '2024-01-08',
    priority: 'high',
    estimatedHours: 12
  }
];

const mockTeamMembers: TeamMember[] = [
  {
    id: '1',
    name: 'Sarah Chen',
    role: 'Employee',
    status: 'online',
    currentTask: 'Market Research Analysis'
  },
  {
    id: '2',
    name: 'Mike Johnson',
    role: 'Employee',
    status: 'away',
    currentTask: 'Content Strategy Planning'
  },
  {
    id: '3',
    name: 'Emily Davis',
    role: 'Employee',
    status: 'online',
    currentTask: 'User Experience Review'
  }
];

interface EmployeeDashboardProps {
  onNavigate: (screen: string) => void;
}

export function EmployeeDashboard({ onNavigate }: EmployeeDashboardProps) {
  const { session } = useSession();
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [newTaskRequest, setNewTaskRequest] = useState({
    title: '',
    description: '',
    justification: '',
    priority: 'medium' as 'high' | 'medium' | 'low',
    estimatedHours: ''
  });

  // Dashboard stats
  const stats = {
    assigned: mockAssignedTasks.filter(t => t.status !== 'completed').length,
    completed: mockAssignedTasks.filter(t => t.status === 'completed').length,
    pending: mockMyTaskRequests.filter(r => r.status === 'pending').length,
    teamOnline: mockTeamMembers.filter(m => m.status === 'online').length
  };

  const handleSubmitTaskRequest = () => {
    // Simulate API call
    console.log('Submitting task request:', newTaskRequest);
    setShowRequestModal(false);
    setNewTaskRequest({
      title: '',
      description: '',
      justification: '',
      priority: 'medium',
      estimatedHours: ''
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-danger bg-danger/10 border-danger/20';
      case 'medium': return 'text-warning bg-warning/10 border-warning/20';
      case 'low': return 'text-success bg-success/10 border-success/20';
      default: return 'text-muted-foreground bg-muted border-border';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-warning bg-warning/10 border-warning/20';
      case 'in_progress': return 'text-primary bg-primary/10 border-primary/20';
      case 'review': return 'text-info bg-info/10 border-info/20';
      case 'completed': return 'text-success bg-success/10 border-success/20';
      case 'approved': return 'text-success bg-success/10 border-success/20';
      case 'rejected': return 'text-danger bg-danger/10 border-danger/20';
      default: return 'text-muted-foreground bg-muted border-border';
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center pb-6"
      >
        <div className="relative">
          <h1 className="text-2xl mb-2">
            Welcome back, {session?.name?.split(' ')[0]}! 👋
          </h1>
          <p className="text-muted-foreground">
            Ready to tackle your tasks and collaborate with your team?
          </p>
        </div>
      </motion.div>

      {/* Quick Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 gap-4"
      >
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Target className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-semibold">{stats.assigned}</p>
              <p className="text-sm text-muted-foreground">Active Tasks</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-success/10">
              <CheckCircle2 className="w-5 h-5 text-success" />
            </div>
            <div>
              <p className="text-2xl font-semibold">{stats.completed}</p>
              <p className="text-sm text-muted-foreground">Completed</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-warning/10">
              <Clock className="w-5 h-5 text-warning" />
            </div>
            <div>
              <p className="text-2xl font-semibold">{stats.pending}</p>
              <p className="text-sm text-muted-foreground">Pending Requests</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-info/10">
              <Users className="w-5 h-5 text-info" />
            </div>
            <div>
              <p className="text-2xl font-semibold">{stats.teamOnline}</p>
              <p className="text-sm text-muted-foreground">Team Online</p>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">Quick Actions</h3>
            <Zap className="w-5 h-5 text-primary" />
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <Button 
              variant="outline" 
              className="h-auto p-4 flex-col gap-2"
              onClick={() => setShowRequestModal(true)}
            >
              <Plus className="w-5 h-5" />
              <span className="text-sm">Request Task</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="h-auto p-4 flex-col gap-2"
              onClick={() => onNavigate('team-chat')}
            >
              <MessageSquare className="w-5 h-5" />
              <span className="text-sm">Team Chat</span>
            </Button>
          </div>
        </Card>
      </motion.div>

      {/* Assigned Tasks */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-primary" />
              Assigned Tasks
            </h3>
            <Button variant="ghost" size="sm" className="gap-2">
              View All <ChevronRight className="w-4 h-4" />
            </Button>
          </div>

          <div className="space-y-3">
            {mockAssignedTasks.slice(0, 3).map((task, index) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="border border-border rounded-lg p-4 hover:shadow-sm transition-shadow"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h4 className="font-medium mb-1">{task.title}</h4>
                    <p className="text-sm text-muted-foreground mb-2">{task.description}</p>
                    
                    <div className="flex items-center gap-2 mb-3">
                      <Badge className={`text-xs ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </Badge>
                      <Badge className={`text-xs ${getStatusColor(task.status)}`}>
                        {task.status.replace('_', ' ')}
                      </Badge>
                      {task.estimatedHours && (
                        <Badge variant="outline" className="text-xs">
                          <Timer className="w-3 h-3 mr-1" />
                          {task.estimatedHours}h
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <User className="w-3 h-3" />
                        <span>By {task.assignedBy.name}</span>
                        <span>•</span>
                        <Calendar className="w-3 h-3" />
                        <span>Due {new Date(task.dueDate).toLocaleDateString()}</span>
                      </div>
                      
                      <Button size="sm" variant="ghost" className="h-8 px-3">
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* My Task Requests */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              My Task Requests
            </h3>
            <Button variant="ghost" size="sm" className="gap-2">
              View All <ChevronRight className="w-4 h-4" />
            </Button>
          </div>

          <div className="space-y-3">
            {mockMyTaskRequests.map((request, index) => (
              <motion.div
                key={request.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="border border-border rounded-lg p-4"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h4 className="font-medium mb-1">{request.title}</h4>
                    <p className="text-sm text-muted-foreground mb-2">{request.description}</p>
                    
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={`text-xs ${getStatusColor(request.status)}`}>
                        {request.status}
                      </Badge>
                      <Badge className={`text-xs ${getPriorityColor(request.priority)}`}>
                        {request.priority}
                      </Badge>
                    </div>

                    <p className="text-xs text-muted-foreground">
                      Requested {new Date(request.requestedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Team Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              Team Members
            </h3>
            <Button variant="ghost" size="sm" className="gap-2">
              View All <ChevronRight className="w-4 h-4" />
            </Button>
          </div>

          <div className="space-y-3">
            {mockTeamMembers.map((member, index) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className="flex items-center justify-between p-3 border border-border rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                      <User className="w-5 h-5 text-primary" />
                    </div>
                    <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
                      member.status === 'online' ? 'bg-success' : 
                      member.status === 'away' ? 'bg-warning' : 'bg-muted-foreground'
                    }`} />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{member.name}</p>
                    <p className="text-xs text-muted-foreground">{member.role}</p>
                    {member.currentTask && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Working on: {member.currentTask}
                      </p>
                    )}
                  </div>
                </div>
                
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MessageSquare className="w-4 h-4" />
                </Button>
              </motion.div>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Task Request Modal */}
      <AnimatePresence>
        {showRequestModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
              onClick={() => setShowRequestModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <Card className="w-full max-w-md p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium">Request New Task</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowRequestModal(false)}
                    className="h-8 w-8 p-0"
                  >
                    ✕
                  </Button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Task Title</label>
                    <Input
                      value={newTaskRequest.title}
                      onChange={(e) => setNewTaskRequest(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Enter task title..."
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Description</label>
                    <Textarea
                      value={newTaskRequest.description}
                      onChange={(e) => setNewTaskRequest(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Describe what you want to work on..."
                      rows={3}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Justification</label>
                    <Textarea
                      value={newTaskRequest.justification}
                      onChange={(e) => setNewTaskRequest(prev => ({ ...prev, justification: e.target.value }))}
                      placeholder="Why is this task important?"
                      rows={2}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Priority</label>
                      <select 
                        value={newTaskRequest.priority}
                        onChange={(e) => setNewTaskRequest(prev => ({ ...prev, priority: e.target.value as any }))}
                        className="w-full px-3 py-2 border border-border rounded-lg bg-background"
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium mb-2 block">Est. Hours</label>
                      <Input
                        value={newTaskRequest.estimatedHours}
                        onChange={(e) => setNewTaskRequest(prev => ({ ...prev, estimatedHours: e.target.value }))}
                        placeholder="8"
                        type="number"
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button
                      variant="outline"
                      onClick={() => setShowRequestModal(false)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSubmitTaskRequest}
                      className="flex-1 gap-2"
                      disabled={!newTaskRequest.title || !newTaskRequest.description}
                    >
                      <Send className="w-4 h-4" />
                      Submit Request
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}