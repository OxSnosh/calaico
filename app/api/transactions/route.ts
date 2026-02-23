import { NextRequest, NextResponse } from 'next/server';

// Polymarket Default Address
const POLYMARKET_DEFAULT_ADDRESS = '0x259689a1594081a808a9bc7300c2a0fac7fc56d0';

// Cache for 5 minutes
const CACHE_DURATION = 5 * 60 * 1000;
const cache = new Map<string, { data: any; timestamp: number }>();

// EVM Chain configurations
const EVM_CHAIN_CONFIGS: Record<string, { explorer: string; name: string; deprecated?: boolean }> = {
  ethereum: { explorer: 'https://eth.blockscout.com/api', name: 'Ethereum' },
  base: { explorer: 'https://base.blockscout.com/api', name: 'Base' },
  arbitrum: { explorer: 'https://arbitrum.blockscout.com/api', name: 'Arbitrum' },
  optimism: { explorer: 'https://optimism.blockscout.com/api', name: 'Optimism' },
  polygon: { explorer: 'https://polygon.blockscout.com/api', name: 'Polygon' },
  bsc: { explorer: 'https://api.bscscan.com/api', name: 'BNB Chain', deprecated: true },
  avalanche: { explorer: 'https://snowscan.xyz/api', name: 'Avalanche' },
  fantom: { explorer: 'https://api.ftmscan.com/api', name: 'Fantom' },
  gnosis: { explorer: 'https://gnosis.blockscout.com/api', name: 'Gnosis' },
  celo: { explorer: 'https://celo.blockscout.com/api', name: 'Celo' },
  moonbeam: { explorer: 'https://api-moonbeam.moonscan.io/api', name: 'Moonbeam' },
  cronos: { explorer: 'https://api.cronoscan.com/api', name: 'Cronos' },
  zksync: { explorer: 'https://zksync.blockscout.com/api', name: 'zkSync Era' },
  linea: { explorer: 'https://linea.blockscout.com/api', name: 'Linea' },
  scroll: { explorer: 'https://scroll.blockscout.com/api', name: 'Scroll' },
  mantle: { explorer: 'https://mantle.blockscout.com/api', name: 'Mantle' },
};

function detectChain(address: string): 'ETH' | 'BTC' | 'SOL' | 'UNKNOWN' {
  if (/^0x[a-fA-F0-9]{40}$/.test(address)) return 'ETH';
  if (/^(1|3|bc1)[a-zA-Z0-9]{25,62}$/.test(address)) return 'BTC';
  if (/^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address)) return 'SOL';
  return 'UNKNOWN';
}

