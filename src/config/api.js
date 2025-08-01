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
