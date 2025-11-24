import React, { useState } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { 
  ArrowLeft, 
  HelpCircle, 
  MessageCircle, 
  Mail, 
  Phone, 
  FileText, 
  Book, 
  Video, 
  Users, 
  Bug, 
  Star, 
  ExternalLink, 
  Search,
  ChevronRight,
  Clock,
  CheckCircle,
  AlertCircle,
  Info,
  Lightbulb,
  Settings,
  Shield,
  Smartphone,
  Download,
  Globe,
  MessageSquare,
  Send
} from 'lucide-react';

interface HelpSupportScreenProps {
  onNavigate: (screen: string) => void;
}

export function HelpSupportScreen({ onNavigate }: HelpSupportScreenProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const faqCategories = [
    { id: 'all', label: 'All Topics', icon: HelpCircle },
    { id: 'getting-started', label: 'Getting Started', icon: Lightbulb },
    { id: 'tasks', label: 'Tasks & Projects', icon: CheckCircle },
    { id: 'account', label: 'Account & Settings', icon: Settings },
    { id: 'sync', label: 'Sync & Backup', icon: Download },
    { id: 'troubleshooting', label: 'Troubleshooting', icon: AlertCircle }
  ];

  const faqs = [
    {
      id: 1,
      category: 'getting-started',
      question: 'How do I create my first task?',
      answer: 'To create a task, tap the "+" button on the home screen, fill in the task details like title, description, due date, and priority, then tap "Create Task".'
    },
    {
      id: 2,
      category: 'getting-started',
      question: 'How do I organize tasks into projects?',
      answer: 'You can create projects by grouping related tasks together. Use tags or create custom categories to organize your tasks by project.'
    },
    {
      id: 3,
      category: 'tasks',
      question: 'How do I set task priorities?',
      answer: 'When creating or editing a task, you can set the priority level as High, Medium, or Low. High priority tasks appear at the top of your list.'
    },
    {
      id: 4,
      category: 'tasks',
      question: 'Can I add subtasks to a main task?',
      answer: 'Yes! Open any task and tap "Add Subtask" to break down complex tasks into smaller, manageable steps.'
    },
    {
      id: 5,
      category: 'account',
      question: 'How do I change my notification settings?',
      answer: 'Go to Profile > App Settings > Notification Settings to customize when and how you receive notifications.'
    },
    {
      id: 6,
      category: 'account',
      question: 'How do I enable dark mode?',
      answer: 'In your Profile screen, find the Appearance section and select "Dark" theme, or choose "System" to match your device settings.'
    },
    {
      id: 7,
      category: 'sync',
      question: 'Why aren\'t my tasks syncing across devices?',
      answer: 'Make sure you\'re signed in to the same account on all devices and have auto-sync enabled in App Settings > Data & Sync.'
    },
    {
      id: 8,
      category: 'sync',
      question: 'How do I backup my data?',
      answer: 'Go to App Settings > Backup & Export to enable automatic backups or manually export your data.'
    },
    {
      id: 9,
      category: 'troubleshooting',
      question: 'The app is running slowly. What should I do?',
      answer: 'Try clearing the app cache in App Settings > Storage > Clear Cache. Also ensure you have the latest app version installed.'
    },
    {
      id: 10,
      category: 'troubleshooting',
      question: 'I forgot my password. How do I reset it?',
      answer: 'On the sign-in screen, tap "Forgot Password" and follow the instructions sent to your email address.'
    }
  ];

  const quickActions = [
    {
      icon: MessageCircle,
      title: 'Live Chat',
      description: 'Get instant help from our support team',
      action: () => {},
      badge: 'Online',
      badgeColor: 'bg-green-500'
    },
    {
      icon: Mail,
      title: 'Email Support',
      description: 'Send us a detailed message',
      action: () => {},
      badge: '24h response',
      badgeColor: 'bg-blue-500'
    },
    {
      icon: Bug,
      title: 'Report a Bug',
      description: 'Help us improve the app',
      action: () => {},
      badge: null,
      badgeColor: null
    },
    {
      icon: Star,
      title: 'Send Feedback',
      description: 'Share your thoughts and suggestions',
      action: () => {},
      badge: null,
      badgeColor: null
    }
  ];

  const resources = [
    {
      icon: Book,
      title: 'User Guide',
      description: 'Complete guide to using the app',
      action: () => {},
      external: true
    },
    {
      icon: Video,
      title: 'Video Tutorials',
      description: 'Step-by-step video guides',
      action: () => {},
      external: true
    },
    {
      icon: Users,
      title: 'Community Forum',
      description: 'Connect with other users',
      action: () => {},
      external: true
    },
    {
      icon: FileText,
      title: 'What\'s New',
      description: 'Latest updates and features',
      action: () => {},
      external: false
    }
  ];

  const filteredFaqs = selectedCategory === 'all' 
    ? faqs 
    : faqs.filter(faq => faq.category === selectedCategory);

  const searchedFaqs = searchQuery 
    ? filteredFaqs.filter(faq => 
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : filteredFaqs;

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <div className="h-14 bg-card border-b border-border flex items-center justify-between px-4">
        <Button variant="ghost" size="sm" onClick={() => onNavigate('profile')}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        
        <h1 className="text-lg">Help & Support</h1>
        
        <Button variant="ghost" size="sm">
          <Search className="w-5 h-5" />
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Support Status */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h3 className="text-sm">Support Status</h3>
              <p className="text-xs text-muted-foreground">All systems operational</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4 text-xs">
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-muted-foreground">Live Chat: Online</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="w-3 h-3 text-muted-foreground" />
              <span className="text-muted-foreground">Avg. response: 2 min</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="p-4 border-b border-border">
          <h3 className="text-sm mb-4 flex items-center">
            <Lightbulb className="w-4 h-4 text-muted-foreground mr-2" />
            Get Help Quickly
          </h3>
          
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map((action, index) => {
              const IconComponent = action.icon;
              return (
                <Button
                  key={index}
                  variant="outline"
                  className="h-auto p-3 flex flex-col items-start space-y-2"
                  onClick={action.action}
                >
                  <div className="flex items-center justify-between w-full">
                    <IconComponent className="w-4 h-4 text-muted-foreground" />
                    {action.badge && (
                      <Badge className={`text-xs px-1.5 py-0.5 ${action.badgeColor} text-white`}>
                        {action.badge}
                      </Badge>
                    )}
                  </div>
                  <div className="text-left">
                    <p className="text-xs">{action.title}</p>
                    <p className="text-xs text-muted-foreground">{action.description}</p>
                  </div>
                </Button>
              );
            })}
          </div>
        </div>

        {/* FAQ Categories */}
        <div className="p-4 border-b border-border">
          <h3 className="text-sm mb-4 flex items-center">
            <HelpCircle className="w-4 h-4 text-muted-foreground mr-2" />
            Frequently Asked Questions
          </h3>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {faqCategories.map((category) => {
              const IconComponent = category.icon;
              return (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                  className="h-8 text-xs"
                >
                  <IconComponent className="w-3 h-3 mr-1" />
                  {category.label}
                </Button>
              );
            })}
          </div>
          
          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search frequently asked questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-muted rounded-lg text-sm border border-border focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          
          {/* FAQ Accordion */}
          <Accordion type="single" collapsible className="space-y-2">
            {searchedFaqs.map((faq) => (
              <AccordionItem key={faq.id} value={faq.id.toString()} className="border border-border rounded-lg px-3">
                <AccordionTrigger className="text-xs py-3 hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-xs text-muted-foreground pb-3">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
          
          {searchedFaqs.length === 0 && (
            <div className="text-center py-6">
              <Info className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">No FAQs found matching your search.</p>
              <p className="text-xs text-muted-foreground mt-1">Try adjusting your search terms or contact support.</p>
            </div>
          )}
        </div>

        {/* Resources */}
        <div className="p-4 border-b border-border">
          <h3 className="text-sm mb-4 flex items-center">
            <Book className="w-4 h-4 text-muted-foreground mr-2" />
            Learning Resources
          </h3>
          
          <div className="space-y-3">
            {resources.map((resource, index) => {
              const IconComponent = resource.icon;
              return (
                <Button
                  key={index}
                  variant="outline"
                  className="w-full justify-between h-12"
                  onClick={resource.action}
                >
                  <div className="flex items-center space-x-3">
                    <IconComponent className="w-4 h-4 text-muted-foreground" />
                    <div className="text-left">
                      <p className="text-sm">{resource.title}</p>
                      <p className="text-xs text-muted-foreground">{resource.description}</p>
                    </div>
                  </div>
                  {resource.external ? (
                    <ExternalLink className="w-4 h-4 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  )}
                </Button>
              );
            })}
          </div>
        </div>

        {/* Contact Information */}
        <div className="p-4 border-b border-border">
          <h3 className="text-sm mb-4 flex items-center">
            <MessageSquare className="w-4 h-4 text-muted-foreground mr-2" />
            Contact Information
          </h3>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-sm">Email Support</p>
                  <p className="text-xs text-muted-foreground">support@todoapp.com</p>
                </div>
              </div>
              <Button variant="ghost" size="sm">
                <Send className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Globe className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-sm">Help Center</p>
                  <p className="text-xs text-muted-foreground">help.todoapp.com</p>
                </div>
              </div>
              <Button variant="ghost" size="sm">
                <ExternalLink className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Users className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-sm">Community</p>
                  <p className="text-xs text-muted-foreground">community.todoapp.com</p>
                </div>
              </div>
              <Button variant="ghost" size="sm">
                <ExternalLink className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* App Information */}
        <div className="p-4">
          <h3 className="text-sm mb-4 flex items-center">
            <Info className="w-4 h-4 text-muted-foreground mr-2" />
            App Information
          </h3>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">App Version</span>
              <span>2.1.4</span>
            </div>
            
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Build Number</span>
              <span>2024.08.08</span>
            </div>
            
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Last Updated</span>
              <span>August 5, 2024</span>
            </div>
            
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Platform</span>
              <span>Web App</span>
            </div>
          </div>
          
          <div className="mt-6 p-3 bg-muted/50 rounded-lg">
            <div className="flex items-start space-x-2">
              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs">
                  <strong>You're up to date!</strong> You have the latest version of the app with all 
                  the newest features and security improvements.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}