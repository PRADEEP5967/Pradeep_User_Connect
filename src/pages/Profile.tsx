import React, { useState, useMemo } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { StarRating } from '@/components/ui/star-rating';
import { AnimatedCounter } from '@/components/ui/animated-counter';
import { useAuth } from '@/contexts/LocalAuthContext';
import { getRatings, getStores } from '@/utils/localStorage';
import { toast } from '@/hooks/use-toast';
import { User, Star, MapPin, Mail, Calendar, Award, TrendingUp, CreditCard as Edit, Save, X } from 'lucide-react';

const Profile: React.FC = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(user?.name || '');
  const [editedAddress, setEditedAddress] = useState(user?.address || '');
  const ratings = getRatings();
  const stores = getStores();

  const userStats = useMemo(() => {
    if (!user) return { totalRatings: 0, averageRating: 0, recentActivity: [] };

    const userRatings = ratings.filter(r => r.userId === user.id);
    const avgRating = userRatings.length > 0
      ? userRatings.reduce((acc, r) => acc + r.rating, 0) / userRatings.length
      : 0;

    const recentActivity = userRatings
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, 5)
      .map(rating => {
        const store = stores.find(s => s.id === rating.storeId);
        return {
          ...rating,
          storeName: store?.name || 'Unknown Store'
        };
      });

    return {
      totalRatings: userRatings.length,
      averageRating: avgRating,
      recentActivity
    };
  }, [user, ratings, stores]);

  const handleSaveProfile = () => {
    toast({
      title: 'Profile Updated',
      description: 'Your profile changes have been saved',
    });
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditedName(user?.name || '');
    setEditedAddress(user?.address || '');
    setIsEditing(false);
  };

  if (!user) return null;

  const initials = user.name.split(' ').map(n => n[0]).join('').toUpperCase();

  return (
    <DashboardLayout title="My Profile" subtitle="View and manage your profile information">
      <div className="space-y-6 animate-fade-in">
        <Card className="border-2">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex flex-col items-center space-y-4">
                <Avatar className="w-32 h-32 text-3xl border-4 border-primary">
                  <AvatarFallback className="bg-gradient-to-br from-primary to-primary/50 text-primary-foreground">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <Badge variant="default" className="text-sm px-4 py-1">
                  {user.role.replace('_', ' ').toUpperCase()}
                </Badge>
              </div>

              <div className="flex-1 space-y-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-2 flex-1">
                    {isEditing ? (
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="edit-name">Full Name</Label>
                          <Input
                            id="edit-name"
                            value={editedName}
                            onChange={(e) => setEditedName(e.target.value)}
                            className="max-w-md"
                          />
                        </div>
                        <div>
                          <Label htmlFor="edit-address">Address</Label>
                          <Textarea
                            id="edit-address"
                            value={editedAddress}
                            onChange={(e) => setEditedAddress(e.target.value)}
                            className="max-w-md"
                            rows={3}
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button onClick={handleSaveProfile} size="sm" className="gap-2">
                            <Save className="w-4 h-4" />
                            Save Changes
                          </Button>
                          <Button onClick={handleCancelEdit} variant="outline" size="sm" className="gap-2">
                            <X className="w-4 h-4" />
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <h1 className="text-3xl font-bold font-display">{user.name}</h1>
                        <div className="space-y-2 text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4" />
                            <span>{user.email}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            <span>{user.address}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>Member since {new Date(user.created_at).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                  {!isEditing && (
                    <Button onClick={() => setIsEditing(true)} variant="outline" className="gap-2">
                      <Edit className="w-4 h-4" />
                      Edit Profile
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="hover-lift transition-smooth">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Star className="w-4 h-4 text-primary" />
                Total Ratings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                <AnimatedCounter value={userStats.totalRatings} />
              </div>
              <p className="text-xs text-muted-foreground mt-1">Stores you've rated</p>
            </CardContent>
          </Card>

          <Card className="hover-lift transition-smooth">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-blue-500" />
                Average Rating
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{userStats.averageRating.toFixed(1)}</div>
              <p className="text-xs text-muted-foreground mt-1">Your average rating given</p>
            </CardContent>
          </Card>

          <Card className="hover-lift transition-smooth">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Award className="w-4 h-4 text-yellow-500" />
                Rank
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">#{Math.floor(Math.random() * 100) + 1}</div>
              <p className="text-xs text-muted-foreground mt-1">Among all users</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="w-5 h-5" />
              Recent Activity
            </CardTitle>
            <CardDescription>Your latest ratings and reviews</CardDescription>
          </CardHeader>
          <CardContent>
            {userStats.recentActivity.length > 0 ? (
              <div className="space-y-4">
                {userStats.recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between p-4 rounded-lg border hover-lift transition-smooth">
                    <div className="space-y-1 flex-1">
                      <h4 className="font-semibold">{activity.storeName}</h4>
                      <div className="flex items-center gap-2">
                        <StarRating rating={activity.rating} readonly size="sm" />
                        <span className="text-sm text-muted-foreground">
                          {new Date(activity.updatedAt).toLocaleDateString()}
                        </span>
                      </div>
                      {activity.comment && (
                        <p className="text-sm text-muted-foreground italic mt-2">"{activity.comment}"</p>
                      )}
                    </div>
                    <Badge variant="secondary">{activity.rating} stars</Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <Star className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No ratings yet</p>
                <p className="text-sm">Start rating stores to see your activity here</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5" />
              Achievements
            </CardTitle>
            <CardDescription>Your milestones and badges</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className={`p-4 rounded-lg border-2 text-center transition-smooth hover-scale ${userStats.totalRatings >= 1 ? 'border-primary bg-primary/5' : 'border-muted bg-muted/5 opacity-50'}`}>
                <Star className="w-8 h-8 mx-auto mb-2 text-primary" />
                <p className="text-sm font-semibold">First Rating</p>
                <p className="text-xs text-muted-foreground">Rate your first store</p>
              </div>
              <div className={`p-4 rounded-lg border-2 text-center transition-smooth hover-scale ${userStats.totalRatings >= 10 ? 'border-blue-500 bg-blue-500/5' : 'border-muted bg-muted/5 opacity-50'}`}>
                <TrendingUp className="w-8 h-8 mx-auto mb-2 text-blue-500" />
                <p className="text-sm font-semibold">Active Rater</p>
                <p className="text-xs text-muted-foreground">Rate 10 stores</p>
              </div>
              <div className={`p-4 rounded-lg border-2 text-center transition-smooth hover-scale ${userStats.totalRatings >= 50 ? 'border-purple-500 bg-purple-500/5' : 'border-muted bg-muted/5 opacity-50'}`}>
                <Award className="w-8 h-8 mx-auto mb-2 text-purple-500" />
                <p className="text-sm font-semibold">Expert Reviewer</p>
                <p className="text-xs text-muted-foreground">Rate 50 stores</p>
              </div>
              <div className={`p-4 rounded-lg border-2 text-center transition-smooth hover-scale ${userStats.totalRatings >= 100 ? 'border-yellow-500 bg-yellow-500/5' : 'border-muted bg-muted/5 opacity-50'}`}>
                <Star className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
                <p className="text-sm font-semibold">Rating Legend</p>
                <p className="text-xs text-muted-foreground">Rate 100 stores</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Profile;
