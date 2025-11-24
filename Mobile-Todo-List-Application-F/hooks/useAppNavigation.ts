import { useState, useCallback } from 'react';
import { useSession } from '../components/SessionProvider';
import type { UserRole } from '../components/SessionProvider';

export interface AppNavigationState {
  currentScreen: string;
  previousShellScreen: string;
  previousScreenForNotifications: string;
  authMode: 'signup' | 'signin';
  isTransitioning: boolean;
}

export interface NavigationHandlers {
  handleNavigation: (newScreen: string) => void;
  handleDeepLinkNavigation: (taskId: string, tasks: any[]) => void;
  handleTaskDetailBack: () => void;
  handleNotificationBack: () => void;
  handleScrollToTop: (screen: string, refs: { homeScrollRef: any; boardScrollRef: any; setActiveTab: any; setSearchQuery: any; setShowSearch: any }) => void;
  handleRoleSelect: (role: UserRole) => void;
  handleCompanyJoinSuccess: (companyData: { name: string; code: string; email: string }) => void;
  handleCreateCompanySuccess: (companyData: { name: string; domain?: string; logo?: string }) => void;
  setCurrentScreen: (screen: string) => void;
  setIsTransitioning: (transitioning: boolean) => void;
  setSelectedTask: (task: any) => void;
  setPendingCompanyData: (data: any) => void;
}

export function useAppNavigation(
  initialScreen: string = 'welcome'
): [AppNavigationState, NavigationHandlers] {
  const { session, setSession } = useSession();
  
  const [currentScreen, setCurrentScreen] = useState(initialScreen);
  const [previousShellScreen, setPreviousShellScreen] = useState('home');
  const [previousScreenForNotifications, setPreviousScreenForNotifications] = useState<string>('home');
  const [authMode, setAuthMode] = useState<'signup' | 'signin'>('signup');
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Enhanced navigation with transition states and deep link handling
  const handleNavigation = useCallback((newScreen: string) => {
    setIsTransitioning(true);
    
    // Update state in a single batch to prevent multiple re-renders
    setTimeout(() => {
      setCurrentScreen(prevScreen => {
        // Track shell state for deep linking back navigation
        const shellScreens = ['home', 'board', 'profile', 'admin-dashboard', 'employee-dashboard'];
        if (shellScreens.includes(prevScreen)) {
          setPreviousShellScreen(prevScreen);
        }
        
        // Track previous screen for notifications back navigation
        if (newScreen === 'notifications') {
          setPreviousScreenForNotifications(prevScreen);
        }
        
        return newScreen;
      });
      setIsTransitioning(false);
    }, 150);
  }, []);

  // Handle deep link navigation (e.g., /task/:id)
  const handleDeepLinkNavigation = useCallback((taskId: string, tasks: any[]) => {
    const task = tasks.find(t => t.id.toString() === taskId);
    if (task) {
      // This will be handled by the parent component
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentScreen(prevScreen => {
          const shellScreens = ['home', 'board', 'profile', 'admin-dashboard', 'employee-dashboard'];
          if (shellScreens.includes(prevScreen)) {
            setPreviousShellScreen(prevScreen);
          }
          return 'task-detail';
        });
        setIsTransitioning(false);
      }, 150);
      return task;
    }
    return null;
  }, []);

  // Handle back navigation from task detail - preserves shell state
  const handleTaskDetailBack = useCallback(() => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentScreen(previousShellScreen);
      setIsTransitioning(false);
    }, 150);
  }, [previousShellScreen]);

  // Handle back navigation from notifications
  const handleNotificationBack = useCallback(() => {
    setIsTransitioning(true);
    setTimeout(() => {
      const shellScreens = ['home', 'board', 'profile', 'admin-dashboard', 'employee-dashboard'];
      const targetScreen = shellScreens.includes(previousScreenForNotifications) 
        ? previousScreenForNotifications 
        : 'home';
      setCurrentScreen(targetScreen);
      setIsTransitioning(false);
    }, 150);
  }, [previousScreenForNotifications]);

  // Handle scroll-to-top on tab reselection
  const handleScrollToTop = useCallback((
    screen: string, 
    refs: { 
      homeScrollRef: any; 
      boardScrollRef: any; 
      setActiveTab: any; 
      setSearchQuery: any; 
      setShowSearch: any;
    }
  ) => {
    if (screen === 'home' && refs.homeScrollRef.current) {
      refs.homeScrollRef.current.scrollToTop();
      // Reset filters/search on tab reselection
      refs.setActiveTab('today');
      refs.setSearchQuery('');
      refs.setShowSearch(false);
    } else if (screen === 'board' && refs.boardScrollRef.current) {
      refs.boardScrollRef.current.scrollToTop();
    }
  }, []);

  // Handle role selection and corporate flows
  const handleRoleSelect = useCallback((role: UserRole) => {
    if (role === 'individual') {
      // Update session and go to home
      if (session) {
        setSession({
          ...session,
          role: 'individual'
        });
      }
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentScreen('home');
        setIsTransitioning(false);
      }, 150);
    } else if (role === 'employee') {
      // Go to company join flow
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentScreen('company-join');
        setIsTransitioning(false);
      }, 150);
    } else if (role === 'admin') {
      // Go to create company flow
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentScreen('create-company');
        setIsTransitioning(false);
      }, 150);
    }
  }, [session, setSession]);

  const handleCompanyJoinSuccess = useCallback((companyData: { name: string; code: string; email: string }) => {
    // This will be handled by the parent component
    // Update session with employee role and pending status
    if (session) {
      setSession({
        ...session,
        role: 'employee',
        membershipStatus: 'pending'
      });
    }
    
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentScreen('pending-approval');
      setIsTransitioning(false);
    }, 150);
    return companyData;
  }, [session, setSession]);

  const handleCreateCompanySuccess = useCallback((companyData: { name: string; domain?: string; logo?: string }) => {
    if (session) {
      // Create new company workspace
      const newWorkspace = {
        id: `company_${Date.now()}`,
        type: 'company' as const,
        name: companyData.name,
        role: 'owner' as const,
        companyDomain: companyData.domain,
        memberCount: 1
      };

      // Update session with admin role and add company workspace
      setSession({
        ...session,
        role: 'admin',
        workspaces: [...session.workspaces, newWorkspace],
        currentWorkspaceId: newWorkspace.id,
        membershipStatus: 'active'
      });
    }
    
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentScreen('admin-dashboard');
      setIsTransitioning(false);
    }, 150);
  }, [session, setSession]);

  // Placeholder functions for parent component to handle
  const setSelectedTask = useCallback((task: any) => {
    // This will be handled by the parent component
  }, []);

  const setPendingCompanyData = useCallback((data: any) => {
    // This will be handled by the parent component
  }, []);

  const state: AppNavigationState = {
    currentScreen,
    previousShellScreen,
    previousScreenForNotifications,
    authMode,
    isTransitioning
  };

  const handlers: NavigationHandlers = {
    handleNavigation,
    handleDeepLinkNavigation,
    handleTaskDetailBack,
    handleNotificationBack,
    handleScrollToTop,
    handleRoleSelect,
    handleCompanyJoinSuccess,
    handleCreateCompanySuccess,
    setCurrentScreen,
    setIsTransitioning,
    setSelectedTask,
    setPendingCompanyData
  };

  return [state, handlers];
}