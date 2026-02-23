# 🐱 Calico - Multi-Chain Wallet Explorer

A unified REST API and React widget for querying 18 blockchains: 16 EVM chains (Ethereum, Base, Arbitrum, etc.), plus Bitcoin and Solana. Built to make multi-chain wallet exploration simple and fast.

## ✨ Features

- **Multi-Chain EVM Support**: Query any EVM address across 16 chains including Ethereum, Base, Arbitrum, Optimism, Polygon, BNB Chain, Avalanche, and more
- **Auto-Detection**: Pass any wallet address - automatically detects Ethereum/EVM (0x...), Bitcoin (1/3/bc1...), or Solana (base58)
- **Chain Selector**: For EVM addresses, select from 16 supported chains with a dropdown
- **Unified API**: Consistent JSON schema across all chains
- **Real-Time Data**:
  - GET `/api/assets` - Native balance + top 5 tokens by market value (with CoinMarketCap prices)
  - GET `/api/transactions` - Last 20 transactions with smart categorization
- **Smart Caching**: 5-minute caching to keep things fast and cheap
- **React Widget**: Beautiful dark theme with tabs, loading states, and interactive API docs
- **Smart Transaction Categorization**: Automatically categorizes transactions into 15 standardized categories across all chains (transfer, swap, bridge, lending, staking, nft, mint, burn, airdrop, approval, contract, receive, reverted, polymarket_bet, unknown)
- **Polymarket Integration**: Universal detection and support for prediction market positions and trading activity on any address with Polymarket activity

## 🚀 Quick Start

### Sample Wallets to Test

