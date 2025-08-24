// src/config/envioV4.ts - Actualizado y compatible

// Formatters básicos
export const formatters = {
  formatUSD: (amount: number | string): string => {
    const num = typeof amount === 'string' ? parseFloat(amount) : amount;
    if (isNaN(num)) return '$0.00';
    return `$${num.toFixed(2)}`;
  },
  
  formatNumber: (amount: number | string): string => {
    const num = typeof amount === 'string' ? parseFloat(amount) : amount;
    if (isNaN(num)) return '0';
    return num.toLocaleString();
  }
};

// API mejorada con mejor tipado
export const envioAPI = {
  async testConnection() {
    try {
      const response = await fetch('https://enviodev-69b6884.dedicated.hyperindex.xyz/v1/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: 'query { Pool { id collectedFeesUSD } }'
        })
      });
      
      const data = await response.json();
      
      return {
        success: true,
        data: { pools: data.data?.Pool || [] }
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  },

  async analyzeWallet(address: string, options?: { signal?: AbortSignal }) {
    try {
      console.log(`🔍 Analyzing wallet: ${address}`);
      
      // Aquí podrías hacer requests reales con AbortSignal si fuera necesario
      // const response = await fetch(endpoint, { signal: options?.signal });
      
      // Por ahora, datos mock mejorados y más realistas
      const mockPositions = [
        {
          id: `pos-${address.slice(-6)}-1`,
          tokenPair: 'ETH/USDC',
          currentPrice: 2450.50,
          minPrice: 2200.00,
          maxPrice: 2700.00,
          inRange: true,
          liquidity: '45000.50',
          unclaimedFees: '12.34',
          apr: 15.2,
          impermanentLoss: 0.8,
          feeTier: '0.30%',
          positionId: `${address.slice(-6)}-eth-usdc`,
          owner: address,
          lastUpdated: new Date().toISOString()
        },
        {
          id: `pos-${address.slice(-6)}-2`,
          tokenPair: 'WBTC/ETH',
          currentPrice: 0.036,
          minPrice: 0.032,
          maxPrice: 0.040,
          inRange: false,
          liquidity: '25000.75',
          unclaimedFees: '8.92',
          apr: 8.7,
          impermanentLoss: 2.1,
          feeTier: '0.05%',
          positionId: `${address.slice(-6)}-wbtc-eth`,
          owner: address,
          lastUpdated: new Date(Date.now() - 86400000).toISOString() // 1 day ago
        }
      ];

      // Calcular summary basado en las posiciones
      const totalLiquidity = mockPositions.reduce((sum, pos) => sum + parseFloat(pos.liquidity), 0);
      const totalFees = mockPositions.reduce((sum, pos) => sum + parseFloat(pos.unclaimedFees), 0);
      const activePositions = mockPositions.filter(pos => pos.inRange).length;

      const analysisData = {
        summary: {
          totalValueUSD: `$${totalLiquidity.toFixed(2)}`,
          totalPositions: mockPositions.length,
          activePositions: activePositions,
          totalSwaps: Math.floor(Math.random() * 50) + 10 // Random entre 10-60
        },
        positions: mockPositions,
        lastUpdated: new Date().toISOString()
      };

      console.log('✅ Mock analysis completed:', analysisData);

      return {
        success: true,
        data: analysisData
      };

    } catch (error: any) {
      console.error('❌ Error in analyzeWallet:', error);
      
      // Análisis fallback mínimo
      return {
        success: true,
        data: {
          summary: {
            totalValueUSD: '$0.00',
            totalPositions: 0,
            activePositions: 0,
            totalSwaps: 0
          },
          positions: [],
          lastUpdated: new Date().toISOString()
        }
      };
    }
  },

  async getPortfolio(address: string) {
    const analysis = await this.analyzeWallet(address);
    
    return {
      success: analysis.success,
      totalValue: analysis.data.summary?.totalValueUSD || '$0.00',
      positions: analysis.data.positions || [],
      performance: '0.00',
      lastUpdated: analysis.data.lastUpdated || new Date().toISOString()
    };
  }
};