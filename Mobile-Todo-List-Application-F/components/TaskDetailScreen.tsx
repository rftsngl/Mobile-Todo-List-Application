import React, { useState } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Progress } from './ui/progress';
import { Avatar, AvatarFallback } from './ui/avatar';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  Flag, 
  Calendar, 
  Tag, 
  User, 
  MessageCircle, 
  Paperclip,
  Check,
  Plus,
  Edit3,
  Clock,
  Bell,
  Trash2,
  MoreVertical,
  Save,
  X
} from 'lucide-react';

interface TaskDetailScreenProps {
  task: any;
  onBack: () => void;
  onUpdate: (task: any) => void;
}

export function TaskDetailScreen({ task, onBack, onUpdate }: TaskDetailScreenProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState(task ? { ...task } : null);
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState([
    {
      id: 1,
      author: 'John Doe',
      avatar: 'JD',
      content: 'This looks great! Can we add more details to the mockups section?',
      timestamp: '2 hours ago'
    },
    {
      id: 2,
      author: 'Jane Smith',
      avatar: 'JS',
      content: 'I have uploaded the wireframes to the shared folder.',
      timestamp: '5 hours ago'
    }
  ]);

  const completedSubtasks = task?.subtasks ? task.subtasks.filter((sub: any) => sub.completed).length : 0;
  const totalSubtasks = task?.subtasks ? task.subtasks.length : 0;
  const progress = totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0;

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
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const toggleSubtask = (subtaskId: number) => {
    if (!task?.subtasks) return;
    const updatedSubtasks = task.subtasks.map((sub: any) =>
      sub.id === subtaskId ? { ...sub, completed: !sub.completed } : sub
    );
    const updatedTask = { ...task, subtasks: updatedSubtasks };
    onUpdate(updatedTask);
  };

  const saveChanges = () => {
    if (editedTask) {
      onUpdate(editedTask);
      setIsEditing(false);
    }
  };

  const addComment = () => {
    if (newComment.trim()) {
      const comment = {
        id: Date.now(),
        author: 'You',
        avatar: 'YO',
        content: newComment.trim(),
        timestamp: 'Just now'
      };
      setComments([comment, ...comments]);
      setNewComment('');
    }
  };

  if (!task) {
    return (
      <div className="flex flex-col h-screen bg-background items-center justify-center">
        <p className="text-muted-foreground">Task not found</p>
        <Button onClick={onBack} className="mt-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>
      </div>
    );
  }

  return (
    <motion.div 
      className="flex flex-col h-screen bg-gradient-to-br from-background via-background to-muted/20 relative overflow-hidden"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{
        duration: 0.4,
        ease: [0.16, 1, 0.3, 1]
      }}
    >
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 right-10 w-32 h-32 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-40 left-10 w-24 h-24 bg-gradient-to-tl from-secondary/20 to-transparent rounded-full blur-2xl" />
      </div>

      {/* Enhanced Header */}
      <motion.div 
        className="relative h-14 bg-card/80 backdrop-blur-xl border-b border-border/50 flex items-center justify-between px-4 z-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.5,
          ease: [0.16, 1, 0.3, 1]
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-card/90 via-card/95 to-card/90" />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.8, x: -20 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{
            duration: 0.4,
            delay: 0.1,
            ease: [0.16, 1, 0.3, 1]
          }}
          className="relative z-10"
        >
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onBack}
            className="hover:bg-primary/10 hover:scale-105 transition-all duration-300 rounded-xl"
          >
            <motion.div
              whileHover={{ x: -5 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            >
              <ArrowLeft className="w-5 h-5" />
            </motion.div>
          </Button>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.4,
            delay: 0.2,
            ease: [0.16, 1, 0.3, 1]
          }}
          className="relative z-10"
        >
          <h1 className="text-lg bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent truncate max-w-48">
            Task Details
          </h1>
        </motion.div>
        
        <motion.div 
          className="flex items-center space-x-2 relative z-10"
          initial={{ opacity: 0, scale: 0.8, x: 20 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{
            duration: 0.4,
            delay: 0.3,
            ease: [0.16, 1, 0.3, 1]
          }}
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsEditing(!isEditing)}
              className={`transition-all duration-300 rounded-xl ${
                isEditing 
                  ? 'bg-primary/10 text-primary shadow-lg' 
                  : 'hover:bg-primary/5 hover:scale-105'
              }`}
            >
              <motion.div
                animate={{ 
                  rotate: isEditing ? 180 : 0,
                  scale: isEditing ? 1.1 : 1
                }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              >
                {isEditing ? <X className="w-5 h-5" /> : <Edit3 className="w-5 h-5" />}
              </motion.div>
            </Button>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant="ghost"
              size="sm"
              className="hover:bg-destructive/10 hover:text-destructive transition-all duration-300 rounded-xl"
            >
              <MoreVertical className="w-5 h-5" />
            </Button>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Enhanced Content */}
      <motion.div 
        className="flex-1 overflow-y-auto relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.5,
          delay: 0.4,
          ease: [0.16, 1, 0.3, 1]
        }}
      >
        <div className="p-6 space-y-6">
          {/* Title and Completion */}
          <motion.div 
            className="flex items-start space-x-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ 
              duration: 0.4,
              delay: 0.5,
              ease: [0.16, 1, 0.3, 1]
            }}
          >
            <motion.button
              onClick={() => onUpdate({ ...task, completed: !task.completed })}
              className={`w-7 h-7 rounded-xl border-2 flex items-center justify-center mt-1 transition-all duration-300 ${
                task.completed
                  ? 'bg-primary border-primary shadow-lg scale-105'
                  : 'border-muted-foreground hover:border-primary hover:scale-105 hover:shadow-md'
              }`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <AnimatePresence>
                {task.completed && (
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0, rotate: 180 }}
                    transition={{ 
                      duration: 0.3,
                      ease: [0.16, 1, 0.3, 1]
                    }}
                  >
                    <Check className="w-4 h-4 text-primary-foreground" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>

            <div className="flex-1">
              <AnimatePresence mode="wait">
                {isEditing ? (
                  <motion.div
                    key="editing"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Input
                      value={editedTask?.title || ''}
                      onChange={(e) => setEditedTask(editedTask ? { ...editedTask, title: e.target.value } : null)}
                      className="text-xl border-2 border-primary/30 focus:border-primary/50 bg-background/50 backdrop-blur-sm rounded-xl px-4 py-2 transition-all duration-300"
                      autoFocus
                    />
                  </motion.div>
                ) : (
                  <motion.h1 
                    key="display"
                    className={`text-xl leading-tight transition-all duration-300 ${
                      task.completed ? 'line-through text-muted-foreground' : ''
                    }`}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                  >
                    {task.title}
                  </motion.h1>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Enhanced Description */}
          <motion.div 
            className="space-y-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.4,
              delay: 0.6,
              ease: [0.16, 1, 0.3, 1]
            }}
          >
            <h3 className="text-sm text-muted-foreground">Description</h3>
            
            <AnimatePresence mode="wait">
              {isEditing ? (
                <motion.div
                  key="editing-desc"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  <Textarea
                    value={editedTask?.description || ''}
                    onChange={(e) => setEditedTask(editedTask ? { ...editedTask, description: e.target.value } : null)}
                    placeholder="Add description..."
                    rows={4}
                    className="border-2 border-primary/30 focus:border-primary/50 bg-background/50 backdrop-blur-sm rounded-xl resize-none transition-all duration-300"
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="display-desc"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-4 transition-all duration-300 hover:bg-card/70 hover:border-border/70"
                >
                  <p className="text-muted-foreground leading-relaxed">
                    {task.description || (
                      <span className="italic text-muted-foreground/60">
                        No description provided.
                      </span>
                    )}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Details Grid */}
          <motion.div 
            className="grid grid-cols-2 gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.4,
              delay: 0.7,
              ease: [0.16, 1, 0.3, 1]
            }}
          >
            {/* Due Date */}
            <motion.div 
              className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-4 space-y-3 transition-all duration-300 hover:bg-card/70 hover:border-border/70 hover:shadow-lg group"
              whileHover={{ 
                scale: 1.02,
                y: -2,
                transition: { duration: 0.2 }
              }}
            >
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4 text-blue-500" />
                <span>Due Date</span>
              </div>
              <p className="text-sm group-hover:text-foreground transition-colors">
                {formatDate(task.dueDate)}
              </p>
            </motion.div>

            {/* Priority */}
            <motion.div 
              className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-4 space-y-3 transition-all duration-300 hover:bg-card/70 hover:border-border/70 hover:shadow-lg group"
              whileHover={{ 
                scale: 1.02,
                y: -2,
                transition: { duration: 0.2 }
              }}
            >
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Flag className={`w-4 h-4 ${getPriorityColor(task.priority)}`} />
                <span>Priority</span>
              </div>
              <p className={`text-sm capitalize ${getPriorityColor(task.priority)} font-medium`}>
                {task.priority}
              </p>
            </motion.div>

            {/* Tags */}
            <motion.div 
              className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-4 space-y-3 transition-all duration-300 hover:bg-card/70 hover:border-border/70 hover:shadow-lg group"
              whileHover={{ 
                scale: 1.02,
                y: -2,
                transition: { duration: 0.2 }
              }}
            >
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Tag className="w-4 h-4 text-green-500" />
                <span>Tags</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {task.tags?.map((tag: string, index: number) => (
                  <Badge 
                    key={index}
                    variant="secondary" 
                    className="text-xs bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-colors cursor-pointer"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </motion.div>

            {/* Assignee */}
            <motion.div 
              className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-4 space-y-3 transition-all duration-300 hover:bg-card/70 hover:border-border/70 hover:shadow-lg group"
              whileHover={{ 
                scale: 1.02,
                y: -2,
                transition: { duration: 0.2 }
              }}
            >
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <User className="w-4 h-4 text-purple-500" />
                <span>Assignee</span>
              </div>
              <div className="flex items-center space-x-3">
                <Avatar className="w-8 h-8 border-2 border-primary/20">
                  <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 text-primary">
                    YO
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm group-hover:text-foreground transition-colors">You</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Progress */}
          {totalSubtasks > 0 && (
            <motion.div 
              className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-4 space-y-4 transition-all duration-300 hover:bg-card/70 hover:border-border/70"
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ 
                duration: 0.4,
                delay: 1,
                ease: [0.16, 1, 0.3, 1]
              }}
            >
              <div className="flex items-center justify-between">
                <h3 className="text-sm text-muted-foreground">Progress</h3>
                <span className="text-sm text-muted-foreground bg-muted/50 px-2 py-1 rounded-lg">
                  {completedSubtasks}/{totalSubtasks} completed
                </span>
              </div>
              <Progress value={progress} className="h-3 bg-muted/50 rounded-full overflow-hidden" />
            </motion.div>
          )}

          {/* Subtasks */}
          {task.subtasks && task.subtasks.length > 0 && (
            <motion.div 
              className="space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.4,
                delay: 1.1,
                ease: [0.16, 1, 0.3, 1]
              }}
            >
              <h3 className="text-sm text-muted-foreground">Subtasks</h3>
              <div className="space-y-3">
                {task.subtasks.map((subtask: any, index: number) => (
                  <motion.div 
                    key={subtask.id}
                    className="flex items-center space-x-4 p-4 bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl transition-all duration-300 hover:bg-card/70 hover:border-border/70 hover:shadow-lg group"
                    initial={{ opacity: 0, x: -20, scale: 0.95 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    transition={{ 
                      duration: 0.3,
                      delay: 1.3 + index * 0.1,
                      ease: [0.16, 1, 0.3, 1]
                    }}
                    whileHover={{ 
                      scale: 1.01,
                      y: -2,
                      transition: { duration: 0.2 }
                    }}
                  >
                    <motion.button
                      onClick={() => toggleSubtask(subtask.id)}
                      className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-300 ${
                        subtask.completed
                          ? 'bg-primary border-primary shadow-lg scale-105'
                          : 'border-muted-foreground hover:border-primary hover:scale-105 hover:shadow-md'
                      }`}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <AnimatePresence>
                        {subtask.completed && (
                          <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            exit={{ scale: 0, rotate: 180 }}
                            transition={{ 
                              duration: 0.3,
                              ease: [0.16, 1, 0.3, 1]
                            }}
                          >
                            <Check className="w-3 h-3 text-primary-foreground" />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.button>
                    
                    <span className={`flex-1 transition-all duration-300 ${
                      subtask.completed ? 'line-through text-muted-foreground' : 'group-hover:text-foreground'
                    }`}>
                      {subtask.title}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Comments Section */}
          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.4,
              delay: 1.4,
              ease: [0.16, 1, 0.3, 1]
            }}
          >
            <h3 className="text-sm text-muted-foreground">Comments</h3>
            
            {/* Comment Input */}
            <div className="flex space-x-4 p-4 bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl transition-all duration-300 hover:bg-card/70 hover:border-border/70">
              <Avatar className="w-10 h-10 border-2 border-primary/20">
                <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 text-primary">
                  YO
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 space-y-3">
                <Input
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment..."
                  className="bg-background/50 backdrop-blur-sm border-2 border-border/50 focus:border-primary/50 rounded-xl transition-all duration-300"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      addComment();
                    }
                  }}
                />
                
                <AnimatePresence>
                  {newComment.trim() && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.8, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="flex justify-end"
                    >
                      <Button 
                        size="sm" 
                        onClick={addComment}
                        className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl"
                      >
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Post Comment
                      </Button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Comments List */}
            <div className="space-y-4">
              {comments.map((comment, index) => (
                <motion.div 
                  key={comment.id}
                  className="flex space-x-4 p-4 bg-card/30 backdrop-blur-sm border border-border/30 rounded-xl transition-all duration-300 hover:bg-card/50 hover:border-border/50 group"
                  initial={{ opacity: 0, x: -20, scale: 0.95 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  transition={{ 
                    duration: 0.3,
                    delay: 1.7 + index * 0.1,
                    ease: [0.16, 1, 0.3, 1]
                  }}
                >
                  <Avatar className="w-10 h-10 border-2 border-border/30 group-hover:border-border/50 transition-all duration-300">
                    <AvatarFallback className="bg-gradient-to-br from-muted to-muted/70 text-muted-foreground">
                      {comment.avatar}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center space-x-3">
                      <span className="text-sm font-medium group-hover:text-foreground transition-colors">
                        {comment.author}
                      </span>
                      <span className="text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded-lg">
                        {comment.timestamp}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed group-hover:text-muted-foreground/80 transition-colors">
                      {comment.content}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Enhanced Action Buttons */}
      <motion.div 
        className="relative p-4 bg-card/80 backdrop-blur-xl border-t border-border/50 z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.5,
          delay: 1.8,
          ease: [0.16, 1, 0.3, 1]
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-card/95 via-card/90 to-card/80" />
        
        <AnimatePresence mode="wait">
          {isEditing ? (
            <motion.div 
              key="editing-actions"
              className="flex space-x-3 relative z-10"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
            >
              <Button
                variant="outline"
                onClick={() => {
                  setEditedTask(task ? { ...task } : null);
                  setIsEditing(false);
                }}
                className="flex-1 border-2 border-border/50 hover:border-destructive/50 hover:bg-destructive/5 hover:text-destructive transition-all duration-300 rounded-xl"
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              
              <Button
                onClick={saveChanges}
                className="flex-1 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </motion.div>
          ) : (
            <motion.div 
              key="normal-actions"
              className="flex space-x-3 relative z-10"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
            >
              <Button
                variant="outline"
                className="flex-1 border-2 border-border/50 hover:border-border/80 hover:bg-card/80 hover:shadow-lg transition-all duration-300 rounded-xl group"
              >
                <Paperclip className="w-4 h-4 mr-2 text-blue-500 group-hover:text-blue-600" />
                Attach File
              </Button>
              
              <Button
                variant="outline"
                className="flex-1 border-2 border-border/50 hover:border-border/80 hover:bg-card/80 hover:shadow-lg transition-all duration-300 rounded-xl group"
              >
                <Bell className="w-4 h-4 mr-2 text-yellow-500 group-hover:text-yellow-600" />
                Set Reminder
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}