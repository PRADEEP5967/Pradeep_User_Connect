import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/LocalAuthContext';
import { ValidationErrors } from '@/types';
import { validateUserForm } from '@/utils/validation';
import { Eye, EyeOff, UserPlus, LogIn } from 'lucide-react';

interface RegisterFormProps {
  onSwitchToLogin: () => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ onSwitchToLogin }) => {
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    password: ''
  });
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    // Sanitize input - remove leading/trailing whitespace for non-address fields
    const sanitizedValue = name === 'address' ? value : value.trimStart();
    setFormData(prev => ({ ...prev, [name]: sanitizedValue }));
    
    // Clear errors when user starts typing
    if (errors[name as keyof ValidationErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = () => {
    const newErrors = validateUserForm(formData);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setIsLoading(true);
    await register(formData);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-primary/5 p-4 animate-fade-in">
      <Card className="w-full max-w-md shadow-strong hover-lift animate-scale-in">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold font-display text-gradient animate-fade-in-down">
            Create Account
          </CardTitle>
          <CardDescription className="text-base animate-fade-in-up">
            Join our store rating platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2 stagger-item">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="Enter your full name (min 3 characters)"
                value={formData.name}
                onChange={handleInputChange}
                className={`transition-smooth ${errors.name ? 'border-destructive' : ''}`}
                maxLength={100}
                autoComplete="name"
                required
              />
              {errors.name && (
                <p className="text-sm text-destructive animate-fade-in">{errors.name}</p>
              )}
            </div>

            <div className="space-y-2 stagger-item">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email address"
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

            <div className="space-y-2 stagger-item">
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                name="address"
                placeholder="Enter your full address (min 10, max 500 characters)"
                value={formData.address}
                onChange={handleInputChange}
                className={`transition-smooth ${errors.address ? 'border-destructive' : ''}`}
                rows={3}
                maxLength={500}
                autoComplete="street-address"
                required
              />
              {errors.address && (
                <p className="text-sm text-destructive animate-fade-in">{errors.address}</p>
              )}
            </div>
            
            <div className="space-y-2 stagger-item">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="8-16 chars, uppercase & special character"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`transition-smooth ${errors.password ? 'border-destructive pr-10' : 'pr-10'}`}
                  maxLength={16}
                  autoComplete="new-password"
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
              className="w-full gradient-primary hover:opacity-90 transition-smooth hover-glow stagger-item"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating Account...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <UserPlus className="w-4 h-4" />
                  Create Account
                </div>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center animate-fade-in-up">
            <p className="text-sm text-muted-foreground">
              Already have an account?{' '}
              <Button
                variant="link"
                className="p-0 text-primary font-medium transition-smooth hover-brightness"
                onClick={onSwitchToLogin}
              >
                <LogIn className="w-4 h-4 mr-1" />
                Sign In
              </Button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};