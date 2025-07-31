import { PortfolioOverview } from "@/components/PortfolioOverview";
import { PositionCard } from "@/components/PositionCard";
import { AlertsPanel } from "@/components/AlertsPanel";
import { TransactionHistory } from "@/components/TransactionHistory";
import { PerformanceChart } from "@/components/PerformanceChart";

const Index = () => {
  // Mock data for LP positions
  const positions = [
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
    {
      tokenPair: "LINK/ETH",
      currentPrice: 0.00782,
      minPrice: 0.007,
      maxPrice: 0.009,
      inRange: true,
      unclaimedFees: "$156.75",
      apr: 15.7,
      impermanentLoss: -1.2,
      liquidity: "$7,890.45",
      volume24h: "$1.5M",
      feeTier: "0.30%",
    },
    {
      tokenPair: "WBTC/ETH",
      currentPrice: 16.245,
      minPrice: 15.0,
      maxPrice: 18.0,
      inRange: true,
      unclaimedFees: "$234.67",
      apr: 12.9,
      impermanentLoss: -0.4,
      liquidity: "$12,567.89",
      volume24h: "$3.2M",
      feeTier: "0.05%",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Portfolio Overview */}
      <PortfolioOverview />
      
      {/* Charts and Alerts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <PerformanceChart />
        </div>
        <div>
          <AlertsPanel />
        </div>
      </div>

      {/* Positions Grid */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-foreground">Active Positions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6">
          {positions.map((position, index) => (
            <PositionCard key={index} {...position} />
          ))}
        </div>
      </div>

      {/* Transaction History */}
      <TransactionHistory />
    </div>
  );
};

export default Index;
