// src/hooks/index.ts - Archivo de exports
export * from './usePortfolio';
export * from './useWalletAnalysis';

// Hook adicional para obtener top pools (opcional)
import React, { useState, useEffect, useCallback } from 'react';
import { envioAPI } from '@/config/envioV4';

export const useTopPools = () => {
  const [pools, setPools] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchTopPools = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await envioAPI.getTopPools();
      
      if (result.success) {
        setPools(result.data);
      } else {
        throw new Error('Failed to fetch top pools');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(new Error(errorMessage));
      setPools([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTopPools();
  }, [fetchTopPools]);

  return {
    pools,
    isLoading,
    error,
    refetch: fetchTopPools
  };
};

// Hook para test de conexión ENVIO (para debugging)
export const useEnvioTest = () => {
  const [testResult, setTestResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const runTest = useCallback(async () => {
    setIsLoading(true);
    
    try {
      const result = await envioAPI.testConnection();
      setTestResult(result);
      console.log('🧪 ENVIO Test Result:', result);
    } catch (error) {
      console.error('❌ ENVIO Test Failed:', error);
      setTestResult({ success: false, error: error.message });
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    testResult,
    isLoading,
    runTest
  };
};