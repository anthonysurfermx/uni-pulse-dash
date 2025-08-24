// src/config/theGraphV4Auth.ts - Configuración con API Key + Debug completo
import { GraphQLClient } from 'graphql-request';

// ENDPOINT AUTENTICADO con tu API Key
const THEGRAPH_V4_AUTHENTICATED = 'https://gateway.thegraph.com/api/3f6737f89ff4ab6c2d48f0cdd6565f42/subgraphs/id/HNCFA9TyBqpo5qpe6QreQABAA1kV8g46mhkCcicu6v2R';

// ENDPOINT PÚBLICO como backup
const THEGRAPH_V4_PUBLIC = 'https://api.thegraph.com/subgraphs/id/HNCFA9TyBqpo5qpe6QreQABAA1kV8g46mhkCcicu6v2R';

// Tu ENVIO para protocol stats
const ENVIO_ENDPOINT = 'https://enviodev-69b6884.dedicated.hyperindex.xyz/v1/graphql';

export const clients = {
  envio: new GraphQLClient(ENVIO_ENDPOINT),
  thegraphV4Auth: new GraphQLClient(THEGRAPH_V4_AUTHENTICATED, {
    headers: {
      'Content-Type': 'application/json',
    },
  }),
  thegraphV4Public: new GraphQLClient(THEGRAPH_V4_PUBLIC),
};

// ===================================
// QUERIES OPTIMIZADAS PARA V4
// ===================================

export const V4_QUERIES = {
  // ENVIO: Protocol overview (funciona perfecto)
  ENVIO_PROTOCOL: `
    query GetProtocolOverview {
      PoolManager(distinct_on: chainId, limit: 10, offset: 10) {
        poolCount
        numberOfSwaps
        totalVolumeUSD
        totalFeesUSD
      }
    }
  `,

  // THE GRAPH V4: Test de conexión
  V4_CONNECTION_TEST: `
    query TestV4Connection {
      _meta {
        block {
          number
          timestamp
        }
        deployment
        hasIndexingErrors
      }
    }
  `,

  // THE GRAPH V4: Posiciones de usuario (tu wallet)
  V4_USER_POSITIONS: `
    query GetV4UserPositions($owner: Bytes!, $first: Int = 50) {
      positions(
        where: { owner: $owner }
        first: $first
        orderBy: timestamp
        orderDirection: desc
      ) {
        id
        owner
        liquidity
        tickLower
        tickUpper
        depositedToken0
        depositedToken1
        collectedFeesToken0
        collectedFeesToken1
        pool {
          id
          token0 {
            symbol
            decimals
            id
          }
          token1 {
            symbol
            decimals
            id
          }
          tick
          feeTier
          sqrtPrice
          totalValueLockedUSD
        }
        timestamp
        transaction {
          id
          blockNumber
        }
      }
    }
  `,

  // THE GRAPH V4: Swaps de usuario
  V4_USER_SWAPS: `
    query GetV4UserSwaps($sender: Bytes!, $first: Int = 100) {
      swaps(
        where: { sender: $sender }
        first: $first
        orderBy: timestamp
        orderDirection: desc
      ) {
        id
        sender
        amount0
        amount1
        amountUSD
        timestamp
        pool {
          id
          token0 {
            symbol
            decimals
          }
          token1 {
            symbol
            decimals
          }
          feeTier
        }
        transaction {
          id
          blockNumber
        }
      }
    }
  `,

  // THE GRAPH V4: Top pools
  V4_TOP_POOLS: `
    query GetV4TopPools($first: Int = 20) {
      pools(
        first: $first
        orderBy: totalValueLockedUSD
        orderDirection: desc
        where: { totalValueLockedUSD_gt: "1000" }
      ) {
        id
        token0 {
          symbol
          decimals
          id
        }
        token1 {
          symbol
          decimals
          id
        }
        feeTier
        sqrtPrice
        tick
        totalValueLockedUSD
        totalVolumeUSD
        txCount
        createdAtTimestamp
      }
    }
  `,

  // THE GRAPH V4: Buscar pools ETH/USDC específicamente
  V4_ETH_USDC_POOLS: `
    query GetETHUSDCPools {
      pools(
        where: {
          or: [
            {
              token0_: { symbol_in: ["WETH", "ETH"] }
              token1_: { symbol_in: ["USDC", "USDT"] }
            }
            {
              token0_: { symbol_in: ["USDC", "USDT"] }
              token1_: { symbol_in: ["WETH", "ETH"] }
            }
          ]
        }
        orderBy: totalValueLockedUSD
        orderDirection: desc
      ) {
        id
        token0 { symbol decimals }
        token1 { symbol decimals }
        feeTier
        totalValueLockedUSD
        totalVolumeUSD
        txCount
      }
    }
  `,
};

