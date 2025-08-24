// src/hooks/usePortfolio.ts - CON LOS IMPORTS CORRECTOS
import React, { useState, useEffect, useCallback } from 'react';
import { envioAPI, formatters } from '@/config/envioV4';

export interface PortfolioData {
  totalValueLocked: string;
  totalFeesCollected: string;
  activePositions: number;
  totalSwaps: number;
  positions: any[];
  recentActivity: any[];
  protocolOverview?: {
    totalPools: number;
    totalVolumeUSD: number;
    totalFeesUSD: number;
  };
}

export interface UsePortfolioReturn {
  data: PortfolioData | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

export const usePortfolio = (walletAddress: string): UsePortfolioReturn => {
  const [data, setData] = useState<PortfolioData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchPortfolioData = useCallback(async () => {
    if (!walletAddress) {
      setData(null);
      return;
    }

    console.log(`📊 usePortfolio: Fetching data for ${walletAddress}`);
    setIsLoading(true);
    setError(null);

    try {
      // Obtener datos del protocolo y del usuario en paralelo
      const [protocolResult, walletResult] = await Promise.all([
        envioAPI.getProtocolOverview(),
        envioAPI.analyzeWallet(walletAddress)
      ]);

      if (!walletResult.success) {
        throw new Error('Failed to fetch wallet data');
      }

      // Formatear datos para el componente
      const portfolioData: PortfolioData = {
        totalValueLocked: formatters.formatUSD(walletResult.data.totalVolume || 0),
        totalFeesCollected: formatters.formatUSD(walletResult.data.totalFees || 0),
        activePositions: walletResult.data.activePositions || 0,
        totalSwaps: walletResult.data.totalSwaps || 0,
        positions: walletResult.data.positions || [],
        recentActivity: walletResult.data.swaps?.slice(0, 5) || [],
        protocolOverview: protocolResult.success ? {
          totalPools: protocolResult.data.totalPools,
          totalVolumeUSD: protocolResult.data.totalVolumeUSD,
          totalFeesUSD: protocolResult.data.totalFeesUSD,
        } : undefined
      };

      setData(portfolioData);
      console.log('✅ usePortfolio: Data loaded successfully', portfolioData);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      console.error('❌ usePortfolio error:', errorMessage);
      setError(new Error(errorMessage));
      
      // Set fallback data para que la UI no se rompa
      setData({
        totalValueLocked: '$0.00',
        totalFeesCollected: '$0.00',
        activePositions: 0,
        totalSwaps: 0,
        positions: [],
        recentActivity: [],
      });
    } finally {
      setIsLoading(false);
    }
  }, [walletAddress]);

  // Effect para cargar datos cuando cambia la wallet
  useEffect(() => {
    fetchPortfolioData();
  }, [fetchPortfolioData]);

  // Función de refetch
  const refetch = useCallback(() => {
    fetchPortfolioData();
  }, [fetchPortfolioData]);

  return {
    data,
    isLoading,
    error,
    refetch
  };
};