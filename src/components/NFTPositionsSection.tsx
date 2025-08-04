import React, { useState, useEffect } from 'react';
import { Droplets, TrendingUp, ExternalLink, RefreshCw } from 'lucide-react';

// Tipos para las posiciones NFT
interface TickRange {
  min: string;
  max: string;
  raw: string;
}

interface NFTPosition {
  id: string;
  name: string;
  pool: string;
  feeTier: string;
  tickRange: TickRange;
  image: string;
  contractAddress: string;
  blockNumber: string;
  liquidity: number;
  fees: number;
  value: number;
}

interface NFTPositionsSectionProps {
  walletAddress?: string;
}

// Componente principal de la sección NFT
export default function NFTPositionsSection({ 
  walletAddress = '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045' 
}: NFTPositionsSectionProps) {
  const [positions, setPositions] = useState<NFTPosition[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // Función para obtener las posiciones
  const fetchPositions = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(
        `https://uniswap-v3-ai-agent-production.up.railway.app/api/analyze/${walletAddress}`
      );
      const result = await response.json();
      
      if (result.success && result.data.positions) {
        setPositions(result.data.positions);
      } else {
        setError('No se pudieron cargar las posiciones');
      }
    } catch (err) {
      setError('Error al conectar con el servidor');
      console.error('Error fetching positions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPositions();
  }, [walletAddress]);

  return (
    <div className="mt-10 pt-10 border-t border-gray-800">
      {/* Header de la sección */}
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <Droplets className="w-7 h-7 text-pink-500" />
            Your NFT Positions
          </h2>
          <p className="text-gray-400 mt-1">
            Uniswap V3 Liquidity Positions
          </p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={fetchPositions} 
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg font-medium text-sm flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 hover:opacity-90 rounded-lg font-medium text-sm flex items-center gap-2 transition-opacity">
            View All Positions
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <LoadingGrid />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchPositions} />
      ) : positions.length > 0 ? (
        <NFTGrid positions={positions.slice(0, 4)} />
      ) : (
        <EmptyState />
      )}
    </div>
  );
}

// Componente Grid de NFTs
function NFTGrid({ positions }: { positions: NFTPosition[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
      {positions.map((position) => (
        <NFTMiniCard key={position.id} position={position} />
      ))}
    </div>
  );
}

// Componente de tarjeta individual
function NFTMiniCard({ position }: { position: NFTPosition }) {
  const [imageError, setImageError] = useState<boolean>(false);
  
  const formatNumber = (num: number): string => {
    return new Intl.NumberFormat('en-US', { 
      maximumFractionDigits: 0 
    }).format(num || 0);
  };

  return (
    <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-pink-500/50 hover:shadow-lg hover:shadow-pink-500/10 cursor-pointer">
      <div className="relative h-48 bg-gray-950">
        {!imageError && position.image ? (
          <img
            src={position.image}
            alt={`${position.pool} Position`}
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-pink-500/10 to-purple-600/10">
            <Droplets className="w-12 h-12 text-gray-700" />
          </div>
        )}
        <div className="absolute top-3 right-3 px-3 py-1 bg-pink-500/90 backdrop-blur-sm rounded-full text-xs font-semibold">
          {position.feeTier || 'N/A'}
        </div>
      </div>
      
      <div className="p-5">
        <h3 className="text-lg font-semibold mb-1">{position.pool || 'Unknown Pool'}</h3>
        <p className="text-gray-500 text-sm font-mono mb-4">
          Position #{position.id}
        </p>
        
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gray-800/50 rounded-lg p-3">
            <div className="text-xs text-gray-400 uppercase mb-1">Liquidity</div>
            <div className="font-semibold">{formatNumber(position.liquidity)}</div>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-3">
            <div className="text-xs text-gray-400 uppercase mb-1">Fees</div>
            <div className="font-semibold">${formatNumber(position.fees)}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Estados de carga
function LoadingGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="bg-gray-900/50 border border-gray-800 rounded-2xl overflow-hidden animate-pulse">
          <div className="h-48 bg-gray-800/50"></div>
          <div className="p-5">
            <div className="h-5 bg-gray-800/50 rounded mb-2"></div>
            <div className="h-4 bg-gray-800/50 rounded w-2/3 mb-4"></div>
            <div className="grid grid-cols-2 gap-3">
              <div className="h-16 bg-gray-800/50 rounded"></div>
              <div className="h-16 bg-gray-800/50 rounded"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Estado vacío
function EmptyState() {
  return (
    <div className="text-center py-16 px-8 bg-gray-900/30 rounded-2xl border border-dashed border-gray-800">
      <Droplets className="w-12 h-12 text-gray-600 mx-auto mb-4" />
      <h3 className="text-lg font-semibold mb-2">No NFT Positions Found</h3>
      <p className="text-gray-400 mb-6">
        Connect your wallet or provide liquidity on Uniswap V3 to see your positions here.
      </p>
      <button className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 hover:opacity-90 rounded-lg font-medium transition-opacity">
        Connect Wallet
      </button>
    </div>
  );
}

// Estado de error
interface ErrorStateProps {
  message: string;
  onRetry: () => void;
}

function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="text-center py-16 px-8 bg-red-900/10 rounded-2xl border border-red-900/20">
      <TrendingUp className="w-12 h-12 text-red-500 mx-auto mb-4" />
      <h3 className="text-lg font-semibold mb-2">Oops! Something went wrong</h3>
      <p className="text-gray-400 mb-6">{message}</p>
      <button 
        className="px-6 py-3 bg-red-500 hover:bg-red-600 rounded-lg font-medium transition-colors"
        onClick={onRetry}
      >
        Try Again
      </button>
    </div>
  );
}