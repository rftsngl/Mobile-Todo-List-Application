import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Skeleton } from './ui/Skeleton';
import { 
  ArrowLeft,
  Search,
  Filter,
  Activity,
  User,
  Settings,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Mail,
  Shield,
  FileText,
  UserPlus,
  UserMinus,
  Calendar,
  Download,
  Eye,
  MoreVertical,
  RefreshCw
} from 'lucide-react';
import { useSession } from './SessionProvider';

interface ActivityLog {
  id: string;
  type: 'user_action' | 'system_event' | 'task_activity' | 'security' | 'admin_action';
  category: string;
  title: string;
  description: string;
  user: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  } | null;
  timestamp: string;
  status: 'success' | 'warning' | 'error' | 'info';
  metadata?: {
    ip?: string;
    device?: string;
    location?: string;
    [key: string]: any;
  };
}

// Mock activity data
const mockActivityLogs: ActivityLog[] = [
  {
    id: '1',
    type: 'user_action',
    category: 'Authentication',
    title: 'User Login',
    description: 'Sarah Chen logged in successfully',
    user: {
      id: 'user_sarah',
      name: 'Sarah Chen',
      email: 'sarah@company.com'
    },
    timestamp: '2024-01-15T09:30:00Z',
    status: 'success',
    metadata: {
      ip: '192.168.1.100',
      device: 'Chrome on Windows',
      location: 'San Francisco, CA'
    }
  },
  {
    id: '2',
    type: 'admin_action',
    category: 'User Management',
    title: 'User Invitation Sent',
    description: 'Invited new user to join workspace',
    user: {
      id: 'admin_john',
      name: 'John Doe',
      email: 'john@company.com'
    },
    timestamp: '2024-01-15T08:45:00Z',
    status: 'success',
    metadata: {
      invitedEmail: 'newuser@company.com',
      role: 'employee'
    }
  },
  {
    id: '3',
    type: 'system_event',
    category: 'Backup',
    title: 'Daily Backup Completed',
    description: 'Automated system backup completed successfully',
    user: null,
    timestamp: '2024-01-15T06:00:00Z',
    status: 'success',
    metadata: {
      backupSize: '2.4 GB',
      duration: '12 minutes'
    }
  },
  {
    id: '4',
    type: 'task_activity',
    category: 'Task Management',
    title: 'Task Completed',
    description: 'Quarterly Report task marked as completed',
    user: {
      id: 'user_mike',
      name: 'Mike Johnson',
      email: 'mike@company.com'
    },
    timestamp: '2024-01-14T16:20:00Z',
    status: 'success',
    metadata: {
      taskId: 'task_123',
      taskTitle: 'Quarterly Financial Report'
    }
  },
  {
    id: '5',
    type: 'security',
    category: 'Security',
    title: 'Failed Login Attempt',
    description: 'Multiple failed login attempts detected',
    user: null,
    timestamp: '2024-01-14T14:30:00Z',
    status: 'warning',
    metadata: {
      ip: '203.0.113.42',
      attempts: 5,
      blockedUntil: '2024-01-14T15:00:00Z'
    }
  },
  {
    id: '6',
    type: 'admin_action',
    category: 'Settings',
    title: 'Company Settings Updated',
    description: 'Updated company notification preferences',
    user: {
      id: 'admin_john',
      name: 'John Doe',
      email: 'john@company.com'
    },
    timestamp: '2024-01-14T11:15:00Z',
    status: 'info',
    metadata: {
      setting: 'email_notifications',
      previousValue: 'enabled',
      newValue: 'disabled'
    }
  },
  {
    id: '7',
    type: 'user_action',
    category: 'Profile',
    title: 'Profile Updated',
    description: 'Emily Davis updated her profile information',
    user: {
      id: 'user_emily',
      name: 'Emily Davis',
      email: 'emily@company.com'
    },
    timestamp: '2024-01-14T10:45:00Z',
    status: 'info',
    metadata: {
      changes: ['phone_number', 'job_title']
    }
  },
  {
    id: '8',
    type: 'system_event',
    category: 'Maintenance',
    title: 'System Update',
    description: 'System maintenance completed - version 2.1.4 deployed',
    user: null,
    timestamp: '2024-01-14T03:00:00Z',
    status: 'success',
    metadata: {
      version: '2.1.4',
      downtime: '15 minutes',
      features: ['performance improvements', 'bug fixes']
    }
  }
];

const activityTypeIcons = {
  user_action: User,
  system_event: Settings,
  task_activity: CheckCircle2,
  security: Shield,
  admin_action: Activity
};

// Use design system tokens instead of hardcoded colors
const statusColors = {
  success: 'bg-success/10 text-success border-success/20',
  warning: 'bg-warning/10 text-warning border-warning/20',
  error: 'bg-danger/10 text-danger border-danger/20',
  info: 'bg-primary/10 text-primary border-primary/20'
};

interface AdminActivityScreenProps {
  onNavigate: (screen: string) => void;
}

