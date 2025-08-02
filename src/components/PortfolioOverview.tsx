import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, DollarSign, Percent, Wallet } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { API_CONFIG } from '../config/api';

interface PortfolioOverviewProps {
  data?: any;
  walletAddress?: string;
}

export const PortfolioOverview: React.FC<PortfolioOverviewProps> = ({ data, walletAddress }) => {
  const [portfolioData, setPortfolioData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPortfolioData = async () => {
      // Si no hay wallet address, mostrar estado vacío
      if (!walletAddress) {
        setPortfolioData(null);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`${API_CONFIG.baseURL}/api/portfolio/${walletAddress}`);
        const result = await response.json();
        
        console.log('📊 Portfolio data:', result);
        
        if (result.success) {
          setPortfolioData(result.data);
        } else {
          setError(result.error || 'Failed to load portfolio data');
        }
      } catch (err) {
        setError('Failed to connect to API');
        console.error('Portfolio fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolioData();
    
    // Refresh every 30 seconds if wallet is selected
    if (walletAddress) {
      const interval = setInterval(fetchPortfolioData, 30000);
      return () => clearInterval(interval);
    }
  }, [walletAddress]);

  // Use passed data if available
  const displayData = data || portfolioData;

  // Loading state
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[1,2,3,4].map(i => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium bg-gray-200 h-4 w-24 rounded"></CardTitle>
              <div className="bg-gray-200 h-4 w-4 rounded"></div>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-200 h-8 w-20 rounded mb-2"></div>
              <div className="bg-gray-200 h-4 w-16 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  // Error state
  if (error && walletAddress) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="col-span-full">
          <CardContent className="pt-6">
            <div className="text-center text-red-500">
              <p>⚠️ {error}</p>
              <p className="text-sm text-gray-500 mt-2">Please check the wallet address</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // No wallet selected state
  if (!walletAddress) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { title: "Total Value Locked", value: "$0.00", icon: DollarSign },
          { title: "Total Unclaimed Fees", value: "$0.00", icon: TrendingUp },
          { title: "Average APR", value: "0%", icon: Percent },
          { title: "Active Positions", value: "0", icon: Wallet },
        ].map((stat, index) => (
          <Card key={index} className="opacity-60">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Enter a wallet address to see data
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  // No data found for wallet
  if (!displayData && walletAddress) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="col-span-full">
          <CardContent className="pt-6">
            <div className="text-center text-gray-500">
              <Wallet className="h-12 w-12 mx-auto mb-2 text-gray-400" />
              <p>No Uniswap V3 positions found</p>
              <p className="text-sm mt-1">Wallet: {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Calculate stats from real data
  const totalPositions = displayData.totalPositions || 0;
  const pools = displayData.pools || [];
  const tvl = displayData.totalValue || 0;
  const fees = displayData.totalFees || 0;

  const stats = [
    {
      title: "Total Value Locked",
      value: `$${tvl.toLocaleString()}`,
      change: pools.length > 0 ? `${pools.length} pools` : "No active pools",
      changeType: pools.length > 0 ? "positive" : "neutral",
      icon: DollarSign,
    },
    {
      title: "Total Unclaimed Fees", 
      value: `$${fees.toLocaleString()}`,
      change: fees > 0 ? "Ready to collect" : "No fees",
      changeType: fees > 0 ? "positive" : "neutral",
      icon: TrendingUp,
    },
    {
      title: "Performance",
      value: displayData.performance?.week ? `${displayData.performance.week}%` : "N/A",
      change: "7 day change",
      changeType: displayData.performance?.week > 0 ? "positive" : "negative",
      icon: Percent,
    },
    {
      title: "Active Positions",
      value: totalPositions.toString(),
      change: walletAddress ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` : "",
      changeType: "neutral",
      icon: Wallet,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              {stat.changeType !== "neutral" ? (
                <Badge
                  variant={stat.changeType === "positive" ? "default" : "destructive"}
                  className="mt-1"
                >
                  {stat.changeType === "positive" ? (
                    <TrendingUp className="h-3 w-3 mr-1" />
                  ) : (
                    <TrendingDown className="h-3 w-3 mr-1" />
                  )}
                  {stat.change}
                </Badge>
              ) : (
                <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default PortfolioOverview;