import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useLocalization } from '../LocalizationProvider';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { 
  ChevronDown, 
  Plus, 
  MoreVertical, 
  Flag, 
  Calendar,
  List,
  CalendarDays,
  Clock
} from 'lucide-react';

interface BoardContentProps {
  tasks: any[];
  setTasks: (tasks: any[]) => void;
  onNavigate: (screen: string) => void;
  onAddTask: () => void;
  viewMode?: 'list' | 'calendar';
  onViewModeChange?: (mode: 'list' | 'calendar') => void;
}

export function BoardContent({ 
  tasks, 
  setTasks, 
  onNavigate, 
  onAddTask, 
  viewMode = 'list',
  onViewModeChange 
}: BoardContentProps) {
  const { t } = useLocalization();
  const [draggedTask, setDraggedTask] = useState<any>(null);
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);
  // Accordion davranışı için sadece bir aktif column
  const [activeColumn, setActiveColumn] = useState<string>('new'); // Başlangıçta sadece 'new' açık

  const columns = [
    { 
      id: 'new', 
      title: t('board.new'), 
      // Mavi tonları - daha belirgin
      color: 'bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-300', 
      bgGradient: 'from-blue-50/80 via-blue-50/40 to-background dark:from-blue-950/20 dark:via-blue-950/10 dark:to-background',
      accent: 'from-blue-500/25 to-blue-400/15',
      borderColor: 'border-blue-200/60 dark:border-blue-800/50',
      badgeColor: 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300',
      iconColor: 'text-blue-600 dark:text-blue-400'
    },
    { 
      id: 'in-progress', 
      title: t('board.inProgress'), 
      // Turuncu/amber tonları - enerji verici
      color: 'bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-300', 
      bgGradient: 'from-amber-50/80 via-amber-50/40 to-background dark:from-amber-950/20 dark:via-amber-950/10 dark:to-background',
      accent: 'from-amber-500/25 to-orange-400/15',
      borderColor: 'border-amber-200/60 dark:border-amber-800/50',
      badgeColor: 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300',
      iconColor: 'text-amber-600 dark:text-amber-400'
    },
    { 
      id: 'pending', 
      title: t('board.pending'), 
      // Mor tonları - bekleyiş hissi
      color: 'bg-purple-50 text-purple-700 dark:bg-purple-950/30 dark:text-purple-300', 
      bgGradient: 'from-purple-50/80 via-purple-50/40 to-background dark:from-purple-950/20 dark:via-purple-950/10 dark:to-background',
      accent: 'from-purple-500/25 to-purple-400/15',
      borderColor: 'border-purple-200/60 dark:border-purple-800/50',
      badgeColor: 'bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300',
      iconColor: 'text-purple-600 dark:text-purple-400'
    },
    { 
      id: 'done', 
      title: t('board.done'), 
      // Yeşil tonları - başarı hissi
      color: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300', 
      bgGradient: 'from-emerald-50/80 via-emerald-50/40 to-background dark:from-emerald-950/20 dark:via-emerald-950/10 dark:to-background',
      accent: 'from-emerald-500/25 to-emerald-400/15',
      borderColor: 'border-emerald-200/60 dark:border-emerald-800/50',
      badgeColor: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300',
      iconColor: 'text-emerald-600 dark:text-emerald-400'
    }
  ];

  const getTasksByStatus = (status: string) => {
    switch (status) {
      case 'new':
        return tasks.filter(task => !task.completed && !task.inProgress && !task.pending);
      case 'in-progress':
        return tasks.filter(task => task.inProgress && !task.completed);
      case 'pending':
        return tasks.filter(task => task.pending && !task.completed);
      case 'done':
        return tasks.filter(task => task.completed);
      default:
        return [];
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-500 dark:text-red-400';
      case 'medium': return 'text-amber-500 dark:text-amber-400';
      case 'low': return 'text-emerald-500 dark:text-emerald-400';
      default: return 'text-muted-foreground';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const formatDateTurkish = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', { 
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const handleDragStart = (e: React.DragEvent, task: any) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, columnId: string) => {
    e.preventDefault();
    setDragOverColumn(columnId);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setDragOverColumn(null);
    }
  };

  const handleDrop = (e: React.DragEvent, columnId: string) => {
    e.preventDefault();
    setDragOverColumn(null);

    if (!draggedTask) return;

    const updatedTasks = tasks.map(task => {
      if (task.id === draggedTask.id) {
        return {
          ...task,
          completed: columnId === 'done',
          inProgress: columnId === 'in-progress',
          pending: columnId === 'pending'
        };
      }
      return task;
    });

    setTasks(updatedTasks);
    setDraggedTask(null);
  };

  // Accordion davranışı: Bir column'a tıklanınca sadece o açılır, diğerleri kapanır
  const toggleColumn = (columnId: string) => {
    if (activeColumn === columnId) {
      // Eğer tıklanan column zaten açıksa kapat
      setActiveColumn('');
    } else {
      // Değilse sadece o column'u aç
      setActiveColumn(columnId);
    }
  };

  // Enhanced Calendar View Component
  const CalendarView = () => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
    
    const getDayTasks = (day: number) => {
      const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      return tasks.filter(task => task.dueDate === dateStr);
    };

    const getAllTasksInMonth = () => {
      const startOfMonth = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-01`;
      const endOfMonth = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(daysInMonth).padStart(2, '0')}`;
      return tasks.filter(task => task.dueDate >= startOfMonth && task.dueDate <= endOfMonth)
        .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
    };

    const monthTasks = getAllTasksInMonth();

    return (
      <motion.div 
        className="flex-1 overflow-y-auto p-4 relative z-10 pb-24"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <div className="space-y-6">
          {/* Calendar Grid */}
          <div className="bg-card/60 backdrop-blur-sm border border-border/60 rounded-3xl p-6">
            <h3 className="text-lg font-medium mb-4 text-center">
              {today.toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' })}
            </h3>
            
            {/* Days of week header */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {['Pz', 'Pt', 'Sa', 'Ça', 'Pe', 'Cu', 'Ct'].map(day => (
                <div key={day} className="text-center text-xs font-medium text-muted-foreground p-2">
                  {day}
                </div>
              ))}
            </div>
            
            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-1">
              {/* Empty cells for days before month starts */}
              {Array.from({ length: firstDayOfMonth }, (_, i) => (
                <div key={`empty-${i}`} className="aspect-square" />
              ))}
              
              {/* Days of the month */}
              {Array.from({ length: daysInMonth }, (_, i) => {
                const day = i + 1;
                const dayTasks = getDayTasks(day);
                const isToday = day === today.getDate();
                
                return (
                  <motion.div
                    key={day}
                    className={`aspect-square p-1 rounded-lg border relative ${
                      isToday 
                        ? 'bg-primary/10 border-primary/30' 
                        : 'bg-card border-border/30 hover:bg-muted/50'
                    }`}
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="text-xs font-medium text-center mb-1">{day}</div>
                    {dayTasks.length > 0 && (
                      <div className="absolute bottom-1 left-1 right-1">
                        <div className="flex justify-center gap-0.5">
                          {dayTasks.slice(0, 3).map((_, idx) => (
                            <div 
                              key={idx} 
                              className={`w-1 h-1 rounded-full ${
                                idx === 0 ? 'bg-primary' : 
                                idx === 1 ? 'bg-primary/70' : 'bg-primary/40'
                              }`} 
                            />
                          ))}
                          {dayTasks.length > 3 && (
                            <div className="text-xs text-primary/60">+</div>
                          )}
                        </div>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Tasks List for This Month */}
          {monthTasks.length > 0 && (
            <div className="bg-card/60 backdrop-blur-sm border border-border/60 rounded-3xl p-6">
              <h4 className="text-lg font-medium mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                Bu Ayki Görevler ({monthTasks.length})
              </h4>
              
              <div className="space-y-3">
                {monthTasks.map((task, index) => {
                  const isToday = task.dueDate === today.toISOString().split('T')[0];
                  const isPast = new Date(task.dueDate) < new Date(today.toISOString().split('T')[0]);
                  
                  return (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`p-4 rounded-2xl border transition-all duration-200 hover:shadow-md ${
                        isToday 
                          ? 'bg-primary/5 border-primary/30 ring-1 ring-primary/20' :
                        isPast && !task.completed
                          ? 'bg-red-50 border-red-200 dark:bg-red-950/20 dark:border-red-800/30' :
                        task.completed
                          ? 'bg-emerald-50 border-emerald-200 dark:bg-emerald-950/20 dark:border-emerald-800/30' :
                          'bg-card border-border/60 hover:border-border'
                      }`}
                      whileHover={{ scale: 1.01 }}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h5 className={`font-medium text-sm leading-tight ${
                            task.completed ? 'line-through text-muted-foreground' : ''
                          }`}>
                            {task.title}
                          </h5>
                          {task.description && (
                            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                              {task.description}
                            </p>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-2 ml-3">
                          <Flag className={`w-3 h-3 ${getPriorityColor(task.priority)}`} />
                          {task.completed && (
                            <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          <span className={isToday ? 'text-primary font-medium' : ''}>
                            {isToday ? 'Bugün' : formatDateTurkish(task.dueDate)}
                          </span>
                          {isPast && !task.completed && (
                            <Badge variant="outline" className="text-xs py-0 px-1 bg-red-50 text-red-600 border-red-200">
                              Gecikmiş
                            </Badge>
                          )}
                        </div>

                        {task.tags.length > 0 && (
                          <div className="flex gap-1">
                            {task.tags.slice(0, 2).map((tag: string, tagIndex: number) => (
                              <Badge 
                                key={tagIndex}
                                variant="outline" 
                                className="text-xs px-2 py-0 bg-background/60"
                              >
                                {tag}
                              </Badge>
                            ))}
                            {task.tags.length > 2 && (
                              <Badge variant="outline" className="text-xs px-2 py-0">
                                +{task.tags.length - 2}
                              </Badge>
                            )}
                          </div>
                        )}
                      </div>

                      {task.subtasks.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-border/50">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-muted-foreground">Alt Görevler</span>
                            <span className="text-primary font-medium">
                              {task.subtasks.filter((s: any) => s.completed).length}/{task.subtasks.length}
                            </span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-1.5 mt-2">
                            <div 
                              className="bg-primary h-1.5 rounded-full transition-all duration-300"
                              style={{
                                width: `${(task.subtasks.filter((s: any) => s.completed).length / task.subtasks.length) * 100}%`
                              }}
                            />
                          </div>
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </div>
          )}

          {monthTasks.length === 0 && (
            <div className="bg-card/60 backdrop-blur-sm border border-border/60 rounded-3xl p-8 text-center">
              <motion.div
                animate={{
                  scale: [1, 1.05, 1],
                  opacity: [0.5, 0.8, 0.5]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="text-4xl mb-3"
              >
                📅
              </motion.div>
              <h4 className="font-medium text-muted-foreground mb-2">Bu ay hiç görev yok</h4>
              <p className="text-sm text-muted-foreground">
                Yeni görevler eklemek için + butonunu kullanabilirsiniz
              </p>
            </div>
          )}
        </div>
      </motion.div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-background relative">
      {/* Enhanced Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.08] pointer-events-none">
        <div className="absolute top-16 right-12 w-32 h-32 bg-blue-500 rounded-full blur-3xl" />
        <div className="absolute bottom-32 left-12 w-24 h-24 bg-emerald-500 rounded-full blur-2xl" />
        <div className="absolute top-1/2 left-8 w-20 h-20 bg-purple-500 rounded-full blur-xl" />
        <div className="absolute bottom-1/2 right-8 w-28 h-28 bg-amber-500 rounded-full blur-2xl" />
      </div>

      {/* View Content */}
      {viewMode === 'list' ? (
        // Enhanced Kanban Board - Vertical Layout with Accordion
        <motion.div 
          className="flex-1 overflow-y-auto p-4 space-y-4 pb-24 relative z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
        {columns.map((column, columnIndex) => {
          const columnTasks = getTasksByStatus(column.id);
          const isActive = activeColumn === column.id;
          
          return (
            <motion.div
              key={column.id}
              layout
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{
                duration: 0.4,
                delay: 0.1 + columnIndex * 0.1,
                ease: [0.16, 1, 0.3, 1],
                type: "spring",
                stiffness: 300,
                damping: 25
              }}
              className={`relative rounded-3xl flex flex-col transition-all duration-300 ease-out overflow-hidden group ${
                dragOverColumn === column.id 
                  ? 'bg-primary/10 border-2 border-primary border-dashed shadow-xl scale-[1.02]' 
                  : `bg-gradient-to-br ${column.bgGradient} border ${column.borderColor} backdrop-blur-sm hover:shadow-lg ${
                      isActive ? 'ring-2 ring-primary/20 shadow-xl scale-[1.01]' : 'shadow-sm'
                    }`
              }`}
              onDragOver={(e) => handleDragOver(e, column.id)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, column.id)}
              whileHover={{
                scale: isActive ? 1.01 : 1.02,
                y: -3,
                boxShadow: "0 15px 30px -5px rgba(0, 0, 0, 0.12)"
              }}
            >
              {/* Enhanced background decoration */}
              <div className="absolute inset-0 opacity-40 dark:opacity-20 overflow-hidden pointer-events-none">
                <motion.div 
                  className={`absolute top-4 right-4 w-16 h-16 bg-gradient-to-br ${column.accent} rounded-full blur-xl`}
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.4, 0.7, 0.4]
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: columnIndex * 0.5
                  }}
                />
                <motion.div 
                  className={`absolute bottom-4 left-4 w-12 h-12 bg-gradient-to-tl ${column.accent} rounded-full blur-lg`}
                  animate={{
                    scale: [1, 0.8, 1.2, 1],
                    opacity: [0.3, 0.6, 0.3]
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: columnIndex * 0.7
                  }}
                />
              </div>

              {/* Enhanced Column Header */}
              <motion.div 
                className={`relative z-10 p-5 border-b ${column.borderColor} backdrop-blur-sm cursor-pointer transition-all duration-200 ${
                  isActive ? `${column.color} bg-white/30 dark:bg-black/20` : 'hover:bg-white/20 dark:hover:bg-white/5'
                }`}
                onClick={() => toggleColumn(column.id)}
                whileHover={{ 
                  backgroundColor: isActive 
                    ? 'rgba(255, 255, 255, 0.4)' 
                    : 'rgba(255, 255, 255, 0.15)',
                }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className={`h-8 w-8 p-0 rounded-xl transition-all duration-200 ${
                          isActive 
                            ? `hover:bg-white/30 dark:hover:bg-black/30 ${column.iconColor}` 
                            : 'hover:bg-white/20 dark:hover:bg-white/10'
                        }`}
                      >
                        <motion.div
                          animate={{ 
                            rotate: isActive ? 180 : 0,
                          }}
                          transition={{ 
                            duration: 0.3,
                            ease: [0.16, 1, 0.3, 1],
                          }}
                        >
                          <ChevronDown className="w-4 h-4" />
                        </motion.div>
                      </Button>
                    </motion.div>
                    
                    <motion.h3 
                      className={`transition-all duration-200 ${
                        isActive 
                          ? `${column.iconColor} scale-105` 
                          : 'text-foreground'
                      }`}
                      layout
                    >
                      {column.title}
                    </motion.h3>
                    
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={columnTasks.length}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ 
                          type: "spring",
                          stiffness: 400,
                          damping: 25
                        }}
                        whileHover={{ 
                          scale: 1.1,
                        }}
                      >
                        <Badge 
                          variant="secondary" 
                          className={`${column.badgeColor} text-xs px-2 py-1 rounded-full border-0 shadow-sm relative overflow-hidden`}
                        >
                          {/* Animated shimmer effect */}
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                            animate={{
                              x: ['-100%', '100%'],
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              ease: "linear",
                              repeatDelay: 3
                            }}
                          />
                          <span className="relative z-10">{columnTasks.length}</span>
                        </Badge>
                      </motion.div>
                    </AnimatePresence>
                  </div>

                  {/* Enhanced column action button */}
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onAddTask();
                    }}
                  >
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className={`h-8 w-8 p-0 rounded-xl transition-all duration-200 relative overflow-hidden ${
                        isActive 
                          ? `hover:bg-white/30 dark:hover:bg-black/30 ${column.iconColor}` 
                          : 'hover:bg-white/20 dark:hover:bg-white/10'
                      }`}
                    >
                      <motion.div
                        whileHover={{ rotate: 45, scale: 1.1 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Plus className="w-4 h-4" />
                      </motion.div>
                      {/* Click ripple */}
                      <motion.div
                        className="absolute inset-0 rounded-xl bg-white/30 scale-0"
                        whileTap={{
                          scale: [0, 1.5, 0],
                          opacity: [0, 0.3, 0]
                        }}
                        transition={{ duration: 0.4 }}
                      />
                    </Button>
                  </motion.div>
                </div>
              </motion.div>

              {/* Enhanced Tasks with improved collapse animation */}
              <AnimatePresence initial={false}>
                {isActive && (
                  <motion.div 
                    initial={{ 
                      opacity: 0, 
                      height: 0, 
                      scale: 0.98
                    }}
                    animate={{ 
                      opacity: 1, 
                      height: 'auto', 
                      scale: 1
                    }}
                    exit={{ 
                      opacity: 0, 
                      height: 0, 
                      scale: 0.98
                    }}
                    transition={{ 
                      duration: 0.4,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="relative z-10 overflow-hidden"
                  >
                    <div className="p-5 space-y-3">
                      {columnTasks.length === 0 ? (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-center py-8 text-muted-foreground"
                        >
                          <motion.div
                            animate={{
                              scale: [1, 1.05, 1],
                              opacity: [0.5, 0.8, 0.5]
                            }}
                            transition={{
                              duration: 3,
                              repeat: Infinity,
                              ease: "easeInOut"
                            }}
                            className={`text-3xl mb-2 ${column.iconColor}`}
                          >
                            {column.id === 'new' && '📝'}
                            {column.id === 'in-progress' && '⚡'}
                            {column.id === 'pending' && '⏳'}
                            {column.id === 'done' && '✅'}
                          </motion.div>
                          <p className="text-sm">{t('board.noTasksInColumn')}</p>
                        </motion.div>
                      ) : (
                        <AnimatePresence mode="popLayout">
                          {columnTasks.map((task, taskIndex) => (
                            <motion.div
                              key={task.id}
                              layout
                              initial={{ 
                                opacity: 0, 
                                y: 20, 
                                scale: 0.95
                              }}
                              animate={{ 
                                opacity: 1, 
                                y: 0, 
                                scale: 1
                              }}
                              exit={{ 
                                opacity: 0, 
                                y: -20, 
                                scale: 0.95,
                                transition: { 
                                  duration: 0.2
                                }
                              }}
                              transition={{ 
                                delay: taskIndex * 0.05, 
                                duration: 0.3,
                                ease: [0.16, 1, 0.3, 1],
                              }}
                              draggable
                              onDragStart={(e) => handleDragStart(e, task)}
                              className="bg-card/90 backdrop-blur-sm border border-border/60 rounded-2xl p-4 cursor-move transition-all duration-200 hover:shadow-lg hover:bg-card hover:border-border/80 group relative overflow-hidden hover:scale-[1.02]"
                              whileHover={{ 
                                y: -3,
                                boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.15)",
                                transition: { 
                                  duration: 0.2
                                }
                              }}
                              whileTap={{ scale: 0.98 }}
                              whileDrag={{ 
                                scale: 1.05,
                                rotate: 2,
                                zIndex: 50,
                                boxShadow: '0 20px 40px -8px rgba(0, 0, 0, 0.25)',
                                transition: { duration: 0.1 }
                              }}
                            >
                              {/* Card accent border */}
                              <motion.div
                                className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${column.accent} opacity-60`}
                              />

                              {/* Card glow effect */}
                              <motion.div
                                className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${column.accent} opacity-0 group-hover:opacity-100`}
                                transition={{ duration: 0.2 }}
                              />

                              <div className="flex items-start justify-between mb-3 relative z-10">
                                <motion.h4 
                                  className="text-sm leading-tight pr-2 group-hover:text-foreground transition-colors"
                                >
                                  {task.title}
                                </motion.h4>
                                <motion.div
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                >
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="h-6 w-6 p-0 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-primary/10"
                                  >
                                    <MoreVertical className="w-3 h-3" />
                                  </Button>
                                </motion.div>
                              </div>

                              {task.description && (
                                <motion.p 
                                  className="text-xs text-muted-foreground mb-3 line-clamp-2 relative z-10"
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  transition={{ delay: taskIndex * 0.02 }}
                                >
                                  {task.description}
                                </motion.p>
                              )}

                              <div className="flex items-center justify-between relative z-10">
                                <div className="flex items-center space-x-2">
                                  <motion.div
                                    whileHover={{ 
                                      scale: 1.2,
                                      rotate: [0, -10, 10, 0]
                                    }}
                                    transition={{ 
                                      scale: { type: "spring", stiffness: 400 },
                                      rotate: { duration: 0.5 }
                                    }}
                                  >
                                    <Flag className={`w-3 h-3 ${getPriorityColor(task.priority)}`} />
                                  </motion.div>
                                  <Calendar className="w-3 h-3 text-muted-foreground" />
                                  <span className="text-xs text-muted-foreground">
                                    {formatDate(task.dueDate)}
                                  </span>
                                </div>

                                {task.subtasks.length > 0 && (
                                  <motion.div 
                                    className="flex items-center space-x-1"
                                    whileHover={{ scale: 1.05 }}
                                  >
                                    <motion.div 
                                      className={`w-2 h-2 ${column.iconColor.replace('text-', 'bg-')} rounded-full`}
                                      animate={{
                                        scale: [1, 1.3, 1],
                                        opacity: [0.6, 1, 0.6]
                                      }}
                                      transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                        delay: taskIndex * 0.2,
                                        ease: "easeInOut"
                                      }}
                                    />
                                    <span className="text-xs text-muted-foreground">
                                      {task.subtasks.filter((s: any) => s.completed).length}/{task.subtasks.length}
                                    </span>
                                  </motion.div>
                                )}
                              </div>

                              {task.tags.length > 0 && (
                                <motion.div 
                                  className="flex flex-wrap gap-1 mt-3 relative z-10"
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  transition={{ delay: taskIndex * 0.02 + 0.1 }}
                                >
                                  {task.tags.slice(0, 2).map((tag: string, tagIndex: number) => (
                                    <motion.div
                                      key={tagIndex}
                                      initial={{ scale: 0 }}
                                      animate={{ scale: 1 }}
                                      whileHover={{ 
                                        scale: 1.05,
                                      }}
                                      transition={{ 
                                        delay: taskIndex * 0.02 + 0.1 + tagIndex * 0.02,
                                        type: "spring",
                                        stiffness: 400,
                                        damping: 25
                                      }}
                                    >
                                      <Badge 
                                        variant="outline" 
                                        className={`text-xs px-2 py-0.5 rounded-full bg-background/60 backdrop-blur-sm ${column.borderColor} hover:${column.badgeColor} transition-all duration-200`}
                                      >
                                        {tag}
                                      </Badge>
                                    </motion.div>
                                  ))}
                                  {task.tags.length > 2 && (
                                    <motion.div
                                      initial={{ scale: 0 }}
                                      animate={{ scale: 1 }}
                                      whileHover={{ scale: 1.05 }}
                                      transition={{ 
                                        delay: taskIndex * 0.02 + 0.2,
                                        type: "spring",
                                        stiffness: 400,
                                        damping: 25
                                      }}
                                    >
                                      <Badge 
                                        variant="outline" 
                                        className={`text-xs px-2 py-0.5 rounded-full bg-background/60 backdrop-blur-sm ${column.borderColor}`}
                                      >
                                        +{task.tags.length - 2}
                                      </Badge>
                                    </motion.div>
                                  )}
                                </motion.div>
                              )}
                            </motion.div>
                          ))}
                        </AnimatePresence>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
        </motion.div>
      ) : (
        // Calendar View
        <CalendarView />
      )}
    </div>
  );
}