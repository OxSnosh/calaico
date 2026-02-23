import { NextRequest, NextResponse } from 'next/server';

// Polymarket Default Address
const POLYMARKET_DEFAULT_ADDRESS = '0x259689a1594081a808a9bc7300c2a0fac7fc56d0';

// Cache for 5 minutes
const CACHE_DURATION = 5 * 60 * 1000;
// Cache top 100 tokens for 1 hour (they don't change that frequently)
const TOP_TOKENS_CACHE_DURATION = 60 * 60 * 1000;
const cache = new Map<string, { data: any; timestamp: number }>();
const priceCache = new Map<string, { price: number; timestamp: number }>();
const topTokensCache = new Map<string, { tokens: Set<string>; timestamp: number }>();

// EVM Chain RPC Endpoints
const EVM_CHAIN_CONFIGS: Record<string, { rpc: string[]; explorer: string; name: string }> = {
  ethereum: {
    rpc: ['https://eth.llamarpc.com', 'https://rpc.ankr.com/eth', 'https://ethereum.publicnode.com'],
    explorer: 'https://eth.blockscout.com/api',
    name: 'Ethereum',
  },
  base: {
    rpc: ['https://mainnet.base.org', 'https://base.llamarpc.com', 'https://base.publicnode.com'],
    explorer: 'https://base.blockscout.com/api',
    name: 'Base',
  },
  arbitrum: {
    rpc: ['https://arb1.arbitrum.io/rpc', 'https://arbitrum.llamarpc.com', 'https://arbitrum-one.publicnode.com'],
    explorer: 'https://arbitrum.blockscout.com/api',
    name: 'Arbitrum',
  },
  optimism: {
    rpc: ['https://mainnet.optimism.io', 'https://optimism.llamarpc.com', 'https://optimism.publicnode.com'],
    explorer: 'https://optimism.blockscout.com/api',
    name: 'Optimism',
  },
  polygon: {
    rpc: ['https://polygon-bor.publicnode.com', 'https://polygon.drpc.org', 'https://polygon-rpc.com'],
    explorer: 'https://polygon.blockscout.com/api',
    name: 'Polygon',
  },
  bsc: {
    rpc: ['https://bsc.publicnode.com', 'https://bsc-dataseed.binance.org', 'https://bsc.drpc.org'],
    explorer: 'https://bscscan.com/api',
    name: 'BNB Chain',
  },
  avalanche: {
    rpc: ['https://avalanche.publicnode.com', 'https://api.avax.network/ext/bc/C/rpc', 'https://avalanche.drpc.org'],
    explorer: 'https://snowscan.xyz/api',
    name: 'Avalanche',
  },
  fantom: {
    rpc: ['https://fantom.publicnode.com', 'https://rpc.ftm.tools', 'https://fantom.drpc.org'],
    explorer: 'https://api.ftmscan.com/api',
    name: 'Fantom',
  },
  gnosis: {
    rpc: ['https://gnosis.publicnode.com', 'https://rpc.gnosischain.com', 'https://gnosis.drpc.org'],
    explorer: 'https://gnosis.blockscout.com/api',
    name: 'Gnosis',
  },
  celo: {
    rpc: ['https://celo.publicnode.com', 'https://forno.celo.org', 'https://rpc.ankr.com/celo'],
    explorer: 'https://celo.blockscout.com/api',
    name: 'Celo',
  },
  moonbeam: {
    rpc: ['https://moonbeam.publicnode.com', 'https://rpc.api.moonbeam.network', 'https://moonbeam.drpc.org'],
    explorer: 'https://api-moonbeam.moonscan.io/api',
    name: 'Moonbeam',
  },
  cronos: {
    rpc: ['https://cronos.publicnode.com', 'https://evm.cronos.org', 'https://cronos.drpc.org'],
    explorer: 'https://api.cronoscan.com/api',
    name: 'Cronos',
  },
  zksync: {
    rpc: ['https://mainnet.era.zksync.io', 'https://zksync.drpc.org', 'https://zksync-era.blockpi.network/v1/rpc/public'],
    explorer: 'https://zksync.blockscout.com/api',
    name: 'zkSync Era',
  },
  linea: {
    rpc: ['https://rpc.linea.build', 'https://linea.drpc.org', 'https://linea.blockpi.network/v1/rpc/public'],
    explorer: 'https://linea.blockscout.com/api',
    name: 'Linea',
  },
  scroll: {
    rpc: ['https://rpc.scroll.io', 'https://scroll.drpc.org', 'https://scroll.blockpi.network/v1/rpc/public'],
    explorer: 'https://scroll.blockscout.com/api',
    name: 'Scroll',
  },
  mantle: {
    rpc: ['https://rpc.mantle.xyz', 'https://mantle.drpc.org', 'https://mantle.publicnode.com'],
    explorer: 'https://mantle.blockscout.com/api',
    name: 'Mantle',
  },
};

