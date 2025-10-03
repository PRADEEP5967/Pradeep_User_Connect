import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { User, Mail, MapPin, Calendar, Star, Award, Settings } from 'lucide-react';

interface UserProfileProps {
  user: {
    id: string;
    name: string;
    email: string;
    address: string;
    role: string;
    created_at: string;
  };
  stats?: {
    totalRatings?: number;
    averageRating?: number;
    rank?: number;
  };
  onEditClick?: () => void;
  compact?: boolean;
}

export const UserProfile: React.FC<UserProfileProps> = ({
  user,
  stats,
  onEditClick,
  compact = false
}) => {
  const initials = user.name.split(' ').map(n => n[0]).join('').toUpperCase();
  const memberSince = new Date(user.created_at).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric'
  });

  const getRoleBadgeVariant = (role: string): "default" | "secondary" | "destructive" => {
    if (role === 'admin') return 'destructive';
    if (role === 'store_owner') return 'default';
    return 'secondary';
  };

  if (compact) {
    return (
      <Card className="hover-lift transition-smooth">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Avatar className="w-12 h-12 border-2 border-primary">
              <AvatarFallback className="bg-gradient-to-br from-primary to-primary/50 text-primary-foreground font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold">{user.name}</h3>
                <Badge variant={getRoleBadgeVariant(user.role)} className="text-xs">
                  {user.role.replace('_', ' ')}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="hover-lift transition-smooth border-2">
      <CardContent className="p-6">
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <Avatar className="w-20 h-20 border-4 border-primary">
              <AvatarFallback className="bg-gradient-to-br from-primary to-primary/50 text-primary-foreground text-2xl font-bold">
                {initials}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h2 className="text-2xl font-bold font-display">{user.name}</h2>
                  <Badge variant={getRoleBadgeVariant(user.role)} className="mt-1">
                    {user.role.replace('_', ' ').toUpperCase()}
                  </Badge>
                </div>
                {onEditClick && (
                  <Button onClick={onEditClick} variant="outline" size="sm" className="gap-2">
                    <Settings className="w-4 h-4" />
                    Edit
                  </Button>
                )}
              </div>
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Email</p>
                <p className="text-sm">{user.email}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Address</p>
                <p className="text-sm">{user.address}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Member Since</p>
                <p className="text-sm">{memberSince}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <User className="w-5 h-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">User ID</p>
                <p className="text-sm font-mono text-xs">{user.id.slice(0, 8)}...</p>
              </div>
            </div>
          </div>

          {stats && (
            <>
              <Separator />
              <div className="grid grid-cols-3 gap-4">
                {stats.totalRatings !== undefined && (
                  <div className="text-center p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Star className="w-4 h-4 text-primary" />
                    </div>
                    <p className="text-2xl font-bold">{stats.totalRatings}</p>
                    <p className="text-xs text-muted-foreground">Ratings</p>
                  </div>
                )}

                {stats.averageRating !== undefined && (
                  <div className="text-center p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Star className="w-4 h-4 text-yellow-500" />
                    </div>
                    <p className="text-2xl font-bold">{stats.averageRating.toFixed(1)}</p>
                    <p className="text-xs text-muted-foreground">Avg Rating</p>
                  </div>
                )}

                {stats.rank !== undefined && (
                  <div className="text-center p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Award className="w-4 h-4 text-blue-500" />
                    </div>
                    <p className="text-2xl font-bold">#{stats.rank}</p>
                    <p className="text-xs text-muted-foreground">Rank</p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
