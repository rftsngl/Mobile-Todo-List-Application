import React, { useState, useRef, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Switch } from './ui/switch';
import { Badge } from './ui/badge';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { motion, AnimatePresence } from 'motion/react';
import { useLocalization } from './LocalizationProvider';
import { 
  X, 
  Calendar as CalendarIcon, 
  Flag, 
  Tag, 
  Plus,
  Clock,
  Bell,
  Hash,
  Check,
  ChevronDown,
  Sparkles,
  Zap
} from 'lucide-react';

interface AddTaskModalProps {
  onClose: () => void;
  onSave: (task: any) => void;
}

export function AddTaskModal({ onClose, onSave }: AddTaskModalProps) {
  const { t } = useLocalization();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [subtasks, setSubtasks] = useState<string[]>([]);
  const [newSubtask, setNewSubtask] = useState('');
  const [reminder, setReminder] = useState(false);
  const [reminderTime, setReminderTime] = useState('09:00');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [smartSuggestions, setSmartSuggestions] = useState<string[]>([]);
  
  const titleInputRef = useRef<HTMLInputElement>(null);

  // Focus title input when modal opens
  useEffect(() => {
    const timer = setTimeout(() => {
      titleInputRef.current?.focus();
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  // Smart suggestions based on title
  useEffect(() => {
    if (title.length > 3) {
      const suggestions = generateSmartSuggestions(title);
      setSmartSuggestions(suggestions);
    } else {
      setSmartSuggestions([]);
    }
  }, [title]);

  // Component is ready to render

  const generateSmartSuggestions = (input: string): string[] => {
    const suggestions: string[] = [];
    const text = input.toLowerCase();
    
    // Date suggestions
    if (text.includes('meeting') || text.includes('call') || text.includes('appointment')) {
      suggestions.push(t('task.suggestion_calendar', 'Add to calendar'));
    }
    
    // Priority suggestions
    if (text.includes('urgent') || text.includes('asap') || text.includes('important')) {
      suggestions.push(t('task.suggestion_high_priority', 'Set high priority'));
    }
    
    // Tag suggestions
    if (text.includes('work') || text.includes('office')) {
      suggestions.push('#work');
    }
    if (text.includes('personal') || text.includes('home')) {
      suggestions.push('#personal');
    }
    if (text.includes('project')) {
      suggestions.push('#project');
    }
    
    return suggestions.slice(0, 3);
  };

  const parseNaturalLanguage = (input: string) => {
    const text = input.toLowerCase();
    
    // Parse dates
    if (text.includes(t('common.today').toLowerCase())) {
      setDueDate(new Date());
    } else if (text.includes(t('common.tomorrow').toLowerCase())) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      setDueDate(tomorrow);
    } else if (text.includes('week')) {
      const nextWeek = new Date();
      nextWeek.setDate(nextWeek.getDate() + 7);
      setDueDate(nextWeek);
    }

    // Parse priority
    if (text.includes('urgent') || text.includes('important') || text.includes('asap')) {
      setPriority('high');
    } else if (text.includes('low') || text.includes('maybe')) {
      setPriority('low');
    }

    // Parse time and set reminder
    const timeMatch = text.match(/(\d{1,2})[:\s]?(\d{0,2})\s*(am|pm)/i);
    if (timeMatch) {
      let hour = parseInt(timeMatch[1]);
      const minute = timeMatch[2] ? parseInt(timeMatch[2]) : 0;
      if (timeMatch[3].toLowerCase() === 'pm' && hour !== 12) hour += 12;
      if (timeMatch[3].toLowerCase() === 'am' && hour === 12) hour = 0;
      setReminderTime(`${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`);
      setReminder(true);
    }
  };

  const handleTitleChange = (value: string) => {
    setTitle(value);
    parseNaturalLanguage(value);
  };

  const applySuggestion = (suggestion: string) => {
    if (suggestion.startsWith('#')) {
      // Add as tag
      if (!tags.includes(suggestion.slice(1))) {
        setTags([...tags, suggestion.slice(1)]);
      }
    } else if (suggestion.includes('priority')) {
      setPriority('high');
    } else if (suggestion.includes('calendar')) {
      if (!dueDate) {
        setDueDate(new Date());
      }
      setReminder(true);
    }
    setSmartSuggestions([]);
  };

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const addSubtask = () => {
    if (newSubtask.trim()) {
      setSubtasks([...subtasks, newSubtask.trim()]);
      setNewSubtask('');
    }
  };

  const removeSubtask = (index: number) => {
    setSubtasks(subtasks.filter((_, i) => i !== index));
  };

  const getQuickDateOptions = () => [
    { 
      label: t('common.today'), 
      value: new Date(),
      icon: '📅'
    },
    { 
      label: t('common.tomorrow'), 
      value: (() => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        return tomorrow;
      })(),
      icon: '⏰'
    },
    { 
      label: t('task.next_week', 'Next week'), 
      value: (() => {
        const nextWeek = new Date();
        nextWeek.setDate(nextWeek.getDate() + 7);
        return nextWeek;
      })(),
      icon: '📆'
    }
  ];

  const getPriorityIcon = (priorityLevel: string) => {
    switch (priorityLevel) {
      case 'high': return { icon: Zap, color: 'text-red-500' };
      case 'medium': return { icon: Flag, color: 'text-amber-500' };
      case 'low': return { icon: Flag, color: 'text-green-500' };
      default: return { icon: Flag, color: 'text-muted-foreground' };
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) return;

    const newTask = {
      title: title.trim(),
      description: description.trim(),
      priority,
      dueDate: dueDate?.toISOString().split('T')[0] || new Date().toISOString().split('T')[0],
      tags,
      completed: false,
      subtasks: subtasks.map((task, index) => ({
        id: index + 1,
        title: task,
        completed: false
      })),
      reminder: reminder ? reminderTime : null,
      createdAt: new Date().toISOString()
    };

    onSave(newTask);
  };

  return (
    <div className="fixed inset-0 z-50">
      {/* Enhanced backdrop */}
      <motion.div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        onClick={onClose}
      />

      {/* Modal container */}
      <div className="relative z-10 flex items-end md:items-center justify-center min-h-screen p-4">
        <motion.div 
          className="w-full max-w-lg bg-card border border-border rounded-3xl md:rounded-2xl shadow-2xl overflow-visible"
          initial={{ 
            opacity: 0, 
            scale: 0.95,
            y: '20%'
          }}
          animate={{ 
            opacity: 1, 
            scale: 1,
            y: 0
          }}
          exit={{ 
            opacity: 0, 
            scale: 0.95,
            y: '20%'
          }}
          transition={{ 
            type: 'spring',
            stiffness: 400,
            damping: 30,
            mass: 0.8
          }}
        >
          {/* Header */}
          <motion.div 
            className="flex items-center justify-between p-6 pb-4 border-b border-border/50"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center space-x-3">
              <motion.div
                className="w-10 h-10 bg-primary/10 rounded-2xl flex items-center justify-center"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 500 }}
              >
                <Plus className="w-5 h-5 text-primary" />
              </motion.div>
              <div>
                <h2 className="text-xl text-foreground">{t('task.add_task')}</h2>
                <p className="text-sm text-muted-foreground">{t('task.create_new_task', 'Create a new task')}</p>
              </div>
            </div>
            
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onClose}
              className="h-10 w-10 rounded-xl hover:bg-muted transition-smooth touch-target"
            >
              <X className="w-5 h-5" />
            </Button>
          </motion.div>

          {/* Form */}
          <div className="max-h-[70vh] overflow-y-auto">
            <motion.form 
              onSubmit={handleSubmit} 
              className="p-6 space-y-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
            {/* Smart Title Input */}
            <div className="space-y-3">
              <Label htmlFor="title" className="text-sm text-muted-foreground">
                {t('task.title')} <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <Input
                  ref={titleInputRef}
                  id="title"
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder={t('task.title_placeholder', 'What needs to be done?')}
                  className="h-12 text-base pr-10 border-border/50 focus:border-primary/50 transition-smooth"
                />
                {title && (
                  <motion.div
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                  >
                    <Sparkles className="w-4 h-4 text-primary/60" />
                  </motion.div>
                )}
              </div>
              
              {/* Smart Suggestions */}
              <AnimatePresence>
                {smartSuggestions.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex flex-wrap gap-2 overflow-hidden"
                  >
                    {smartSuggestions.map((suggestion, index) => (
                      <motion.button
                        key={suggestion}
                        type="button"
                        onClick={() => applySuggestion(suggestion)}
                        className="px-3 py-1.5 bg-primary/10 text-primary text-xs rounded-full hover:bg-primary/20 transition-smooth flex items-center space-x-1"
                        initial={{ opacity: 0, scale: 0.8, x: -10 }}
                        animate={{ opacity: 1, scale: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <Sparkles className="w-3 h-3" />
                        <span>{suggestion}</span>
                      </motion.button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
              
              <p className="text-xs text-muted-foreground">
                {t('task.natural_language_hint', 'Try "Meeting tomorrow 3pm" or "Urgent: Review report"')}
              </p>
            </div>

            {/* Quick Actions Row */}
            <div className="flex items-center space-x-3">
              {/* Quick Date Selection */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-9 border-border/50 hover:border-primary/50 transition-smooth"
                  >
                    <CalendarIcon className="w-4 h-4 mr-2" />
                    {dueDate ? dueDate.toLocaleDateString('tr-TR', { 
                      month: 'short', 
                      day: 'numeric' 
                    }) : t('task.due_date')}
                    <ChevronDown className="w-3 h-3 ml-1 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-0 z-[60]" align="start">
                  <div className="p-4">
                    <div className="grid grid-cols-3 gap-2 mb-4">
                      {getQuickDateOptions().map((option) => (
                        <Button
                          key={option.label}
                          variant="outline"
                          size="sm"
                          onClick={() => setDueDate(option.value)}
                          className="h-16 flex-col space-y-1 hover:bg-primary/5 transition-smooth"
                        >
                          <span className="text-lg">{option.icon}</span>
                          <span className="text-xs">{option.label}</span>
                        </Button>
                      ))}
                    </div>
                    <Calendar
                      mode="single"
                      selected={dueDate}
                      onSelect={setDueDate}
                      initialFocus
                      className="w-full"
                    />
                  </div>
                </PopoverContent>
              </Popover>

              {/* Priority Quick Select */}
              <Select value={priority} onValueChange={setPriority}>
                <SelectTrigger className="h-9 w-auto border-border/50 hover:border-primary/50 transition-smooth">
                  <div className="flex items-center space-x-2">
                    {(() => {
                      const { icon: Icon, color } = getPriorityIcon(priority);
                      return <Icon className={`w-4 h-4 ${color}`} />;
                    })()}
                    <span className="capitalize">{t(`common.priority.${priority}`)}</span>
                  </div>
                </SelectTrigger>
                <SelectContent className="z-[60]">
                  {['high', 'medium', 'low'].map((level) => {
                    const { icon: Icon, color } = getPriorityIcon(level);
                    return (
                      <SelectItem key={level} value={level}>
                        <div className="flex items-center space-x-2">
                          <Icon className={`w-4 h-4 ${color}`} />
                          <span className="capitalize">{t(`common.priority.${level}`)}</span>
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>

              {/* Reminder Toggle */}
              <Button
                type="button"
                variant={reminder ? "default" : "outline"}
                size="sm"
                onClick={() => setReminder(!reminder)}
                className="h-9 border-border/50 hover:border-primary/50 transition-smooth"
              >
                <Bell className="w-4 h-4 mr-2" />
                {reminder ? t('task.reminder_on', 'On') : t('task.reminder_off', 'Off')}
              </Button>
            </div>

            {/* Reminder Time */}
            <AnimatePresence>
              {reminder && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-center space-x-3 overflow-hidden"
                >
                  <Clock className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  <Input
                    type="time"
                    value={reminderTime}
                    onChange={(e) => setReminderTime(e.target.value)}
                    className="h-9 flex-1 border-border/50 focus:border-primary/50"
                  />
                  <span className="text-sm text-muted-foreground">{t('task.reminder_time', 'Reminder')}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Advanced Options Toggle */}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="w-full h-9 text-muted-foreground hover:text-foreground transition-smooth"
            >
              <ChevronDown className={`w-4 h-4 mr-2 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
              {showAdvanced ? t('task.hide_advanced', 'Hide advanced') : t('task.show_advanced', 'Show advanced')}
            </Button>

            {/* Advanced Options */}
            <AnimatePresence>
              {showAdvanced && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-6 overflow-hidden border-t border-border/50 pt-6"
                >
                  {/* Description */}
                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-sm text-muted-foreground">
                      {t('task.description')} {t('common.optional', '(optional)')}
                    </Label>
                    <Textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder={t('task.description_placeholder', 'Add more details...')}
                      rows={3}
                      className="resize-none border-border/50 focus:border-primary/50 transition-smooth"
                    />
                  </div>

                  {/* Tags */}
                  <div className="space-y-3">
                    <Label className="text-sm text-muted-foreground">
                      {t('task.tags', 'Tags')}
                    </Label>
                    <div className="flex space-x-2">
                      <div className="relative flex-1">
                        <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          value={newTag}
                          onChange={(e) => setNewTag(e.target.value)}
                          placeholder={t('task.add_tag', 'Add tag...')}
                          className="pl-10 h-9 border-border/50 focus:border-primary/50"
                          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                        />
                      </div>
                      <Button 
                        type="button" 
                        onClick={addTag} 
                        size="sm"
                        className="h-9 px-3"
                        disabled={!newTag.trim()}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    <AnimatePresence>
                      {tags.length > 0 && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="flex flex-wrap gap-2 overflow-hidden"
                        >
                          {tags.map((tag, index) => (
                            <motion.div
                              key={tag}
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.8 }}
                              transition={{ delay: index * 0.03 }}
                            >
                              <Badge 
                                variant="secondary" 
                                className="px-2 py-1 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 transition-smooth group cursor-pointer"
                                onClick={() => removeTag(tag)}
                              >
                                <Hash className="w-3 h-3 mr-1" />
                                {tag}
                                <X className="w-3 h-3 ml-2 opacity-50 group-hover:opacity-100 transition-opacity" />
                              </Badge>
                            </motion.div>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Subtasks */}
                  <div className="space-y-3">
                    <Label className="text-sm text-muted-foreground">
                      {t('task.subtasks')}
                    </Label>
                    <div className="flex space-x-2">
                      <Input
                        value={newSubtask}
                        onChange={(e) => setNewSubtask(e.target.value)}
                        placeholder={t('task.add_subtask')}
                        className="flex-1 h-9 border-border/50 focus:border-primary/50"
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSubtask())}
                      />
                      <Button 
                        type="button" 
                        onClick={addSubtask} 
                        size="sm"
                        className="h-9 px-3"
                        disabled={!newSubtask.trim()}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    <AnimatePresence>
                      {subtasks.length > 0 && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="space-y-2 overflow-hidden"
                        >
                          {subtasks.map((subtask, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: -20 }}
                              transition={{ delay: index * 0.05 }}
                              className="flex items-center justify-between p-3 bg-muted/50 rounded-xl border border-border/30"
                            >
                              <div className="flex items-center space-x-3">
                                <div className="w-4 h-4 rounded-full border-2 border-muted-foreground/30" />
                                <span className="text-sm">{subtask}</span>
                              </div>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeSubtask(index)}
                                className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive transition-smooth"
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </motion.div>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            </motion.form>
          </div>

          {/* Footer Actions */}
          <motion.div 
            className="flex items-center space-x-3 p-6 pt-4 border-t border-border/50 bg-muted/20"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 h-11 border-border/50 hover:border-border transition-smooth"
            >
              {t('common.cancel')}
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!title.trim()}
              className="flex-1 h-11 transition-smooth hover:scale-[1.02] disabled:opacity-50 disabled:scale-100"
            >
              <Check className="w-4 h-4 mr-2" />
              {t('task.create_task', 'Create Task')}
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}