// src/components/PositionCard.tsx - Corregido con validaciones

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, TrendingUp, DollarSign, Activity } from "lucide-react";

// Tipo para la posición
interface Position {
  id?: string;
  tokenPair?: string;
  currentPrice?: number;
  minPrice?: number;
  maxPrice?: number;
  inRange?: boolean;
  liquidity?: string | number;
  unclaimedFees?: string | number;
  apr?: number;
  impermanentLoss?: number;
  feeTier?: string;
  positionId?: string;
  owner?: string;
  lastUpdated?: string;
  [key: string]: unknown;
}

interface PositionCardProps {
  position: Position;
}

const PositionCard: React.FC<PositionCardProps> = ({ position }) => {
  // Valores por defecto seguros
  const safePosition = {
    id: position?.id || 'unknown',
    tokenPair: position?.tokenPair || 'Unknown/Unknown',
    currentPrice: position?.currentPrice || 0,
    minPrice: position?.minPrice || 0,
    maxPrice: position?.maxPrice || 0,
    inRange: position?.inRange ?? false,
    liquidity: position?.liquidity || '0',
    unclaimedFees: position?.unclaimedFees || '0',
    apr: position?.apr || 0,
    impermanentLoss: position?.impermanentLoss || 0,
    feeTier: position?.feeTier || '0%',
    positionId: position?.positionId || position?.id || 'N/A',
    owner: position?.owner || 'Unknown',
    lastUpdated: position?.lastUpdated || new Date().toISOString()
  };

  // Formatear valores de manera segura
  const formatValue = (value: string | number | undefined, prefix = ''): string => {
    if (value === undefined || value === null) return `${prefix}0`;
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(numValue)) return `${prefix}0`;
    return `${prefix}${numValue.toLocaleString()}`;
  };

  const formatCurrency = (value: string | number | undefined): string => {
    return formatValue(value, '$');
  };

  const formatPercentage = (value: number | undefined): string => {
    if (!value || isNaN(value)) return '0%';
    return `${value.toFixed(2)}%`;
  };

  const formatDate = (dateString: string): string => {
    try {
      return new Date(dateString).toLocaleDateString('es-ES');
    } catch {
      return 'N/A';
    }
  };

  const { inRange } = safePosition;

  return (
    <Card className={`transition-all hover:shadow-lg ${inRange ? 'border-green-200 bg-green-50/30' : 'border-orange-200 bg-orange-50/30'}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">
            {safePosition.tokenPair}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant={inRange ? "default" : "secondary"} className={inRange ? "bg-green-500" : "bg-orange-500"}>
              {inRange ? "In Range" : "Out of Range"}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {safePosition.feeTier}
            </Badge>
          </div>
        </div>
        <CardDescription className="text-xs text-gray-500">
          Position ID: {safePosition.positionId} • {formatDate(safePosition.lastUpdated)}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Price Range */}
        <div className="grid grid-cols-3 gap-3 text-sm">
          <div className="text-center p-2 bg-gray-50 rounded">
            <div className="text-xs text-gray-500 mb-1">Min Price</div>
            <div className="font-semibold">{formatCurrency(safePosition.minPrice)}</div>
          </div>
          <div className="text-center p-2 bg-blue-50 rounded">
            <div className="text-xs text-gray-500 mb-1">Current</div>
            <div className="font-semibold text-blue-600">{formatCurrency(safePosition.currentPrice)}</div>
          </div>
          <div className="text-center p-2 bg-gray-50 rounded">
            <div className="text-xs text-gray-500 mb-1">Max Price</div>
            <div className="font-semibold">{formatCurrency(safePosition.maxPrice)}</div>
          </div>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-blue-500" />
            <div>
              <div className="text-xs text-gray-500">Liquidity</div>
              <div className="font-semibold">{formatCurrency(safePosition.liquidity)}</div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-green-500" />
            <div>
              <div className="text-xs text-gray-500">Unclaimed Fees</div>
              <div className="font-semibold text-green-600">{formatCurrency(safePosition.unclaimedFees)}</div>
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-purple-500" />
            <div>
              <div className="text-xs text-gray-500">APR</div>
              <div className="font-semibold text-purple-600">{formatPercentage(safePosition.apr)}</div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <AlertTriangle className={`h-4 w-4 ${safePosition.impermanentLoss > 5 ? 'text-red-500' : 'text-yellow-500'}`} />
            <div>
              <div className="text-xs text-gray-500">IL</div>
              <div className={`font-semibold ${safePosition.impermanentLoss > 5 ? 'text-red-600' : 'text-yellow-600'}`}>
                {formatPercentage(safePosition.impermanentLoss)}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Button variant="outline" size="sm" className="flex-1">
            <Activity className="h-4 w-4 mr-1" />
            Manage
          </Button>
          {!inRange && (
            <Button variant="secondary" size="sm" className="flex-1">
              <AlertTriangle className="h-4 w-4 mr-1" />
              Rebalance
            </Button>
          )}
        </div>

        {/* Owner info (for debugging) */}
        <div className="text-xs text-gray-400 border-t pt-2">
          Owner: {safePosition.owner.slice(0, 6)}...{safePosition.owner.slice(-4)}
        </div>
      </CardContent>
    </Card>
  );
};

export default PositionCard;