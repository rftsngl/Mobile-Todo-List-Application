import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { 
  Users, 
  Clock, 
  CheckCircle2, 
  UserPlus,
  Settings,
  BarChart3,
  AlertTriangle,
  Mail,
  Shield,
  Activity,
  TrendingUp,
  Calendar,
  FileText,
  Plus,
  ArrowRight,
  Zap
} from 'lucide-react';
import { StatusChip } from './shared/StatusChip';
import { useSession } from './SessionProvider';

interface AdminDashboardProps {
  onNavigate: (screen: string) => void;
}

// Mock data for dashboard
const mockDashboardData = {
  userApprovals: {
    pending: 3,
    thisWeek: 8,
    trend: '+2 from last week'
  },
  taskApprovals: {
    pending: 12,
    thisWeek: 24,
    trend: '+4 from last week'
  },
  members: {
    total: 28,
    active: 24,
    thisWeek: 2,
    trend: '+2 new this week'
  },
  invites: {
    sent: 5,
    pending: 3,
    thisWeek: 7,
    trend: '+3 from last week'
  },
  activity: {
    tasksCompleted: 156,
    avgCompletionTime: '2.3 days',
    productivityScore: 94
  }
};

const mockRecentActivity = [
  {
    id: '1',
    type: 'user_approved',
    message: 'Sarah Johnson approved to join the team',
    time: '2 minutes ago',
    icon: Users,
    color: 'text-emerald-500'
  },
  {
    id: '2',
    type: 'task_approved',
    message: 'Mobile app design task approved',
    time: '15 minutes ago',
    icon: CheckCircle2,
    color: 'text-blue-500'
  },
  {
    id: '3',
    type: 'member_invited',
    message: '3 team members invited via email',
    time: '1 hour ago',
    icon: Mail,
    color: 'text-purple-500'
  },
  {
    id: '4',
    type: 'task_changes',
    message: 'Changes requested for API integration task',
    time: '2 hours ago',
    icon: AlertTriangle,
    color: 'text-amber-500'
  }
];

