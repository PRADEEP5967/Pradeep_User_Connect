import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Search, Filter, X, MapPin, Star, Calendar } from 'lucide-react';

interface FilterOptions {
  search: string;
  location: string;
  category: string;
  rating: number[];
  priceRange: string;
  sortBy: string;
  dateRange: string;
}

interface SearchFiltersProps {
  onFiltersChange: (filters: FilterOptions) => void;
  categories?: string[];
  locations?: string[];
}

export const SearchFilters: React.FC<SearchFiltersProps> = ({
  onFiltersChange,
  categories = ['Restaurant', 'Retail', 'Service', 'Entertainment', 'Healthcare'],
  locations = ['Downtown', 'Uptown', 'Suburbs', 'Mall Area', 'Business District']
}) => {
  const [filters, setFilters] = useState<FilterOptions>({
    search: '',
    location: '',
    category: '',
    rating: [0],
    priceRange: '',
    sortBy: 'rating',
    dateRange: 'all'
  });

  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const updateFilter = (key: keyof FilterOptions, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);

    // Update active filters for display
    const active = [];
    if (newFilters.search) active.push(`Search: ${newFilters.search}`);
    if (newFilters.location) active.push(`Location: ${newFilters.location}`);
    if (newFilters.category) active.push(`Category: ${newFilters.category}`);
    if (newFilters.rating[0] > 0) active.push(`Rating: ${newFilters.rating[0]}+ stars`);
    if (newFilters.priceRange) active.push(`Price: ${newFilters.priceRange}`);
    setActiveFilters(active);
  };

  const clearFilters = () => {
    const clearedFilters = {
      search: '',
      location: '',
      category: '',
      rating: [0],
      priceRange: '',
      sortBy: 'rating',
      dateRange: 'all'
    };
    setFilters(clearedFilters);
    setActiveFilters([]);
    onFiltersChange(clearedFilters);
  };

  const removeFilter = (filterText: string) => {
    const newFilters = { ...filters };
    if (filterText.startsWith('Search:')) newFilters.search = '';
    if (filterText.startsWith('Location:')) newFilters.location = '';
    if (filterText.startsWith('Category:')) newFilters.category = '';
    if (filterText.startsWith('Rating:')) newFilters.rating = [0];
    if (filterText.startsWith('Price:')) newFilters.priceRange = '';
    
    setFilters(newFilters);
    onFiltersChange(newFilters);
    setActiveFilters(activeFilters.filter(f => f !== filterText));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Filter className="w-5 h-5" />
          Advanced Search & Filters
        </CardTitle>
        <CardDescription>
          Find stores that match your preferences
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Search Bar */}
        <div className="space-y-2">
          <Label htmlFor="search">Search Stores</Label>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="search"
              placeholder="Search by store name, description, or keywords..."
              value={filters.search}
              onChange={(e) => updateFilter('search', e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Location Filter */}
          <div className="space-y-2">
            <Label>Location</Label>
            <Select value={filters.location} onValueChange={(value) => updateFilter('location', value)}>
              <SelectTrigger>
                <MapPin className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Any location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Any location</SelectItem>
                {locations.map((location) => (
                  <SelectItem key={location} value={location}>
                    {location}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Category Filter */}
          <div className="space-y-2">
            <Label>Category</Label>
            <Select value={filters.category} onValueChange={(value) => updateFilter('category', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Any category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Any category</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Sort By */}
          <div className="space-y-2">
            <Label>Sort By</Label>
            <Select value={filters.sortBy} onValueChange={(value) => updateFilter('sortBy', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="reviews">Most Reviews</SelectItem>
                <SelectItem value="name">Name A-Z</SelectItem>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="distance">Distance</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Rating Filter */}
        <div className="space-y-3">
          <Label className="flex items-center gap-2">
            <Star className="w-4 h-4" />
            Minimum Rating: {filters.rating[0]} stars
          </Label>
          <Slider
            value={filters.rating}
            onValueChange={(value) => updateFilter('rating', value)}
            max={5}
            min={0}
            step={0.5}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Any rating</span>
            <span>5 stars only</span>
          </div>
        </div>

        {/* Price Range */}
        <div className="space-y-2">
          <Label>Price Range</Label>
          <Select value={filters.priceRange} onValueChange={(value) => updateFilter('priceRange', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Any price range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Any price range</SelectItem>
              <SelectItem value="budget">$ - Budget Friendly</SelectItem>
              <SelectItem value="moderate">$$ - Moderate</SelectItem>
              <SelectItem value="expensive">$$$ - Expensive</SelectItem>
              <SelectItem value="luxury">$$$$ - Luxury</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Date Range */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Reviews From
          </Label>
          <Select value={filters.dateRange} onValueChange={(value) => updateFilter('dateRange', value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All time</SelectItem>
              <SelectItem value="week">Past week</SelectItem>
              <SelectItem value="month">Past month</SelectItem>
              <SelectItem value="quarter">Past 3 months</SelectItem>
              <SelectItem value="year">Past year</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Active Filters */}
        {activeFilters.length > 0 && (
          <>
            <Separator />
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Active Filters</Label>
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  Clear All
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {activeFilters.map((filter, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {filter}
                    <X 
                      className="w-3 h-3 cursor-pointer hover:text-destructive" 
                      onClick={() => removeFilter(filter)}
                    />
                  </Badge>
                ))}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};