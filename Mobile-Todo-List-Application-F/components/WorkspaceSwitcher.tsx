import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { 
  ChevronDown, 
  User, 
  Building2, 
  Shield, 
  Users,
  Check,
  Plus
} from 'lucide-react';
import { useSession, Workspace } from './SessionProvider';

interface WorkspaceSwitcherProps {
  onCreateCompany?: () => void;
  className?: string;
}

export function WorkspaceSwitcher({ onCreateCompany, className }: WorkspaceSwitcherProps) {
  const { session, currentWorkspace, switchWorkspace, isAdmin } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  if (!session || !currentWorkspace) return null;

  const getWorkspaceIcon = (workspace: Workspace) => {
    if (workspace.type === 'personal') return User;
    return Building2;
  };

  const getRoleBadge = (workspace: Workspace) => {
    if (workspace.type === 'personal') return null;
    
    const roleColors = {
      owner: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
      admin: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
      member: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
    };

    const roleIcons = {
      owner: Shield,
      admin: Shield,
      member: Users
    };

    const IconComponent = roleIcons[workspace.role];

    return (
      <Badge variant="secondary" className={`text-xs px-2 py-0.5 ${roleColors[workspace.role]}`}>
        <div className="flex items-center space-x-1">
          <IconComponent className="w-3 h-3" />
          <span className="capitalize">{workspace.role}</span>
        </div>
      </Badge>
    );
  };

  return (
    <div className={`relative ${className}`}>
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center space-x-2 px-3 py-2 rounded-xl bg-card/50 backdrop-blur-sm border border-border hover:bg-card/80 transition-all duration-200 text-left min-w-0"
        >
          <div className="flex items-center space-x-2 min-w-0 flex-1">
            <div className="p-1.5 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 flex-shrink-0">
              {React.createElement(getWorkspaceIcon(currentWorkspace), {
                className: "w-4 h-4 text-primary"
              })}
            </div>
            
            <div className="min-w-0 flex-1">
              <p className="text-sm truncate">{currentWorkspace.name}</p>
              {currentWorkspace.type === 'company' && currentWorkspace.memberCount && (
                <p className="text-xs text-muted-foreground">
                  {currentWorkspace.memberCount} members
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-1 flex-shrink-0">
            {getRoleBadge(currentWorkspace)}
            <motion.div
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            </motion.div>
          </div>
        </button>
      </motion.div>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Dropdown Content */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{
                duration: 0.2,
                ease: [0.16, 1, 0.3, 1]
              }}
              className="absolute top-full left-0 right-0 mt-2 bg-card/95 backdrop-blur-xl border border-border rounded-2xl shadow-2xl z-50 overflow-hidden"
            >
              <div className="p-2">
                <div className="space-y-1">
                  {session.workspaces.map((workspace, index) => {
                    const IconComponent = getWorkspaceIcon(workspace);
                    const isCurrentWorkspace = workspace.id === currentWorkspace.id;

                    return (
                      <motion.div
                        key={workspace.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{
                          delay: index * 0.05,
                          duration: 0.3,
                          ease: [0.16, 1, 0.3, 1]
                        }}
                        whileHover={!isCurrentWorkspace ? { x: 4 } : undefined}
                      >
                        <button
                          onClick={() => {
                            if (!isCurrentWorkspace) {
                              switchWorkspace(workspace.id);
                            }
                            setIsOpen(false);
                          }}
                          className={`
                            w-full flex items-center justify-between p-3 rounded-xl transition-all duration-200 text-left
                            ${isCurrentWorkspace
                              ? 'bg-primary/5 border border-primary/20 text-primary'
                              : 'hover:bg-muted/50'
                            }
                          `}
                        >
                          <div className="flex items-center space-x-3 min-w-0 flex-1">
                            <div className={`
                              p-2 rounded-lg flex-shrink-0
                              ${isCurrentWorkspace
                                ? 'bg-primary/10 text-primary'
                                : 'bg-muted/50 text-muted-foreground'
                              }
                            `}>
                              <IconComponent className="w-4 h-4" />
                            </div>
                            
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center space-x-2 mb-1">
                                <p className="text-sm truncate">{workspace.name}</p>
                                {getRoleBadge(workspace)}
                              </div>
                              
                              {workspace.type === 'company' && workspace.memberCount && (
                                <p className="text-xs text-muted-foreground">
                                  {workspace.memberCount} team members
                                </p>
                              )}
                              
                              {workspace.type === 'personal' && (
                                <p className="text-xs text-muted-foreground">
                                  Your personal workspace
                                </p>
                              )}
                            </div>
                          </div>

                          {isCurrentWorkspace && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{
                                type: "spring",
                                stiffness: 500,
                                damping: 30
                              }}
                            >
                              <Check className="w-4 h-4 text-primary flex-shrink-0" />
                            </motion.div>
                          )}
                        </button>
                      </motion.div>
                    );
                  })}

                  {/* Add Workspace Options */}
                  {session.workspaces.length < 3 && (
                    <div className="border-t border-border mt-2 pt-2">
                      {onCreateCompany && (
                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{
                            delay: session.workspaces.length * 0.05 + 0.1,
                            duration: 0.3
                          }}
                          whileHover={{ x: 4 }}
                        >
                          <button
                            onClick={() => {
                              onCreateCompany();
                              setIsOpen(false);
                            }}
                            className="w-full flex items-center space-x-3 p-3 rounded-xl hover:bg-muted/50 transition-all duration-200 text-left group"
                          >
                            <div className="p-2 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 group-hover:from-primary/20 group-hover:to-primary/10 transition-all duration-200">
                              <Plus className="w-4 h-4 text-primary" />
                            </div>
                            
                            <div>
                              <p className="text-sm">Create Company</p>
                              <p className="text-xs text-muted-foreground">
                                Set up your organization
                              </p>
                            </div>
                          </button>
                        </motion.div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}