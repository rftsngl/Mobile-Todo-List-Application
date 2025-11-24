import React from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  Home, 
  Calendar, 
  User, 
  Shield,
  Settings,
  Briefcase
} from 'lucide-react';
import { useSession } from './SessionProvider';

interface BottomNavigationProps {
  currentScreen: string;
  onNavigate: (screen: string) => void;
  showAdminTab?: boolean;
  adminOnlyMode?: boolean;
}

export function BottomNavigation({ 
  currentScreen, 
  onNavigate, 
  showAdminTab = false,
  adminOnlyMode = false
}: BottomNavigationProps) {
  const { session, isAdmin, isEmployee, isInCompanyWorkspace } = useSession();

  // Define navigation items based on user role and context
  const getNavigationItems = () => {
    // Admin only mode (when viewing admin screens)
    if (adminOnlyMode) {
      return [
        { id: 'admin-dashboard', label: 'Admin', icon: Shield },
        { id: 'admin-settings', label: 'Settings', icon: Settings }
      ];
    }

    // Employee in company workspace
    if (isEmployee && isInCompanyWorkspace && session?.membershipStatus === 'active') {
      return [
        { id: 'employee-dashboard', label: 'Work', icon: Briefcase },
        { id: 'board', label: 'Board', icon: Calendar },
        { id: 'profile', label: 'Profile', icon: User }
      ];
    }

    // Admin in company workspace
    if (isAdmin && isInCompanyWorkspace) {
      return [
        { id: 'admin-dashboard', label: 'Admin', icon: Shield },
        { id: 'board', label: 'Board', icon: Calendar },
        { id: 'profile', label: 'Profile', icon: User }
      ];
    }

    // Default navigation (individual users, guest users)
    return [
      { id: 'home', label: 'Home', icon: Home },
      { id: 'board', label: 'Board', icon: Calendar },
      { id: 'profile', label: 'Profile', icon: User }
    ];
  };

  const navigationItems = getNavigationItems();

  return (
    <div className="relative">
      {/* Background with glassmorphism effect */}
      <div className="absolute inset-0 bg-card/95 backdrop-blur-lg border-t border-border"></div>
      
      {/* Navigation Content */}
      <div className="relative px-6 py-3">
        <div className="flex items-center justify-around">
          {navigationItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = currentScreen === item.id;
            
            return (
              <motion.div
                key={item.id}
                className="relative flex flex-col items-center"
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onNavigate(item.id)}
                  className={`
                    relative h-12 w-16 flex flex-col items-center justify-center gap-1 p-0
                    ${isActive 
                      ? 'text-primary bg-primary/10' 
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                    }
                    transition-all duration-200
                  `}
                >
                  {/* Active indicator */}
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-primary/10 rounded-lg"
                      initial={false}
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 30
                      }}
                    />
                  )}
                  
                  {/* Icon with notification badge for some items */}
                  <div className="relative">
                    <IconComponent className={`w-5 h-5 ${isActive ? 'text-primary' : ''}`} />
                    
                    {/* Show notification badge for admin dashboard */}
                    {item.id === 'admin-dashboard' && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-1 -right-1"
                      >
                        <Badge 
                          variant="destructive" 
                          className="h-4 w-4 p-0 text-xs rounded-full flex items-center justify-center"
                        >
                          3
                        </Badge>
                      </motion.div>
                    )}
                  </div>
                  
                  {/* Label */}
                  <span className={`text-xs ${isActive ? 'text-primary font-medium' : ''}`}>
                    {item.label}
                  </span>
                </Button>
              </motion.div>
            );
          })}
        </div>
      </div>
      
      {/* Bottom safe area */}
      <div 
        className="h-safe-bottom"
        style={{ height: 'env(safe-area-inset-bottom)' }}
      />
    </div>
  );
}