// Token symbol mapping for CoinMarketCap
const TOKEN_SYMBOLS: Record<string, string> = {
  'ETH': 'ETH',
  'POL': 'MATIC',
  'MATIC': 'MATIC',
  'BNB': 'BNB', 
  'AVAX': 'AVAX',
  'FTM': 'FTM',
  'XDAI': 'XDAI',
  'CELO': 'CELO',
  'GLMR': 'GLMR',
  'CRO': 'CRO',
  'MNT': 'MNT',
  'USDT': 'USDT',
  'USDC': 'USDC',
  'WETH': 'WETH',
  'WBTC': 'WBTC',
  'DAI': 'DAI',
  'SOL': 'SOL',
  'KNC': 'KNC',
  'UNI': 'UNI',
  'LINK': 'LINK',
  'AAVE': 'AAVE',
  'MKR': 'MKR',
  'SNX': 'SNX',
  'COMP': 'COMP',
  'CRV': 'CRV',
  'SUSHI': 'SUSHI',
  'YFI': 'YFI',
  'BAL': 'BAL',
  'BTC': 'BTC',
};

const CMC_API_KEY = process.env.COIN_MKTCAP_API_KEY || '';

// Native token symbols and CoinMarketCap IDs for each chain
const NATIVE_TOKENS: Record<string, { symbol: string; cmcSymbol: string }> = {
  ethereum: { symbol: 'ETH', cmcSymbol: 'ETH' },
  base: { symbol: 'ETH', cmcSymbol: 'ETH' },
  arbitrum: { symbol: 'ETH', cmcSymbol: 'ETH' },
  optimism: { symbol: 'ETH', cmcSymbol: 'ETH' },
  polygon: { symbol: 'POL', cmcSymbol: 'MATIC' },
  bsc: { symbol: 'BNB', cmcSymbol: 'BNB' },
  avalanche: { symbol: 'AVAX', cmcSymbol: 'AVAX' },
  fantom: { symbol: 'FTM', cmcSymbol: 'FTM' },
  gnosis: { symbol: 'xDAI', cmcSymbol: 'XDAI' },
  celo: { symbol: 'CELO', cmcSymbol: 'CELO' },
  moonbeam: { symbol: 'GLMR', cmcSymbol: 'GLMR' },
  cronos: { symbol: 'CRO', cmcSymbol: 'CRO' },
  zksync: { symbol: 'ETH', cmcSymbol: 'ETH' },
  linea: { symbol: 'ETH', cmcSymbol: 'ETH' },
  scroll: { symbol: 'ETH', cmcSymbol: 'ETH' },
  mantle: { symbol: 'MNT', cmcSymbol: 'MNT' },
};

// CoinMarketCap platform IDs for different chains
const CMC_PLATFORM_IDS: Record<string, number> = {
  ethereum: 1027,    // ETH
  base: 21910,       // BASE
  arbitrum: 11841,   // ARB
  optimism: 11840,   // OP
  polygon: 3890,     // MATIC
  bsc: 1839,         // BNB
  avalanche: 5805,   // AVAX
  fantom: 3513,      // FTM
  gnosis: 1659,      // GNO
  celo: 5567,        // CELO
  moonbeam: 6836,    // GLMR
  cronos: 3635,      // CRO
  zksync: 24091,     // ZK (zkSync Era)
  linea: 27657,      // Linea
  scroll: 26998,     // Scroll
  mantle: 27075,     // MNT
};

