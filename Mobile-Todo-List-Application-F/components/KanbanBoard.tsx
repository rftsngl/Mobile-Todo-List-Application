import React, { useState } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { BottomNavigation } from './BottomNavigation';
import { useLocalization } from './LocalizationProvider';
import { motion } from 'motion/react';
import { 
  ArrowLeft, 
  Plus, 
  MoreVertical, 
  Flag, 
  Calendar,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface KanbanBoardProps {
  tasks: any[];
  setTasks: (tasks: any[]) => void;
  onNavigate: (screen: string) => void;
  onAddTask: () => void;
}

export function KanbanBoard({ tasks, setTasks, onNavigate, onAddTask }: KanbanBoardProps) {
  const { t } = useLocalization();
  const [draggedTask, setDraggedTask] = useState<any>(null);
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);
  const [collapsedColumns, setCollapsedColumns] = useState<{ [key: string]: boolean }>({
    'new': true,
    'in-progress': true,
    'pending': true,
    'done': true
  });

  const columns = [
    { id: 'new', title: t('kanban.new'), color: 'bg-blue-100 text-blue-700' },
    { id: 'in-progress', title: t('kanban.inProgress'), color: 'bg-yellow-100 text-yellow-700' },
    { id: 'pending', title: t('kanban.pending'), color: 'bg-purple-100 text-purple-700' },
    { id: 'done', title: t('kanban.done'), color: 'bg-green-100 text-green-700' }
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
      case 'high': return 'text-red-500';
      case 'medium': return 'text-yellow-500';
      case 'low': return 'text-green-500';
      default: return 'text-muted-foreground';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
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

  const toggleColumn = (columnId: string) => {
    setCollapsedColumns(prev => ({
      ...prev,
      [columnId]: !prev[columnId]
    }));
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <div className="h-14 bg-card border-b border-border flex items-center justify-between px-4">
        <Button variant="ghost" size="sm" onClick={() => onNavigate('home')}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        
        <h1 className="text-lg">{t('kanban.title')}</h1>
        
        <div></div>
      </div>

      {/* Kanban Board - Vertical Layout */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {columns.map((column) => {
          const columnTasks = getTasksByStatus(column.id);
          const isCollapsed = collapsedColumns[column.id];
          
          return (
            <div
              key={column.id}
              className={`bg-muted/30 rounded-2xl flex flex-col transition-colors ${
                dragOverColumn === column.id ? 'bg-primary/10 border-2 border-primary border-dashed' : ''
              }`}
              onDragOver={(e) => handleDragOver(e, column.id)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, column.id)}
            >
              {/* Column Header */}
              <div className="p-4 border-b border-border">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-6 w-6 p-0"
                      onClick={() => toggleColumn(column.id)}
                    >
                      {isCollapsed ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronUp className="w-4 h-4" />
                      )}
                    </Button>
                    <h3 className="text-sm">{column.title}</h3>
                    <Badge variant="secondary" className={`${column.color} text-xs`}>
                      {columnTasks.length}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Tasks - Collapsible */}
              {!isCollapsed && (
                <motion.div 
                  className="flex-1 p-4 space-y-3"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                >
                  {columnTasks.map((task, index) => (
                    <motion.div
                      key={task.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, task)}
                      className="bg-card border border-border rounded-xl p-4 cursor-move hover-lift transition-smooth"
                      initial={{ opacity: 0, y: 20, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ 
                        delay: index * 0.05, 
                        duration: 0.3,
                        ease: [0.16, 1, 0.3, 1]
                      }}
                      whileHover={{ scale: 1.02 }}
                      whileDrag={{ 
                        scale: 1.05,
                        rotate: 5,
                        zIndex: 10,
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
                      }}
                      layout
                    >
                      <div className="flex items-start justify-between mb-3">
                        <h4 className="text-sm leading-tight pr-2">{task.title}</h4>
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                          <MoreVertical className="w-3 h-3" />
                        </Button>
                      </div>

                      {task.description && (
                        <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                          {task.description}
                        </p>
                      )}

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Flag className={`w-3 h-3 ${getPriorityColor(task.priority)}`} />
                          <Calendar className="w-3 h-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">
                            {formatDate(task.dueDate)}
                          </span>
                        </div>

                        {task.subtasks.length > 0 && (
                          <div className="flex items-center space-x-1">
                            <div className="w-2 h-2 bg-primary rounded-full"></div>
                            <span className="text-xs text-muted-foreground">
                              {task.subtasks.filter((s: any) => s.completed).length}/{task.subtasks.length}
                            </span>
                          </div>
                        )}
                      </div>

                      {task.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-3">
                          {task.tags.slice(0, 2).map((tag: string, index: number) => (
                            <Badge key={index} variant="outline" className="text-xs px-1 py-0">
                              {tag}
                            </Badge>
                          ))}
                          {task.tags.length > 2 && (
                            <Badge variant="outline" className="text-xs px-1 py-0">
                              +{task.tags.length - 2}
                            </Badge>
                          )}
                        </div>
                      )}
                    </motion.div>
                  ))}

                  {/* Add Task Button - Inside Column */}
                  <Button 
                    variant="outline" 
                    className="w-full h-12 rounded-xl border-dashed"
                    onClick={onAddTask}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    {t('kanban.addTask')}
                  </Button>

                  {columnTasks.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-2">
                        <Plus className="w-6 h-6" />
                      </div>
                      <p className="text-xs">{t('kanban.noTasks')}</p>
                    </div>
                  )}
                </motion.div>
              )}
            </div>
          );
        })}
      </div>

      {/* Floating Add Column Button */}
      <div className="fixed bottom-20 right-4 z-10">
        <Button 
          className="w-12 h-12 rounded-full shadow-lg"
          onClick={() => {
            // Add column functionality can be implemented here
            console.log('Add new column');
          }}
        >
          <Plus className="w-5 h-5" />
        </Button>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation
        activeScreen="kanban"
        onNavigate={onNavigate}
      />
    </div>
  );
}