// Multi-chain protocol addresses for categorization
// These are common protocol addresses across different chains
const PROTOCOL_ADDRESSES = {
  // DEX Router addresses (work across multiple chains)
  dex: [
    '0x7a250d5630b4cf539739df2c5dacb4c659f2488d', // Uniswap V2 Router (Ethereum, Base, Arbitrum, Optimism, Polygon)
    '0xe592427a0aece92de3edee1f18e0157c05861564', // Uniswap V3 Router (Ethereum, Base, Arbitrum, Optimism, Polygon)
    '0xd9e1ce17f2641f24ae83637ab66a2cca9c378b9f', // SushiSwap Router (Ethereum, Polygon, Arbitrum, Avalanche, Fantom)
    '0x1111111254eeb25477b68fb85ed929f73a960582', // 1inch V5 Router (Multi-chain)
    '0xdef1c0ded9bec7f1a1670819833240f027b25eff', // 0x Exchange Proxy (Ethereum, Polygon, BSC, Avalanche)
    '0x68b3465833fb72a70ecdf485e0e4c7bd8665fc45', // Uniswap Universal Router (Ethereum, Base, Arbitrum, Optimism, Polygon)
    '0x10ed43c718714eb63d5aa57b78b54704e256024e', // PancakeSwap Router (BSC)
    '0x1b02da8cb0d097eb8d57a175b88c7d8b47997506', // SushiSwap Router (Arbitrum)
    '0xf491e7b69e4244ad4002bc14e878a34207e38c29', // SpookySwap Router (Fantom)
    '0x60ae616a2155ee3d9a68541ba4544862310933d4', // TraderJoe Router (Avalanche)
    '0x1e876cce41b7b844fde09e38fa1cf00f213bfb87', // VVS Finance Router (Cronos)
    '0x2da10a1e27bf85cedd8ffb1abbe97e53391c0295', // SyncSwap Router (zkSync Era)
    '0x5aee474aadd6f0d9e5b96b758c5c3dd12e27aa45', // Lynex Router (Linea)
    '0x13f4ea83d0bd40e75c8222255bc855a974568dd4', // Ambient Router (Scroll)
    '0x319b69888b0d11cec22caa5034e25fbbdc1058bc', // Agni Router (Mantle)
  ],
  // Bridge addresses (multi-chain)
  bridges: [
    '0x2796317b0ff8538f253012862c06787adfb8ceb6', // Polygon Bridge
    '0x8484ef722627bf18ca5ae6bcf031c23e6e922b30', // Arbitrum Bridge
    '0x99c9fc46f92e8a1c0dec1b1747d010903e884be1', // Optimism Gateway
    '0xa3a7b6f88361f48403514059f1f16c8e78d60eec', // Hop Protocol Bridge (Multi-chain)
    '0x3666f603cc164936c1b87e207f36beba4ac5f18a', // Hop Protocol Bridge L2 (Arbitrum, Optimism, Polygon)
    '0x4200000000000000000000000000000000000010', // Standard Bridge (Base, Optimism)
    '0x40ec5b33f54e0e8a33a975908c5ba1c14e5bbbdf', // Polygon PoS Bridge
    '0x6ab5ae6822647046626e83ee6db8187151e1d5ab', // Stargate Bridge (Multi-chain)
    '0x8731d54e9d02c286767d56ac03e8037c07e01e98', // Across Protocol Bridge (Multi-chain)
    '0xa68d85df56e733a06443306a095646317b5fa633', // Synapse Bridge (Multi-chain)
    '0x3154cf16ccdb4c6d922629664174b904d80f2c35', // Base Bridge
    '0x3e40d73eb977dc6a537af587d48316fee66e9c8c', // Arbitrum Nova Bridge
  ],
  // Lending protocols (multi-chain)
  lending: [
    '0x7d2768de32b0b80b7a3454c06bdac94a69ddc7a9', // Aave V2 Pool (Ethereum, Polygon, Avalanche)
    '0x87870bca3f3fd6335c3f4ce8392d69350b4fa4e2', // Aave V3 Pool (Multi-chain)
    '0x794a61358d6845594f94dc1db02a252b5b4814ad', // Aave V3 Pool (Polygon, Arbitrum, Optimism, Base)
    '0x3d9819210a31b4961b30ef54be2aed79b9c9cd3b', // Compound Comptroller (Ethereum)
    '0xc3d688b66703497daa19211eedff47f25384cdc3', // Compound V3 Comet (Ethereum, Polygon, Arbitrum, Base)
    '0x057835ad21a177dbdd3090bb1cae03eacf78fc6d', // Venus Protocol (BSC)
    '0xf491e7b69e4244ad4002bc14e878a34207e38c29', // Tarot Finance (Fantom)
  ],
  // NFT marketplaces (multi-chain)
  nft: [
    '0x00000000006c3852cbef3e08e8df289169ede581', // OpenSea Seaport (Ethereum, Polygon, Arbitrum, Optimism, Base)
    '0x7be8076f4ea4a4ad08075c2508e481d6c946d12b', // OpenSea Registry
    '0x7f268357a8c2552623316e2562d90e642bb538e5', // OpenSea Exchange
    '0x00000000000000adc04c56bf30ac9d3c0aaf14dc', // Blur Marketplace (Ethereum, Base)
    '0x59728544b08ab483533076417fbbb2fd0b17ce3a', // LooksRare (Ethereum)
    '0x74312363e45dcaba76c59ec49a7aa8a65a67eed3', // X2Y2 (Ethereum)
    '0x2b2e8cda09bba9660dca5cb6233787738ad68329', // Rarible (Multi-chain)
  ],
  // Staking protocols
  staking: [
    '0xae7ab96520de3a18e5e111b5eaab095312d7fe84', // Lido stETH (Ethereum)
    '0x7f39c581f595b53c5cb19bd0b3f8da6c935e2ca0', // Lido wstETH Wrapper (Ethereum)
    '0xac3e018457b222d93114458476f3e3416abbe38f', // Lido stMATIC (Polygon)
    '0x5e8422345238f34275888049021821e8e08caa1f', // Frax ETH Staking (Ethereum)
    '0x152649ea73beab28c5b49b26eb48f7ead6d4c898', // Coinbase Wrapped Staked ETH (Ethereum, Base)
    '0xdfe66b14d37c77f4e9b180ceb433d1b164f0281d', // Stader Staking (Multi-chain)
    '0xb17a95e2b6d5e6b16e0bbfc28dcc5edac7f3ae16', // Rocket Pool Staking (Ethereum, Arbitrum)
  ],
  // Token minting (NFT collections)
  mint: [
    '0x60e4d786628fea6478f785a6d7e704777c86a7c6', // Mutant Ape Yacht Club
    '0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d', // Bored Ape Yacht Club
    '0x49cf6f5d44e70224e2e23fdcdd2c053f30ada28b', // CloneX
    '0x23581767a106ae21c074b2276d25e5c3e136a68b', // Moonbirds
  ],
  // Airdrop claim contracts
  airdrop: [
    '0x090d4613473dee047c3f2706764f49e0821d256e', // Optimism Airdrop
    '0x67a24ce4321ab3af51c2d0a4801c3e111d88c9d9', // Arbitrum Airdrop
    '0xfeb3e2b0b863fdc5ad3e1bc2d85e7b0813a3e172', // Blur Airdrop
    '0xd0e03e39b4f5e8a8e1f3a5a5f5f5f5f5f5f5f5f5', // Generic Merkle Distributor
  ],
};

