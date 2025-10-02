import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Star, TrendingUp, ChartBar as BarChart3, Users } from 'lucide-react';
import { AnimatedCounter } from '@/components/ui/animated-counter';

interface RatingData {
  rating: number;
  count: number;
  percentage: number;
}

interface StoreRatingChartProps {
  ratings: RatingData[];
  totalRatings: number;
  averageRating: number;
}

const getRatingColor = (rating: number) => {
  if (rating >= 4) return 'bg-green-500';
  if (rating >= 3) return 'bg-blue-500';
  if (rating >= 2) return 'bg-yellow-500';
  return 'bg-red-500';
};

const getRatingLabel = (rating: number) => {
  if (rating >= 4.5) return 'Excellent';
  if (rating >= 4) return 'Very Good';
  if (rating >= 3) return 'Good';
  if (rating >= 2) return 'Fair';
  return 'Needs Improvement';
};

export const StoreRatingChart: React.FC<StoreRatingChartProps> = ({
  ratings,
  totalRatings,
  averageRating
}) => {
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);

  const sortedRatings = [...ratings].sort((a, b) => b.rating - a.rating);

  const positiveRatings = ratings
    .filter(r => r.rating >= 4)
    .reduce((sum, r) => sum + r.count, 0);
  const positivePercentage = totalRatings > 0 ? (positiveRatings / totalRatings) * 100 : 0;

  return (
    <Card className="overflow-hidden border-2 transition-shadow hover:shadow-lg">
      <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <CardTitle className="flex items-center gap-2 text-2xl">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <BarChart3 className="w-6 h-6 text-primary" />
                </div>
                Rating Distribution
              </CardTitle>
              <CardDescription className="text-base">
                Comprehensive breakdown of customer feedback
              </CardDescription>
            </div>
            <Badge variant="secondary" className="text-sm px-3 py-1">
              <Users className="w-3 h-3 mr-1" />
              <AnimatedCounter value={totalRatings} /> reviews
            </Badge>
          </div>
        </CardHeader>
      </div>

      <CardContent className="pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-1 flex flex-col items-center justify-center p-6 bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl border-2 border-primary/20">
            <div className="text-center space-y-3">
              <div className="text-6xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                {averageRating.toFixed(1)}
              </div>
              <div className="flex items-center justify-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => {
                  const isFilled = star <= Math.floor(averageRating);
                  const isHalf = star === Math.ceil(averageRating) && averageRating % 1 !== 0;

                  return (
                    <Star
                      key={star}
                      className={`w-5 h-5 transition-all ${
                        isFilled || isHalf
                          ? 'fill-primary text-primary scale-110'
                          : 'text-muted-foreground'
                      }`}
                    />
                  );
                })}
              </div>
              <div className="space-y-1">
                <Badge variant="outline" className="font-semibold text-sm">
                  {getRatingLabel(averageRating)}
                </Badge>
                <p className="text-sm text-muted-foreground">Overall Rating</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-4">
            {sortedRatings.map((ratingData) => {
              const isHovered = hoveredRating === ratingData.rating;
              const barColor = getRatingColor(ratingData.rating);

              return (
                <div
                  key={ratingData.rating}
                  className={`group relative flex items-center gap-4 p-3 rounded-lg transition-all duration-200 ${
                    isHovered ? 'bg-muted/80 scale-[1.02]' : 'hover:bg-muted/50'
                  }`}
                  onMouseEnter={() => setHoveredRating(ratingData.rating)}
                  onMouseLeave={() => setHoveredRating(null)}
                >
                  <div className="flex items-center gap-2 min-w-[80px]">
                    <span className="text-lg font-bold text-foreground">{ratingData.rating}</span>
                    <Star className="w-4 h-4 fill-primary text-primary" />
                  </div>

                  <div className="flex-1 space-y-1.5">
                    <div className="relative h-3 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full ${barColor} transition-all duration-500 ease-out rounded-full`}
                        style={{
                          width: `${ratingData.percentage}%`,
                          boxShadow: isHovered ? '0 0 10px currentColor' : 'none'
                        }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">
                        {ratingData.count} {ratingData.count === 1 ? 'review' : 'reviews'}
                      </span>
                    </div>
                  </div>

                  <div className="min-w-[60px] text-right">
                    <div className={`text-xl font-bold transition-colors ${
                      isHovered ? 'text-primary' : 'text-foreground'
                    }`}>
                      {ratingData.percentage.toFixed(1)}%
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <Separator className="my-6" />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-900">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />
              <span className="text-xs font-medium text-green-600 dark:text-green-400">Positive</span>
            </div>
            <div className="text-2xl font-bold text-green-700 dark:text-green-300">
              {positivePercentage.toFixed(1)}%
            </div>
            <p className="text-xs text-green-600 dark:text-green-400 mt-1">
              4+ star ratings
            </p>
          </div>

          <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-900">
            <div className="flex items-center gap-2 mb-2">
              <Star className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span className="text-xs font-medium text-blue-600 dark:text-blue-400">Most Common</span>
            </div>
            <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">
              {sortedRatings[0]?.rating || 'N/A'} <Star className="w-4 h-4 inline fill-current" />
            </div>
            <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
              {sortedRatings[0]?.count || 0} reviews
            </p>
          </div>

          <div className="p-4 bg-purple-50 dark:bg-purple-950/20 rounded-lg border border-purple-200 dark:border-purple-900">
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <span className="text-xs font-medium text-purple-600 dark:text-purple-400">Total Reviews</span>
            </div>
            <div className="text-2xl font-bold text-purple-700 dark:text-purple-300">
              <AnimatedCounter value={totalRatings} />
            </div>
            <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">
              All time
            </p>
          </div>

          <div className="p-4 bg-orange-50 dark:bg-orange-950/20 rounded-lg border border-orange-200 dark:border-orange-900">
            <div className="flex items-center gap-2 mb-2">
              <Star className="w-4 h-4 text-orange-600 dark:text-orange-400" />
              <span className="text-xs font-medium text-orange-600 dark:text-orange-400">Rating Status</span>
            </div>
            <div className="text-lg font-bold text-orange-700 dark:text-orange-300">
              {getRatingLabel(averageRating)}
            </div>
            <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">
              Performance level
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};