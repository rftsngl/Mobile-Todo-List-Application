export const SHELL_SCREENS = [
  'home', 
  'board', 
  'profile', 
  'admin-dashboard', 
  'admin-settings', 
  'employee-dashboard'
];

export const FULL_SCREEN_TRANSITIONS = {
  duration: 0.25,
  ease: [0.16, 1, 0.3, 1] as const,
  type: "spring" as const,
  stiffness: 250,
  damping: 25
};

export const TRANSITION_DELAY = 150;

export const BACKGROUND_PARTICLE_COUNT = 8;