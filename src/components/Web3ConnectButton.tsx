// src/components/Web3ConnectButton.tsx
import React, { useEffect } from 'react';
import { 
  ConnectWallet,
  Wallet,
  WalletDropdown,
  WalletDropdownBasename,
  WalletDropdownFundLink,
  WalletDropdownLink,
  WalletDropdownDisconnect,
} from '@coinbase/onchainkit/wallet';
import {
  Address,
  Avatar,
  Name,
  Identity,
  EthBalance,
} from '@coinbase/onchainkit/identity';
import { color } from '@coinbase/onchainkit/theme';
import { useAccount, useDisconnect } from 'wagmi';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Wallet as WalletIcon, ExternalLink, LogOut } from 'lucide-react';

interface Web3ConnectButtonProps {
  onWalletConnected?: (address: string) => void;
  onWalletDisconnected?: () => void;
  className?: string;
}

export const Web3ConnectButton: React.FC<Web3ConnectButtonProps> = ({
  onWalletConnected,
  onWalletDisconnected,
  className = ""
}) => {
  const { address, isConnected, connector } = useAccount();
  const { disconnect } = useDisconnect();

  // Notificar cambios de wallet al componente padre
  useEffect(() => {
    if (isConnected && address && onWalletConnected) {
      onWalletConnected(address);
    } else if (!isConnected && onWalletDisconnected) {
      onWalletDisconnected();
    }
  }, [isConnected, address, onWalletConnected, onWalletDisconnected]);

  // Si no está conectado, mostrar botón de conexión
  if (!isConnected) {
    return (
      <div className={className}>
        <ConnectWallet>
          <Button 
            variant="default" 
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg"
          >
            <WalletIcon className="w-5 h-5 mr-2" />
            Connect Wallet
          </Button>
        </ConnectWallet>
      </div>
    );
  }

  // Si está conectado, mostrar wallet dropdown
  return (
    <div className={className}>
      <Wallet>
        <ConnectWallet>
          <div className="flex items-center gap-3 p-3 bg-card border rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <Avatar className="h-8 w-8" />
            <div className="flex flex-col">
              <Name className="font-medium text-sm" />
              <Address className="text-xs text-muted-foreground font-mono" />
            </div>
            <Badge variant="outline" className="ml-auto">
              <EthBalance />
            </Badge>
          </div>
        </ConnectWallet>
        
        <WalletDropdown>
          <Identity 
            className="px-4 py-3 hover:bg-accent"
            hasCopyAddressOnClick
          >
            <Avatar />
            <Name />
            <Address className="text-muted-foreground" />
            <EthBalance />
          </Identity>
          
          <WalletDropdownBasename />
          
          <WalletDropdownLink 
            icon="wallet" 
            href="https://keys.coinbase.com"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Wallet
          </WalletDropdownLink>
          
          <WalletDropdownFundLink />
          
          <WalletDropdownDisconnect>
            <LogOut className="w-4 h-4 mr-2" />
            Disconnect
          </WalletDropdownDisconnect>
        </WalletDropdown>
      </Wallet>
    </div>
  );
};

export default Web3ConnectButton;