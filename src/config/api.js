// Production API Configuration
const isProd = import.meta.env.PROD;

export const API_CONFIG = {
  baseURL: isProd 
    ? 'https://uniswap-v3-ai-agent-production.up.railway.app'
    : 'http://localhost:5679',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
};

export const API_ENDPOINTS = {
  poolAnalysis: '/api/pool-analysis',
  portfolioOptimization: '/api/portfolio-optimization',
  riskAssessment: '/api/risk-assessment'
};

// API Functions
export const getPortfolio = async () => {
  const response = await fetch(`${API_CONFIG.baseURL}${API_ENDPOINTS.portfolioOptimization}`);
  return response.json();
};

export const getPoolAnalysis = async (poolAddress) => {
  const response = await fetch(`${API_CONFIG.baseURL}${API_ENDPOINTS.poolAnalysis}?pool=${poolAddress}`);
  return response.json();
};

export const getRiskAssessment = async (portfolio) => {
  const response = await fetch(`${API_CONFIG.baseURL}${API_ENDPOINTS.riskAssessment}`, {
    method: 'POST',
    headers: API_CONFIG.headers,
    body: JSON.stringify(portfolio)
  });
  return response.json();
};
