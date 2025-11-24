import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Checkbox } from './ui/checkbox';
import { Textarea } from './ui/textarea';
import { Alert, AlertDescription } from './ui/alert';
import { ScrollArea } from './ui/scroll-area';
import { RoleBadge } from './shared/RoleBadge';
import { 
  ArrowLeft,
  Search,
  Users,
  Mail,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Filter,
  MoreHorizontal,
  User,
  Building2,
  Shield,
  Loader2
} from 'lucide-react';
import { useSession } from './SessionProvider';

interface UserApprovalRequest {
  id: string;
  name: string;
  email: string;
  domain?: string;
  requestedAt: string;
  requestMethod: 'code' | 'email';
  requestValue: string;
  note?: string;
  status: 'pending' | 'approved' | 'rejected';
  avatar?: string;
}

interface UserApprovalsScreenProps {
  onNavigate: (screen: string) => void;
}

// Mock data for user approval requests
const mockUserApprovals: UserApprovalRequest[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah@acme.com',
    domain: 'acme.com',
    requestedAt: '2024-01-15T10:30:00Z',
    requestMethod: 'email',
    requestValue: 'sarah@acme.com',
    note: 'New hire - Product Manager',
    status: 'pending'
  },
  {
    id: '2', 
    name: 'Mike Chen',
    email: 'mike.chen@acme.com',
    domain: 'acme.com',
    requestedAt: '2024-01-15T09:15:00Z',
    requestMethod: 'code',
    requestValue: 'ACME123',
    note: 'Contractor - UI/UX Designer',
    status: 'pending'
  },
  {
    id: '3',
    name: 'Emma Rodriguez',
    email: 'emma@acme.com', 
    domain: 'acme.com',
    requestedAt: '2024-01-14T16:45:00Z',
    requestMethod: 'email',
    requestValue: 'emma@acme.com',
    status: 'pending'
  }
];

