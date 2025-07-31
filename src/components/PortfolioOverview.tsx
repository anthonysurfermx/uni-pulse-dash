import { TrendingUp, TrendingDown, DollarSign, Percent } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const PortfolioOverview = () => {
  const stats = [
    {
      title: "Total Value Locked",
      value: "$24,582.50",
      change: "+12.5%",
      changeType: "positive" as const,
      icon: DollarSign,
    },
    {
      title: "Total Unclaimed Fees",
      value: "$347.82",
      change: "+$24.12",
      changeType: "positive" as const,
      icon: TrendingUp,
    },
    {
      title: "Average APR",
      value: "15.4%",
      change: "-2.1%",
      changeType: "negative" as const,
      icon: Percent,
    },
    {
      title: "Impermanent Loss",
      value: "-$156.25",
      change: "-0.6%",
      changeType: "negative" as const,
      icon: TrendingDown,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <Card key={index} className="bg-gradient-card border-border shadow-card hover:shadow-glow transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stat.value}</div>
            <Badge 
              variant={stat.changeType === "positive" ? "default" : "destructive"}
              className="mt-2 text-xs"
            >
              {stat.change}
            </Badge>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};