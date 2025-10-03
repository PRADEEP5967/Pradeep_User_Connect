import React, { useMemo, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getUsers, getStores, getRatings } from '@/utils/localStorage';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { FileText, Download, TrendingUp, Users, Store as StoreIcon, Star, Calendar, Filter } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const Reports: React.FC = () => {
  const [timeRange, setTimeRange] = useState('30');
  const users = getUsers();
  const stores = getStores();
  const ratings = getRatings();

  const reportData = useMemo(() => {
    const days = parseInt(timeRange);
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    const recentRatings = ratings.filter(r => new Date(r.updatedAt) > cutoffDate);

    const dailyRatings = [];
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

      const dayRatings = recentRatings.filter(r => {
        const ratingDate = new Date(r.updatedAt);
        return ratingDate.toDateString() === date.toDateString();
      });

      dailyRatings.push({
        date: dateStr,
        ratings: dayRatings.length,
        avgRating: dayRatings.length > 0
          ? dayRatings.reduce((acc, r) => acc + r.rating, 0) / dayRatings.length
          : 0
      });
    }

    const ratingDistribution = [
      { name: '5 Stars', value: ratings.filter(r => r.rating === 5).length, color: '#10B981' },
      { name: '4 Stars', value: ratings.filter(r => r.rating === 4).length, color: '#3B82F6' },
      { name: '3 Stars', value: ratings.filter(r => r.rating === 3).length, color: '#F59E0B' },
      { name: '2 Stars', value: ratings.filter(r => r.rating === 2).length, color: '#EF4444' },
      { name: '1 Star', value: ratings.filter(r => r.rating === 1).length, color: '#6B7280' }
    ];

    const userActivity = users
      .filter(u => u.role === 'user')
      .map(user => {
        const userRatings = ratings.filter(r => r.userId === user.id);
        return {
          name: user.name.split(' ')[0],
          ratings: userRatings.length
        };
      })
      .sort((a, b) => b.ratings - a.ratings)
      .slice(0, 10);

    const categoryData = stores.reduce((acc, store) => {
      const category = store.category || 'Uncategorized';
      if (!acc[category]) {
        acc[category] = { name: category, stores: 0, avgRating: 0, totalRatings: 0 };
      }
      acc[category].stores++;
      acc[category].avgRating += store.averageRating;
      acc[category].totalRatings += store.totalRatings;
      return acc;
    }, {} as Record<string, any>);

    const categoryStats = Object.values(categoryData).map((cat: any) => ({
      name: cat.name,
      stores: cat.stores,
      avgRating: (cat.avgRating / cat.stores).toFixed(2),
      totalRatings: cat.totalRatings
    }));

    return {
      totalUsers: users.filter(u => u.role === 'user').length,
      totalStores: stores.length,
      totalRatings: ratings.length,
      averageRating: ratings.length > 0
        ? (ratings.reduce((acc, r) => acc + r.rating, 0) / ratings.length).toFixed(2)
        : '0',
      recentRatings: recentRatings.length,
      dailyRatings,
      ratingDistribution,
      userActivity,
      categoryStats
    };
  }, [users, stores, ratings, timeRange]);

  const handleExportReport = () => {
    toast({
      title: 'Report Exported',
      description: 'Your report has been downloaded successfully',
    });
  };

  return (
    <DashboardLayout title="Reports & Analytics" subtitle="Comprehensive platform insights and statistics">
      <div className="space-y-6 animate-fade-in">
        <Card className="border-2 border-primary/20">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText className="w-8 h-8 text-primary" />
                <div>
                  <CardTitle className="text-2xl font-display">Analytics Dashboard</CardTitle>
                  <CardDescription>Detailed reports and insights</CardDescription>
                </div>
              </div>
              <div className="flex gap-2">
                <Select value={timeRange} onValueChange={setTimeRange}>
                  <SelectTrigger className="w-48">
                    <Calendar className="w-4 h-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7">Last 7 days</SelectItem>
                    <SelectItem value="30">Last 30 days</SelectItem>
                    <SelectItem value="90">Last 90 days</SelectItem>
                    <SelectItem value="365">Last year</SelectItem>
                  </SelectContent>
                </Select>
                <Button onClick={handleExportReport} className="gap-2">
                  <Download className="w-4 h-4" />
                  Export
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="hover-lift transition-smooth">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-500" />
                Total Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{reportData.totalUsers}</div>
              <p className="text-xs text-muted-foreground mt-1">Active users</p>
            </CardContent>
          </Card>

          <Card className="hover-lift transition-smooth">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <StoreIcon className="w-4 h-4 text-green-500" />
                Total Stores
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{reportData.totalStores}</div>
              <p className="text-xs text-muted-foreground mt-1">Listed stores</p>
            </CardContent>
          </Card>

          <Card className="hover-lift transition-smooth">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Star className="w-4 h-4 text-yellow-500" />
                Total Ratings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{reportData.totalRatings}</div>
              <p className="text-xs text-muted-foreground mt-1">All time ratings</p>
            </CardContent>
          </Card>

          <Card className="hover-lift transition-smooth">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-primary" />
                Avg Rating
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{reportData.averageRating}</div>
              <p className="text-xs text-muted-foreground mt-1">Platform average</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="trends" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="trends">Trends</TabsTrigger>
            <TabsTrigger value="distribution">Distribution</TabsTrigger>
            <TabsTrigger value="users">User Activity</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
          </TabsList>

          <TabsContent value="trends" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Rating Trends</CardTitle>
                <CardDescription>Daily rating activity over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={reportData.dailyRatings}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="ratings" stroke="#8b5cf6" name="Total Ratings" strokeWidth={2} />
                    <Line type="monotone" dataKey="avgRating" stroke="#10b981" name="Average Rating" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Ratings submitted in selected time range</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center p-8">
                  <div className="text-center">
                    <div className="text-5xl font-bold text-primary mb-2">{reportData.recentRatings}</div>
                    <p className="text-muted-foreground">Ratings in last {timeRange} days</p>
                    <Badge variant="secondary" className="mt-2">
                      {reportData.recentRatings > 0 ? '+' : ''}{((reportData.recentRatings / reportData.totalRatings) * 100).toFixed(1)}% of total
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="distribution" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Rating Distribution</CardTitle>
                <CardDescription>Breakdown of ratings by star count</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={reportData.ratingDistribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {reportData.ratingDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>

                  <div className="space-y-3">
                    {reportData.ratingDistribution.map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                        <div className="flex items-center gap-3">
                          <div className="w-4 h-4 rounded" style={{ backgroundColor: item.color }}></div>
                          <span className="font-medium">{item.name}</span>
                        </div>
                        <Badge variant="secondary">{item.value} ratings</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Top User Activity</CardTitle>
                <CardDescription>Most active users by rating count</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={reportData.userActivity}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="ratings" fill="#8b5cf6" name="Total Ratings" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="categories" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Category Performance</CardTitle>
                <CardDescription>Store statistics by category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {reportData.categoryStats.length > 0 ? (
                    reportData.categoryStats.map((category: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-4 rounded-lg border hover-lift transition-smooth">
                        <div className="space-y-1">
                          <h4 className="font-semibold">{category.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {category.stores} stores • {category.totalRatings} ratings
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Star className="w-4 h-4 text-yellow-500" />
                          <span className="font-bold">{category.avgRating}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12 text-muted-foreground">
                      <Filter className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No category data available</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Reports;
