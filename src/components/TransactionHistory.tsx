import { ArrowUpRight, ArrowDownLeft, Plus, Minus, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

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

export const TransactionHistory = () => {
  const transactions: Transaction[] = [
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

  return (
    <Card className="bg-gradient-card border-border shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Recent Transactions</span>
          <Button variant="ghost" size="sm">
            View All
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {transactions.map((tx) => (
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
                  <Button variant="ghost" size="sm" className="h-4 w-4 p-0">
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};