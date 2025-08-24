import { useQuery } from '@tanstack/react-query';
import { envioClient } from '@/config/envioV4';

// Query simple para verificar conectividad
const HEALTH_CHECK_QUERY = `
  query HealthCheck {
    __typename
  }
`;

export function useEnvioHealth() {
  return useQuery({
    queryKey: ['envioHealth'],
    queryFn: async () => {
      try {
        // Test más ligero: solo verificar conectividad sin datos reales
        const startTime = Date.now();
        
        // Intentar una query muy simple
        await envioClient.request(HEALTH_CHECK_QUERY);
        
        const responseTime = Date.now() - startTime;
        
        return {
          status: 'healthy' as const,
          responseTime,
          timestamp: Date.now(),
          endpoint: 'primary'
        };
      } catch (error) {
        console.debug('Envio health check failed:', error);
        
        // No logear como error, es normal en desarrollo
        const errorMessage = error instanceof Error ? error.message : 'Connection failed';
        
        // Determinar tipo de error
        let status: 'unhealthy' | 'degraded' = 'unhealthy';
        if (errorMessage.includes('CORS') || errorMessage.includes('NetworkError')) {
          status = 'degraded';
        }
        
        return {
          status,
          error: errorMessage,
          timestamp: Date.now(),
          endpoint: 'none'
        };
      }
    },
    staleTime: 120_000, // 2 minutes
    gcTime: 300_000, // 5 minutes (nueva API de React Query)
    retry: 1,
    retryDelay: 5000,
    refetchInterval: 300_000, // Check every 5 minutes
    refetchOnWindowFocus: false,
    // Silenciar errores en dev console
    useErrorBoundary: false,
    meta: {
      // Marcar como no crítico para logging
      silent: true,
    },
  });
}