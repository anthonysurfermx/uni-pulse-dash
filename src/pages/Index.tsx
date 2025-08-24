// src/pages/Index.tsx - Versión robusta y pulida
import { useCallback, useMemo, useRef, useState } from "react";
import { Search, Wallet, TrendingUp, TestTube, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PortfolioOverview from "@/components/PortfolioOverview";
import PositionCard from "@/components/PositionCard";
import EnvioTest from "@/components/EnvioTest";
import { envioAPI } from "@/config/envioV4";

// ---- Tipos estrictos ----
type Position = {
  id: string;
  tokenPair?: string;
  currentPrice?: number;
  minPrice?: number;
  maxPrice?: number;
  inRange?: boolean;
  liquidity?: string;
  unclaimedFees?: string;
  apr?: number;
  impermanentLoss?: number;
  feeTier?: string;
  positionId?: string;
  owner?: string;
  lastUpdated?: string;
  [k: string]: unknown;
};

type Summary = {
  totalValueUSD: string | number;
  totalPositions: number;
  activePositions: number;
  totalSwaps: number;
};

type AnalysisData = {
  wallet: string;
  summary: Partial<Summary>;
  positions: Position[];
  lastUpdated: string | number | Date;
};

type AnalyzeResult =
  | { success: true; data: { summary: Summary; positions: Position[]; lastUpdated: string | number } }
  | { success: false; error: string };

// ---- Utilidades ----
const normalizeWallet = (raw: string): { ok: boolean; value?: string; error?: string } => {
  const input = raw.trim();
  if (!input) return { ok: false, error: "Ingresa una dirección o ENS" };

  // Si parece ENS, lo dejamos pasar
  if (input.includes(".eth")) return { ok: true, value: input };

  // Validación básica de dirección Ethereum (sin viem para simplicidad)
  if (!/^0x[a-fA-F0-9]{40}$/.test(input)) {
    return { ok: false, error: "Dirección no válida" };
  }

  return { ok: true, value: input.toLowerCase() };
};

const formatDate = (v: string | number | Date) => {
  try {
    return new Date(v).toLocaleString("es-ES");
  } catch {
    return String(v);
  }
};

const Index = () => {
  const [walletInput, setWalletInput] = useState("");
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const abortRef = useRef<AbortController | null>(null);

  const validInput = useMemo(() => normalizeWallet(walletInput), [walletInput]);

  const quickStats = useMemo(() => {
    const s = analysisData?.summary;
    return {
      totalPositions: s?.totalPositions ?? 0,
      activePositions: s?.activePositions ?? 0,
      totalSwaps: s?.totalSwaps ?? 0,
      totalValueUSD: s?.totalValueUSD ?? "$0.00",
    };
  }, [analysisData]);

  const analyzeWallet = useCallback(
    async (forcedAddress?: string) => {
      const toCheck = forcedAddress ?? walletInput;
      const parsed = normalizeWallet(toCheck);
      if (!parsed.ok || !parsed.value) {
        setErrorMsg(parsed.error ?? "Por favor ingresa una dirección válida");
        return;
      }

      // Cancelar petición anterior si existe
      if (abortRef.current) abortRef.current.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      setIsLoading(true);
      setErrorMsg("");
      setAnalysisData(null);

      console.groupCollapsed("🔍 Análisis de wallet");
      console.log("Wallet (input):", toCheck);
      console.log("Wallet (normalizada):", parsed.value);

      try {
        const result = (await envioAPI.analyzeWallet(parsed.value)) as AnalyzeResult;

        console.log("📊 Resultado completo:", result);

        if (result.success) {
          const transformed: AnalysisData = {
            wallet: parsed.value,
            summary: result.data.summary,
            positions: result.data.positions ?? [],
            lastUpdated: result.data.lastUpdated,
          };
          console.log("🎯 Datos transformados:", transformed);
          setAnalysisData(transformed);
        } else {
          const msg = result.error || "Error al analizar la wallet";
          console.error("❌ Error en análisis:", msg);
          setErrorMsg(msg);
        }
      } catch (err: unknown) {
        // Si se abortó, no mostrar error
        if (controller.signal.aborted) {
          console.log("⏹️ Petición abortada por nueva búsqueda");
        } else {
          const message =
            err instanceof Error
              ? err.message
              : typeof err === "string"
              ? err
              : "Error desconocido";
          console.error("❌ Error catch:", err);
          setErrorMsg(`Error: ${message}`);
        }
      } finally {
        console.groupEnd();
        setIsLoading(false);
      }
    },
    [walletInput]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    analyzeWallet();
  };

  const useDemo = async (addr: string) => {
    setWalletInput(addr);
    // Ejecuta inmediatamente
    await analyzeWallet(addr);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <TrendingUp className="h-8 w-8 text-blue-600" aria-hidden />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              UniPulse Dashboard
            </h1>
          </div>
          <p className="text-lg text-gray-600 mb-2">Analiza posiciones de Uniswap V4 en Base Network</p>
          <p className="text-sm text-blue-600 font-medium">🚀 Powered by Envío V4 API</p>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto mb-8">
            <TabsTrigger value="test" className="flex items-center gap-2">
              <TestTube className="h-4 w-4" aria-hidden />
              Test Envío V4
            </TabsTrigger>
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" aria-hidden />
              Dashboard
            </TabsTrigger>
          </TabsList>

          {/* Test Tab */}
          <TabsContent value="test" className="space-y-6">
            <EnvioTest />
          </TabsContent>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            {/* Search Bar */}
            <Card className="max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wallet className="h-5 w-5" aria-hidden />
                  Analizar Wallet
                </CardTitle>
                <CardDescription>Ingresa una dirección de Ethereum o ENS</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="flex gap-2" noValidate>
                  <label htmlFor="wallet-input" className="sr-only">
                    Dirección o ENS
                  </label>
                  <Input
                    id="wallet-input"
                    type="text"
                    placeholder="0x1234...5678 o nombre.eth"
                    value={walletInput}
                    onChange={(e) => setWalletInput(e.target.value)}
                    className="flex-1"
                    disabled={isLoading}
                    aria-invalid={!!errorMsg}
                  />
                  <Button type="submit" disabled={isLoading || !validInput.ok}>
                    {isLoading ? (
                      <div className="flex items-center gap-2" role="status" aria-live="polite">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Analizando
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Search className="h-4 w-4" aria-hidden />
                        Analizar
                      </div>
                    )}
                  </Button>
                </form>
                {(errorMsg || (!validInput.ok && walletInput)) && (
                  <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                    ⚠️ {errorMsg || validInput.error}
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Loading State */}
            {isLoading && (
              <div className="text-center py-12">
                <div
                  className="inline-block w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"
                  role="status"
                  aria-live="polite"
                />
                <p className="text-gray-600">Consultando Envío V4...</p>
                <p className="text-xs text-blue-500">Analizando posiciones en Base Network</p>
              </div>
            )}

            {/* Results */}
            {analysisData && !isLoading && (
              <div className="space-y-6">
                <PortfolioOverview
                  totalValue={analysisData.summary?.totalValueUSD ?? "$0"}
                  performance="0.00"
                  positions={analysisData.positions ?? []}
                />

                {/* Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-blue-600">{quickStats.totalPositions}</div>
                      <div className="text-sm text-gray-600">Posiciones</div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-green-600">{quickStats.activePositions}</div>
                      <div className="text-sm text-gray-600">Activas</div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-purple-600">{quickStats.totalSwaps}</div>
                      <div className="text-sm text-gray-600">Swaps</div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-yellow-600">{quickStats.totalValueUSD}</div>
                      <div className="text-sm text-gray-600">Valor Total</div>
                    </CardContent>
                  </Card>
                </div>

                {/* Positions List */}
                {analysisData.positions?.length ? (
                  <div>
                    <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                      <Activity className="h-5 w-5" aria-hidden />
                      Posiciones V4 ({analysisData.positions.length})
                    </h3>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      {analysisData.positions.map((position) => (
                        <PositionCard key={position.id} position={position} />
                      ))}
                    </div>
                  </div>
                ) : (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <Wallet className="h-12 w-12 text-gray-400 mx-auto mb-4" aria-hidden />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Wallet analizada exitosamente</h3>
                      <p className="text-gray-600 mb-4">
                        Esta wallet tiene {quickStats.totalPositions} posiciones con un valor total de {quickStats.totalValueUSD}
                      </p>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div className="bg-blue-50 p-3 rounded-lg">
                          <div className="font-bold text-blue-600">{quickStats.totalPositions}</div>
                          <div className="text-blue-800">Posiciones</div>
                        </div>
                        <div className="bg-green-50 p-3 rounded-lg">
                          <div className="font-bold text-green-600">{quickStats.activePositions}</div>
                          <div className="text-green-800">Activas</div>
                        </div>
                        <div className="bg-purple-50 p-3 rounded-lg">
                          <div className="font-bold text-purple-600">{quickStats.totalSwaps}</div>
                          <div className="text-purple-800">Swaps</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Data Source Info */}
                <Card className="border-blue-200 bg-blue-50">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-blue-800">
                        <TestTube className="h-4 w-4" aria-hidden />
                        <p className="text-sm">
                          <strong>Fuente:</strong> Envío V4 API • <strong>Wallet:</strong>{" "}
                          {analysisData.wallet?.slice(0, 6)}...{analysisData.wallet?.slice(-4)}
                        </p>
                      </div>
                      <p className="text-xs text-blue-600">{formatDate(analysisData.lastUpdated)}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Demo Section */}
            {!analysisData && !isLoading && (
              <Card className="max-w-2xl mx-auto">
                <CardHeader>
                  <CardTitle>🚀 Prueba con una wallet demo</CardTitle>
                  <CardDescription>Usa una de estas addresses para ver el dashboard en acción</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-2">
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left"
                    onClick={() => useDemo("0x44c2f0e3d035de28266653f3359217bc00aC401")}
                  >
                    0x44c2f0e3d035de28266653f3359217bc00aC401
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left"
                    onClick={() => useDemo("0x1234567890123456789012345678901234567890")}
                  >
                    0x1234567890123456789012345678901234567890 (Test)
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;