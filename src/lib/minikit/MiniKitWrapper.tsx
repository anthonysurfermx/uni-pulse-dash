import { useEffect, ReactNode } from 'react';
import { useAccount } from 'wagmi';
import { injectMiniAppMetadata, isRunningInBase, MINIKIT_CONFIG } from './config';

interface MiniKitWrapperProps {
  children: ReactNode;
}

export function MiniKitWrapper({ children }: MiniKitWrapperProps) {
  const { isConnected, address } = useAccount();

  useEffect(() => {
    // Setup Mini App
    injectMiniAppMetadata();
    
    // Log status
    console.log('🏗️ UniPool Mini App:', {
      isRunningInBase: isRunningInBase(),
      isConnected,
      address: address ? `${address.slice(0, 6)}...${address.slice(-4)}` : null,
      apis: MINIKIT_CONFIG.apis,
    });

    // Add Mini App styling
    if (isRunningInBase()) {
      document.documentElement.classList.add('base-miniapp');
    }
  }, [isConnected, address]);

  return <>{children}</>;
}