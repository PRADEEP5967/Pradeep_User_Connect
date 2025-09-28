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
import { 
  Users, 
  Store as StoreIcon, 
  Star, 
  Plus, 
  Search,
  Filter,
  BarChart3
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const [users] = useState<User[]>(getUsers());
  const [stores] = useState<Store[]>(getStores());
  const [ratings] = useState(getRatings());
  
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  
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

  // Filtered users
  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           user.address.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = roleFilter === 'all' || user.role === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [users, searchTerm, roleFilter]);

  // Filtered stores
  const filteredStores = useMemo(() => {
    return stores.filter(store => 
      store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      store.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      store.address.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [stores, searchTerm]);

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

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'admin': return 'destructive';
      case 'store_owner': return 'default';
      default: return 'secondary';
    }
  };

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
            <CardTitle className="text-sm font-medium">Platform Health</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">Active</div>
            <p className="text-xs text-muted-foreground">
              All systems operational
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="users" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="stores">Stores</TabsTrigger>
          <TabsTrigger value="add-user">Add User</TabsTrigger>
          <TabsTrigger value="add-store">Add Store</TabsTrigger>
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
              <div className="mb-6">
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