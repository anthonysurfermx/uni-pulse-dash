// src/components/OnchainKitProvider.tsx
import React from 'react';
import { OnchainKitProvider } from '@coinbase/onchainkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { RainbowKitProvider, getDefaultConfig } from '@rainbow-me/rainbowkit';
import { base, mainnet } from 'wagmi/chains';
import { ONCHAINKIT_CONFIG } from '@/config/web3';
import '@coinbase/onchainkit/styles.css';
import '@rainbow-me/rainbowkit/styles.css';

// Configuración de wagmi con RainbowKit
const wagmiConfig = getDefaultConfig({
  appName: 'Unipulse',
  projectId: process.env.NEXT_PUBLIC_WC_PROJECT_ID || 'your-project-id',
  chains: [base, mainnet],
  ssr: false,
});

// QueryClient para wagmi
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      retry: 1,
    },
  },
});

interface ProvidersProps {
  children: React.ReactNode;
}

export function OnchainProviders({ children }: ProvidersProps) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <OnchainKitProvider
          apiKey={ONCHAINKIT_CONFIG.apiKey}
          chain={ONCHAINKIT_CONFIG.chain}
          config={{
            appearance: {
              mode: 'auto',
              theme: 'default',
            },
          }}
        >
          <RainbowKitProvider>
            {children}
          </RainbowKitProvider>
        </OnchainKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default OnchainProviders;