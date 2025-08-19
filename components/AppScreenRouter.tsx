import React from 'react';
import { WelcomeScreen } from './WelcomeScreen';
import { OnboardingCarousel } from './OnboardingCarousel';
import { AuthSelectionScreen } from './AuthSelectionScreen';
import { AuthScreen } from './AuthScreen';
import { RoleSelectionScreen } from './RoleSelectionScreen';
import { CompanyJoinScreen } from './CompanyJoinScreen';
import { CreateCompanyScreen } from './CreateCompanyScreen';
import { PendingApprovalScreen } from './PendingApprovalScreen';
import { PersonalInformationScreen } from './PersonalInformationScreen';
import { NotificationScreen } from './NotificationScreen';
import { PrivacySecurityScreen } from './PrivacySecurityScreen';
import { ConnectedDevicesScreen } from './ConnectedDevicesScreen';
import { AppSettingsScreen } from './AppSettingsScreen';
import { HelpSupportScreen } from './HelpSupportScreen';
import { TaskDetailScreen } from './TaskDetailScreen';
import { UserApprovalsScreen } from './UserApprovalsScreen';
import { TaskApprovalsScreen } from './TaskApprovalsScreen';
import { MembersScreen } from './MembersScreen';
import { AdminActivityScreen } from './AdminActivityScreen';
import { AdminInvitesScreen } from './AdminInvitesScreen';
import { AdminCompanySettingsScreen } from './AdminCompanySettingsScreen';
import { useSession } from './SessionProvider';
import type { UserRole } from './SessionProvider';

interface AppScreenRouterProps {
  currentScreen: string;
  authMode: 'signup' | 'signin';
  selectedTask: any;
  tasks: any[];
  pendingCompanyData: any;
  previousScreenForNotifications: string;
  onNavigation: (screen: string) => void;
  onAuthModeChange: (mode: 'signup' | 'signin') => void;
  onRoleSelect: (role: UserRole) => void;
  onCompanyJoinSuccess: (data: any) => void;
  onCreateCompanySuccess: (data: any) => void;
  onTaskDetailBack: () => void;
  onNotificationBack: () => void;
  onTaskUpdate: (task: any) => void;
  onSwitchToPersonal: () => void;
  onEditRequest: () => void;
  onApprovalGranted: () => void;
  setTasks: (tasks: any[]) => void;
  setSelectedTask: (task: any) => void;
}

