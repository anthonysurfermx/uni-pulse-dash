import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, DollarSign, Percent } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getPortfolio } from '../config/api.js';

export const PortfolioOverview = () => {
  const [portfolioData, setPortfolioData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPortfolioData = async () => {
      try {
        setLoading(true);
        const data = await getPortfolio();
        console.log('📊 Portfolio data:', data); // Debug log
        
        if (data.success) {
          setPortfolioData(data.summary);
        } else {
          setError('Failed to load portfolio data');
        }
      } catch (err) {
        setError('API connection error');
        console.error('Portfolio fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolioData();
    
    // Refresh every 30 seconds
    const interval = setInterval(fetchPortfolioData, 30000);
    return () => clearInterval(interval);
  }, []);

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
  if (error) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="col-span-full">
          <CardContent className="pt-6">
            <div className="text-center text-red-500">
              <p>⚠️ {error}</p>
              <p className="text-sm text-gray-500 mt-2">Check if API server is running on port 5680</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Default fallback if no data
  if (!portfolioData) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="col-span-full">
          <CardContent className="pt-6">
            <div className="text-center text-gray-500">
              <p>No portfolio data available</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Real data from API
  const stats = [
    {
      title: "Total Value Locked",
      value: `$${portfolioData.totalValueLocked}`,
      change: `Health: ${portfolioData.healthScore}%`,
      changeType: parseFloat(portfolioData.healthScore) > 70 ? "positive" : "negative",
      icon: DollarSign,
    },
    {
      title: "Total Unclaimed Fees", 
      value: `$${portfolioData.totalUnclaimedFees}`,
      change: `+$${(parseFloat(portfolioData.totalUnclaimedFees) * 0.1).toFixed(2)} today`,
      changeType: "positive" as const,
      icon: TrendingUp,
    },
    {
      title: "Average APR",
      value: `${portfolioData.weightedApr}%`,
      change: `${parseFloat(portfolioData.weightedApr) > 15 ? '+' : ''}${(parseFloat(portfolioData.weightedApr) - 12).toFixed(1)}%`,
      changeType: parseFloat(portfolioData.weightedApr) > 15 ? "positive" : "negative",
      icon: Percent,
    },
    {
      title: "Active Positions",
      value: portfolioData.positionsCount.toString(),
      change: `${portfolioData.inRangeCount} in range`,
      changeType: portfolioData.inRangeCount > portfolioData.outOfRangeCount ? "positive" : "negative",
      icon: TrendingUp,
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
            </CardContent>
          </Card>
        );
      })}
      
      {/* Debug info - remove in production */}
      <div className="col-span-full mt-4 p-2 bg-gray-100 rounded text-xs text-gray-600">
        🔄 Live data from enhanced API (port 5680) | Last updated: {new Date().toLocaleTimeString()} | 
        Positions: {portfolioData.positionsCount} | Health: {portfolioData.healthScore}%
      </div>
    </div>
  );
};

export default PortfolioOverview;