function categorizeEthereumTransaction(tx: any, address: string): string {
  // Check for failed/reverted transaction first
  if (tx.isError === '1' || tx.txreceipt_status === '0') {
    return 'reverted';
  }
  
  const toAddress = tx.to?.toLowerCase();
  const fromAddress = tx.from?.toLowerCase();
  const userAddress = address.toLowerCase();
  
  // Check if transaction is incoming (receive)
  const isIncoming = toAddress === userAddress && fromAddress !== userAddress;
  
  // Check for protocol interactions by address
  if (toAddress) {
    // DEX transactions
    if (PROTOCOL_ADDRESSES.dex.some(addr => addr === toAddress)) {
      return 'swap';
    }
    
    // Bridge transactions
    if (PROTOCOL_ADDRESSES.bridges.some(addr => addr === toAddress)) {
      return 'bridge';
    }
    
    // Lending protocol interactions
    if (PROTOCOL_ADDRESSES.lending.some(addr => addr === toAddress)) {
      return 'lending';
    }
    
    // NFT marketplace interactions
    if (PROTOCOL_ADDRESSES.nft.some(addr => addr === toAddress)) {
      return 'nft';
    }
    
    // Staking protocol interactions
    if (PROTOCOL_ADDRESSES.staking.some(addr => addr === toAddress)) {
      return 'staking';
    }
    
    // Minting contracts
    if (PROTOCOL_ADDRESSES.mint.some(addr => addr === toAddress)) {
      return 'mint';
    }
    
    // Airdrop claim contracts
    if (PROTOCOL_ADDRESSES.airdrop.some(addr => addr === toAddress)) {
      return 'airdrop';
    }
  }
  
  // Check if it's a contract interaction (input data present)
  if (tx.input && tx.input !== '0x' && tx.input.length > 10) {
    // Check function signatures
    const funcSig = tx.input.slice(0, 10);
    
    // Common ERC20 functions
    if (funcSig === '0xa9059cbb') return isIncoming ? 'receive' : 'transfer'; // transfer(address,uint256)
    if (funcSig === '0x23b872dd') return isIncoming ? 'receive' : 'transfer'; // transferFrom(address,address,uint256)
    if (funcSig === '0x095ea7b3') return 'approval'; // approve(address,uint256)
    
    // Swap functions (DEX)
    if (funcSig === '0x38ed1739') return 'swap'; // swapExactTokensForTokens
    if (funcSig === '0x7ff36ab5') return 'swap'; // swapExactETHForTokens
    if (funcSig === '0x18cbafe5') return 'swap'; // swapExactTokensForETH
    if (funcSig === '0x5c11d795') return 'swap'; // swapExactTokensForTokensSupportingFeeOnTransferTokens
    if (funcSig === '0x791ac947') return 'swap'; // swapExactTokensForETHSupportingFeeOnTransferTokens
    
    // Staking functions
    if (funcSig === '0xa694fc3a') return 'staking'; // stake
    if (funcSig === '0x3ccfd60b') return 'staking'; // withdraw
    if (funcSig === '0x3d18b912') return 'staking'; // getReward
    
    // Minting functions
    if (funcSig === '0xa0712d68') return 'mint'; // mint(uint256)
    if (funcSig === '0x40c10f19') return 'mint'; // mint(address,uint256)
    if (funcSig === '0x6a627842') return 'mint'; // mint(address)
    
    // Burning functions
    if (funcSig === '0x42966c68') return 'burn'; // burn(uint256)
    if (funcSig === '0x9dc29fac') return 'burn'; // burn(address,uint256)
    
    // Airdrop claim functions
    if (funcSig === '0x4e71d92d') return 'airdrop'; // claim()
    if (funcSig === '0x2e7ba6ef') return 'airdrop'; // claim(uint256,address,uint256,bytes32[])
    
    // Bridge functions
    if (funcSig === '0x838b2520') return 'bridge'; // deposit
    if (funcSig === '0x2e1a7d4d') return 'bridge'; // withdraw(uint256)
    if (funcSig === '0x1249c58b') return 'bridge'; // mint (bridge mint)
    
    // Generic contract interaction
    return 'contract';
  }
  
  // Simple native token transfer
  if (tx.value !== '0') {
    return isIncoming ? 'receive' : 'transfer';
  }
  
  return 'unknown';
}

