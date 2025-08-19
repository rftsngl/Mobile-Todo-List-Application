export const fullScreenTransitionVariants = {
  enter: {
    opacity: 0,
    x: 20,
    scale: 0.98
  },
  center: {
    opacity: 1,
    x: 0,
    scale: 1
  },
  exit: {
    opacity: 0,
    x: -20,
    scale: 0.98
  }
};

// [FIX-PERF] Modal animation config - Reduced duration and intensity
export const modalAnimationConfig = {
  initial: { 
    opacity: 0, 
    scale: 0.96, 
    y: 16 // [FIX-PERF] Reduced from 20
  },
  animate: { 
    opacity: 1, 
    scale: 1, 
    y: 0 
  },
  exit: { 
    opacity: 0, 
    scale: 0.96, 
    y: 16 
  },
  transition: {
    duration: 0.2, // [FIX-PERF] Reduced from 0.25
    ease: [0.16, 1, 0.3, 1]
  }
};

// [FIX-PERF] Background particle configuration - Optimized count and animation
export const backgroundParticleConfig = {
  count: 8, // [FIX-PERF] Reduced from 20 to 8
  animation: {
    y: [0, -20, 0], // [FIX-PERF] Reduced range from -30
    opacity: [0.1, 0.2, 0.1], // [FIX-PERF] Reduced opacity range
    scale: [1, 1.1, 1], // [FIX-PERF] Reduced scale from 1.2
  },
  transition: {
    duration: 12, // [FIX-PERF] Increased duration for smoother animation
    repeat: Infinity,
    ease: "easeInOut"
  }
};

// [FIX-PERF] Task item hover animations - Optimized
export const taskItemAnimations = {
  hover: {
    scale: 1.01, // [FIX-PERF] Reduced from 1.02
    transition: { 
      duration: 0.15, // [FIX-PERF] Faster response
      ease: [0.16, 1, 0.3, 1] 
    }
  },
  tap: {
    scale: 0.99,
    transition: { 
      duration: 0.1 
    }
  }
};

// [FIX-PERF] Loading animations - Skeleton shimmer
export const loadingAnimations = {
  skeleton: {
    opacity: [0.5, 1, 0.5],
    transition: {
      duration: 1.2, // [FIX-PERF] Slightly faster
      repeat: Infinity,
      ease: "easeInOut"
    }
  },
  spinner: {
    rotate: 360,
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: "linear"
    }
  }
};

// [FIX-SAFE] Safe area aware animations
export const overlayAnimations = {
  modal: {
    initial: { 
      opacity: 0, 
      y: '20px', // [FIX-SAFE] String value for calc compatibility
      scale: 0.96 
    },
    animate: { 
      opacity: 1, 
      y: '0px', 
      scale: 1 
    },
    exit: { 
      opacity: 0, 
      y: '20px', 
      scale: 0.96 
    }
  },
  drawer: {
    initial: { 
      opacity: 0, 
      y: '100%' // [FIX-SAFE] Full height for bottom sheets
    },
    animate: { 
      opacity: 1, 
      y: '0%' 
    },
    exit: { 
      opacity: 0, 
      y: '100%' 
    }
  }
};

// [FIX-LIST] List item animations for virtual scrolling
export const listAnimations = {
  item: {
    initial: { 
      opacity: 0, 
      x: -10 
    },
    animate: { 
      opacity: 1, 
      x: 0 
    },
    exit: { 
      opacity: 0, 
      x: 10 
    },
    transition: {
      duration: 0.15, // [FIX-PERF] Fast for list items
      ease: "easeOut"
    }
  },
  stagger: {
    staggerChildren: 0.03, // [FIX-PERF] Quick stagger
    delayChildren: 0.02
  }
};

// [FIX-GESTURE] Touch-friendly animation thresholds
export const gestureAnimations = {
  swipe: {
    threshold: 24, // [FIX-GESTURE] Minimum swipe distance
    velocityThreshold: 0.3, // [FIX-GESTURE] Minimum velocity
    snapAnimation: {
      type: "spring",
      stiffness: 300,
      damping: 30
    }
  },
  drag: {
    dragConstraints: { left: 0, right: 0, top: 0, bottom: 0 },
    dragElastic: 0.1,
    dragTransition: { 
      bounceStiffness: 600, 
      bounceDamping: 20 
    }
  }
};

