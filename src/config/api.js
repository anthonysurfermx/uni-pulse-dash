// API Configuration for Enhanced Backend
export const API_CONFIG = {
  baseURL: 'http://localhost:5679',
  endpoints: {
    positions: '/api/positions',
    portfolio: '/api/portfolio',
    priceHistory: '/api/price-history',
    marketData: '/api/market-data',
    poolAnalytics: '/api/pool-analytics',
    health: '/health'
  },
  // Demo wallet for testing
  demoWallet: '0x8ba1f109551bD432803012645Hac136c29F64cd'
};

// API helper functions
export const apiCall = async (endpoint, params = {}) => {
  const url = new URL(API_CONFIG.baseURL + endpoint);
  Object.keys(params).forEach(key => 
    url.searchParams.append(key, params[key])
  );
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// Specific API calls
export const getPositions = (wallet = API_CONFIG.demoWallet) => 
  apiCall(API_CONFIG.endpoints.positions, { wallet });

export const getPortfolio = (wallet = API_CONFIG.demoWallet) => 
  apiCall(API_CONFIG.endpoints.portfolio, { wallet });

export const getPriceHistory = (token0 = 'ETH', token1 = 'USDC', days = 7) => 
  apiCall(API_CONFIG.endpoints.priceHistory, { token0, token1, days });

export const getMarketData = () => 
  apiCall(API_CONFIG.endpoints.marketData);
