import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Search, Loader2 } from 'lucide-react';

interface WalletInputProps {
  onAnalyze: (address: string) => void;
  isLoading?: boolean;
}

export function WalletInput({ onAnalyze, isLoading = false }: WalletInputProps) {
  const [walletAddress, setWalletAddress] = useState('');
  const [error, setError] = useState('');

  const validateAddress = (address: string) => {
    if (!address.startsWith('0x')) return false;
    if (address.length !== 42) return false;
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!walletAddress) {
      setError('Please enter a wallet address');
      return;
    }

    if (!validateAddress(walletAddress)) {
      setError('Invalid Ethereum address format');
      return;
    }

    onAnalyze(walletAddress);
  };

  return (
    <Card className="p-6 mb-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <h2 className="text-2xl font-bold mb-2">Analyze Uniswap V3 Positions</h2>
          <p className="text-muted-foreground">
            Enter any Ethereum wallet address to view its Uniswap V3 positions
          </p>
        </div>
        
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="Enter wallet address (0x...)"
            value={walletAddress}
            onChange={(e) => setWalletAddress(e.target.value)}
            className="flex-1"
            disabled={isLoading}
          />
          <Button type="submit" disabled={isLoading || !walletAddress}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Search className="mr-2 h-4 w-4" />
                Analyze
              </>
            )}
          </Button>
        </div>
        
        {error && (
          <p className="text-sm text-destructive">{error}</p>
        )}
        
        <div className="text-sm text-muted-foreground">
          <p>Example addresses:</p>
          <button
            type="button"
            onClick={() => setWalletAddress('0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045')}
            className="text-primary hover:underline mr-2"
          >
            vitalik.eth
          </button>
        </div>
      </form>
    </Card>
  );
}
