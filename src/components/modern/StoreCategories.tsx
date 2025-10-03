import React, { useMemo, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { StarRating } from '@/components/ui/star-rating';
import { getStores } from '@/utils/localStorage';
import { Store, ShoppingBag, Coffee, Utensils, Home, Heart, Zap, Grid3x3 as Grid3X3 } from 'lucide-react';

interface StoreCategoriesProps {
  onCategorySelect?: (category: string) => void;
  selectedCategory?: string;
}

export const StoreCategories: React.FC<StoreCategoriesProps> = ({
  onCategorySelect,
  selectedCategory = 'all'
}) => {
  const stores = getStores();

  const categories = useMemo(() => {
    const categoryMap = new Map<string, {
      count: number;
      avgRating: number;
      totalRatings: number;
    }>();

    stores.forEach(store => {
      const category = store.category || 'Other';
      const existing = categoryMap.get(category) || {
        count: 0,
        avgRating: 0,
        totalRatings: 0
      };

      categoryMap.set(category, {
        count: existing.count + 1,
        avgRating: existing.avgRating + store.averageRating,
        totalRatings: existing.totalRatings + store.totalRatings
      });
    });

    const allCategories = Array.from(categoryMap.entries()).map(([name, data]) => ({
      name,
      count: data.count,
      avgRating: data.avgRating / data.count,
      totalRatings: data.totalRatings
    }));

    allCategories.unshift({
      name: 'all',
      count: stores.length,
      avgRating: stores.length > 0
        ? stores.reduce((acc, s) => acc + s.averageRating, 0) / stores.length
        : 0,
      totalRatings: stores.reduce((acc, s) => acc + s.totalRatings, 0)
    });

    return allCategories;
  }, [stores]);

  const getCategoryIcon = (categoryName: string) => {
    const name = categoryName.toLowerCase();
    if (name === 'all') return Grid3X3;
    if (name.includes('food') || name.includes('restaurant')) return Utensils;
    if (name.includes('coffee') || name.includes('cafe')) return Coffee;
    if (name.includes('shop') || name.includes('retail')) return ShoppingBag;
    if (name.includes('home') || name.includes('furniture')) return Home;
    if (name.includes('health') || name.includes('beauty')) return Heart;
    return Store;
  };

  const getCategoryColor = (categoryName: string) => {
    const name = categoryName.toLowerCase();
    if (name === 'all') return 'primary';
    if (name.includes('food')) return 'orange';
    if (name.includes('coffee')) return 'amber';
    if (name.includes('shop')) return 'blue';
    if (name.includes('home')) return 'green';
    if (name.includes('health')) return 'pink';
    return 'slate';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Grid3X3 className="w-5 h-5" />
          Browse by Category
        </CardTitle>
        <CardDescription>Explore stores by their category</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.map((category) => {
            const Icon = getCategoryIcon(category.name);
            const isSelected = selectedCategory === category.name;

            return (
              <button
                key={category.name}
                onClick={() => onCategorySelect?.(category.name)}
                className={`p-4 rounded-lg border-2 text-left transition-all hover-lift hover-glow ${
                  isSelected
                    ? 'border-primary bg-primary/10 shadow-lg scale-105'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Icon className={`w-6 h-6 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`} />
                    {isSelected && (
                      <Badge variant="default" className="text-xs animate-bounce-subtle">
                        Active
                      </Badge>
                    )}
                  </div>

                  <div className="space-y-1">
                    <h4 className="font-semibold capitalize">
                      {category.name === 'all' ? 'All Stores' : category.name}
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      {category.count} {category.count === 1 ? 'store' : 'stores'}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <StarRating rating={category.avgRating} readonly size="sm" />
                    <p className="text-xs text-muted-foreground">
                      {category.avgRating.toFixed(1)} avg • {category.totalRatings} reviews
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {categories.length === 1 && (
          <div className="text-center py-8 text-muted-foreground">
            <Grid3X3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No categories available yet</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
