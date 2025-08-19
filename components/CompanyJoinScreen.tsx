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
  Mail, 
  Key, 
  AlertCircle,
  CheckCircle2,
  Loader2,
  Users,
  Shield
} from 'lucide-react';

interface CompanyJoinScreenProps {
  onSuccess: (companyData: { name: string; code: string; email: string }) => void;
  onBack: () => void;
  onCreateCompany: () => void;
}

export function CompanyJoinScreen({ onSuccess, onBack, onCreateCompany }: CompanyJoinScreenProps) {
  const [joinMethod, setJoinMethod] = useState<'code' | 'email'>('code');
  const [companyCode, setCompanyCode] = useState('');
  const [workEmail, setWorkEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock validation
      if (joinMethod === 'code' && companyCode.toLowerCase() === 'acme123') {
        onSuccess({ name: 'Acme Corporation', code: companyCode, email: '' });
      } else if (joinMethod === 'email' && workEmail.includes('@acme.com')) {
        onSuccess({ name: 'Acme Corporation', code: '', email: workEmail });
      } else {
        setError(joinMethod === 'code' 
          ? 'Invalid company code. Please check with your admin.' 
          : 'Domain not found. Please verify your work email.');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = joinMethod === 'code' ? companyCode.length >= 3 : workEmail.includes('@');

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-background via-background/98 to-muted/20 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-16 right-8 w-28 h-28 bg-gradient-to-br from-emerald-500/15 to-transparent rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
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
              onClick={onBack}
              className="p-2 rounded-xl bg-card/50 backdrop-blur-sm border border-border hover:bg-card/80 transition-all duration-200"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          </motion.div>

          <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20">
            Join Company
          </Badge>
        </div>

        <motion.div
          className="text-center mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <motion.div
            className="w-16 h-16 bg-gradient-to-br from-emerald-500/20 via-emerald-400/10 to-transparent rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm border border-emerald-500/20"
            whileHover={{ scale: 1.05, rotate: 5 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
          >
            <Building2 className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
          </motion.div>
          
          <h1 className="text-2xl mb-2">Join Your Company</h1>
          <p className="text-muted-foreground max-w-sm mx-auto">
            Connect with your team and start collaborating on company tasks and projects.
          </p>
        </motion.div>
      </motion.div>

      {/* Join Method Selection */}
      <motion.div
        className="px-6 mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="grid grid-cols-2 gap-3 p-1 bg-muted/50 rounded-2xl backdrop-blur-sm">
          {[
            { id: 'code', label: 'Company Code', icon: Key },
            { id: 'email', label: 'Work Email', icon: Mail }
          ].map((method) => {
            const IconComponent = method.icon;
            const isActive = joinMethod === method.id;
            
            return (
              <motion.div
                key={method.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <button
                  onClick={() => setJoinMethod(method.id as 'code' | 'email')}
                  className={`
                    relative py-3 px-4 rounded-xl text-sm transition-all duration-200 w-full
                    ${isActive 
                      ? 'bg-card text-foreground shadow-sm border border-border' 
                      : 'text-muted-foreground hover:text-foreground'
                    }
                  `}
                >
                  <div className="flex items-center justify-center space-x-2">
                    <IconComponent className="w-4 h-4" />
                    <span>{method.label}</span>
                  </div>
                  
                  {isActive && (
                    <motion.div
                      className="absolute inset-0 bg-primary/5 rounded-xl"
                      layoutId="activeJoinMethod"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                </button>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex-1 px-6">
        <motion.div
          className="space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <AnimatePresence mode="wait">
            {joinMethod === 'code' ? (
              <motion.div
                key="code"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="companyCode">Company Code</Label>
                  <Input
                    id="companyCode"
                    type="text"
                    placeholder="e.g., ACME123"
                    value={companyCode}
                    onChange={(e) => setCompanyCode(e.target.value.toUpperCase())}
                    className="h-12 text-base bg-input-background border-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                    disabled={isLoading}
                  />
                  <p className="text-xs text-muted-foreground">
                    Ask your company admin for the invitation code
                  </p>
                </div>

                {/* Example companies */}
                <div className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-4">
                  <p className="text-xs text-muted-foreground mb-3">Try demo code:</p>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <button
                      type="button"
                      onClick={() => setCompanyCode('ACME123')}
                      className="inline-flex items-center space-x-2 px-3 py-2 bg-primary/10 text-primary rounded-lg text-sm hover:bg-primary/20 transition-colors"
                    >
                      <Building2 className="w-4 h-4" />
                      <span>ACME123</span>
                    </button>
                  </motion.div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="email"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="workEmail">Work Email Address</Label>
                  <Input
                    id="workEmail"
                    type="email"
                    placeholder="john@company.com"
                    value={workEmail}
                    onChange={(e) => setWorkEmail(e.target.value)}
                    className="h-12 text-base bg-input-background border-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                    disabled={isLoading}
                  />
                  <p className="text-xs text-muted-foreground">
                    We'll match your email domain with registered companies
                  </p>
                </div>

                {/* Example domains */}
                <div className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-4">
                  <p className="text-xs text-muted-foreground mb-3">Try demo email:</p>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <button
                      type="button"
                      onClick={() => setWorkEmail('john@acme.com')}
                      className="inline-flex items-center space-x-2 px-3 py-2 bg-primary/10 text-primary rounded-lg text-sm hover:bg-primary/20 transition-colors"
                    >
                      <Mail className="w-4 h-4" />
                      <span>john@acme.com</span>
                    </button>
                  </motion.div>
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
              >
                <Alert className="border-destructive/20 bg-destructive/5">
                  <AlertCircle className="w-4 h-4 text-destructive" />
                  <AlertDescription className="text-destructive">
                    {error}
                  </AlertDescription>
                </Alert>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Submit Button */}
        <motion.div
          className="py-6 space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <motion.div
            whileHover={isFormValid && !isLoading ? { scale: 1.02, y: -2 } : undefined}
            whileTap={isFormValid && !isLoading ? { scale: 0.98 } : undefined}
          >
            <Button
              type="submit"
              disabled={!isFormValid || isLoading}
              className={`
                w-full py-4 text-lg rounded-2xl transition-all duration-300 relative overflow-hidden
                ${isFormValid && !isLoading
                  ? 'bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl'
                  : 'bg-muted text-muted-foreground cursor-not-allowed'
                }
              `}
            >
              {isLoading ? (
                <motion.div className="flex items-center justify-center space-x-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Requesting Access...</span>
                </motion.div>
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  <Users className="w-5 h-5" />
                  <span>Request Access</span>
                </div>
              )}
            </Button>
          </motion.div>

          {/* Alternative: Create Company */}
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-3">
              Don't have a company code or your company isn't registered?
            </p>
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                type="button"
                variant="outline"
                onClick={onCreateCompany}
                className="w-full py-3 rounded-xl border-dashed hover:border-solid transition-all duration-200"
              >
                <div className="flex items-center justify-center space-x-2">
                  <Shield className="w-4 h-4" />
                  <span>Create Your Company</span>
                </div>
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </form>
    </div>
  );
}