export function AppScreenRouter({
  currentScreen,
  authMode,
  selectedTask,
  tasks,
  pendingCompanyData,
  previousScreenForNotifications,
  onNavigation,
  onAuthModeChange,
  onRoleSelect,
  onCompanyJoinSuccess,
  onCreateCompanySuccess,
  onTaskDetailBack,
  onNotificationBack,
  onTaskUpdate,
  onSwitchToPersonal,
  onEditRequest,
  onApprovalGranted,
  setTasks,
  setSelectedTask
}: AppScreenRouterProps) {
  // ✅ Hook'u component'in tepesinde çağırıyoruz
  const { session, setSession } = useSession();

  switch (currentScreen) {
    case 'welcome':
      return <WelcomeScreen onNext={() => onNavigation('onboarding')} onSkip={() => onNavigation('auth-selection')} />;
      
    case 'onboarding':
      return <OnboardingCarousel onComplete={() => onNavigation('auth-selection')} />;
      
    case 'auth-selection':
      return (
        <AuthSelectionScreen 
          onSelectSignUp={() => {
            onAuthModeChange('signup');
            onNavigation('auth');
          }}
          onSelectSignIn={() => {
            onAuthModeChange('signin');
            onNavigation('auth');
          }}
          onBack={() => onNavigation('onboarding')}
          onSkip={() => {
            // ✅ Şimdi setSession doğru şekilde çalışacak
            if (!session) {
              setSession({
                id: `guest_${Date.now()}`,
                name: 'Guest User',
                email: null,
                avatar: null,
                role: 'individual',
                isAuthenticated: false,
                workspaces: [{
                  id: 'guest_workspace',
                  type: 'personal',
                  name: 'My Tasks',
                  role: 'owner'
                }],
                currentWorkspaceId: 'guest_workspace'
              });
            }
            onNavigation('home');
          }}
        />
      );
      
    case 'auth':
      return (
        <AuthScreen 
          mode={authMode}
          onSignUpComplete={() => {
            // For sign-up, always go to role selection
            onNavigation('role-selection');
          }}
          onSignInComplete={(userData) => {
            // For sign-in, create session with user data and skip role selection
            if (!session) {
              const userRole = userData.role as UserRole || 'individual';
              const newSession = {
                id: userData.id,
                name: userData.name, 
                email: userData.email,
                avatar: null,
                role: userRole,
                isAuthenticated: true,
                workspaces: [{
                  id: 'personal_workspace',
                  type: 'personal',
                  name: 'Personal',
                  role: 'owner' as const
                }],
                currentWorkspaceId: 'personal_workspace',
                membershipStatus: (userRole === 'employee' || userRole === 'admin') ? 'active' : undefined
              };

              // If admin user, add a company workspace
              if (userRole === 'admin') {
                const companyWorkspace = {
                  id: `company_${Date.now()}`,
                  type: 'company' as const,
                  name: `${userData.name}'s Company`,
                  role: 'owner' as const,
                  memberCount: 1
                };
                newSession.workspaces.push(companyWorkspace);
                newSession.currentWorkspaceId = companyWorkspace.id;
              }

              setSession(newSession);
            }
            
            // Navigate based on role
            let targetScreen = 'home';
            if (userData.role === 'admin') {
              targetScreen = 'admin-dashboard';
            } else if (userData.role === 'employee') {
              targetScreen = 'employee-dashboard';
            }
            
            onNavigation(targetScreen);
          }}
          onBack={() => onNavigation('auth-selection')} 
        />
      );

    case 'role-selection':
      return (
        <RoleSelectionScreen
          onRoleSelect={onRoleSelect}
          onBack={() => onNavigation('auth')}
        />
      );

    case 'company-join':
      return (
        <CompanyJoinScreen
          onSuccess={onCompanyJoinSuccess}
          onBack={() => onNavigation('role-selection')}
          onCreateCompany={() => onNavigation('create-company')}
        />
      );

    case 'create-company':
      return (
        <CreateCompanyScreen
          onSuccess={onCreateCompanySuccess}
          onBack={() => onNavigation('role-selection')}
        />
      );

    case 'pending-approval':
      return pendingCompanyData ? (
        <PendingApprovalScreen
          companyName={pendingCompanyData.name}
          requestMethod={pendingCompanyData.code ? 'code' : 'email'}
          submittedValue={pendingCompanyData.code || pendingCompanyData.email}
          onEditRequest={onEditRequest}
          onSwitchToPersonal={onSwitchToPersonal}
          onRefresh={() => {
            // Simulate approval granted for demo
            console.log('Refreshing approval status...');
            // Uncomment next line to simulate auto-approval
            // setTimeout(onApprovalGranted, 2000);
          }}
        />
      ) : null;
      
    case 'personal-info':
      return <PersonalInformationScreen onNavigate={onNavigation} />;
      
    case 'notifications':
      return (
        <NotificationScreen 
          onNavigate={onNavigation}
          onBack={onNotificationBack}
          previousScreen={previousScreenForNotifications}
        />
      );
      
    case 'privacy-security':
      return <PrivacySecurityScreen onNavigate={onNavigation} />;
      
    case 'connected-devices':
      return <ConnectedDevicesScreen onNavigate={onNavigation} />;
      
    case 'app-settings':
      return <AppSettingsScreen onNavigate={onNavigation} />;
      
    case 'help-support':
      return <HelpSupportScreen onNavigate={onNavigation} />;
      
    case 'task-detail':
      return (
        <TaskDetailScreen
          task={selectedTask}
          onBack={onTaskDetailBack}
          onUpdate={onTaskUpdate}
        />
      );

    // Admin screens
    case 'admin-user-approvals':
      return <UserApprovalsScreen onNavigate={onNavigation} />;

    case 'admin-task-approvals':
      return <TaskApprovalsScreen onNavigate={onNavigation} />;

    case 'admin-members':
      return <MembersScreen onNavigate={onNavigation} />;

    case 'admin-activity':
      return <AdminActivityScreen onNavigate={onNavigation} />;

    case 'admin-invites':
      return <AdminInvitesScreen onNavigate={onNavigation} />;

    case 'admin-company-settings':
      return <AdminCompanySettingsScreen onNavigate={onNavigation} />;

    // Session management screens
    case 'logout':
      if (session) {
        setSession(null);
      }
      // Redirect immediately without transition
      onNavigation('welcome');
      return null;

    case 'clear-session-and-signup':
      // Clear session and redirect to signup
      if (session) {
        setSession(null);
      }
      onAuthModeChange('signup');
      // Redirect immediately without transition
      onNavigation('auth-selection');
      return null;

    case 'clear-session-and-signin':
      // Clear session and redirect to signin
      if (session) {
        setSession(null);
      }
      onAuthModeChange('signin');
      // Redirect immediately without transition
      onNavigation('auth-selection');
      return null;
      
    default:
      return null;
  }
}