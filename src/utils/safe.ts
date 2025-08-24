// src/utils/safe.ts

/**
 * Normaliza números de diferentes tipos (number, string, bigint) a number
 * Maneja casos edge y valores undefined/null de forma segura
 */
export const toNumber = (v: number | string | bigint | undefined | null): number => {
    if (v === undefined || v === null) return 0;
    if (typeof v === 'number') {
      return Number.isFinite(v) ? v : 0;
    }
    if (typeof v === 'bigint') {
      return Number(v);
    }
    if (typeof v === 'string') {
      // Remove common formatting characters
      const cleaned = v.replace(/[$,\s]/g, '');
      const num = parseFloat(cleaned);
      return Number.isFinite(num) ? num : 0;
    }
    return 0;
  };
  
  /**
   * Formateador de moneda configurable para MX/US
   * Usa Intl.NumberFormat para formateo consistente
   */
  export const createCurrencyFormatter = (locale: string = 'es-MX', currency: string = 'USD') => {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };
  
  /**
   * Formateador de números grandes con sufijos (K, M, B)
   * Útil para TVL y valores grandes
   */
  export const formatLargeNumber = (num: number, locale: string = 'es-MX'): string => {
    if (num < 1000) {
      return new Intl.NumberFormat(locale, { maximumFractionDigits: 2 }).format(num);
    }
    
    const suffixes = ['', 'K', 'M', 'B', 'T'];
    const magnitude = Math.floor(Math.log10(Math.abs(num)) / 3);
    const scaledNum = num / Math.pow(1000, magnitude);
    
    return new Intl.NumberFormat(locale, {
      minimumFractionDigits: scaledNum >= 100 ? 0 : 1,
      maximumFractionDigits: scaledNum >= 100 ? 0 : 1,
    }).format(scaledNum) + suffixes[magnitude];
  };
  
  /**
   * Formateador de porcentajes con manejo de edge cases
   */
  export const formatPercentage = (value: number | undefined | null): string => {
    const num = toNumber(value);
    if (num === 0) return '0%';
    
    return new Intl.NumberFormat('es-MX', {
      style: 'percent',
      minimumFractionDigits: 1,
      maximumFractionDigits: 2,
    }).format(num / 100);
  };
  
  /**
   * Trunca direcciones Ethereum de forma segura
   */
  export const truncateAddress = (address: string | undefined, start: number = 6, end: number = 4): string => {
    if (!address || address.length <= start + end) return address || '';
    return `${address.slice(0, start)}...${address.slice(-end)}`;
  };
  
  /**
   * Validador de datos de portfolio
   * Retorna datos normalizados o valores por defecto
   */
  export const normalizePortfolioData = (data: any): {
    totalPositions: number;
    totalValue: number;
    totalFees: number;
    pools: any[];
    performance?: { week?: number };
  } => {
    return {
      totalPositions: toNumber(data?.totalPositions),
      totalValue: toNumber(data?.totalValue),
      totalFees: toNumber(data?.totalFees),
      pools: Array.isArray(data?.pools) ? data.pools : [],
      performance: data?.performance && typeof data.performance === 'object' ? data.performance : undefined,
    };
  };
  
  /**
   * Determina el tipo de cambio basado en el valor numérico
   */
  export const getChangeType = (value: number | undefined | null): 'positive' | 'negative' | 'neutral' => {
    const num = toNumber(value);
    if (num > 0) return 'positive';
    if (num < 0) return 'negative';
    return 'neutral';
  };
  
  /**
   * Validador de entrada con debounce para direcciones
   */
  export const isValidEthereumAddress = (address: string): boolean => {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  };