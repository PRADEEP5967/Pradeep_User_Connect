import React, { useState, useMemo } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { DashboardStats } from '@/components/modern/DashboardStats';
import { ReviewSystem } from '@/components/modern/ReviewSystem';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { StarRating } from '@/components/ui/star-rating';
import { StoreRatingChart } from '@/components/analytics/StoreRatingChart';
import { useAuth } from '@/contexts/AuthContext';
import { 
  getStores, 
  getRatings,
  getUsers
} from '@/utils/localStorage';
import { Store, Rating, User } from '@/types';
import { toast } from '@/hooks/use-toast';
import { validatePassword } from '@/utils/validation';
import { Star, Users, ChartBar as BarChart3, TrendingUp, Eye, EyeOff, Key } from 'lucide-react';

export const StoreOwnerDashboard: React.FC = () => {
  const { user, updatePassword } = useAuth();
  const [stores] = useState<Store[]>(getStores());
  const [ratings] = useState<Rating[]>(getRatings());
  const [users] = useState<User[]>(getUsers());
  
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Get owner's store
  const ownerStore = useMemo(() => {
    if (!user) return null;
    return stores.find(store => store.ownerId === user.id) || null;
  }, [stores, user]);

  // Get ratings for owner's store
  const storeRatings = useMemo(() => {
    if (!ownerStore) return [];
    return ratings.filter(rating => rating.storeId === ownerStore.id);
  }, [ratings, ownerStore]);

  // Get users who rated the store
  const ratingUsers = useMemo(() => {
    return storeRatings.map(rating => {
      const ratingUser = users.find(u => u.id === rating.userId);
      return {
        ...rating,
        user: ratingUser
      };
    }).filter(item => item.user);
  }, [storeRatings, users]);

  // Calculate statistics and rating distribution
  const stats = useMemo(() => {
    if (!ownerStore) return { 
      averageRating: 0, 
      totalRatings: 0, 
      recentRatings: 0,
      ratingDistribution: []
    };
    
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const recentRatings = storeRatings.filter(rating => 
      new Date(rating.createdAt) > thirtyDaysAgo
    ).length;

    // Calculate rating distribution
    const ratingCounts = [1, 2, 3, 4, 5].map(rating => ({
      rating,
      count: storeRatings.filter(r => r.rating === rating).length
    }));

    const ratingDistribution = ratingCounts.map(item => ({
      ...item,
      percentage: ownerStore.totalRatings > 0 ? (item.count / ownerStore.totalRatings) * 100 : 0
    }));

    return {
      averageRating: ownerStore.averageRating,
      totalRatings: ownerStore.totalRatings,
      recentRatings,
      ratingDistribution
    };
  }, [ownerStore, storeRatings]);

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const passwordError = validatePassword(newPassword);
    if (passwordError) {
      toast({
        title: 'Validation Error',
        description: passwordError,
        variant: 'destructive',
      });
      return;
    }

    const success = await updatePassword(newPassword);
    if (success) {
      setNewPassword('');
    }
  };

  if (!user) return null;

  if (!ownerStore) {
    return (
      <DashboardLayout title="Store Owner Dashboard" subtitle="Manage your store and view customer feedback">
        <Card>
          <CardContent className="p-8 text-center">
            <div className="text-muted-foreground">
              <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium mb-2">No Store Assigned</p>
              <p>Please contact an administrator to assign a store to your account.</p>
            </div>
          </CardContent>
        </Card>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Store Owner Dashboard" subtitle={`Managing ${ownerStore.name}`}>
      <div className="space-y-8">
        {/* Enhanced Dashboard Stats */}
        <DashboardStats 
          userRole="store_owner" 
          stats={{
            myStoreRating: stats.averageRating,
            myStoreReviews: stats.totalRatings
          }} 
        />

        {/* Statistics Cards */}

        {/* Password Update Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="w-5 h-5" />
              Update Password
            </CardTitle>
            <CardDescription>Change your account password</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordUpdate} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <div className="relative">
                  <Input
                    id="new-password"
                    type={showPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="8-16 chars, uppercase & special character"
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>
              <Button type="submit" disabled={!newPassword}>
                Update Password
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Store Information */}
        <Card>
          <CardHeader>
            <CardTitle>Store Information</CardTitle>
            <CardDescription>Your store details and performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Store Name</Label>
                  <p className="text-lg font-semibold">{ownerStore.name}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Email</Label>
                  <p className="text-lg">{ownerStore.email}</p>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Address</Label>
                <p className="text-lg">{ownerStore.address}</p>
              </div>
              <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-2">
                  <StarRating rating={ownerStore.averageRating} readonly />
                  <span className="text-lg font-semibold">{ownerStore.averageRating.toFixed(1)}</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  Based on {ownerStore.totalRatings} customer ratings
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Rating Distribution Chart */}
        {stats.totalRatings > 0 && (
          <StoreRatingChart
            ratings={stats.ratingDistribution}
            totalRatings={stats.totalRatings}
            averageRating={stats.averageRating}
          />
        )}

        {/* Enhanced Review System */}
        <ReviewSystem
          storeId={ownerStore.id}
          storeName={ownerStore.name}
          reviews={ratingUsers.map(item => ({
            id: item.id,
            userId: item.userId,
            userName: item.user?.name || 'Anonymous',
            rating: item.rating,
            comment: `Great experience! Rated ${item.rating} stars.`,
            date: item.updatedAt,
            helpful: Math.floor(Math.random() * 20),
            notHelpful: Math.floor(Math.random() * 5),
            verified: true,
            tags: ['Great Service', 'Professional']
          }))}
          onSubmitReview={() => {}}
          canReview={false}
        />
      </div>
    </DashboardLayout>
  );
};