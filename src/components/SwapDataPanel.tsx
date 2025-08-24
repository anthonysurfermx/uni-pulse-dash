import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, ExternalLink, TrendingUp, TrendingDown, DollarSign, Clock } from 'lucide-react';
import { getSwapData } from '@/config/api';

interface SwapData {
  id: string;
  amount0: string;
  amount1: string;
  amountUSD: string;
  chainId: number;
  timestamp: string;
  pool: string;
  token0_id: string;
  token1_id: string;
  transaction: string;
  origin: string;
}

interface SwapDataPanelProps {
  walletAddress?: string;
}

export const SwapDataPanel: React.FC<SwapDataPanelProps> = ({ walletAddress }) => {
  const [swapData, setSwapData] = useState<SwapData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [usingMockData, setUsingMockData] = useState(false);

  useEffect(() => {
    const fetchSwapData = async () => {
      if (!walletAddress) {
        setSwapData([]);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        const result = await getSwapData(walletAddress);
        
        if (result.success) {
          setSwapData(result.data);
          // Check if we're using mock data by looking at the console log
          setUsingMockData(result.data.length > 0 && result.data[0].id === '1');
        } else {
          setError('Failed to load swap data');
        }
      } catch (err) {
        setError('Failed to connect to GraphQL API');
        console.error('Swap data fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSwapData();
  }, [walletAddress]);

  const formatAmount = (amount: string) => {
    const num = parseFloat(amount);
    if (isNaN(num)) return '0';
    
    if (Math.abs(num) >= 1e6) {
      return `$${(num / 1e6).toFixed(2)}M`;
    } else if (Math.abs(num) >= 1e3) {
      return `$${(num / 1e3).toFixed(2)}K`;
    } else {
      return `$${num.toFixed(2)}`;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(parseInt(timestamp) * 1000);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  const getSwapType = (amount0: string, amount1: string) => {
    const amt0 = parseFloat(amount0);
    const amt1 = parseFloat(amount1);
    
    if (amt0 > 0 && amt1 < 0) return 'Buy';
    if (amt0 < 0 && amt1 > 0) return 'Sell';
    return 'Swap';
  };

  const getSwapIcon = (amount0: string, amount1: string) => {
    const amt0 = parseFloat(amount0);
    const amt1 = parseFloat(amount1);
    
    if (amt0 > 0 && amt1 < 0) return <TrendingUp className="h-4 w-4 text-green-500" />;
    if (amt0 < 0 && amt1 > 0) return <TrendingDown className="h-4 w-4 text-red-500" />;
    return <DollarSign className="h-4 w-4 text-blue-500" />;
  };

  if (loading) {
    return (
      <Card className="bg-gradient-card border-border shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Swap History
            {walletAddress && (
              <Badge variant="outline" className="ml-2">
                {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            <span className="ml-2 text-muted-foreground">Loading swap data...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="bg-gradient-card border-border shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Swap History
            {walletAddress && (
              <Badge variant="outline" className="ml-2">
                {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <span className="text-destructive">{error}</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-card border-border shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            <span>Swap History</span>
            {walletAddress && (
              <Badge variant="outline" className="ml-2">
                {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
              </Badge>
            )}
            {usingMockData && (
              <Badge variant="secondary" className="ml-2 text-xs">
                Demo Data
              </Badge>
            )}
          </div>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => {
              if (walletAddress) {
                window.open(`https://etherscan.io/address/${walletAddress}`, '_blank');
              }
            }}
          >
            View All
            <ExternalLink className="h-3 w-3 ml-1" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {swapData.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            {walletAddress ? 'No swap data found for this wallet' : 'Connect a wallet to view swap history'}
          </div>
        ) : (
          <>
            {usingMockData && (
              <div className="mb-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                <p className="text-sm text-yellow-600 dark:text-yellow-400">
                  ⚠️ GraphQL endpoint is currently unavailable. Showing demo data for testing purposes.
                </p>
              </div>
            )}
          <div className="space-y-4">
            {swapData.slice(0, 10).map((swap) => (
              <div key={swap.id} className="flex items-center justify-between p-4 border rounded-lg bg-card/50">
                <div className="flex items-center gap-3">
                  {getSwapIcon(swap.amount0, swap.amount1)}
                  <div>
                    <div className="font-medium">
                      {getSwapType(swap.amount0, swap.amount1)} {swap.token0_id}/{swap.token1_id}
                    </div>
                    <div className="text-sm text-muted-foreground flex items-center gap-2">
                      <Clock className="h-3 w-3" />
                      {formatTimestamp(swap.timestamp)}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium">
                    {formatAmount(swap.amountUSD)}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Pool: {swap.pool.slice(0, 8)}...
                  </div>
                </div>
              </div>
            ))}
            {swapData.length > 10 && (
              <div className="text-center text-sm text-muted-foreground">
                Showing 10 of {swapData.length} swaps
              </div>
            )}
          </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};
