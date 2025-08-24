import React from 'react';
import { Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAccount, useConnect, useDisconnect } from 'wagmi';

export const WalletButtonSimple = () => {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();

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
    <Button
      variant="connect"
      className="gap-2"
      onClick={() => {
        const coinbaseConnector = connectors.find(c => c.name === 'Coinbase Wallet');
        if (coinbaseConnector) {
          connect({ connector: coinbaseConnector });
        }
      }}
    >
      <Wallet className="h-4 w-4" />
      Connect Wallet
    </Button>
  );
};