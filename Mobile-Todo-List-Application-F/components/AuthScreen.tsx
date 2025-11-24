import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { CheckSquare, ArrowLeft, Eye, EyeOff } from 'lucide-react';

interface AuthScreenProps {
  onSignUpComplete: () => void;
  onSignInComplete: (userData: { id: string; name: string; email: string; role?: string }) => void;
  onBack: () => void;
  mode: 'signup' | 'signin';
}

export function AuthScreen({ onSignUpComplete, onSignInComplete, onBack, mode }: AuthScreenProps) {
  const [isSignUp, setIsSignUp] = useState(mode === 'signup');
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSignUp) {
      // For sign-up, always go to role selection
      onSignUpComplete();
    } else {
      // For sign-in, simulate retrieving existing user data and skip role selection
      const mockUserData = {
        id: `user_${Date.now()}`,
        name: name || 'John Doe',
        email: email,
        role: 'individual' // This would come from the backend
      };
      onSignInComplete(mockUserData);
    }
  };

  const handleSkipAuth = () => {
    // Skip authentication - this shouldn't go through auth flow
    // This will be handled by the parent component
    onBack();
  };

  const handleSocialAuth = (provider: 'google' | 'apple') => {
    // Simulate social authentication
    const mockUserData = {
      id: `${provider}_${Date.now()}`,
      name: provider === 'google' ? 'Google User' : 'Apple User',
      email: `user@${provider}.com`,
    };

    if (isSignUp) {
      // For social sign-up, still go to role selection
      onSignUpComplete();
    } else {
      // For social sign-in, simulate existing user and skip role selection
      onSignInComplete({
        ...mockUserData,
        role: 'individual' // This would come from the backend
      });
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        
        <Button variant="ghost" onClick={handleSkipAuth} className="text-primary">
          Skip
        </Button>
      </div>

      {/* Logo and Title */}
      <div className="flex flex-col items-center mb-8">
        <div className="w-16 h-16 bg-primary rounded-3xl flex items-center justify-center shadow-lg mb-4">
          <CheckSquare className="w-8 h-8 text-primary-foreground" />
        </div>
        
        <h1 className="text-2xl text-primary mb-2">TaskFlow</h1>
        <p className="text-muted-foreground text-center">
          {isSignUp ? 'Create your account to get started' : 'Welcome back! Sign in to continue'}
        </p>
      </div>

      {/* Auth Form */}
      <form onSubmit={handleSubmit} className="flex-1 space-y-6">
        {isSignUp && (
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-12 rounded-xl bg-input-background"
            />
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-12 rounded-xl bg-input-background"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-12 rounded-xl bg-input-background pr-12"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4 text-muted-foreground" />
              ) : (
                <Eye className="w-4 h-4 text-muted-foreground" />
              )}
            </Button>
          </div>
        </div>

        {!isSignUp && (
          <div className="text-right">
            <Button variant="ghost" className="text-primary p-0 h-auto">
              Forgot Password?
            </Button>
          </div>
        )}

        <Button type="submit" className="w-full h-12 rounded-xl">
          {isSignUp ? 'Create Account' : 'Sign In'}
        </Button>

        {/* Social Login */}
        <div className="space-y-3">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>

          <div className="flex space-x-3">
            <Button 
              variant="outline" 
              className="flex-1 h-12 rounded-xl"
              onClick={() => handleSocialAuth('google')}
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Google
            </Button>
            
            <Button 
              variant="outline" 
              className="flex-1 h-12 rounded-xl"
              onClick={() => handleSocialAuth('apple')}
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path fill="currentColor" d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
              </svg>
              Apple
            </Button>
          </div>
        </div>

        {/* Switch between Sign Up / Sign In */}
        <div className="text-center pt-6">
          <span className="text-muted-foreground">
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}
          </span>
          <Button
            type="button"
            variant="ghost"
            className="ml-1 text-primary p-0 h-auto"
            onClick={() => setIsSignUp(!isSignUp)}
          >
            {isSignUp ? 'Sign In' : 'Sign Up'}
          </Button>
        </div>
      </form>
    </div>
  );
}