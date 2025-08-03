import { useState, useEffect } from 'react';
import { PortfolioOverview } from "@/components/PortfolioOverview";
import { PositionCard } from "@/components/PositionCard";
import { AlertsPanel } from "@/components/AlertsPanel";
import { TransactionHistory } from "@/components/TransactionHistory";
import { PerformanceChart } from "@/components/PerformanceChart";
import { WalletInput } from "@/components/WalletInput";
import NFTPositionsSection from "@/components/NFTPositionsSection"; // NUEVA IMPORTACIÓN
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
      // Log the API URL for debugging
      console.log('🔍 Analyzing wallet:', address);
      console.log('📡 API URL:', `${API_CONFIG.baseURL}/api/analyze/${address}`);

      // Fetch positions from the API
      const response = await fetch(`${API_CONFIG.baseURL}/api/analyze/${address}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('📊 Response status:', response.status);

      // Check if response is ok
      if (!response.ok) {
        if (response.status === 0) {
          throw new Error('Cannot connect to API. Please check if the API server is running and CORS is configured correctly.');
        }
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('📦 API Response:', data);

      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch wallet data');
      }

      // Check if wallet has NFT positions - pero no mostrar error
      if (!data.data || !data.data.positions || data.data.positions.length === 0) {
        // NO mostrar error, solo dejar vacías las posiciones tradicionales
        setPositions([]);
        console.log('ℹ️ No traditional positions, checking for NFT positions...');
        // NO hacer return aquí para que continúe y muestre los NFTs
      } else {
        // Transform the data to match our component format
        const transformedPositions = data.data.positions.map((pos: any) => ({
          tokenPair: pos.pool,
          currentPrice: 0, // Would need price oracle
          minPrice: parseInt(pos.range?.lower || '0'),
          maxPrice: parseInt(pos.range?.upper || '0'),
          inRange: pos.inRange || true,
          unclaimedFees: `$${pos.fees || 0}`,
          apr: 0, // Would need calculation
          impermanentLoss: 0, // Would need calculation
          liquidity: pos.liquidity || 'N/A',
          volume24h: "N/A",
          feeTier: pos.feeTier,
        }));

        setPositions(transformedPositions);
        console.log('✅ Positions transformed:', transformedPositions);
      }

      // Fetch portfolio overview
      try {
        console.log('📊 Fetching portfolio data...');
        const portfolioResponse = await fetch(`${API_CONFIG.baseURL}/api/portfolio/${address}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (portfolioResponse.ok) {
          const portfolioData = await portfolioResponse.json();
          console.log('💼 Portfolio data:', portfolioData);
          setPortfolioData(portfolioData.data);
        }
      } catch (portfolioError) {
        console.error('Error fetching portfolio:', portfolioError);
        // Don't fail the whole request if portfolio fetch fails
      }

    } catch (err: any) {
      console.error('❌ Error analyzing wallet:', err);
      
      // Provide user-friendly error messages
      if (err.message.includes('CORS')) {
        setError('Connection blocked by browser security. The API server needs to allow requests from this domain.');
      } else if (err.message.includes('Failed to fetch')) {
        setError('Cannot connect to the API server. Please ensure the server is running.');
      } else if (err.message.includes('The Graph')) {
        setError('Error querying blockchain data. Please try again later.');
      } else {
        setError(err.message || 'Failed to analyze wallet');
      }
      
      setPositions([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Check API health on component mount
  useEffect(() => {
    const checkAPIHealth = async () => {
      try {
        console.log('🏥 Checking API health...');
        console.log('🌐 API Base URL:', API_CONFIG.baseURL);
        
        const response = await fetch(`${API_CONFIG.baseURL}/`, {
          method: 'GET',
          mode: 'cors',
        });
        
        if (response.ok) {
          console.log('✅ API is healthy');
        } else {
          console.warn('⚠️ API returned status:', response.status);
        }
      } catch (error) {
        console.error('❌ API health check failed:', error);
        console.log('💡 Make sure the API server is running and CORS is properly configured');
      }
    };

    checkAPIHealth();
  }, []);

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
          <p className="text-sm text-muted-foreground mt-2">
            API URL: {API_CONFIG.baseURL}
          </p>
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

      {/* NUEVA SECCIÓN: NFT Positions */}
      {walletAddress && !isLoading && (
        <NFTPositionsSection walletAddress={walletAddress} />
      )}

      {/* Transaction History */}
      <TransactionHistory walletAddress={walletAddress} />
    </div>
  );
};

export default Index;