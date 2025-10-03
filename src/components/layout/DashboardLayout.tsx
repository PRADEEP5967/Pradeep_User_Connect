import React from 'react';
import { Button } from '@/components/ui/button';
import { NotificationSystem } from '@/components/notifications/NotificationSystem';
import { useAuth } from '@/contexts/LocalAuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { LogOut, User, Settings, UserCircle, Trophy, FileText } from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  title,
  subtitle
}) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <header className="bg-card shadow-soft border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-bold gradient-primary bg-clip-text text-transparent">
                Store Rating Platform
              </h1>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant={location.pathname === '/profile' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => navigate('/profile')}
                className="flex items-center gap-2"
              >
                <UserCircle className="w-4 h-4" />
                <span className="hidden md:inline">Profile</span>
              </Button>

              <Button
                variant={location.pathname === '/leaderboard' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => navigate('/leaderboard')}
                className="flex items-center gap-2"
              >
                <Trophy className="w-4 h-4" />
                <span className="hidden md:inline">Leaderboard</span>
              </Button>

              {user?.role === 'admin' && (
                <Button
                  variant={location.pathname === '/reports' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => navigate('/reports')}
                  className="flex items-center gap-2"
                >
                  <FileText className="w-4 h-4" />
                  <span className="hidden md:inline">Reports</span>
                </Button>
              )}

              <Button
                variant={location.pathname === '/settings' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => navigate('/settings')}
                className="flex items-center gap-2"
              >
                <Settings className="w-4 h-4" />
                <span className="hidden md:inline">Settings</span>
              </Button>

              <NotificationSystem />

              <div className="flex items-center space-x-2 text-sm border-l pl-2">
                <User className="w-4 h-4 text-muted-foreground" />
                <span className="text-foreground font-medium hidden lg:inline">{user?.name}</span>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={logout}
                className="flex items-center space-x-2"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden md:inline">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground">{title}</h2>
          {subtitle && (
            <p className="text-muted-foreground text-lg mt-2">{subtitle}</p>
          )}
        </div>
        
        {children}
      </main>

      <footer className="border-t bg-card mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-semibold text-foreground mb-4">About</h3>
              <p className="text-sm text-muted-foreground">
                Store Rating Platform - Empowering customers and store owners through transparent, reliable ratings.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="/about" className="text-muted-foreground hover:text-primary transition-colors">About Us</a></li>
                <li><a href="/help" className="text-muted-foreground hover:text-primary transition-colors">Help Center</a></li>
                <li><a href="/contact" className="text-muted-foreground hover:text-primary transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-4">Legal</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="/privacy" className="text-muted-foreground hover:text-primary transition-colors">Privacy Policy</a></li>
                <li><a href="/terms" className="text-muted-foreground hover:text-primary transition-colors">Terms of Service</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-4">Connect</h3>
              <p className="text-sm text-muted-foreground">
                Email: pradeepsahani8130s@gmail.com<br />
                Phone: +91 8130885013
              </p>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} Store Rating Platform. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};