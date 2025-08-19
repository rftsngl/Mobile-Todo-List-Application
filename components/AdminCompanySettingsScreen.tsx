import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useLocalization } from './LocalizationProvider';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Skeleton } from './ui/Skeleton';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { toast } from 'sonner@2.0.3';
import { 
  ArrowLeft, 
  Building, 
  Upload, 
  Save, 
  Settings, 
  AlertCircle,
  CheckCircle,
  RefreshCw
} from 'lucide-react';
import { adminService, type CompanySettings } from '../services/admin';

interface AdminCompanySettingsScreenProps {
  onNavigate: (screen: string) => void;
}

export function AdminCompanySettingsScreen({ onNavigate }: AdminCompanySettingsScreenProps) {
  const { t } = useLocalization();
  const [settings, setSettings] = useState<CompanySettings>({
    name: '',
    domain: '',
    logo: '',
    inviteExpiryDays: 7,
    approvalMode: 'manual',
    requiresApproval: true
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Load settings on component mount
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await adminService.getCompanySettings();
      setSettings(data);
      setHasChanges(false);
    } catch (err) {
      setError('Failed to load company settings');
      console.error('Error loading settings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof CompanySettings, value: any) => {
    setSettings(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
    
    // Clear validation error for this field
    if (validationErrors[field]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!settings.name.trim()) {
      errors.name = t('admin.companySettings.validation.name.required');
    }

    if (settings.domain && !isValidDomain(settings.domain)) {
      errors.domain = t('admin.companySettings.validation.domain.invalid');
    }

    if (settings.inviteExpiryDays < 1 || settings.inviteExpiryDays > 30) {
      errors.inviteExpiryDays = t('admin.companySettings.validation.inviteExpiryDays.range');
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const isValidDomain = (domain: string): boolean => {
    const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]?\.[a-zA-Z]{2,}$/;
    return domainRegex.test(domain);
  };

  const handleSave = async () => {
    if (!validateForm()) {
      toast.error(t('admin.companySettings.validation.hasErrors'));
      return;
    }

    try {
      setSaving(true);
      await adminService.updateCompanySettings(settings);
      setHasChanges(false);
      toast.success(t('common.saved'));
    } catch (err) {
      toast.error(t('admin.companySettings.save.error'));
      console.error('Error saving settings:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];

    if (file.size > maxSize) {
      toast.error(t('admin.companySettings.logo.sizeError'));
      return;
    }

    if (!allowedTypes.includes(file.type)) {
      toast.error(t('admin.companySettings.logo.typeError'));
      return;
    }

    try {
      setUploadingLogo(true);
      const logoUrl = await adminService.uploadLogo(file);
      handleChange('logo', logoUrl);
      toast.success(t('admin.companySettings.logo.uploaded'));
    } catch (err) {
      toast.error(t('admin.companySettings.logo.uploadError'));
      console.error('Error uploading logo:', err);
    } finally {
      setUploadingLogo(false);
    }
  };

  const goBack = () => onNavigate('admin-dashboard');

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-border">
        <Button
          variant="ghost"
          size="sm"
          onClick={goBack}
          className="h-9 w-9 p-0"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-lg font-medium">{t('admin.companySettings.title')}</h1>
          <p className="text-sm text-muted-foreground">
            {t('admin.companySettings.subtitle')}
          </p>
        </div>
        <Button
          onClick={loadSettings}
          variant="outline"
          size="sm"
          disabled={loading}
          className="h-9 w-9 p-0"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Loading State */}
        {loading && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-64" />
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <div className="flex items-center gap-4">
                  <Skeleton className="h-16 w-16 rounded-lg" />
                  <Skeleton className="h-10 w-32" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="p-8 text-center">
            <AlertCircle className="w-8 h-8 text-danger mx-auto mb-2" />
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={loadSettings} variant="outline">
              {t('common.retry')}
            </Button>
          </div>
        )}

        {/* Settings Content */}
        {!loading && !error && (
          <>
            {/* Company Profile */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building className="w-5 h-5 text-primary" />
                    {t('admin.companySettings.profile.title')}
                  </CardTitle>
                  <CardDescription>
                    {t('admin.companySettings.profile.description')}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Company Name */}
                  <div>
                    <Label htmlFor="name">{t('admin.companySettings.profile.name')}</Label>
                    <Input
                      id="name"
                      value={settings.name}
                      onChange={(e) => handleChange('name', e.target.value)}
                      placeholder={t('admin.companySettings.profile.name.placeholder')}
                      className={validationErrors.name ? 'border-danger' : ''}
                    />
                    {validationErrors.name && (
                      <p className="text-xs text-danger mt-1">{validationErrors.name}</p>
                    )}
                  </div>

                  {/* Domain */}
                  <div>
                    <Label htmlFor="domain">{t('admin.companySettings.profile.domain')}</Label>
                    <Input
                      id="domain"
                      value={settings.domain || ''}
                      onChange={(e) => handleChange('domain', e.target.value)}
                      placeholder={t('admin.companySettings.profile.domain.placeholder')}
                      className={validationErrors.domain ? 'border-danger' : ''}
                    />
                    {validationErrors.domain && (
                      <p className="text-xs text-danger mt-1">{validationErrors.domain}</p>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">
                      {t('admin.companySettings.profile.domain.help')}
                    </p>
                  </div>

                  {/* Logo Upload */}
                  <div>
                    <Label>{t('admin.companySettings.profile.logo')}</Label>
                    <div className="flex items-center gap-4 mt-2">
                      <div className="relative">
                        <div className="w-16 h-16 border-2 border-dashed border-border rounded-lg flex items-center justify-center bg-muted/50">
                          {settings.logo ? (
                            <ImageWithFallback
                              src={settings.logo}
                              alt="Company Logo"
                              className="w-full h-full object-cover rounded-lg"
                            />
                          ) : (
                            <Building className="w-6 h-6 text-muted-foreground" />
                          )}
                        </div>
                        {uploadingLogo && (
                          <div className="absolute inset-0 bg-background/80 rounded-lg flex items-center justify-center">
                            <RefreshCw className="w-4 h-4 animate-spin" />
                          </div>
                        )}
                      </div>
                      <div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleLogoUpload}
                          disabled={uploadingLogo}
                          className="hidden"
                          id="logo-upload"
                        />
                        <Label htmlFor="logo-upload" asChild>
                          <Button variant="outline" disabled={uploadingLogo}>
                            <Upload className="w-4 h-4 mr-2" />
                            {t('admin.companySettings.profile.logo.upload')}
                          </Button>
                        </Label>
                        <p className="text-xs text-muted-foreground mt-1">
                          {t('admin.companySettings.profile.logo.help')}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Policies & Settings */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="w-5 h-5 text-primary" />
                    {t('admin.companySettings.policies.title')}
                  </CardTitle>
                  <CardDescription>
                    {t('admin.companySettings.policies.description')}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Invite Expiry */}
                  <div>
                    <Label htmlFor="inviteExpiryDays">
                      {t('admin.companySettings.policies.inviteExpiryDays')}
                    </Label>
                    <Select
                      value={settings.inviteExpiryDays.toString()}
                      onValueChange={(value) => handleChange('inviteExpiryDays', parseInt(value))}
                    >
                      <SelectTrigger className={validationErrors.inviteExpiryDays ? 'border-danger' : ''}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 {t('admin.companySettings.policies.day')}</SelectItem>
                        <SelectItem value="3">3 {t('admin.companySettings.policies.days')}</SelectItem>
                        <SelectItem value="7">7 {t('admin.companySettings.policies.days')}</SelectItem>
                        <SelectItem value="14">14 {t('admin.companySettings.policies.days')}</SelectItem>
                        <SelectItem value="30">30 {t('admin.companySettings.policies.days')}</SelectItem>
                      </SelectContent>
                    </Select>
                    {validationErrors.inviteExpiryDays && (
                      <p className="text-xs text-danger mt-1">{validationErrors.inviteExpiryDays}</p>
                    )}
                  </div>

                  {/* Approval Mode */}
                  <div>
                    <Label>{t('admin.companySettings.policies.approvalMode.title')}</Label>
                    <div className="space-y-3 mt-2">
                      <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                        <div>
                          <div className="font-medium">
                            {t('admin.companySettings.policies.approvalMode.auto')}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {t('admin.companySettings.policies.approvalMode.auto.description')}
                          </div>
                        </div>
                        <Switch
                          checked={settings.approvalMode === 'auto'}
                          onCheckedChange={(checked) => 
                            handleChange('approvalMode', checked ? 'auto' : 'manual')
                          }
                        />
                      </div>
                      <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                        <div>
                          <div className="font-medium">
                            {t('admin.companySettings.policies.approvalMode.manual')}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {t('admin.companySettings.policies.approvalMode.manual.description')}
                          </div>
                        </div>
                        <Switch
                          checked={settings.approvalMode === 'manual'}
                          onCheckedChange={(checked) => 
                            handleChange('approvalMode', checked ? 'manual' : 'auto')
                          }
                        />
                      </div>
                    </div>
                  </div>

                  {/* Requires Approval */}
                  <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                    <div>
                      <div className="font-medium">
                        {t('admin.companySettings.policies.requiresApproval')}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {t('admin.companySettings.policies.requiresApproval.description')}
                      </div>
                    </div>
                    <Switch
                      checked={settings.requiresApproval}
                      onCheckedChange={(checked) => handleChange('requiresApproval', checked)}
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Save Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="sticky bottom-4 bg-background/80 backdrop-blur-sm rounded-xl border border-border p-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {hasChanges && (
                    <>
                      <AlertCircle className="w-4 h-4 text-warning" />
                      <span className="text-sm text-muted-foreground">
                        {t('admin.companySettings.hasChanges')}
                      </span>
                    </>
                  )}
                  {!hasChanges && !loading && (
                    <>
                      <CheckCircle className="w-4 h-4 text-success" />
                      <span className="text-sm text-muted-foreground">
                        {t('admin.companySettings.saved')}
                      </span>
                    </>
                  )}
                </div>
                <Button
                  onClick={handleSave}
                  disabled={!hasChanges || saving}
                  className="min-w-24"
                >
                  {saving ? (
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4 mr-2" />
                  )}
                  {t('common.save')}
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
}