import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useLocalization } from './LocalizationProvider';
import { 
  ArrowLeft, 
  User, 
  Briefcase,
  Shield,
  ChevronRight,
  Check,
  X
} from 'lucide-react';
import { UserRole } from './SessionProvider';

interface RoleSelectionScreenProps {
  onRoleSelect: (role: UserRole) => void;
  onBack: () => void;
}

export function RoleSelectionScreen({ onRoleSelect, onBack }: RoleSelectionScreenProps) {
  const { t, isInitialized } = useLocalization();
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [expandedRole, setExpandedRole] = useState<UserRole | null>(null);

  // [FIX-I18N] Don't render if i18n not ready
  if (!isInitialized) {
    return null;
  }

  const roleOptions = [
    {
      id: 'individual' as UserRole,
      title: t('role.individual'),
      subtitle: t('role.individual_subtitle', 'Personal task management'),
      description: t('role.individual_description', 'Perfect for personal productivity, goal tracking, and individual task management.'),
      icon: User,
      color: 'from-blue-500/20 via-blue-400/10 to-transparent',
      borderColor: 'border-blue-500/30',
      accentColor: 'text-blue-600 dark:text-blue-400',
      bgAccent: 'bg-blue-500/10',
      features: [
        t('role.individual_feature_1', 'Personal task lists'),
        t('role.individual_feature_2', 'Calendar integration'), 
        t('role.individual_feature_3', 'Goal tracking'),
        t('role.individual_feature_4', 'Offline access')
      ],
      badge: null,
      recommended: false
    },
    {
      id: 'employee' as UserRole,
      title: t('role.employee'),
      subtitle: t('role.employee_subtitle', 'Join your company workspace'),
      description: t('role.employee_description', 'Collaborate with your team, manage work tasks, and stay aligned with company goals.'),
      icon: Briefcase,
      color: 'from-emerald-500/20 via-emerald-400/10 to-transparent',
      borderColor: 'border-emerald-500/30',
      accentColor: 'text-emerald-600 dark:text-emerald-400',
      bgAccent: 'bg-emerald-500/10',
      features: [
        t('role.employee_feature_1', 'Team collaboration'),
        t('role.employee_feature_2', 'Task approvals'),
        t('role.employee_feature_3', 'Company workspaces'),
        t('role.employee_feature_4', 'Project tracking')
      ],
      badge: t('role.popular', 'Popular'),
      recommended: true
    },
    {
      id: 'admin' as UserRole,
      title: t('role.admin'),
      subtitle: t('role.admin_subtitle', 'Manage your organization'),
      description: t('role.admin_description', 'Create and manage company workspaces, approve tasks, and oversee team productivity.'),
      icon: Shield,
      color: 'from-purple-500/20 via-purple-400/10 to-transparent',
      borderColor: 'border-purple-500/30',
      accentColor: 'text-purple-600 dark:text-purple-400',
      bgAccent: 'bg-purple-500/10',
      features: [
        t('role.admin_feature_1', 'User management'),
        t('role.admin_feature_2', 'Approval workflows'),
        t('role.admin_feature_3', 'Company settings'),
        t('role.admin_feature_4', 'Analytics & reports')
      ],
      badge: t('role.advanced', 'Advanced'),
      recommended: false
    }
  ];

  const handleRoleClick = (roleId: UserRole) => {
    if (expandedRole === roleId) {
      // If already expanded, select it
      setSelectedRole(roleId);
    } else {
      // Expand to show details
      setExpandedRole(roleId);
      setSelectedRole(null);
    }
  };

  const handleConfirmRole = () => {
    if (selectedRole) {
      onRoleSelect(selectedRole);
    } else if (expandedRole) {
      setSelectedRole(expandedRole);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-background via-background/98 to-muted/20 relative overflow-hidden">
      {/* Minimal Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 right-10 w-32 h-32 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Header */}
      <motion.div 
        className="relative z-10 pt-12 pb-6 px-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="flex items-center justify-between mb-8">
          <motion.button
            onClick={onBack}
            className="p-2 rounded-lg bg-card/40 backdrop-blur-sm border border-border/30 hover:bg-card/60 hover:border-border/50 transition-smooth"
            whileHover={{ scale: 1.05, x: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft className="w-4 h-4 text-muted-foreground" />
          </motion.button>
          
          <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
            {t('role.step_indicator', 'Step 1 of 2')}
          </Badge>
        </div>

        <motion.div
          className="text-center mb-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <h1 className="text-3xl mb-3 bg-gradient-to-r from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent">
            {t('role.choose_title', 'Choose Your Role')}
          </h1>
          <p className="text-muted-foreground max-w-sm mx-auto leading-relaxed">
            {t('role.choose_description', 'Select how you\'ll be using TaskFlow to get the best experience.')}
          </p>
        </motion.div>
      </motion.div>

      {/* Role Options - Fixed container with no layout shift */}
      <div className="flex-1 overflow-y-auto px-6">
        <div className="space-y-4 pb-6">
          {roleOptions.map((option, index) => {
            const IconComponent = option.icon;
            const isExpanded = expandedRole === option.id;
            const isSelected = selectedRole === option.id;
            
            return (
              <motion.div
                key={option.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.4 + index * 0.1,
                  duration: 0.5,
                  ease: [0.16, 1, 0.3, 1]
                }}
                className="relative"
              >
                <div
                  className={`
                    relative bg-card border rounded-3xl cursor-pointer transition-all duration-300 overflow-hidden
                    ${isSelected 
                      ? `${option.borderColor} ring-2 ring-primary/20 shadow-xl` 
                      : isExpanded
                      ? `${option.borderColor} shadow-lg`
                      : 'border-border hover:border-border/80 hover:shadow-md'
                    }
                  `}
                  onClick={() => handleRoleClick(option.id)}
                >
                  {/* Always visible card content */}
                  <motion.div 
                    className="p-6"
                    whileHover={{ 
                      scale: isExpanded ? 1 : 1.01,
                      y: isExpanded ? 0 : -2
                    }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <motion.div
                          className={`p-3 rounded-2xl ${option.bgAccent} ${option.accentColor} backdrop-blur-sm`}
                          whileHover={{ scale: 1.05 }}
                          animate={isSelected ? {
                            scale: [1, 1.1, 1],
                          } : {}}
                          transition={isSelected ? {
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                          } : undefined}
                        >
                          <IconComponent className="w-6 h-6" />
                        </motion.div>
                        
                        <div>
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className={`text-lg transition-colors ${isSelected ? option.accentColor : 'text-foreground'}`}>
                              {option.title}
                            </h3>
                            {option.recommended && !isExpanded && (
                              <Badge 
                                variant="secondary" 
                                className={`text-xs px-2 py-0.5 ${option.bgAccent} ${option.accentColor} border-0`}
                              >
                                {option.badge}
                              </Badge>
                            )}
                          </div>
                          {!isExpanded && (
                            <p className="text-sm text-muted-foreground">
                              {t('role.tap_to_learn', 'Tap to learn more')}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Status indicator */}
                      <div className="flex items-center space-x-2">
                        {isSelected && (
                          <motion.div
                            className={`w-6 h-6 rounded-full ${option.bgAccent} ${option.accentColor} flex items-center justify-center`}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 400, damping: 25 }}
                          >
                            <Check className="w-3 h-3" />
                          </motion.div>
                        )}
                        
                        {isExpanded && !isSelected && (
                          <motion.button
                            className="w-6 h-6 rounded-full bg-muted hover:bg-muted/80 flex items-center justify-center touch-target-small"
                            onClick={(e) => {
                              e.stopPropagation();
                              setExpandedRole(null);
                            }}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <X className="w-3 h-3" />
                          </motion.button>
                        )}
                        
                        {!isExpanded && !isSelected && (
                          <ChevronRight className="w-5 h-5 text-muted-foreground" />
                        )}
                      </div>
                    </div>
                  </motion.div>

                  {/* Expanded details - Fixed height container */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ 
                          duration: 0.3, 
                          ease: [0.16, 1, 0.3, 1],
                          height: { duration: 0.3 },
                          opacity: { duration: 0.2, delay: isExpanded ? 0.1 : 0 }
                        }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-6 border-t border-border/50">
                          <motion.div
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -20, opacity: 0 }}
                            transition={{ delay: 0.1, duration: 0.2 }}
                            className="pt-6 space-y-4"
                          >
                            <div className="flex items-center space-x-2 mb-3">
                              <p className="text-sm text-muted-foreground flex-1">
                                {option.subtitle}
                              </p>
                              {option.badge && (
                                <Badge 
                                  variant="secondary" 
                                  className={`text-xs px-2 py-0.5 ${option.bgAccent} ${option.accentColor} border-0`}
                                >
                                  {option.badge}
                                </Badge>
                              )}
                            </div>
                            
                            <p className="text-sm text-muted-foreground leading-relaxed">
                              {option.description}
                            </p>

                            {/* Features grid */}
                            <div className="grid grid-cols-1 gap-2 mt-4">
                              {option.features.map((feature, featureIndex) => (
                                <motion.div
                                  key={featureIndex}
                                  className="flex items-center space-x-3 text-sm text-muted-foreground"
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{
                                    delay: 0.15 + featureIndex * 0.05,
                                    duration: 0.3
                                  }}
                                >
                                  <div className={`w-1.5 h-1.5 ${option.bgAccent} rounded-full flex-shrink-0`} />
                                  <span>{feature}</span>
                                </motion.div>
                              ))}
                            </div>

                            {/* Select button */}
                            <motion.div
                              className="pt-4"
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.25 }}
                            >
                              <motion.div
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                              >
                                <Button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedRole(option.id);
                                  }}
                                  className={`w-full py-3 rounded-2xl bg-gradient-to-r ${option.color.replace('/10', '/20')} ${option.accentColor} border ${option.borderColor} hover:shadow-lg transition-all`}
                                  variant="outline"
                                >
                                  {t('role.select_this', 'Select This Role')}
                                </Button>
                              </motion.div>
                            </motion.div>
                          </motion.div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Continue Button */}
      <motion.div 
        className="relative z-10 p-6 pt-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <AnimatePresence>
          {(selectedRole || expandedRole) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  onClick={handleConfirmRole}
                  disabled={!selectedRole && !expandedRole}
                  className={`
                    w-full py-4 text-lg rounded-2xl transition-all duration-300 touch-target
                    ${selectedRole 
                      ? 'bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl' 
                      : 'bg-muted hover:bg-muted/90 text-muted-foreground'
                    }
                  `}
                >
                  <div className="flex items-center justify-center space-x-2">
                    <span>
                      {selectedRole 
                        ? t('common.continue', 'Continue') 
                        : t('role.select_to_continue', 'Select to Continue')
                      }
                    </span>
                    <ChevronRight className="w-5 h-5" />
                  </div>
                </Button>
              </motion.div>
              
              {selectedRole && (
                <motion.p
                  className="text-center text-xs text-muted-foreground mt-3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  {t('role.can_change_later', 'You can change this later in your profile settings')}
                </motion.p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}