import React from 'react';
import { Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAccount, useDisconnect } from 'wagmi';
import { ConnectWallet } from '@coinbase/onchainkit/wallet';

interface WalletButtonProps {
  onWalletChange?: (address: string | null) => void;
}

export const WalletButton = ({ onWalletChange }: WalletButtonProps) => {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  // Notificar cambios de wallet
  React.useEffect(() => {
    onWalletChange?.(isConnected && address ? address : null);
  }, [isConnected, address, onWalletChange]);

  if (isConnected && address) {
    return (
      <Button 
        variant="connect" 
        className="gap-2"
        onClick={() => disconnect()}
      >
        <Wallet className="h-4 w-4" />
        {address.slice(0, 6)}...{address.slice(-4)}
      </Button>
    );
  }

  return (
    <div className="relative">
      <ConnectWallet 
        className="!absolute !inset-0 !opacity-0 !w-full !h-full !cursor-pointer !z-10"
        text=""
      />
      <Button variant="connect" className="gap-2 relative">
        <Wallet className="h-4 w-4" />
        Connect Wallet
      </Button>
    </div>
  );
};