import React, { useState, useEffect } from 'react';
import { useLocalization } from './LocalizationProvider';
import { useTheme } from './ThemeProvider';
import { Button } from './ui/button';
import { Switch } from './ui/switch';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Slider } from './ui/slider';
import { 
  ArrowLeft, 
  Settings, 
  Bell, 
  Smartphone, 
  Globe, 
  Download, 
  Upload, 
  Database, 
  Wifi, 
  WifiOff, 
  Volume2, 
  VolumeOff, 
  Clock, 
  Calendar, 
  Moon, 
  Sun, 
  Monitor, 
  Zap, 
  Lock, 
  Shield, 
  Info, 
  RefreshCw,
  ChevronRight,
  Trash2,
  HardDrive,
  Activity,
  Battery,
  Palette
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AppSettingsScreenProps {
  onNavigate: (screen: string) => void;
}

export function AppSettingsScreen({ onNavigate }: AppSettingsScreenProps) {
  const { language, setLanguage, t } = useLocalization();
  const { theme, setTheme } = useTheme();
  
  const [settings, setSettings] = useState({
    // Notification Settings
    pushNotifications: true,
    emailNotifications: false,
    taskReminders: true,
    deadlineAlerts: true,
    collaborationNotifications: true,
    soundEnabled: true,
    vibrationEnabled: true,
    notificationSound: 'default',
    quietHours: false,
    quietStart: '22:00',
    quietEnd: '08:00',
    
    // App Preferences
    language: language,
    dateFormat: 'dd/mm/yyyy',
    timeFormat: '24h',
    startScreen: 'home',
    defaultView: 'list',
    autoSync: true,
    offlineMode: true,
    lowDataMode: false,
    
    // Performance
    animationsEnabled: true,
    backgroundRefresh: true,
    cacheSize: 50,
    autoBackup: true,
    backupFrequency: 'daily'
  });

  const [storageInfo] = useState({
    totalSpace: '128 GB',
    usedSpace: '2.4 GB',
    appSize: '45 MB',
    cacheSize: '12 MB',
    documentsSize: '1.2 GB'
  });

  const handleSettingChange = (key: string, value: boolean | string | number) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    
    // Handle language change
    if (key === 'language' && typeof value === 'string') {
      setLanguage(value);
    }
  };

  // Sync language with localization context
  useEffect(() => {
    setSettings(prev => ({ ...prev, language }));
  }, [language]);

  const languageOptions = [
    { value: 'en', label: 'English' },
    { value: 'tr', label: 'Türkçe' }
  ];

  const soundOptions = [
    { value: 'default', label: 'Default' },
    { value: 'subtle', label: 'Subtle' },
    { value: 'alert', label: 'Alert' },
    { value: 'chime', label: 'Chime' },
    { value: 'none', label: 'None' }
  ];

  const themeOptions = [
    { value: 'light', label: 'Light', icon: Sun, description: 'Light theme for better visibility' },
    { value: 'dark', label: 'Dark', icon: Moon, description: 'Dark theme for reduced eye strain' },
    { value: 'system', label: 'System', icon: Monitor, description: 'Follow system preference' }
  ];

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <div className="h-14 bg-card border-b border-border flex items-center justify-between px-4">
        <Button variant="ghost" size="sm" onClick={() => onNavigate('profile')}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        
        <h1 className="text-lg">{t('settings.title')}</h1>
        
        <Button variant="ghost" size="sm">
          <Settings className="w-5 h-5" />
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Notification Settings */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center space-x-2 mb-4">
            <Bell className="w-4 h-4 text-muted-foreground" />
            <h3 className="text-sm">{t('settings.notifications')}</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm">{t('settings.pushNotifications')}</p>
                <p className="text-xs text-muted-foreground">{t('desc.pushNotifications')}</p>
              </div>
              <Switch 
                checked={settings.pushNotifications}
                onCheckedChange={(checked) => handleSettingChange('pushNotifications', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm">{t('settings.emailNotifications')}</p>
                <p className="text-xs text-muted-foreground">{t('desc.emailNotifications')}</p>
              </div>
              <Switch 
                checked={settings.emailNotifications}
                onCheckedChange={(checked) => handleSettingChange('emailNotifications', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm">{t('settings.taskReminders')}</p>
                <p className="text-xs text-muted-foreground">{t('desc.taskReminders')}</p>
              </div>
              <Switch 
                checked={settings.taskReminders}
                onCheckedChange={(checked) => handleSettingChange('taskReminders', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm">{t('settings.deadlineAlerts')}</p>
                <p className="text-xs text-muted-foreground">{t('desc.deadlineAlerts')}</p>
              </div>
              <Switch 
                checked={settings.deadlineAlerts}
                onCheckedChange={(checked) => handleSettingChange('deadlineAlerts', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm">{t('settings.collaborationNotifications')}</p>
                <p className="text-xs text-muted-foreground">{t('desc.collaborationNotifications')}</p>
              </div>
              <Switch 
                checked={settings.collaborationNotifications}
                onCheckedChange={(checked) => handleSettingChange('collaborationNotifications', checked)}
              />
            </div>
          </div>
        </div>

        {/* Sound & Vibration */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center space-x-2 mb-4">
            <Volume2 className="w-4 h-4 text-muted-foreground" />
            <h3 className="text-sm">{t('settings.soundVibration')}</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm">{t('settings.notificationSounds')}</p>
                <p className="text-xs text-muted-foreground">{t('desc.notificationSounds')}</p>
              </div>
              <Switch 
                checked={settings.soundEnabled}
                onCheckedChange={(checked) => handleSettingChange('soundEnabled', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm">{t('settings.vibration')}</p>
                <p className="text-xs text-muted-foreground">{t('desc.vibration')}</p>
              </div>
              <Switch 
                checked={settings.vibrationEnabled}
                onCheckedChange={(checked) => handleSettingChange('vibrationEnabled', checked)}
              />
            </div>
            
            <div className="space-y-2">
              <p className="text-sm">{t('settings.notificationSound')}</p>
              <Select 
                value={settings.notificationSound} 
                onValueChange={(value) => handleSettingChange('notificationSound', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {soundOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Quiet Hours */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center space-x-2 mb-4">
            <Moon className="w-4 h-4 text-muted-foreground" />
            <h3 className="text-sm">{t('settings.quietHours')}</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm">{t('settings.enableQuietHours')}</p>
                <p className="text-xs text-muted-foreground">{t('desc.quietHours')}</p>
              </div>
              <Switch 
                checked={settings.quietHours}
                onCheckedChange={(checked) => handleSettingChange('quietHours', checked)}
              />
            </div>
            
            {settings.quietHours && (
              <div className="bg-muted/30 rounded-lg p-3 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Start time</span>
                  <span className="text-xs">{settings.quietStart}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">End time</span>
                  <span className="text-xs">{settings.quietEnd}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Language & Region */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center space-x-2 mb-4">
            <Globe className="w-4 h-4 text-muted-foreground" />
            <h3 className="text-sm">{t('settings.languageRegion')}</h3>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm">{t('settings.language')}</p>
              <Select 
                value={settings.language} 
                onValueChange={(value) => handleSettingChange('language', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {languageOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm">{t('settings.dateFormat')}</p>
              <Select 
                value={settings.dateFormat} 
                onValueChange={(value) => handleSettingChange('dateFormat', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dd/mm/yyyy">DD/MM/YYYY</SelectItem>
                  <SelectItem value="mm/dd/yyyy">MM/DD/YYYY</SelectItem>
                  <SelectItem value="yyyy-mm-dd">YYYY-MM-DD</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm">{t('settings.timeFormat')}</p>
              <Select 
                value={settings.timeFormat} 
                onValueChange={(value) => handleSettingChange('timeFormat', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="24h">24-hour</SelectItem>
                  <SelectItem value="12h">12-hour</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Appearance & Theme */}
        <motion.div 
          className="p-4 border-b border-border"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <div className="flex items-center space-x-2 mb-4">
            <Palette className="w-4 h-4 text-muted-foreground" />
            <h3 className="text-sm">Appearance & Theme</h3>
          </div>
          
          <div className="space-y-3">
            <p className="text-sm mb-3">Theme Preference</p>
            
            <div className="space-y-3">
              {themeOptions.map((option) => {
                const IconComponent = option.icon;
                const isActive = theme === option.value;

                return (
                  <motion.button
                    key={option.value}
                    onClick={() => setTheme(option.value)}
                    className={`
                      w-full flex items-center justify-between p-4 rounded-2xl border transition-all duration-200 group
                      ${isActive
                        ? 'bg-primary/5 border-primary/30 text-primary'
                        : 'bg-card border-border hover:bg-muted/50 hover:border-border/80'
                      }
                    `}
                    whileHover={{ 
                      scale: 1.01,
                      y: -1
                    }}
                    whileTap={{ scale: 0.99 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="flex items-center space-x-3">
                      <motion.div
                        className={`
                          p-2 rounded-xl transition-all duration-200
                          ${isActive 
                            ? 'bg-primary/10 text-primary' 
                            : 'bg-muted/50 group-hover:bg-muted'
                          }
                        `}
                        whileHover={{ rotate: 5, scale: 1.1 }}
                        animate={{
                          rotate: isActive ? [0, 5, -5, 0] : 0,
                          scale: isActive ? [1, 1.05, 1] : 1,
                        }}
                        transition={{
                          duration: isActive ? 3 : 0.2,
                          repeat: isActive ? Infinity : 0,
                          ease: "easeInOut"
                        }}
                      >
                        <IconComponent className="w-4 h-4" />
                      </motion.div>
                      
                      <div className="text-left">
                        <p className="text-sm">{option.label}</p>
                        <p className="text-xs text-muted-foreground">{option.description}</p>
                      </div>
                    </div>
                    
                    {/* Active indicator */}
                    <AnimatePresence>
                      {isActive && (
                        <motion.div
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0, opacity: 0 }}
                          transition={{ 
                            type: "spring", 
                            stiffness: 500, 
                            damping: 30 
                          }}
                          className="w-2 h-2 bg-primary rounded-full"
                        />
                      )}
                    </AnimatePresence>
                  </motion.button>
                );
              })}
            </div>
            
            {/* Theme preview */}
            <motion.div
              className="mt-4 p-3 bg-muted/30 rounded-lg border border-border/50"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ delay: 0.3, duration: 0.4 }}
            >
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <p className="text-xs text-muted-foreground">Current theme: <span className="text-foreground capitalize">{theme}</span></p>
              </div>
              <p className="text-xs text-muted-foreground">
                Changes will be applied immediately across the app.
              </p>
            </motion.div>
          </div>
        </motion.div>

        {/* App Behavior */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center space-x-2 mb-4">
            <Activity className="w-4 h-4 text-muted-foreground" />
            <h3 className="text-sm">{t('settings.appBehavior')}</h3>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm">{t('settings.defaultStartScreen')}</p>
              <Select 
                value={settings.startScreen} 
                onValueChange={(value) => handleSettingChange('startScreen', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="home">{t('nav.home')}</SelectItem>
                  <SelectItem value="kanban">{t('nav.board')}</SelectItem>
                  <SelectItem value="calendar">{t('nav.calendar')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm">{t('settings.defaultTaskView')}</p>
              <Select 
                value={settings.defaultView} 
                onValueChange={(value) => handleSettingChange('defaultView', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="list">List View</SelectItem>
                  <SelectItem value="grid">Grid View</SelectItem>
                  <SelectItem value="compact">Compact View</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm">{t('settings.animations')}</p>
                <p className="text-xs text-muted-foreground">{t('desc.animations')}</p>
              </div>
              <Switch 
                checked={settings.animationsEnabled}
                onCheckedChange={(checked) => handleSettingChange('animationsEnabled', checked)}
              />
            </div>
          </div>
        </div>

        {/* Data & Sync */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center space-x-2 mb-4">
            <Database className="w-4 h-4 text-muted-foreground" />
            <h3 className="text-sm">{t('settings.dataSync')}</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm">{t('settings.autoSync')}</p>
                <p className="text-xs text-muted-foreground">{t('desc.autoSync')}</p>
              </div>
              <Switch 
                checked={settings.autoSync}
                onCheckedChange={(checked) => handleSettingChange('autoSync', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm">{t('settings.offlineMode')}</p>
                <p className="text-xs text-muted-foreground">{t('desc.offlineMode')}</p>
              </div>
              <Switch 
                checked={settings.offlineMode}
                onCheckedChange={(checked) => handleSettingChange('offlineMode', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm">{t('settings.lowDataMode')}</p>
                <p className="text-xs text-muted-foreground">{t('desc.lowDataMode')}</p>
              </div>
              <Switch 
                checked={settings.lowDataMode}
                onCheckedChange={(checked) => handleSettingChange('lowDataMode', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm">{t('settings.backgroundRefresh')}</p>
                <p className="text-xs text-muted-foreground">{t('desc.backgroundRefresh')}</p>
              </div>
              <Switch 
                checked={settings.backgroundRefresh}
                onCheckedChange={(checked) => handleSettingChange('backgroundRefresh', checked)}
              />
            </div>
          </div>
        </div>

        {/* Backup Settings */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center space-x-2 mb-4">
            <Upload className="w-4 h-4 text-muted-foreground" />
            <h3 className="text-sm">{t('settings.backupExport')}</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm">{t('settings.autoBackup')}</p>
                <p className="text-xs text-muted-foreground">{t('desc.autoBackup')}</p>
              </div>
              <Switch 
                checked={settings.autoBackup}
                onCheckedChange={(checked) => handleSettingChange('autoBackup', checked)}
              />
            </div>
            
            <div className="space-y-2">
              <p className="text-sm">{t('settings.backupFrequency')}</p>
              <Select 
                value={settings.backupFrequency} 
                onValueChange={(value) => handleSettingChange('backupFrequency', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="manual">Manual Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Button variant="outline" className="w-full justify-start">
              <Download className="w-4 h-4 mr-2" />
              {t('settings.exportData')}
            </Button>
          </div>
        </div>

        {/* Storage */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center space-x-2 mb-4">
            <HardDrive className="w-4 h-4 text-muted-foreground" />
            <h3 className="text-sm">{t('settings.storage')}</h3>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">{t('settings.appSize')}</span>
                <span>{storageInfo.appSize}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">{t('settings.cache')}</span>
                <span>{storageInfo.cacheSize}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">{t('settings.documents')}</span>
                <span>{storageInfo.documentsSize}</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Cache Size Limit</span>
                <span>{settings.cacheSize} MB</span>
              </div>
              <Slider
                value={[settings.cacheSize]}
                onValueChange={(value) => handleSettingChange('cacheSize', value[0])}
                max={200}
                min={10}
                step={10}
                className="w-full"
              />
            </div>
            
            <Button variant="outline" className="w-full justify-start">
              <Trash2 className="w-4 h-4 mr-2" />
              {t('settings.clearCache')}
            </Button>
          </div>
        </div>

        {/* Security & Privacy Links */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center space-x-2 mb-4">
            <Shield className="w-4 h-4 text-muted-foreground" />
            <h3 className="text-sm">{t('settings.securityPrivacy')}</h3>
          </div>
          
          <div className="space-y-3">
            <Button 
              variant="outline" 
              className="w-full justify-between"
              onClick={() => onNavigate('connected-devices')}
            >
              <div className="flex items-center">
                <Smartphone className="w-4 h-4 mr-3" />
                <span className="text-sm">{t('profile.connectedDevices')}</span>
              </div>
              <ChevronRight className="w-4 h-4" />
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full justify-between"
              onClick={() => onNavigate('privacy-security')}
            >
              <div className="flex items-center">
                <Lock className="w-4 h-4 mr-3" />
                <span className="text-sm">{t('profile.privacy')}</span>
              </div>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Reset Options */}
        <div className="p-4">
          <div className="flex items-center space-x-2 mb-4">
            <RefreshCw className="w-4 h-4 text-muted-foreground" />
            <h3 className="text-sm">Reset Options</h3>
          </div>
          
          <div className="space-y-3">
            <Button variant="outline" className="w-full justify-start">
              <RefreshCw className="w-4 h-4 mr-2" />
              Reset Settings to Default
            </Button>
            
            <div className="bg-muted/50 rounded-lg p-3">
              <div className="flex items-start space-x-2">
                <Info className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">
                    Resetting will restore all settings to their default values. 
                    Your tasks and data will remain unchanged.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}