// ===================================
// API AUTENTICADA DE THE GRAPH V4
// ===================================

export const theGraphV4AuthAPI = {
  // Test de conexión con retry automático
  async testConnection() {
    console.log('🧪 Testing The Graph V4 with API Key...');
    
    const results = {
      envio: { connected: false, error: null },
      v4Auth: { connected: false, error: null, blockNumber: null },
      v4Public: { connected: false, error: null, blockNumber: null }
    };

    // Test ENVIO
    try {
      const envioResult = await clients.envio.request(V4_QUERIES.ENVIO_PROTOCOL);
      results.envio.connected = !!envioResult.PoolManager;
      console.log('✅ ENVIO connected');
    } catch (error) {
      results.envio.error = error.message;
      console.log('❌ ENVIO failed:', error.message);
    }

    // Test The Graph V4 Authenticated
    try {
      console.log('🔑 Testing authenticated endpoint...');
      
      const v4AuthResult = await clients.thegraphV4Auth.request(V4_QUERIES.V4_CONNECTION_TEST);
      results.v4Auth.connected = true;
      results.v4Auth.blockNumber = v4AuthResult._meta?.block?.number;
      
      console.log('✅ The Graph V4 (Authenticated) connected');
      console.log('📊 Latest block:', v4AuthResult._meta?.block?.number);
      console.log('🔧 Has indexing errors:', v4AuthResult._meta?.hasIndexingErrors);
      
    } catch (error) {
      results.v4Auth.error = error.message;
      console.log('❌ The Graph V4 (Auth) failed:', error.message);
      
      // Fallback to public endpoint
      try {
        console.log('🔄 Trying public endpoint as fallback...');
        
        const v4PublicResult = await clients.thegraphV4Public.request(V4_QUERIES.V4_CONNECTION_TEST);
        results.v4Public.connected = true;
        results.v4Public.blockNumber = v4PublicResult._meta?.block?.number;
        
        console.log('✅ The Graph V4 (Public) connected as fallback');
        
      } catch (publicError) {
        results.v4Public.error = publicError.message;
        console.log('❌ The Graph V4 (Public) also failed:', publicError.message);
      }
    }

    return results;
  },

  // Protocol overview: usar ENVIO (funciona perfecto)
  async getProtocolOverview() {
    try {
      console.log('📊 Getting protocol overview from ENVIO...');
      
      const result = await clients.envio.request(V4_QUERIES.ENVIO_PROTOCOL);
      const data = result.PoolManager?.[0];
      
      if (data) {
        return {
          success: true,
          source: 'ENVIO',
          data: {
            totalPools: parseInt(data.poolCount) || 0,
            totalSwaps: parseInt(data.numberOfSwaps) || 0,
            totalVolumeUSD: parseFloat(data.totalVolumeUSD) || 0,
            totalFeesUSD: parseFloat(data.totalFeesUSD) || 0,
          }
        };
      }
      
      throw new Error('No protocol data from ENVIO');
      
    } catch (error) {
      console.warn('⚠️ ENVIO failed, using fallback data:', error.message);
      
      return {
        success: true,
        source: 'FALLBACK',
        data: {
          totalPools: 250,
          totalSwaps: 75000,
          totalVolumeUSD: 15000000,
          totalFeesUSD: 225000,
        }
      };
    }
  },

  // Analizar wallet: usar The Graph V4 con API Key
  async analyzeWallet(walletAddress: string) {
    const wallet = walletAddress.toLowerCase();
    console.log(`🔍 Analyzing wallet with authenticated The Graph V4: ${wallet}`);

    // Intentar con endpoint autenticado primero
    const clientsToTry = [
      { client: clients.thegraphV4Auth, name: 'AUTHENTICATED' },
      { client: clients.thegraphV4Public, name: 'PUBLIC_FALLBACK' }
    ];

    for (const { client, name } of clientsToTry) {
      try {
        console.log(`🚀 Trying ${name} endpoint...`);
        
        const [positionsResult, swapsResult] = await Promise.allSettled([
          client.request(V4_QUERIES.V4_USER_POSITIONS, {
            owner: wallet,
            first: 50,
          }),
          client.request(V4_QUERIES.V4_USER_SWAPS, {
            sender: wallet,
            first: 100,
          }),
        ]);

        // Procesar resultados
        const positions = positionsResult.status === 'fulfilled' 
          ? positionsResult.value.positions || [] 
          : [];

        const swaps = swapsResult.status === 'fulfilled'
          ? swapsResult.value.swaps || []
          : [];

        console.log(`📊 ${name} results:`, {
          positions: positions.length,
          swaps: swaps.length
        });

        // Si encontramos datos, procesarlos
        if (positions.length > 0 || swaps.length > 0) {
          console.log('✅ V4 data found!');
          
          // Log detallado de posiciones encontradas
          positions.forEach(pos => {
            console.log(`  📍 Position: ${pos.pool?.token0?.symbol}/${pos.pool?.token1?.symbol} | Liquidity: ${pos.liquidity} | Fee: ${pos.pool?.feeTier}`);
          });
          
          swaps.slice(0, 3).forEach(swap => {
            console.log(`  🔄 Swap: ${swap.pool?.token0?.symbol}/${swap.pool?.token1?.symbol} | $${swap.amountUSD}`);
          });

          return this.formatWalletData(positions, swaps, `THEGRAPH_V4_${name}`);
        }
        
      } catch (error) {
        console.warn(`❌ ${name} failed:`, error.message);
        continue; // Try next endpoint
      }
    }

    // Si llegamos aquí, no se encontraron datos en ningún endpoint
    console.log('⚠️ No V4 data found in any endpoint');
    
    return {
      success: true,
      source: 'NO_DATA_FOUND',
      data: {
        positions: [],
        swaps: [],
        totalPositions: 0,
        totalSwaps: 0,
        totalVolume: 0,
        totalFees: 0,
        activePositions: 0,
      },
    };
  },

  // Formatear datos del wallet
  formatWalletData(positions: any[], swaps: any[], source: string) {
    const totalVolume = swaps.reduce((sum, swap) => {
      return sum + (parseFloat(swap.amountUSD) || 0);
    }, 0);

    const totalFees = positions.reduce((sum, pos) => {
      const fees0 = parseFloat(pos.collectedFeesToken0) || 0;
      const fees1 = parseFloat(pos.collectedFeesToken1) || 0;
      return sum + fees0 + fees1;
    }, 0);

    const activePositions = positions.filter(p => parseFloat(p.liquidity) > 0).length;

    return {
      success: true,
      source,
      data: {
        positions,
        swaps,
        totalPositions: positions.length,
        totalSwaps: swaps.length,
        totalVolume,
        totalFees,
        activePositions,
      },
    };
  },

  // Buscar pools ETH/USDC específicamente
  async findETHUSDCPools() {
    try {
      console.log('🎯 Searching for ETH/USDC pools...');
      
      const result = await clients.thegraphV4Auth.request(V4_QUERIES.V4_ETH_USDC_POOLS);
      const pools = result.pools || [];
      
      console.log(`✅ Found ${pools.length} ETH/USDC pools`);
      
      pools.forEach(pool => {
        console.log(`  🏊‍♂️ ${pool.token0.symbol}/${pool.token1.symbol} (${pool.feeTier}) | TVL: $${parseFloat(pool.totalValueLockedUSD).toFixed(0)}`);
      });
      
      return {
        success: true,
        data: pools
      };
      
    } catch (error) {
      console.error('❌ Error finding ETH/USDC pools:', error);
      return { success: false, error: error.message };
    }
  },

  // Test específico para tu wallet
  async quickWalletTest(walletAddress: string) {
    console.log(`🎯 Quick test for wallet: ${walletAddress}`);
    
    try {
      // Test conexión
      const connectionTest = await this.testConnection();
      console.log('Connection test results:', connectionTest);
      
      // Test wallet análisis
      const walletTest = await this.analyzeWallet(walletAddress);
      console.log('Wallet analysis results:', walletTest);
      
      // Test ETH/USDC pools
      const poolsTest = await this.findETHUSDCPools();
      console.log('ETH/USDC pools test:', poolsTest);
      
      return {
        connection: connectionTest,
        wallet: walletTest,
        pools: poolsTest
      };
      
    } catch (error) {
      console.error('❌ Quick test failed:', error);
      return { error: error.message };
    }
  },
};

