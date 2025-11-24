import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from './ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from './ui/alert-dialog';
import { ScrollArea } from './ui/scroll-area';
import { RoleBadge } from './shared/RoleBadge';
import { 
  ArrowLeft,
  Search,
  Users,
  MoreHorizontal,
  Shield,
  UserMinus,
  UserX,
  Clock,
  UserPlus,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Settings,
  Crown
} from 'lucide-react';
import { useSession } from './SessionProvider';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'owner' | 'admin' | 'member';
  status: 'active' | 'inactive' | 'pending';
  avatar?: string;
  lastActive: string;
  joinedAt: string;
  isOnline?: boolean;
}

interface MembersScreenProps {
  onNavigate: (screen: string) => void;
}

// Mock team members data
const mockTeamMembers: TeamMember[] = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john@acme.com',
    role: 'owner',
    status: 'active',
    lastActive: 'Now',
    joinedAt: '2023-01-15T09:00:00Z',
    isOnline: true
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah@acme.com',
    role: 'admin',
    status: 'active',
    lastActive: '5 minutes ago',
    joinedAt: '2023-02-10T14:30:00Z',
    isOnline: true
  },
  {
    id: '3',
    name: 'Mike Chen',
    email: 'mike@acme.com',
    role: 'admin',
    status: 'active',
    lastActive: '2 hours ago',
    joinedAt: '2023-03-20T11:15:00Z',
    isOnline: false
  },
  {
    id: '4',
    name: 'Emma Rodriguez',
    email: 'emma@acme.com',
    role: 'member',
    status: 'active',
    lastActive: '1 hour ago',
    joinedAt: '2023-04-05T16:45:00Z',
    isOnline: false
  },
  {
    id: '5',
    name: 'David Kim',
    email: 'david@acme.com',
    role: 'member',
    status: 'inactive',
    lastActive: '3 days ago',
    joinedAt: '2023-05-12T10:20:00Z',
    isOnline: false
  },
  {
    id: '6',
    name: 'Lisa Wang',
    email: 'lisa@acme.com',
    role: 'member',
    status: 'pending',
    lastActive: 'Never',
    joinedAt: '2024-01-15T12:00:00Z',
    isOnline: false
  }
];

type FilterType = 'all' | 'admin' | 'member' | 'pending' | 'inactive';

