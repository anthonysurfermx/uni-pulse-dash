// src/components/StatCard.tsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { TrendingUp, TrendingDown } from 'lucide-react';

export interface StatCardProps {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  value: React.ReactNode;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  isLoading?: boolean;
  className?: string;
  ariaLabel?: string;
}

/**
 * StatCard - Componente reutilizable para mostrar estadísticas
 * Maneja loading states, accesibilidad y formateo consistente
 */
export const StatCard: React.FC<StatCardProps> = ({
  title,
  icon: Icon,
  value,
  change,
  changeType = 'neutral',
  isLoading = false,
  className = '',
  ariaLabel,
}) => {
  if (isLoading) {
    return (
      <Card className={`animate-pulse ${className}`}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-4 rounded" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-20 mb-2" />
          <Skeleton className="h-4 w-16" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card 
      className={className}
      role="group"
      aria-label={ariaLabel || `${title}: ${value}`}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold" aria-live="polite">
          {value}
        </div>
        
        {change && (
          <div className="mt-1">
            {changeType !== 'neutral' ? (
              <Badge
                variant={changeType === 'positive' ? 'default' : 'destructive'}
                className="text-xs"
                aria-label={`${change} - ${changeType === 'positive' ? 'positive' : 'negative'} change`}
              >
                {changeType === 'positive' ? (
                  <TrendingUp className="h-3 w-3 mr-1" aria-hidden="true" />
                ) : (
                  <TrendingDown className="h-3 w-3 mr-1" aria-hidden="true" />
                )}
                {change}
              </Badge>
            ) : (
              <p className="text-xs text-muted-foreground">
                {change}
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StatCard;