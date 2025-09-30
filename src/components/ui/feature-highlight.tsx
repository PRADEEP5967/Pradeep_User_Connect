import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FeatureHighlightProps {
  icon: LucideIcon;
  title: string;
  description: string;
  badge?: string;
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'red';
  className?: string;
}

export const FeatureHighlight: React.FC<FeatureHighlightProps> = ({
  icon: Icon,
  title,
  description,
  badge,
  color = 'blue',
  className
}) => {
  const colorClasses = {
    blue: 'from-blue-500/10 to-blue-600/10 border-blue-500/20',
    green: 'from-green-500/10 to-green-600/10 border-green-500/20',
    purple: 'from-purple-500/10 to-purple-600/10 border-purple-500/20',
    orange: 'from-orange-500/10 to-orange-600/10 border-orange-500/20',
    red: 'from-red-500/10 to-red-600/10 border-red-500/20',
  };

  const iconColors = {
    blue: 'text-blue-600',
    green: 'text-green-600',
    purple: 'text-purple-600',
    orange: 'text-orange-600',
    red: 'text-red-600',
  };

  return (
    <Card className={cn('bg-gradient-to-br', colorClasses[color], className)}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className={cn('p-3 rounded-lg bg-background/50', iconColors[color])}>
            <Icon className="w-6 h-6" />
          </div>
          {badge && (
            <Badge variant="secondary" className="text-xs">
              {badge}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <CardTitle className="mb-2">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardContent>
    </Card>
  );
};