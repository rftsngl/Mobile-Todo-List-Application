import React from 'react';
import { Button } from './ui/button';

import { Avatar, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';
import { useTheme } from './ThemeProvider';
import { BottomNavigation } from './BottomNavigation';
import { 
  ArrowLeft, 
  User, 
  Bell, 
  Settings, 
  HelpCircle, 
  Shield, 
  Smartphone, 
  Moon, 
  Sun, 
  Monitor,
  ChevronRight,
  Star,
  Award,
  Calendar,
  CheckSquare
} from 'lucide-react';

interface ProfileScreenProps {
  onNavigate: (screen: string) => void;
}

export function ProfileScreen({ onNavigate }: ProfileScreenProps) {
  const { theme, setTheme, actualTheme } = useTheme();

  const stats = [
    { label: 'Tasks Completed', value: 47, icon: CheckSquare, color: 'text-green-500' },
    { label: 'Days Active', value: 12, icon: Calendar, color: 'text-blue-500' },
    { label: 'Current Streak', value: 5, icon: Star, color: 'text-yellow-500' },
    { label: 'Achievement', value: 'Productivity Pro', icon: Award, color: 'text-purple-500' }
  ];

  const menuSections = [
    {
      title: 'Account',
      items: [
        { icon: User, label: 'Personal Information', action: () => onNavigate('personal-info') },
        { icon: Bell, label: 'Notifications', action: () => onNavigate('notifications') },
        { icon: Shield, label: 'Privacy & Security', action: () => onNavigate('privacy-security') }
      ]
    },
    {
      title: 'Preferences',
      items: [
        { icon: Settings, label: 'App Settings', action: () => onNavigate('app-settings') },
        { icon: HelpCircle, label: 'Help & Support', action: () => onNavigate('help-support') }
      ]
    }
  ];

  const themeOptions = [
    { value: 'light', label: 'Light', icon: Sun },
    { value: 'dark', label: 'Dark', icon: Moon },
    { value: 'system', label: 'System', icon: Monitor }
  ];

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <div className="h-14 bg-card border-b border-border flex items-center justify-between px-4">
        <Button variant="ghost" size="sm" onClick={() => onNavigate('home')}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        
        <h1 className="text-lg">Profile</h1>
        
        <div className="w-10" /> {/* Spacer */}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Profile Header */}
        <div className="bg-gradient-to-b from-primary/10 to-background p-6 text-center">
          <Avatar className="w-20 h-20 mx-auto mb-4">
            <AvatarFallback className="text-xl">YO</AvatarFallback>
          </Avatar>
          
          <h2 className="text-xl mb-1">You</h2>
          <p className="text-muted-foreground mb-4">your.email@example.com</p>
          
          <Badge variant="secondary" className="px-3 py-1">
            <Award className="w-3 h-3 mr-1" />
            Pro User
          </Badge>
        </div>

        {/* Stats Grid */}
        <div className="p-6">
          <h3 className="text-sm text-muted-foreground mb-4">Your Stats</h3>
          <div className="grid grid-cols-2 gap-4">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div key={index} className="bg-card border border-border rounded-xl p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <IconComponent className={`w-4 h-4 ${stat.color}`} />
                    <span className="text-xs text-muted-foreground">{stat.label}</span>
                  </div>
                  <div className="text-xl">{stat.value}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Theme Selection */}
        <div className="px-6 pb-6">
          <h3 className="text-sm text-muted-foreground mb-4">Appearance</h3>
          <div className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm">Theme</span>
              <div className="flex items-center space-x-1 bg-muted rounded-lg p-1">
                {themeOptions.map((option) => {
                  const IconComponent = option.icon;
                  return (
                    <button
                      key={option.value}
                      onClick={() => setTheme(option.value as any)}
                      className={`flex items-center space-x-1 px-2 py-1 rounded text-xs transition-colors ${
                        theme === option.value
                          ? 'bg-background shadow-sm'
                          : 'hover:bg-background/50'
                      }`}
                    >
                      <IconComponent className="w-3 h-3" />
                      <span>{option.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Menu Sections */}
        <div className="px-6 space-y-6">
          {menuSections.map((section, sectionIndex) => (
            <div key={sectionIndex}>
              <h3 className="text-sm text-muted-foreground mb-4">{section.title}</h3>
              <div className="bg-card border border-border rounded-xl overflow-hidden">
                {section.items.map((item, itemIndex) => {
                  const IconComponent = item.icon;
                  return (
                    <button
                      key={itemIndex}
                      onClick={item.action}
                      className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors border-b border-border last:border-b-0"
                    >
                      <div className="flex items-center space-x-3">
                        <IconComponent className="w-5 h-5 text-muted-foreground" />
                        <span className="text-sm">{item.label}</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>



        {/* Sign Out */}
        <div className="p-6 pb-24">
          <Button variant="outline" className="w-full" onClick={() => onNavigate('welcome')}>
            Sign Out
          </Button>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation
        activeScreen="profile"
        onNavigate={onNavigate}
      />
    </div>
  );
}