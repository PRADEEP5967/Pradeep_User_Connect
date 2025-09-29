import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bell, Check, X, Star, User, Store } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { getRatings, getUsers, getStores } from '@/utils/localStorage';

interface Notification {
  id: string;
  type: 'rating' | 'user_joined' | 'store_added';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  data?: any;
}

export const NotificationSystem: React.FC = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    if (!user) return;

    const generateNotifications = () => {
      const ratings = getRatings();
      const users = getUsers();
      const stores = getStores();
      
      const notifs: Notification[] = [];

      if (user.role === 'admin') {
        // Recent user registrations
        const recentUsers = users
          .filter(u => u.role !== 'admin')
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 5);

        recentUsers.forEach(u => {
          notifs.push({
            id: `user-${u.id}`,
            type: 'user_joined',
            title: 'New User Registration',
            message: `${u.name} joined the platform`,
            timestamp: u.createdAt,
            read: false,
            data: u
          });
        });

        // Recent store additions
        const recentStores = stores
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 3);

        recentStores.forEach(s => {
          notifs.push({
            id: `store-${s.id}`,
            type: 'store_added',
            title: 'New Store Added',
            message: `${s.name} was added to the platform`,
            timestamp: s.createdAt,
            read: false,
            data: s
          });
        });
      }

      if (user.role === 'store_owner') {
        // Recent ratings for owner's store
        const ownerStore = stores.find(s => s.ownerId === user.id);
        if (ownerStore) {
          const storeRatings = ratings
            .filter(r => r.storeId === ownerStore.id)
            .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
            .slice(0, 5);

          storeRatings.forEach(r => {
            const ratingUser = users.find(u => u.id === r.userId);
            notifs.push({
              id: `rating-${r.id}`,
              type: 'rating',
              title: 'New Rating Received',
              message: `${ratingUser?.name || 'A customer'} rated your store ${r.rating} stars`,
              timestamp: r.updatedAt,
              read: false,
              data: { rating: r, user: ratingUser }
            });
          });
        }
      }

      // Sort by timestamp
      notifs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      
      setNotifications(notifs.slice(0, 10));
    };

    generateNotifications();
    const interval = setInterval(generateNotifications, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, [user]);

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'rating': return <Star className="w-4 h-4" />;
      case 'user_joined': return <User className="w-4 h-4" />;
      case 'store_added': return <Store className="w-4 h-4" />;
      default: return <Bell className="w-4 h-4" />;
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  if (!user) return null;

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setShowNotifications(!showNotifications)}
        className="relative p-2"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <Badge 
            variant="destructive" 
            className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs"
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </Badge>
        )}
      </Button>

      {showNotifications && (
        <Card className="absolute right-0 top-12 w-96 z-50 shadow-lg">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Notifications</CardTitle>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={markAllAsRead}
                    className="text-xs"
                  >
                    <Check className="w-3 h-3 mr-1" />
                    Mark all read
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowNotifications(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-96">
              {notifications.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground">
                  <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No notifications yet</p>
                </div>
              ) : (
                <div className="space-y-1">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-3 border-b hover:bg-muted/50 cursor-pointer transition-colors ${
                        !notification.read ? 'bg-muted/30' : ''
                      }`}
                      onClick={() => markAsRead(notification.id)}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`p-1 rounded-full ${
                          notification.type === 'rating' ? 'bg-yellow-100 text-yellow-600' :
                          notification.type === 'user_joined' ? 'bg-blue-100 text-blue-600' :
                          'bg-green-100 text-green-600'
                        }`}>
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium truncate">
                              {notification.title}
                            </p>
                            {!notification.read && (
                              <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 ml-2" />
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            {notification.message}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(notification.timestamp).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </div>
  );
};