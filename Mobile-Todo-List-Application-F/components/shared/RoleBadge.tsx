import React from 'react';
import { Badge } from '../ui/badge';
import { Shield, Users, User, Crown } from 'lucide-react';
import { motion } from 'motion/react';

type UserRole = 'owner' | 'admin' | 'member' | 'individual';

interface RoleBadgeProps {
  role: UserRole;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  animated?: boolean;
  className?: string;
}

const roleConfig = {
  owner: {
    label: 'Owner',
    i18nKey: 'role.owner',
    icon: Crown,
    className: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/30 dark:text-purple-300 dark:border-purple-800/50',
    iconColor: 'text-purple-600 dark:text-purple-400',
    bgGradient: 'from-purple-50/80 to-purple-100/50 dark:from-purple-950/20 dark:to-purple-900/30'
  },
  admin: {
    label: 'Admin',
    i18nKey: 'role.admin',
    icon: Shield,
    className: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/30 dark:text-blue-300 dark:border-blue-800/50',
    iconColor: 'text-blue-600 dark:text-blue-400',
    bgGradient: 'from-blue-50/80 to-blue-100/50 dark:from-blue-950/20 dark:to-blue-900/30'
  },
  member: {
    label: 'Member',
    i18nKey: 'role.member',
    icon: Users,
    className: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-300 dark:border-emerald-800/50',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
    bgGradient: 'from-emerald-50/80 to-emerald-100/50 dark:from-emerald-950/20 dark:to-emerald-900/30'
  },
  individual: {
    label: 'Individual',
    i18nKey: 'role.individual',
    icon: User,
    className: 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-950/30 dark:text-slate-300 dark:border-slate-800/50',
    iconColor: 'text-slate-600 dark:text-slate-400',
    bgGradient: 'from-slate-50/80 to-slate-100/50 dark:from-slate-950/20 dark:to-slate-900/30'
  }
} as const;

const sizeConfig = {
  sm: {
    className: 'px-2 py-0.5 text-xs',
    iconSize: 'w-3 h-3'
  },
  md: {
    className: 'px-2.5 py-1 text-sm',
    iconSize: 'w-3.5 h-3.5'
  },
  lg: {
    className: 'px-3 py-1.5 text-sm',
    iconSize: 'w-4 h-4'
  }
};

export function RoleBadge({ 
  role, 
  size = 'md', 
  showIcon = true, 
  animated = false,
  className = '' 
}: RoleBadgeProps) {
  const config = roleConfig[role];
  const sizeStyles = sizeConfig[size];
  const IconComponent = config.icon;

  if (!config) {
    console.warn(`Unknown role: ${role}`);
    return null;
  }

  const badgeContent = (
    <div className="flex items-center space-x-1.5">
      {showIcon && (
        <motion.div
          animate={role === 'owner' ? {
            rotate: [0, 5, -5, 0],
            scale: [1, 1.1, 1]
          } : {}}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <IconComponent className={`${sizeStyles.iconSize} ${config.iconColor}`} />
        </motion.div>
      )}
      
      <span className="relative font-medium">
        {config.label}
        
        {/* Subtle background gradient for enhanced visual appeal */}
        <div className={`absolute inset-0 bg-gradient-to-r ${config.bgGradient} opacity-0 group-hover:opacity-100 rounded-full transition-opacity duration-200`} />
      </span>
    </div>
  );

  return animated ? (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{
        type: "spring",
        stiffness: 500,
        damping: 30
      }}
      whileHover={{ 
        scale: 1.05,
        transition: { duration: 0.15 }
      }}
      className="inline-block group"
    >
      <Badge 
        variant="secondary"
        className={`
          ${config.className} 
          ${sizeStyles.className} 
          ${className}
          border
          backdrop-blur-sm
          transition-all
          duration-200
          group-hover:shadow-sm
          relative
          overflow-hidden
        `}
      >
        {badgeContent}
      </Badge>
    </motion.div>
  ) : (
    <Badge 
      variant="secondary"
      className={`
        ${config.className} 
        ${sizeStyles.className} 
        ${className}
        border
        backdrop-blur-sm
        transition-all
        duration-200
        hover:shadow-sm
        group
      `}
    >
      {badgeContent}
    </Badge>
  );
}

// Export role configuration for use in other components
export { roleConfig };

// Helper function to get role color
export function getRoleColor(role: UserRole): string {
  return roleConfig[role]?.className || roleConfig.member.className;
}

// Helper function to get role icon
export function getRoleIcon(role: UserRole) {
  return roleConfig[role]?.icon || roleConfig.member.icon;
}

// Helper function to check if role has elevated permissions
export function hasElevatedPermissions(role: UserRole): boolean {
  return role === 'owner' || role === 'admin';
}