// Fetch top 100 tokens by market cap for a specific chain
async function fetchTop100TokensForChain(chainId: string): Promise<Set<string>> {
  if (!CMC_API_KEY) return new Set();

  // Check cache
  const cached = topTokensCache.get(chainId);
  if (cached && Date.now() - cached.timestamp < TOP_TOKENS_CACHE_DURATION) {
    return cached.tokens;
  }

  try {
    // Fetch top cryptocurrencies filtered by platform
    const platformId = CMC_PLATFORM_IDS[chainId];
    if (!platformId) {
      console.log(`No CoinMarketCap platform ID for chain: ${chainId}`);
      return new Set();
    }

    const response = await fetch(
      `https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?start=1&limit=200&convert=USD`,
      { 
        headers: { 
          'Accept': 'application/json',
          'X-CMC_PRO_API_KEY': CMC_API_KEY
        } 
      }
    );

    const data = await response.json();
    const topTokenAddresses = new Set<string>();

    // Extract contract addresses for the specified platform
    if (data.data && Array.isArray(data.data)) {
      for (const token of data.data) {
        if (token.platform && token.platform.token_address) {
          // Check if token is on the specified platform
          if (token.platform.id === platformId) {
            topTokenAddresses.add(token.platform.token_address.toLowerCase());
          }
        }
      }
    }

    // Cache the result
    topTokensCache.set(chainId, { tokens: topTokenAddresses, timestamp: Date.now() });
    console.log(`Fetched ${topTokenAddresses.size} top tokens for ${chainId}`);
    return topTokenAddresses;
  } catch (error) {
    console.error(`Error fetching top 100 tokens for ${chainId}:`, error);
    return new Set();
  }
}

// Fetch token price from CoinMarketCap API by symbol
async function fetchTokenPrice(symbol: string): Promise<number> {
  const cmcSymbol = TOKEN_SYMBOLS[symbol];
  if (!cmcSymbol || !CMC_API_KEY) return 0;

  // Check price cache (5 minute cache)
  const cached = priceCache.get(symbol);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.price;
  }

  try {
    const response = await fetch(
      `https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=${cmcSymbol}&convert=USD`,
      { 
        headers: { 
          'Accept': 'application/json',
          'X-CMC_PRO_API_KEY': CMC_API_KEY
        } 
      }
    );
    const data = await response.json();
    const price = data.data?.[cmcSymbol]?.quote?.USD?.price || 0;
    
    // Cache the price
    priceCache.set(symbol, { price, timestamp: Date.now() });
    return price;
  } catch (error) {
    console.error(`Error fetching price for ${symbol}:`, error);
    return 0;
  }
}

// Fetch token price by contract address from CoinMarketCap
async function fetchTokenPriceByAddress(contractAddress: string): Promise<number> {
  const cacheKey = `addr_${contractAddress.toLowerCase()}`;
  
  if (!CMC_API_KEY) return 0;
  
  // Check price cache (5 minute cache)
  const cached = priceCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.price;
  }

  try {
    const response = await fetch(
      `https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/latest?address=${contractAddress}&convert=USD`,
      { 
        headers: { 
          'Accept': 'application/json',
          'X-CMC_PRO_API_KEY': CMC_API_KEY
        } 
      }
    );
    const data = await response.json();
    
    // CMC returns data with contract address as key in v2 API
    const tokenData = data.data?.[contractAddress.toLowerCase()];
    if (!tokenData) {
      // If no data found, return 0
      return 0;
    }
    
    const price = tokenData?.[0]?.quote?.USD?.price || 0;
    
    // Cache the price
    priceCache.set(cacheKey, { price, timestamp: Date.now() });
    return price;
  } catch (error) {
    console.error(`Error fetching price for contract ${contractAddress}:`, error);
    return 0;
  }
}

function detectChain(address: string, chainParam?: string): 'ETH' | 'BTC' | 'SOL' | 'UNKNOWN' {
  // Ethereum/EVM: 0x followed by 40 hex characters
  if (/^0x[a-fA-F0-9]{40}$/.test(address)) {
    // For EVM addresses, we treat them all as 'ETH' but use chainParam to determine actual chain
    return 'ETH';
  }
  
  // Bitcoin: various formats
  if (/^(1|3|bc1)[a-zA-Z0-9]{25,62}$/.test(address)) {
    return 'BTC';
  }
  
  // Solana: base58, typically 32-44 characters
  if (/^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address)) {
    return 'SOL';
  }
  
  return 'UNKNOWN';
}

