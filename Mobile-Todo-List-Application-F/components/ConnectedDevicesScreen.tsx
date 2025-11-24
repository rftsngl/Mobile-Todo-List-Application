import React, { useState } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  ArrowLeft, 
  Smartphone, 
  Monitor, 
  Tablet, 
  Laptop, 
  MoreVertical, 
  MapPin, 
  Clock, 
  Shield, 
  AlertTriangle,
  CheckCircle,
  Trash2,
  Eye,
  Wifi,
  Globe
} from 'lucide-react';

interface ConnectedDevicesScreenProps {
  onNavigate: (screen: string) => void;
}

interface Device {
  id: number;
  name: string;
  type: 'mobile' | 'desktop' | 'tablet' | 'laptop';
  platform: string;
  browser: string;
  location: string;
  ipAddress: string;
  lastActive: string;
  isCurrentDevice: boolean;
  isTrusted: boolean;
  firstLogin: string;
}

export function ConnectedDevicesScreen({ onNavigate }: ConnectedDevicesScreenProps) {
  const [devices, setDevices] = useState<Device[]>([
    {
      id: 1,
      name: 'iPhone 15 Pro',
      type: 'mobile',
      platform: 'iOS 17.2',
      browser: 'Safari',
      location: 'Istanbul, Turkey',
      ipAddress: '192.168.1.42',
      lastActive: 'Active now',
      isCurrentDevice: true,
      isTrusted: true,
      firstLogin: '2 months ago'
    },
    {
      id: 2,
      name: 'MacBook Pro',
      type: 'laptop',
      platform: 'macOS Sonoma',
      browser: 'Chrome',
      location: 'Istanbul, Turkey',
      ipAddress: '192.168.1.35',
      lastActive: '2 hours ago',
      isCurrentDevice: false,
      isTrusted: true,
      firstLogin: '2 months ago'
    },
    {
      id: 3,
      name: 'iPad Air',
      type: 'tablet',
      platform: 'iPadOS 17.1',
      browser: 'Safari',
      location: 'Istanbul, Turkey',
      ipAddress: '192.168.1.28',
      lastActive: '1 day ago',
      isCurrentDevice: false,
      isTrusted: true,
      firstLogin: '1 month ago'
    },
    {
      id: 4,
      name: 'Windows PC',
      type: 'desktop',
      platform: 'Windows 11',
      browser: 'Edge',
      location: 'Ankara, Turkey',
      ipAddress: '85.104.23.156',
      lastActive: '1 week ago',
      isCurrentDevice: false,
      isTrusted: false,
      firstLogin: '1 week ago'
    }
  ]);

  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'mobile': return Smartphone;
      case 'desktop': return Monitor;
      case 'tablet': return Tablet;
      case 'laptop': return Laptop;
      default: return Smartphone;
    }
  };

  const removeDevice = (deviceId: number) => {
    setDevices(devices.filter(device => device.id !== deviceId));
    setSelectedDevice(null);
  };

  const toggleTrusted = (deviceId: number) => {
    setDevices(devices.map(device => 
      device.id === deviceId 
        ? { ...device, isTrusted: !device.isTrusted }
        : device
    ));
  };

  const trustedDevices = devices.filter(device => device.isTrusted);
  const untrustedDevices = devices.filter(device => !device.isTrusted);

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <div className="h-14 bg-card border-b border-border flex items-center justify-between px-4">
        <Button variant="ghost" size="sm" onClick={() => onNavigate('privacy-security')}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        
        <h1 className="text-lg">Connected Devices</h1>
        
        <Button variant="ghost" size="sm">
          <MoreVertical className="w-5 h-5" />
        </Button>
      </div>

      {/* Security Overview */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center space-x-3 mb-3">
          <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
            <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h3 className="text-sm">Device Security</h3>
            <p className="text-xs text-muted-foreground">
              {trustedDevices.length} trusted • {untrustedDevices.length} requires attention
            </p>
          </div>
        </div>
        
        <div className="text-xs text-muted-foreground">
          Review your connected devices regularly. Remove any devices you don't recognize.
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Current Device */}
        <div className="p-4 border-b border-border">
          <h3 className="text-sm mb-3 flex items-center">
            <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
            Current Device
          </h3>
          
          {devices.filter(device => device.isCurrentDevice).map((device) => {
            const IconComponent = getDeviceIcon(device.type);
            
            return (
              <div key={device.id} className="bg-muted/30 rounded-lg p-3">
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <IconComponent className="w-5 h-5 text-primary" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-sm">{device.name}</h4>
                      <Badge variant="default" className="text-xs">This device</Badge>
                    </div>
                    
                    <p className="text-xs text-muted-foreground mb-2">
                      {device.platform} • {device.browser}
                    </p>
                    
                    <div className="flex items-center space-x-3 text-xs text-muted-foreground">
                      <div className="flex items-center">
                        <MapPin className="w-3 h-3 mr-1" />
                        {device.location}
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {device.lastActive}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Trusted Devices */}
        {trustedDevices.filter(device => !device.isCurrentDevice).length > 0 && (
          <div className="p-4 border-b border-border">
            <h3 className="text-sm mb-3 flex items-center">
              <Shield className="w-4 h-4 text-green-500 mr-2" />
              Trusted Devices ({trustedDevices.filter(device => !device.isCurrentDevice).length})
            </h3>
            
            <div className="space-y-3">
              {trustedDevices.filter(device => !device.isCurrentDevice).map((device) => {
                const IconComponent = getDeviceIcon(device.type);
                
                return (
                  <div key={device.id} className="bg-card border border-border rounded-lg p-3">
                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                        <IconComponent className="w-5 h-5 text-muted-foreground" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="text-sm">{device.name}</h4>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => setSelectedDevice(selectedDevice?.id === device.id ? null : device)}
                            className="h-7 w-7 p-0"
                          >
                            <MoreVertical className="w-3 h-3" />
                          </Button>
                        </div>
                        
                        <p className="text-xs text-muted-foreground mb-2">
                          {device.platform} • {device.browser}
                        </p>
                        
                        <div className="flex items-center space-x-3 text-xs text-muted-foreground mb-2">
                          <div className="flex items-center">
                            <MapPin className="w-3 h-3 mr-1" />
                            {device.location}
                          </div>
                          <div className="flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            {device.lastActive}
                          </div>
                        </div>
                        
                        {selectedDevice?.id === device.id && (
                          <div className="border-t border-border pt-3 mt-3 space-y-2">
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-muted-foreground">IP Address</span>
                              <span>{device.ipAddress}</span>
                            </div>
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-muted-foreground">First Login</span>
                              <span>{device.firstLogin}</span>
                            </div>
                            
                            <div className="flex space-x-2 pt-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => toggleTrusted(device.id)}
                                className="flex-1 h-8 text-xs"
                              >
                                {device.isTrusted ? 'Remove Trust' : 'Mark Trusted'}
                              </Button>
                              <Button 
                                variant="destructive" 
                                size="sm"
                                onClick={() => removeDevice(device.id)}
                                className="flex-1 h-8 text-xs"
                              >
                                <Trash2 className="w-3 h-3 mr-1" />
                                Remove
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Untrusted Devices */}
        {untrustedDevices.length > 0 && (
          <div className="p-4 border-b border-border">
            <h3 className="text-sm mb-3 flex items-center">
              <AlertTriangle className="w-4 h-4 text-orange-500 mr-2" />
              Requires Attention ({untrustedDevices.length})
            </h3>
            
            <div className="space-y-3">
              {untrustedDevices.map((device) => {
                const IconComponent = getDeviceIcon(device.type);
                
                return (
                  <div key={device.id} className="bg-orange-50 dark:bg-orange-900/10 border border-orange-200 dark:border-orange-800 rounded-lg p-3">
                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center">
                        <IconComponent className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="text-sm">{device.name}</h4>
                          <Badge variant="destructive" className="text-xs">Untrusted</Badge>
                        </div>
                        
                        <p className="text-xs text-muted-foreground mb-2">
                          {device.platform} • {device.browser}
                        </p>
                        
                        <div className="flex items-center space-x-3 text-xs text-muted-foreground mb-3">
                          <div className="flex items-center">
                            <MapPin className="w-3 h-3 mr-1" />
                            {device.location}
                          </div>
                          <div className="flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            {device.lastActive}
                          </div>
                        </div>
                        
                        <div className="flex space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => toggleTrusted(device.id)}
                            className="flex-1 h-8 text-xs"
                          >
                            Mark as Trusted
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => removeDevice(device.id)}
                            className="flex-1 h-8 text-xs"
                          >
                            <Trash2 className="w-3 h-3 mr-1" />
                            Remove
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Security Tips */}
        <div className="p-4">
          <h3 className="text-sm mb-3 flex items-center">
            <Eye className="w-4 h-4 text-muted-foreground mr-2" />
            Security Tips
          </h3>
          
          <div className="space-y-3">
            <div className="bg-muted/50 rounded-lg p-3">
              <p className="text-xs text-muted-foreground">
                <strong>Regularly review your devices:</strong> Check this list monthly and remove any devices you don't recognize or no longer use.
              </p>
            </div>
            
            <div className="bg-muted/50 rounded-lg p-3">
              <p className="text-xs text-muted-foreground">
                <strong>Secure public networks:</strong> Avoid logging in from public WiFi. If you must, use a VPN for added security.
              </p>
            </div>
            
            <div className="bg-muted/50 rounded-lg p-3">
              <p className="text-xs text-muted-foreground">
                <strong>Sign out when done:</strong> Always sign out when using shared or public computers.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}