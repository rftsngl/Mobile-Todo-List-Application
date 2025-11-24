import React, { useState } from 'react';
import { Button } from './ui/button';
import { Switch } from './ui/switch';
import { Badge } from './ui/badge';
import { 
  ArrowLeft, 
  Shield, 
  Lock, 
  Eye, 
  EyeOff, 
  Key, 
  Download, 
  Trash2, 
  AlertTriangle,
  CheckCircle,
  ExternalLink,
  Smartphone,
  Mail,
  Globe,
  Database,
  Settings,
  Info
} from 'lucide-react';

interface PrivacySecurityScreenProps {
  onNavigate: (screen: string) => void;
}

export function PrivacySecurityScreen({ onNavigate }: PrivacySecurityScreenProps) {
  const [privacySettings, setPrivacySettings] = useState({
    dataCollection: true,
    analytics: false,
    marketingEmails: false,
    shareUsageData: true,
    personalizedAds: false,
    profileVisibility: 'private'
  });

  const [securitySettings, setSecuritySettings] = useState({
    twoFactorEnabled: false,
    biometricLogin: true,
    sessionTimeout: '30min',
    loginAlerts: true,
    deviceTracking: true
  });

  const [lastPasswordChange] = useState('2 months ago');
  const [accountCreated] = useState('January 2024');

  const handlePrivacyChange = (key: string, value: boolean | string) => {
    setPrivacySettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSecurityChange = (key: string, value: boolean | string) => {
    setSecuritySettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <div className="h-14 bg-card border-b border-border flex items-center justify-between px-4">
        <Button variant="ghost" size="sm" onClick={() => onNavigate('profile')}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        
        <h1 className="text-lg">Privacy & Security</h1>
        
        <Button variant="ghost" size="sm">
          <Settings className="w-5 h-5" />
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Security Status */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
              <Shield className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h3 className="text-sm">Security Status</h3>
              <p className="text-xs text-muted-foreground">Your account is secure</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Two-factor authentication</span>
              <Badge variant={securitySettings.twoFactorEnabled ? "default" : "secondary"}>
                {securitySettings.twoFactorEnabled ? "Enabled" : "Disabled"}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Last password change</span>
              <span>{lastPasswordChange}</span>
            </div>
            
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Account created</span>
              <span>{accountCreated}</span>
            </div>
          </div>
        </div>

        {/* Privacy Settings */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center space-x-2 mb-4">
            <Eye className="w-4 h-4 text-muted-foreground" />
            <h3 className="text-sm">Privacy Settings</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm">Data Collection</p>
                <p className="text-xs text-muted-foreground">Allow app to collect usage data</p>
              </div>
              <Switch 
                checked={privacySettings.dataCollection}
                onCheckedChange={(checked) => handlePrivacyChange('dataCollection', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm">Analytics</p>
                <p className="text-xs text-muted-foreground">Help improve the app with analytics</p>
              </div>
              <Switch 
                checked={privacySettings.analytics}
                onCheckedChange={(checked) => handlePrivacyChange('analytics', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm">Marketing Emails</p>
                <p className="text-xs text-muted-foreground">Receive product updates and tips</p>
              </div>
              <Switch 
                checked={privacySettings.marketingEmails}
                onCheckedChange={(checked) => handlePrivacyChange('marketingEmails', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm">Share Usage Data</p>
                <p className="text-xs text-muted-foreground">Share anonymized usage patterns</p>
              </div>
              <Switch 
                checked={privacySettings.shareUsageData}
                onCheckedChange={(checked) => handlePrivacyChange('shareUsageData', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm">Personalized Ads</p>
                <p className="text-xs text-muted-foreground">Show relevant advertisements</p>
              </div>
              <Switch 
                checked={privacySettings.personalizedAds}
                onCheckedChange={(checked) => handlePrivacyChange('personalizedAds', checked)}
              />
            </div>
          </div>
        </div>

        {/* Security Settings */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center space-x-2 mb-4">
            <Lock className="w-4 h-4 text-muted-foreground" />
            <h3 className="text-sm">Security Settings</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm">Two-Factor Authentication</p>
                <p className="text-xs text-muted-foreground">Add an extra layer of security</p>
              </div>
              <Switch 
                checked={securitySettings.twoFactorEnabled}
                onCheckedChange={(checked) => handleSecurityChange('twoFactorEnabled', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm">Biometric Login</p>
                <p className="text-xs text-muted-foreground">Use fingerprint or face recognition</p>
              </div>
              <Switch 
                checked={securitySettings.biometricLogin}
                onCheckedChange={(checked) => handleSecurityChange('biometricLogin', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm">Login Alerts</p>
                <p className="text-xs text-muted-foreground">Get notified of new sign-ins</p>
              </div>
              <Switch 
                checked={securitySettings.loginAlerts}
                onCheckedChange={(checked) => handleSecurityChange('loginAlerts', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm">Device Tracking</p>
                <p className="text-xs text-muted-foreground">Monitor active sessions</p>
              </div>
              <Switch 
                checked={securitySettings.deviceTracking}
                onCheckedChange={(checked) => handleSecurityChange('deviceTracking', checked)}
              />
            </div>
          </div>
        </div>

        {/* Account Actions */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center space-x-2 mb-4">
            <Key className="w-4 h-4 text-muted-foreground" />
            <h3 className="text-sm">Account Actions</h3>
          </div>
          
          <div className="space-y-3">
            <Button variant="outline" className="w-full justify-start h-12">
              <Lock className="w-4 h-4 mr-3" />
              <div className="text-left">
                <p className="text-sm">Change Password</p>
                <p className="text-xs text-muted-foreground">Update your account password</p>
              </div>
            </Button>
            
            <Button variant="outline" className="w-full justify-start h-12" onClick={() => onNavigate('connected-devices')}>
              <Smartphone className="w-4 h-4 mr-3" />
              <div className="text-left">
                <p className="text-sm">Manage Devices</p>
                <p className="text-xs text-muted-foreground">View and remove trusted devices</p>
              </div>
            </Button>
            
            <Button variant="outline" className="w-full justify-start h-12">
              <Mail className="w-4 h-4 mr-3" />
              <div className="text-left">
                <p className="text-sm">Backup Email</p>
                <p className="text-xs text-muted-foreground">Add recovery email address</p>
              </div>
            </Button>
          </div>
        </div>

        {/* Data Management */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center space-x-2 mb-4">
            <Database className="w-4 h-4 text-muted-foreground" />
            <h3 className="text-sm">Data Management</h3>
          </div>
          
          <div className="space-y-3">
            <Button variant="outline" className="w-full justify-start h-12">
              <Download className="w-4 h-4 mr-3" />
              <div className="text-left">
                <p className="text-sm">Export Data</p>
                <p className="text-xs text-muted-foreground">Download your account data</p>
              </div>
            </Button>
            
            <Button variant="outline" className="w-full justify-start h-12">
              <Info className="w-4 h-4 mr-3" />
              <div className="text-left">
                <p className="text-sm">Data Usage</p>
                <p className="text-xs text-muted-foreground">See how your data is used</p>
              </div>
            </Button>
            
            <Button variant="outline" className="w-full justify-start h-12 border-destructive/20 hover:bg-destructive/5">
              <Trash2 className="w-4 h-4 mr-3 text-destructive" />
              <div className="text-left">
                <p className="text-sm text-destructive">Delete Account</p>
                <p className="text-xs text-muted-foreground">Permanently remove your account</p>
              </div>
            </Button>
          </div>
        </div>

        {/* Legal & Policies */}
        <div className="p-4">
          <div className="flex items-center space-x-2 mb-4">
            <Globe className="w-4 h-4 text-muted-foreground" />
            <h3 className="text-sm">Legal & Policies</h3>
          </div>
          
          <div className="space-y-3">
            <Button variant="ghost" className="w-full justify-between">
              <span className="text-sm">Privacy Policy</span>
              <ExternalLink className="w-4 h-4" />
            </Button>
            
            <Button variant="ghost" className="w-full justify-between">
              <span className="text-sm">Terms of Service</span>
              <ExternalLink className="w-4 h-4" />
            </Button>
            
            <Button variant="ghost" className="w-full justify-between">
              <span className="text-sm">Cookie Policy</span>
              <ExternalLink className="w-4 h-4" />
            </Button>
            
            <Button variant="ghost" className="w-full justify-between">
              <span className="text-sm">Data Processing Agreement</span>
              <ExternalLink className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="mt-6 p-3 bg-muted/50 rounded-lg">
            <div className="flex items-start space-x-2">
              <Info className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">
                  Your privacy is important to us. We use industry-standard encryption 
                  and never sell your personal data to third parties.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}