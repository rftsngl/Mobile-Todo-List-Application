import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { 
  ArrowLeft, 
  Building2, 
  Upload, 
  Globe, 
  Users,
  CheckCircle2,
  Loader2,
  Shield,
  Sparkles,
  Mail
} from 'lucide-react';

interface CreateCompanyScreenProps {
  onSuccess: (companyData: {
    name: string;
    domain?: string;
    logo?: string;
  }) => void;
  onBack: () => void;
}

export function CreateCompanyScreen({ onSuccess, onBack }: CreateCompanyScreenProps) {
  const [formData, setFormData] = useState({
    name: '',
    domain: '',
    logo: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState(1);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(''); // Clear error when user types
  };

  const handleNext = () => {
    if (step === 1) {
      if (!formData.name.trim()) {
        setError('Company name is required');
        return;
      }
      setStep(2);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setError('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock validation
      if (formData.name.toLowerCase().includes('test')) {
        setError('Company name cannot contain "test" for this demo');
        return;
      }

      onSuccess({
        name: formData.name,
        domain: formData.domain || undefined,
        logo: formData.logo || undefined
      });
    } catch (err) {
      setError('Failed to create company. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const isStep1Valid = formData.name.trim().length >= 2;
  const isStep2Valid = true; // Optional fields

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-background via-background/98 to-muted/20 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 right-12 w-32 h-32 bg-gradient-to-br from-purple-500/15 to-transparent rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
            rotate: [0, 180, 360]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-32 left-8 w-24 h-24 bg-gradient-to-tl from-blue-500/10 to-transparent rounded-full blur-2xl"
          animate={{
            scale: [1, 0.8, 1.3, 1],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        />
      </div>

      {/* Header */}
      <motion.div 
        className="relative z-10 pt-12 pb-6 px-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center justify-between mb-8">
          <motion.div
            whileHover={{ scale: 1.05, x: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <button
              onClick={step === 1 ? onBack : () => setStep(1)}
              className="p-2 rounded-xl bg-card/50 backdrop-blur-sm border border-border hover:bg-card/80 transition-all duration-200"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          </motion.div>

          <div className="flex items-center space-x-2">
            <Badge variant="secondary" className="bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20">
              <Shield className="w-3 h-3 mr-1" />
              Admin Setup
            </Badge>
            <Badge variant="secondary" className="bg-muted/50 text-muted-foreground border-border">
              Step {step} of 2
            </Badge>
          </div>
        </div>

        <motion.div
          className="text-center mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <motion.div
            className="w-16 h-16 bg-gradient-to-br from-purple-500/20 via-purple-400/10 to-transparent rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm border border-purple-500/20 relative overflow-hidden"
            whileHover={{ scale: 1.05, rotate: 5 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
          >
            {/* Sparkle effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10"
              animate={{
                opacity: [0, 0.5, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <Building2 className="w-8 h-8 text-purple-600 dark:text-purple-400 relative z-10" />
            <Sparkles className="absolute top-1 right-1 w-3 h-3 text-purple-500/60" />
          </motion.div>
          
          <h1 className="text-2xl mb-2">
            {/* @dev-annotation: i18n key - company.create.title */}
            Create Your Company
          </h1>
          <p className="text-muted-foreground max-w-sm mx-auto">
            {step === 1 
              ? /* @dev-annotation: i18n key - company.create.subtitle.step1 */
                "Set up your organization workspace and start collaborating with your team."
              : /* @dev-annotation: i18n key - company.create.subtitle.step2 */
                "Customize your company profile and invite your first team members."
            }
          </p>
        </motion.div>
      </motion.div>

      {/* Progress Indicator */}
      <div className="px-6 mb-6 relative z-10">
        <div className="flex items-center justify-center space-x-4">
          {[1, 2].map((stepNumber) => (
            <div key={stepNumber} className="flex items-center">
              <motion.div
                className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-all duration-300
                  ${stepNumber <= step 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted text-muted-foreground'
                  }
                `}
                animate={stepNumber === step ? {
                  scale: [1, 1.1, 1],
                } : {}}
                transition={{
                  duration: 0.5,
                  ease: [0.16, 1, 0.3, 1]
                }}
              >
                {stepNumber < step ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : (
                  stepNumber
                )}
              </motion.div>
              
              {stepNumber < 2 && (
                <div className={`
                  w-16 h-0.5 mx-2 transition-all duration-300
                  ${stepNumber < step ? 'bg-primary' : 'bg-border'}
                `} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Form Content */}
      <div className="flex-1 px-6 overflow-y-auto">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="companyName">
                    {/* @dev-annotation: i18n key - company.create.form.name.label */}
                    Company Name *
                  </Label>
                  <Input
                    id="companyName"
                    type="text"
                    placeholder="Acme Corporation"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="h-12 text-base bg-input-background border-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                  />
                  <p className="text-xs text-muted-foreground">
                    {/* @dev-annotation: i18n key - company.create.form.name.help */}
                    This will be the name visible to all team members
                  </p>
                </div>

                {/* Company Name Suggestions */}
                <div className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-4">
                  <p className="text-xs text-muted-foreground mb-3">
                    {/* @dev-annotation: i18n key - company.create.suggestions.title */}
                    Try these examples:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {['Acme Corp', 'TechFlow Inc', 'Design Studio'].map((suggestion) => (
                      <motion.button
                        key={suggestion}
                        type="button"
                        onClick={() => handleInputChange('name', suggestion)}
                        className="inline-flex items-center space-x-2 px-3 py-2 bg-primary/10 text-primary rounded-lg text-sm hover:bg-primary/20 transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Building2 className="w-4 h-4" />
                        <span>{suggestion}</span>
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="domain">
                    {/* @dev-annotation: i18n key - company.create.form.domain.label */}
                    Company Domain (Optional)
                  </Label>
                  <div className="relative">
                    <Input
                      id="domain"
                      type="text"
                      placeholder="acme.com"
                      value={formData.domain}
                      onChange={(e) => handleInputChange('domain', e.target.value)}
                      className="h-12 text-base bg-input-background border-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 pl-9"
                    />
                    <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {/* @dev-annotation: i18n key - company.create.form.domain.help */}
                    Auto-approve team members with matching email domains
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="logo">
                    {/* @dev-annotation: i18n key - company.create.form.logo.label */}
                    Company Logo (Optional)
                  </Label>
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl flex items-center justify-center border border-border">
                      {formData.logo ? (
                        <img src={formData.logo} alt="Logo" className="w-8 h-8 rounded-lg object-cover" />
                      ) : (
                        <Building2 className="w-6 h-6 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-1">
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button
                          type="button"
                          variant="outline"
                          className="w-full justify-start"
                          onClick={() => {
                            // Mock logo selection
                            const mockLogos = [
                              'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=64&h=64&fit=crop&crop=center',
                              'https://images.unsplash.com/photo-1572044162444-ad60f128bdea?w=64&h=64&fit=crop&crop=center'
                            ];
                            handleInputChange('logo', mockLogos[Math.floor(Math.random() * mockLogos.length)]);
                          }}
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          {/* @dev-annotation: i18n key - company.create.form.logo.button */}
                          Upload Logo
                        </Button>
                      </motion.div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {/* @dev-annotation: i18n key - company.create.form.logo.help */}
                        JPG, PNG or SVG. Max 2MB.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Preview Card */}
              <div className="bg-gradient-to-br from-primary/5 via-primary/3 to-transparent backdrop-blur-sm border border-primary/20 rounded-2xl p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl flex items-center justify-center">
                    {formData.logo ? (
                      <img src={formData.logo} alt="Preview" className="w-6 h-6 rounded-lg object-cover" />
                    ) : (
                      <Building2 className="w-5 h-5 text-primary" />
                    )}
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">{formData.name || 'Your Company'}</h4>
                    {formData.domain && (
                      <p className="text-xs text-muted-foreground">@{formData.domain}</p>
                    )}
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  {/* @dev-annotation: i18n key - company.create.preview.subtitle */}
                  This is how your company will appear to team members
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error Alert */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="mt-4"
            >
              <Alert className="border-destructive/20 bg-destructive/5">
                <AlertDescription className="text-destructive">
                  {error}
                </AlertDescription>
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer Actions */}
      <motion.div
        className="p-6 space-y-4 relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        {step === 1 ? (
          <motion.div
            whileHover={isStep1Valid ? { scale: 1.02, y: -2 } : undefined}
            whileTap={isStep1Valid ? { scale: 0.98 } : undefined}
          >
            <Button
              onClick={handleNext}
              disabled={!isStep1Valid}
              className={`
                w-full py-4 text-lg rounded-2xl transition-all duration-300 relative overflow-hidden
                ${isStep1Valid
                  ? 'bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl'
                  : 'bg-muted text-muted-foreground cursor-not-allowed'
                }
              `}
            >
              <div className="flex items-center justify-center space-x-2">
                <span>
                  {/* @dev-annotation: i18n key - common.next */}
                  Continue
                </span>
                <motion.div
                  animate={{ x: [0, 4, 0] }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <ArrowLeft className="w-5 h-5 rotate-180" />
                </motion.div>
              </div>
            </Button>
          </motion.div>
        ) : (
          <motion.div
            whileHover={!isLoading ? { scale: 1.02, y: -2 } : undefined}
            whileTap={!isLoading ? { scale: 0.98 } : undefined}
          >
            <Button
              onClick={handleSubmit}
              disabled={isLoading}
              className={`
                w-full py-4 text-lg rounded-2xl transition-all duration-300 relative overflow-hidden
                ${!isLoading
                  ? 'bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl'
                  : 'bg-primary/50 text-primary-foreground cursor-not-allowed'
                }
              `}
            >
              {isLoading ? (
                <motion.div className="flex items-center justify-center space-x-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>
                    {/* @dev-annotation: i18n key - company.create.creating */}
                    Creating Company...
                  </span>
                </motion.div>
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  <Users className="w-5 h-5" />
                  <span>
                    {/* @dev-annotation: i18n key - company.create.submit */}
                    Create & Continue as Admin
                  </span>
                </div>
              )}
            </Button>
          </motion.div>
        )}
        
        <p className="text-center text-xs text-muted-foreground">
          {/* @dev-annotation: i18n key - company.create.footer.note */}
          You can modify these settings later in Company Settings
        </p>
      </motion.div>
    </div>
  );
}