// src/hooks/useWalletAnalysis.ts - VERSIÓN COMPLETA ACTUALIZADA
import { useState, useEffect, useCallback } from 'react';
import { theGraphV4AuthAPI as envioAPI, formatters } from '@/config/theGraphV4Auth';

export interface WalletAnalysisData {
  summary: {
    totalPositions: number;
    totalVolume: string;
    activePositions: number;
    totalFees: number;
  };
  positions: Array<{
    id: string;
    token0: string;
    token1: string;
    liquidity: string;
    tickLower: number;
    tickUpper: number;
    currentTick?: number;
    fee: number;
    depositedToken0: string;
    depositedToken1: string;
    feesToken0: string;
    feesToken1: string;
    inRange: boolean;
  }>;
  swaps: Array<{
    id: string;
    timestamp: string;
    token0Symbol: string;
    token1Symbol: string;
    amount0: string;
    amount1: string;
    amountUSD: string;
    type: 'Buy' | 'Sell';
  }>;
  dataSource?: string; // Para mostrar de dónde vienen los datos
}

export interface UseWalletAnalysisReturn {
  data: WalletAnalysisData | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

export const useWalletAnalysis = (walletAddress: string): UseWalletAnalysisReturn => {
  const [data, setData] = useState<WalletAnalysisData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const analyzeWallet = useCallback(async () => {
    if (!walletAddress) {
      setData(null);
      return;
    }

    console.log(`🔍 useWalletAnalysis: Analyzing with The Graph V4 API: ${walletAddress}`);
    setIsLoading(true);
    setError(null);

    try {
      const result = await envioAPI.analyzeWallet(walletAddress);

      if (!result.success) {
        throw new Error('Failed to analyze wallet with The Graph V4');
      }

      const { positions, swaps, totalPositions, totalVolume, totalFees, activePositions } = result.data;

      // Formatear datos para el componente
      const analysisData: WalletAnalysisData = {
        summary: {
          totalPositions,
          totalVolume: formatters.formatUSD(totalVolume || 0),
          activePositions: activePositions || 0,
          totalFees: totalFees || 0,
        },
        positions: positions.map((pos: any) => ({
          id: pos.id,
          // Compatibilidad con ambos formatos (V3: currency0, V4: token0)
          token0: pos.pool?.token0?.symbol || pos.pool?.currency0?.symbol || 'Unknown',
          token1: pos.pool?.token1?.symbol || pos.pool?.currency1?.symbol || 'Unknown',
          liquidity: pos.liquidity,
          tickLower: pos.tickLower,
          tickUpper: pos.tickUpper,
          currentTick: pos.pool?.tick,
          // Compatibilidad con ambos formatos (V3: fee, V4: feeTier)
          fee: pos.pool?.feeTier || pos.pool?.fee || 0,
          depositedToken0: formatters.formatNumber(
            parseFloat(pos.depositedToken0) / Math.pow(10, 
              pos.pool?.token0?.decimals || pos.pool?.currency0?.decimals || 18
            )
          ),
          depositedToken1: formatters.formatNumber(
            parseFloat(pos.depositedToken1) / Math.pow(10, 
              pos.pool?.token1?.decimals || pos.pool?.currency1?.decimals || 18
            )
          ),
          feesToken0: formatters.formatNumber(
            parseFloat(pos.collectedFeesToken0) / Math.pow(10, 
              pos.pool?.token0?.decimals || pos.pool?.currency0?.decimals || 18
            )
          ),
          feesToken1: formatters.formatNumber(
            parseFloat(pos.collectedFeesToken1) / Math.pow(10, 
              pos.pool?.token1?.decimals || pos.pool?.currency1?.decimals || 18
            )
          ),
          inRange: pos.pool?.tick >= pos.tickLower && pos.pool?.tick <= pos.tickUpper,
        })),
        swaps: swaps.slice(0, 10).map((swap: any) => ({
          id: swap.id,
          timestamp: new Date(parseInt(swap.timestamp) * 1000).toLocaleDateString(),
          // Compatibilidad con ambos formatos
          token0Symbol: swap.pool?.token0?.symbol || swap.pool?.currency0?.symbol || 'Unknown',
          token1Symbol: swap.pool?.token1?.symbol || swap.pool?.currency1?.symbol || 'Unknown',
          amount0: formatters.formatNumber(Math.abs(parseFloat(swap.amount0))),
          amount1: formatters.formatNumber(Math.abs(parseFloat(swap.amount1))),
          amountUSD: formatters.formatUSD(parseFloat(swap.amountUSD) || 0),
          type: parseFloat(swap.amount0) > 0 ? 'Buy' : 'Sell',
        })),
        dataSource: result.source, // Para debugging - mostrar de dónde vienen los datos
      };

      setData(analysisData);
      console.log('✅ useWalletAnalysis: The Graph V4 analysis complete', {
        source: result.source,
        positions: positions.length,
        swaps: swaps.length,
        totalVolume,
        totalFees
      });

      // Log detallado si encontramos posiciones
      if (positions.length > 0) {
        console.log('🎉 POSITIONS FOUND:');
        positions.forEach((pos: any, index: number) => {
          const token0 = pos.pool?.token0?.symbol || pos.pool?.currency0?.symbol;
          const token1 = pos.pool?.token1?.symbol || pos.pool?.currency1?.symbol;
          const liquidity = parseFloat(pos.liquidity);
          const feeTier = pos.pool?.feeTier || pos.pool?.fee;
          
          console.log(`  ${index + 1}. ${token0}/${token1} | Liquidity: ${liquidity} | Fee: ${feeTier}`);
        });
      }

      // Log detallado si encontramos swaps
      if (swaps.length > 0) {
        console.log('💱 SWAPS FOUND:');
        swaps.slice(0, 3).forEach((swap: any, index: number) => {
          const token0 = swap.pool?.token0?.symbol || swap.pool?.currency0?.symbol;
          const token1 = swap.pool?.token1?.symbol || swap.pool?.currency1?.symbol;
          const amountUSD = parseFloat(swap.amountUSD) || 0;
          
          console.log(`  ${index + 1}. ${token0}/${token1} | $${amountUSD.toFixed(2)}`);
        });
      }

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      console.error('❌ useWalletAnalysis The Graph V4 error:', errorMessage);
      setError(new Error(errorMessage));
      
      // Set fallback data
      setData({
        summary: {
          totalPositions: 0,
          totalVolume: '$0.00',
          activePositions: 0,
          totalFees: 0,
        },
        positions: [],
        swaps: [],
        dataSource: 'ERROR_FALLBACK'
      });
    } finally {
      setIsLoading(false);
    }
  }, [walletAddress]);

  // Effect para analizar cuando cambia la wallet
  useEffect(() => {
    analyzeWallet();
  }, [analyzeWallet]);

  // Función de refetch
  const refetch = useCallback(() => {
    analyzeWallet();
  }, [analyzeWallet]);

  return {
    data,
    isLoading,
    error,
    refetch
  };
};