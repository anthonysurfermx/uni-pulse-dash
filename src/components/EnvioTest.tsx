// src/components/EnvioTest.tsx - Versión completa y funcional

import React, { useState, useEffect } from 'react';
import { envioAPI, formatters } from '@/config/envioV4';

const EnvioTest: React.FC = () => {
  const [status, setStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [logs, setLogs] = useState<string[]>([]);
  const [poolData, setPoolData] = useState<any[]>([]);
  const [protocolStats, setProtocolStats] = useState<any>(null);

  // Agregar log con timestamp
  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, `${timestamp}: ${message}`]);
    console.log(`[EnvioTest] ${message}`);
  };

  // Test principal con tu endpoint real
  const testConnection = async () => {
    setStatus('testing');
    setLogs([]);
    
    addLog('🚀 Starting Envío V4 connection test...');
    addLog('🔗 Connecting to: enviodev-69b6884.dedicated.hyperindex.xyz');

    try {
      // Test 1: Conexión básica
      addLog('🔄 Testing basic connection...');
      const connectionTest = await envioAPI.testConnection();
      
      if (connectionTest.success) {
        addLog('✅ Connection successful!');
        addLog(`📊 Pools found: ${connectionTest.data.pools.length}`);
        
        // Mostrar algunos pools con fees
        const poolsWithFees = connectionTest.data.pools
          .filter((pool: any) => parseFloat(pool.collectedFeesUSD) > 0)
          .slice(0, 3);
          
        if (poolsWithFees.length > 0) {
          addLog('💰 Top pools with fees:');
          poolsWithFees.forEach((pool: any, index: number) => {
            addLog(`  ${index + 1}. Pool ${pool.id.slice(-8)}: ${formatters.formatUSD(pool.collectedFeesUSD)}`);
          });
          setPoolData(poolsWithFees);
        }
        
        // Calcular stats básicas
        const totalFees = connectionTest.data.pools.reduce((sum: number, pool: any) => 
          sum + parseFloat(pool.collectedFeesUSD || 0), 0
        );
        
        setProtocolStats({
          totalPools: connectionTest.data.pools.length,
          totalFees: totalFees,
          avgFees: totalFees / connectionTest.data.pools.length
        });
        
        addLog(`💎 Total fees collected: ${formatters.formatUSD(totalFees)}`);
        
        setStatus('success');
        addLog('🎉 All tests completed successfully!');
        
      } else {
        throw new Error(connectionTest.error || 'Connection failed');
      }

    } catch (error: any) {
      addLog(`❌ Error: ${error.message}`);
      setStatus('error');
    }
  };

  // Test wallet analysis
  const testWalletAnalysis = async () => {
    const testAddress = '0x1234567890123456789012345678901234567890';
    
    addLog(`🔄 Testing wallet analysis for ${testAddress.slice(0, 8)}...`);
    
    try {
      const result = await envioAPI.analyzeWallet(testAddress);
      
      if (result.success) {
        addLog('✅ Wallet analysis successful');
        addLog(`📊 Positions: ${result.data.summary.totalPositions}`);
        addLog(`💰 Total value: ${result.data.summary.totalValueUSD}`);
        addLog(`🔄 Active positions: ${result.data.summary.activePositions}`);
      }
    } catch (error: any) {
      addLog(`❌ Wallet test error: ${error.message}`);
    }
  };

  // Auto-run test on component mount
  useEffect(() => {
    testConnection();
  }, []);

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Header with status */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">🧪 Envío V4 Connection Test</h1>
            <p className="text-blue-100 text-sm">
              Testing real Uniswap V4 data from Base Network
            </p>
          </div>
          <div className={`px-4 py-2 rounded-full text-sm font-bold ${
            status === 'success' ? 'bg-green-500 text-white' :
            status === 'error' ? 'bg-red-500 text-white' :
            status === 'testing' ? 'bg-yellow-500 text-black' :
            'bg-gray-500 text-white'
          }`}>
            {status === 'success' ? '✅ CONNECTED' :
             status === 'error' ? '❌ ERROR' :
             status === 'testing' ? '🔄 TESTING' :
             '⏳ IDLE'}
          </div>
        </div>
        
        <div className="mt-4 p-3 bg-black bg-opacity-20 rounded text-xs font-mono">
          <strong>Endpoint:</strong> enviodev-69b6884.dedicated.hyperindex.xyz/v1/graphql
        </div>
      </div>

      {/* Control buttons */}
      <div className="flex gap-4 flex-wrap">
        <button
          onClick={testConnection}
          disabled={status === 'testing'}
          className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg transition-colors flex items-center gap-2"
        >
          {status === 'testing' ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Testing...
            </>
          ) : (
            <>
              🚀 Test Connection
            </>
          )}
        </button>
        
        <button
          onClick={testWalletAnalysis}
          disabled={status === 'testing'}
          className="bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white px-6 py-2 rounded-lg transition-colors"
        >
          🔍 Test Wallet
        </button>
        
        <button
          onClick={() => setLogs([])}
          className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
        >
          🗑️ Clear Logs
        </button>
      </div>

      {/* Stats cards */}
      {protocolStats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="text-2xl font-bold text-blue-600">
              {formatters.formatNumber(protocolStats.totalPools)}
            </div>
            <div className="text-sm text-gray-600">Total Pools</div>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="text-2xl font-bold text-green-600">
              {formatters.formatUSD(protocolStats.totalFees)}
            </div>
            <div className="text-sm text-gray-600">Total Fees</div>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="text-2xl font-bold text-purple-600">
              {formatters.formatUSD(protocolStats.avgFees)}
            </div>
            <div className="text-sm text-gray-600">Avg Fees</div>
          </div>
        </div>
      )}

      {/* Pool data */}
      {poolData.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">🏊‍♂️ Top Pools</h3>
          <div className="space-y-3">
            {poolData.map((pool, index) => (
              <div key={pool.id} className="flex justify-between items-center border-b border-gray-100 pb-2">
                <div>
                  <span className="font-semibold">Pool {pool.id.slice(-8)}</span>
                  <span className="text-xs text-gray-500 ml-2">#{index + 1}</span>
                </div>
                <div className="text-right">
                  <div className="font-bold text-green-600">
                    {formatters.formatUSD(pool.collectedFeesUSD)}
                  </div>
                  <div className="text-xs text-gray-500">Fees collected</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Test logs */}
      <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm">
        <h3 className="text-white font-bold mb-3">📋 Test Logs:</h3>
        <div className="space-y-1 max-h-64 overflow-y-auto">
          {logs.length > 0 ? (
            logs.map((log, index) => (
              <div key={index} className="text-xs">
                {log}
              </div>
            ))
          ) : (
            <div className="text-gray-500">No logs yet...</div>
          )}
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h4 className="font-bold text-yellow-800 mb-2">💡 Test Results:</h4>
        <ul className="text-sm text-yellow-700 space-y-1 list-disc list-inside">
          <li>✅ Connection successful = Envío V4 is working</li>
          <li>📊 Pool data visible = GraphQL queries working</li>
          <li>💰 Fees displayed = Real Uniswap V4 data</li>
          <li>🎉 Ready to integrate into your dashboard!</li>
        </ul>
      </div>
    </div>
  );
};

export default EnvioTest;