async function fetchEthereumAssets(address: string, chainId: string = 'ethereum') {
  // Get chain configuration
  const chainConfig = EVM_CHAIN_CONFIGS[chainId] || EVM_CHAIN_CONFIGS.ethereum;
  const RPC_ENDPOINTS = chainConfig.rpc;
  
  let nativeBalance: any = null;
  let tokens: any[] = [];
  
  // Fetch native balance with retry logic (separate try-catch)
  try {
    let balanceData: any = null;
    let ethBalance = 0;
    
    // Try each RPC endpoint until one works
    for (const rpcUrl of RPC_ENDPOINTS) {
      try {
        const balanceResponse = await fetch(
          rpcUrl,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              jsonrpc: '2.0',
              id: 1,
              method: 'eth_getBalance',
              params: [address, 'latest'],
            }),
          }
        );
        
        if (!balanceResponse.ok) {
          continue; // Try next RPC endpoint
        }
        
        balanceData = await balanceResponse.json();
        if (balanceData.error) {
          console.log(`RPC error from ${rpcUrl}:`, balanceData.error);
          continue; // Try next RPC endpoint
        }
        
        ethBalance = parseInt(balanceData.result || '0', 16);
        break; // Success, exit loop
      } catch (error) {
        console.log(`RPC ${rpcUrl} failed:`, error);
        continue; // Try next RPC endpoint
      }
    }
    
    if (balanceData && !balanceData.error) {
      // Calculate native balance with pricing
      const nativeToken = NATIVE_TOKENS[chainId] || NATIVE_TOKENS.ethereum;
      const nativePrice = await fetchTokenPrice(nativeToken.cmcSymbol);
      const nativeBalanceNum = Number(ethBalance) / Math.pow(10, 18);
      const nativeMarketValue = nativeBalanceNum * nativePrice;
      
      nativeBalance = {
        symbol: nativeToken.symbol,
        balance: ethBalance.toString(),
        decimals: 18,
        price: nativePrice,
        marketValue: nativeMarketValue,
        isNative: true,
      };
    }
  } catch (error) {
    console.error(`Error fetching native balance for ${chainConfig.name}:`, error);
  }
  
  // Fetch tokens (separate try-catch so native balance can still work)
  try {
    const tokenResponse = await fetch(
        `${chainConfig.explorer}?module=account&action=tokenlist&address=${address}`,
        {
          headers: {
            'Accept': 'application/json',
          },
        }
      );
      
      const tokenData = await tokenResponse.json();
      
      // Fetch top 100 tokens for this chain
      const top100Tokens = await fetchTop100TokensForChain(chainId);
      
      if (tokenData.status === '1' && Array.isArray(tokenData.result)) {
        tokens = tokenData.result
          .filter((token: any) => {
            // Only include tokens with balance > 0
            if (!token.balance || BigInt(token.balance) <= 0) return false;
            
            // Only include tokens in top 100 by market cap (if we have the list)
            if (top100Tokens.size > 0) {
              return top100Tokens.has(token.contractAddress.toLowerCase());
            }
            
            // If we couldn't fetch top 100 list, include all tokens
            return true;
          })
          .map((token: any) => ({
            contractAddress: token.contractAddress,
            symbol: token.symbol || 'UNKNOWN',
            balance: token.balance,
            decimals: parseInt(token.decimals || '18'),
            name: token.name,
          }));
      }
    } catch (error) {
      console.error('Error fetching token list from Blockscout:', error);
      
      // Fallback to checking common tokens if Blockscout fails
      const commonTokens = [
        { address: '0xdac17f958d2ee523a2206206994597c13d831ec7', symbol: 'USDT', decimals: 6 },
        { address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', symbol: 'USDC', decimals: 6 },
        { address: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2', symbol: 'WETH', decimals: 18 },
        { address: '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599', symbol: 'WBTC', decimals: 8 },
        { address: '0x6b175474e89094c44da98b954eedeac495271d0f', symbol: 'DAI', decimals: 18 },
        { address: '0xdefa4e8a7bcba345f687a2f1456f5edd9ce97202', symbol: 'KNC', decimals: 18 },
        { address: '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984', symbol: 'UNI', decimals: 18 },
        { address: '0x514910771af9ca656af840dff83e8264ecf986ca', symbol: 'LINK', decimals: 18 },
        { address: '0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9', symbol: 'AAVE', decimals: 18 },
        { address: '0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2', symbol: 'MKR', decimals: 18 },
      ];
      
      const tokenPromises = commonTokens.map(async (token) => {
        // Try each RPC endpoint for token balance
        for (const rpcUrl of RPC_ENDPOINTS) {
          try {
            const response = await fetch(rpcUrl, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                jsonrpc: '2.0',
                id: 1,
                method: 'eth_call',
                params: [{
                  to: token.address,
                  data: `0x70a08231000000000000000000000000${address.slice(2)}`, // balanceOf(address)
                }, 'latest'],
              }),
            });
            
            if (!response.ok) continue;
            
            const data = await response.json();
            if (data.error) continue;
            
            const balance = data.result ? parseInt(data.result, 16).toString() : '0';
            return {
              contractAddress: token.address,
              symbol: token.symbol,
              balance,
              decimals: token.decimals,
            };
          } catch {
            continue; // Try next RPC endpoint
          }
        }
        return null; // All endpoints failed
      });
      
      tokens = (await Promise.all(tokenPromises))
        .filter((token): token is NonNullable<typeof token> => token !== null && BigInt(token.balance) > 0);
    }
  
  // Calculate market values for tokens
  const tokensWithValue = await Promise.all(
    tokens.map(async (token) => {
      // Try to fetch price by contract address first, fallback to symbol
      let price = await fetchTokenPriceByAddress(token.contractAddress);
      if (price === 0) {
        price = await fetchTokenPrice(token.symbol);
      }
      const balanceNum = Number(token.balance) / Math.pow(10, token.decimals);
      const marketValue = balanceNum * price;
      return {
        ...token,
        price,
        marketValue,
      };
    })
  );

  // Combine native balance with tokens
  const allAssets = [
    ...(nativeBalance ? [nativeBalance] : []),
    ...tokensWithValue.map(t => ({ ...t, isNative: false })),
  ];

  // Filter to only assets with price data from CoinMarketCap, but always include native token
  const assetsWithPrice = allAssets.filter(asset => {
    // Always include native token, even if price is unavailable
    if (asset.isNative && BigInt(asset.balance) > 0) return true;
    // For other tokens, require positive price and market value
    return asset.price > 0 && asset.marketValue > 0;
  });

  // Sort by market value and take top 5, but prioritize native token
  const topAssets = assetsWithPrice
    .sort((a, b) => {
      // Always put native token first if it exists
      if (a.isNative && !b.isNative) return -1;
      if (!a.isNative && b.isNative) return 1;
      // Then sort by market value
      return b.marketValue - a.marketValue;
    })
    .slice(0, 5);

  const nativeAsset = topAssets.find(a => a.isNative);
  const topTokens = topAssets.filter(a => !a.isNative);
  
  return {
    address,
    chain: chainConfig.name,
    chainId: chainId,
    nativeBalance: nativeAsset || null,
    tokens: topTokens,
    topAssets: topAssets,
    totalAssets: assetsWithPrice.length,
    note: tokens.length > 0 ? `Showing only tokens from top 100 by market cap on ${chainConfig.name}` : undefined,
  };
}