export function MembersScreen({ onNavigate }: MembersScreenProps) {
  const { currentWorkspace, session } = useSession();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [actionType, setActionType] = useState<'promote' | 'demote' | 'deactivate' | 'remove' | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Filter members based on search and filter type
  const filteredMembers = mockTeamMembers.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter = activeFilter === 'all' || 
                         (activeFilter === 'admin' && (member.role === 'admin' || member.role === 'owner')) ||
                         (activeFilter === 'member' && member.role === 'member') ||
                         (activeFilter === 'pending' && member.status === 'pending') ||
                         (activeFilter === 'inactive' && member.status === 'inactive');

    return matchesSearch && matchesFilter;
  });

  const memberCounts = {
    all: mockTeamMembers.length,
    admin: mockTeamMembers.filter(m => m.role === 'admin' || m.role === 'owner').length,
    member: mockTeamMembers.filter(m => m.role === 'member').length,
    pending: mockTeamMembers.filter(m => m.status === 'pending').length,
    inactive: mockTeamMembers.filter(m => m.status === 'inactive').length
  };

  const handleMemberAction = async (memberId: string, action: string) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    console.log(`${action} member ${memberId}`);
    setIsLoading(false);
    setSelectedMember(null);
    setActionType(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-emerald-600 bg-emerald-50 border-emerald-200 dark:bg-emerald-950/30 dark:border-emerald-800/50 dark:text-emerald-400';
      case 'pending':
        return 'text-amber-600 bg-amber-50 border-amber-200 dark:bg-amber-950/30 dark:border-amber-800/50 dark:text-amber-400';
      default:
        return 'text-slate-600 bg-slate-50 border-slate-200 dark:bg-slate-950/30 dark:border-slate-800/50 dark:text-slate-400';
    }
  };

  const canManageMember = (member: TeamMember) => {
    if (member.role === 'owner') return false;
    if (member.id === session?.userId) return false;
    return true;
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-background via-background/98 to-muted/20 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-16 right-8 w-24 h-24 bg-gradient-to-br from-emerald-500/10 to-transparent rounded-full blur-2xl"
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
                  {/* @dev-annotation: i18n key - admin.members.title */}
                  Team Members
                </h1>
                <p className="text-sm text-muted-foreground">
                  {/* @dev-annotation: i18n key - admin.members.subtitle */}
                  Manage roles and permissions for {currentWorkspace?.name}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20">
                <Users className="w-3 h-3 mr-1" />
                {memberCounts.all} members
              </Badge>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  size="sm"
                  onClick={() => onNavigate('admin-invites')}
                  className="bg-primary hover:bg-primary/90"
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  {/* @dev-annotation: i18n key - admin.members.invite */}
                  Invite
                </Button>
              </motion.div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="space-y-3">
            <div className="relative">
              <Input
                placeholder="Search by name or email..."
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
                { id: 'all', label: 'All', count: memberCounts.all },
                { id: 'admin', label: 'Admins', count: memberCounts.admin },
                { id: 'member', label: 'Members', count: memberCounts.member },
                { id: 'pending', label: 'Pending', count: memberCounts.pending },
                { id: 'inactive', label: 'Inactive', count: memberCounts.inactive }
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
          {filteredMembers.length > 0 ? (
            /* @dev-annotation: Virtualization recommended for >50 items */
            <ScrollArea className="h-96">
              <div className="space-y-3 pr-4">
                {filteredMembers.map((member, index) => (
                  <motion.div
                    key={member.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.05 }}
                    className="p-4 bg-card/50 backdrop-blur-sm border border-border/60 rounded-xl hover:bg-card/80 transition-all duration-200"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3 flex-1 min-w-0">
                        <div className="relative">
                          <Avatar className="w-12 h-12">
                            <AvatarFallback className="bg-primary/10 text-primary">
                              {getInitials(member.name)}
                            </AvatarFallback>
                          </Avatar>
                          
                          {/* Online Status */}
                          {member.isOnline && (
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-card rounded-full" />
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="text-sm truncate">{member.name}</h3>
                            <RoleBadge role={member.role} size="sm" />
                            <Badge variant="outline" className={`text-xs px-2 py-0.5 ${getStatusColor(member.status)}`}>
                              {member.status}
                            </Badge>
                          </div>
                          
                          <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                            <span className="truncate">{member.email}</span>
                            <div className="flex items-center space-x-1">
                              <Clock className="w-3 h-3" />
                              <span>{member.lastActive}</span>
                            </div>
                          </div>
                          
                          <p className="text-xs text-muted-foreground mt-1">
                            Joined {formatDate(member.joinedAt)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        {member.role === 'owner' && (
                          <Crown className="w-4 h-4 text-purple-500" />
                        )}
                        
                        {canManageMember(member) && (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <motion.div
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                              >
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                  <MoreHorizontal className="w-4 h-4" />
                                </Button>
                              </motion.div>
                            </DropdownMenuTrigger>
                            
                            <DropdownMenuContent align="end" className="w-48">
                              {member.role === 'member' && (
                                <DropdownMenuItem
                                  onClick={() => {
                                    setSelectedMember(member);
                                    setActionType('promote');
                                  }}
                                  className="cursor-pointer"
                                >
                                  <Shield className="w-4 h-4 mr-2" />
                                  {/* @dev-annotation: i18n key - admin.members.actions.makeAdmin */}
                                  Make Admin
                                </DropdownMenuItem>
                              )}
                              
                              {member.role === 'admin' && (
                                <DropdownMenuItem
                                  onClick={() => {
                                    setSelectedMember(member);
                                    setActionType('demote');
                                  }}
                                  className="cursor-pointer"
                                >
                                  <UserMinus className="w-4 h-4 mr-2" />
                                  {/* @dev-annotation: i18n key - admin.members.actions.removeAdmin */}
                                  Remove Admin
                                </DropdownMenuItem>
                              )}
                              
                              <DropdownMenuSeparator />
                              
                              {member.status === 'active' && (
                                <DropdownMenuItem
                                  onClick={() => {
                                    setSelectedMember(member);
                                    setActionType('deactivate');
                                  }}
                                  className="cursor-pointer text-amber-600"
                                >
                                  <UserX className="w-4 h-4 mr-2" />
                                  {/* @dev-annotation: i18n key - admin.members.actions.deactivate */}
                                  Deactivate
                                </DropdownMenuItem>
                              )}
                              
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedMember(member);
                                  setActionType('remove');
                                }}
                                className="cursor-pointer text-destructive"
                              >
                                <UserX className="w-4 h-4 mr-2" />
                                {/* @dev-annotation: i18n key - admin.members.actions.remove */}
                                Remove Member
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </div>
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
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500/20 via-emerald-400/10 to-transparent rounded-2xl flex items-center justify-center mb-4">
                <Users className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="text-lg mb-2">
                {/* @dev-annotation: i18n key - admin.members.empty.title */}
                {activeFilter === 'all' ? 'No team members found' : `No ${activeFilter} members`}
              </h3>
              <p className="text-muted-foreground max-w-sm">
                {/* @dev-annotation: i18n key - admin.members.empty.description */}
                {searchQuery 
                  ? 'Try adjusting your search or filter criteria.'
                  : 'Invite team members to start collaborating on tasks and projects.'
                }
              </p>
              
              {!searchQuery && activeFilter === 'all' && (
                <motion.div
                  className="mt-4"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button onClick={() => onNavigate('admin-invites')}>
                    <UserPlus className="w-4 h-4 mr-2" />
                    {/* @dev-annotation: i18n key - admin.members.invite */}
                    Invite Team Members
                  </Button>
                </motion.div>
              )}
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Confirmation Dialog */}
      <AlertDialog open={!!selectedMember && !!actionType} onOpenChange={() => {
        setSelectedMember(null);
        setActionType(null);
      }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {actionType === 'promote' && 'Make Admin?'}
              {actionType === 'demote' && 'Remove Admin Role?'}
              {actionType === 'deactivate' && 'Deactivate Member?'}
              {actionType === 'remove' && 'Remove Member?'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {actionType === 'promote' && `Give ${selectedMember?.name} admin permissions? They will be able to manage team members and approve tasks.`}
              {actionType === 'demote' && `Remove admin permissions from ${selectedMember?.name}? They will become a regular member.`}
              {actionType === 'deactivate' && `Deactivate ${selectedMember?.name}? They won't be able to access the workspace but their data will be preserved.`}
              {actionType === 'remove' && `Permanently remove ${selectedMember?.name} from the team? This action cannot be undone.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => selectedMember && actionType && handleMemberAction(selectedMember.id, actionType)}
              disabled={isLoading}
              className={actionType === 'remove' ? 'bg-destructive hover:bg-destructive/90' : ''}
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  <span>Processing...</span>
                </div>
              ) : (
                <>
                  {actionType === 'promote' && 'Make Admin'}
                  {actionType === 'demote' && 'Remove Admin'}
                  {actionType === 'deactivate' && 'Deactivate'}
                  {actionType === 'remove' && 'Remove'}
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}