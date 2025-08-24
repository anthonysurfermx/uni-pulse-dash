// src/components/PortfolioOverview.tsx - Actualizado para ENVIO V4
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Activity,
  Zap,
  Target,
  BarChart3,
  AlertCircle,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Wallet
} from "lucide-react";
import { PortfolioData } from '@/hooks/usePortfolio';

interface PortfolioOverviewProps {
  walletAddress: string;
  data: PortfolioData | null;
}

export const PortfolioOverview: React.FC<PortfolioOverviewProps> = ({ 
  walletAddress, 
  data 
}) => {
  // Si no hay wallet address, mostrar estado vacío
  if (!walletAddress) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <Wallet className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Wallet Connected</h3>
            <p className="text-muted-foreground">
              Enter a wallet address above to start analyzing Uniswap V4 positions
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Si no hay datos, mostrar loading o error
  if (!data) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <div className="animate-pulse">
              <div className="w-12 h-12 bg-muted rounded-full mx-auto mb-4"></div>
              <div className="h-4 bg-muted rounded w-48 mx-auto mb-2"></div>
              <div className="h-3 bg-muted rounded w-32 mx-auto"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header con información general */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Total Value Locked */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Volume</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.totalValueLocked}</div>
            <p className="text-xs text-muted-foreground">
              Total trading volume
            </p>
          </CardContent>
        </Card>

        {/* Total Fees Collected */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fees Collected</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{data.totalFeesCollected}</div>
            <p className="text-xs text-muted-foreground">
              LP rewards earned
            </p>
          </CardContent>
        </Card>

        {/* Active Positions */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Positions</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.activePositions}</div>
            <p className="text-xs text-muted-foreground">
              Currently earning fees
            </p>
          </CardContent>
        </Card>

        {/* Total Swaps */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Swaps</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.totalSwaps}</div>
            <p className="text-xs text-muted-foreground">
              Trading transactions
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Protocol Overview (si está disponible) */}
      {data.protocolOverview && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Protocol Overview
              <Badge variant="secondary">Uniswap V4</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground">Total Pools</p>
                <p className="text-2xl font-bold">{data.protocolOverview.totalPools.toLocaleString()}</p>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground">Protocol Volume</p>
                <p className="text-2xl font-bold">
                  ${(data.protocolOverview.totalVolumeUSD / 1e6).toFixed(1)}M
                </p>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground">Protocol Fees</p>
                <p className="text-2xl font-bold">
                  ${(data.protocolOverview.totalFeesUSD / 1e3).toFixed(1)}K
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Positions Details */}
      {data.positions && data.positions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Liquidity Positions ({data.positions.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.positions.slice(0, 5).map((position: any, index: number) => (
                <div key={position.id || index} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline">
                        {position.pool?.currency0?.symbol || 'TOKEN0'}/
                        {position.pool?.currency1?.symbol || 'TOKEN1'}
                      </Badge>
                      <Badge variant="secondary">
                        {position.pool?.fee ? (position.pool.fee / 10000).toFixed(2) + '%' : '0.3%'}
                      </Badge>
                      {parseFloat(position.liquidity) > 0 ? (
                        <Badge variant="default" className="bg-green-500">
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          Active
                        </Badge>
                      ) : (
                        <Badge variant="secondary">
                          <Clock className="w-3 h-3 mr-1" />
                          Inactive
                        </Badge>
                      )}
                    </div>
                    
                    <div className="text-right">
                      <p className="text-sm font-medium">
                        Liquidity: {parseFloat(position.liquidity || 0).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Deposited</p>
                      <p className="font-medium">
                        {(parseFloat(position.depositedToken0) / 1e18).toFixed(6)} {position.pool?.currency0?.symbol}
                      </p>
                      <p className="font-medium">
                        {(parseFloat(position.depositedToken1) / 1e18).toFixed(6)} {position.pool?.currency1?.symbol}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Fees Earned</p>
                      <p className="font-medium text-green-600">
                        {(parseFloat(position.collectedFeesToken0) / 1e18).toFixed(6)} {position.pool?.currency0?.symbol}
                      </p>
                      <p className="font-medium text-green-600">
                        {(parseFloat(position.collectedFeesToken1) / 1e18).toFixed(6)} {position.pool?.currency1?.symbol}
                      </p>
                    </div>
                  </div>

                  {/* Range Status */}
                  <div className="mt-3 pt-3 border-t">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Position Range</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs">
                          {position.tickLower} - {position.tickUpper}
                        </span>
                        {position.pool?.tick >= position.tickLower && position.pool?.tick <= position.tickUpper ? (
                          <Badge variant="default" className="bg-green-500">In Range</Badge>
                        ) : (
                          <Badge variant="destructive">Out of Range</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {data.positions.length > 5 && (
                <div className="text-center pt-4">
                  <Badge variant="outline">
                    +{data.positions.length - 5} more positions
                  </Badge>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Activity */}
      {data.recentActivity && data.recentActivity.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.recentActivity.map((activity: any, index: number) => (
                <div key={activity.id || index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {parseFloat(activity.amount0) > 0 ? (
                      <ArrowUpRight className="w-4 h-4 text-green-500" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4 text-red-500" />
                    )}
                    <div>
                      <p className="font-medium">
                        {activity.pool?.currency0?.symbol || 'TOKEN0'}/
                        {activity.pool?.currency1?.symbol || 'TOKEN1'} Swap
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(parseInt(activity.timestamp) * 1000).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="font-medium">
                      {activity.amountUSD ? `$${parseFloat(activity.amountUSD).toFixed(2)}` : 'N/A'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {parseFloat(activity.amount0) > 0 ? 'Buy' : 'Sell'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty State para cuando no hay datos */}
      {(!data.positions || data.positions.length === 0) && (!data.recentActivity || data.recentActivity.length === 0) && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <AlertCircle className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Activity Found</h3>
              <p className="text-muted-foreground">
                This wallet doesn't have any Uniswap V4 positions or trading activity yet.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PortfolioOverview;