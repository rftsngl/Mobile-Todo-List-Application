import React from 'react';
import { motion } from 'motion/react';
import { cn } from './utils';

interface SkeletonProps {
  className?: string;
  variant?: 'default' | 'rounded' | 'circular' | 'text';
  animation?: 'pulse' | 'shimmer' | 'wave';
  width?: string | number;
  height?: string | number;
}

function Skeleton({ 
  className, 
  variant = 'default',
  animation = 'shimmer',
  width,
  height,
  ...props 
}: SkeletonProps & React.HTMLAttributes<HTMLDivElement>) {
  const baseStyles = "bg-muted/30 relative overflow-hidden";
  
  const variantStyles = {
    default: "rounded-lg",
    rounded: "rounded-xl", 
    circular: "rounded-full",
    text: "rounded-sm h-4"
  };

  const animationStyles = {
    pulse: "animate-pulse",
    shimmer: "animate-shimmer",
    wave: "animate-wave"
  };

  return (
    <div
      className={cn(
        baseStyles,
        variantStyles[variant],
        animationStyles[animation],
        className
      )}
      style={{ 
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height
      }}
      {...props}
    >
      {animation === 'shimmer' && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
          animate={{
            x: ['-100%', '100%']
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
            repeatDelay: 0.5
          }}
        />
      )}
    </div>
  );
}

// Skeleton Layout Components
interface SkeletonLayoutProps {
  variant?: 'list' | 'detail' | 'card' | 'grid';
  count?: number;
  className?: string;
}

function SkeletonLayout({ variant = 'list', count = 6, className }: SkeletonLayoutProps) {
  const renderSkeleton = () => {
    switch (variant) {
      case 'list':
        return (
          <div className="space-y-3">
            {[...Array(count)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.3 }}
                className="flex items-center gap-3 p-4 rounded-xl border border-border/20"
              >
                <Skeleton variant="circular" width={24} height={24} />
                <div className="flex-1 space-y-2">
                  <Skeleton variant="text" className="w-3/4" />
                  <Skeleton variant="text" className="w-1/2 h-3" />
                </div>
                <Skeleton variant="rounded" width={60} height={20} />
              </motion.div>
            ))}
          </div>
        );

      case 'detail':
        return (
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              {/* Header */}
              <div className="flex items-center gap-3">
                <Skeleton variant="circular" width={40} height={40} />
                <div className="flex-1 space-y-2">
                  <Skeleton variant="text" className="w-2/3" />
                  <Skeleton variant="text" className="w-1/3 h-3" />
                </div>
              </div>
              
              {/* Content blocks */}
              {[...Array(4)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.15, duration: 0.3 }}
                  className="space-y-2"
                >
                  <Skeleton variant="text" className="w-full" />
                  <Skeleton variant="text" className="w-4/5" />
                  <Skeleton variant="text" className="w-3/5" />
                </motion.div>
              ))}
            </motion.div>
          </div>
        );

      case 'card':
        return (
          <div className="space-y-4">
            {[...Array(count)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1, duration: 0.3 }}
                className="p-4 rounded-xl border border-border/20 space-y-3"
              >
                <Skeleton variant="text" className="w-2/3" />
                <Skeleton variant="rounded" width="100%" height={100} />
                <div className="flex gap-2">
                  <Skeleton variant="rounded" width={60} height={24} />
                  <Skeleton variant="rounded" width={80} height={24} />
                </div>
              </motion.div>
            ))}
          </div>
        );

      case 'grid':
        return (
          <div className="grid grid-cols-2 gap-4">
            {[...Array(count)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.3 }}
                className="aspect-square rounded-xl border border-border/20 p-3 space-y-2"
              >
                <Skeleton variant="rounded" width="100%" height="60%" />
                <Skeleton variant="text" className="w-3/4" />
                <Skeleton variant="text" className="w-1/2 h-3" />
              </motion.div>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={cn('p-4', className)}>
      {renderSkeleton()}
    </div>
  );
}

// Specific skeleton components for common patterns
function TaskItemSkeleton({ density = 'comfortable' }: { density?: 'comfortable' | 'compact' }) {
  const height = density === 'compact' ? 60 : 80;
  
  return (
    <div className={cn(
      'flex items-center gap-3 p-4 rounded-xl border border-border/20',
      density === 'compact' && 'py-3'
    )} style={{ minHeight: `${height}px` }}>
      <Skeleton variant="circular" width={24} height={24} />
      <div className="flex-1 space-y-2">
        <Skeleton variant="text" className="w-3/4" />
        {density === 'comfortable' && (
          <Skeleton variant="text" className="w-1/2 h-3" />
        )}
        <div className="flex gap-2">
          <Skeleton variant="rounded" width={60} height={20} />
          <Skeleton variant="rounded" width={40} height={20} />
        </div>
      </div>
      <Skeleton variant="circular" width={20} height={20} />
    </div>
  );
}

function HeaderSkeleton() {
  return (
    <div className="flex items-center justify-between p-4 border-b border-border/20">
      <div className="flex items-center gap-3">
        <Skeleton variant="circular" width={32} height={32} />
        <Skeleton variant="text" width={120} />
      </div>
      <div className="flex gap-2">
        <Skeleton variant="circular" width={32} height={32} />
        <Skeleton variant="circular" width={32} height={32} />
      </div>
    </div>
  );
}

// Export all components
export { 
  Skeleton, 
  SkeletonLayout,
  TaskItemSkeleton,
  HeaderSkeleton
};