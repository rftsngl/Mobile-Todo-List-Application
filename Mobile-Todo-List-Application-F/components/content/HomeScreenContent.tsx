import React, { useState, useMemo, forwardRef, useImperativeHandle } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TaskCard } from '../TaskCard';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { 
  Plus, 
  Search, 
  Filter, 
  Calendar as CalendarIcon, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  X 
} from 'lucide-react';
import { TaskCardMoreMenu, type Task } from '../shared/TaskCardMoreMenu';
import { toast } from 'sonner@2.0.3';

interface HomeScreenContentProps {
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
  onNavigate: (screen: string) => void;
  onAddTask: () => void;
  onViewTask: (task: Task) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  searchQuery: string;
  onScrollToTop?: React.MutableRefObject<{ scrollToTop: () => void } | null>;
}

export interface HomeScreenContentRef {
  scrollToTop: () => void;
}

export const HomeScreenContent = forwardRef<HomeScreenContentRef, HomeScreenContentProps>(
  ({ tasks, setTasks, onNavigate, onAddTask, onViewTask, activeTab, setActiveTab, searchQuery }, ref) => {
    const [localSearchQuery, setLocalSearchQuery] = useState('');
    const [showSearch, setShowSearch] = useState(false);

    useImperativeHandle(ref, () => ({
      scrollToTop: () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }));

    // Task management handlers
    const handleToggleTask = (taskId: number) => {
      setTasks(tasks.map(task => 
        task.id === taskId 
          ? { ...task, completed: !task.completed }
          : task
      ));
    };

    const handleDeleteTask = (taskId: number) => {
      setTasks(tasks.filter(task => task.id !== taskId));
    };

    const handleArchiveTask = (taskId: number) => {
      // For now, just remove from list (could add archived flag in real implementation)
      setTasks(tasks.filter(task => task.id !== taskId));
    };

    const handleEditTask = (task: Task) => {
      // Navigate to task detail in edit mode
      onViewTask(task);
    };

    const handleShareTask = (task: Task) => {
      // Custom share logic could go here
      // Default behavior (copy link) is handled by TaskCardMoreMenu
    };

    // Filter tasks based on active tab and search
    const filteredTasks = useMemo(() => {
      let filtered = tasks;

      // Apply search filter
      const query = localSearchQuery || searchQuery;
      if (query.trim()) {
        const lowercaseQuery = query.toLowerCase();
        filtered = filtered.filter(task =>
          task.title.toLowerCase().includes(lowercaseQuery) ||
          task.description?.toLowerCase().includes(lowercaseQuery) ||
          task.category?.toLowerCase().includes(lowercaseQuery)
        );
      }

      // Apply tab filter
      const today = new Date().toISOString().split('T')[0];
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowStr = tomorrow.toISOString().split('T')[0];

      switch (activeTab) {
        case 'today':
          return filtered.filter(task => 
            !task.completed && task.dueDate <= today
          );
        case 'upcoming':
          return filtered.filter(task => 
            !task.completed && task.dueDate > today
          );
        case 'overdue':
          return filtered.filter(task => 
            !task.completed && task.dueDate < today
          );
        case 'completed':
          return filtered.filter(task => task.completed);
        default:
          return filtered;
      }
    }, [tasks, activeTab, localSearchQuery, searchQuery]);

    // Calculate tab counts
    const tabCounts = useMemo(() => {
      const today = new Date().toISOString().split('T')[0];
      return {
        today: tasks.filter(task => !task.completed && task.dueDate <= today).length,
        upcoming: tasks.filter(task => !task.completed && task.dueDate > today).length,
        overdue: tasks.filter(task => !task.completed && task.dueDate < today).length,
        completed: tasks.filter(task => task.completed).length
      };
    }, [tasks]);

    const tabs = [
      { 
        id: 'today', 
        label: 'Today', 
        icon: CalendarIcon, 
        count: tabCounts.today,
        color: 'text-primary'
      },
      { 
        id: 'upcoming', 
        label: 'Upcoming', 
        icon: Clock, 
        count: tabCounts.upcoming,
        color: 'text-blue-600'
      },
      { 
        id: 'overdue', 
        label: 'Overdue', 
        icon: AlertTriangle, 
        count: tabCounts.overdue,
        color: 'text-destructive'
      },
      { 
        id: 'completed', 
        label: 'Completed', 
        icon: CheckCircle2, 
        count: tabCounts.completed,
        color: 'text-success'
      }
    ];

    const getEmptyStateMessage = (tab: string) => {
      switch (tab) {
        case 'today':
          return {
            title: 'No tasks for today',
            description: 'You\'re all caught up! Add a new task or check upcoming items.',
            action: 'Add Task'
          };
        case 'upcoming':
          return {
            title: 'No upcoming tasks',
            description: 'Great! You don\'t have any future tasks scheduled.',
            action: 'Add Task'
          };
        case 'overdue':
          return {
            title: 'No overdue tasks',
            description: 'Excellent! You\'re staying on top of your deadlines.',
            action: null
          };
        case 'completed':
          return {
            title: 'No completed tasks',
            description: 'Complete some tasks to see them here.',
            action: null
          };
        default:
          return {
            title: 'No tasks found',
            description: 'Try adjusting your search or filters.',
            action: 'Add Task'
          };
      }
    };

    return (
      <div className="space-y-4">
        {/* Header Section */}
        <div className="space-y-4">
          {/* Search Bar */}
          <AnimatePresence>
            {showSearch && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="relative"
              >
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search tasks..."
                  value={localSearchQuery}
                  onChange={(e) => setLocalSearchQuery(e.target.value)}
                  className="pl-10 pr-10"
                  autoFocus
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setShowSearch(false);
                    setLocalSearchQuery('');
                  }}
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8"
                >
                  <X className="w-4 h-4" />
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Action Bar */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowSearch(!showSearch)}
                className={showSearch ? 'bg-muted' : ''}
              >
                <Search className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <Filter className="w-4 h-4" />
              </Button>
            </div>
            
            <Button onClick={onAddTask} size="sm" className="gap-2">
              <Plus className="w-4 h-4" />
              Add Task
            </Button>
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-1 p-1 bg-muted rounded-lg overflow-x-auto">
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    relative flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium 
                    transition-all duration-200 whitespace-nowrap
                    ${isActive 
                      ? 'bg-background text-foreground shadow-sm' 
                      : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
                    }
                  `}
                >
                  <IconComponent className={`w-4 h-4 ${isActive ? tab.color : ''}`} />
                  <span>{tab.label}</span>
                  {tab.count > 0 && (
                    <Badge 
                      variant={isActive ? "default" : "secondary"} 
                      className="h-5 px-1.5 text-xs"
                    >
                      {tab.count}
                    </Badge>
                  )}
                  
                  {/* Active indicator */}
                  {isActive && (
                    <motion.div
                      layoutId="activeTabIndicator"
                      className="absolute inset-0 bg-background rounded-md shadow-sm -z-10"
                      initial={false}
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 30
                      }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Task List */}
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {filteredTasks.length === 0 ? (
              /* Empty State */
              <motion.div
                key="empty-state"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-center py-12"
              >
                <div className="space-y-3">
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                    {(() => {
                      const emptyState = getEmptyStateMessage(activeTab);
                      const tab = tabs.find(t => t.id === activeTab);
                      const IconComponent = tab?.icon || CalendarIcon;
                      return <IconComponent className="w-8 h-8 text-muted-foreground" />;
                    })()}
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground mb-1">
                      {getEmptyStateMessage(activeTab).title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {getEmptyStateMessage(activeTab).description}
                    </p>
                    {getEmptyStateMessage(activeTab).action && (
                      <Button onClick={onAddTask} variant="outline" size="sm">
                        <Plus className="w-4 h-4 mr-2" />
                        {getEmptyStateMessage(activeTab).action}
                      </Button>
                    )}
                  </div>
                </div>
              </motion.div>
            ) : (
              /* Task Cards */
              filteredTasks.map((task, index) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onClick={() => onViewTask(task)}
                  onView={onViewTask}
                  onEdit={handleEditTask}
                  onToggle={handleToggleTask}
                  onDelete={handleDeleteTask}
                  onArchive={handleArchiveTask}
                  onShare={handleShareTask}
                  showMoreMenu={true}
                />
              ))
            )}
          </AnimatePresence>
        </div>
      </div>
    );
  }
);

HomeScreenContent.displayName = 'HomeScreenContent';