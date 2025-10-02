import React, { useState, useMemo } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { DashboardStats } from '@/components/modern/DashboardStats';
import { SearchFilters } from '@/components/modern/SearchFilters';
import { StoreComparison } from '@/components/modern/StoreComparison';
import { StoreMap } from '@/components/modern/StoreMap';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { StarRating } from '@/components/ui/star-rating';
import { useAuth } from '@/contexts/LocalAuthContext';
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
  Key,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Filter
} from 'lucide-react';

export const UserDashboard: React.FC = () => {  
  const { user, updatePassword } = useAuth();
  const [stores] = useState<Store[]>(getStores());
  const [ratings] = useState<Rating[]>(getRatings());
  
  const [searchTerm, setSearchTerm] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRatings, setSelectedRatings] = useState<{ [storeId: string]: number }>({});
  const [sortField, setSortField] = useState<'name' | 'averageRating' | 'totalRatings'>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [ratingFilter, setRatingFilter] = useState<'all' | 'rated' | 'unrated'>('all');
  const [compareStores, setCompareStores] = useState<Store[]>([]);
  const [showMap, setShowMap] = useState(false);
  const [selectedMapStore, setSelectedMapStore] = useState<Store | null>(null);
  const [filters, setFilters] = useState<any>({});

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

  // Filter and sort stores
  const filteredStores = useMemo(() => {
    let filtered = stores.filter(store => 
      store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      store.address.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Apply rating filter
    if (ratingFilter === 'rated') {
      filtered = filtered.filter(store => userRatings[store.id]);
    } else if (ratingFilter === 'unrated') {
      filtered = filtered.filter(store => !userRatings[store.id]);
    }

    // Sort stores
    filtered.sort((a, b) => {
      let aVal: string | number = a[sortField];
      let bVal: string | number = b[sortField];
      
      if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = (bVal as string).toLowerCase();
      }
      
      if (sortDirection === 'asc') {
        return aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
      } else {
        return aVal > bVal ? -1 : aVal < bVal ? 1 : 0;
      }
    });

    return filtered;
  }, [stores, searchTerm, sortField, sortDirection, ratingFilter, userRatings]);

  // Apply advanced filters
  const finalFilteredStores = useMemo(() => {
    let filtered = filteredStores;
    
    if (filters.search) {
      filtered = filtered.filter(store => 
        store.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        store.address.toLowerCase().includes(filters.search.toLowerCase())
      );
    }
    
    if (filters.rating && filters.rating[0] > 0) {
      filtered = filtered.filter(store => store.averageRating >= filters.rating[0]);
    }
    
    if (filters.location) {
      filtered = filtered.filter(store => 
        store.address.toLowerCase().includes(filters.location.toLowerCase())
      );
    }
    
    return filtered;
  }, [filteredStores, filters]);

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

  const handleSort = (field: typeof sortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (field: string) => {
    if (field !== sortField) return <ArrowUpDown className="w-4 h-4" />;
    return sortDirection === 'asc' ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />;
  };

  const handleAddToCompare = (store: Store) => {
    if (compareStores.length >= 4) {
      toast({
        title: 'Comparison Limit',
        description: 'You can compare up to 4 stores at once',
        variant: 'destructive',
      });
      return;
    }
    
    if (!compareStores.find(s => s.id === store.id)) {
      setCompareStores(prev => [...prev, store]);
      toast({
        title: 'Store Added',
        description: `${store.name} added to comparison`,
      });
    }
  };

  const handleRemoveFromCompare = (storeId: string) => {
    setCompareStores(prev => prev.filter(s => s.id !== storeId));
  };

  const userStats = {
    myRatings: Object.keys(userRatings).length,
  };

  if (!user) return null;

  return (
    <DashboardLayout title="User Dashboard" subtitle="Browse stores and submit your ratings">
      <div className="space-y-8">
        {/* Dashboard Stats */}
        <DashboardStats userRole="user" stats={userStats} />

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

        {/* Advanced Search & Filters */}
        <SearchFilters onFiltersChange={setFilters} />

        {/* Store Comparison */}
        {compareStores.length > 0 && (
          <StoreComparison
            stores={compareStores}
            onRemoveStore={handleRemoveFromCompare}
            onClearAll={() => setCompareStores([])}
          />
        )}

        {/* Map Toggle */}
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Store Directory</h2>
          <Button
            variant={showMap ? 'default' : 'outline'}
            onClick={() => setShowMap(!showMap)}
          >
            {showMap ? 'List View' : 'Map View'}
          </Button>
        </div>

        {/* Map View */}
        {showMap && (
          <StoreMap
            stores={finalFilteredStores}
            selectedStore={selectedMapStore}
            onStoreSelect={setSelectedMapStore}
          />
        )}

        {/* Store Listings */}
        {!showMap && (
          <Card>
          <CardHeader>
            <CardDescription>Browse and rate stores on our platform</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 mb-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <Select value={ratingFilter} onValueChange={(value: typeof ratingFilter) => setRatingFilter(value)}>
                  <SelectTrigger className="w-full sm:w-48">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Filter by rating status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Stores</SelectItem>
                    <SelectItem value="rated">Stores I've Rated</SelectItem>
                    <SelectItem value="unrated">Stores I Haven't Rated</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Sorting Controls */}
              <div className="flex flex-wrap gap-2 p-3 bg-muted/50 rounded-lg">
                <span className="text-sm font-medium text-muted-foreground">Sort by:</span>
                <Button
                  variant={sortField === 'name' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => handleSort('name')}
                  className="h-8 px-3"
                >
                  Name {getSortIcon('name')}
                </Button>
                <Button
                  variant={sortField === 'averageRating' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => handleSort('averageRating')}
                  className="h-8 px-3"
                >
                  Rating {getSortIcon('averageRating')}
                </Button>
                <Button
                  variant={sortField === 'totalRatings' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => handleSort('totalRatings')}
                  className="h-8 px-3"
                >
                  Reviews {getSortIcon('totalRatings')}
                </Button>
              </div>
            </div>

            <div className="space-y-6">
              {finalFilteredStores.map((store) => {
                const userRating = userRatings[store.id];
                const currentRating = selectedRatings[store.id] || userRating?.rating || 0;
                const isInComparison = compareStores.find(s => s.id === store.id);
                
                return (
                  <Card key={store.id} className="dashboard-card">
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div className="flex justify-between items-start">
                          <div className="space-y-2">
                            <h3 className="text-xl font-semibold">{store.name}</h3>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs">
                                {store.totalRatings} ratings
                              </Badge>
                              {!isInComparison && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleAddToCompare(store)}
                                >
                                  Compare
                                </Button>
                              )}
                              {isInComparison && (
                                <Badge variant="default" className="text-xs">
                                  In Comparison
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <MapPin className="w-4 h-4" />
                              <span>{store.address}</span>
                            </div>
                          </div>
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

              {finalFilteredStores.length === 0 && (
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
        )}
      </div>
    </DashboardLayout>
  );
};