export function AdminDashboard({ onNavigate }: AdminDashboardProps) {
  const { currentWorkspace } = useSession();
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null);

  const quickActions = [
    {
      id: 'invite-user',
      label: 'Invite Team Member',
      icon: UserPlus,
      color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
      action: () => onNavigate('admin-invites')
    },
    {
      id: 'approve-all',
      label: 'Review Approvals',
      icon: Clock,
      color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
      action: () => onNavigate('admin-user-approvals')
    },
    {
      id: 'settings',
      label: 'Company Settings',
      icon: Settings,
      color: 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20',
      action: () => onNavigate('admin-company-settings')
    }
  ];

  const dashboardCards = [
    {
      id: 'user-approvals',
      title: 'User Approvals',
      description: 'Pending membership requests',
      value: mockDashboardData.userApprovals.pending,
      subtitle: `${mockDashboardData.userApprovals.thisWeek} this week`,
      trend: mockDashboardData.userApprovals.trend,
      icon: Users,
      color: 'from-amber-500/20 via-amber-400/10 to-transparent',
      borderColor: 'border-amber-500/30',
      iconColor: 'text-amber-600 dark:text-amber-400',
      action: () => onNavigate('admin-user-approvals'),
      i18nKey: 'admin.dashboard.userApprovals'
    },
    {
      id: 'task-approvals',
      title: 'Task Approvals',
      description: 'Tasks awaiting review',
      value: mockDashboardData.taskApprovals.pending,
      subtitle: `${mockDashboardData.taskApprovals.thisWeek} this week`,
      trend: mockDashboardData.taskApprovals.trend,
      icon: CheckCircle2,
      color: 'from-blue-500/20 via-blue-400/10 to-transparent',
      borderColor: 'border-blue-500/30',
      iconColor: 'text-blue-600 dark:text-blue-400',
      action: () => onNavigate('admin-task-approvals'),
      i18nKey: 'admin.dashboard.taskApprovals'
    },
    {
      id: 'members',
      title: 'Team Members',
      description: 'Active team members',
      value: mockDashboardData.members.total,
      subtitle: `${mockDashboardData.members.active} active`,
      trend: mockDashboardData.members.trend,
      icon: Users,
      color: 'from-emerald-500/20 via-emerald-400/10 to-transparent',
      borderColor: 'border-emerald-500/30',
      iconColor: 'text-emerald-600 dark:text-emerald-400',
      action: () => onNavigate('admin-members'),
      i18nKey: 'admin.dashboard.members'
    },
    {
      id: 'invites',
      title: 'Invitations',
      description: 'Sent invitations',
      value: mockDashboardData.invites.sent,
      subtitle: `${mockDashboardData.invites.pending} pending`,
      trend: mockDashboardData.invites.trend,
      icon: Mail,
      color: 'from-purple-500/20 via-purple-400/10 to-transparent',
      borderColor: 'border-purple-500/30',
      iconColor: 'text-purple-600 dark:text-purple-400',
      action: () => onNavigate('admin-invites'),
      i18nKey: 'admin.dashboard.invites'
    }
  ];

  return (
    <div className="bg-gradient-to-br from-background via-background/98 to-muted/20 relative">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-16 right-8 w-24 h-24 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-2xl"
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

      <div className="p-6 relative z-10">
        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-muted-foreground">
                {/* @dev-annotation: i18n key - admin.dashboard.subtitle */}
                Manage {currentWorkspace?.name || 'your company'} workspace and team
              </p>
            </div>
            
            <motion.div
              className="flex items-center space-x-2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                <Shield className="w-3 h-3 mr-1" />
                Admin
              </Badge>
            </motion.div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-3 gap-2">
            {quickActions.map((action, index) => {
              const IconComponent = action.icon;
              return (
                <motion.div
                  key={action.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    variant="outline"
                    onClick={action.action}
                    className={`
                      w-full p-3 h-auto flex-col space-y-2 text-xs
                      ${action.color}
                      hover:shadow-sm transition-all duration-200
                    `}
                  >
                    <IconComponent className="w-4 h-4" />
                    <span className="text-center leading-tight">{action.label}</span>
                  </Button>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Dashboard Cards Grid */}
        <motion.div
          className="grid grid-cols-2 gap-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          {dashboardCards.map((card, index) => {
            const IconComponent = card.icon;
            const isSelected = selectedMetric === card.id;

            return (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{
                  delay: 0.5 + index * 0.1,
                  duration: 0.4,
                  ease: [0.16, 1, 0.3, 1]
                }}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setSelectedMetric(isSelected ? null : card.id);
                  if (!isSelected) {
                    setTimeout(() => card.action(), 300);
                  }
                }}
                className="cursor-pointer"
              >
                <Card className={`
                  relative bg-gradient-to-br ${card.color} backdrop-blur-sm border p-4 transition-all duration-300 overflow-hidden
                  ${isSelected ? `${card.borderColor} ring-2 ring-primary/20 shadow-xl` : 'border-border hover:shadow-lg'}
                `}>
                  {/* Background decoration */}
                  <div className="absolute inset-0 opacity-30 overflow-hidden pointer-events-none">
                    <motion.div
                      className={`absolute top-2 right-2 w-12 h-12 bg-gradient-to-br ${card.color} rounded-full blur-xl`}
                      animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.6, 0.3],
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: index * 0.5,
                      }}
                    />
                  </div>

                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="text-sm mb-1">{card.title}</h3>
                        <p className="text-xs text-muted-foreground">{card.description}</p>
                      </div>
                      
                      <motion.div
                        className={`p-2 rounded-xl bg-gradient-to-br ${card.color} ${card.iconColor} backdrop-blur-sm`}
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        animate={isSelected ? {
                          scale: [1, 1.1, 1],
                          rotate: [0, 5, -5, 0],
                        } : {}}
                        transition={isSelected ? {
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut"
                        } : { duration: 0.2 }}
                      >
                        <IconComponent className="w-4 h-4" />
                      </motion.div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-baseline space-x-2">
                        <motion.span 
                          className="text-2xl"
                          key={card.value}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          {card.value}
                        </motion.span>
                        <span className="text-xs text-muted-foreground">{card.subtitle}</span>
                      </div>
                      
                      <div className="flex items-center space-x-1">
                        <TrendingUp className="w-3 h-3 text-emerald-500" />
                        <span className="text-xs text-emerald-600 dark:text-emerald-400">{card.trend}</span>
                      </div>
                    </div>

                    {/* Action indicator */}
                    <motion.div
                      className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100"
                      whileHover={{ scale: 1.1 }}
                    >
                      <ArrowRight className="w-3 h-3 text-muted-foreground" />
                    </motion.div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Activity Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="space-y-4"
        >
          <h2 className="text-lg mb-4">
            {/* @dev-annotation: i18n key - admin.dashboard.activity.title */}
            Recent Activity
          </h2>

          <div className="space-y-3">
            {mockRecentActivity.map((activity, index) => {
              const IconComponent = activity.icon;
              return (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.9 + index * 0.1 }}
                  className="flex items-center space-x-3 p-3 bg-card/50 backdrop-blur-sm border border-border rounded-xl hover:bg-card/80 transition-colors"
                >
                  <div className={`p-2 rounded-lg bg-muted/50 ${activity.color}`}>
                    <IconComponent className="w-4 h-4" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-sm">{activity.message}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* View All Activity */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button 
              variant="outline" 
              className="w-full mt-4"
              onClick={() => onNavigate('admin-activity')}
            >
              <Activity className="w-4 h-4 mr-2" />
              {/* @dev-annotation: i18n key - admin.dashboard.activity.viewAll */}
              View All Activity
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}