// MiniKit configuration optimized for your existing API
export const MINIKIT_CONFIG = {
  appName: 'UniPool Dashboard',
  appDescription: 'Analyze Uniswap V3 & V4 positions on Base',
  appUrl: import.meta.env.VITE_MINIAPP_URL || 'https://unipulse.app',
  version: '1.0.0',
  
  // Your existing APIs
  apis: {
    v3: import.meta.env.VITE_API_BASE_URL || 'https://uniswap-v3-ai-agent.vercel.app',
    v4GraphQL: 'https://indexer.bigdevenergy.link/bb1a9fc/v1/graphql',
  },
  
  // Base Mini App theme
  theme: {
    primaryColor: '#0052FF',
    backgroundColor: '#000000',
    accentColor: '#8A63D2',
  },
  
  features: {
    dualApiSupport: true, // V3 + V4
    swapDataGraphQL: true,
    portfolioAnalysis: true,
    realTimeData: true,
    walletConnect: true,
  },
};

// Mini App metadata injection (optimized)
export const injectMiniAppMetadata = () => {
  if (typeof window === 'undefined') return;

  document.title = MINIKIT_CONFIG.appName;
  
  // Essential meta tags for Base Mini App
  const metaTags = [
    { name: 'application-name', content: MINIKIT_CONFIG.appName },
    { name: 'description', content: MINIKIT_CONFIG.appDescription },
    { name: 'theme-color', content: MINIKIT_CONFIG.theme.primaryColor },
    { name: 'mobile-web-app-capable', content: 'yes' },
    { name: 'apple-mobile-web-app-capable', content: 'yes' },
  ];

  metaTags.forEach(({ name, content }) => {
    let meta = document.querySelector(`meta[name="${name}"]`);
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', name);
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', content);
  });

  // Viewport for Mini App
  const viewport = document.querySelector('meta[name="viewport"]');
  if (viewport) {
    viewport.setAttribute(
      'content', 
      'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no'
    );
  }
};

// Check if running in Base app
export const isRunningInBase = (): boolean => {
  if (typeof window === 'undefined') return false;
  return /BaseApp/i.test(window.navigator.userAgent) || 
         window.location.hostname.includes('base.org');
};