async function fetchEthereumTransactions(address: string, chainId: string = 'ethereum') {
  // Using Blockscout public API (no API key required)
  const chainConfig = EVM_CHAIN_CONFIGS[chainId] || EVM_CHAIN_CONFIGS.ethereum;
  
  // Handle BSC API deprecation
  if (chainId === 'bsc') {
    console.error('BSC API is deprecated, BSCScan requires Etherscan V2 with paid plan');
    return {
      address,
      chain: chainConfig.name,
      chainId: chainId,
      error: 'BSC transactions temporarily unavailable - BSCScan API has been deprecated and requires a paid Etherscan V2 plan',
      transactions: [],
    };
  }
  
  try {
    const response = await fetch(
      `${chainConfig.explorer}?module=account&action=txlist&address=${address}&page=1&offset=20&sort=desc`,
      {
        headers: {
          'Accept': 'application/json',
        },
      }
    );
    
    if (!response.ok) {
      throw new Error(`Blockscout API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.message === 'OK' && Array.isArray(data.result)) {
      return {
        address,
        chain: chainConfig.name,
        chainId: chainId,
        transactions: data.result.slice(0, 20).map((tx: any) => {
          const category = categorizeEthereumTransaction(tx, address);
          
          return {
            hash: tx.hash,
            from: tx.from,
            to: tx.to,
            value: tx.value,
            blockNumber: tx.blockNumber,
            timeStamp: tx.timeStamp,
            gas: tx.gas,
            gasPrice: tx.gasPrice,
            isError: tx.isError,
            input: tx.input,
            category,
          };
        }),
      };
    }
    
    // If no results, return empty array (address might have no transactions)
    if (data.result && Array.isArray(data.result) && data.result.length === 0) {
      return {
        address,
        chain: chainConfig.name,
        chainId: chainId,
        transactions: [],
      };
    }
    
    throw new Error('Invalid Blockscout response format');
    
  } catch (error) {
    console.error(`${chainConfig.name} API error:`, error);
    
    // Only fallback to Etherscan for Ethereum mainnet
    if (chainId === 'ethereum') {
      console.log('Trying Etherscan fallback for Ethereum...');
      try {
        const altResponse = await fetch(
          `https://api.etherscan.io/api?module=account&action=txlist&address=${address}&page=1&offset=20&sort=desc`,
          {
            headers: {
              'Accept': 'application/json',
          },
        }
      );
      
      const altData = await altResponse.json();
      
      if (altData.status === '1' && Array.isArray(altData.result)) {
        return {
          address,
          chain: chainConfig.name,
          chainId: chainId,
          transactions: altData.result.slice(0, 20).map((tx: any) => {
            const category = categorizeEthereumTransaction(tx, address);
            
            return {
              hash: tx.hash,
              from: tx.from,
              to: tx.to,
              value: tx.value,
              blockNumber: tx.blockNumber,
              timeStamp: tx.timeStamp,
              gas: tx.gas,
              gasPrice: tx.gasPrice,
              isError: tx.isError,
              input: tx.input,
              category,
            };
          }),
        };
      }
      
      // No transactions found
      return {
        address,
        chain: chainConfig.name,
        chainId: chainId,
        transactions: [],
      };
      
    } catch (fallbackError) {
      console.error('Etherscan fallback also failed:', fallbackError);
      return {
        address,
        chain: chainConfig.name,
        chainId: chainId,
        error: `Failed to fetch ${chainConfig.name} transactions`,
        transactions: [],
      };
    }
    } else {
      // For non-Ethereum chains, don't use Etherscan fallback
      console.error(`${chainConfig.name} API failed, no fallback available`);
      return {
        address,
        chain: chainConfig.name,
        chainId: chainId,
        error: `Failed to fetch ${chainConfig.name} transactions`,
        transactions: [],
      };
    }
  }
}

