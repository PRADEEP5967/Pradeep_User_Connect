import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Upload, Download, Trash2, UserPlus, Store, FileSpreadsheet } from 'lucide-react';
import { addUser, addStore, getUsers, getStores } from '@/utils/localStorage';
import { toast } from '@/hooks/use-toast';
import { User, Store as StoreType } from '@/types';

interface BulkOperationsProps {
  onDataUpdate: () => void;
}

export const BulkOperations: React.FC<BulkOperationsProps> = ({ onDataUpdate }) => {
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [selectedStores, setSelectedStores] = useState<string[]>([]);
  const [bulkUserData, setBulkUserData] = useState('');
  const [bulkStoreData, setBulkStoreData] = useState('');
  const [isImporting, setIsImporting] = useState(false);

  const users = getUsers();
  const stores = getStores();

  const handleBulkUserImport = async () => {
    if (!bulkUserData.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Please provide user data to import',
        variant: 'destructive'
      });
      return;
    }

    setIsImporting(true);
    try {
      const lines = bulkUserData.trim().split('\n');
      let successCount = 0;
      let errorCount = 0;

      for (const line of lines) {
        try {
          const [name, email, password, address, role] = line.split(',').map(s => s.trim());
          
          if (!name || !email || !password || !address) {
            errorCount++;
            continue;
          }

          addUser({
            name,
            email,
            address,
            role: (role as 'user' | 'store_owner' | 'admin') || 'user'
          });
          successCount++;
        } catch (error) {
          errorCount++;
        }
      }

      toast({
        title: 'Bulk Import Complete',
        description: `Successfully imported ${successCount} users. ${errorCount} errors occurred.`
      });

      setBulkUserData('');
      onDataUpdate();
    } catch (error) {
      toast({
        title: 'Import Error',
        description: 'Failed to import users',
        variant: 'destructive'
      });
    }
    setIsImporting(false);
  };

  const handleBulkStoreImport = async () => {
    if (!bulkStoreData.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Please provide store data to import',
        variant: 'destructive'
      });
      return;
    }

    setIsImporting(true);
    try {
      const lines = bulkStoreData.trim().split('\n');
      const storeOwners = users.filter(u => u.role === 'store_owner');
      let successCount = 0;
      let errorCount = 0;

      for (const line of lines) {
        try {
          const [name, email, address, ownerEmail] = line.split(',').map(s => s.trim());
          
          if (!name || !email || !address || !ownerEmail) {
            errorCount++;
            continue;
          }

          const owner = storeOwners.find(u => u.email === ownerEmail);
          if (!owner) {
            errorCount++;
            continue;
          }

          addStore({
            name,
            email,
            address,
            ownerId: owner.id
          });
          successCount++;
        } catch (error) {
          errorCount++;
        }
      }

      toast({
        title: 'Bulk Import Complete',
        description: `Successfully imported ${successCount} stores. ${errorCount} errors occurred.`
      });

      setBulkStoreData('');
      onDataUpdate();
    } catch (error) {
      toast({
        title: 'Import Error',
        description: 'Failed to import stores',
        variant: 'destructive'
      });
    }
    setIsImporting(false);
  };

  const generateSampleUserData = () => {
    return `John Doe, john.doe@email.com, Pass123!, 123 Main St, user
Jane Smith, jane.smith@email.com, Pass456!, 456 Oak Ave, user
Mike Johnson, mike.johnson@email.com, Store123!, 789 Pine Rd, store_owner`;
  };

  const generateSampleStoreData = () => {
    return `Tech Store, tech@store.com, 100 Tech Blvd, mike.johnson@email.com
Fashion Hub, fashion@hub.com, 200 Style St, mike.johnson@email.com`;
  };

  return (
    <div className="space-y-6">
      {/* Bulk User Import */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="w-5 h-5" />
            Bulk User Import
          </CardTitle>
          <CardDescription>
            Import multiple users at once using CSV format
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="bulk-users">User Data (CSV Format)</Label>
            <Textarea
              id="bulk-users"
              placeholder="Name, Email, Password, Address, Role&#10;John Doe, john@email.com, Pass123!, 123 Main St, user"
              value={bulkUserData}
              onChange={(e) => setBulkUserData(e.target.value)}
              rows={6}
              className="font-mono text-sm"
            />
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setBulkUserData(generateSampleUserData())}
              >
                <FileSpreadsheet className="w-4 h-4 mr-2" />
                Load Sample Data
              </Button>
              <Badge variant="outline" className="text-xs">
                Format: Name, Email, Password, Address, Role
              </Badge>
            </div>
          </div>
          <Button 
            onClick={handleBulkUserImport}
            disabled={isImporting || !bulkUserData.trim()}
            className="w-full"
          >
            <Upload className="w-4 h-4 mr-2" />
            Import Users
          </Button>
        </CardContent>
      </Card>

      {/* Bulk Store Import */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Store className="w-5 h-5" />
            Bulk Store Import
          </CardTitle>
          <CardDescription>
            Import multiple stores at once using CSV format
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="bulk-stores">Store Data (CSV Format)</Label>
            <Textarea
              id="bulk-stores"
              placeholder="Name, Email, Address, Owner Email&#10;Tech Store, tech@store.com, 100 Tech Blvd, owner@email.com"
              value={bulkStoreData}
              onChange={(e) => setBulkStoreData(e.target.value)}
              rows={6}
              className="font-mono text-sm"
            />
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setBulkStoreData(generateSampleStoreData())}
              >
                <FileSpreadsheet className="w-4 h-4 mr-2" />
                Load Sample Data
              </Button>
              <Badge variant="outline" className="text-xs">
                Format: Name, Email, Address, Owner Email
              </Badge>
            </div>
          </div>
          <Button 
            onClick={handleBulkStoreImport}
            disabled={isImporting || !bulkStoreData.trim()}
            className="w-full"
          >
            <Upload className="w-4 h-4 mr-2" />
            Import Stores
          </Button>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Perform common bulk operations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              variant="outline"
              onClick={() => {
                const csvData = users.map(u => 
                  `${u.name},${u.email},${u.role},${u.address},${new Date(u.created_at).toLocaleDateString()}`
                ).join('\n');
                const blob = new Blob([`Name,Email,Role,Address,Join Date\n${csvData}`], { type: 'text/csv' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'all-users-export.csv';
                a.click();
                URL.revokeObjectURL(url);
              }}
              className="h-20 flex-col gap-2"
            >
              <Download className="w-6 h-6" />
              Export All Users
            </Button>
            
            <Button
              variant="outline"
              onClick={() => {
                const csvData = stores.map(s => 
                  `${s.name},${s.email},${s.address},${s.averageRating},${s.totalRatings},${new Date(s.createdAt).toLocaleDateString()}`
                ).join('\n');
                const blob = new Blob([`Name,Email,Address,Rating,Reviews,Date Added\n${csvData}`], { type: 'text/csv' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'all-stores-export.csv';
                a.click();
                URL.revokeObjectURL(url);
              }}
              className="h-20 flex-col gap-2"
            >
              <Download className="w-6 h-6" />
              Export All Stores
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};