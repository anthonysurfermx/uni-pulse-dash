import { useQuery } from '@tanstack/react-query';
import { isAddress, getAddress } from 'viem';
import { envioAPI } from '@/config/envioV4';

export function useSwapData(rawAddress?: string) {
  const address = rawAddress && isAddress(rawAddress) 
    ? getAddress(rawAddress) 
    : undefined;

  return useQuery({
    queryKey: ['swapData', address],
    enabled: !!address,
    queryFn: async () => {
      if (!address) throw new Error('Invalid address');
      
      const result = await envioAPI.getSwapData(address);
      if (!result?.success) {
        throw new Error('Failed to fetch swap data');
      }
      
      return result.data;
    },
    staleTime: 30_000, // 30 seconds
    cacheTime: 180_000, // 3 minutes
    retry: 1, // Swaps are less critical
  });
}