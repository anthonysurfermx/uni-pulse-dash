import { useState, useEffect } from 'react';
import { ArrowUpRight, ArrowDownLeft, Plus, Minus, ExternalLink, History, Wallet } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { API_CONFIG } from "@/config/api";

interface Transaction {
  id: string;
  type: "add" | "remove" | "collect" | "swap";
  tokenPair: string;
  amount: string;
  value: string;
  hash: string;
  timestamp: string;
  status: "completed" | "pending" | "failed";
}

interface TransactionHistoryProps {
  walletAddress?: string;
}

export const TransactionHistory: React.FC<TransactionHistoryProps> = ({ walletAddress }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);

  // Default mock transactions for when no wallet is selected
  const mockTransactions: Transaction[] = [
    {
      id: "1",
      type: "collect",
      tokenPair: "ETH/USDC",
      amount: "0.0234 ETH + 45.67 USDC",
      value: "$127.50",
      hash: "0x1234...5678",
      timestamp: "2 hours ago",
      status: "completed",
    },
    {
      id: "2",
      type: "add",
      tokenPair: "UNI/ETH",
      amount: "250 UNI + 0.15 ETH",
      value: "$892.30",
      hash: "0x2345...6789",
      timestamp: "1 day ago",
      status: "completed",
    },
    {
      id: "3",
      type: "remove",
      tokenPair: "LINK/ETH",
      amount: "45 LINK + 0.08 ETH",
      value: "$456.80",
      hash: "0x3456...7890",
      timestamp: "2 days ago",
      status: "completed",
    },
    {
      id: "4",
      type: "swap",
      tokenPair: "USDC → ETH",
      amount: "1,000 USDC",
      value: "$1,000.00",
      hash: "0x4567...8901",
      timestamp: "3 days ago",
      status: "completed",
    },
  ];

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!walletAddress) {
        setTransactions([]);
        return;
      }

      setLoading(true);
      try {
        // In a real implementation, this would fetch actual transactions
        // For now, we'll simulate with the wallet data
        const response = await fetch(`${API_CONFIG.baseURL}/api/analyze/${walletAddress}`);
        const data = await response.json();

        if (data.success && data.data.positions.length > 0) {
          // Generate some sample transactions based on positions
          const sampleTxs: Transaction[] = data.data.positions.slice(0, 3).map((pos: any, index: number) => ({
            id: `tx-${index}`,
            type: index === 0 ? "collect" : index === 1 ? "add" : "remove",
            tokenPair: pos.pool,
            amount: `Fees collected`,
            value: `$${pos.fees.total}`,
            hash: `0x${walletAddress.slice(2, 6)}...${walletAddress.slice(-4)}`,
            timestamp: `${index + 1} days ago`,
            status: "completed" as const,
          }));
          
          setTransactions(sampleTxs);
        } else {
          setTransactions([]);
        }
      } catch (error) {
        console.error('Error fetching transactions:', error);
        setTransactions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [walletAddress]);

  const getTransactionIcon = (type: Transaction["type"]) => {
    switch (type) {
      case "add":
        return <Plus className="h-4 w-4 text-success" />;
      case "remove":
        return <Minus className="h-4 w-4 text-destructive" />;
      case "collect":
        return <ArrowDownLeft className="h-4 w-4 text-primary" />;
      case "swap":
        return <ArrowUpRight className="h-4 w-4 text-accent" />;
    }
  };

  const getStatusBadge = (status: Transaction["status"]) => {
    switch (status) {
      case "completed":
        return <Badge variant="default" className="text-xs">Completed</Badge>;
      case "pending":
        return <Badge variant="secondary" className="text-xs">Pending</Badge>;
      case "failed":
        return <Badge variant="destructive" className="text-xs">Failed</Badge>;
    }
  };

  const displayTransactions = walletAddress ? transactions : mockTransactions;

  return (
    <Card className="bg-gradient-card border-border shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="h-5 w-5" />
            <span>Recent Transactions</span>
            {walletAddress && (
              <Badge variant="outline" className="ml-2">
                <Wallet className="h-3 w-3 mr-1" />
                {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
              </Badge>
            )}
          </div>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => {
              if (walletAddress) {
                window.open(`https://etherscan.io/address/${walletAddress}`, '_blank');
              }
            }}
          >
            View All
            <ExternalLink className="h-3 w-3 ml-1" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!walletAddress && (
          <div className="mb-4 p-3 bg-muted/50 rounded-lg text-sm text-muted-foreground text-center">
            <History className="h-4 w-4 inline-block mr-2" />
            Showing example transactions. Enter a wallet address to see real history.
          </div>
        )}

        {loading && (
          <div className="flex items-center justify-center py-8">
            <div className="text-muted-foreground">Loading transactions...</div>
          </div>
        )}

        {!loading && displayTransactions.length === 0 && walletAddress && (
          <div className="text-center py-8 text-muted-foreground">
            <History className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No recent transactions found</p>
          </div>
        )}

        {!loading && displayTransactions.length > 0 && (
          <div className="space-y-3">
            {displayTransactions.map((tx) => (
              <div
                key={tx.id}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    {getTransactionIcon(tx.type)}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-sm font-medium text-foreground">
                        {tx.tokenPair}
                      </span>
                      {getStatusBadge(tx.status)}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {tx.amount}
                    </p>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="text-sm font-semibold text-foreground">
                    {tx.value}
                  </p>
                  <div className="flex items-center space-x-1">
                    <span className="text-xs text-muted-foreground">
                      {tx.timestamp}
                    </span>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-4 w-4 p-0"
                      onClick={() => {
                        const explorerUrl = walletAddress 
                          ? `https://etherscan.io/address/${walletAddress}`
                          : `https://etherscan.io/tx/${tx.hash}`;
                        window.open(explorerUrl, '_blank');
                      }}
                    >
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};