// Configuración de APIs para conectar el dashboard con el servidor simple
const API_BASE_URL = 'http://localhost:5678';

export const API_ENDPOINTS = {
  positions: `${API_BASE_URL}/api/positions`,
  portfolio: `${API_BASE_URL}/api/portfolio`, 
  alerts: `${API_BASE_URL}/api/alerts`
};

// Tipos TypeScript
export interface Position {
  tokenPair: string;
  currentPrice: number;
  minPrice: number;
  maxPrice: number;
  inRange: boolean;
  unclaimedFees: string;
  apr: number;
  impermanentLoss: number;
  liquidity: string;
  volume24h: string;
  feeTier: string;
}

// Función para obtener posiciones
export const fetchPositions = async (): Promise<Position[]> => {
  try {
    console.log('🔍 Fetching positions from:', API_ENDPOINTS.positions);
    const response = await fetch(API_ENDPOINTS.positions);
    const data = await response.json();
    console.log('✅ Positions data received:', data);
    return data;
  } catch (error) {
    console.error('❌ Error fetching positions:', error);
    return [];
  }
};

export const fetchPortfolio = async () => {
  try {
    const response = await fetch(API_ENDPOINTS.portfolio);
    return await response.json();
  } catch (error) {
    console.error('Error fetching portfolio:', error);
    return null;
  }
};

export const fetchAlerts = async () => {
  try {
    const response = await fetch(API_ENDPOINTS.alerts);
    return await response.json();
  } catch (error) {
    console.error('Error fetching alerts:', error);
    return [];
  }
};
