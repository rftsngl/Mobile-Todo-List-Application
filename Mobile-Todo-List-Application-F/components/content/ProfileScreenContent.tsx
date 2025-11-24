import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback } from "../ui/avatar";
import {
  CheckSquare,
  Calendar,
  Star,
  Award,
  User,
  Bell,
  Shield,
  Settings,
  HelpCircle,
  ChevronRight,
  LogOut,
} from "lucide-react";

interface ProfileScreenContentProps {
  onNavigate: (screen: string) => void;
}

export function ProfileScreenContent({
  onNavigate,
}: ProfileScreenContentProps) {
  const [animatedStats, setAnimatedStats] = useState([
    0, 0, 0, 0,
  ]);

  const stats = [
    {
      label: "Tasks Completed",
      value: 47,
      icon: CheckSquare,
      color: "text-green-500",
      bgColor:
        "from-green-500/10 via-green-400/5 to-emerald-500/10",
      borderColor: "border-green-500/20",
      accent: "from-green-500/30 to-emerald-500/30",
    },
    {
      label: "Days Active",
      value: 12,
      icon: Calendar,
      color: "text-blue-500",
      bgColor: "from-blue-500/10 via-blue-400/5 to-cyan-500/10",
      borderColor: "border-blue-500/20",
      accent: "from-blue-500/30 to-cyan-500/30",
    },
    {
      label: "Current Streak",
      value: 5,
      icon: Star,
      color: "text-yellow-500",
      bgColor:
        "from-yellow-500/10 via-yellow-400/5 to-orange-500/10",
      borderColor: "border-yellow-500/20",
      accent: "from-yellow-500/30 to-orange-500/30",
    },
    {
      label: "Achievement",
      value: "Productivity Pro",
      icon: Award,
      color: "text-purple-500",
      bgColor:
        "from-purple-500/10 via-purple-400/5 to-pink-500/10",
      borderColor: "border-purple-500/20",
      accent: "from-purple-500/30 to-pink-500/30",
    },
  ];

  const menuSections = [
    {
      title: "Account",
      items: [
        {
          icon: User,
          label: "Personal Information",
          action: () => onNavigate("personal-info"),
          color: "text-blue-500",
        },
        {
          icon: Bell,
          label: "Notifications",
          action: () => onNavigate("notifications"),
          color: "text-orange-500",
        },
        {
          icon: Shield,
          label: "Privacy & Security",
          action: () => onNavigate("privacy-security"),
          color: "text-green-500",
        },
      ],
    },
    {
      title: "Preferences",
      items: [
        {
          icon: Settings,
          label: "App Settings",
          action: () => onNavigate("app-settings"),
          color: "text-gray-500",
        },
        {
          icon: HelpCircle,
          label: "Help & Support",
          action: () => onNavigate("help-support"),
          color: "text-purple-500",
        },
      ],
    },
    {
      title: "Session",
      items: [
        {
          icon: LogOut,
          label: "Sign Out",
          action: () => onNavigate("logout"),
          color: "text-red-500",
          destructive: true,
        },
      ],
    },
  ];

  // Enhanced counter animation effect
  useEffect(() => {
    const animateCounters = () => {
      const numericStats = [47, 12, 5]; // Direct values to avoid dependency issues
      numericStats.forEach((value, index) => {
        let current = 0;
        const increment = value / 40; // More frames for smoother animation
        const timer = setInterval(() => {
          current += increment;
          if (current >= value) {
            current = value;
            clearInterval(timer);
          }
          setAnimatedStats((prev) => {
            const newStats = [...prev];
            newStats[index] = Math.floor(current);
            return newStats;
          });
        }, 40); // Faster updates
      });
    };

    const timer = setTimeout(animateCounters, 1000);
    return () => clearTimeout(timer);
  }, []); // Empty dependency array is now safe

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-background via-background/98 to-muted/20 relative overflow-hidden">
      {/* Enhanced Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-10 right-20 w-40 h-40 bg-gradient-to-br from-primary/15 to-transparent rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 0.8, 1],
            opacity: [0.3, 0.6, 0.3],
            x: [0, 25, -15, 0],
            y: [0, -20, 12, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-20 left-20 w-32 h-32 bg-gradient-to-tl from-secondary/20 to-transparent rounded-full blur-2xl"
          animate={{
            scale: [1, 0.6, 1.4, 1],
            opacity: [0.4, 0.7, 0.4],
            x: [0, -30, 20, 0],
            y: [0, 25, -10, 0],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 3,
          }}
        />
        <motion.div
          className="absolute top-1/2 left-10 w-24 h-24 bg-gradient-to-r from-accent/25 to-transparent rounded-full blur-xl"
          animate={{
            scale: [1, 1.5, 0.7, 1],
            opacity: [0.3, 0.8, 0.3],
            x: [0, 18, -12, 0],
            y: [0, -18, 15, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 6,
          }}
        />
        <motion.div
          className="absolute bottom-40 right-10 w-28 h-28 bg-gradient-to-l from-muted/30 to-transparent rounded-full blur-2xl"
          animate={{
            scale: [1, 1.1, 0.9, 1],
            opacity: [0.2, 0.5, 0.2],
            x: [0, -20, 15, 0],
            y: [0, 15, -25, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 9,
          }}
        />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto pb-4 relative z-10">
        {/* Enhanced Profile Header with dynamic effects */}
        <motion.div
          className="relative bg-gradient-to-br from-primary/15 via-primary/10 to-background/80 backdrop-blur-xl p-6 text-center overflow-hidden"
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{
            duration: 0.8,
            delay: 0.3,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          {/* Enhanced background pattern */}
          <div className="absolute inset-0 opacity-20 overflow-hidden">
            <motion.div
              className="absolute top-4 right-8 w-24 h-24 bg-gradient-to-br from-white/30 to-transparent rounded-full blur-2xl"
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.3, 0.6, 0.3],
                x: [0, 10, -5, 0],
                y: [0, -8, 5, 0],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <motion.div
              className="absolute bottom-4 left-8 w-20 h-20 bg-gradient-to-tl from-white/20 to-transparent rounded-full blur-xl"
              animate={{
                scale: [1, 0.8, 1.2, 1],
                opacity: [0.2, 0.5, 0.2],
                x: [0, -12, 8, 0],
                y: [0, 15, -6, 0],
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 2,
              }}
            />
            {/* Floating rings */}
            <motion.div
              className="absolute inset-0 border border-white/10 rounded-full"
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.3, 0.6, 0.3],
                rotate: [0, 180, 360],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          </div>

          <motion.div
            initial={{ scale: 0, rotate: -180, y: 50 }}
            animate={{ scale: 1, rotate: 0, y: 0 }}
            transition={{
              duration: 1,
              delay: 0.5,
              ease: [0.68, -0.55, 0.265, 1.55],
              type: "spring",
              stiffness: 200,
              damping: 15,
            }}
            className="relative z-10"
          >
            <motion.div
              animate={{
                scale: [1, 1.05, 1],
                rotateY: [0, 5, -5, 0],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              whileHover={{
                scale: 1.15,
                rotateY: 15,
                transition: { duration: 0.3 },
              }}
              className="relative group"
            >
              <Avatar className="w-24 h-24 mx-auto mb-4 relative overflow-hidden border-4 border-primary/20 backdrop-blur-sm shadow-2xl">
                <AvatarFallback className="text-2xl bg-gradient-to-br from-primary/20 via-primary/15 to-primary/10 backdrop-blur-sm relative">
                  <motion.span
                    animate={{
                      textShadow: [
                        "0 0 0px rgba(0,0,0,0)",
                        "0 0 20px rgba(var(--primary), 0.3)",
                        "0 0 0px rgba(0,0,0,0)",
                      ],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    YO
                  </motion.span>
                </AvatarFallback>

                {/* Enhanced avatar glow */}
                <motion.div
                  className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/30 via-primary/20 to-transparent opacity-0 group-hover:opacity-100"
                  transition={{ duration: 0.4 }}
                />

                {/* Orbiting elements */}
                <motion.div
                  className="absolute -top-2 -right-2 w-4 h-4 bg-primary/40 rounded-full"
                  animate={{
                    rotate: [0, 360],
                    scale: [0.5, 1, 0.5],
                    opacity: [0.3, 0.8, 0.3],
                  }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />
              </Avatar>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.6,
              delay: 0.7,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="relative z-10 space-y-3"
          >
            <motion.h2
              className="text-2xl bg-gradient-to-r from-foreground via-foreground/90 to-foreground/80 bg-clip-text text-transparent"
              animate={{
                backgroundPosition: [
                  "0% 50%",
                  "100% 50%",
                  "0% 50%",
                ],
                scale: [1, 1.02, 1],
              }}
              transition={{
                backgroundPosition: {
                  duration: 8,
                  repeat: Infinity,
                  ease: "linear",
                },
                scale: {
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                },
              }}
            >
              You
            </motion.h2>
            <motion.p
              className="text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              your.email@example.com
            </motion.p>

            <motion.div
              initial={{ scale: 0, opacity: 0, rotateY: -90 }}
              animate={{ scale: 1, opacity: 1, rotateY: 0 }}
              transition={{
                delay: 0.9,
                type: "spring",
                stiffness: 400,
                damping: 25,
              }}
              whileHover={{
                scale: 1.08,
                y: -2,
                boxShadow:
                  "0 10px 25px -5px rgba(0, 0, 0, 0.2)",
              }}
              whileTap={{ scale: 0.95 }}
              className="inline-block"
            >
              <Badge
                variant="secondary"
                className="px-4 py-2 bg-gradient-to-r from-primary/10 via-primary/15 to-primary/5 backdrop-blur-sm border border-primary/20 shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden group cursor-pointer"
              >
                {/* Badge background animation */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent"
                  animate={{
                    x: ["-100%", "100%"],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "linear",
                    repeatDelay: 2,
                  }}
                />

                <div className="flex items-center relative z-10">
                  <motion.div
                    animate={{
                      rotate: [0, 10, -10, 0],
                      scale: [1, 1.1, 1],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="mr-2"
                  >
                    <Award className="w-4 h-4 text-primary" />
                  </motion.div>
                  <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                    Pro User
                  </span>
                </div>

                {/* Sparkle effects */}
                {Array.from({ length: 3 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-primary rounded-full group-hover:opacity-100 opacity-0"
                    style={{
                      top: `${20 + i * 20}%`,
                      left: `${15 + i * 25}%`,
                    }}
                    animate={{
                      scale: [0, 1, 0],
                      opacity: [0, 1, 0],
                      rotate: [0, 180, 360],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: i * 0.5,
                      ease: "easeInOut",
                    }}
                  />
                ))}
              </Badge>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Enhanced Stats Grid with dynamic animations */}
        <motion.div
          className="p-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.6,
            delay: 0.8,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          <motion.h3
            className="text-sm text-muted-foreground mb-6 relative"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.9 }}
          >
            <span>Your Stats</span>
            <motion.div
              className="absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-primary/50 to-transparent rounded-full"
              initial={{ width: 0 }}
              animate={{ width: "60%" }}
              transition={{
                delay: 1,
                duration: 0.8,
                ease: [0.16, 1, 0.3, 1],
              }}
            />
          </motion.h3>

          <div className="grid grid-cols-2 gap-4">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <motion.div
                  key={index}
                  initial={{
                    opacity: 0,
                    scale: 0.7,
                    rotateY: -30,
                    z: -100,
                  }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    rotateY: 0,
                    z: 0,
                  }}
                  transition={{
                    duration: 0.6,
                    delay: 1 + index * 0.15,
                    ease: [0.16, 1, 0.3, 1],
                    type: "spring",
                    stiffness: 200,
                    damping: 20,
                  }}
                  whileHover={{
                    scale: 1.05,
                    y: -6,
                    rotateX: 5,
                    transition: {
                      duration: 0.3,
                      type: "spring",
                      stiffness: 400,
                      damping: 25,
                    },
                  }}
                  className="group relative overflow-hidden"
                >
                  <motion.div
                    className={`relative bg-gradient-to-br ${stat.bgColor} backdrop-blur-sm border ${stat.borderColor} rounded-2xl p-5 transition-all duration-300 group-hover:shadow-2xl overflow-hidden`}
                    whileHover={{
                      boxShadow:
                        "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                    }}
                  >
                    {/* Dynamic background decoration */}
                    <div className="absolute inset-0 overflow-hidden">
                      <motion.div
                        className="absolute top-2 right-2 w-12 h-12 bg-gradient-to-br from-white/10 to-transparent rounded-full blur-lg"
                        animate={{
                          scale: [1, 1.2, 1],
                          opacity: [0.3, 0.6, 0.3],
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: index * 0.5,
                        }}
                      />
                      {/* Animated gradient overlay */}
                      <motion.div
                        className={`absolute inset-0 bg-gradient-to-br ${stat.accent} opacity-0 group-hover:opacity-100`}
                        transition={{ duration: 0.4 }}
                      />
                    </div>

                    <div className="flex items-center space-x-3 mb-3 relative z-10">
                      <motion.div
                        whileHover={{
                          scale: 1.3,
                          rotate: 15,
                          transition: { duration: 0.2 },
                        }}
                        animate={{
                          rotate: [0, 3, -3, 0],
                          scale: [1, 1.05, 1],
                        }}
                        transition={{
                          duration: 6,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: index * 0.7,
                        }}
                        className="relative"
                      >
                        <IconComponent
                          className={`w-5 h-5 ${stat.color}`}
                        />
                        {/* Icon glow effect */}
                        <motion.div
                          className={`absolute inset-0 ${stat.color} opacity-0 group-hover:opacity-30 blur-md`}
                          transition={{ duration: 0.3 }}
                        />
                      </motion.div>
                      <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors">
                        {stat.label}
                      </span>
                    </div>

                    <motion.div
                      className="text-2xl relative z-10"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{
                        delay: 1.2 + index * 0.15,
                        type: "spring",
                        stiffness: 400,
                        damping: 25,
                      }}
                    >
                      {typeof stat.value === "number" ? (
                        <motion.span
                          key={animatedStats[index]}
                          initial={{
                            opacity: 0,
                            y: 20,
                            scale: 0.8,
                          }}
                          animate={{
                            opacity: 1,
                            y: 0,
                            scale: 1,
                          }}
                          className="bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent relative inline-block"
                        >
                          {animatedStats[index]}
                          {/* Number glow effect */}
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent opacity-0 group-hover:opacity-100 blur-sm"
                            transition={{ duration: 0.3 }}
                          />
                        </motion.span>
                      ) : (
                        <motion.span
                          className="text-sm bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent"
                          animate={{
                            backgroundPosition: [
                              "0% 50%",
                              "100% 50%",
                              "0% 50%",
                            ],
                          }}
                          transition={{
                            duration: 6,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                        >
                          {stat.value}
                        </motion.span>
                      )}
                    </motion.div>

                    {/* Progress ring for hover effect */}
                    <motion.div
                      className="absolute inset-0 rounded-2xl border border-white/0 group-hover:border-white/20"
                      initial={{ scale: 1.2, opacity: 0 }}
                      whileHover={{
                        scale: [1.2, 1.1, 1],
                        opacity: [0, 0.5, 1],
                      }}
                      transition={{ duration: 0.4 }}
                    />
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Enhanced Menu Sections */}
        <div className="px-6 space-y-8 pb-8">
          {menuSections.map((section, sectionIndex) => (
            <motion.div
              key={`${section.title}-${sectionIndex}`}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.6,
                delay: 2 + sectionIndex * 0.2,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <motion.h3
                className="text-sm text-muted-foreground mb-4 relative"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  delay: 2.1 + sectionIndex * 0.2,
                }}
              >
                <span>{section.title}</span>
                <motion.div
                  className="absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-primary/50 to-transparent rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: "50%" }}
                  transition={{
                    delay: 2.2 + sectionIndex * 0.2,
                    duration: 0.6,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                />
              </motion.h3>

              <div className="space-y-3">
                {section.items.map((item, itemIndex) => {
                  const IconComponent = item.icon;
                  return (
                    <motion.div
                      key={`${sectionIndex}-${item.label}-${itemIndex}`}
                      initial={{
                        opacity: 0,
                        x: -30,
                        scale: 0.9,
                      }}
                      animate={{
                        opacity: 1,
                        x: 0,
                        scale: 1,
                      }}
                      transition={{
                        delay:
                          2.3 +
                          sectionIndex * 0.2 +
                          itemIndex * 0.1,
                        duration: 0.4,
                        ease: [0.16, 1, 0.3, 1],
                        type: "spring",
                        stiffness: 300,
                        damping: 25,
                      }}
                      whileHover={{
                        scale: 1.02,
                        x: 6,
                        transition: {
                          duration: 0.2,
                          type: "spring",
                          stiffness: 400,
                          damping: 25,
                        },
                      }}
                      whileTap={{ scale: 0.98 }}
                      onClick={item.action}
                      className="cursor-pointer group"
                    >
                      <motion.div
                        className="bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-4 transition-all duration-300 hover:bg-card/80 hover:border-border/80 hover:shadow-lg relative overflow-hidden"
                        whileHover={{
                          boxShadow:
                            "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
                        }}
                      >
                        {/* Hover gradient effect */}
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 rounded-2xl"
                          transition={{ duration: 0.3 }}
                        />

                        <div className="flex items-center justify-between relative z-10">
                          <div className="flex items-center space-x-3">
                            <motion.div
                              className="p-2 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 backdrop-blur-sm"
                              whileHover={{
                                scale: 1.1,
                                rotate: 5,
                                transition: {
                                  duration: 0.2,
                                },
                              }}
                              animate={{
                                scale: [1, 1.02, 1],
                              }}
                              transition={{
                                duration: 4,
                                repeat: Infinity,
                                ease: "easeInOut",
                                delay:
                                  itemIndex * 0.5,
                              }}
                            >
                              <IconComponent
                                className={`w-5 h-5 ${item.color} transition-colors duration-300 group-hover:scale-110`}
                              />
                            </motion.div>
                            <span className="group-hover:text-foreground transition-colors">
                              {item.label}
                            </span>
                          </div>

                          <motion.div
                            animate={{
                              x: [0, 3, 0],
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              ease: "easeInOut",
                              delay: itemIndex * 0.3,
                            }}
                          >
                            <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                          </motion.div>
                        </div>

                        {/* Click ripple effect */}
                        <motion.div
                          className="absolute inset-0 rounded-2xl bg-primary/10 scale-0"
                          whileTap={{
                            scale: [0, 1.5, 0],
                            opacity: [0, 0.3, 0],
                          }}
                          transition={{ duration: 0.5 }}
                        />
                      </motion.div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}