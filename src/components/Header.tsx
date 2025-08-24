import { Bell, Settings } from "lucide-react";  // <- Quité Wallet
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { WalletButton } from "@/components/web3/WalletButton";  // <- NUEVA IMPORTACIÓN

export const Header = () => {
  return (
    <header className="border-b border-border bg-card shadow-card">
      <div className="flex h-16 items-center justify-between px-6">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-primary"></div>
            <h1 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              UniPool Dashboard
            </h1>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs"
            >
              3
            </Badge>
          </Button>
          
          <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5" />
          </Button>

          {/* Reemplazado botón hardcodeado con WalletButton real */}
          <WalletButton />
        </div>
      </div>
    </header>
  );
};