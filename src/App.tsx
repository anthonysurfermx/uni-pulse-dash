// src/App.tsx
import { Routes, Route } from "react-router-dom";
import { AppProviders } from "@/components/AppProviders";
import { AppSidebar } from "@/components/AppSidebar";
import { Header } from "@/components/Header";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

/**
 * UniPool Dashboard - Main Application Component
 * 
 * A comprehensive DeFi analytics platform that combines:
 * - Uniswap V3 & V4 position analysis
 * - Real-time portfolio tracking
 * - Base Mini App integration
 * - Multi-wallet support (MetaMask, Coinbase Wallet, WalletConnect)
 * 
 * Features:
 * - Real-time data from Envío GraphQL API (V4) + Vercel API (V3)
 * - Mobile-optimized as Base Mini App
 * - Wallet auto-connection with position analysis
 * - Professional shadcn/ui components
 */
function App() {
  return (
    <AppProviders>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1 p-6">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/positions" element={<Index />} />
              <Route path="/analytics" element={<Index />} />
              <Route path="/rewards" element={<Index />} />
              <Route path="/alerts" element={<Index />} />
              <Route path="/history" element={<Index />} />
              <Route path="/settings" element={<Index />} />
              {/* Catch-all route for 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </div>
      </div>
    </AppProviders>
  );
}

export default App;