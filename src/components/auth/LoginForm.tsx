import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/LocalAuthContext';
import { validateEmail } from '@/utils/validation';
import { Eye, EyeOff, LogIn, UserPlus } from 'lucide-react';

interface LoginFormProps {
  onSwitchToRegister: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSwitchToRegister }) => {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // Sanitize input - remove leading whitespace
    const sanitizedValue = value.trimStart();
    setFormData(prev => ({ ...prev, [name]: sanitizedValue }));
    
    // Clear errors when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};
    
    const emailError = validateEmail(formData.email);
    if (emailError) newErrors.email = emailError;
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setIsLoading(true);
    await login(formData.email, formData.password);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-primary/5 p-4 animate-fade-in">
      <Card className="w-full max-w-md shadow-strong hover-lift animate-scale-in">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold font-display text-gradient animate-fade-in-down">
            Store Rating Platform
          </CardTitle>
          <CardDescription className="text-base animate-fade-in-up">
            Sign in to your account to continue
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2 animate-slide-in-left">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleInputChange}
                className={`transition-smooth ${errors.email ? 'border-destructive' : ''}`}
                maxLength={255}
                autoComplete="email"
                required
              />
              {errors.email && (
                <p className="text-sm text-destructive animate-fade-in">{errors.email}</p>
              )}
            </div>
            
            <div className="space-y-2 animate-slide-in-right">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`transition-smooth ${errors.password ? 'border-destructive pr-10' : 'pr-10'}`}
                  maxLength={16}
                  autoComplete="current-password"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent transition-smooth"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground transition-transform hover:scale-110" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground transition-transform hover:scale-110" />
                  )}
                </Button>
              </div>
              {errors.password && (
                <p className="text-sm text-destructive animate-fade-in">{errors.password}</p>
              )}
            </div>

            <Button 
              type="submit" 
              className="w-full gradient-primary hover:opacity-90 transition-smooth hover-glow animate-fade-in-up"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Signing in...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <LogIn className="w-4 h-4" />
                  Sign In
                </div>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center animate-fade-in-up">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{' '}
              <Button
                variant="link"
                className="p-0 text-primary font-medium transition-smooth hover-brightness"
                onClick={onSwitchToRegister}
              >
                <UserPlus className="w-4 h-4 mr-1" />
                Create Account
              </Button>
            </p>
          </div>

          <div className="mt-4 p-4 bg-muted/50 rounded-lg animate-fade-in backdrop-blur-sm">
            <p className="text-xs text-muted-foreground font-medium mb-2">Demo Accounts:</p>
            <div className="space-y-1 text-xs text-muted-foreground">
              <p><strong>Admin:</strong> admin@system.com / Admin123!</p>
              <p><strong>Note:</strong> Create Store Owner accounts through Admin panel</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};