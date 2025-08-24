// src/components/AppProviders.tsx
import { ReactNode } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider } from "@/components/ui/sidebar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { Web3Provider } from "@/lib/web3";
import { MiniKitWrapper } from "@/lib/minikit/MiniKitWrapper";

interface AppProvidersProps {
  children: ReactNode;
}

// Shared query client instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      cacheTime: 1000 * 60 * 10, // 10 minutes
      retry: 2,
      refetchOnWindowFocus: false, 
    },
  },
});

/**
 * AppProviders - Centralized provider stack for the entire application
 * 
 * Provider hierarchy (from outer to inner):
 * 1. QueryClientProvider - TanStack Query for data fetching/caching
 * 2. Web3Provider - Wagmi + OnchainKit for blockchain interactions
 * 3. MiniKitWrapper - Base Mini App SDK integration (mobile optimization, metadata injection)
 * 4. TooltipProvider - shadcn/ui tooltips
 * 5. Toast system - Dual toast setup (shadcn/ui Toaster + Sonner for different use cases)
 * 6. BrowserRouter - React Router for navigation
 * 7. SidebarProvider - shadcn/ui sidebar state management
 */
export function AppProviders({ children }: AppProvidersProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <Web3Provider>
        {/* Base Mini App SDK - Enables mobile optimization, wallet bridging, and Base ecosystem integration */}
        <MiniKitWrapper>
          <TooltipProvider>
            {/* Dual Toast System:
                - Toaster: shadcn/ui toasts for form validation, errors
                - Sonner: Rich notifications for success messages, transactions */}
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <SidebarProvider>
                {children}
              </SidebarProvider>
            </BrowserRouter>
          </TooltipProvider>
        </MiniKitWrapper>
      </Web3Provider>
    </QueryClientProvider>
  );
}