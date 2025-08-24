import React, { useState, useEffect, useCallback, useTransition, useMemo } from 'react';
import { Search, Wallet, AlertCircle, CheckCircle, Loader2, TrendingUp, Activity } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ErrorBoundary } from 'react-error-boundary';
import { isAddress, getAddress } from 'viem';
import { useWalletAnalysis, usePortfolio } from '@/hooks';
import { 
  createCurrencyFormatter, 
  truncateAddress, 
  toNumber,
  isValidEthereumAddress 
} from '@/utils/safe';
import type { AnalysisData } from '@/types/portfolio';

interface WalletInputProps {
  onWalletChange?: (address: string | null) => void;
  onAnalysisComplete?: (data: AnalysisData) => void;
  className?: string;
  placeholder?: string;
  autoAnalyze?: boolean;
  connectedWallet?: string;
}

interface QuickStats {
  totalValue?: number;
  riskLevel?: string;
  activityScore?: number;
  lastActivity?: string;
}

// Formatters
const fmtMoney = createCurrencyFormatter('es-MX', 'USD');

// Error Fallback for WalletInput
function WalletInputErrorFallback({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) {
  return (
    <Alert variant="destructive" className="max-w-md">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription>
        Wallet input error: {error.message}
        <Button 
          variant="link" 
          onClick={resetErrorBoundary}
          className="p-0 h-auto ml-2 underline"
        >
          Reset
        </Button>
      </AlertDescription>
    </Alert>
  );
}

const WalletInput: React.FC<WalletInputProps> = ({ 
  onWalletChange,
  onAnalysisComplete,
  className = "",
  placeholder = "Enter wallet address (0x...)",
  autoAnalyze = true,
  connectedWallet
}) => {
  const [inputValue, setInputValue] = useState('');
  const [validatedAddress, setValidatedAddress] = useState<string | null>(null);
  const [showQuickStats, setShowQuickStats] = useState(false);
  const [isPending, startTransition] = useTransition();

  // Auto-fill when wallet is connected
  useEffect(() => {
    if (connectedWallet && isValidEthereumAddress(connectedWallet)) {
      const normalized = getAddress(connectedWallet);
      setInputValue(normalized);
      setValidatedAddress(normalized);
      onWalletChange?.(normalized);
    }
  }, [connectedWallet, onWalletChange]);

  // Use our custom hooks
  const { 
    data: analysisData, 
    isLoading: analysisLoading, 
    error: analysisError,
    refetch: refetchAnalysis
  } = useWalletAnalysis(validatedAddress);
  
  const { 
    data: portfolioData, 
    isLoading: portfolioLoading, 
    error: portfolioError 
  } = usePortfolio(validatedAddress);

  // Combined loading state
  const isAnalyzing = analysisLoading || portfolioLoading || isPending;

  // Address validation with proper error handling
  const validateAndSetAddress = useCallback((address: string) => {
    const trimmed = address.trim();
    
    if (!trimmed) {
      setValidatedAddress(null);
      setShowQuickStats(false);
      onWalletChange?.(null);
      return { isValid: false, error: null };
    }

    // Enhanced validation
    if (!isValidEthereumAddress(trimmed)) {
      return { 
        isValid: false, 
        error: 'Invalid Ethereum address format. Must be 42 characters starting with 0x' 
      };
    }

    try {
      const normalized = getAddress(trimmed);
      setValidatedAddress(normalized);
      onWalletChange?.(normalized);
      
      if (autoAnalyze) {
        setShowQuickStats(true);
      }

      return { isValid: true, error: null };
    } catch (err) {
      return { 
        isValid: false, 
        error: 'Invalid address checksum. Please verify the address.' 
      };
    }
  }, [onWalletChange, autoAnalyze]);

  // Handle input changes with debounced validation
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    
    // Real-time validation for complete addresses
    if (value.length === 42) {
      startTransition(() => {
        validateAndSetAddress(value);
      });
    } else if (value.length < 42 && validatedAddress) {
      setValidatedAddress(null);
      setShowQuickStats(false);
      onWalletChange?.(null);
    }
  }, [validateAndSetAddress, validatedAddress, onWalletChange]);

  // Handle analyze button with transition
  const handleAnalyze = useCallback(() => {
    startTransition(() => {
      const validation = validateAndSetAddress(inputValue);
      if (validation.isValid) {
        setShowQuickStats(true);
        refetchAnalysis();
      }
    });
  }, [inputValue, validateAndSetAddress, refetchAnalysis]);

  // Handle analysis completion
  useEffect(() => {
    if (analysisData && onAnalysisComplete) {
      onAnalysisComplete(analysisData);
    }
  }, [analysisData, onAnalysisComplete]);

  // Get validation status
  const validationStatus = useMemo(() => {
    if (!inputValue.trim()) return null;
    if (inputValue.length < 42) return 'typing';
    if (!isValidEthereumAddress(inputValue)) return 'invalid';
    return 'valid';
  }, [inputValue]);

  // Extract quick stats safely
  const quickStats: QuickStats = useMemo(() => ({
    totalValue: toNumber(portfolioData?.data?.totalValue),
    riskLevel: analysisData?.riskLevel,
    activityScore: toNumber(analysisData?.activityScore),
    lastActivity: analysisData?.lastActivity
  }), [portfolioData, analysisData]);

  // Status icon with proper states
  const renderStatusIcon = useCallback(() => {
    if (isAnalyzing) {
      return <Loader2 className="w-4 h-4 animate-spin text-blue-500" aria-label="Analyzing wallet" />;
    }
    
    switch (validationStatus) {
      case 'valid':
        return <CheckCircle className="w-4 h-4 text-green-500" aria-label="Valid address" />;
      case 'invalid':
        return <AlertCircle className="w-4 h-4 text-red-500" aria-label="Invalid address" />;
      case 'typing':
        return <Wallet className="w-4 h-4 text-muted-foreground" aria-label="Enter wallet address" />;
      default:
        return <Search className="w-4 h-4 text-muted-foreground" aria-label="Search wallet" />;
    }
  }, [isAnalyzing, validationStatus]);

  const currentError = analysisError || portfolioError;

  return (
    <div className={`space-y-4 ${className}`} role="search" aria-label="Wallet analysis search">
      {/* Main Input */}
      <div className="relative">
        <div className="relative flex">
          <div className="relative flex-1">
            <Input
              type="text"
              placeholder={connectedWallet ? "Connected wallet auto-filled" : placeholder}
              value={inputValue}
              onChange={handleInputChange}
              className={`pr-12 font-mono text-sm transition-colors ${
                validationStatus === 'valid' ? 'border-green-500 focus:ring-green-500' :
                validationStatus === 'invalid' ? 'border-red-500 focus:ring-red-500' :
                'border-border'
              }`}
              disabled={isAnalyzing}
              aria-invalid={validationStatus === 'invalid'}
              aria-describedby={
                validationStatus === 'invalid' ? 'address-error' :
                connectedWallet ? 'connected-wallet-info' : undefined
              }
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              {renderStatusIcon()}
            </div>
          </div>
          
          <Button
            onClick={handleAnalyze}
            disabled={!validatedAddress || isAnalyzing}
            variant="default"
            className="ml-2"
            aria-busy={isAnalyzing}
            aria-label={isAnalyzing ? "Analyzing wallet..." : "Analyze wallet"}
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Activity className="w-4 h-4 mr-2" />
                Analyze
              </>
            )}
          </Button>
        </div>
        
        {/* Validation Messages */}
        {validationStatus === 'invalid' && (
          <p id="address-error" className="text-sm text-red-600 mt-1" role="alert">
            Please enter a valid Ethereum address (42 characters starting with 0x)
          </p>
        )}
        
        {connectedWallet && (
          <p id="connected-wallet-info" className="text-sm text-green-600 mt-1 flex items-center gap-1">
            <CheckCircle className="w-3 h-3" />
            Auto-filled from connected wallet
          </p>
        )}
      </div>

      {/* Error Display */}
      {currentError && (
        <Alert role="alert" variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {currentError?.message || 'Analysis failed'}
            <Button
              type="button"
              variant="link"
              onClick={() => refetchAnalysis()}
              className="p-0 h-auto ml-2 underline"
              aria-label="Retry analysis"
              disabled={isAnalyzing}
            >
              {isAnalyzing ? 'Retrying...' : 'Retry'}
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Quick Stats Preview */}
      {showQuickStats && validatedAddress && !isAnalyzing && (
        <Card className="border-dashed" role="region" aria-label="Quick wallet analysis">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Quick Analysis
              <Badge variant="outline" className="text-xs font-mono">
                {truncateAddress(validatedAddress)}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <div className="text-xs text-muted-foreground">Portfolio Value</div>
                <div className="font-medium" aria-live="polite">
                  {quickStats.totalValue 
                    ? fmtMoney.format(quickStats.totalValue)
                    : 'Loading...'
                  }
                </div>
              </div>
              
              <div>
                <div className="text-xs text-muted-foreground">Risk Level</div>
                <div className="font-medium" aria-live="polite">
                  {quickStats.riskLevel || 'Analyzing...'}
                </div>
              </div>
              
              <div>
                <div className="text-xs text-muted-foreground">Activity Score</div>
                <div className="font-medium" aria-live="polite">
                  {quickStats.activityScore 
                    ? `${quickStats.activityScore}/100`
                    : 'Calculating...'
                  }
                </div>
              </div>
              
              <div>
                <div className="text-xs text-muted-foreground">Last Activity</div>
                <div className="font-medium text-xs" aria-live="polite">
                  {quickStats.lastActivity 
                    ? new Date(quickStats.lastActivity).toLocaleDateString('es-MX')
                    : 'Checking...'
                  }
                </div>
              </div>
            </div>
            
            {(analysisData || portfolioData) && (
              <div className="mt-3 pt-3 border-t">
                <p className="text-xs text-muted-foreground text-center">
                  ✨ Full analysis loaded below
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Address Display for Screen Readers */}
      {validatedAddress && (
        <div className="sr-only" aria-live="polite">
          Validated wallet address: {validatedAddress}
        </div>
      )}
      
      {/* Visual Address Display */}
      {validatedAddress && (
        <div className="text-xs text-muted-foreground font-mono" aria-hidden="true">
          Validated: {truncateAddress(validatedAddress, 8, 6)}
        </div>
      )}
    </div>
  );
};

// Wrap with ErrorBoundary
const WalletInputWithErrorBoundary: React.FC<WalletInputProps> = (props) => (
  <ErrorBoundary FallbackComponent={WalletInputErrorFallback}>
    <WalletInput {...props} />
  </ErrorBoundary>
);

export default WalletInputWithErrorBoundary;