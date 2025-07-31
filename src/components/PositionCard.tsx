import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, TrendingDown, Settings, AlertTriangle } from "lucide-react";

interface PositionCardProps {
  tokenPair: string;
  currentPrice: number;
  minPrice: number;
  maxPrice: number;
  inRange: boolean;
  unclaimedFees: string;
  apr: number;
  impermanentLoss: number;
  liquidity: string;
  volume24h: string;
  feeTier: string;
}

export const PositionCard = ({
  tokenPair,
  currentPrice,
  minPrice,
  maxPrice,
  inRange,
  unclaimedFees,
  apr,
  impermanentLoss,
  liquidity,
  volume24h,
  feeTier,
}: PositionCardProps) => {
  const pricePosition = ((currentPrice - minPrice) / (maxPrice - minPrice)) * 100;
  
  return (
    <Card className="bg-gradient-card border-border shadow-card hover:shadow-glow transition-all duration-300">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-bold">{tokenPair}</CardTitle>
          <div className="flex items-center space-x-2">
            <Badge variant={inRange ? "default" : "destructive"} className="text-xs">
              {inRange ? "In Range" : "Out of Range"}
            </Badge>
            <Badge variant="secondary" className="text-xs">
              {feeTier}
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Price Range */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Min: ${minPrice.toFixed(4)}</span>
            <span className="font-medium text-foreground">
              Current: ${currentPrice.toFixed(4)}
            </span>
            <span>Max: ${maxPrice.toFixed(4)}</span>
          </div>
          <div className="relative">
            <Progress value={Math.max(0, Math.min(100, pricePosition))} className="h-2" />
            <div 
              className="absolute top-0 w-1 h-2 bg-primary rounded-full transform -translate-x-1/2"
              style={{ left: `${Math.max(2, Math.min(98, pricePosition))}%` }}
            />
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Unclaimed Fees</p>
            <p className="text-sm font-semibold text-success">{unclaimedFees}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">APR</p>
            <div className="flex items-center space-x-1">
              <span className="text-sm font-semibold">{apr.toFixed(2)}%</span>
              <TrendingUp className="h-3 w-3 text-success" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Liquidity</p>
            <p className="text-sm font-semibold">{liquidity}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">24h Volume</p>
            <p className="text-sm font-semibold">{volume24h}</p>
          </div>
        </div>

        {/* Impermanent Loss */}
        <div className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
          <div className="flex items-center space-x-2">
            <TrendingDown className="h-4 w-4 text-destructive" />
            <span className="text-sm text-muted-foreground">IL:</span>
          </div>
          <span className={`text-sm font-semibold ${impermanentLoss < 0 ? 'text-destructive' : 'text-success'}`}>
            {impermanentLoss.toFixed(2)}%
          </span>
        </div>

        {/* Actions */}
        <div className="flex space-x-2 pt-2">
          <Button variant="gradient" size="sm" className="flex-1">
            Rebalance
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4" />
          </Button>
          {!inRange && (
            <Button variant="warning" size="sm">
              <AlertTriangle className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};