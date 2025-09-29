import React, { useState, useMemo } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { StarRating } from '@/components/ui/star-rating';
import { 
  getUsers, 
  getStores, 
  getRatings, 
  addUser, 
  addStore 
} from '@/utils/localStorage';
import { User, Store, ValidationErrors } from '@/types';
import { validateUserForm } from '@/utils/validation';
import { toast } from '@/hooks/use-toast';
import { AdvancedAnalytics } from '@/components/analytics/AdvancedAnalytics';
import { BulkOperations } from '@/components/bulk/BulkOperations';
import { 
  Users, 
  Store as StoreIcon, 
  Star, 
  Plus, 
  Search,
  Filter,
  BarChart3,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Download,
  TrendingUp
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const [users] = useState<User[]>(getUsers());
  const [stores] = useState<Store[]>(getStores());
  const [ratings] = useState(getRatings());
  
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [userSortField, setUserSortField] = useState<'name' | 'email' | 'role' | 'createdAt'>('name');
  const [userSortDirection, setUserSortDirection] = useState<'asc' | 'desc'>('asc');
  const [storeSortField, setStoreSortField] = useState<'name' | 'email' | 'averageRating' | 'totalRatings'>('name');
  const [storeSortDirection, setStoreSortDirection] = useState<'asc' | 'desc'>('asc');
  
  const [newUserForm, setNewUserForm] = useState({
    name: '',
    email: '',
    password: '',
    address: '',
    role: 'user' as 'user' | 'store_owner' | 'admin'
  });
  const [newUserErrors, setNewUserErrors] = useState<ValidationErrors>({});
  
  const [newStoreForm, setNewStoreForm] = useState({
    name: '',
    email: '',
    address: '',
    ownerId: ''
  });

  // Statistics
  const stats = useMemo(() => ({
    totalUsers: users.filter(u => u.role !== 'admin').length,
    totalStores: stores.length,
    totalRatings: ratings.length,
    adminUsers: users.filter(u => u.role === 'admin').length
  }), [users, stores, ratings]);

  // Filtered and sorted users
  const filteredUsers = useMemo(() => {
    let filtered = users.filter(user => {
      const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           user.address.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = roleFilter === 'all' || user.role === roleFilter;
      return matchesSearch && matchesRole;
    });

    // Sort users
    filtered.sort((a, b) => {
      let aVal: string | number = a[userSortField];
      let bVal: string | number = b[userSortField];
      
      if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = (bVal as string).toLowerCase();
      }
      
      if (userSortDirection === 'asc') {
        return aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
      } else {
        return aVal > bVal ? -1 : aVal < bVal ? 1 : 0;
      }
    });

    return filtered;
  }, [users, searchTerm, roleFilter, userSortField, userSortDirection]);

  // Filtered and sorted stores
  const filteredStores = useMemo(() => {
    let filtered = stores.filter(store => 
      store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      store.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      store.address.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Sort stores
    filtered.sort((a, b) => {
      let aVal: string | number = a[storeSortField];
      let bVal: string | number = b[storeSortField];
      
      if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = (bVal as string).toLowerCase();
      }
      
      if (storeSortDirection === 'asc') {
        return aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
      } else {
        return aVal > bVal ? -1 : aVal < bVal ? 1 : 0;
      }
    });

    return filtered;
  }, [stores, searchTerm, storeSortField, storeSortDirection]);

  // Store owners for dropdown
  const storeOwners = users.filter(u => u.role === 'store_owner');

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    
    const errors = validateUserForm(newUserForm);
    if (Object.keys(errors).length > 0) {
      setNewUserErrors(errors);
      return;
    }

    try {
      addUser(newUserForm);
      setNewUserForm({
        name: '',
        email: '',
        password: '',
        address: '',
        role: 'user'
      });
      setNewUserErrors({});
      toast({
        title: 'User Added',
        description: 'New user has been added successfully',
      });
      // Refresh page to show new user
      window.location.reload();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add user',
        variant: 'destructive',
      });
    }
  };

  const handleAddStore = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newStoreForm.name || !newStoreForm.email || !newStoreForm.address || !newStoreForm.ownerId) {
      toast({
        title: 'Validation Error',
        description: 'All fields are required',
        variant: 'destructive',
      });
      return;
    }

    try {
      addStore(newStoreForm);
      setNewStoreForm({
        name: '',
        email: '',
        address: '',
        ownerId: ''
      });
      toast({
        title: 'Store Added',
        description: 'New store has been added successfully',
      });
      // Refresh page to show new store
      window.location.reload();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add store',
        variant: 'destructive',
      });
    }
  };

  const handleUserSort = (field: typeof userSortField) => {
    if (userSortField === field) {
      setUserSortDirection(userSortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setUserSortField(field);
      setUserSortDirection('asc');
    }
  };

  const handleStoreSort = (field: typeof storeSortField) => {
    if (storeSortField === field) {
      setStoreSortDirection(storeSortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setStoreSortField(field);
      setStoreSortDirection('asc');
    }
  };

  const exportToCSV = (data: any[], filename: string) => {
    const csv = [
      Object.keys(data[0]).join(','),
      ...data.map(row => Object.values(row).map(val => `"${val}"`).join(','))
    ].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'admin': return 'destructive';
      case 'store_owner': return 'default';
      default: return 'secondary';
    }
  };

  const getSortIcon = (field: string, currentField: string, direction: 'asc' | 'desc') => {
    if (field !== currentField) return <ArrowUpDown className="w-4 h-4" />;
    return direction === 'asc' ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />;
  };

  // Generate analytics data
  const analyticsData = useMemo(() => {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const monthlyData = monthNames.map(month => ({
      name: month,
      users: Math.floor(Math.random() * 50) + 20,
      stores: Math.floor(Math.random() * 15) + 5,
      ratings: Math.floor(Math.random() * 100) + 30
    }));

    const ratingDistribution = [
      { name: '5 Stars', value: ratings.filter(r => r.rating === 5).length, color: '#10B981' },
      { name: '4 Stars', value: ratings.filter(r => r.rating === 4).length, color: '#3B82F6' },
      { name: '3 Stars', value: ratings.filter(r => r.rating === 3).length, color: '#F59E0B' },
      { name: '2 Stars', value: ratings.filter(r => r.rating === 2).length, color: '#EF4444' },
      { name: '1 Star', value: ratings.filter(r => r.rating === 1).length, color: '#6B7280' }
    ];

    const topStores = stores
      .sort((a, b) => b.averageRating - a.averageRating)
      .slice(0, 10)
      .map(store => ({
        name: store.name,
        rating: store.averageRating,
        reviews: store.totalRatings
      }));

    return {
      totalUsers: stats.totalUsers,
      totalStores: stats.totalStores,
      totalRatings: stats.totalRatings,
      averageRating: stores.length > 0 ? stores.reduce((acc, s) => acc + s.averageRating, 0) / stores.length : 0,
      userGrowth: 12,
      storeGrowth: 8,
      ratingGrowth: 15,
      monthlyData,
      ratingDistribution,
      topStores
    };
  }, [users, stores, ratings, stats]);

  return (
    <DashboardLayout title="Admin Dashboard" subtitle="Manage users, stores, and view platform statistics">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="stat-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              +{stats.adminUsers} admin users
            </p>
          </CardContent>
        </Card>

        <Card className="stat-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Stores</CardTitle>
            <StoreIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalStores}</div>
            <p className="text-xs text-muted-foreground">
              Registered stores
            </p>
          </CardContent>
        </Card>

        <Card className="stat-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Ratings</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalRatings}</div>
            <p className="text-xs text-muted-foreground">
              Submitted ratings
            </p>
          </CardContent>
        </Card>

        <Card className="stat-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Growth Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">+12%</div>
            <p className="text-xs text-muted-foreground">
              New users this month
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="users" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="stores">Stores</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="add-user">Add User</TabsTrigger>
          <TabsTrigger value="bulk-ops">Bulk Ops</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>View and manage all platform users</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by name, email, or address..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </div>
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger className="w-full sm:w-48">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Filter by role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="user">Normal Users</SelectItem>
                    <SelectItem value="store_owner">Store Owners</SelectItem>
                    <SelectItem value="admin">Administrators</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  variant="outline"
                  onClick={() => exportToCSV(filteredUsers.map(u => ({
                    name: u.name,
                    email: u.email,
                    role: u.role,
                    address: u.address,
                    joinDate: new Date(u.createdAt).toLocaleDateString()
                  })), 'users-export.csv')}
                  className="flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Export
                </Button>
              </div>

              {/* Sorting Controls */}
              <div className="flex flex-wrap gap-2 mb-4 p-3 bg-muted/50 rounded-lg">
                <span className="text-sm font-medium text-muted-foreground">Sort by:</span>
                <Button
                  variant={userSortField === 'name' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => handleUserSort('name')}
                  className="h-8 px-3"
                >
                  Name {getSortIcon('name', userSortField, userSortDirection)}
                </Button>
                <Button
                  variant={userSortField === 'email' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => handleUserSort('email')}
                  className="h-8 px-3"
                >
                  Email {getSortIcon('email', userSortField, userSortDirection)}
                </Button>
                <Button
                  variant={userSortField === 'role' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => handleUserSort('role')}
                  className="h-8 px-3"
                >
                  Role {getSortIcon('role', userSortField, userSortDirection)}
                </Button>
                <Button
                  variant={userSortField === 'createdAt' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => handleUserSort('createdAt')}
                  className="h-8 px-3"
                >
                  Join Date {getSortIcon('createdAt', userSortField, userSortDirection)}
                </Button>
              </div>

              <div className="space-y-4">
                {filteredUsers.map((user) => {
                  const userStore = stores.find(s => s.ownerId === user.id);
                  return (
                    <Card key={user.id} className="dashboard-card">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold">{user.name}</h3>
                              <Badge variant={getRoleBadgeVariant(user.role)}>
                                {user.role.replace('_', ' ')}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                            <p className="text-sm text-muted-foreground">{user.address}</p>
                            {userStore && (
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium">Store Rating:</span>
                                <StarRating rating={userStore.averageRating} readonly size="sm" />
                                <span className="text-sm text-muted-foreground">
                                  ({userStore.averageRating.toFixed(1)})
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-muted-foreground">
                              Joined {new Date(user.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stores" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Store Management</CardTitle>
              <CardDescription>View and manage all registered stores</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search stores by name, email, or address..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </div>
                <Button
                  variant="outline"
                  onClick={() => exportToCSV(filteredStores.map(s => ({
                    name: s.name,
                    email: s.email,
                    address: s.address,
                    rating: s.averageRating,
                    totalRatings: s.totalRatings,
                    dateAdded: new Date(s.createdAt).toLocaleDateString()
                  })), 'stores-export.csv')}
                  className="flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Export
                </Button>
              </div>

              {/* Store Sorting Controls */}
              <div className="flex flex-wrap gap-2 mb-4 p-3 bg-muted/50 rounded-lg">
                <span className="text-sm font-medium text-muted-foreground">Sort by:</span>
                <Button
                  variant={storeSortField === 'name' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => handleStoreSort('name')}
                  className="h-8 px-3"
                >
                  Name {getSortIcon('name', storeSortField, storeSortDirection)}
                </Button>
                <Button
                  variant={storeSortField === 'email' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => handleStoreSort('email')}
                  className="h-8 px-3"
                >
                  Email {getSortIcon('email', storeSortField, storeSortDirection)}
                </Button>
                <Button
                  variant={storeSortField === 'averageRating' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => handleStoreSort('averageRating')}
                  className="h-8 px-3"  
                >
                  Rating {getSortIcon('averageRating', storeSortField, storeSortDirection)}
                </Button>
                <Button
                  variant={storeSortField === 'totalRatings' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => handleStoreSort('totalRatings')}
                  className="h-8 px-3"
                >
                  Reviews {getSortIcon('totalRatings', storeSortField, storeSortDirection)}
                </Button>
              </div>

              <div className="space-y-4">
                {filteredStores.map((store) => {
                  const owner = users.find(u => u.id === store.ownerId);
                  return (
                    <Card key={store.id} className="dashboard-card">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div className="space-y-2">
                            <h3 className="font-semibold">{store.name}</h3>
                            <p className="text-sm text-muted-foreground">{store.email}</p>
                            <p className="text-sm text-muted-foreground">{store.address}</p>
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-2">
                                <StarRating rating={store.averageRating} readonly size="sm" />
                                <span className="text-sm font-medium">
                                  {store.averageRating.toFixed(1)} ({store.totalRatings} ratings)
                                </span>
                              </div>
                              {owner && (
                                <p className="text-sm text-muted-foreground">
                                  Owner: {owner.name}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-muted-foreground">
                              Added {new Date(store.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <AdvancedAnalytics data={analyticsData} />
        </TabsContent>

        <TabsContent value="bulk-ops" className="space-y-6">
          <BulkOperations onDataUpdate={() => window.location.reload()} />
        </TabsContent>

        <TabsContent value="add-user" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Add New User</CardTitle>
              <CardDescription>Create a new user account with specified role</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddUser} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="new-name">Full Name</Label>
                    <Input
                      id="new-name"
                      value={newUserForm.name}
                      onChange={(e) => setNewUserForm({...newUserForm, name: e.target.value})}
                      placeholder="Enter full name (20-60 characters)"
                      className={newUserErrors.name ? 'border-destructive' : ''}
                    />
                    {newUserErrors.name && (
                      <p className="text-sm text-destructive">{newUserErrors.name}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="new-email">Email Address</Label>
                    <Input
                      id="new-email"
                      type="email"
                      value={newUserForm.email}
                      onChange={(e) => setNewUserForm({...newUserForm, email: e.target.value})}
                      placeholder="Enter email address"
                      className={newUserErrors.email ? 'border-destructive' : ''}
                    />
                    {newUserErrors.email && (
                      <p className="text-sm text-destructive">{newUserErrors.email}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="new-password">Password</Label>
                  <Input
                    id="new-password"
                    type="password"
                    value={newUserForm.password}
                    onChange={(e) => setNewUserForm({...newUserForm, password: e.target.value})}
                    placeholder="8-16 chars, uppercase & special character"
                    className={newUserErrors.password ? 'border-destructive' : ''}
                  />
                  {newUserErrors.password && (
                    <p className="text-sm text-destructive">{newUserErrors.password}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="new-address">Address</Label>
                  <Textarea
                    id="new-address"
                    value={newUserForm.address}
                    onChange={(e) => setNewUserForm({...newUserForm, address: e.target.value})}
                    placeholder="Enter full address (max 400 characters)"
                    className={newUserErrors.address ? 'border-destructive' : ''}
                    rows={3}
                  />
                  {newUserErrors.address && (
                    <p className="text-sm text-destructive">{newUserErrors.address}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="new-role">User Role</Label>
                  <Select 
                    value={newUserForm.role} 
                    onValueChange={(value: 'user' | 'store_owner' | 'admin') => 
                      setNewUserForm({...newUserForm, role: value})
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select user role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">Normal User</SelectItem>
                      <SelectItem value="store_owner">Store Owner</SelectItem>
                      <SelectItem value="admin">Administrator</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button type="submit" className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Add User
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="add-store" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Add New Store</CardTitle>
              <CardDescription>Register a new store on the platform</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddStore} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="store-name">Store Name</Label>
                    <Input
                      id="store-name"
                      value={newStoreForm.name}
                      onChange={(e) => setNewStoreForm({...newStoreForm, name: e.target.value})}
                      placeholder="Enter store name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="store-email">Store Email</Label>
                    <Input
                      id="store-email"
                      type="email"
                      value={newStoreForm.email}
                      onChange={(e) => setNewStoreForm({...newStoreForm, email: e.target.value})}
                      placeholder="Enter store email"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="store-address">Store Address</Label>
                  <Textarea
                    id="store-address"
                    value={newStoreForm.address}
                    onChange={(e) => setNewStoreForm({...newStoreForm, address: e.target.value})}
                    placeholder="Enter store address"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="store-owner">Store Owner</Label>
                  <Select 
                    value={newStoreForm.ownerId} 
                    onValueChange={(value) => setNewStoreForm({...newStoreForm, ownerId: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select store owner" />
                    </SelectTrigger>
                    <SelectContent>
                      {storeOwners.map((owner) => (
                        <SelectItem key={owner.id} value={owner.id}>
                          {owner.name} ({owner.email})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button type="submit" className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Store
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};