export function UserApprovalsScreen({ onNavigate }: UserApprovalsScreenProps) {
  const { currentWorkspace } = useSession();
  const [selectedRequest, setSelectedRequest] = useState<UserApprovalRequest | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showBulkActions, setShowBulkActions] = useState(false);

  // Filter requests based on search
  const filteredRequests = mockUserApprovals.filter(request =>
    request.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    request.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pendingRequests = filteredRequests.filter(r => r.status === 'pending');

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedItems(pendingRequests.map(r => r.id));
    } else {
      setSelectedItems([]);
    }
  };

  const handleSelectItem = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedItems(prev => [...prev, id]);
    } else {
      setSelectedItems(prev => prev.filter(item => item !== id));
    }
  };

  const handleApproval = async (requestId: string, action: 'approve' | 'reject', note?: string) => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Show success toast (would be implemented with actual toast system)
    console.log(`${action} request ${requestId}`, note);
    
    setIsLoading(false);
    if (selectedRequest) {
      setSelectedRequest(null);
    }
  };

  const handleBulkApproval = async (action: 'approve' | 'reject') => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log(`Bulk ${action}:`, selectedItems);
    setSelectedItems([]);
    setShowBulkActions(false);
    setIsLoading(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  if (selectedRequest) {
    return <UserApprovalDetail 
      request={selectedRequest}
      onBack={() => setSelectedRequest(null)}
      onApproval={handleApproval}
      isLoading={isLoading}
    />;
  }

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-background via-background/98 to-muted/20 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-16 right-8 w-24 h-24 bg-gradient-to-br from-amber-500/10 to-transparent rounded-full blur-2xl"
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
                  {/* @dev-annotation: i18n key - admin.approvals.users.title */}
                  User Approvals
                </h1>
                <p className="text-sm text-muted-foreground">
                  {/* @dev-annotation: i18n key - admin.approvals.users.subtitle */}
                  Review and approve team member requests for {currentWorkspace?.name}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20">
                <Clock className="w-3 h-3 mr-1" />
                {pendingRequests.length} pending
              </Badge>
            </div>
          </div>

          {/* Search and Actions */}
          <div className="flex items-center space-x-3">
            <div className="relative flex-1">
              <Input
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 bg-card/50 backdrop-blur-sm border-border/60"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            </div>

            <AnimatePresence>
              {selectedItems.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="flex items-center space-x-2"
                >
                  <Badge variant="secondary" className="bg-primary/10 text-primary">
                    {selectedItems.length} selected
                  </Badge>
                  
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      size="sm"
                      onClick={() => handleBulkApproval('approve')}
                      disabled={isLoading}
                      className="bg-emerald-500 hover:bg-emerald-600 text-white"
                    >
                      {isLoading ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        <CheckCircle2 className="w-3 h-3" />
                      )}
                    </Button>
                  </motion.div>
                  
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleBulkApproval('reject')}
                      disabled={isLoading}
                      className="border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950/30"
                    >
                      <XCircle className="w-3 h-3" />
                    </Button>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Content */}
        <motion.div
          className="flex-1 overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {pendingRequests.length > 0 ? (
            <div className="space-y-3">
              {/* Select All Header */}
              <div className="flex items-center space-x-3 p-3 bg-card/30 backdrop-blur-sm border border-border/50 rounded-xl">
                <Checkbox
                  checked={selectedItems.length === pendingRequests.length}
                  onCheckedChange={handleSelectAll}
                />
                <span className="text-sm text-muted-foreground">
                  {/* @dev-annotation: i18n key - admin.approvals.selectAll */}
                  Select all ({pendingRequests.length})
                </span>
              </div>

              {/* @dev-annotation: Virtualization recommended for >50 items */}
              <ScrollArea className="h-96">
                <div className="space-y-3 pr-4">
                  {filteredRequests.map((request, index) => (
                    <motion.div
                      key={request.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + index * 0.05 }}
                      whileHover={{ scale: 1.01 }}
                      className="cursor-pointer"
                      onClick={() => setSelectedRequest(request)}
                    >
                      <div className="flex items-center space-x-3 p-4 bg-card/50 backdrop-blur-sm border border-border/60 rounded-xl hover:bg-card/80 transition-all duration-200">
                        <div className="flex items-center space-x-3 flex-1">
                          <Checkbox
                            checked={selectedItems.includes(request.id)}
                            onCheckedChange={(checked) => handleSelectItem(request.id, checked as boolean)}
                            onClick={(e) => e.stopPropagation()}
                          />

                          <Avatar className="w-10 h-10">
                            <AvatarFallback className="bg-primary/10 text-primary">
                              {getInitials(request.name)}
                            </AvatarFallback>
                          </Avatar>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-1">
                              <h3 className="text-sm truncate">{request.name}</h3>
                              <Badge variant="secondary" className="text-xs bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20">
                                Pending
                              </Badge>
                            </div>
                            <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                              <div className="flex items-center space-x-1">
                                <Mail className="w-3 h-3" />
                                <span className="truncate">{request.email}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Calendar className="w-3 h-3" />
                                <span>{formatDate(request.requestedAt)}</span>
                              </div>
                            </div>
                            {request.note && (
                              <p className="text-xs text-muted-foreground mt-1 truncate">
                                "{request.note}"
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <motion.div
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleApproval(request.id, 'approve');
                            }}
                          >
                            <Button size="sm" className="bg-emerald-500 hover:bg-emerald-600 text-white h-8 w-8 p-0">
                              <CheckCircle2 className="w-4 h-4" />
                            </Button>
                          </motion.div>
                          
                          <motion.div
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleApproval(request.id, 'reject');
                            }}
                          >
                            <Button size="sm" variant="outline" className="border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950/30 h-8 w-8 p-0">
                              <XCircle className="w-4 h-4" />
                            </Button>
                          </motion.div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          ) : (
            /* Empty State */
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col items-center justify-center h-96 text-center"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-amber-500/20 via-amber-400/10 to-transparent rounded-2xl flex items-center justify-center mb-4">
                <Users className="w-8 h-8 text-amber-600 dark:text-amber-400" />
              </div>
              <h3 className="text-lg mb-2">
                {/* @dev-annotation: i18n key - admin.approvals.users.empty.title */}
                No pending requests
              </h3>
              <p className="text-muted-foreground max-w-sm">
                {/* @dev-annotation: i18n key - admin.approvals.users.empty.description */}
                All membership requests have been reviewed. New requests will appear here.
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

// User Approval Detail Component
interface UserApprovalDetailProps {
  request: UserApprovalRequest;
  onBack: () => void;
  onApproval: (requestId: string, action: 'approve' | 'reject', note?: string) => void;
  isLoading: boolean;
}

function UserApprovalDetail({ request, onBack, onApproval, isLoading }: UserApprovalDetailProps) {
  const [rejectNote, setRejectNote] = useState('');
  const [showRejectForm, setShowRejectForm] = useState(false);

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
            
            <div>
              <h1 className="text-xl mb-1">
                {/* @dev-annotation: i18n key - admin.approvals.users.detail.title */}
                Membership Request
              </h1>
              <p className="text-sm text-muted-foreground">
                {/* @dev-annotation: i18n key - admin.approvals.users.detail.subtitle */}
                Review request details and approve or reject
              </p>
            </div>
          </div>
        </motion.div>

        {/* Request Details */}
        <motion.div
          className="space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {/* User Info Card */}
          <div className="bg-card/50 backdrop-blur-sm border border-border/60 rounded-2xl p-6">
            <div className="flex items-start space-x-4 mb-4">
              <Avatar className="w-16 h-16">
                <AvatarFallback className="bg-primary/10 text-primary text-lg">
                  {getInitials(request.name)}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <h2 className="text-lg mb-1">{request.name}</h2>
                <div className="flex items-center space-x-2 mb-2">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">{request.email}</span>
                </div>
                {request.domain && (
                  <div className="flex items-center space-x-2">
                    <Building2 className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">@{request.domain}</span>
                  </div>
                )}
              </div>

              <Badge variant="secondary" className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20">
                <Clock className="w-3 h-3 mr-1" />
                Pending
              </Badge>
            </div>

            {request.note && (
              <div className="p-4 bg-muted/30 rounded-xl">
                <p className="text-sm text-muted-foreground mb-1">Note:</p>
                <p className="text-sm">{request.note}</p>
              </div>
            )}
          </div>

          {/* Request Details */}
          <div className="bg-card/50 backdrop-blur-sm border border-border/60 rounded-2xl p-6">
            <h3 className="text-lg mb-4">Request Information</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-muted-foreground">Request Method</span>
                <Badge variant="outline">
                  {request.requestMethod === 'email' ? 'Email Domain' : 'Company Code'}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-muted-foreground">Request Value</span>
                <span className="text-sm font-mono bg-muted/50 px-2 py-1 rounded">
                  {request.requestValue}
                </span>
              </div>
              
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-muted-foreground">Requested At</span>
                <span className="text-sm">{formatDate(request.requestedAt)}</span>
              </div>
            </div>
          </div>

          {/* Reject Form */}
          <AnimatePresence>
            {showRejectForm && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-red-50/50 dark:bg-red-950/20 backdrop-blur-sm border border-red-200/60 dark:border-red-800/50 rounded-2xl p-6"
              >
                <h3 className="text-lg mb-3 text-red-700 dark:text-red-400">
                  {/* @dev-annotation: i18n key - admin.approvals.users.reject.title */}
                  Rejection Reason
                </h3>
                <Textarea
                  placeholder="Please provide a reason for rejection (optional)..."
                  value={rejectNote}
                  onChange={(e) => setRejectNote(e.target.value)}
                  className="mb-4 bg-background/50"
                />
                <div className="flex items-center space-x-3">
                  <Button
                    onClick={() => onApproval(request.id, 'reject', rejectNote)}
                    disabled={isLoading}
                    className="bg-red-500 hover:bg-red-600 text-white"
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : (
                      <XCircle className="w-4 h-4 mr-2" />
                    )}
                    {/* @dev-annotation: i18n key - actions.reject */}
                    Confirm Rejection
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowRejectForm(false)}
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

      {/* Action Buttons */}
      <motion.div
        className="p-6 border-t border-border/50 bg-card/30 backdrop-blur-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="grid grid-cols-2 gap-3">
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              onClick={() => onApproval(request.id, 'approve')}
              disabled={isLoading}
              className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <CheckCircle2 className="w-4 h-4 mr-2" />
              )}
              {/* @dev-annotation: i18n key - actions.approve */}
              Approve Request
            </Button>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              variant="outline"
              onClick={() => setShowRejectForm(true)}
              disabled={isLoading || showRejectForm}
              className="w-full py-3 border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950/30"
            >
              <XCircle className="w-4 h-4 mr-2" />
              {/* @dev-annotation: i18n key - actions.reject */}
              Reject Request
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}