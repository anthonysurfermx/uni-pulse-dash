// src/config/web3.ts
import { http } from 'viem';
import { base, mainnet } from 'viem/chains';
import { createConfig } from 'wagmi';
import { coinbaseWallet, metaMask, walletConnect } from 'wagmi/connectors';

// Configuración para Base y Mainnet
export const config = createConfig({
  chains: [base, mainnet],
  connectors: [
    coinbaseWallet({
      appName: 'Unipulse',
      preference: 'smartWalletOnly', // Solo smart wallets
    }),
    metaMask(),
    walletConnect({
      projectId: process.env.NEXT_PUBLIC_WC_PROJECT_ID || 'tu-wallet-connect-project-id',
    }),
  ],
  transports: {
    [base.id]: http(),
    [mainnet.id]: http(),
  },
});

export const ONCHAINKIT_CONFIG = {
  apiKey: process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY || 'tu-coinbase-api-key',
  chain: base, // Base como chain principal
};