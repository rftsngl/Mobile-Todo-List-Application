import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { ChevronLeft, CheckSquare, Users, Bell, ArrowRight } from 'lucide-react';
import { useLocalization } from './LocalizationProvider';
import { motion, AnimatePresence } from 'motion/react';
import { onboardingAnimationConfig } from '../constants/animations';

interface OnboardingCarouselProps {
  onComplete: () => void;
}

export function OnboardingCarousel({ onComplete }: OnboardingCarouselProps) {
  const { t, isInitialized } = useLocalization();
  const [currentSlide, setCurrentSlide] = useState(0);

  // [FIX-I18N] Don't render if i18n not ready
  if (!isInitialized) {
    return null;
  }

  const slides = [
    {
      id: 1,
      icon: CheckSquare,
      title: t('onboarding.slide1.title'),
      description: t('onboarding.slide1.description'),
      color: 'from-blue-500 to-purple-600',
      bgGradient: 'from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20'
    },
    {
      id: 2,
      icon: Users,
      title: t('onboarding.slide2.title'),
      description: t('onboarding.slide2.description'),
      color: 'from-green-500 to-teal-600',
      bgGradient: 'from-green-50 to-teal-50 dark:from-green-950/20 dark:to-teal-950/20'
    },
    {
      id: 3,
      icon: Bell,
      title: t('onboarding.slide3.title'),
      description: t('onboarding.slide3.description'),
      color: 'from-orange-500 to-red-600',
      bgGradient: 'from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20'
    }
  ];

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      onComplete();
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col relative overflow-hidden">
      {/* Enhanced Background Animation */}
      <motion.div
        className={`absolute inset-0 bg-gradient-to-br ${slides[currentSlide].bgGradient} transition-all duration-1000`}
        key={currentSlide}
      />
      
      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-primary/20 rounded-full"
            style={{
              left: `${20 + Math.random() * 60}%`,
              top: `${20 + Math.random() * 60}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.2, 0.6, 0.2],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              delay: Math.random() * 4,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Header with Progress and Skip */}
      <div className="flex items-center justify-between p-6 relative z-10">
        <motion.button
          onClick={prevSlide}
          className={`p-2 rounded-full bg-card/50 backdrop-blur-sm border border-border/50 transition-all ${
            currentSlide === 0 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-card/80'
          }`}
          disabled={currentSlide === 0}
          whileHover={currentSlide > 0 ? { scale: 1.05 } : {}}
          whileTap={currentSlide > 0 ? { scale: 0.95 } : {}}
        >
          <ChevronLeft className="w-5 h-5" />
        </motion.button>

        {/* Progress Indicator */}
        <div className="flex space-x-2">
          {slides.map((_, index) => (
            <motion.div
              key={index}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? `bg-gradient-to-r ${slides[currentSlide].color} w-8`
                  : 'bg-muted w-2'
              }`}
              layoutId={`progress-${index}`}
            />
          ))}
        </div>

        <motion.button
          onClick={onComplete}
          className="px-4 py-2 rounded-full bg-card/50 backdrop-blur-sm border border-border/50 text-muted-foreground hover:text-foreground hover:bg-card/80 transition-all"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="text-sm">{t('onboarding.skip')}</span>
        </motion.button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={onboardingAnimationConfig.slide.initial}
            animate={onboardingAnimationConfig.slide.animate}
            exit={onboardingAnimationConfig.slide.exit}
            transition={onboardingAnimationConfig.slide.transition}
            className="text-center space-y-8 max-w-sm"
          >
            {/* Icon */}
            <motion.div
              className={`w-24 h-24 mx-auto rounded-3xl bg-gradient-to-br ${slides[currentSlide].color} flex items-center justify-center shadow-2xl relative overflow-hidden`}
              whileHover={{ scale: 1.05, rotate: 5 }}
              transition={{ duration: 0.3 }}
            >
              {/* Inner glow */}
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
              
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, duration: 0.4, type: "spring" }}
              >
                {React.createElement(slides[currentSlide].icon, { 
                  className: "w-12 h-12 text-white relative z-10" 
                })}
              </motion.div>
            </motion.div>

            {/* Text Content */}
            <motion.div
              className="space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <motion.h1
                className="text-3xl bg-gradient-to-r from-foreground via-foreground/90 to-foreground/80 bg-clip-text text-transparent"
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                {slides[currentSlide].title}
              </motion.h1>
              
              <motion.p
                className="text-lg text-muted-foreground leading-relaxed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.6 }}
              >
                {slides[currentSlide].description}
              </motion.p>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Action */}
      <motion.div
        className="p-8 relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.6 }}
      >
        <motion.div
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button
            onClick={nextSlide}
            className={`w-full h-14 rounded-2xl bg-gradient-to-r ${slides[currentSlide].color} text-white shadow-xl hover:shadow-2xl transition-all group relative overflow-hidden`}
            size="lg"
          >
            {/* Button shine effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"
              initial={false}
            />
            
            {/* Button content */}
            <span className="relative flex items-center justify-center space-x-2">
              <span>
                {currentSlide === slides.length - 1 
                  ? t('onboarding.getStarted') 
                  : t('common.next')
                }
              </span>
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

        {/* Slide indicator text */}
        <motion.div
          className="text-center mt-6 text-muted-foreground text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.4 }}
        >
          {currentSlide + 1} of {slides.length}
        </motion.div>
      </motion.div>
    </div>
  );
}