import React, { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { StarRating } from '@/components/ui/star-rating';
import { ScrollArea } from '@/components/ui/scroll-area';
import { getRatings, getStores, getUsers } from '@/utils/localStorage';
import { Activity, Star, Store as StoreIcon, TrendingUp, Clock } from 'lucide-react';

interface ActivityFeedProps {
  limit?: number;
  userId?: string;
}

export const ActivityFeed: React.FC<ActivityFeedProps> = ({ limit = 10, userId }) => {
  const ratings = getRatings();
  const stores = getStores();
  const users = getUsers();

  const activities = useMemo(() => {
    let filteredRatings = userId
      ? ratings.filter(r => r.userId === userId)
      : ratings;

    return filteredRatings
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, limit)
      .map(rating => {
        const store = stores.find(s => s.id === rating.storeId);
        const user = users.find(u => u.id === rating.userId);

        return {
          id: rating.id,
          user: user ? {
            name: user.name,
            initials: user.name.split(' ').map(n => n[0]).join('').toUpperCase()
          } : null,
          store: store ? {
            name: store.name,
            address: store.address
          } : null,
          rating: rating.rating,
          comment: rating.comment,
          date: rating.updatedAt
        };
      })
      .filter(activity => activity.store && activity.user);
  }, [ratings, stores, users, limit, userId]);

  const getTimeAgo = (date: string) => {
    const now = new Date();
    const then = new Date(date);
    const diffInMs = now.getTime() - then.getTime();
    const diffInMins = Math.floor(diffInMs / 60000);
    const diffInHours = Math.floor(diffInMs / 3600000);
    const diffInDays = Math.floor(diffInMs / 86400000);

    if (diffInMins < 1) return 'Just now';
    if (diffInMins < 60) return `${diffInMins}m ago`;
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return then.toLocaleDateString();
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-primary animate-pulse-slow" />
          Activity Feed
        </CardTitle>
        <CardDescription>Recent rating activity on the platform</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[500px] pr-4">
          <div className="space-y-4">
            {activities.length > 0 ? (
              activities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex gap-4 p-4 rounded-lg border-2 hover-lift transition-smooth animate-fade-in-up"
                >
                  <Avatar className="w-10 h-10 border-2 border-primary/30">
                    <AvatarFallback className="bg-gradient-to-br from-primary/30 to-primary/10 text-primary font-semibold">
                      {activity.user?.initials}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-1 flex-1">
                        <p className="text-sm">
                          <span className="font-semibold">{activity.user?.name}</span>
                          {' '}rated{' '}
                          <span className="font-semibold">{activity.store?.name}</span>
                        </p>
                        <div className="flex items-center gap-2">
                          <StarRating rating={activity.rating} readonly size="sm" />
                          <Badge variant="secondary" className="text-xs">
                            {activity.rating} stars
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground whitespace-nowrap">
                        <Clock className="w-3 h-3" />
                        {getTimeAgo(activity.date)}
                      </div>
                    </div>

                    {activity.comment && (
                      <p className="text-sm text-muted-foreground italic border-l-2 border-primary/30 pl-3">
                        "{activity.comment}"
                      </p>
                    )}

                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <StoreIcon className="w-3 h-3" />
                      {activity.store?.address}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <Activity className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <p className="text-muted-foreground">No recent activity</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
