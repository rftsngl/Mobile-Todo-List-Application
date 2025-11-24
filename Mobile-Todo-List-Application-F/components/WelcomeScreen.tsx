import React, { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { CheckSquare, Sparkles, ArrowRight } from 'lucide-react';
import { useLocalization } from './LocalizationProvider';
import { motion } from 'motion/react';
import { 
  welcomeAnimationConfig, 
  springConfigs, 
  easingCurves 
} from '../constants/animations';

interface WelcomeScreenProps {
  onNext: () => void;
  onSkip: () => void;
}

export function WelcomeScreen({ onNext, onSkip }: WelcomeScreenProps) {
  const { t } = useLocalization();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Trigger ready state after component mounts to enable CSS animations
    const timer = setTimeout(() => setIsReady(true), 100);
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/98 to-muted/20 flex flex-col items-center justify-center p-8 relative overflow-hidden">
      {/* Enhanced Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Main gradient orb */}
        <motion.div
          className="absolute top-20 right-12 w-64 h-64 bg-gradient-to-br from-primary/15 via-primary/8 to-transparent rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
            rotate: [0, 180, 360]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        
        {/* Secondary orb */}
        <motion.div
          className="absolute bottom-32 left-8 w-48 h-48 bg-gradient-to-tl from-accent/20 via-accent/10 to-transparent rounded-full blur-2xl"
          animate={{
            scale: [1, 0.8, 1.3, 1],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 5,
          }}
        />

        {/* Floating particles */}
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-primary/20 rounded-full"
            style={{
              left: `${20 + Math.random() * 60}%`,
              top: `${20 + Math.random() * 60}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: 8 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 8,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
      
      {/* Main Content Container */}
      <div className="flex flex-col items-center space-y-8 relative z-10">
        
        {/* Logo/Icon - Enhanced with multiple layers */}
        <div className="relative">
          <motion.div 
            className="w-24 h-24 bg-gradient-to-br from-primary via-primary/90 to-primary/80 rounded-3xl flex items-center justify-center shadow-2xl relative overflow-hidden"
            initial={welcomeAnimationConfig.logo.initial}
            animate={{ 
              scale: isReady ? 1 : 0, 
              rotate: isReady ? 0 : -180,
              opacity: isReady ? 1 : 0
            }}
            transition={welcomeAnimationConfig.logo.transition}
            whileHover={{ 
              scale: 1.1,
              rotate: 5,
              transition: { duration: 0.3 }
            }}
          >
            {/* Glow effect inside logo */}
            <motion.div
              className="absolute inset-2 bg-gradient-to-br from-white/30 to-transparent rounded-2xl"
              animate={{
                opacity: [0.3, 0.6, 0.3],
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            
            {/* Main icon */}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ 
                opacity: isReady ? 1 : 0,
                scale: isReady ? 1 : 0
              }}
              transition={{ delay: 0.8, duration: 0.4 }}
            >
              <CheckSquare className="w-12 h-12 text-primary-foreground relative z-10" />
            </motion.div>

            {/* Sparkle effects */}
            <motion.div
              className="absolute top-2 right-2"
              animate={{
                opacity: [0, 1, 0],
                rotate: [0, 180, 360],
                scale: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 2
              }}
            >
              <Sparkles className="w-4 h-4 text-primary-foreground/60" />
            </motion.div>
          </motion.div>

          {/* Pulsing ring effect */}
          <motion.div
            className="absolute inset-0 border-2 border-primary/30 rounded-3xl"
            animate={welcomeAnimationConfig.floatingRing.animate}
            transition={welcomeAnimationConfig.floatingRing.transition}
          />
        </div>
        
        {/* Text Content */}
        <motion.div 
          className="text-center space-y-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ 
            opacity: isReady ? 1 : 0, 
            y: isReady ? 0 : 30 
          }}
          transition={{ 
            delay: 0.6, 
            duration: 0.8, 
            ease: [0.16, 1, 0.3, 1] 
          }}
        >
          {/* App Name */}
          <motion.div
            initial={welcomeAnimationConfig.title.initial}
            animate={{ 
              opacity: isReady ? 1 : 0,
              scale: isReady ? 1 : 0.8
            }}
            transition={welcomeAnimationConfig.title.transition}
          >
            <h1 className="text-4xl bg-gradient-to-r from-primary via-primary/90 to-primary/80 bg-clip-text text-transparent relative">
              TaskFlow
              
              {/* Subtle underline */}
              <motion.div
                className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-16 h-0.5 bg-gradient-to-r from-transparent via-primary/50 to-transparent rounded-full"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: isReady ? 1 : 0 }}
                transition={{ delay: 1.2, duration: 0.8 }}
              />
            </h1>
          </motion.div>
          
          {/* Subtitle */}
          <motion.p 
            className="text-lg text-muted-foreground max-w-sm leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ 
              opacity: isReady ? 1 : 0, 
              y: isReady ? 0 : 20 
            }}
            transition={{ 
              delay: 1.0, 
              duration: 0.6, 
              ease: [0.16, 1, 0.3, 1] 
            }}
          >
            {t('welcome.subtitle')}
          </motion.p>
        </motion.div>
        
        {/* Call-to-Action Buttons */}
        <motion.div 
          className="w-full max-w-xs pt-8 space-y-4"
          initial={welcomeAnimationConfig.button.initial}
          animate={{ 
            opacity: isReady ? 1 : 0, 
            y: isReady ? 0 : 40,
            scale: isReady ? 1 : 0.9
          }}
          transition={welcomeAnimationConfig.button.transition}
        >
          {/* Main Get Started Button */}
          <motion.div
            whileHover={{ 
              scale: 1.02, 
              y: -4,
              transition: { duration: 0.2 }
            }}
            whileTap={{ 
              scale: 0.98, 
              y: 0,
              transition: { duration: 0.1 }
            }}
          >
            <Button 
              onClick={onNext}
              className="w-full h-14 rounded-2xl bg-gradient-to-r from-primary via-primary/95 to-primary/90 hover:from-primary/95 hover:via-primary/90 hover:to-primary/85 text-primary-foreground shadow-lg hover:shadow-xl transition-smooth group relative overflow-hidden"
              size="lg"
            >
              {/* Button shine effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-out"
                initial={false}
              />
              
              {/* Button content */}
              <span className="relative flex items-center justify-center space-x-2">
                <span>{t('welcome.getStarted')}</span>
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
              </span>
            </Button>
          </motion.div>

          {/* Skip Introduction Button */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ 
              opacity: isReady ? 1 : 0,
              y: isReady ? 0 : 10
            }}
            transition={{ 
              delay: welcomeAnimationConfig.button.transition.delay + 0.3,
              duration: 0.5 
            }}
            whileHover={{ 
              scale: 1.02,
              transition: { duration: 0.2 }
            }}
            whileTap={{ 
              scale: 0.98,
              transition: { duration: 0.1 }
            }}
          >
            <Button
              onClick={onSkip}
              variant="ghost"
              className="w-full h-12 rounded-2xl text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-smooth"
              size="lg"
            >
              <span className="text-sm">{t('welcome.skip_intro', 'Tanıtımı Geç')}</span>
            </Button>
          </motion.div>

          {/* Hint Text */}
          <motion.p 
            className="text-center text-muted-foreground text-xs mt-4 opacity-0"
            animate={{ opacity: isReady ? 0.7 : 0 }}
            transition={{ delay: 2, duration: 0.6 }}
          >
            {t('welcome.hint')}
          </motion.p>
        </motion.div>
      </div>

      {/* Bottom decorative element */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-1"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: isReady ? 0.4 : 0, y: isReady ? 0 : 20 }}
        transition={{ delay: 1.8, duration: 0.6 }}
      >
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-1.5 h-1.5 bg-muted-foreground rounded-full"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.3, 0.8, 0.3]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.3,
              ease: "easeInOut"
            }}
          />
        ))}
      </motion.div>
    </div>
  );
}