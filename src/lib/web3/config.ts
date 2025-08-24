import { http, createConfig } from 'wagmi';
import { base, mainnet } from 'wagmi/chains';
import { coinbaseWallet, metaMask, walletConnect } from 'wagmi/connectors';

export const wagmiConfig = createConfig({
  chains: [base, mainnet],
  connectors: [
    coinbaseWallet({ 
      appName: 'UniPool Dashboard',
      appLogoUrl: '/favicon.ico',
    }),
    metaMask(),
    walletConnect({
      projectId: import.meta.env.VITE_WC_PROJECT_ID,
    }),
  ],
  transports: {
    [base.id]: http('https://mainnet.base.org'),
    [mainnet.id]: http(),
  },
});