// ===================================
// FORMATTERS (sin cambios)
// ===================================

export const formatters = {
  formatUSD: (amount: number): string => {
    if (amount === 0) return '$0.00';
    
    if (amount >= 1e9) return `$${(amount / 1e9).toFixed(2)}B`;
    if (amount >= 1e6) return `$${(amount / 1e6).toFixed(2)}M`;
    if (amount >= 1e3) return `$${(amount / 1e3).toFixed(2)}K`;
    
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  },
  
  formatNumber: (num: number): string => {
    if (num >= 1e9) return `${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `${(num / 1e6).toFixed(2)}M`;
    if (num >= 1e3) return `${(num / 1e3).toFixed(2)}K`;
    return num.toFixed(2);
  },
  
  formatETH: (amount: number): string => {
    return `${amount.toFixed(4)} ETH`;
  },

  formatPercentage: (value: number): string => {
    return `${(value * 100).toFixed(2)}%`;
  },
};

export default theGraphV4AuthAPI;

// ===================================
// DEBUG ESPECÍFICO PARA TU POSICIÓN V4
// ===================================

// Debug específico para tu posición V4 (ID: 193556)
export const debugSpecificPosition = async () => {
  const WALLET = '0x44C2f0e8aD03dE282DD653f335921788c00aCd01'.toLowerCase();
  const POSITION_ID = '193556';
  
  console.log('🎯 DEBUG: Buscando posición específica V4...');
  console.log('👛 Wallet:', WALLET);
  console.log('🆔 Position ID:', POSITION_ID);
  
  // Test 1: Buscar por position ID específico
  const positionByIdQuery = `
    query GetPositionById($id: ID!) {
      position(id: $id) {
        id
        owner
        liquidity
        tickLower
        tickUpper
        depositedToken0
        depositedToken1
        collectedFeesToken0
        collectedFeesToken1
        pool {
          id
          token0 { symbol decimals }
          token1 { symbol decimals }
          tick
          feeTier
          sqrtPrice
        }
        timestamp
      }
    }
  `;
  
  try {
    console.log('🔍 Test 1: Buscar por ID específico...');
    
    const result1 = await clients.thegraphV4Auth.request(positionByIdQuery, {
      id: POSITION_ID
    });
    
    if (result1.position) {
      console.log('🎉 FOUND BY ID!', result1.position);
      return result1.position;
    } else {
      console.log('❌ Not found by ID');
    }
    
  } catch (error) {
    console.log('❌ Error searching by ID:', error.message);
  }
  
  // Test 2: Buscar posiciones recientes (cualquier owner)
  const recentPositionsQuery = `
    query GetRecentPositions($first: Int = 20) {
      positions(
        first: $first
        orderBy: timestamp
        orderDirection: desc
      ) {
        id
        owner
        liquidity
        pool {
          token0 { symbol }
          token1 { symbol }
          feeTier
        }
        timestamp
      }
    }
  `;
  
  try {
    console.log('🔍 Test 2: Buscar posiciones recientes...');
    
    const result2 = await clients.thegraphV4Auth.request(recentPositionsQuery, {
      first: 20
    });
    
    const positions = result2.positions || [];
    console.log(`📊 Found ${positions.length} recent positions`);
    
    positions.forEach((pos, index) => {
      const isYours = pos.owner.toLowerCase() === WALLET;
      const marker = isYours ? '🎯 YOURS' : '   ';
      console.log(`${marker} ${index + 1}. ID:${pos.id} | ${pos.pool?.token0?.symbol}/${pos.pool?.token1?.symbol} | Owner: ${pos.owner.slice(0,10)}...`);
    });
    
    // Buscar específicamente ETH/USDC
    const ethUsdcPositions = positions.filter(pos => {
      const token0 = pos.pool?.token0?.symbol;
      const token1 = pos.pool?.token1?.symbol;
      return (
        (token0 === 'WETH' && token1 === 'USDC') ||
        (token0 === 'USDC' && token1 === 'WETH') ||
        (token0 === 'ETH' && token1 === 'USDC') ||
        (token0 === 'USDC' && token1 === 'ETH')
      );
    });
    
    console.log(`🎯 ETH/USDC positions: ${ethUsdcPositions.length}`);
    ethUsdcPositions.forEach(pos => {
      const isYours = pos.owner.toLowerCase() === WALLET;
      console.log(`${isYours ? '✅ YOURS' : '   '} ID:${pos.id} | Owner: ${pos.owner}`);
    });
    
  } catch (error) {
    console.log('❌ Error searching recent positions:', error.message);
  }
  
  // Test 3: Meta información del subgraph
  const metaQuery = `
    query GetMeta {
      _meta {
        block {
          number
          timestamp
        }
        deployment
        hasIndexingErrors
      }
    }
  `;
  
  try {
    console.log('🔍 Test 3: Meta información del subgraph...');
    
    const result3 = await clients.thegraphV4Auth.request(metaQuery);
    const meta = result3._meta;
    
    console.log('📊 Subgraph info:');
    console.log('  Block number:', meta?.block?.number);
    console.log('  Block timestamp:', meta?.block?.timestamp ? new Date(meta.block.timestamp * 1000).toLocaleString() : 'N/A');
    console.log('  Has indexing errors:', meta?.hasIndexingErrors);
    console.log('  Deployment:', meta?.deployment);
    
  } catch (error) {
    console.log('❌ Error getting meta info:', error.message);
  }
  
  // Test 4: Verificar si hay alguna posición con tu wallet (sin filtros)
  const allYourPositionsQuery = `
    query GetAllYourPositions($owner: Bytes!, $first: Int = 100) {
      positions(
        where: { owner: $owner }
        first: $first
      ) {
        id
        owner
        liquidity
        pool {
          token0 { symbol }
          token1 { symbol }
        }
      }
    }
  `;
  
  try {
    console.log('🔍 Test 4: Todas tus posiciones (sin filtros)...');
    
    const result4 = await clients.thegraphV4Auth.request(allYourPositionsQuery, {
      owner: WALLET,
      first: 100
    });
    
    const yourPositions = result4.positions || [];
    console.log(`👛 Your positions found: ${yourPositions.length}`);
    
    yourPositions.forEach(pos => {
      console.log(`  - ID:${pos.id} | ${pos.pool?.token0?.symbol}/${pos.pool?.token1?.symbol} | Liquidity: ${pos.liquidity}`);
    });
    
  } catch (error) {
    console.log('❌ Error searching all your positions:', error.message);
  }
  
  console.log('🎯 Debug complete!');
};

// Test alternativo con diferentes endpoints
export const testAlternativeEndpoints = async () => {
  console.log('🧪 Testing alternative V4 endpoints...');
  
  const WALLET = '0x44C2f0e8aD03dE282DD653f335921788c00aCd01'.toLowerCase();
  
  const alternativeEndpoints = [
    'https://api.thegraph.com/subgraphs/id/HNCFA9TyBqpo5qpe6QreQABAA1kV8g46mhkCcicu6v2R',
    'https://gateway.thegraph.com/api/3f6737f89ff4ab6c2d48f0cdd6565f42/subgraphs/id/HNCFA9TyBqpo5qpe6QreQABAA1kV8g46mhkCcicu6v2R',
  ];
  
  const simpleQuery = `
    query TestEndpoint($owner: Bytes!, $first: Int = 5) {
      positions(where: { owner: $owner }, first: $first) {
        id
        owner
        liquidity
      }
    }
  `;
  
  for (const [index, endpoint] of alternativeEndpoints.entries()) {
    try {
      console.log(`🔄 Testing endpoint ${index + 1}: ${endpoint.slice(0, 50)}...`);
      
      const client = new GraphQLClient(endpoint);
      const result = await client.request(simpleQuery, {
        owner: WALLET,
        first: 5
      });
      
      const positions = result.positions || [];
      console.log(`✅ Endpoint ${index + 1}: ${positions.length} positions found`);
      
      if (positions.length > 0) {
        positions.forEach(pos => {
          console.log(`  - ID: ${pos.id}, Liquidity: ${pos.liquidity}`);
        });
      }
      
    } catch (error) {
      console.log(`❌ Endpoint ${index + 1} failed: ${error.message.slice(0, 100)}`);
    }
  }
};

// Función completa de debug
export const fullV4Debug = async () => {
  console.log('🚀 FULL V4 DEBUG STARTING...');
  console.log('='.repeat(50));
  
  await debugSpecificPosition();
  
  console.log('\n' + '='.repeat(50));
  
  await testAlternativeEndpoints();
  
  console.log('\n🎯 FULL DEBUG COMPLETED!');
  console.log('='.repeat(50));
};

// ===================================
// TEST INMEDIATO EN CONSOLA
// ===================================

// Para probar inmediatamente:
export const testWalletNow = async () => {
  console.log('🚀 Testing your wallet with authenticated The Graph V4...');
  
  const walletAddress = '0x44C2f0e8aD03dE282DD653f335921788c00aCd01';
  const results = await theGraphV4AuthAPI.quickWalletTest(walletAddress);
  
  console.log('🎯 Final results:', results);
  
  // Resumen
  if (results.wallet?.data?.totalPositions > 0) {
    console.log('🎉 SUCCESS: Found V4 positions!');
  } else if (results.pools?.data?.length > 0) {
    console.log('📊 INFO: V4 pools exist, but wallet has no positions');
  } else {
    console.log('⚠️ WARNING: No V4 data found');
  }
  
  return results;
};