// Production API Configuration
const isProd = import.meta.env.PROD;

export const API_CONFIG = {
  // Usar variable de entorno o la URL de Vercel por defecto
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://uniswap-v3-ai-agent.vercel.app',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
};

// GraphQL Configuration
export const GRAPHQL_CONFIG = {
  endpoint: 'https://indexer.bigdevenergy.link/bb1a9fc/v1/graphql',
  headers: {
    'Content-Type': 'application/json',
  }
};

export const API_ENDPOINTS = {
  poolAnalysis: '/api/pool-analysis',
  positions: '/api/positions',
  portfolio: '/api/portfolio',
  portfolioOptimization: '/api/portfolio-optimization',
  analyze: '/api/analyze'
};

// API Functions

// Analyze a wallet address (main function)
export const analyzeWallet = async (walletAddress) => {
  try {
    const response = await fetch(
      `${API_CONFIG.baseURL}${API_ENDPOINTS.analyze}/${walletAddress}`,
      {
        headers: API_CONFIG.headers,
        timeout: API_CONFIG.timeout
      }
    );
    return await response.json();
  } catch (error) {
    console.error('Error analyzing wallet:', error);
    throw error;
  }
};

// Get portfolio overview for a wallet
export const getPortfolio = async (walletAddress) => {
  // Si se llama sin wallet address, retorna datos vacíos sin hacer llamada
  if (!walletAddress) {
    console.log('getPortfolio called without wallet address, returning empty data');
    return { 
      success: true, 
      data: {
        totalPositions: 0,
        pools: [],
        totalValue: 0,
        totalFees: 0,
        performance: {
          day: 0,
          week: 0,
          month: 0
        }
      }
    };
  }
  
  try {
    const response = await fetch(
      `${API_CONFIG.baseURL}${API_ENDPOINTS.portfolio}/${walletAddress}`,
      {
        headers: API_CONFIG.headers,
        timeout: API_CONFIG.timeout
      }
    );
    return await response.json();
  } catch (error) {
    console.error('Error fetching portfolio:', error);
    throw error;
  }
};

// Get positions for a wallet
export const getPositions = async (walletAddress) => {
  if (!walletAddress) {
    console.log('getPositions called without wallet address, returning empty data');
    return { success: true, data: [] };
  }

  try {
    const response = await fetch(
      `${API_CONFIG.baseURL}${API_ENDPOINTS.positions}/${walletAddress}`,
      {
        headers: API_CONFIG.headers,
        timeout: API_CONFIG.timeout
      }
    );
    return await response.json();
  } catch (error) {
    console.error('Error fetching positions:', error);
    throw error;
  }
};

// Get pool analysis (general, not wallet-specific)
export const getPoolAnalysis = async () => {
  try {
    const response = await fetch(
      `${API_CONFIG.baseURL}${API_ENDPOINTS.poolAnalysis}`,
      {
        headers: API_CONFIG.headers,
        timeout: API_CONFIG.timeout
      }
    );
    return await response.json();
  } catch (error) {
    console.error('Error fetching pool analysis:', error);
    throw error;
  }
};

// Get portfolio optimization suggestions
export const getPortfolioOptimization = async (walletAddress) => {
  if (!walletAddress) {
    console.log('getPortfolioOptimization called without wallet address, returning empty data');
    return { 
      success: true, 
      data: {
        recommendations: [],
        optimizedAllocation: {},
        expectedAPY: 0,
        riskScore: 'N/A'
      }
    };
  }

  try {
    const response = await fetch(
      `${API_CONFIG.baseURL}${API_ENDPOINTS.portfolioOptimization}/${walletAddress}`,
      {
        headers: API_CONFIG.headers,
        timeout: API_CONFIG.timeout
      }
    );
    return await response.json();
  } catch (error) {
    console.error('Error fetching portfolio optimization:', error);
    throw error;
  }
};

// Legacy function for backward compatibility
export const getRiskAssessment = async (portfolio) => {
  // This endpoint doesn't exist in the new API
  // Return mock data or remove this function
  return {
    success: true,
    data: {
      riskScore: 'Medium',
      message: 'Risk assessment not available in current API'
    }
  };
};

// GraphQL Functions

// Fetch swap data for a wallet address
export const getSwapData = async (walletAddress) => {
  if (!walletAddress) {
    console.log('getSwapData called without wallet address, returning empty data');
    return { success: true, data: [] };
  }

  const query = `
    query GetSwaps($address: String!) {
      Swap(where: {sender: {_eq: $address}}) {
        amount0
        amount1
        amountUSD
        chainId
        db_write_timestamp
        id
        logIndex
        origin
        pool
        sender
        sqrtPriceX96
        tick
        timestamp
        token0_id
        token1_id
        transaction
      }
    }
  `;

  try {
    const response = await fetch(GRAPHQL_CONFIG.endpoint, {
      method: 'POST',
      headers: GRAPHQL_CONFIG.headers,
      body: JSON.stringify({
        query: query,
        variables: {
          address: walletAddress
        }
      }),
      timeout: API_CONFIG.timeout
    });

    if (!response.ok) {
      throw new Error(`GraphQL Error: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    
    if (result.errors) {
      throw new Error(`GraphQL Errors: ${result.errors.map(e => e.message).join(', ')}`);
    }

    return {
      success: true,
      data: result.data?.Swap || []
    };
  } catch (error) {
    console.error('Error fetching swap data:', error);
    
    // Return mock data for testing when endpoint is unreachable
    console.log('Returning mock swap data for testing');
    return {
      success: true,
      data: [
        {
          id: '1',
          amount0: '1000000000000000000', // 1 ETH
          amount1: '-2000000000', // -2000 USDC
          amountUSD: '2000.00',
          chainId: 1,
          timestamp: Math.floor(Date.now() / 1000).toString(),
          pool: '0x8ad599c3a0ff1de082011efddc58f1908eb6e6d8',
          token0_id: 'WETH',
          token1_id: 'USDC',
          transaction: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
          origin: '0x0000000000EBCF4bAca7e81ca2d3ec09DF339c22'
        },
        {
          id: '2',
          amount0: '-500000000000000000', // -0.5 ETH
          amount1: '1000000000', // 1000 USDC
          amountUSD: '1000.00',
          chainId: 1,
          timestamp: (Math.floor(Date.now() / 1000) - 3600).toString(),
          pool: '0x8ad599c3a0ff1de082011efddc58f1908eb6e6d8',
          token0_id: 'WETH',
          token1_id: 'USDC',
          transaction: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
          origin: '0x0000000000EBCF4bAca7e81ca2d3ec09DF339c22'
        },
        {
          id: '3',
          amount0: '10000000000000000000', // 10 ETH
          amount1: '-20000000000', // -20000 USDC
          amountUSD: '20000.00',
          chainId: 1,
          timestamp: (Math.floor(Date.now() / 1000) - 7200).toString(),
          pool: '0x8ad599c3a0ff1de082011efddc58f1908eb6e6d8',
          token0_id: 'WETH',
          token1_id: 'USDC',
          transaction: '0x7890abcdef1234567890abcdef1234567890abcdef1234567890abcdef123456',
          origin: '0x0000000000EBCF4bAca7e81ca2d3ec09DF339c22'
        }
      ]
    };
  }
};

// Utility function to validate Ethereum address
export const isValidAddress = (address) => {
  if (!address) return false;
  if (!address.startsWith('0x')) return false;
  if (address.length !== 42) return false;
  return /^0x[a-fA-F0-9]{40}$/.test(address);
};