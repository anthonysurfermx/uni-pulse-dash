import { useState, useEffect } from 'react';
import { PortfolioOverview } from "@/components/PortfolioOverview";
import { PositionCard } from "@/components/PositionCard";
import { AlertsPanel } from "@/components/AlertsPanel";
import { TransactionHistory } from "@/components/TransactionHistory";
import { PerformanceChart } from "@/components/PerformanceChart";
import { WalletInput } from "@/components/WalletInput";
import { API_CONFIG } from "@/config/api";
import { Loader2 } from "lucide-react";

const Index = () => {
  const [walletAddress, setWalletAddress] = useState('');
  const [positions, setPositions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [portfolioData, setPortfolioData] = useState(null);

  // Mock data for when no wallet is selected
  const mockPositions = [
    {
      tokenPair: "ETH/USDC",
      currentPrice: 2387.45,
      minPrice: 2200.00,
      maxPrice: 2600.00,
      inRange: false,
      unclaimedFees: "$127.50",
      apr: 18.2,
      impermanentLoss: -2.3,
      liquidity: "$8,450.23",
      volume24h: "$2.1M",
      feeTier: "0.05%",
    },
    {
      tokenPair: "UNI/ETH",
      currentPrice: 0.00285,
      minPrice: 0.0025,
      maxPrice: 0.0035,
      inRange: true,
      unclaimedFees: "$89.32",
      apr: 22.3,
      impermanentLoss: -0.8,
      liquidity: "$5,642.18",
      volume24h: "$890K",
      feeTier: "0.30%",
    },
  ];

  const analyzeWallet = async (address: string) => {
    setIsLoading(true);
    setError('');
    setWalletAddress(address);

    try {
      // Fetch positions from the API
      const response = await fetch(`${API_CONFIG.baseURL}/api/analyze/${address}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch wallet data');
      }

      if (!data.data.hasPositions) {
        setError('No Uniswap V3 positions found for this wallet');
        setPositions([]);
        return;
      }

      // Transform the data to match our component format
      const transformedPositions = data.data.positions.map((pos: any) => ({
        tokenPair: pos.pool,
        currentPrice: 0, // Would need price oracle
        minPrice: parseInt(pos.range.lower),
        maxPrice: parseInt(pos.range.upper),
        inRange: true, // Would need current tick
        unclaimedFees: `$${pos.fees.total}`,
        apr: 0, // Would need calculation
        impermanentLoss: 0, // Would need calculation
        liquidity: pos.liquidity,
        volume24h: "N/A",
        feeTier: pos.feeTier,
      }));

      setPositions(transformedPositions);

      // Fetch portfolio overview
      const portfolioResponse = await fetch(`${API_CONFIG.baseURL}/api/portfolio/${address}`);
      const portfolioData = await portfolioResponse.json();
      
      if (portfolioResponse.ok) {
        setPortfolioData(portfolioData.data);
      }

    } catch (err) {
      console.error('Error analyzing wallet:', err);
      setError(err.message || 'Failed to analyze wallet');
      setPositions([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Use mock data if no wallet is selected
  const displayPositions = walletAddress ? positions : mockPositions;

  return (
    <div className="space-y-6">
      {/* Wallet Input */}
      <WalletInput onAnalyze={analyzeWallet} isLoading={isLoading} />

      {/* Show loading state */}
      {isLoading && (
        <div className="flex items-center justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Analyzing wallet positions...</span>
        </div>
      )}

      {/* Show error if any */}
      {error && !isLoading && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
          <p className="text-destructive">{error}</p>
        </div>
      )}

      {/* Show wallet address if selected */}
      {walletAddress && !isLoading && !error && (
        <div className="bg-muted/50 rounded-lg p-4">
          <p className="text-sm text-muted-foreground">
            Showing positions for: <span className="font-mono">{walletAddress}</span>
          </p>
        </div>
      )}

      {/* Portfolio Overview */}
      <PortfolioOverview data={portfolioData} walletAddress={walletAddress} />
      
      {/* Charts and Alerts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <PerformanceChart walletAddress={walletAddress} />
        </div>
        <div>
          <AlertsPanel />
        </div>
      </div>

      {/* Positions Grid */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-foreground">
          {walletAddress ? 'Wallet Positions' : 'Example Positions'}
        </h2>
        {displayPositions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6">
            {displayPositions.map((position, index) => (
              <PositionCard key={index} {...position} />
            ))}
          </div>
        ) : (
          <div className="text-center p-8 text-muted-foreground">
            {walletAddress ? 'No positions found' : 'Enter a wallet address to see positions'}
          </div>
        )}
      </div>

      {/* Transaction History */}
      <TransactionHistory walletAddress={walletAddress} />
    </div>
  );
};

export default Index;