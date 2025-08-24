import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    // Configuración de proxy MEJORADA para resolver CORS
    proxy: {
      // ✅ NUEVO: Proxy para tu Envío V4 endpoint
      '/api/envio-v4': {
        target: 'https://enviodev-69b6884.dedicated.hyperindex.xyz/v1/graphql',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/envio-v4/, ''),
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.log('Envío V4 proxy error:', err);
          });
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            // Headers específicos para Envío GraphQL
            proxyReq.setHeader('Content-Type', 'application/json');
            proxyReq.setHeader('Accept', 'application/json');
            proxyReq.setHeader('User-Agent', 'Unipulse-V4/1.0');
            console.log('🚀 Proxying Envío V4 to:', req.url);
          });
          proxy.on('proxyRes', (proxyRes, req, _res) => {
            // CORS headers para Envío V4
            proxyRes.headers['Access-Control-Allow-Origin'] = '*';
            proxyRes.headers['Access-Control-Allow-Methods'] = 'GET,PUT,POST,DELETE,OPTIONS';
            proxyRes.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization, Content-Length, X-Requested-With';
            console.log('✅ Envío V4 response:', proxyRes.statusCode, req.url);
          });
        },
      },
      
      // Proxy para The Graph APIs (backup)
      '/api/thegraph': {
        target: 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3-base',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/thegraph/, ''),
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.log('The Graph proxy error:', err);
          });
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            proxyReq.setHeader('Content-Type', 'application/json');
            proxyReq.setHeader('Accept', 'application/json');
            console.log('🌐 Proxying The Graph to:', req.url);
          });
          proxy.on('proxyRes', (proxyRes, req, _res) => {
            proxyRes.headers['Access-Control-Allow-Origin'] = '*';
            proxyRes.headers['Access-Control-Allow-Methods'] = 'GET,PUT,POST,DELETE,OPTIONS';
            proxyRes.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization, Content-Length, X-Requested-With';
            console.log('✅ The Graph response:', proxyRes.statusCode, req.url);
          });
        }
      }
    },
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // Configuraciones adicionales para Web3 y desarrollo
  define: {
    global: 'globalThis',
  },
  optimizeDeps: {
    include: [
      'graphql-request', 
      'viem', 
      '@tanstack/react-query',
      '@radix-ui/react-tabs',
      'lucide-react',
      'react',
      'react-dom'
    ],
  },
}));