// [FIX-I18N] RTL-aware animation directions
export const rtlAnimations = {
  slideInFromStart: (isRTL: boolean) => ({
    initial: { opacity: 0, x: isRTL ? 20 : -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: isRTL ? -20 : 20 }
  }),
  slideInFromEnd: (isRTL: boolean) => ({
    initial: { opacity: 0, x: isRTL ? -20 : 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: isRTL ? 20 : -20 }
  })
};

// [FIX-I18N] Welcome screen animation config
export const welcomeAnimationConfig = {
  skipButton: {
    initial: { opacity: 0, y: -20, scale: 0.8 },
    animate: { opacity: 1, y: 0, scale: 1 },
    transition: { duration: 0.4, delay: 0.2, ease: [0.16, 1, 0.3, 1] }
  },
  logo: {
    initial: { scale: 0, rotate: -180, opacity: 0 },
    animate: { scale: 1, rotate: 0, opacity: 1 },
    transition: { duration: 0.6, delay: 0.4, ease: [0.16, 1, 0.3, 1] }
  },
  title: {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.5, delay: 0.8, ease: [0.16, 1, 0.3, 1] }
  },
  button: {
    initial: { opacity: 0, y: 40, scale: 0.9 },
    animate: { opacity: 1, y: 0, scale: 1 },
    transition: { duration: 0.6, delay: 1.4, ease: [0.16, 1, 0.3, 1] }
  },
  floatingRing: {
    animate: {
      scale: [1, 1.1, 1],
      opacity: [0.3, 0.6, 0.3]
    },
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

// [FIX-I18N] Onboarding animation config
export const onboardingAnimationConfig = {
  backgroundOrb: {
    primary: {
      animate: {
        scale: [1, 1.2, 1],
        opacity: [0.15, 0.3, 0.15],
        rotate: [0, 180, 360]
      },
      transition: {
        duration: 20,
        repeat: Infinity,
        ease: "linear"
      }
    },
    secondary: {
      animate: {
        scale: [1, 0.8, 1.3, 1],
        opacity: [0.1, 0.25, 0.1],
        rotate: [360, 180, 0]
      },
      transition: {
        duration: 15,
        repeat: Infinity,
        ease: "easeInOut",
        delay: 5
      }
    }
  },
  slide: {
    initial: { opacity: 0, x: 20, scale: 0.95 },
    animate: { opacity: 1, x: 0, scale: 1 },
    exit: { opacity: 0, x: -20, scale: 0.95 },
    transition: {
      duration: 0.25,
      ease: [0.16, 1, 0.3, 1]
    }
  },
  iconContainer: {
    initial: { scale: 0, opacity: 0, rotate: -180 },
    animate: { scale: 1, opacity: 1, rotate: 0 },
    transition: {
      duration: 0.6,
      delay: 0.2,
      ease: [0.16, 1, 0.3, 1]
    }
  }
};

// [FIX-I18N] Auth selection screen animation config
export const authSelectionAnimationConfig = {
  header: {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4, delay: 0.1, ease: [0.16, 1, 0.3, 1] }
  },
  welcomeText: {
    initial: { opacity: 0, y: 30, scale: 0.95 },
    animate: { opacity: 1, y: 0, scale: 1 },
    transition: { duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }
  },
  actionCards: {
    initial: { opacity: 0, y: 40 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, delay: 0.4, ease: [0.16, 1, 0.3, 1] }
  },
  bottomHint: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.6, delay: 0.8 }
  }
};

// [FIX-PERF] Spring configurations
export const springConfigs = {
  default: {
    type: "spring",
    stiffness: 250,
    damping: 25
  },
  gentle: {
    type: "spring", 
    stiffness: 150,
    damping: 20
  },
  bouncy: {
    type: "spring",
    stiffness: 400,
    damping: 15
  },
  medium: {
    type: "spring",
    stiffness: 200,
    damping: 20
  }
};

// [FIX-PERF] Easing curves
export const easingCurves = {
  easeOut: [0.16, 1, 0.3, 1],
  easeInOut: [0.4, 0, 0.2, 1],
  easeBounce: [0.68, -0.55, 0.265, 1.55],
  easeElastic: [0.175, 0.885, 0.32, 1.275],
  smooth: [0.16, 1, 0.3, 1]
};

// Performance monitoring configuration
export const performanceConfig = {
  // [FIX-PERF] Animation budget thresholds
  maxConcurrentAnimations: 8,
  frameDropThreshold: 3, // Alert if more than 3 frames dropped
  memoryThreshold: 50 * 1024 * 1024, // 50MB memory threshold
  
  // [FIX-PERF] Reduced-motion preferences
  respectsReducedMotion: true,
  fallbackDuration: 0.1 // Minimal animation for reduced motion
};