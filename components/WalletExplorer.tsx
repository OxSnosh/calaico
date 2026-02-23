"use client";

import { useState } from "react";

type Tab = "assets" | "transactions" | "api";

interface Asset {
  symbol?: string;
  balance: string;
  decimals: number;
  contractAddress?: string;
  name?: string;
  logo?: string;
}

interface Transaction {
  hash?: string;
  txid?: string;
  signature?: string;
  from?: string;
  to?: string;
  value?: string;
  asset?: string;
  blockNum?: string;
  blockNumber?: string;
  blockHeight?: number;
  blockTime?: number;
  slot?: number;
  category?: string;
  fee?: number;
  timeStamp?: string;
}

export default function WalletExplorer() {
  const [address, setAddress] = useState("");
  const [selectedChain, setSelectedChain] = useState("ethereum");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("assets");
  const [assetsData, setAssetsData] = useState<any>(null);
  const [transactionsData, setTransactionsData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const evmChains = [
    { id: "ethereum", name: "Ethereum", icon: "⟠" },
    { id: "base", name: "Base", icon: "🔵" },
    { id: "arbitrum", name: "Arbitrum", icon: "🔷" },
    { id: "optimism", name: "Optimism", icon: "🔴" },
    { id: "polygon", name: "Polygon", icon: "🟣" },
    { id: "bsc", name: "BNB Chain", icon: "🟡" },
    { id: "avalanche", name: "Avalanche", icon: "🔺" },
    { id: "fantom", name: "Fantom", icon: "👻" },
    { id: "gnosis", name: "Gnosis", icon: "🟢" },
    { id: "celo", name: "Celo", icon: "🌱" },
    { id: "moonbeam", name: "Moonbeam", icon: "🌙" },
    { id: "cronos", name: "Cronos", icon: "💎" },
    { id: "zksync", name: "zkSync Era", icon: "⚡" },
    { id: "linea", name: "Linea", icon: "📏" },
    { id: "scroll", name: "Scroll", icon: "📜" },
    { id: "mantle", name: "Mantle", icon: "🧱" },
  ];

  const isEvmAddress = (addr: string) => /^0x[a-fA-F0-9]{40}$/.test(addr);

  const fetchData = async () => {
    if (!address.trim()) {
      setError("Please enter a wallet address");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Determine if we need to pass chain parameter
      const chainParam = isEvmAddress(address) ? `&chain=${selectedChain}` : "";

      // Fetch assets
      const assetsResponse = await fetch(
        `/api/assets?address=${encodeURIComponent(address)}${chainParam}`,
      );
      const assets = await assetsResponse.json();
      setAssetsData(assets);

      // Fetch transactions
      const txResponse = await fetch(
        `/api/transactions?address=${encodeURIComponent(address)}${chainParam}`,
      );
      const transactions = await txResponse.json();
      setTransactionsData(transactions);
    } catch (err) {
      setError("Failed to fetch wallet data. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      fetchData();
    }
  };

  const formatBalance = (balance: string, decimals: number): string => {
    try {
      const balanceBigInt = BigInt(balance);
      const divisor = BigInt(10 ** decimals);

      // Get the integer part
      const integerPart = balanceBigInt / divisor;

      // Get the decimal part
      const remainder = balanceBigInt % divisor;

      // If no remainder, return just the integer part
      if (remainder === BigInt(0)) {
        return integerPart.toString();
      }

      // Format the decimal part with proper padding
      const decimalStr = remainder.toString().padStart(decimals, "0");

      // Remove trailing zeros from decimal part
      const trimmedDecimal = decimalStr.replace(/0+$/, "");

      // Return formatted number (show up to 6 decimal places max)
      if (trimmedDecimal.length > 6) {
        return `${integerPart}.${trimmedDecimal.slice(0, 6)}`;
      }

      return trimmedDecimal
        ? `${integerPart}.${trimmedDecimal}`
        : integerPart.toString();
    } catch (error) {
      console.error("Error formatting balance:", error, balance, decimals);
      return "0";
    }
  };

  // Polymarket dedicated addresses
  const polymarketAddresses = [
    "0x259689a1594081a808a9bc7300c2a0fac7fc56d0",
    "0x45e842555d3a1d418bb7b7f8a0c1caf9ee297e8d",
  ];

  const sampleAddresses = [
    {
      chain: "ETH",
      address: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
      label: "Vitalik",
    },
    {
      chain: "BTC",
      address: "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa",
      label: "Genesis",
    },
    {
      chain: "SOL",
      address: "9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM",
      label: "Solana Ecosystem",
    },
    {
      chain: "Polymarket",
      address: "0x259689a1594081a808a9bc7300c2a0fac7fc56d0",
      label: "Predictions #1",
    },
    {
      chain: "Polymarket",
      address: "0x45e842555d3a1d418bb7b7f8a0c1caf9ee297e8d",
      label: "Predictions #2",
    },
  ];

  return (
    <div className="w-full">
      {/* Search Box */}
      <div className="mb-8">
        <div className="flex gap-2">
          <div className="flex-1 flex gap-2">
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter wallet address (ETH, BTC, or SOL)"
              className="flex-1 px-4 py-3 bg-[#1a1a1a] border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 text-white placeholder-gray-500"
            />
            {isEvmAddress(address) && (
              <select
                value={selectedChain}
                onChange={(e) => setSelectedChain(e.target.value)}
                className="px-4 py-3 bg-[#1a1a1a] border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 text-white min-w-[180px]"
              >
                {evmChains.map((chain) => (
                  <option key={chain.id} value={chain.id}>
                    {chain.icon} {chain.name}
                  </option>
                ))}
              </select>
            )}
          </div>
          <button
            onClick={fetchData}
            disabled={loading}
            className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {loading ? "Loading..." : "Explore"}
          </button>
        </div>

        {/* Sample Addresses */}
        <div className="mt-4 flex gap-2 flex-wrap">
          <span className="text-gray-400 text-sm">Try:</span>
          {sampleAddresses.map((sample) => (
            <button
              key={sample.address}
              onClick={() => {
                setAddress(sample.address);
                // Set Polymarket addresses to polygon chain by default
                if (polymarketAddresses.includes(sample.address)) {
                  setSelectedChain("polygon");
                }
              }}
              className="text-xs px-3 py-1 bg-gray-800 hover:bg-gray-700 rounded-full text-blue-400 transition-colors"
            >
              {sample.chain} -{" "}
              {sample.label ||
                `${sample.address.slice(0, 6)}...${sample.address.slice(-4)}`}
            </button>
          ))}
        </div>

        {error && (
          <div className="mt-4 p-4 bg-red-900/20 border border-red-500 rounded-lg text-red-400">
            {error}
          </div>
        )}
      </div>

      {/* Results */}
      {(assetsData || transactionsData) && (
        <div className="bg-[#1a1a1a] rounded-lg border border-gray-800 overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-gray-800">
            <button
              onClick={() => setActiveTab("assets")}
              className={`px-6 py-4 font-semibold transition-colors ${
                activeTab === "assets"
                  ? "bg-[#2a2a2a] text-blue-400 border-b-2 border-blue-400"
                  : "text-gray-400 hover:text-gray-300"
              }`}
            >
              Assets
            </button>
            <button
              onClick={() => setActiveTab("transactions")}
              className={`px-6 py-4 font-semibold transition-colors ${
                activeTab === "transactions"
                  ? "bg-[#2a2a2a] text-blue-400 border-b-2 border-blue-400"
                  : "text-gray-400 hover:text-gray-300"
              }`}
            >
              Transactions ({transactionsData?.transactions?.length || 0})
            </button>
            <button
              onClick={() => setActiveTab("api")}
              className={`px-6 py-4 font-semibold transition-colors ${
                activeTab === "api"
                  ? "bg-[#2a2a2a] text-blue-400 border-b-2 border-blue-400"
                  : "text-gray-400 hover:text-gray-300"
              }`}
            >
              API Response
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === "assets" && assetsData && (
              <div>
                {assetsData.topAssets && assetsData.topAssets.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-4">
                      {assetsData.chain === "Polymarket"
                        ? "Prediction Market Positions"
                        : "Top 5 Assets by Market Value"}
                      {assetsData.totalAssets
                        ? ` (Showing ${assetsData.topAssets.length} of ${assetsData.totalAssets})`
                        : ""}
                    </h3>
                    <div className="space-y-3">
                      {assetsData.topAssets.map((asset: any, idx: number) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-4 bg-[#0a0a0a] rounded-lg border border-gray-800"
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                asset.isNative
                                  ? "bg-gradient-to-br from-purple-500 to-blue-600"
                                  : "bg-gradient-to-br from-blue-500 to-purple-600"
                              }`}
                            >
                              <span className="text-lg font-bold">
                                {asset.symbol?.[0] || "?"}
                              </span>
                            </div>
                            <div className="flex-1">
                              {/* Special Polymarket Display */}
                              {asset.metadata?.title ? (
                                <div>
                                  <div className="font-semibold text-blue-400">
                                    {asset.metadata.title}
                                  </div>
                                  <div className="text-sm text-gray-300 mt-1">
                                    <span className="font-medium">Bet:</span>{" "}
                                    <span
                                      className={
                                        asset.metadata.outcome === "Up" ||
                                        asset.metadata.outcome === "Yes"
                                          ? "text-green-400"
                                          : "text-red-400"
                                      }
                                    >
                                      {asset.metadata.outcome}
                                    </span>
                                    {asset.metadata.avgPrice && (
                                      <>
                                        {" • "}
                                        <span className="text-gray-400">
                                          Avg Price: ${asset.metadata.avgPrice}
                                        </span>
                                      </>
                                    )}
                                  </div>
                                  {asset.metadata.cashPnl !== undefined && (
                                    <div className="text-xs mt-1">
                                      <span
                                        className={
                                          asset.metadata.cashPnl >= 0
                                            ? "text-green-400"
                                            : "text-red-400"
                                        }
                                      >
                                        PnL: $
                                        {asset.metadata.cashPnl.toFixed(2)} (
                                        {asset.metadata.percentPnl?.toFixed(1)}
                                        %)
                                      </span>
                                      {asset.metadata.redeemable && (
                                        <span className="ml-2 text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">
                                          Redeemable
                                        </span>
                                      )}
                                    </div>
                                  )}
                                </div>
                              ) : (
                                /* Regular Asset Display */
                                <div>
                                  <div className="font-semibold">
                                    {asset.symbol || "Unknown"}
                                    {asset.isNative && (
                                      <span className="ml-2 text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded">
                                        Native
                                      </span>
                                    )}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {asset.name ||
                                      asset.contractAddress?.slice(0, 10) ||
                                      "Native Asset"}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold">
                              {formatBalance(
                                asset.balance || "0",
                                asset.decimals || 18,
                              )}{" "}
                              {asset.symbol || ""}
                            </div>
                            {asset.marketValue !== undefined &&
                              asset.marketValue > 0 && (
                                <div className="text-sm text-gray-400">
                                  $
                                  {asset.marketValue.toLocaleString("en-US", {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                  })}{" "}
                                  USD
                                </div>
                              )}
                            {/* Show current market value even if 0 for Polymarket */}
                            {asset.metadata?.title &&
                              asset.marketValue === 0 && (
                                <div className="text-sm text-gray-500">
                                  $0.00 USD (Expired)
                                </div>
                              )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {(!assetsData.topAssets ||
                  assetsData.topAssets.length === 0) && (
                  <div className="p-6 bg-[#0a0a0a] rounded-lg border border-gray-800 text-center text-gray-400">
                    No assets with CoinMarketCap price data found
                  </div>
                )}

                {assetsData.note && (
                  <div className="mt-4 p-4 bg-yellow-900/20 border border-yellow-500 rounded-lg text-yellow-400 text-sm">
                    {assetsData.note}
                  </div>
                )}
              </div>
            )}

            {activeTab === "transactions" && transactionsData && (
              <div>
                {transactionsData.transactions?.length > 0 ? (
                  <div className="space-y-3">
                    {transactionsData.transactions.map(
                      (tx: Transaction, idx: number) => {
                        const txHash = tx.hash || tx.txid || tx.signature || "";
                        const displayHash =
                          txHash.slice(0, 10) + "..." + txHash.slice(-8);

                        // Generate block explorer URL based on chain
                        const getExplorerUrl = (
                          chainName: string,
                          chainId: string | undefined,
                          hash: string,
                        ): string => {
                          // Map chainId to explorer URLs
                          const explorerMap: Record<string, string> = {
                            ethereum: `https://etherscan.io/tx/${hash}`,
                            base: `https://basescan.org/tx/${hash}`,
                            arbitrum: `https://arbiscan.io/tx/${hash}`,
                            optimism: `https://optimistic.etherscan.io/tx/${hash}`,
                            polygon: `https://polygonscan.com/tx/${hash}`,
                            bsc: `https://bscscan.com/tx/${hash}`,
                            avalanche: `https://snowtrace.io/tx/${hash}`,
                            fantom: `https://ftmscan.com/tx/${hash}`,
                            gnosis: `https://gnosisscan.io/tx/${hash}`,
                            celo: `https://celoscan.io/tx/${hash}`,
                            moonbeam: `https://moonscan.io/tx/${hash}`,
                            cronos: `https://cronoscan.com/tx/${hash}`,
                            zksync: `https://explorer.zksync.io/tx/${hash}`,
                            linea: `https://lineascan.build/tx/${hash}`,
                            scroll: `https://scrollscan.com/tx/${hash}`,
                            mantle: `https://explorer.mantle.xyz/tx/${hash}`,
                          };

                          // Try chainId first, then fallback to chain name matching
                          if (chainId && explorerMap[chainId]) {
                            return explorerMap[chainId];
                          }

                          // Fallback for legacy chain names
                          if (chainName === "BTC" || chainName === "Bitcoin") {
                            return `https://blockstream.info/tx/${hash}`;
                          }
                          if (chainName === "SOL" || chainName === "Solana") {
                            return `https://solscan.io/tx/${hash}`;
                          }
                          if (chainName === "ETH" || chainName === "Ethereum") {
                            return `https://etherscan.io/tx/${hash}`;
                          }

                          return "#";
                        };

                        const explorerUrl = getExplorerUrl(
                          transactionsData.chain,
                          transactionsData.chainId,
                          txHash,
                        );

                        const categoryColors: Record<string, string> = {
                          transfer:
                            "bg-blue-500/20 text-blue-400 border-blue-500/30",
                          swap: "bg-purple-500/20 text-purple-400 border-purple-500/30",
                          minting_runes:
                            "bg-orange-500/20 text-orange-400 border-orange-500/30",
                          minting_ordinals:
                            "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
                          data_inscription:
                            "bg-amber-500/20 text-amber-400 border-amber-500/30",
                          bridging:
                            "bg-green-500/20 text-green-400 border-green-500/30",
                          defi: "bg-pink-500/20 text-pink-400 border-pink-500/30",
                          nft: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
                          consolidation:
                            "bg-indigo-500/20 text-indigo-400 border-indigo-500/30",
                          distribution:
                            "bg-violet-500/20 text-violet-400 border-violet-500/30",
                          contract_interaction:
                            "bg-fuchsia-500/20 text-fuchsia-400 border-fuchsia-500/30",
                          approval:
                            "bg-sky-500/20 text-sky-400 border-sky-500/30",
                          reverted:
                            "bg-red-500/20 text-red-400 border-red-500/30",
                          unknown:
                            "bg-gray-500/20 text-gray-400 border-gray-500/30",
                        };
                        const categoryColor =
                          categoryColors[tx.category || "unknown"] ||
                          categoryColors["unknown"];

                        return (
                          <div
                            key={idx}
                            className="p-4 bg-[#0a0a0a] rounded-lg border border-gray-800 hover:border-gray-700 transition-colors"
                          >
                            <div className="flex justify-between items-start mb-2">
                              <a
                                href={explorerUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm font-mono text-gray-400 hover:text-blue-400 flex-1 mr-4 transition-colors cursor-pointer"
                              >
                                {displayHash}
                                <span className="ml-2 text-xs">↗</span>
                              </a>
                              <div className="flex gap-2 items-center">
                                {tx.category && (
                                  <span
                                    className={`text-xs px-2 py-1 rounded-full border ${categoryColor}`}
                                  >
                                    {tx.category
                                      .replace(/_/g, " ")
                                      .toUpperCase()}
                                  </span>
                                )}
                                <div className="text-sm text-blue-400">
                                  {tx.asset || transactionsData.chain}
                                </div>
                              </div>
                            </div>
                            <div className="text-sm text-gray-500 space-y-1">
                              {tx.from && (
                                <div>From: {tx.from.slice(0, 12)}...</div>
                              )}
                              {tx.to && <div>To: {tx.to.slice(0, 12)}...</div>}
                              {tx.value && <div>Value: {tx.value}</div>}
                              {tx.blockNum && <div>Block: {tx.blockNum}</div>}
                              {tx.blockNumber && (
                                <div>Block: {tx.blockNumber}</div>
                              )}
                              {tx.blockHeight && (
                                <div>Block: {tx.blockHeight}</div>
                              )}
                              {tx.slot && <div>Slot: {tx.slot}</div>}
                              {tx.fee && <div>Fee: {tx.fee} sats</div>}
                              {tx.blockTime && (
                                <div>
                                  Time:{" "}
                                  {new Date(
                                    tx.blockTime * 1000,
                                  ).toLocaleString()}
                                </div>
                              )}
                              {tx.timeStamp && (
                                <div>
                                  Time:{" "}
                                  {new Date(
                                    parseInt(tx.timeStamp) * 1000,
                                  ).toLocaleString()}
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      },
                    )}
                  </div>
                ) : (
                  <div className="text-center text-gray-400 py-8">
                    No transactions found
                  </div>
                )}

                {transactionsData.note && (
                  <div className="mt-4 p-4 bg-yellow-900/20 border border-yellow-500 rounded-lg text-yellow-400 text-sm">
                    {transactionsData.note}
                  </div>
                )}
              </div>
            )}

            {activeTab === "api" && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-blue-400">
                    GET /api/assets
                  </h3>
                  <pre className="bg-[#0a0a0a] p-4 rounded-lg border border-gray-800 overflow-x-auto text-sm">
                    {JSON.stringify(assetsData, null, 2)}
                  </pre>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-purple-400">
                    GET /api/transactions
                  </h3>
                  <pre className="bg-[#0a0a0a] p-4 rounded-lg border border-gray-800 overflow-x-auto text-sm">
                    {JSON.stringify(transactionsData, null, 2)}
                  </pre>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Initial State - Show API Docs */}
      {!assetsData && !transactionsData && !loading && (
        <div className="bg-[#1a1a1a] rounded-lg border border-gray-800 p-8">
          <h2 className="text-2xl font-bold mb-6 text-center">
            How to use it?
          </h2>
          <div className="space-y-4 text-gray-300">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                1
              </div>
              <div>
                <strong>Pass any address</strong> - It auto-detects Ethereum
                (0x...), Bitcoin (1/3/bc1...), or Solana (base58)
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                2
              </div>
              <div>
                <strong>GET /api/assets</strong> - Returns native balance +
                token holdings
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                3
              </div>
              <div>
                <strong>GET /api/transactions</strong> - Returns last 20
                transactions
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                4
              </div>
              <div>
                <strong>Consistent JSON schema</strong> - Across all chains
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                5
              </div>
              <div>
                <strong>5-minute caching</strong> - To keep things fast and
                cheap
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
