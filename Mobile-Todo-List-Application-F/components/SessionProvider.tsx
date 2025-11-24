import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { motion } from 'motion/react';

export type UserRole = 'individual' | 'employee' | 'admin';
export type WorkspaceType = 'personal' | 'company';
export type MembershipStatus = 'pending' | 'active';

export interface Workspace {
  id: string;
  type: WorkspaceType;
  name: string;
  role: 'owner' | 'admin' | 'member';
  companyDomain?: string;
  memberCount?: number;
}

export interface Session {
  id: string;
  name: string;
  email: string | null;
  avatar: string | null;
  role: UserRole;
  isAuthenticated: boolean;
  workspaces: Workspace[];
  currentWorkspaceId: string;
  membershipStatus?: MembershipStatus;
}

interface SessionContextType {
  session: Session | null;
  setSession: (session: Session | null) => void;
  currentWorkspace: Workspace | null;
  switchWorkspace: (workspaceId: string) => void;
  isAdmin: boolean;
  isEmployee: boolean;
  isInCompanyWorkspace: boolean;
  isAuthenticated: boolean;
  isGuestUser: boolean;
  clearSession: () => void;
  updateMembershipStatus: (status: MembershipStatus) => void;
  addWorkspace: (workspace: Workspace) => void;
  removeWorkspace: (workspaceId: string) => void;
}

const SessionContext = createContext<SessionContextType | null>(null);

export function useSession() {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
}

interface SessionProviderProps {
  children: React.ReactNode;
}

export function SessionProvider({ children }: SessionProviderProps) {
  const [session, setSessionState] = useState<Session | null>(() => {
    // Load session from localStorage on initialization
    if (typeof window !== 'undefined') {
      try {
        const savedSession = localStorage.getItem('taskflow_session');
        if (savedSession) {
          return JSON.parse(savedSession);
        }
      } catch (error) {
        console.warn('Failed to load session from localStorage:', error);
      }
    }
    // Return null - no default session, start from welcome screen
    return null;
  });

  const setSession = useCallback((newSession: Session | null) => {
    setSessionState(newSession);
    // Persist session to localStorage
    if (typeof window !== 'undefined') {
      try {
        if (newSession) {
          localStorage.setItem('taskflow_session', JSON.stringify(newSession));
        } else {
          localStorage.removeItem('taskflow_session');
        }
      } catch (error) {
        console.warn('Failed to save session to localStorage:', error);
      }
    }
  }, []);

  const currentWorkspace = useMemo(() => {
    return session?.workspaces.find(w => w.id === session.currentWorkspaceId) || null;
  }, [session?.workspaces, session?.currentWorkspaceId]);

  const switchWorkspace = useCallback((workspaceId: string) => {
    setSessionState(currentSession => {
      if (currentSession) {
        const workspace = currentSession.workspaces.find(w => w.id === workspaceId);
        if (workspace) {
          const updatedSession = {
            ...currentSession,
            currentWorkspaceId: workspaceId
          };
          
          // Persist to localStorage
          if (typeof window !== 'undefined') {
            try {
              localStorage.setItem('taskflow_session', JSON.stringify(updatedSession));
            } catch (error) {
              console.warn('Failed to save session to localStorage:', error);
            }
          }
          
          return updatedSession;
        }
      }
      return currentSession;
    });
  }, []);

  const updateMembershipStatus = useCallback((status: MembershipStatus) => {
    setSessionState(currentSession => {
      if (currentSession) {
        const updatedSession = {
          ...currentSession,
          membershipStatus: status
        };
        
        // Persist to localStorage
        if (typeof window !== 'undefined') {
          try {
            localStorage.setItem('taskflow_session', JSON.stringify(updatedSession));
          } catch (error) {
            console.warn('Failed to save session to localStorage:', error);
          }
        }
        
        return updatedSession;
      }
      return currentSession;
    });
  }, []);

  const addWorkspace = useCallback((workspace: Workspace) => {
    setSessionState(currentSession => {
      if (currentSession) {
        const updatedSession = {
          ...currentSession,
          workspaces: [...currentSession.workspaces, workspace]
        };
        
        // Persist to localStorage
        if (typeof window !== 'undefined') {
          try {
            localStorage.setItem('taskflow_session', JSON.stringify(updatedSession));
          } catch (error) {
            console.warn('Failed to save session to localStorage:', error);
          }
        }
        
        return updatedSession;
      }
      return currentSession;
    });
  }, []);

  const removeWorkspace = useCallback((workspaceId: string) => {
    setSessionState(currentSession => {
      if (currentSession) {
        const filteredWorkspaces = currentSession.workspaces.filter(w => w.id !== workspaceId);
        const updatedSession = {
          ...currentSession,
          workspaces: filteredWorkspaces,
          currentWorkspaceId: filteredWorkspaces.length > 0 ? filteredWorkspaces[0].id : ''
        };
        
        // Persist to localStorage
        if (typeof window !== 'undefined') {
          try {
            localStorage.setItem('taskflow_session', JSON.stringify(updatedSession));
          } catch (error) {
            console.warn('Failed to save session to localStorage:', error);
          }
        }
        
        return updatedSession;
      }
      return currentSession;
    });
  }, []);

  const isAdmin = useMemo(() => session?.role === 'admin', [session?.role]);
  const isEmployee = useMemo(() => session?.role === 'employee', [session?.role]);
  const isInCompanyWorkspace = useMemo(() => currentWorkspace?.type === 'company', [currentWorkspace?.type]);
  const isAuthenticated = useMemo(() => session?.isAuthenticated ?? false, [session?.isAuthenticated]);
  const isGuestUser = useMemo(() => session ? !session.isAuthenticated : false, [session?.isAuthenticated]);

  const clearSession = useCallback(() => {
    setSessionState(null);
    // Clear localStorage
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem('taskflow_session');
      } catch (error) {
        console.warn('Failed to clear session from localStorage:', error);
      }
    }
  }, []);

  const value: SessionContextType = useMemo(() => ({
    session,
    setSession,
    currentWorkspace,
    switchWorkspace,
    isAdmin,
    isEmployee,
    isInCompanyWorkspace,
    isAuthenticated,
    isGuestUser,
    clearSession,
    updateMembershipStatus,
    addWorkspace,
    removeWorkspace
  }), [
    session,
    setSession,
    currentWorkspace,
    switchWorkspace,
    isAdmin,
    isEmployee,
    isInCompanyWorkspace,
    isAuthenticated,
    isGuestUser,
    clearSession,
    updateMembershipStatus,
    addWorkspace,
    removeWorkspace
  ]);

  return (
    <SessionContext.Provider value={value}>
      {children}
    </SessionContext.Provider>
  );
}