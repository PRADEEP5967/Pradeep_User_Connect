import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Star } from 'lucide-react';

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

export const StoreRatingChart: React.FC<StoreRatingChartProps> = ({
  ratings,
  totalRatings,
  averageRating
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Star className="w-5 h-5" />
          Rating Distribution
        </CardTitle>
        <CardDescription>
          Overview of customer ratings ({totalRatings} total ratings)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-center p-4 bg-muted/50 rounded-lg">
            <div className="text-center">
              <div className="text-3xl font-bold">{averageRating.toFixed(1)}</div>
              <div className="flex items-center justify-center gap-1 mt-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-4 h-4 ${
                      star <= averageRating
                        ? 'fill-primary text-primary'
                        : 'text-muted-foreground'
                    }`}
                  />
                ))}
              </div>
              <p className="text-sm text-muted-foreground mt-1">Overall Rating</p>
            </div>
          </div>

          <div className="space-y-3">
            {ratings.map((ratingData) => (
              <div key={ratingData.rating} className="flex items-center gap-3">
                <div className="flex items-center gap-1 w-16">
                  <span className="text-sm font-medium">{ratingData.rating}</span>
                  <Star className="w-3 h-3 fill-primary text-primary" />
                </div>
                <div className="flex-1">
                  <Progress value={ratingData.percentage} className="h-2" />
                </div>
                <div className="w-12 text-right">
                  <span className="text-sm text-muted-foreground">
                    {ratingData.count}
                  </span>
                </div>
                <div className="w-12 text-right">
                  <span className="text-xs text-muted-foreground">
                    {ratingData.percentage.toFixed(0)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};