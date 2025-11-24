import React from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card } from './ui/card';
import { 
  Clock, 
  Building2, 
  Mail, 
  Edit3, 
  ArrowLeft,
  User,
  CheckCircle2,
  AlertCircle,
  RefreshCw
} from 'lucide-react';

interface PendingApprovalScreenProps {
  companyName: string;
  requestMethod: 'code' | 'email';
  submittedValue: string;
  onEditRequest: () => void;
  onSwitchToPersonal: () => void;
  onRefresh: () => void;
}

export function PendingApprovalScreen({ 
  companyName, 
  requestMethod, 
  submittedValue, 
  onEditRequest,
  onSwitchToPersonal,
  onRefresh
}: PendingApprovalScreenProps) {
  
  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-background via-background/98 to-muted/20 relative overflow-hidden">
      {/* Enhanced Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 right-16 w-24 h-24 bg-gradient-to-br from-amber-500/15 to-transparent rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-32 left-12 w-20 h-20 bg-gradient-to-tl from-blue-500/10 to-transparent rounded-full blur-2xl"
          animate={{
            scale: [1, 0.8, 1.3, 1],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        />
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col justify-center px-6 relative z-10">
        {/* Status Hero */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: 30, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{
            duration: 0.8,
            delay: 0.2,
            ease: [0.16, 1, 0.3, 1],
            type: "spring",
            stiffness: 200,
            damping: 20
          }}
        >
          {/* Animated Clock Icon */}
          <motion.div
            className="relative w-24 h-24 mx-auto mb-6"
            animate={{
              rotate: [0, 5, -5, 0],
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 via-amber-400/10 to-transparent rounded-full backdrop-blur-sm border border-amber-500/20"></div>
            
            {/* Orbiting dots */}
            {[0, 120, 240].map((rotation, index) => (
              <motion.div
                key={index}
                className="absolute w-2 h-2 bg-amber-500/60 rounded-full"
                style={{
                  top: '10%',
                  left: '50%',
                  transformOrigin: '50% 300%',
                }}
                animate={{
                  rotate: [rotation, rotation + 360],
                  scale: [0.5, 1, 0.5],
                  opacity: [0.3, 1, 0.3],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "linear",
                  delay: index * 0.5,
                }}
              />
            ))}
            
            <div className="absolute inset-0 flex items-center justify-center">
              <Clock className="w-10 h-10 text-amber-600 dark:text-amber-400" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <Badge 
              variant="secondary" 
              className="mb-4 bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 px-4 py-2"
            >
              Pending Approval
            </Badge>
            
            <h1 className="text-2xl mb-3">
              Request Under Review
            </h1>
            
            <p className="text-muted-foreground leading-relaxed max-w-sm mx-auto">
              Your request to join <span className="text-foreground font-medium">{companyName}</span> is being reviewed by the admin team.
            </p>
          </motion.div>
        </motion.div>

        {/* Request Details Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mb-8"
        >
          <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-muted-foreground">Request Details</h3>
                <motion.button
                  onClick={onRefresh}
                  className="p-1 rounded-lg hover:bg-muted/50 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <RefreshCw className="w-4 h-4 text-muted-foreground" />
                </motion.button>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500/10 to-blue-400/5">
                    <Building2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm">Company</p>
                    <p className="text-xs text-muted-foreground">{companyName}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-emerald-500/10 to-emerald-400/5">
                    {requestMethod === 'email' ? (
                      <Mail className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    ) : (
                      <User className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm">{requestMethod === 'email' ? 'Work Email' : 'Company Code'}</p>
                    <p className="text-xs text-muted-foreground">{submittedValue}</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* What's Next */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          className="mb-8"
        >
          <h3 className="text-sm font-medium mb-4 text-center">What happens next?</h3>
          
          <div className="space-y-3">
            {[
              {
                icon: AlertCircle,
                title: 'Admin Review',
                description: 'Company admin will review your request',
                status: 'current'
              },
              {
                icon: CheckCircle2,
                title: 'Account Activation',
                description: 'You\'ll get access to company workspace',
                status: 'upcoming'
              },
              {
                icon: User,
                title: 'Team Collaboration',
                description: 'Start working with your team members',
                status: 'upcoming'
              }
            ].map((step, index) => {
              const IconComponent = step.icon;
              return (
                <motion.div
                  key={index}
                  className={`
                    flex items-center space-x-3 p-3 rounded-xl transition-all duration-200
                    ${step.status === 'current' 
                      ? 'bg-amber-500/5 border border-amber-500/20' 
                      : 'bg-muted/30'
                    }
                  `}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1 + index * 0.1 }}
                >
                  <div className={`
                    p-2 rounded-lg
                    ${step.status === 'current'
                      ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                      : 'bg-muted text-muted-foreground'
                    }
                  `}>
                    <IconComponent className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm">{step.title}</p>
                    <p className="text-xs text-muted-foreground">{step.description}</p>
                  </div>
                  {step.status === 'current' && (
                    <motion.div
                      className="w-2 h-2 bg-amber-500 rounded-full"
                      animate={{
                        scale: [1, 1.5, 1],
                        opacity: [1, 0.5, 1],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                  )}
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* Action Buttons */}
      <motion.div
        className="p-6 space-y-3 relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
      >
        <div className="grid grid-cols-2 gap-3">
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              variant="outline"
              onClick={onEditRequest}
              className="w-full py-3 rounded-xl border-dashed hover:border-solid transition-all duration-200"
            >
              <div className="flex items-center justify-center space-x-2">
                <Edit3 className="w-4 h-4" />
                <span>Edit Request</span>
              </div>
            </Button>
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              variant="secondary"
              onClick={onSwitchToPersonal}
              className="w-full py-3 rounded-xl transition-all duration-200"
            >
              <div className="flex items-center justify-center space-x-2">
                <User className="w-4 h-4" />
                <span>Use Personal</span>
              </div>
            </Button>
          </motion.div>
        </div>

        <p className="text-center text-xs text-muted-foreground px-4">
          You'll receive a notification once your request is reviewed. 
          This usually takes 24-48 hours.
        </p>
      </motion.div>
    </div>
  );
}