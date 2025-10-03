import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { StarRating } from '@/components/ui/star-rating';
import { Store, Rating } from '@/types';
import { MapPin, Mail, Phone, Calendar, Star, TrendingUp, MessageSquare } from 'lucide-react';

interface StoreDetailDialogProps {
  store: Store | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ratings: Rating[];
}

export const StoreDetailDialog: React.FC<StoreDetailDialogProps> = ({
  store,
  open,
  onOpenChange,
  ratings
}) => {
  if (!store) return null;

  const storeRatings = ratings.filter(r => r.storeId === store.id);
  const ratingsWithComments = storeRatings.filter(r => r.comment);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{store.name}</DialogTitle>
          <DialogDescription>
            Detailed store information and reviews
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Store Info */}
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full">
                  <Star className="w-5 h-5 fill-primary text-primary" />
                  <span className="font-bold text-xl text-primary">{store.averageRating.toFixed(1)}</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  Based on {store.totalRatings} reviews
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-5 h-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Address</p>
                      <p className="text-sm text-muted-foreground">{store.address}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <Mail className="w-5 h-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Email</p>
                      <a href={`mailto:${store.email}`} className="text-sm text-primary hover:underline">
                        {store.email}
                      </a>
                    </div>
                  </div>

                  {store.phone && (
                    <div className="flex items-start gap-2">
                      <Phone className="w-5 h-5 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">Phone</p>
                        <a href={`tel:${store.phone}`} className="text-sm text-primary hover:underline">
                          {store.phone}
                        </a>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  {store.category && (
                    <div>
                      <p className="text-sm font-medium mb-2">Category</p>
                      <Badge variant="secondary">{store.category}</Badge>
                    </div>
                  )}

                  {store.priceRange && (
                    <div>
                      <p className="text-sm font-medium mb-2">Price Range</p>
                      <Badge variant="outline">{store.priceRange}</Badge>
                    </div>
                  )}

                  <div className="flex items-start gap-2">
                    <Calendar className="w-5 h-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Joined</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(store.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {store.description && (
                <>
                  <Separator />
                  <div>
                    <p className="text-sm font-medium mb-2">About</p>
                    <p className="text-sm text-muted-foreground">{store.description}</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Rating Distribution */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Rating Distribution
              </h3>
              <div className="space-y-2">
                {[5, 4, 3, 2, 1].map(stars => {
                  const count = storeRatings.filter(r => r.rating === stars).length;
                  const percentage = store.totalRatings > 0 ? (count / store.totalRatings) * 100 : 0;
                  return (
                    <div key={stars} className="flex items-center gap-3">
                      <div className="w-12 text-sm font-medium">{stars} ★</div>
                      <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary transition-all"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <div className="w-16 text-sm text-muted-foreground text-right">
                        {count} ({percentage.toFixed(0)}%)
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Reviews with Comments */}
          {ratingsWithComments.length > 0 && (
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Customer Reviews ({ratingsWithComments.length})
                </h3>
                <div className="space-y-4">
                  {ratingsWithComments.slice(0, 5).map(rating => (
                    <div key={rating.id} className="p-4 bg-muted/50 rounded-lg space-y-2">
                      <div className="flex items-center justify-between">
                        <StarRating rating={rating.rating} readonly size="sm" />
                        <span className="text-xs text-muted-foreground">
                          {new Date(rating.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      {rating.comment && (
                        <p className="text-sm text-muted-foreground">{rating.comment}</p>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button className="flex-1" onClick={() => window.location.href = `mailto:${store.email}`}>
              <Mail className="w-4 h-4 mr-2" />
              Email Store
            </Button>
            {store.phone && (
              <Button variant="outline" className="flex-1" onClick={() => window.location.href = `tel:${store.phone}`}>
                <Phone className="w-4 h-4 mr-2" />
                Call Store
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