async function fetchSolanaAssets(address: string) {
  // Using public Solana RPC endpoints
  const RPC_ENDPOINTS = [
    'https://api.mainnet-beta.solana.com',
    'https://solana-api.projectserum.com',
  ];
  
  try {
    // Fetch native SOL balance
    const balanceResponse = await fetch(RPC_ENDPOINTS[0], {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'getBalance',
        params: [address],
      }),
    });
    
    const balanceData = await balanceResponse.json();
    
    // Fetch token accounts (SPL tokens)
    const tokenResponse = await fetch(RPC_ENDPOINTS[0], {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'getTokenAccountsByOwner',
        params: [
          address,
          { programId: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA' },
          { encoding: 'jsonParsed' }
        ],
      }),
    });
    
    const tokenData = await tokenResponse.json();
    const tokens = tokenData.result?.value?.map((account: any) => {
      const info = account.account.data.parsed.info;
      return {
        mint: info.mint,
        balance: info.tokenAmount.amount,
        decimals: info.tokenAmount.decimals,
        symbol: 'SPL Token',
      };
    }) || [];
    
    // Fetch SOL price and calculate market value
    const solPrice = await fetchTokenPrice('SOL');
    const solBalance = balanceData.result?.value || 0;
    const nativeBalanceNum = Number(solBalance) / Math.pow(10, 9);
    const nativeMarketValue = nativeBalanceNum * solPrice;

    // For SPL tokens, we'll estimate market value as 0 since we don't have token metadata
    // In a production app, you'd fetch token metadata and prices
    const tokensWithValue = tokens.map((token: any) => ({
      ...token,
      price: 0,
      marketValue: 0,
    }));

    // Combine native balance with tokens
    const allAssets = [
      {
        symbol: 'SOL',
        balance: solBalance.toString(),
        decimals: 9,
        price: solPrice,
        marketValue: nativeMarketValue,
        isNative: true,
      },
      ...tokensWithValue.map((t: any) => ({ ...t, isNative: false })),
    ];

    // Filter to only assets with price data from CoinMarketCap
    const assetsWithPrice = allAssets.filter(asset => asset.price > 0 && asset.marketValue > 0);

    // Sort by market value and take top 5
    const topAssets = assetsWithPrice
      .sort((a, b) => b.marketValue - a.marketValue)
      .slice(0, 5);

    const nativeAsset = topAssets.find(a => a.isNative);
    const topTokens = topAssets.filter(a => !a.isNative);
    
    return {
      address,
      chain: 'SOL',
      nativeBalance: nativeAsset || null,
      tokens: topTokens,
      topAssets: topAssets,
      totalAssets: assetsWithPrice.length,
    };
  } catch (error) {
    console.error('Error fetching Solana assets:', error);
    return {
      address,
      chain: 'SOL',
      error: 'Failed to fetch Solana assets',
      nativeBalance: null,
      tokens: [],
      topAssets: [],
      totalAssets: 0,
    };
  }
}

