import { OnchainKitProvider } from '@coinbase/onchainkit';
import { WagmiProvider } from 'wagmi';
import { ReactNode } from 'react';
import { base } from 'viem/chains';
import { wagmiConfig } from './config';

interface Web3ProviderProps {
  children: ReactNode;
}

export function Web3Provider({ children }: Web3ProviderProps) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <OnchainKitProvider
        apiKey={import.meta.env.VITE_ONCHAINKIT_API_KEY}
        chain={base}
        config={{
          appearance: {
            mode: 'dark',
            theme: 'cyberpunk',
          },
        }}
      >
        {children}
      </OnchainKitProvider>
    </WagmiProvider>
  );
}