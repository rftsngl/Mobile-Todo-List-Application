import React from 'react';
import { Button } from './ui/button';
import { ArrowLeft, UserPlus, LogIn, ArrowRight, UserX } from 'lucide-react';
import { useLocalization } from './LocalizationProvider';
import { motion } from 'motion/react';
import { authSelectionAnimationConfig } from '../constants/animations';

interface AuthSelectionScreenProps {
  onSelectSignUp: () => void;
  onSelectSignIn: () => void;
  onBack: () => void;
  onSkip: () => void;
}

export function AuthSelectionScreen({ 
  onSelectSignUp, 
  onSelectSignIn, 
  onBack, 
  onSkip 
}: AuthSelectionScreenProps) {
  const { t } = useLocalization();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/98 to-muted/10 flex flex-col relative overflow-hidden">
      {/* Subtle Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-16 right-8 w-48 h-48 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.6, 0.3],
            rotate: [0, 90, 180],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        <motion.div
          className="absolute bottom-24 left-8 w-32 h-32 bg-gradient-to-tl from-accent/20 via-accent/10 to-transparent rounded-full blur-2xl"
          animate={{
            scale: [1, 0.8, 1.2, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 3,
          }}
        />
      </div>

      {/* Header */}
      <motion.div 
        className="flex items-center justify-between p-6 relative z-10"
        initial={authSelectionAnimationConfig.header.initial}
        animate={authSelectionAnimationConfig.header.animate}
        transition={authSelectionAnimationConfig.header.transition}
      >
        <motion.button
          onClick={onBack}
          className="p-2 rounded-xl bg-card/50 backdrop-blur-sm border border-border/50 text-muted-foreground hover:text-foreground hover:bg-card/80 transition-smooth touch-target"
          whileHover={{ scale: 1.05, x: -2 }}
          whileTap={{ scale: 0.95 }}
        >
          <ArrowLeft className="w-5 h-5" />
        </motion.button>

        {/* Empty space where skip button was - maintains layout balance */}
        <div className="w-12"></div>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 space-y-8 relative z-10">
        
        {/* Welcome Text */}
        <motion.div 
          className="text-center space-y-6"
          initial={authSelectionAnimationConfig.welcomeText.initial}
          animate={authSelectionAnimationConfig.welcomeText.animate}
          transition={authSelectionAnimationConfig.welcomeText.transition}
        >
          <motion.h1
            className="text-4xl bg-gradient-to-r from-primary via-primary/90 to-primary/80 bg-clip-text text-transparent relative"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            {t('welcome.title', 'Welcome to TaskFlow')}
            
            {/* Subtle underline */}
            <motion.div
              className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-16 h-0.5 bg-gradient-to-r from-transparent via-primary/50 to-transparent rounded-full"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.8, duration: 0.8 }}
            />
          </motion.h1>
          
          {/* App Name - TaskFlow as subtitle */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <p className="text-lg text-muted-foreground mb-2">TaskFlow</p>
          </motion.div>
          
          <motion.p 
            className="text-lg text-muted-foreground max-w-sm leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            {t('auth.choose_option', 'How would you like to get started?')}
          </motion.p>
        </motion.div>

        {/* Action Cards */}
        <motion.div
          className="w-full max-w-sm space-y-4"
          initial={authSelectionAnimationConfig.actionCards.initial}
          animate={authSelectionAnimationConfig.actionCards.animate}
          transition={authSelectionAnimationConfig.actionCards.transition}
        >
          {/* Sign Up Card */}
          <motion.div
            className="group"
            whileHover={{ scale: 1.02, y: -4 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
          >
            <Button
              onClick={onSelectSignUp}
              className="w-full h-16 rounded-2xl bg-gradient-to-r from-primary via-primary/95 to-primary/90 hover:from-primary/95 hover:via-primary/90 hover:to-primary/85 text-primary-foreground shadow-lg hover:shadow-xl transition-smooth p-6 relative overflow-hidden group touch-target"
              variant="default"
            >
              {/* Shine effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"
                initial={false}
              />
              
              <div className="flex items-center justify-between w-full relative z-10">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary-foreground/20 rounded-xl flex items-center justify-center">
                    <UserPlus className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium">{t('auth.signUp', 'Sign Up')}</div>
                    <div className="text-xs text-primary-foreground/80">{t('auth.create_new_account', 'Create a new account')}</div>
                  </div>
                </div>
                <motion.div
                  animate={{ x: [0, 4, 0] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <ArrowRight className="w-5 h-5" />
                </motion.div>
              </div>
            </Button>
          </motion.div>

          {/* Sign In Card */}
          <motion.div
            className="group"
            whileHover={{ scale: 1.02, y: -4 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
          >
            <Button
              onClick={onSelectSignIn}
              className="w-full h-16 rounded-2xl bg-card border-2 border-border/50 hover:border-primary/30 hover:bg-card/80 text-foreground shadow-lg hover:shadow-xl transition-smooth p-6 relative overflow-hidden group touch-target"
              variant="outline"
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-muted rounded-xl flex items-center justify-center">
                    <LogIn className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium">{t('auth.signIn', 'Sign In')}</div>
                    <div className="text-xs text-muted-foreground">{t('auth.use_existing_account', 'Use your existing account')}</div>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
              </div>
            </Button>
          </motion.div>
        </motion.div>

        {/* Security hint */}
        <motion.div
          className="text-center"
          initial={authSelectionAnimationConfig.bottomHint.initial}
          animate={authSelectionAnimationConfig.bottomHint.animate}
          transition={authSelectionAnimationConfig.bottomHint.transition}
        >
          <p className="text-xs text-muted-foreground">
            {t('auth.secure_promise', 'Your data is secure with us')}
          </p>
        </motion.div>
      </div>

      {/* Guest Mode Button - At the bottom */}
      <motion.div
        className="relative z-10 w-full max-w-sm mx-auto p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0, duration: 0.6 }}
      >
        <motion.div
          whileHover={{ 
            scale: 1.01,
            transition: { duration: 0.2 }
          }}
          whileTap={{ 
            scale: 0.99,
            transition: { duration: 0.1 }
          }}
        >
          <Button
            onClick={onSkip}
            variant="outline"
            className="w-full h-12 rounded-2xl border-border/50 text-muted-foreground hover:text-foreground hover:bg-muted/30 hover:border-border transition-smooth group touch-target"
            size="lg"
          >
            <span className="flex items-center justify-center space-x-2 text-sm">
              <UserX className="w-4 h-4 opacity-60 group-hover:opacity-100 transition-opacity" />
              <span>{t('welcome.continue_without_auth', 'Continue without signing in')}</span>
            </span>
          </Button>
        </motion.div>
        
        {/* Additional info - FIXED: matching opening and closing tags */}
        <motion.p
          className="text-center text-muted-foreground text-xs mt-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ delay: 1.3, duration: 0.4 }}
        >
          {t('welcome.guest_mode_info', 'Your data will be stored locally')}
        </motion.p>
      </motion.div>
    </div>
  );
}