// Known Solana protocol addresses (program IDs)
const SOLANA_PROTOCOLS = {
  dex: [
    'JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4', // Jupiter Aggregator V6
    'JUP4Fb2cqiRUcaTHdrPC8h2gNsA2ETXiPDD33WcGuJB', // Jupiter Aggregator V4
    '9W959DqEETiGZocYWCQPaJ6sBmUzgfxXfqGeTEdp3aQP', // Orca Whirlpool
    'whirLbMiicVdio4qvUfM5KAg6Ct8VwpYzGff3uctyCc', // Orca Whirlpool Legacy
    '675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8', // Raydium AMM V4
    'CAMMCzo5YL8w4VFF8KVHrK22GGUsp5VTaW7grrKgrWqK', // Raydium CLMM
    '5quBtoiQqxF9Jv6KYKctB59NT3gtJD2Y65kdnB1Uev3h', // Raydium Stable AMM
  ],
  nft: [
    'M2mx93ekt1fmXSVkTrUL9xVFHkmME8HTUi5Cyc5aF7K', // Magic Eden V2
    'CJsLwbP1iu5DuUikHEJnLfANgKy6stB2uFgvBBHoyxwz', // Solanart
    'hausS13jsjafwWwGqZTUQRmWyvyxn9EQpqMwV1PBBmk', // Coral Cube (Tensor)
    'TSWAPaqyCSx2KABk68Shruf4rp7CxcNi8hAsbdwmHbN', // Tensor Swap
  ],
  lending: [
    'So1endDq2YkqhipRh3WViPa8hdiSpxWy6z3Z6tMCpAo', // Solend
    'KLend2g3cP87fffoy8q1mQqGKjrxjC8boSyAYavgmjD', // Kamino Lend
    'Zo1ggzTUKMY5bYnDvT5mtVeZxzf2FaLTbKkmvGUhUQk', // Zo (01) Protocol
    'MarBmsSgKXdrN1egZf5sqe1TMai9K1rChYNDJgjq7aD', // MarginFi
  ],
  staking: [
    'MarBmsSgKXdrN1egZf5sqe1TMai9K1rChYNDJgjq7aD', // Marinade Finance
    'Jito4APyf642JPZPx3hGc6WWJ8zPKtRbRs4P815Awbb', // Jito Staking
    'CgntPoLka5pD5fesJYhGmUCF8KU1QS1ZmZiuAuMZr2az', // Cogent (Lido on Solana)
    'EhYXq3ANp5nAerUpbSgd7VK2RRcxK1zNuSQ755G5Mtxx', // Eversol Staking
  ],
  bridge: [
    'wormDTUJ6AWPNvk59vGQbDvGJmqbDTdgWgAqcLBCgUb', // Wormhole
    '3u8hJUVTA4jH1wYAyUur7FFZVQ8H635K3tSHHF4ssjQ5', // Allbridge
    'DZnkkTmCiFWfYTfT41X3Rd1kDgozqzxWaHqsw6W4x2oe', // Mayan Finance Bridge
  ],
  airdrop: [
    'cmtDvXumGCrqC1Age74AVPhSRVXJMd8PJS91L8KbNCK', // Community Token (Airdrop distributor)
  ],
};

