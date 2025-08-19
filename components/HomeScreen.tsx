import React, { useState } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { TaskCard } from './TaskCard';
import { BottomNavigation } from './BottomNavigation';
import { NotificationSidePanel } from './NotificationSidePanel';
import { useLocalization } from './LocalizationProvider';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Menu, 
  Plus, 
  Filter,
  Calendar as CalendarIcon,
  LayoutGrid,
  CheckSquare
} from 'lucide-react';

interface HomeScreenProps {
  tasks: any[];
  setTasks: (tasks: any[]) => void;
  onNavigate: (screen: string) => void;
  onAddTask: () => void;
  onViewTask: (task: any) => void;
}

export function HomeScreen({ tasks, setTasks, onNavigate, onAddTask, onViewTask }: HomeScreenProps) {
  const { t } = useLocalization();
  const [activeTab, setActiveTab] = useState('today');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  const today = new Date().toISOString().split('T')[0];
  const overdueTasks = tasks.filter(task => !task.completed && task.dueDate < today);
  const todayTasks = tasks.filter(task => task.dueDate === today);
  const upcomingTasks = tasks.filter(task => task.dueDate > today);
  const completedTasks = tasks.filter(task => task.completed);

  const getFilteredTasks = () => {
    let filteredTasks = [];
    switch (activeTab) {
      case 'today':
        filteredTasks = [...overdueTasks, ...todayTasks];
        break;
      case 'upcoming':
        filteredTasks = upcomingTasks;
        break;
      case 'completed':
        filteredTasks = completedTasks;
        break;
      default:
        filteredTasks = tasks;
    }

    if (searchQuery) {
      filteredTasks = filteredTasks.filter(task =>
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filteredTasks;
  };

  const toggleTask = (taskId: number) => {
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (taskId: number) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <div className="h-14 bg-card border-b border-border flex items-center justify-between px-4">
        <Button variant="ghost" size="sm" onClick={() => onNavigate('profile')}>
          <Menu className="w-6 h-6" />
        </Button>
        
        <h1 className="text-lg">TaskFlow</h1>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowSearch(!showSearch)}
            className="transition-smooth hover-scale"
          >
            <Search className="w-5 h-5" />
          </Button>
          <NotificationSidePanel 
            overdueTasks={overdueTasks}
            onNavigateToNotifications={() => onNavigate('notifications')}
          />
        </div>
      </div>

      {/* Search Bar */}
      <AnimatePresence>
        {showSearch && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="border-b border-border bg-card overflow-hidden"
          >
            <div className="p-4">
              <Input
                placeholder={t('home.search')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full transition-smooth"
                autoFocus
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>



      {/* Status Tabs */}
      <div className="flex overflow-x-auto px-4 py-3 space-x-2 bg-card border-b border-border">
        {[
          { key: 'today', label: t('home.today'), count: overdueTasks.length + todayTasks.length },
          { key: 'upcoming', label: t('home.upcoming'), count: upcomingTasks.length },
          { key: 'completed', label: t('home.completed'), count: completedTasks.length }
        ].map((tab) => (
          <Button
            key={tab.key}
            variant={activeTab === tab.key ? 'default' : 'outline'}
            size="sm"
            className="whitespace-nowrap rounded-full min-w-20"
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
            {tab.count > 0 && (
              <Badge variant="secondary" className="ml-2 h-5 min-w-5 text-xs">
                {tab.count}
              </Badge>
            )}
          </Button>
        ))}
      </div>

      {/* Task List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        <AnimatePresence>
          {getFilteredTasks().map((task, index) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: -20, scale: 0.95 }}
              transition={{
                duration: 0.3,
                delay: index * 0.05,
                ease: [0.16, 1, 0.3, 1]
              }}
              layout
            >
              <TaskCard
                task={task}
                onToggle={() => toggleTask(task.id)}
                onDelete={() => deleteTask(task.id)}
                onView={() => {
                  onViewTask(task);
                  onNavigate('task-detail');
                }}
              />
            </motion.div>
          ))}
        </AnimatePresence>
        
        {getFilteredTasks().length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-center py-12 space-y-4"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.4, delay: 0.4, ease: [0.68, -0.55, 0.265, 1.55] }}
              className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto"
            >
              <CheckSquare className="w-8 h-8 text-muted-foreground" />
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.6 }}
            >
              <h3 className="text-lg text-muted-foreground">{t('home.noTasks')}</h3>
              <p className="text-muted-foreground">
                {activeTab === 'today' 
                  ? t('home.allCaughtUp')
                  : activeTab === 'completed'
                  ? t('home.completeTasksToSee')
                  : t('home.createFirst')
                }
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <Button onClick={onAddTask} className="mt-4 transition-smooth hover-lift">
                <Plus className="w-4 h-4 mr-2" />
                {t('home.addTask')}
              </Button>
            </motion.div>
          </motion.div>
        )}
      </div>

      {/* FAB */}
      <motion.button
        onClick={onAddTask}
        className="fixed bottom-20 right-6 w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-lg flex items-center justify-center z-10"
        whileHover={{ 
          scale: 1.1,
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
        }}
        whileTap={{ scale: 0.95 }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          type: 'spring',
          stiffness: 500,
          damping: 30,
          delay: 0.5
        }}
      >
        <motion.div
          whileHover={{ rotate: 90 }}
          transition={{ duration: 0.2 }}
        >
          <Plus className="w-6 h-6" />
        </motion.div>
      </motion.button>

      {/* Bottom Navigation */}
      <BottomNavigation
        activeScreen="home"
        onNavigate={onNavigate}
      />
    </div>
  );
}