**Ethereum (Vitalik's Wallet):**

```
0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045
```

**Bitcoin (Genesis Wallet - Satoshi):**

```
1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa
```

View 57+ BTC and thousands of transactions!

**Solana (Ecosystem Wallet):**

```
9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM
```

Explore SOL balance and popular SPL tokens from the Solana ecosystem!

**Polymarket (Prediction Markets):**

```
0x259689a1594081a808a9bc7300c2a0fac7fc56d0
0x45e842555d3a1d418bb7b7f8a0c1caf9ee297e8d
```

View active betting positions and trading history on the world's largest prediction market platform! These dedicated addresses show Polymarket-only data.

## 🌐 Supported Chains

### EVM Chains (16)

- **Ethereum** - Layer 1
- **Base** - Coinbase L2
- **Arbitrum** - Optimistic Rollup L2
- **Optimism** - Optimistic Rollup L2
- **Polygon** - Sidechain
- **BNB Chain** - BSC Layer 1
- **Avalanche** - Layer 1
- **Fantom** - Layer 1
- **Gnosis** - Layer 1
- **Celo** - Layer 1
- **Moonbeam** - Polkadot Parachain
- **Cronos** - Crypto.com Chain
- **zkSync Era** - ZK Rollup L2
- **Linea** - zkEVM L2
- **Scroll** - zkEVM L2
- **Mantle** - Optimistic Rollup L2

### Non-EVM Chains (2)

- **Bitcoin** - UTXO-based with Ordinals, Runes, BRC-20 support
- **Solana** - High-performance L1 with program-based architecture and popular SPL token support

### Prediction Markets (1)

- **Polymarket** - Decentralized prediction market platform with universal address detection

**Total: 19 platforms supported**

## ⭐ Special Features

### Polymarket Integration

The API includes specialized support for Polymarket prediction market data with smart detection:

- **Dedicated Addresses**: Specific addresses (like the sample ones above) use **Polymarket-only mode** showing prediction market positions and betting activity
- **Regular Addresses**: All other addresses (including Vitalik's) show their **blockchain assets and transactions** as normal
- **Smart Routing**: The system automatically detects whether to use Polymarket mode or blockchain mode based on the address
- **Assets Endpoint**: Returns active prediction market positions with rich metadata (market titles, outcomes, PnL, redeemable status)
- **Transactions Endpoint**: Shows betting history with complete trade details (BUY/SELL/REDEEM, prices, market info)
- **Real-time Data**: Uses Polymarket Data API to fetch live positions and recent trading activity
- **Unified Format**: Returns data in the same JSON schema as blockchain APIs for consistency
- **Chain Auto-Selection**: UI automatically defaults to Polygon chain for Polymarket addresses

## 📦 Installation

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## � Interactive API Documentation

Visit [http://localhost:3000/docs](http://localhost:3000/docs) to access the interactive API documentation where you can:

- View detailed endpoint documentation with request/response schemas
- Test queries directly in the browser with live responses
- See example queries for different chains
- Copy formatted JSON responses
- Test all 15 transaction categories with real wallet data
- See multi-chain protocol detection in action
- Compare categorization across different blockchain architectures

## �🛠️ Tech Stack

- **Next.js** - React framework with API routes
- **React** - Frontend UI
- **AlCalico API** - Multi-chain blockchain data
- **Tailwind CSS** - Styling

## 📡 API Endpoints

### GET `/api/assets`

Returns native balance and top 5 tokens by market value for a wallet address.

**Query Parameters:**

- `address` (required): Wallet address (EVM, BTC, or Solana)
- `chain` (optional): For EVM addresses, specify chain (default: `ethereum`)
  - Options: `ethereum`, `base`, `arbitrum`, `optimism`, `polygon`, `bsc`, `avalanche`, `fantom`, `gnosis`, `celo`, `moonbeam`, `cronos`, `zksync`, `linea`, `scroll`, `mantle`

**Response:**

```json
{
  "address": "0x...",
  "chain": "ETH",
  "symbols": "USDC",
  "amount": "15382211498488533",
  "decimals": 18
}
```

### GET `/api/transactions`

Returns last 20 transactions for a wallet address with smart categorization.

**Query Parameters:**

- `address` (required): Wallet address
- `chain` (optional): For EVM addresses, specify chain (default: `ethereum`)
  - Options: `ethereum`, `base`, `arbitrum`, `optimism`, `polygon`, `bsc`, `avalanche`, `fantom`, `gnosis`, `celo`, `moonbeam`, `cronos`, `zksync`, `linea`, `scroll`, `mantle`

**Response:**

```json
{
  "transactions": [
    {
      "contractAddress": "0xdac17f958d2ee523a2206206994597c13d831ec7",
      "symbol": "USDT",
      "name": "Tether USD",
      "balance": "366678761160",
      "decimals": 6,
      "logo": "https://logo.moralis.io/0x1_0xdac17..."
    }
  ]
}
```

## �️ Transaction Categorization

Our smart categorization system analyzes transactions across all 19 platforms (18 blockchains + Polymarket) and assigns them to one of 15 standardized categories:

### Core Categories (8)

- **`transfer`** - Simple token/coin transfers between wallets
- **`receive`** - Incoming transfers (when user is only recipient)
- **`swap`** - DEX trades and token exchanges
- **`bridge`** - Cross-chain asset transfers
- **`lending`** - Borrowing/lending on protocols like Aave, Compound
- **`staking`** - Staking tokens for rewards (ETH staking, liquid staking)
- **`nft`** - NFT mints, transfers, and marketplace transactions
- **`approval`** - Token approval transactions (ERC-20/ERC-721)

### Advanced Categories (7)

- **`mint`** - Token/NFT minting, including Bitcoin Runes
- **`burn`** - Token burning transactions
- **`airdrop`** - Airdrop claims and distributions
- **`polymarket_bet`** - Prediction market betting activity (BUY/SELL/REDEEM positions)
- **`contract`** - Generic smart contract interactions, Lightning Network
- **`reverted`** - Failed transactions (gas consumed but reverted)
- **`unknown`** - Transactions that don't match any pattern

### Chain-Specific Detection

**EVM Chains (16)**: Uses 80+ protocol addresses and 20+ function signatures

- **Protocol Detection**: Uniswap, SushiSwap, Aave, Compound, OpenSea, PancakeSwap, SpookySwap, TraderJoe, etc.
- **Function Signatures**: `transfer()`, `swapExactTokensForTokens()`, `stake()`, `mint()`, `burn()`, `claim()`, etc.
- **Multi-chain Support**: Same protocols deployed across different chains

**Solana**: Uses 20+ program IDs and memo parsing

- **Program Detection**: Jupiter, Orca, Raydium, Magic Eden, Solend, Marinade, Wormhole, etc.
- **Memo Analysis**: Parses transaction memos for hints (swap, nft, stake, lend, bridge, claim)

**Bitcoin**: Uses output patterns and OP_RETURN analysis

- **Ordinals**: Large OP_RETURN data → `nft`
- **Runes**: OP_13 + OP_RETURN pattern → `mint`
- **BRC-20**: Smaller OP_RETURN with JSON → `transfer`
- **Lightning**: P2WSH outputs → `contract`
- **Bridges**: Known bridge addresses → `bridge`

## �🎨 How to Use

1. Pass any address to the search bar
2. View native balance + token holdings in the **Assets** tab
3. See transaction history in the **Transactions** tab
4. Check out the raw API response in the **API Response** tab

## 🔑 Configuration

**No API keys required!** This project uses public RPC endpoints:

- **Ethereum**: Public RPC endpoints (eth.llamarpc.com, rpc.ankr.com/eth)
- **Solana**: Public Solana RPC (api.mainnet-beta.solana.com)
- **Bitcoin**: Blockstream public API (blockstream.info/api)

### Optional: Enhanced Features

For unlimited requests and advanced features, you can optionally add API keys to `.env.local`:

```env
# Optional: For unlimited Etherscan requests
ETHERSCAN_API_KEY=your_key_here

# Optional: For faster Ethereum queries
ALCHEMY_API_KEY=your_key_here
```

## 🤝 Contributing

This project was built with Claude's help to prototype faster. Feel free to:

- Report bugs
- Suggest features
- Submit pull requests

## 📝 License

MIT

---

Built with ❤️ using Claude Code