function categorizeSolanaTransaction(tx: any): string {
  // For Solana, we'd need to fetch detailed transaction data to categorize
  // Use error status and memo field as hints
  if (tx.err) {
    return 'reverted';
  }
  
  // Check memo field for hints
  if (tx.memo) {
    const memoLower = tx.memo.toLowerCase();
    if (memoLower.includes('swap')) return 'swap';
    if (memoLower.includes('nft')) return 'nft';
    if (memoLower.includes('stake') || memoLower.includes('staking')) return 'staking';
    if (memoLower.includes('lend') || memoLower.includes('borrow')) return 'lending';
    if (memoLower.includes('bridge')) return 'bridge';
    if (memoLower.includes('claim') || memoLower.includes('airdrop')) return 'airdrop';
  }
  
  // Default to transfer for Solana (most common transaction type)
  return 'transfer';
}

async function fetchSolanaTransactions(address: string) {
  // Using public Solana RPC endpoint
  const RPC_ENDPOINT = 'https://api.mainnet-beta.solana.com';
  
  try {
    const response = await fetch(RPC_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'getSignaturesForAddress',
        params: [address, { limit: 20 }],
      }),
    });
    
    const data = await response.json();
    
    return {
      address,
      chain: 'SOL',
      transactions: data.result?.map((tx: any) => {
        const category = categorizeSolanaTransaction(tx);
        
        return {
          signature: tx.signature,
          slot: tx.slot,
          blockTime: tx.blockTime,
          err: tx.err,
          memo: tx.memo,
          category,
        };
      }) || [],
    };
  } catch (error) {
    console.error('Error fetching Solana transactions:', error);
    return {
      address,
      chain: 'SOL',
      error: 'Failed to fetch Solana transactions',
      transactions: [],
    };
  }
}

// Known Bitcoin protocol addresses for categorization
const BITCOIN_PROTOCOLS = {
  // DEX and DeFi protocols (multi-sig and known addresses)
  dex: [
    'bc1q', // Example DEX addresses would go here
  ],
  // Bridge addresses
  bridges: [
    'bc1qm34lsc65zpw79lxes69zkqmk6ee3ewf0j77s3h', // Wrapped Bitcoin (WBTC) bridge
    '3FZbgi29cpjq2GjdwV8eyHuJJnkLtktZc5', // BitGo
  ],
  // Mining pools (for categorizing coinbase transactions)
  miningPools: [
    'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh', // AntPool
  ],
};

