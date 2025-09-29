import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { StarRating } from '@/components/ui/star-rating';
import { Separator } from '@/components/ui/separator';
import { Store } from '@/types';
import { GitCompare as Compare, X, MapPin, Star, Users, Calendar, Award, TrendingUp, CircleCheck as CheckCircle, Circle as XCircle } from 'lucide-react';

interface StoreComparisonProps {
  stores: Store[];
  onRemoveStore: (storeId: string) => void;
  onClearAll: () => void;
}

export const StoreComparison: React.FC<StoreComparisonProps> = ({
  stores,
  onRemoveStore,
  onClearAll
}) => {
  if (stores.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Compare className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">No Stores to Compare</h3>
          <p className="text-muted-foreground">
            Select stores from the directory to compare their ratings and features
          </p>
        </CardContent>
      </Card>
    );
  }

  const getPerformanceIndicator = (rating: number) => {
    if (rating >= 4.5) return { icon: Award, color: 'text-green-600', label: 'Excellent' };
    if (rating >= 4.0) return { icon: TrendingUp, color: 'text-blue-600', label: 'Very Good' };
    if (rating >= 3.5) return { icon: CheckCircle, color: 'text-yellow-600', label: 'Good' };
    return { icon: XCircle, color: 'text-red-600', label: 'Needs Improvement' };
  };

  const getBestInCategory = (category: string) => {
    switch (category) {
      case 'rating':
        return stores.reduce((best, store) => 
          store.averageRating > best.averageRating ? store : best
        );
      case 'reviews':
        return stores.reduce((best, store) => 
          store.totalRatings > best.totalRatings ? store : best
        );
      default:
        return stores[0];
    }
  };

  const bestRated = getBestInCategory('rating');
  const mostReviewed = getBestInCategory('reviews');

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Compare className="w-5 h-5" />
              Store Comparison ({stores.length})
            </CardTitle>
            <CardDescription>
              Compare ratings, reviews, and performance metrics
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={onClearAll}>
            Clear All
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{bestRated.name}</div>
              <div className="text-sm text-muted-foreground">Highest Rated</div>
              <div className="flex items-center justify-center gap-1 mt-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="font-semibold">{bestRated.averageRating.toFixed(1)}</span>
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{mostReviewed.name}</div>
              <div className="text-sm text-muted-foreground">Most Reviewed</div>
              <div className="flex items-center justify-center gap-1 mt-1">
                <Users className="w-4 h-4 text-blue-600" />
                <span className="font-semibold">{mostReviewed.totalRatings}</span>
              </div>
            </div>
          </div>

          {/* Comparison Table */}
          <div className="overflow-x-auto">
            <div className="min-w-full">
              {/* Header */}
              <div className="grid grid-cols-1 gap-4">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  <div className="font-semibold text-sm text-muted-foreground">Store</div>
                  {stores.map((store) => (
                    <div key={store.id} className="relative">
                      <Card className="h-full">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="font-semibold text-sm truncate pr-2">{store.name}</h3>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0 hover:bg-destructive hover:text-destructive-foreground"
                              onClick={() => onRemoveStore(store.id)}
                            >
                              <X className="w-3 h-3" />
                            </Button>
                          </div>
                          <div className="space-y-2 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              <span className="truncate">{store.address}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              <span>Since {new Date(store.createdAt).getFullYear()}</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  ))}
                </div>

                <Separator />

                {/* Rating Comparison */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 items-center">
                  <div className="font-medium text-sm">Overall Rating</div>
                  {stores.map((store) => {
                    const performance = getPerformanceIndicator(store.averageRating);
                    const PerformanceIcon = performance.icon;
                    return (
                      <div key={store.id} className="text-center">
                        <div className="flex items-center justify-center gap-2 mb-1">
                          <StarRating rating={store.averageRating} readonly size="sm" />
                        </div>
                        <div className="text-lg font-bold">{store.averageRating.toFixed(1)}</div>
                        <div className={`flex items-center justify-center gap-1 text-xs ${performance.color}`}>
                          <PerformanceIcon className="w-3 h-3" />
                          <span>{performance.label}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <Separator />

                {/* Review Count */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 items-center">
                  <div className="font-medium text-sm">Total Reviews</div>
                  {stores.map((store) => (
                    <div key={store.id} className="text-center">
                      <div className="text-lg font-bold">{store.totalRatings}</div>
                      <div className="text-xs text-muted-foreground">reviews</div>
                    </div>
                  ))}
                </div>

                <Separator />

                {/* Performance Badges */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 items-start">
                  <div className="font-medium text-sm">Achievements</div>
                  {stores.map((store) => (
                    <div key={store.id} className="space-y-1">
                      {store.averageRating >= 4.5 && (
                        <Badge variant="default" className="text-xs">
                          <Award className="w-3 h-3 mr-1" />
                          Top Rated
                        </Badge>
                      )}
                      {store.totalRatings >= 50 && (
                        <Badge variant="secondary" className="text-xs">
                          <Users className="w-3 h-3 mr-1" />
                          Popular
                        </Badge>
                      )}
                      {store.id === bestRated.id && (
                        <Badge variant="outline" className="text-xs border-green-500 text-green-700">
                          <Star className="w-3 h-3 mr-1" />
                          Best Rating
                        </Badge>
                      )}
                      {store.id === mostReviewed.id && (
                        <Badge variant="outline" className="text-xs border-blue-500 text-blue-700">
                          <TrendingUp className="w-3 h-3 mr-1" />
                          Most Reviews
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="p-4 bg-primary/5 rounded-lg">
            <h4 className="font-semibold mb-2">Comparison Summary</h4>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>• Average rating across selected stores: {(stores.reduce((sum, store) => sum + store.averageRating, 0) / stores.length).toFixed(1)} stars</p>
              <p>• Total reviews: {stores.reduce((sum, store) => sum + store.totalRatings, 0)} reviews</p>
              <p>• Rating range: {Math.min(...stores.map(s => s.averageRating)).toFixed(1)} - {Math.max(...stores.map(s => s.averageRating)).toFixed(1)} stars</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};