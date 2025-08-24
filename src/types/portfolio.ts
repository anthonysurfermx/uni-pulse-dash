// src/types/portfolio.ts
export type PortfolioData = {
    totalPositions: number;
    totalValue: number | string | bigint;
    totalFees: number | string | bigint;
    performance?: { 
      week?: number;
      month?: number;
      year?: number;
    };
    pools: Pool[];
    positions?: Position[];
    tokens?: Token[];
  };
  
  export type Pool = {
    id: string;
    pair: string;
    feeTier: string;
    tvl: number | string;
    volume24h?: number | string;
    apr?: number | string;
  };
  
  export type Position = {
    id: string;
    pool: string;
    pair: string;
    feeTier: string;
    liquidity: {
      token0: number;
      token1: number;
      usd: number;
    };
    fees: {
      unclaimed: number;
      lifetime: number;
    };
    inRange: boolean;
    createdAt?: string;
  };
  
  export type Token = {
    symbol: string;
    address: string;
    balance: number;
    valueUSD: number;
    change24h: number;
    decimals?: number;
  };
  
  export type AnalysisData = {
    riskLevel?: 'LOW' | 'MEDIUM' | 'HIGH';
    activityScore?: number;
    lastActivity?: string;
    totalTx?: number;
    avgGasUsed?: number;
    portfolioHealth?: 'HEALTHY' | 'WARNING' | 'CRITICAL';
  };
  
  export type StatItem = {
    title: string;
    value: React.ReactNode;
    change?: string;
    changeType: 'positive' | 'negative' | 'neutral';
    icon: React.ComponentType<{ className?: string }>;
    isLoading?: boolean;
  };