function categorizeBitcoinTransaction(tx: any, userAddress: string): string {
  // Check transaction status for errors
  if (tx.status?.confirmed === false && tx.status?.block_height === null) {
    return 'unknown'; // Pending/unconfirmed
  }
  
  // Check for OP_RETURN outputs (used for Ordinals, Runes, BRC-20, etc.)
  const hasOpReturn = tx.vout?.some((output: any) => 
    output.scriptpubkey_type === 'op_return' || 
    output.scriptpubkey?.startsWith('6a')
  );
  
  if (hasOpReturn) {
    // Check for Runes protocol marker (OP_RETURN with specific pattern)
    const opReturnData = tx.vout?.find((output: any) => 
      output.scriptpubkey_type === 'op_return'
    )?.scriptpubkey;
    
    // Runes protocol uses OP_13 (0x5d) followed by OP_RETURN
    if (opReturnData?.includes('6a5d')) {
      return 'mint'; // Runes minting
    }
    
    // Ordinals inscriptions typically have larger OP_RETURN data
    if (opReturnData && opReturnData.length > 100) {
      return 'nft'; // Ordinals inscription (NFT)
    }
    
    // BRC-20 tokens use smaller OP_RETURN with JSON data
    if (opReturnData && opReturnData.length < 100 && opReturnData.length > 20) {
      return 'transfer'; // BRC-20 transfer
    }
    
    // Generic OP_RETURN transaction (data inscription)
    return 'contract'; // Data inscription as contract interaction
  }
  
  // Check for bridge transactions
  const addresses = [
    ...tx.vout?.map((o: any) => o.scriptpubkey_address).filter(Boolean),
    ...tx.vin?.map((i: any) => i.prevout?.scriptpubkey_address).filter(Boolean),
  ];
  
  const isBridge = addresses.some((addr: string) => 
    BITCOIN_PROTOCOLS.bridges.some(bridge => addr === bridge)
  );
  
  if (isBridge) {
    return 'bridge';
  }
  
  // Check for multi-sig or complex outputs (Lightning Network, DeFi)
  const hasMultiSig = tx.vout?.some((output: any) => 
    output.scriptpubkey_type === 'multisig' || 
    output.scriptpubkey_type === 'v0_p2wsh' ||
    output.scriptpubkey_type === 'p2sh'
  );
  
  // Lightning Network channel operations use P2WSH
  const isLightning = tx.vout?.some((output: any) => 
    output.scriptpubkey_type === 'v0_p2wsh'
  );
  
  if (isLightning) {
    return 'contract'; // Lightning Network as contract interaction
  }
  
  // Check if user is receiving (incoming transaction)
  const isReceiving = tx.vout?.some((output: any) => 
    output.scriptpubkey_address === userAddress
  );
  const isSending = tx.vin?.some((input: any) => 
    input.prevout?.scriptpubkey_address === userAddress
  );
  
  // If receiving only, categorize as receive
  if (isReceiving && !isSending) {
    return 'receive';
  }
  
  // Check for swap pattern (multiple inputs/outputs, similar amounts)
  if (tx.vin?.length >= 2 && tx.vout?.length >= 2) {
    const outputValues = tx.vout?.map((o: any) => o.value).filter((v: number) => v > 0);
    const hasChangeLikePattern = outputValues.some((v: number, i: number) => 
      outputValues.slice(i + 1).some((v2: number) => Math.abs(v - v2) / v < 0.1)
    );
    
    if (hasChangeLikePattern && hasMultiSig) {
      return 'swap'; // Atomic swap or DEX transaction
    }
  }
  
  // Default to simple transfer (most common BTC transaction)
  return 'transfer';
}

