import React, { useMemo, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { StarRating } from '@/components/ui/star-rating';
import { AnimatedCounter } from '@/components/ui/animated-counter';
import { getUsers, getStores, getRatings } from '@/utils/localStorage';
import { Trophy, Star, TrendingUp, Award, Crown, Medal } from 'lucide-react';

const Leaderboard: React.FC = () => {
  const users = getUsers();
  const stores = getStores();
  const ratings = getRatings();

  const topUsers = useMemo(() => {
    const userRatingCounts = users.map(user => {
      const userRatings = ratings.filter(r => r.userId === user.id);
      return {
        ...user,
        totalRatings: userRatings.length,
        averageRating: userRatings.length > 0
          ? userRatings.reduce((acc, r) => acc + r.rating, 0) / userRatings.length
          : 0
      };
    });

    return userRatingCounts
      .filter(u => u.role === 'user')
      .sort((a, b) => b.totalRatings - a.totalRatings)
      .slice(0, 10);
  }, [users, ratings]);

  const topStores = useMemo(() => {
    return [...stores]
      .sort((a, b) => {
        if (b.averageRating !== a.averageRating) {
          return b.averageRating - a.averageRating;
        }
        return b.totalRatings - a.totalRatings;
      })
      .slice(0, 10);
  }, [stores]);

  const mostActiveReviewers = useMemo(() => {
    const last30Days = new Date();
    last30Days.setDate(last30Days.getDate() - 30);

    const recentRatings = ratings.filter(r => new Date(r.updatedAt) > last30Days);

    const userActivityMap = new Map();
    recentRatings.forEach(rating => {
      const count = userActivityMap.get(rating.userId) || 0;
      userActivityMap.set(rating.userId, count + 1);
    });

    const activeUsers = users
      .map(user => ({
        ...user,
        recentRatings: userActivityMap.get(user.id) || 0
      }))
      .filter(u => u.role === 'user' && u.recentRatings > 0)
      .sort((a, b) => b.recentRatings - a.recentRatings)
      .slice(0, 10);

    return activeUsers;
  }, [users, ratings]);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-500" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Medal className="w-6 h-6 text-orange-600" />;
      default:
        return <span className="text-lg font-bold text-muted-foreground">#{rank}</span>;
    }
  };

  const getRankBadgeVariant = (rank: number): "default" | "destructive" | "outline" | "secondary" => {
    if (rank === 1) return 'default';
    if (rank === 2) return 'secondary';
    if (rank === 3) return 'outline';
    return 'secondary';
  };

  return (
    <DashboardLayout title="Leaderboard" subtitle="Top users and highest-rated stores">
      <div className="space-y-6 animate-fade-in">
        <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Trophy className="w-8 h-8 text-primary" />
              <div>
                <CardTitle className="text-2xl font-display">Community Rankings</CardTitle>
                <CardDescription>See who's leading the pack</CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>

        <Tabs defaultValue="top-users" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="top-users" className="gap-2">
              <Award className="w-4 h-4" />
              Top Raters
            </TabsTrigger>
            <TabsTrigger value="top-stores" className="gap-2">
              <Star className="w-4 h-4" />
              Best Stores
            </TabsTrigger>
            <TabsTrigger value="most-active" className="gap-2">
              <TrendingUp className="w-4 h-4" />
              Most Active
            </TabsTrigger>
          </TabsList>

          <TabsContent value="top-users" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-primary" />
                  Top Raters
                </CardTitle>
                <CardDescription>Users with the most ratings submitted</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {topUsers.map((user, index) => {
                    const rank = index + 1;
                    const initials = user.name.split(' ').map(n => n[0]).join('').toUpperCase();

                    return (
                      <div
                        key={user.id}
                        className={`flex items-center gap-4 p-4 rounded-lg border-2 transition-smooth hover-lift ${
                          rank <= 3 ? 'border-primary/30 bg-primary/5' : 'border-border'
                        }`}
                      >
                        <div className="flex items-center justify-center w-12">
                          {getRankIcon(rank)}
                        </div>

                        <Avatar className="w-12 h-12 border-2 border-primary">
                          <AvatarFallback className="bg-gradient-to-br from-primary to-primary/50 text-primary-foreground">
                            {initials}
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex-1 space-y-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{user.name}</h3>
                            {rank <= 3 && (
                              <Badge variant={getRankBadgeVariant(rank)}>
                                Top {rank}
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>

                        <div className="text-right space-y-1">
                          <div className="flex items-center gap-2">
                            <Star className="w-4 h-4 text-primary" />
                            <span className="text-lg font-bold">
                              <AnimatedCounter value={user.totalRatings} />
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Avg: {user.averageRating.toFixed(1)}★
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="top-stores" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-500" />
                  Highest Rated Stores
                </CardTitle>
                <CardDescription>Stores with the best customer ratings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {topStores.map((store, index) => {
                    const rank = index + 1;

                    return (
                      <div
                        key={store.id}
                        className={`flex items-center gap-4 p-4 rounded-lg border-2 transition-smooth hover-lift ${
                          rank <= 3 ? 'border-yellow-500/30 bg-yellow-500/5' : 'border-border'
                        }`}
                      >
                        <div className="flex items-center justify-center w-12">
                          {getRankIcon(rank)}
                        </div>

                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-lg">{store.name}</h3>
                            {rank <= 3 && (
                              <Badge variant={getRankBadgeVariant(rank)} className="gap-1">
                                <Crown className="w-3 h-3" />
                                Top {rank}
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{store.address}</p>
                          <div className="flex items-center gap-3">
                            <StarRating rating={store.averageRating} readonly size="sm" />
                            <span className="text-sm font-medium">{store.averageRating.toFixed(2)}</span>
                            <Badge variant="secondary" className="text-xs">
                              <AnimatedCounter value={store.totalRatings} /> reviews
                            </Badge>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="most-active" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-500" />
                  Most Active This Month
                </CardTitle>
                <CardDescription>Users who have been most active in the last 30 days</CardDescription>
              </CardHeader>
              <CardContent>
                {mostActiveReviewers.length > 0 ? (
                  <div className="space-y-3">
                    {mostActiveReviewers.map((user, index) => {
                      const rank = index + 1;
                      const initials = user.name.split(' ').map(n => n[0]).join('').toUpperCase();

                      return (
                        <div
                          key={user.id}
                          className={`flex items-center gap-4 p-4 rounded-lg border-2 transition-smooth hover-lift ${
                            rank <= 3 ? 'border-green-500/30 bg-green-500/5' : 'border-border'
                          }`}
                        >
                          <div className="flex items-center justify-center w-12">
                            {getRankIcon(rank)}
                          </div>

                          <Avatar className="w-12 h-12 border-2 border-green-500">
                            <AvatarFallback className="bg-gradient-to-br from-green-500 to-green-600 text-white">
                              {initials}
                            </AvatarFallback>
                          </Avatar>

                          <div className="flex-1 space-y-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold">{user.name}</h3>
                              {rank <= 3 && (
                                <Badge variant={getRankBadgeVariant(rank)} className="gap-1">
                                  <TrendingUp className="w-3 h-3" />
                                  Hot Streak
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                          </div>

                          <div className="text-right">
                            <div className="flex items-center gap-2">
                              <TrendingUp className="w-4 h-4 text-green-500" />
                              <span className="text-lg font-bold">
                                <AnimatedCounter value={user.recentRatings} />
                              </span>
                            </div>
                            <p className="text-xs text-muted-foreground">this month</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <TrendingUp className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No activity in the last 30 days</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Leaderboard;