async function fetchBitcoinAssets(address: string) {
  // Using Blockstream public API
  try {
    const response = await fetch(`https://blockstream.info/api/address/${address}`);
    const data = await response.json();
    
    // Calculate balance from chain stats (funded - spent)
    const funded = data.chain_stats?.funded_txo_sum || 0;
    const spent = data.chain_stats?.spent_txo_sum || 0;
    const totalBalance = funded - spent;
    
    // BTC doesn't have CoinMarketCap price fetching yet, so topAssets just includes native BTC
    const topAssets = [{
      symbol: 'BTC',
      balance: totalBalance.toString(),
      decimals: 8,
      price: 0,
      marketValue: 0,
      isNative: true,
    }];
    
    return {
      address,
      chain: 'BTC',
      nativeBalance: {
        symbol: 'BTC',
        balance: totalBalance.toString(),
        decimals: 8,
      },
      tokens: [],
      topAssets: topAssets,
      totalAssets: 1,
      stats: {
        totalReceived: funded,
        totalSent: spent,
        txCount: data.chain_stats?.tx_count || 0,
      },
    };
  } catch (error) {
    console.error('Error fetching Bitcoin assets:', error);
    return {
      address,
      chain: 'BTC',
      error: 'Failed to fetch Bitcoin assets',
      nativeBalance: {
        symbol: 'BTC',
        balance: '0',
        decimals: 8,
      },
      tokens: [],
      topAssets: [],
      totalAssets: 0,
    };
  }
}

