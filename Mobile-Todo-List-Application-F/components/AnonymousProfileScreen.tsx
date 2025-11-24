import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Separator } from './ui/separator';
import { Badge } from './ui/badge';
import { Switch } from './ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { motion } from 'motion/react';
import {
  User,
  UserPlus,
  LogIn,
  Settings,
  Moon,
  Sun,
  Globe,
  Bell,
  Shield,
  HelpCircle,
  Star,
  ArrowRight,
  Heart,
  Coffee,
  Crown,
  Palette,
  Monitor,
  Activity,
  Volume2,
  VolumeOff
} from 'lucide-react';
import { useTheme } from './ThemeProvider';
import { useLocalization } from './LocalizationProvider';
import { useSession } from './SessionProvider';

interface AnonymousProfileScreenProps {
  onNavigate: (screen: string) => void;
}

export function AnonymousProfileScreen({ onNavigate }: AnonymousProfileScreenProps) {
  const { t, language, setLanguage } = useLocalization();
  const { theme, setTheme } = useTheme();
  const { session, isGuestUser } = useSession();
  
  // App settings state
  const [appSettings, setAppSettings] = useState({
    notifications: true,
    soundEnabled: true,
    animationsEnabled: true,
    language: language
  });

  const isDarkMode = theme === 'dark';

  const handleSettingChange = (key: string, value: boolean | string) => {
    setAppSettings(prev => ({ ...prev, [key]: value }));
    
    // Handle language change
    if (key === 'language' && typeof value === 'string') {
      setLanguage(value);
    }
  };

  const handleSignUp = () => {
    // Clear current guest session before going to auth
    if (isGuestUser) {
      // We'll implement this through navigation callback
      onNavigate('clear-session-and-signup');
    } else {
      onNavigate('auth-selection');
    }
  };

  const handleSignIn = () => {
    // Clear current guest session before going to auth
    if (isGuestUser) {
      // We'll implement this through navigation callback
      onNavigate('clear-session-and-signin');
    } else {
      onNavigate('auth-selection');
    }
  };

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <motion.div 
        className="px-6 py-6 border-b border-border/60"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-muted to-muted/60 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-muted-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-medium">Guest User</h1>
                <div className="flex items-center space-x-2 mt-1">
                  <Badge variant="secondary" className="text-xs px-2 py-0.5">
                    Anonymous Mode
                  </Badge>
                  <Badge variant="outline" className="text-xs px-2 py-0.5 border-green-500/20 text-green-600 dark:text-green-400">
                    Local Storage
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        
        {/* Sign Up/Sign In Promotion */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
        >
          <Card className="p-6 bg-gradient-to-br from-primary/5 via-primary/3 to-transparent border-primary/20">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <Crown className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1 space-y-4">
                <div>
                  <h3 className="font-medium text-primary mb-2">Unlock Full Experience</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Create an account to sync your tasks across devices, collaborate with teams, and access premium features.
                  </p>
                </div>
                <div className="flex space-x-3">
                  <Button
                    onClick={handleSignUp}
                    size="sm"
                    className="flex-1 h-9 bg-primary hover:bg-primary/90"
                  >
                    <UserPlus className="w-4 h-4 mr-2" />
                    Sign Up Free
                  </Button>
                  <Button
                    onClick={handleSignIn}
                    variant="outline"
                    size="sm"
                    className="flex-1 h-9 border-primary/30 hover:bg-primary/5"
                  >
                    <LogIn className="w-4 h-4 mr-2" />
                    Sign In
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <Card className="p-6">
            <h3 className="font-medium mb-4 flex items-center">
              <Settings className="w-5 h-5 mr-2 text-muted-foreground" />
              Settings
            </h3>
            
            <div className="space-y-6">
              {/* Theme Settings */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Palette className="w-4 h-4 text-muted-foreground" />
                  <h4 className="text-sm font-medium">Appearance</h4>
                </div>
                
                {/* Theme Toggle */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {isDarkMode ? (
                      <Moon className="w-5 h-5 text-muted-foreground" />
                    ) : (
                      <Sun className="w-5 h-5 text-muted-foreground" />
                    )}
                    <div>
                      <p className="text-sm font-medium">Dark Mode</p>
                      <p className="text-xs text-muted-foreground">Toggle theme appearance</p>
                    </div>
                  </div>
                  <Switch
                    checked={isDarkMode}
                    onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
                  />
                </div>
                
                {/* System Theme Option */}
                <Button 
                  variant="outline" 
                  size="sm"
                  className="w-full justify-start h-10"
                  onClick={() => setTheme('system')}
                >
                  <Monitor className="w-4 h-4 mr-2" />
                  <span className="text-sm">Follow System Theme</span>
                </Button>
              </div>

              <Separator />

              {/* Language Settings */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Globe className="w-4 h-4 text-muted-foreground" />
                  <h4 className="text-sm font-medium">Language</h4>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm">App Language</p>
                  <Select 
                    value={appSettings.language} 
                    onValueChange={(value) => handleSettingChange('language', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="tr">Türkçe</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator />

              {/* App Behavior */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Activity className="w-4 h-4 text-muted-foreground" />
                  <h4 className="text-sm font-medium">App Behavior</h4>
                </div>
                
                {/* Notifications */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Bell className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Browser Notifications</p>
                      <p className="text-xs text-muted-foreground">Get notified about important updates</p>
                    </div>
                  </div>
                  <Switch
                    checked={appSettings.notifications}
                    onCheckedChange={(checked) => handleSettingChange('notifications', checked)}
                  />
                </div>

                {/* Sound Settings */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {appSettings.soundEnabled ? (
                      <Volume2 className="w-5 h-5 text-muted-foreground" />
                    ) : (
                      <VolumeOff className="w-5 h-5 text-muted-foreground" />
                    )}
                    <div>
                      <p className="text-sm font-medium">Sound Effects</p>
                      <p className="text-xs text-muted-foreground">Enable notification sounds and UI feedback</p>
                    </div>
                  </div>
                  <Switch
                    checked={appSettings.soundEnabled}
                    onCheckedChange={(checked) => handleSettingChange('soundEnabled', checked)}
                  />
                </div>

                {/* Animations */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-5 h-5 flex items-center justify-center">
                      <motion.div
                        className="w-3 h-3 bg-muted-foreground rounded-full"
                        animate={appSettings.animationsEnabled ? {
                          scale: [1, 1.2, 1],
                          opacity: [1, 0.7, 1]
                        } : {}}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Animations</p>
                      <p className="text-xs text-muted-foreground">Enable smooth transitions and effects</p>
                    </div>
                  </div>
                  <Switch
                    checked={appSettings.animationsEnabled}
                    onCheckedChange={(checked) => handleSettingChange('animationsEnabled', checked)}
                  />
                </div>
              </div>

              <Separator />

              {/* Additional Options */}
              <div className="space-y-3">
                <Button 
                  variant="ghost" 
                  className="w-full justify-start h-12"
                  onClick={() => onNavigate('help-support')}
                >
                  <HelpCircle className="w-4 h-4 mr-3 text-muted-foreground" />
                  <div className="text-left">
                    <div className="text-sm">Help & Support</div>
                    <div className="text-xs text-muted-foreground">Get help and send feedback</div>
                  </div>
                  <ArrowRight className="w-4 h-4 ml-auto opacity-50" />
                </Button>

                <Button 
                  variant="ghost" 
                  className="w-full justify-start h-12"
                  onClick={() => onNavigate('privacy-security')}
                >
                  <Shield className="w-4 h-4 mr-3 text-muted-foreground" />
                  <div className="text-left">
                    <div className="text-sm">Privacy & Security</div>
                    <div className="text-xs text-muted-foreground">Learn about data handling</div>
                  </div>
                  <ArrowRight className="w-4 h-4 ml-auto opacity-50" />
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Support the App */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
        >
          <Card className="p-6 bg-gradient-to-br from-orange-50 via-orange-25 to-transparent dark:from-orange-950/20 dark:via-orange-950/10 dark:to-transparent border-orange-200/50 dark:border-orange-500/20">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-950/50 rounded-xl flex items-center justify-center flex-shrink-0">
                <Heart className="w-6 h-6 text-orange-500" />
              </div>
              <div className="flex-1 space-y-3">
                <div>
                  <h3 className="font-medium text-orange-900 dark:text-orange-100 mb-2">Enjoying TaskFlow?</h3>
                  <p className="text-sm text-orange-700 dark:text-orange-200 leading-relaxed">
                    Consider rating the app or supporting its development. Your feedback helps us improve!
                  </p>
                </div>
                <div className="flex space-x-3">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-9 border-orange-300 text-orange-700 hover:bg-orange-50 dark:border-orange-600 dark:text-orange-300 dark:hover:bg-orange-950/30"
                    disabled
                  >
                    <Star className="w-4 h-4 mr-2" />
                    Rate App
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-9 border-orange-300 text-orange-700 hover:bg-orange-50 dark:border-orange-600 dark:text-orange-300 dark:hover:bg-orange-950/30"
                    disabled
                  >
                    <Coffee className="w-4 h-4 mr-2" />
                    Buy Coffee
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* App Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
          className="text-center py-4"
        >
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">TaskFlow v1.0.0</p>
            <p className="text-xs text-muted-foreground">
              Running in anonymous mode • Data stored locally
            </p>
          </div>
        </motion.div>
      </div>

      {/* Bottom Safe Area */}
      <div className="h-4" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }} />
    </div>
  );
}