async function fetchBitcoinTransactions(address: string) {
  // Using Blockstream public API
  try {
    const response = await fetch(`https://blockstream.info/api/address/${address}/txs`);
    const transactions = await response.json();
    
    return {
      address,
      chain: 'BTC',
      transactions: Array.isArray(transactions) ? transactions.slice(0, 20).map((tx: any) => {
        const category = categorizeBitcoinTransaction(tx, address);
        
        return {
          txid: tx.txid,
          status: tx.status,
          blockHeight: tx.status?.block_height,
          blockTime: tx.status?.block_time,
          fee: tx.fee,
          size: tx.size,
          weight: tx.weight,
          inputCount: tx.vin?.length || 0,
          outputCount: tx.vout?.length || 0,
          category,
        };
      }) : [],
    };
  } catch (error) {
    console.error('Error fetching Bitcoin transactions:', error);
    return {
      address,
      chain: 'BTC',
      error: 'Failed to fetch Bitcoin transactions',
      transactions: [],
    };
  }
}

async function fetchPolymarketTransactions(address: string) {
  try {
    console.log(`Fetching Polymarket activity for ${address}...`);
    
    const response = await fetch(`https://data-api.polymarket.com/activity?user=${address}&limit=20`);
    
    if (!response.ok) {
      throw new Error(`Polymarket API error: ${response.status}`);
    }
    
    const activities = await response.json();
    
    if (!Array.isArray(activities)) {
      throw new Error('Invalid Polymarket API response');
    }
    
    // Transform activities into transaction-like format
    const transformedTransactions = activities.map(activity => ({
      hash: activity.transactionHash,
      from: activity.proxyWallet,
      to: 'Polymarket', // Since it's a prediction market
      value: (activity.usdcSize * Math.pow(10, 6)).toString(), // Convert USDC to wei-like format
      blockNumber: activity.timestamp.toString(),
      timeStamp: activity.timestamp.toString(),
      gas: '0', // Not applicable to Polymarket
      gasPrice: '0', // Not applicable to Polymarket
      isError: '0',
      input: `0x${activity.conditionId.slice(2)}`, // Use condition ID as input
      category: 'polymarket_bet',
      metadata: {
        type: activity.type,
        side: activity.side,
        size: activity.size,
        price: activity.price,
        usdcSize: activity.usdcSize,
        title: activity.title,
        outcome: activity.outcome,
        outcomeIndex: activity.outcomeIndex,
        icon: activity.icon,
        slug: activity.slug,
        eventSlug: activity.eventSlug,
        pseudonym: activity.pseudonym,
      },
    }));
    
    return {
      address,
      chain: 'Polymarket',
      chainId: 'polymarket',
      transactions: transformedTransactions,
    };
  } catch (error) {
    console.error('Error fetching Polymarket transactions:', error);
    return {
      address,
      chain: 'Polymarket',
      chainId: 'polymarket',
      error: 'Failed to fetch Polymarket activity',
      transactions: [],
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
  const polymarketCacheKey = `polymarket_transactions_${address}`;
  const polymarketCached = cache.get(polymarketCacheKey);
  if (polymarketCached && Date.now() - polymarketCached.timestamp < CACHE_DURATION) {
    return NextResponse.json(polymarketCached.data);
  }
  
  // Try fetching Polymarket data - if it has transactions, use Polymarket mode
  try {
    const polymarketResult = await fetchPolymarketTransactions(address);
    if (polymarketResult.transactions && polymarketResult.transactions.length > 0) {
      console.log(`Found ${polymarketResult.transactions.length} Polymarket transactions for ${address}`);
      
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
  
  const chain = detectChain(address);
  
  if (chain === 'UNKNOWN') {
    return NextResponse.json(
      { error: 'Invalid or unsupported address format' },
      { status: 400 }
    );
  }
  
  let result;
  
  switch (chain) {
    case 'ETH':
      result = await fetchEthereumTransactions(address, chainParam);
      break;
    case 'SOL':
      result = await fetchSolanaTransactions(address);
      break;
    case 'BTC':
      result = await fetchBitcoinTransactions(address);
      break;
  }
  
  // Cache the result
  cache.set(cacheKey, { data: result, timestamp: Date.now() });
  
  return NextResponse.json(result);
}