async function fetchPolymarketAssets(address: string) {
  try {
    console.log(`Fetching Polymarket positions for ${address}...`);
    
    const response = await fetch(`https://data-api.polymarket.com/positions?user=${address}`);
    
    if (!response.ok) {
      throw new Error(`Polymarket API error: ${response.status}`);
    }
    
    const positions = await response.json();
    
    if (!Array.isArray(positions)) {
      throw new Error('Invalid Polymarket API response');
    }
    
    // Transform positions into asset-like format
    const transformedPositions = positions.map(position => ({
      symbol: `PM-${position.outcome}`,
      contractAddress: position.asset,
      balance: (position.size * Math.pow(10, 6)).toString(), // Convert to 6 decimal places for display
      decimals: 6,
      price: position.curPrice || 0,
      marketValue: position.currentValue || 0,
      isNative: false,
      metadata: {
        title: position.title,
        outcome: position.outcome,
        oppositeOutcome: position.oppositeOutcome,
        icon: position.icon,
        slug: position.slug,
        endDate: position.endDate,
        avgPrice: position.avgPrice,
        initialValue: position.initialValue,
        cashPnl: position.cashPnl,
        percentPnl: position.percentPnl,
        redeemable: position.redeemable,
      },
    }));
    
    // Filter only positions with value > 0
    const activePositions = transformedPositions.filter(pos => pos.marketValue > 0);
    
    // Calculate total portfolio value
    const totalValue = transformedPositions.reduce((sum, pos) => sum + (pos.marketValue || 0), 0);
    
    // Sort by market value descending
    const topPositions = transformedPositions
      .sort((a, b) => (b.marketValue || 0) - (a.marketValue || 0))
      .slice(0, 10); // Show top 10 positions
    
    return {
      address,
      chain: 'Polymarket',
      chainId: 'polymarket',
      nativeBalance: {
        symbol: 'USDC',
        balance: Math.round(totalValue * Math.pow(10, 6)).toString(),
        decimals: 6,
        price: 1, // USDC is ~$1
        marketValue: totalValue,
        isNative: true,
      },
      tokens: topPositions,
      topAssets: [
        {
          symbol: 'USDC',
          balance: Math.round(totalValue * Math.pow(10, 6)).toString(),
          decimals: 6,
          price: 1,
          marketValue: totalValue,
          isNative: true,
        },
        ...topPositions,
      ],
      totalAssets: positions.length,
      note: `Showing ${activePositions.length} active positions out of ${positions.length} total positions on Polymarket`,
    };
  } catch (error) {
    console.error('Error fetching Polymarket assets:', error);
    return {
      address,
      chain: 'Polymarket',
      chainId: 'polymarket',
      error: 'Failed to fetch Polymarket positions',
      nativeBalance: {
        symbol: 'USDC',
        balance: '0',
        decimals: 6,
        price: 1,
        marketValue: 0,
        isNative: true,
      },
      tokens: [],
      topAssets: [],
      totalAssets: 0,
    };
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const address = searchParams.get('address');
  const chainParam = searchParams.get('chain') || 'ethereum';
  
  if (!address) {
    return NextResponse.json(
      { error: 'Address parameter is required' },
      { status: 400 }
    );
  }
  
  // Try Polymarket first for any address
  console.log(`Checking for Polymarket activity for address: ${address}`);
  
  // Check cache for Polymarket data
  const polymarketCacheKey = `polymarket_${address}`;
  const polymarketCached = cache.get(polymarketCacheKey);
  if (polymarketCached && Date.now() - polymarketCached.timestamp < CACHE_DURATION) {
    return NextResponse.json(polymarketCached.data);
  }
  
  // Try fetching Polymarket data - if it has positions, use Polymarket mode
  try {
    const polymarketResult = await fetchPolymarketAssets(address);
    if (polymarketResult.totalAssets > 0) {
      console.log(`Found ${polymarketResult.totalAssets} Polymarket positions for ${address}`);
      
      // Cache the result
      cache.set(polymarketCacheKey, { data: polymarketResult, timestamp: Date.now() });
      
      return NextResponse.json(polymarketResult);
    }
  } catch (error) {
    console.log(`No Polymarket activity found for ${address}, trying blockchain detection`);
  }
  
  // Check cache (include chain in cache key for EVM addresses)
  const cacheKey = `${address}_${chainParam}`;
  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return NextResponse.json(cached.data);
  }
  
  const chain = detectChain(address, chainParam);
  
  if (chain === 'UNKNOWN') {
    return NextResponse.json(
      { error: 'Invalid or unsupported address format' },
      { status: 400 }
    );
  }
  
  let result;
  
  switch (chain) {
    case 'ETH':
      result = await fetchEthereumAssets(address, chainParam);
      break;
    case 'SOL':
      result = await fetchSolanaAssets(address);
      break;
    case 'BTC':
      result = await fetchBitcoinAssets(address);
      break;
  }
  
  // Cache the result
  cache.set(cacheKey, { data: result, timestamp: Date.now() });
  
  return NextResponse.json(result);
}
