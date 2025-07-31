import { AlertTriangle, TrendingDown, Info, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Alert {
  id: string;
  type: "warning" | "error" | "info" | "success";
  title: string;
  message: string;
  timestamp: string;
  actionLabel?: string;
}

export const AlertsPanel = () => {
  const alerts: Alert[] = [
    {
      id: "1",
      type: "warning",
      title: "ETH/USDC Position Out of Range",
      message: "Your position is 15% out of range. Consider rebalancing to earn fees.",
      timestamp: "2 hours ago",
      actionLabel: "Rebalance",
    },
    {
      id: "2",
      type: "error",
      title: "High Impermanent Loss",
      message: "LINK/ETH position showing -8.5% IL. Review your strategy.",
      timestamp: "6 hours ago",
      actionLabel: "Review",
    },
    {
      id: "3",
      type: "info",
      title: "Fee Collection Available",
      message: "Unclaimed fees: $127.50 across 3 positions.",
      timestamp: "1 day ago",
      actionLabel: "Collect",
    },
    {
      id: "4",
      type: "success",
      title: "Position Performing Well",
      message: "UNI/ETH showing 22.3% APR with minimal IL.",
      timestamp: "2 days ago",
    },
  ];

  const getAlertIcon = (type: Alert["type"]) => {
    switch (type) {
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-warning" />;
      case "error":
        return <TrendingDown className="h-4 w-4 text-destructive" />;
      case "info":
        return <Info className="h-4 w-4 text-primary" />;
      case "success":
        return <CheckCircle className="h-4 w-4 text-success" />;
    }
  };

  const getAlertVariant = (type: Alert["type"]) => {
    switch (type) {
      case "warning":
        return "secondary";
      case "error":
        return "destructive";
      case "info":
        return "default";
      case "success":
        return "default";
      default:
        return "default";
    }
  };

  return (
    <Card className="bg-gradient-card border-border shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <AlertTriangle className="h-5 w-5 text-warning" />
          <span>Active Alerts</span>
          <Badge variant="secondary" className="text-xs">
            {alerts.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className="flex items-start space-x-3 p-3 rounded-lg bg-muted/50 hover:bg-muted/70 transition-colors"
            >
              <div className="flex-shrink-0 mt-0.5">
                {getAlertIcon(alert.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-sm font-medium text-foreground truncate">
                    {alert.title}
                  </h4>
                  <span className="text-xs text-muted-foreground">
                    {alert.timestamp}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  {alert.message}
                </p>
                {alert.actionLabel && (
                  <Button 
                    variant={getAlertVariant(alert.type)} 
                    size="sm"
                    className="text-xs h-7"
                  >
                    {alert.actionLabel}
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};