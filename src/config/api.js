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

// Utility function to validate Ethereum address
export const isValidAddress = (address) => {
  if (!address) return false;
  if (!address.startsWith('0x')) return false;
  if (address.length !== 42) return false;
  return /^0x[a-fA-F0-9]{40}$/.test(address);
};