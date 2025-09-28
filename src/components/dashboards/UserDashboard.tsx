import React, { useState, useMemo } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { StarRating } from '@/components/ui/star-rating';
import { useAuth } from '@/contexts/AuthContext';
import { 
  getStores, 
  getRatings,
  addRating,
  getUserRating
} from '@/utils/localStorage';
import { Store, Rating } from '@/types';
import { toast } from '@/hooks/use-toast';
import { validatePassword } from '@/utils/validation';
import { 
  Search, 
  MapPin, 
  Star,
  Eye,
  EyeOff,
  Key
} from 'lucide-react';

export const UserDashboard: React.FC = () => {  
  const { user, updatePassword } = useAuth();
  const [stores] = useState<Store[]>(getStores());
  const [ratings] = useState<Rating[]>(getRatings());
  
  const [searchTerm, setSearchTerm] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRatings, setSelectedRatings] = useState<{ [storeId: string]: number }>({});

  // Filter stores based on search
  const filteredStores = useMemo(() => {
    return stores.filter(store => 
      store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      store.address.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [stores, searchTerm]);

  // Get user's ratings
  const userRatings = useMemo(() => {
    if (!user) return {};
    const userRatingMap: { [storeId: string]: Rating } = {};
    ratings.forEach(rating => {
      if (rating.userId === user.id) {
        userRatingMap[rating.storeId] = rating;
      }
    });
    return userRatingMap;
  }, [ratings, user]);

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

  const handleRatingSubmit = (storeId: string) => {
    if (!user) return;
    
    const rating = selectedRatings[storeId];
    if (!rating) {
      toast({
        title: 'Please Select Rating',
        description: 'Please select a rating between 1 and 5 stars',
        variant: 'destructive',
      });
      return;
    }

    try {
      addRating({
        userId: user.id,
        storeId,
        rating
      });
      
      toast({
        title: 'Rating Submitted',
        description: 'Your rating has been submitted successfully',
      });
      
      // Clear selected rating and refresh page to show updated data
      setSelectedRatings(prev => ({ ...prev, [storeId]: 0 }));
      setTimeout(() => window.location.reload(), 1000);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to submit rating',
        variant: 'destructive',
      });
    }
  };

  const handleRatingChange = (storeId: string, rating: number) => {
    setSelectedRatings(prev => ({ ...prev, [storeId]: rating }));
  };

  if (!user) return null;

  return (
    <DashboardLayout title="User Dashboard" subtitle="Browse stores and submit your ratings">
      <div className="space-y-8">
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

        {/* Store Listings */}
        <Card>
          <CardHeader>
            <CardTitle>Store Directory</CardTitle>
            <CardDescription>Browse and rate stores on our platform</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search stores by name or address..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            <div className="space-y-6">
              {filteredStores.map((store) => {
                const userRating = userRatings[store.id];
                const currentRating = selectedRatings[store.id] || userRating?.rating || 0;
                
                return (
                  <Card key={store.id} className="dashboard-card">
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div className="flex justify-between items-start">
                          <div className="space-y-2">
                            <h3 className="text-xl font-semibold">{store.name}</h3>
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <MapPin className="w-4 h-4" />
                              <span>{store.address}</span>
                            </div>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {store.totalRatings} ratings
                          </Badge>
                        </div>

                        <div className="space-y-3">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium">Overall Rating:</span>
                              <StarRating rating={store.averageRating} readonly size="sm" />
                              <span className="text-sm text-muted-foreground">
                                ({store.averageRating.toFixed(1)})
                              </span>
                            </div>
                          </div>

                          {userRating && (
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium">Your Rating:</span>
                                <StarRating rating={userRating.rating} readonly size="sm" />
                                <span className="text-sm text-muted-foreground">
                                  (Submitted {new Date(userRating.updatedAt).toLocaleDateString()})
                                </span>
                              </div>
                            </div>
                          )}

                          <div className="border-t pt-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <span className="text-sm font-medium">
                                  {userRating ? 'Update Your Rating:' : 'Rate This Store:'}
                                </span>
                                <StarRating
                                  rating={currentRating}
                                  onRatingChange={(rating) => handleRatingChange(store.id, rating)}
                                  size="md"
                                />
                              </div>
                              <Button
                                onClick={() => handleRatingSubmit(store.id)}
                                disabled={!selectedRatings[store.id]}
                                size="sm"
                                className="ml-4"
                              >
                                <Star className="w-4 h-4 mr-2" />
                                {userRating ? 'Update Rating' : 'Submit Rating'}
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}

              {filteredStores.length === 0 && (
                <Card className="dashboard-card">
                  <CardContent className="p-8 text-center">
                    <div className="text-muted-foreground">
                      <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p className="text-lg font-medium mb-2">No stores found</p>
                      <p>Try adjusting your search terms</p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};