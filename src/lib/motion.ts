/**
 * Framer Motion Animation Presets
 * Consistente animaties door de hele applicatie
 */

// ========================
// Container Animations
// ========================

export const staggerContainer = {
  hidden: {},
  show: { 
    transition: { 
      staggerChildren: 0.08,
      delayChildren: 0.1 
    } 
  },
};

export const staggerContainerSlow = {
  hidden: {},
  show: { 
    transition: { 
      staggerChildren: 0.15,
      delayChildren: 0.2 
    } 
  },
};

// ========================
// Basic Animations
// ========================

export const fadeIn = {
  hidden: { opacity: 0 },
  show: { 
    opacity: 1, 
    transition: { duration: 0.5, ease: "easeOut" } 
  },
};

export const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  show: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.5, ease: [0.2, 0.8, 0.2, 1] } 
  },
};

export const fadeInDown = {
  hidden: { opacity: 0, y: -20 },
  show: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.5, ease: [0.2, 0.8, 0.2, 1] } 
  },
};

export const fadeInLeft = {
  hidden: { opacity: 0, x: -30 },
  show: { 
    opacity: 1, 
    x: 0, 
    transition: { duration: 0.5, ease: [0.2, 0.8, 0.2, 1] } 
  },
};

export const fadeInRight = {
  hidden: { opacity: 0, x: 30 },
  show: { 
    opacity: 1, 
    x: 0, 
    transition: { duration: 0.5, ease: [0.2, 0.8, 0.2, 1] } 
  },
};

// ========================
// Scale Animations
// ========================

export const pop = {
  hidden: { opacity: 0, scale: 0.9 },
  show: { 
    opacity: 1, 
    scale: 1, 
    transition: { duration: 0.35, ease: "easeOut" } 
  },
};

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.8 },
  show: { 
    opacity: 1, 
    scale: 1, 
    transition: { 
      duration: 0.5, 
      ease: [0.16, 1, 0.3, 1] 
    } 
  },
};

export const bounce = {
  hidden: { opacity: 0, scale: 0.3 },
  show: { 
    opacity: 1, 
    scale: 1, 
    transition: { 
      type: "spring",
      stiffness: 300,
      damping: 15
    } 
  },
};

// ========================
// Hover Animations
// ========================

export const cardHover = {
  rest: { 
    scale: 1, 
    boxShadow: '0 10px 40px rgba(17,24,39,0.06)' 
  },
  hover: { 
    scale: 1.02, 
    boxShadow: '0 25px 60px rgba(13,16,30,0.12)', 
    transition: { duration: 0.3, ease: "easeOut" } 
  },
};

export const buttonHover = {
  rest: { scale: 1 },
  hover: { scale: 1.05 },
  tap: { scale: 0.98 },
};

export const linkHover = {
  rest: { x: 0 },
  hover: { x: 4 },
};

export const iconHover = {
  rest: { rotate: 0, scale: 1 },
  hover: { rotate: 15, scale: 1.1 },
};

// ========================
// Page Transitions
// ========================

export const pageTransition = {
  initial: { opacity: 0, y: 20 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" }
  },
  exit: { 
    opacity: 0, 
    y: -10,
    transition: { duration: 0.2 }
  },
};

export const slideInFromRight = {
  initial: { x: "100%", opacity: 0 },
  animate: { 
    x: 0, 
    opacity: 1,
    transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }
  },
  exit: { 
    x: "100%", 
    opacity: 0,
    transition: { duration: 0.3 }
  },
};

export const slideInFromBottom = {
  initial: { y: "100%", opacity: 0 },
  animate: { 
    y: 0, 
    opacity: 1,
    transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }
  },
  exit: { 
    y: "100%", 
    opacity: 0,
    transition: { duration: 0.3 }
  },
};

// ========================
// Modal Animations
// ========================

export const modalBackdrop = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

export const modalContent = {
  initial: { opacity: 0, scale: 0.95, y: 20 },
  animate: { 
    opacity: 1, 
    scale: 1, 
    y: 0,
    transition: { 
      duration: 0.3, 
      ease: [0.16, 1, 0.3, 1] 
    }
  },
  exit: { 
    opacity: 0, 
    scale: 0.95, 
    y: 10,
    transition: { duration: 0.2 }
  },
};

// ========================
// Scroll Reveal Animations
// ========================

export const revealFromBelow = {
  offscreen: { y: 50, opacity: 0 },
  onscreen: { 
    y: 0, 
    opacity: 1,
    transition: { 
      duration: 0.6, 
      ease: [0.2, 0.8, 0.2, 1] 
    }
  },
};

export const revealFromLeft = {
  offscreen: { x: -50, opacity: 0 },
  onscreen: { 
    x: 0, 
    opacity: 1,
    transition: { 
      duration: 0.6, 
      ease: [0.2, 0.8, 0.2, 1] 
    }
  },
};

export const revealScale = {
  offscreen: { scale: 0.9, opacity: 0 },
  onscreen: { 
    scale: 1, 
    opacity: 1,
    transition: { 
      duration: 0.5, 
      ease: "easeOut" 
    }
  },
};

// ========================
// Special Effects
// ========================

export const float = {
  y: [-5, 5, -5],
  transition: {
    duration: 4,
    repeat: Infinity,
    ease: "easeInOut"
  }
};

export const pulse = {
  scale: [1, 1.05, 1],
  transition: {
    duration: 2,
    repeat: Infinity,
    ease: "easeInOut"
  }
};

export const shimmer = {
  x: ["-100%", "100%"],
  transition: {
    duration: 1.5,
    repeat: Infinity,
    ease: "linear"
  }
};

// ========================
// Utility Functions
// ========================

export const createStaggerDelay = (index: number, baseDelay = 0.1) => ({
  transition: { delay: index * baseDelay }
});

export const viewportConfig = {
  once: true,
  margin: "-100px 0px"
};

export const viewportConfigEager = {
  once: true,
  margin: "-50px 0px"
};