export function AdminActivityScreen({ onNavigate }: AdminActivityScreenProps) {
  const { session } = useSession();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(false);

  // Filter options
  const filterOptions = [
    { value: 'all', label: 'All Activity', count: mockActivityLogs.length },
    { value: 'user_action', label: 'User Actions', count: mockActivityLogs.filter(log => log.type === 'user_action').length },
    { value: 'admin_action', label: 'Admin Actions', count: mockActivityLogs.filter(log => log.type === 'admin_action').length },
    { value: 'system_event', label: 'System Events', count: mockActivityLogs.filter(log => log.type === 'system_event').length },
    { value: 'task_activity', label: 'Task Activity', count: mockActivityLogs.filter(log => log.type === 'task_activity').length },
    { value: 'security', label: 'Security', count: mockActivityLogs.filter(log => log.type === 'security').length }
  ];

  // Filtered and searched activity logs
  const filteredLogs = useMemo(() => {
    let filtered = mockActivityLogs;

    // Apply type filter
    if (selectedFilter !== 'all') {
      filtered = filtered.filter(log => log.type === selectedFilter);
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(log =>
        log.title.toLowerCase().includes(query) ||
        log.description.toLowerCase().includes(query) ||
        log.category.toLowerCase().includes(query) ||
        log.user?.name.toLowerCase().includes(query) ||
        log.user?.email.toLowerCase().includes(query)
      );
    }

    // Sort by timestamp (newest first)
    return filtered.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [selectedFilter, searchQuery]);

  // Group logs by date
  const groupedLogs = useMemo(() => {
    const groups: { [date: string]: ActivityLog[] } = {};
    
    filteredLogs.forEach(log => {
      const date = new Date(log.timestamp).toDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(log);
    });

    return groups;
  }, [filteredLogs]);

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
  };

  const getRelativeTime = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  const loadActivityLogs = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const goBack = () => onNavigate('admin-dashboard');

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header - consistent with other admin screens */}
      <div className="flex items-center gap-3 p-4 border-b border-border">
        <Button
          variant="ghost"
          size="sm"
          onClick={goBack}
          className="h-9 w-9 p-0"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-lg font-medium">Activity Logs</h1>
          <p className="text-sm text-muted-foreground">
            Monitor system and user activity
          </p>
        </div>
        <Button
          onClick={loadActivityLogs}
          variant="outline"
          size="sm"
          disabled={loading}
          className="h-9 w-9 p-0"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
        </Button>
        <Button variant="outline" size="sm" className="gap-2">
          <Download className="w-4 h-4" />
          Export
        </Button>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => setShowFilters(!showFilters)}
          className={`h-9 w-9 p-0 ${showFilters ? 'bg-muted' : ''}`}
        >
          <Filter className="w-4 h-4" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search activity logs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="flex flex-wrap gap-2"
              >
                {filterOptions.map((filter) => (
                  <Button
                    key={filter.value}
                    variant={selectedFilter === filter.value ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedFilter(filter.value)}
                    className="h-8 gap-2"
                  >
                    {filter.label}
                    <Badge variant="secondary" className="h-5 px-1.5">
                      {filter.count}
                    </Badge>
                  </Button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Loading State */}
        {loading && (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <Card key={i} className="p-4">
                <div className="flex items-start gap-3">
                  <Skeleton className="h-8 w-8 rounded-lg" />
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <Skeleton className="h-4 w-48" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Content */}
        {!loading && (
          <>
            {Object.keys(groupedLogs).length === 0 ? (
              <Card className="p-8 text-center">
                <Activity className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-medium mb-2">
                  No activity found
                </h3>
                <p className="text-sm text-muted-foreground">
                  {searchQuery ? 'Try adjusting your search or filters' : 'No activity logs available'}
                </p>
              </Card>
            ) : (
              Object.entries(groupedLogs).map(([date, logs]) => (
                <div key={date} className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="h-px bg-border flex-1" />
                    <div className="px-3 py-1 bg-muted rounded-full">
                      <span className="text-sm font-medium text-muted-foreground">
                        {formatDate(date)}
                      </span>
                    </div>
                    <div className="h-px bg-border flex-1" />
                  </div>

                  <div className="space-y-2">
                    {logs.map((log, index) => {
                      const IconComponent = activityTypeIcons[log.type];
                      
                      return (
                        <motion.div
                          key={log.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <Card className="p-4 hover:shadow-sm transition-shadow">
                            <div className="flex items-start gap-3">
                              <div className={`p-2 rounded-lg border ${statusColors[log.status]}`}>
                                <IconComponent className="w-4 h-4" />
                              </div>
                              
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2">
                                  <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                      <h4 className="font-medium text-card-foreground truncate">
                                        {log.title}
                                      </h4>
                                      <Badge variant="outline" className="text-xs shrink-0">
                                        {log.category}
                                      </Badge>
                                    </div>
                                    <p className="text-sm text-muted-foreground mb-2">
                                      {log.description}
                                    </p>
                                    
                                    {log.user && (
                                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                        <User className="w-3 h-3" />
                                        <span>{log.user.name}</span>
                                        <span>•</span>
                                        <span>{log.user.email}</span>
                                      </div>
                                    )}
                                    
                                    {log.metadata && (
                                      <div className="mt-2 text-xs text-muted-foreground space-y-1">
                                        {log.metadata.ip && (
                                          <div>IP: {log.metadata.ip}</div>
                                        )}
                                        {log.metadata.device && (
                                          <div>Device: {log.metadata.device}</div>
                                        )}
                                        {log.metadata.location && (
                                          <div>Location: {log.metadata.location}</div>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                  
                                  <div className="flex items-center gap-2 text-right shrink-0">
                                    <div className="text-xs text-muted-foreground">
                                      <div>{formatTime(log.timestamp)}</div>
                                      <div>{getRelativeTime(log.timestamp)}</div>
                                    </div>
                                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                      <MoreVertical className="w-3 h-3" />
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </Card>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              ))
            )}
          </>
        )}
      </div>
    </div>
  );
}