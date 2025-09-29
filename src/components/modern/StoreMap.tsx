import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { StarRating } from '@/components/ui/star-rating';
import { Store } from '@/types';
import { 
  Map, 
  MapPin, 
  Navigation, 
  Layers, 
  Search,
  Filter,
  Star,
  Phone,
  Clock,
  Car,
  Walking
} from 'lucide-react';

interface StoreMapProps {
  stores: Store[];
  selectedStore?: Store | null;
  onStoreSelect: (store: Store) => void;
}

export const StoreMap: React.FC<StoreMapProps> = ({
  stores,
  selectedStore,
  onStoreSelect
}) => {
  const [mapView, setMapView] = useState<'map' | 'satellite' | 'hybrid'>('map');
  const [showDirections, setShowDirections] = useState(false);

  // Mock map data - in a real app, this would integrate with Google Maps, Mapbox, etc.
  const mockStoreLocations = stores.map((store, index) => ({
    ...store,
    lat: 40.7128 + (Math.random() - 0.5) * 0.1, // Mock NYC coordinates
    lng: -74.0060 + (Math.random() - 0.5) * 0.1,
    distance: Math.round(Math.random() * 10 + 1), // Mock distance in miles
    estimatedTime: Math.round(Math.random() * 30 + 5) // Mock travel time in minutes
  }));

  const getStoreMarkerColor = (rating: number) => {
    if (rating >= 4.5) return 'bg-green-500';
    if (rating >= 4.0) return 'bg-blue-500';
    if (rating >= 3.5) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="space-y-6">
      {/* Map Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Map className="w-5 h-5" />
            Store Locations
          </CardTitle>
          <CardDescription>
            Find stores near you and get directions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 mb-4">
            <Button
              variant={mapView === 'map' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setMapView('map')}
            >
              <Map className="w-4 h-4 mr-2" />
              Map
            </Button>
            <Button
              variant={mapView === 'satellite' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setMapView('satellite')}
            >
              <Layers className="w-4 h-4 mr-2" />
              Satellite
            </Button>
            <Button
              variant={mapView === 'hybrid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setMapView('hybrid')}
            >
              Hybrid
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowDirections(!showDirections)}
            >
              <Navigation className="w-4 h-4 mr-2" />
              Directions
            </Button>
          </div>

          {/* Mock Map Display */}
          <div className="relative bg-muted rounded-lg h-96 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-green-100 flex items-center justify-center">
              <div className="text-center">
                <Map className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                <p className="text-lg font-semibold text-muted-foreground">Interactive Map</p>
                <p className="text-sm text-muted-foreground">
                  In a real implementation, this would show an interactive map
                </p>
              </div>
            </div>

            {/* Mock Store Markers */}
            {mockStoreLocations.slice(0, 5).map((store, index) => (
              <div
                key={store.id}
                className={`absolute w-8 h-8 rounded-full border-2 border-white shadow-lg cursor-pointer transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center text-white text-xs font-bold ${getStoreMarkerColor(store.averageRating)}`}
                style={{
                  left: `${20 + index * 15}%`,
                  top: `${30 + index * 10}%`
                }}
                onClick={() => onStoreSelect(store)}
              >
                {index + 1}
              </div>
            ))}

            {/* Selected Store Info */}
            {selectedStore && (
              <div className="absolute bottom-4 left-4 right-4">
                <Card className="shadow-lg">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold">{selectedStore.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <StarRating rating={selectedStore.averageRating} readonly size="sm" />
                          <span className="text-sm text-muted-foreground">
                            ({selectedStore.totalRatings} reviews)
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {selectedStore.address}
                        </p>
                      </div>
                      <Button size="sm">
                        <Navigation className="w-4 h-4 mr-2" />
                        Directions
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Store List with Distance */}
      <Card>
        <CardHeader>
          <CardTitle>Nearby Stores</CardTitle>
          <CardDescription>
            Stores sorted by distance from your location
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockStoreLocations.map((store) => (
              <div
                key={store.id}
                className={`p-4 rounded-lg border cursor-pointer transition-all hover:shadow-md ${
                  selectedStore?.id === store.id ? 'border-primary bg-primary/5' : 'border-border'
                }`}
                onClick={() => onStoreSelect(store)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold">{store.name}</h3>
                      <Badge variant="outline" className="text-xs">
                        {store.distance} mi
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-2 mb-2">
                      <StarRating rating={store.averageRating} readonly size="sm" />
                      <span className="text-sm text-muted-foreground">
                        {store.averageRating.toFixed(1)} ({store.totalRatings} reviews)
                      </span>
                    </div>

                    <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
                      <MapPin className="w-4 h-4" />
                      <span>{store.address}</span>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Car className="w-4 h-4" />
                        <span>{store.estimatedTime} min drive</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Walking className="w-4 h-4" />
                        <span>{Math.round(store.estimatedTime * 3)} min walk</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>Open until 9 PM</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <Button size="sm" variant="outline">
                      <Phone className="w-4 h-4 mr-2" />
                      Call
                    </Button>
                    <Button size="sm">
                      <Navigation className="w-4 h-4 mr-2" />
                      Directions
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Directions Panel */}
      {showDirections && selectedStore && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Navigation className="w-5 h-5" />
              Directions to {selectedStore.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="font-semibold flex items-center gap-2">
                    <Car className="w-4 h-4" />
                    By Car
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {mockStoreLocations.find(s => s.id === selectedStore.id)?.estimatedTime} minutes
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {mockStoreLocations.find(s => s.id === selectedStore.id)?.distance} miles
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold flex items-center gap-2">
                    <Walking className="w-4 h-4" />
                    Walking
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {Math.round((mockStoreLocations.find(s => s.id === selectedStore.id)?.estimatedTime || 0) * 3)} minutes
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {mockStoreLocations.find(s => s.id === selectedStore.id)?.distance} miles
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold">Route</h4>
                <div className="space-y-1 text-sm text-muted-foreground">
                  <p>1. Head north on Main St</p>
                  <p>2. Turn right on Oak Avenue</p>
                  <p>3. Continue for 0.5 miles</p>
                  <p>4. Destination will be on your right</p>
                </div>
              </div>

              <Button className="w-full">
                <Navigation className="w-4 h-4 mr-2" />
                Start Navigation
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};