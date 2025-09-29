import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Store, 
  Star, 
  Activity,
  Calendar,
  Target,
  Award,
  Clock,
  BarChart3
} from 'lucide-react';

interface StatCard {
  title: string;
  value: string | number;
  change: number;
  changeLabel: string;
  icon: React.ComponentType<any>;
  color: string;
  description: string;
}

interface DashboardStatsProps {
  userRole: 'admin' | 'user' | 'store_owner';
  stats: {
    totalUsers?: number;
    totalStores?: number;
    totalRatings?: number;
    averageRating?: number;
    userGrowth?: number;
    storeGrowth?: number;
    ratingGrowth?: number;
    myRatings?: number;
    myStoreRating?: number;
    myStoreReviews?: number;
  };
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({ userRole, stats }) => {
  const getStatsForRole = (): StatCard[] => {
    switch (userRole) {
      case 'admin':
        return [
          {
            title: 'Total Users',
            value: stats.totalUsers || 0,
            change: stats.userGrowth || 0,
            changeLabel: 'from last month',
            icon: Users,
            color: 'text-blue-600',
            description: 'Registered platform users'
          },
          {
            title: 'Total Stores',
            value: stats.totalStores || 0,
            change: stats.storeGrowth || 0,
            changeLabel: 'from last month',
            icon: Store,
            color: 'text-green-600',
            description: 'Listed business stores'
          },
          {
            title: 'Total Ratings',
            value: stats.totalRatings || 0,
            change: stats.ratingGrowth || 0,
            changeLabel: 'from last month',
            icon: Star,
            color: 'text-yellow-600',
            description: 'Customer reviews submitted'
          },
          {
            title: 'Platform Health',
            value: '94%',
            change: 2,
            changeLabel: 'system uptime',
            icon: Activity,
            color: 'text-purple-600',
            description: 'Overall platform performance'
          }
        ];

      case 'store_owner':
        return [
          {
            title: 'Store Rating',
            value: (stats.myStoreRating || 0).toFixed(1),
            change: 0.3,
            changeLabel: 'from last month',
            icon: Star,
            color: 'text-yellow-600',
            description: 'Your store\'s average rating'
          },
          {
            title: 'Total Reviews',
            value: stats.myStoreReviews || 0,
            change: 15,
            changeLabel: 'new this month',
            icon: BarChart3,
            color: 'text-blue-600',
            description: 'Customer reviews received'
          },
          {
            title: 'Performance',
            value: 'Excellent',
            change: 5,
            changeLabel: 'rating improvement',
            icon: Award,
            color: 'text-green-600',
            description: 'Store performance status'
          },
          {
            title: 'Response Time',
            value: '2.3h',
            change: -20,
            changeLabel: 'faster responses',
            icon: Clock,
            color: 'text-purple-600',
            description: 'Average response to reviews'
          }
        ];

      case 'user':
      default:
        return [
          {
            title: 'My Ratings',
            value: stats.myRatings || 0,
            change: 3,
            changeLabel: 'new this month',
            icon: Star,
            color: 'text-yellow-600',
            description: 'Stores you\'ve rated'
          },
          {
            title: 'Discoveries',
            value: 12,
            change: 8,
            changeLabel: 'new stores found',
            icon: Target,
            color: 'text-blue-600',
            description: 'New stores discovered'
          },
          {
            title: 'Helpful Reviews',
            value: 45,
            change: 12,
            changeLabel: 'people helped',
            icon: Users,
            color: 'text-green-600',
            description: 'Your reviews helped others'
          },
          {
            title: 'Activity Level',
            value: 'Active',
            change: 25,
            changeLabel: 'more engagement',
            icon: Activity,
            color: 'text-purple-600',
            description: 'Your platform engagement'
          }
        ];
    }
  };

  const statCards = getStatsForRole();

  const StatCard: React.FC<{ stat: StatCard }> = ({ stat }) => {
    const Icon = stat.icon;
    const isPositive = stat.change >= 0;

    return (
      <Card className="relative overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
          <Icon className={`h-4 w-4 ${stat.color}`} />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stat.value}</div>
          <div className="flex items-center gap-2 mt-1">
            {isPositive ? (
              <TrendingUp className="h-3 w-3 text-green-600" />
            ) : (
              <TrendingDown className="h-3 w-3 text-red-600" />
            )}
            <span className={`text-xs ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {isPositive ? '+' : ''}{Math.abs(stat.change)}% {stat.changeLabel}
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
        </CardContent>
        <div className={`absolute top-0 right-0 w-1 h-full ${stat.color.replace('text-', 'bg-')}`} />
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <StatCard key={index} stat={stat} />
        ))}
      </div>

      {/* Additional Insights for Admin */}
      {userRole === 'admin' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Platform Health</CardTitle>
              <CardDescription>Key performance indicators</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">User Engagement</span>
                  <span className="text-sm text-muted-foreground">85%</span>
                </div>
                <Progress value={85} className="h-2" />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Store Coverage</span>
                  <span className="text-sm text-muted-foreground">72%</span>
                </div>
                <Progress value={72} className="h-2" />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Rating Completion</span>
                  <span className="text-sm text-muted-foreground">91%</span>
                </div>
                <Progress value={91} className="h-2" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest platform activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">New user registration spike</p>
                    <p className="text-xs text-muted-foreground">+15% this week</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">High rating activity</p>
                    <p className="text-xs text-muted-foreground">24 new reviews today</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Store performance improving</p>
                    <p className="text-xs text-muted-foreground">Average rating up 0.3</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Store Owner Insights */}
      {userRole === 'store_owner' && (
        <Card>
          <CardHeader>
            <CardTitle>Performance Insights</CardTitle>
            <CardDescription>Your store's performance metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">4.8</div>
                <div className="text-sm text-muted-foreground">Average Rating</div>
                <Badge variant="outline" className="mt-2">Top 10%</Badge>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">156</div>
                <div className="text-sm text-muted-foreground">Total Reviews</div>
                <Badge variant="outline" className="mt-2">Popular</Badge>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">92%</div>
                <div className="text-sm text-muted-foreground">Positive Reviews</div>
                <Badge variant="outline" className="mt-2">Excellent</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* User Activity Summary */}
      {userRole === 'user' && (
        <Card>
          <CardHeader>
            <CardTitle>Your Activity</CardTitle>
            <CardDescription>Your engagement with the platform</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-semibold">Recent Activity</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span>Rated "Tech Store" - 5 stars</span>
                    <span className="text-muted-foreground">2 days ago</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Target className="w-4 h-4 text-blue-500" />
                    <span>Discovered "Fashion Hub"</span>
                    <span className="text-muted-foreground">1 week ago</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="w-4 h-4 text-green-500" />
                    <span>Your review helped 12 people</span>
                    <span className="text-muted-foreground">2 weeks ago</span>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <h4 className="font-semibold">Achievements</h4>
                <div className="space-y-2">
                  <Badge variant="outline" className="flex items-center gap-2 w-fit">
                    <Award className="w-4 h-4" />
                    Helpful Reviewer
                  </Badge>
                  <Badge variant="outline" className="flex items-center gap-2 w-fit">
                    <Star className="w-4 h-4" />
                    Rating Expert
                  </Badge>
                  <Badge variant="outline" className="flex items-center gap-2 w-fit">
                    <Target className="w-4 h-4" />
                    Store Explorer
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};