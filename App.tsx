import React, { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { AddTaskModal } from './components/AddTaskModal';
import { ApplicationShell } from './components/ApplicationShell';
import { ThemeProvider } from './components/ThemeProvider';
import { LocalizationProvider, useLocalization } from './components/LocalizationProvider';
import { SessionProvider, useSession } from './components/SessionProvider';
import { NotificationProvider } from './components/NotificationProvider';
import { OverlayProvider } from './components/ui/OverlayLayer';
import { HomeScreenContent } from './components/content/HomeScreenContent';
import { BoardContent } from './components/content/BoardContent';
import { ProfileScreenContent } from './components/content/ProfileScreenContent';
import { AnonymousProfileScreen } from './components/AnonymousProfileScreen';
import { AdminDashboard } from './components/AdminDashboard';
import { EmployeeDashboard } from './components/EmployeeDashboard';
import { AppBackground } from './components/AppBackground';
import { AppScreenRouter } from './components/AppScreenRouter';
import { motion, AnimatePresence } from 'motion/react';
import { useAppNavigation } from './hooks/useAppNavigation';
import { fullScreenTransitionVariants } from './constants/animations';
import { initialTasks } from './constants/initialData';
import { SHELL_SCREENS, FULL_SCREEN_TRANSITIONS } from './constants/appScreens';

function AppContent() {
  const { session } = useSession();
  const { t } = useLocalization();
  
  const [navigationState, navigationHandlers] = useAppNavigation();
  
  const [selectedTask, setSelectedTask] = useState(null);
  const [showAddTask, setShowAddTask] = useState(false);
  const [tasks, setTasks] = useState(initialTasks);
  
  // Corporate flow state
  const [pendingCompanyData, setPendingCompanyData] = useState<{
    name: string;
    code: string;
    email: string;
  } | null>(null);
  
  // Search state for shared header
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  
  // Active tab state for home screen
  const [activeTab, setActiveTab] = useState('today');
  
  // Board view mode state
  const [boardViewMode, setBoardViewMode] = useState<'list' | 'calendar'>('list');

  // Scroll refs
  const homeScrollRef = useRef<{ scrollToTop: () => void } | null>(null);
  const boardScrollRef = useRef<{ scrollToTop: () => void } | null>(null);

  // Handle initial navigation based on session state
  useEffect(() => {
    if (session?.isAuthenticated && navigationState.currentScreen === 'welcome') {
      let targetScreen = 'home';
      
      if (session.role === 'admin') {
        targetScreen = 'admin-dashboard';
      } else if (session.role === 'employee' && session.membershipStatus === 'active') {
        targetScreen = 'employee-dashboard';
      }
      
      navigationHandlers.setCurrentScreen(targetScreen);
    }
  }, [session?.isAuthenticated, session?.role, session?.membershipStatus]);

  // Enhanced handlers that manage local state
  const handleDeepLinkNavigation = useCallback((taskId: string) => {
    const task = navigationHandlers.handleDeepLinkNavigation(taskId, tasks);
    if (task) {
      setSelectedTask(task);
    }
  }, [tasks, navigationHandlers]);

  const handleTaskUpdate = useCallback((updatedTask: any) => {
    setTasks(tasks.map(t => t.id === updatedTask.id ? updatedTask : t));
    setSelectedTask(updatedTask);
  }, [tasks]);

  const handleCompanyJoinSuccess = useCallback((companyData: any) => {
    const result = navigationHandlers.handleCompanyJoinSuccess(companyData);
    setPendingCompanyData(result);
  }, [navigationHandlers]);

  const handleSwitchToPersonal = useCallback(() => {
    if (session) {
      const { setSession } = useSession();
      setSession({
        ...session,
        role: 'individual',
        currentWorkspaceId: 'personal_workspace',
        membershipStatus: undefined
      });
    }
    navigationHandlers.handleNavigation('home');
  }, [session, navigationHandlers]);

  const handleEditRequest = useCallback(() => {
    navigationHandlers.handleNavigation('company-join');
  }, [navigationHandlers]);

  const handleApprovalGranted = useCallback(() => {
    if (session && session.role === 'employee') {
      const { setSession } = useSession();
      setSession({
        ...session,
        membershipStatus: 'active'
      });
      navigationHandlers.handleNavigation('employee-dashboard');
    }
  }, [session, navigationHandlers]);

  const handleScrollToTop = useCallback((screen: string) => {
    navigationHandlers.handleScrollToTop(screen, {
      homeScrollRef,
      boardScrollRef,
      setActiveTab,
      setSearchQuery,
      setShowSearch
    });
  }, [navigationHandlers]);

  const [authMode, setAuthMode] = useState<'signup' | 'signin'>('signup');

  // Check if current screen uses ApplicationShell
  const usesApplicationShell = useMemo(() => {
    return SHELL_SCREENS.includes(navigationState.currentScreen);
  }, [navigationState.currentScreen]);
  
  // Get overdue tasks for notifications
  const overdueTasks = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    return tasks.filter(task => !task.completed && task.dueDate < today);
  }, [tasks]);

  return (
    <NotificationProvider overdueTasks={overdueTasks}>
      <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
        <AppBackground />

        {/* Container with safe edge padding */}
        <div className="max-w-md mx-auto min-h-screen border-x border-border bg-card relative overflow-hidden px-2">
          {/* Transition overlay */}
          <AnimatePresence>
            {navigationState.isTransitioning && (
              <motion.div
                className="absolute inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <motion.div
                  className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {usesApplicationShell ? (
            <ApplicationShell
              currentScreen={navigationState.currentScreen}
              onNavigate={navigationHandlers.handleNavigation}
              onSwitchToPersonal={handleSwitchToPersonal}
              onEditRequest={handleEditRequest}
              onScrollToTop={handleScrollToTop}
              boardViewMode={boardViewMode}
              onBoardViewModeChange={setBoardViewMode}
            >
              {navigationState.currentScreen === 'home' && (
                <HomeScreenContent
                  tasks={tasks}
                  setTasks={setTasks}
                  onNavigate={navigationHandlers.handleNavigation}
                  onAddTask={() => setShowAddTask(true)}
                  onViewTask={setSelectedTask}
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                  searchQuery={searchQuery}
                  onScrollToTop={homeScrollRef}
                />
              )}
              {navigationState.currentScreen === 'board' && (
                <BoardContent
                  tasks={tasks}
                  setTasks={setTasks}
                  onNavigate={navigationHandlers.handleNavigation}
                  onAddTask={() => setShowAddTask(true)}
                  viewMode={boardViewMode}
                  onViewModeChange={setBoardViewMode}
                />
              )}
              {navigationState.currentScreen === 'profile' && (
                session?.isAuthenticated ? (
                  <ProfileScreenContent onNavigate={navigationHandlers.handleNavigation} />
                ) : (
                  <AnonymousProfileScreen onNavigate={navigationHandlers.handleNavigation} />
                )
              )}
              {navigationState.currentScreen === 'admin-dashboard' && (
                <AdminDashboard onNavigate={navigationHandlers.handleNavigation} />
              )}
              {navigationState.currentScreen === 'employee-dashboard' && (
                <EmployeeDashboard onNavigate={navigationHandlers.handleNavigation} />
              )}
              {navigationState.currentScreen === 'admin-settings' && (
                <ProfileScreenContent onNavigate={navigationHandlers.handleNavigation} />
              )}
            </ApplicationShell>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={navigationState.currentScreen}
                variants={fullScreenTransitionVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={FULL_SCREEN_TRANSITIONS}
                style={{ willChange: 'transform, opacity' }}
                className="absolute inset-0"
              >
                <AppScreenRouter
                  currentScreen={navigationState.currentScreen}
                  authMode={authMode}
                  selectedTask={selectedTask}
                  tasks={tasks}
                  pendingCompanyData={pendingCompanyData}
                  previousScreenForNotifications={navigationState.previousScreenForNotifications}
                  onNavigation={navigationHandlers.handleNavigation}
                  onAuthModeChange={setAuthMode}
                  onRoleSelect={navigationHandlers.handleRoleSelect}
                  onCompanyJoinSuccess={handleCompanyJoinSuccess}
                  onCreateCompanySuccess={navigationHandlers.handleCreateCompanySuccess}
                  onTaskDetailBack={navigationHandlers.handleTaskDetailBack}
                  onNotificationBack={navigationHandlers.handleNotificationBack}
                  onTaskUpdate={handleTaskUpdate}
                  onSwitchToPersonal={handleSwitchToPersonal}
                  onEditRequest={handleEditRequest}
                  onApprovalGranted={handleApprovalGranted}
                  setTasks={setTasks}
                  setSelectedTask={setSelectedTask}
                />
              </motion.div>
            </AnimatePresence>
          )}
          
          {/* Add Task Modal */}
          <AnimatePresence>
            {showAddTask && (
              <AddTaskModal
                onClose={() => setShowAddTask(false)}
                onSave={(newTask) => {
                  setTasks([...tasks, { ...newTask, id: Date.now() }]);
                  setShowAddTask(false);
                }}
              />
            )}
          </AnimatePresence>
        </div>
      </div>
    </NotificationProvider>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <LocalizationProvider>
        <SessionProvider>
          <OverlayProvider>
            <AppContent />
          </OverlayProvider>
        </SessionProvider>
      </LocalizationProvider>
    </ThemeProvider>
  );
}