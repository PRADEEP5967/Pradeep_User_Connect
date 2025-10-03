import React, { useState, useMemo } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { DashboardStats } from '@/components/modern/DashboardStats';
import { SearchFilters } from '@/components/modern/SearchFilters';
import { StoreComparison } from '@/components/modern/StoreComparison';
import { StoreMap } from '@/components/modern/StoreMap';
import { StoreDetailDialog } from '@/components/modern/StoreDetailDialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { StarRating } from '@/components/ui/star-rating';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { AnimatedCounter } from '@/components/ui/animated-counter';
import { useAuth } from '@/contexts/LocalAuthContext';
import {
  getStores,
  getRatings,
  addRating,
} from '@/utils/localStorage';
import { Store, Rating } from '@/types';
import { toast } from '@/hooks/use-toast';
import { validatePassword } from '@/utils/validation';
import { Search, MapPin, Star, Eye, EyeOff, Key, ArrowUpDown, ArrowUp, ArrowDown, Filter, Heart, TrendingUp, Clock, Zap, BookmarkPlus, Award, Activity, Grid3x3 as Grid3X3, List, Mail, Phone, MessageSquare, Info } from 'lucide-react';

export const UserDashboard: React.FC = () => {
  const { user, updatePassword } = useAuth();
  const [stores] = useState<Store[]>(getStores());
  const [ratings] = useState<Rating[]>(getRatings());

  const [searchTerm, setSearchTerm] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRatings, setSelectedRatings] = useState<{ [storeId: string]: number }>({});
  const [sortField, setSortField] = useState<'name' | 'averageRating' | 'totalRatings'>('averageRating');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [ratingFilter, setRatingFilter] = useState<'all' | 'rated' | 'unrated'>('all');
  const [compareStores, setCompareStores] = useState<Store[]>([]);
  const [showMap, setShowMap] = useState(false);
  const [selectedMapStore, setSelectedMapStore] = useState<Store | null>(null);
  const [filters, setFilters] = useState<any>({});
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [activeTab, setActiveTab] = useState('all-stores');
  const [ratingComments, setRatingComments] = useState<{ [storeId: string]: string }>({});
  const [detailStore, setDetailStore] = useState<Store | null>(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);

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

  const filteredStores = useMemo(() => {
    let filtered = stores.filter(store =>
      store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      store.address.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (ratingFilter === 'rated') {
      filtered = filtered.filter(store => userRatings[store.id]);
    } else if (ratingFilter === 'unrated') {
      filtered = filtered.filter(store => !userRatings[store.id]);
    }

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

    if (filters.location && filters.location !== 'all') {
      filtered = filtered.filter(store =>
        store.address.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    return filtered;
  }, [filteredStores, filters]);

  const recentlyRatedStores = useMemo(() => {
    const recent = Object.values(userRatings)
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, 5)
      .map(rating => stores.find(s => s.id === rating.storeId))
      .filter(Boolean) as Store[];
    return recent;
  }, [userRatings, stores]);

  const topRatedStores = useMemo(() => {
    return [...stores]
      .sort((a, b) => b.averageRating - a.averageRating)
      .slice(0, 6);
  }, [stores]);

  const favoriteStores = useMemo(() => {
    return stores.filter(store => favorites.has(store.id));
  }, [stores, favorites]);

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
        rating,
        comment: ratingComments[storeId] || undefined
      });

      toast({
        title: 'Rating Submitted',
        description: 'Your rating has been submitted successfully',
      });

      setSelectedRatings(prev => ({ ...prev, [storeId]: 0 }));
      setRatingComments(prev => ({ ...prev, [storeId]: '' }));
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
      setSortDirection('desc');
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

  const toggleFavorite = (storeId: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(storeId)) {
        newFavorites.delete(storeId);
        toast({ title: 'Removed from favorites' });
      } else {
        newFavorites.add(storeId);
        toast({ title: 'Added to favorites' });
      }
      return newFavorites;
    });
  };

  const userStats = {
    myRatings: Object.keys(userRatings).length,
  };

  const renderStoreCard = (store: Store) => {
    const userRating = userRatings[store.id];
    const currentRating = selectedRatings[store.id] || userRating?.rating || 0;
    const isInComparison = compareStores.find(s => s.id === store.id);
    const isFavorite = favorites.has(store.id);

    return (
      <Card key={store.id} className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/50">
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <div className="flex-1 space-y-2">
                <div className="flex items-start justify-between">
                  <h3 className="text-xl font-bold group-hover:text-primary transition-colors">{store.name}</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="ml-2"
                    onClick={() => toggleFavorite(store.id)}
                  >
                    <Heart className={`w-5 h-5 transition-all ${isFavorite ? 'fill-red-500 text-red-500' : 'text-muted-foreground'}`} />
                  </Button>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <div className="flex items-center gap-1 bg-primary/10 px-3 py-1 rounded-full">
                    <Star className="w-4 h-4 fill-primary text-primary" />
                    <span className="font-bold text-primary">{store.averageRating.toFixed(1)}</span>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    <AnimatedCounter value={store.totalRatings} /> reviews
                  </Badge>
                  {userRating && (
                    <Badge variant="default" className="text-xs">
                      <Award className="w-3 h-3 mr-1" />
                      You rated {userRating.rating}★
                    </Badge>
                  )}
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  <span>{store.address}</span>
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="w-4 h-4" />
                  <span>{store.email}</span>
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Overall Rating:</span>
                <StarRating rating={store.averageRating} readonly size="sm" />
              </div>

              {userRating && (
                <div className="p-3 bg-primary/5 rounded-lg border border-primary/20">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">Your Rating:</span>
                      <StarRating rating={userRating.rating} readonly size="sm" />
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {new Date(userRating.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              )}

              <div className="border-t pt-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">
                      {userRating ? 'Update Your Rating:' : 'Rate This Store:'}
                    </span>
                    <StarRating
                      rating={currentRating}
                      onRatingChange={(rating) => handleRatingChange(store.id, rating)}
                      size="md"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`comment-${store.id}`} className="text-sm font-medium flex items-center gap-2">
                      <MessageSquare className="w-4 h-4" />
                      Add a Review (Optional)
                    </Label>
                    <Textarea
                      id={`comment-${store.id}`}
                      placeholder="Share your experience with this store..."
                      value={ratingComments[store.id] || ''}
                      onChange={(e) => setRatingComments(prev => ({ ...prev, [store.id]: e.target.value }))}
                      className="min-h-[80px]"
                      maxLength={500}
                    />
                    <p className="text-xs text-muted-foreground">
                      {ratingComments[store.id]?.length || 0}/500 characters
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleRatingSubmit(store.id)}
                      disabled={!selectedRatings[store.id]}
                      className="flex-1"
                      size="sm"
                    >
                      <Star className="w-4 h-4 mr-2" />
                      {userRating ? 'Update Rating' : 'Submit Rating'}
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setDetailStore(store);
                        setShowDetailDialog(true);
                      }}
                    >
                      <Info className="w-4 h-4 mr-2" />
                      Details
                    </Button>

                    {!isInComparison ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleAddToCompare(store)}
                      >
                        <TrendingUp className="w-4 h-4" />
                      </Button>
                    ) : (
                      <Button variant="secondary" size="sm" disabled>
                        <Badge className="text-xs">In Compare</Badge>
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  if (!user) return null;

  return (
    <DashboardLayout title="User Dashboard" subtitle="Discover and rate amazing stores">
      <div className="space-y-8">
        <DashboardStats userRole="user" stats={userStats} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader className="bg-gradient-to-r from-primary/10 to-transparent">
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-primary" />
                Quick Actions
              </CardTitle>
              <CardDescription>Common tasks and shortcuts</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button
                  variant="outline"
                  className="h-auto flex-col gap-2 p-4 hover:bg-primary/10"
                  onClick={() => setActiveTab('top-rated')}
                >
                  <TrendingUp className="w-6 h-6 text-primary" />
                  <span className="text-sm font-medium">Top Rated</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-auto flex-col gap-2 p-4 hover:bg-primary/10"
                  onClick={() => setActiveTab('recent')}
                >
                  <Clock className="w-6 h-6 text-blue-500" />
                  <span className="text-sm font-medium">Recent</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-auto flex-col gap-2 p-4 hover:bg-primary/10"
                  onClick={() => setActiveTab('favorites')}
                >
                  <Heart className="w-6 h-6 text-red-500" />
                  <span className="text-sm font-medium">Favorites</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-auto flex-col gap-2 p-4 hover:bg-primary/10"
                  onClick={() => setShowMap(!showMap)}
                >
                  <MapPin className="w-6 h-6 text-green-500" />
                  <span className="text-sm font-medium">Map View</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="bg-gradient-to-r from-blue-500/10 to-transparent">
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-500" />
                Your Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium">Total Ratings</span>
                  </div>
                  <Badge variant="secondary">
                    <AnimatedCounter value={Object.keys(userRatings).length} />
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Heart className="w-4 h-4 text-red-500" />
                    <span className="text-sm font-medium">Favorites</span>
                  </div>
                  <Badge variant="secondary">
                    <AnimatedCounter value={favorites.size} />
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-green-500" />
                    <span className="text-sm font-medium">Comparing</span>
                  </div>
                  <Badge variant="secondary">
                    <AnimatedCounter value={compareStores.length} />
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

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

        <SearchFilters onFiltersChange={setFilters} />

        {compareStores.length > 0 && (
          <StoreComparison
            stores={compareStores}
            onRemoveStore={handleRemoveFromCompare}
            onClearAll={() => setCompareStores([])}
          />
        )}

        {showMap && (
          <StoreMap
            stores={finalFilteredStores}
            selectedStore={selectedMapStore}
            onStoreSelect={setSelectedMapStore}
          />
        )}

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Store Directory</CardTitle>
                <CardDescription>Browse and rate stores on our platform</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  <List className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="all-stores">All Stores</TabsTrigger>
                <TabsTrigger value="top-rated">Top Rated</TabsTrigger>
                <TabsTrigger value="recent">Recent</TabsTrigger>
                <TabsTrigger value="favorites">Favorites</TabsTrigger>
              </TabsList>

              <TabsContent value="all-stores" className="mt-6">
                <div className="space-y-4 mb-6">
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
                    <Separator orientation="vertical" className="h-8" />
                    <Select value={ratingFilter} onValueChange={(value: typeof ratingFilter) => setRatingFilter(value)}>
                      <SelectTrigger className="w-48 h-8">
                        <Filter className="h-4 w-4 mr-2" />
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Stores</SelectItem>
                        <SelectItem value="rated">I've Rated</SelectItem>
                        <SelectItem value="unrated">Not Rated Yet</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-6' : 'space-y-6'}>
                  {finalFilteredStores.map(renderStoreCard)}
                </div>

                {finalFilteredStores.length === 0 && (
                  <Card className="border-dashed">
                    <CardContent className="p-12 text-center">
                      <Search className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                      <h3 className="text-lg font-semibold mb-2">No stores found</h3>
                      <p className="text-muted-foreground">Try adjusting your filters or search terms</p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="top-rated" className="mt-6">
                <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-6' : 'space-y-6'}>
                  {topRatedStores.map(renderStoreCard)}
                </div>
              </TabsContent>

              <TabsContent value="recent" className="mt-6">
                {recentlyRatedStores.length > 0 ? (
                  <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-6' : 'space-y-6'}>
                    {recentlyRatedStores.map(renderStoreCard)}
                  </div>
                ) : (
                  <Card className="border-dashed">
                    <CardContent className="p-12 text-center">
                      <Clock className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                      <h3 className="text-lg font-semibold mb-2">No recent ratings</h3>
                      <p className="text-muted-foreground">Start rating stores to see them here</p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="favorites" className="mt-6">
                {favoriteStores.length > 0 ? (
                  <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-6' : 'space-y-6'}>
                    {favoriteStores.map(renderStoreCard)}
                  </div>
                ) : (
                  <Card className="border-dashed">
                    <CardContent className="p-12 text-center">
                      <Heart className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                      <h3 className="text-lg font-semibold mb-2">No favorites yet</h3>
                      <p className="text-muted-foreground">Click the heart icon on stores to add them to favorites</p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <StoreDetailDialog
          store={detailStore}
          open={showDetailDialog}
          onOpenChange={setShowDetailDialog}
          ratings={ratings}
        />
      </div>
    </DashboardLayout>
  );
};
