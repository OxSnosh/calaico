"use client";

import { useState } from "react";

type Section =
  | "overview"
  | "quickstart"
  | "authentication"
  | "chain-detection"
  | "caching"
  | "error-handling"
  | "polymarket"
  | "assets"
  | "transactions"
  | "assets-schema"
  | "transactions-schema";

export default function DocsPage() {
  const [activeSection, setActiveSection] = useState<Section>("overview");
  const [address, setAddress] = useState("");
  const [chain, setChain] = useState("ethereum");
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const chains = [
    "ethereum",
    "base",
    "arbitrum",
    "optimism",
    "polygon",
    "bsc",
    "avalanche",
    "fantom",
    "gnosis",
    "celo",
    "moonbeam",
    "cronos",
    "zksync",
    "linea",
    "scroll",
    "mantle",
  ];

  const handleQuery = async (endpoint: "assets" | "transactions") => {
    if (!address) {
      setError("Address is required");
      return;
    }

    setLoading(true);
    setError("");
    setResponse(null);

    try {
      const url = `/api/${endpoint}?address=${encodeURIComponent(address)}&chain=${chain}`;

      const res = await fetch(url);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Request failed");
      }

      setResponse(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-[#121212] border-r border-gray-800 fixed h-full overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-8">
            <span className="text-2xl">🐱</span>
            <span className="text-xl font-bold">AlCalico</span>
            <span className="text-xs bg-blue-600 px-2 py-0.5 rounded">
              v1.0
            </span>
          </div>

          <nav className="space-y-6">
            <div>
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Getting Started
              </h3>
              <div className="space-y-1">
                <button
                  onClick={() => setActiveSection("overview")}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                    activeSection === "overview"
                      ? "bg-[#1a1a1a] text-white"
                      : "text-gray-400 hover:text-white hover:bg-[#1a1a1a]"
                  }`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveSection("quickstart")}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                    activeSection === "quickstart"
                      ? "bg-[#1a1a1a] text-white"
                      : "text-gray-400 hover:text-white hover:bg-[#1a1a1a]"
                  }`}
                >
                  Quickstart
                </button>
                <button
                  onClick={() => setActiveSection("authentication")}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                    activeSection === "authentication"
                      ? "bg-[#1a1a1a] text-white"
                      : "text-gray-400 hover:text-white hover:bg-[#1a1a1a]"
                  }`}
                >
                  Authentication
                </button>
              </div>
            </div>

            <div>
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Core Concepts
              </h3>
              <div className="space-y-1">
                <button
                  onClick={() => setActiveSection("chain-detection")}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                    activeSection === "chain-detection"
                      ? "bg-[#1a1a1a] text-white"
                      : "text-gray-400 hover:text-white hover:bg-[#1a1a1a]"
                  }`}
                >
                  Chain Detection
                </button>
                <button
                  onClick={() => setActiveSection("caching")}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                    activeSection === "caching"
                      ? "bg-[#1a1a1a] text-white"
                      : "text-gray-400 hover:text-white hover:bg-[#1a1a1a]"
                  }`}
                >
                  Caching
                </button>
                <button
                  onClick={() => setActiveSection("error-handling")}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                    activeSection === "error-handling"
                      ? "bg-[#1a1a1a] text-white"
                      : "text-gray-400 hover:text-white hover:bg-[#1a1a1a]"
                  }`}
                >
                  Error Handling
                </button>
                <button
                  onClick={() => setActiveSection("polymarket")}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                    activeSection === "polymarket"
                      ? "bg-[#1a1a1a] text-white"
                      : "text-gray-400 hover:text-white hover:bg-[#1a1a1a]"
                  }`}
                >
                  Polymarket Integration
                </button>
              </div>
            </div>

            <div>
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                API Reference
              </h3>
              <div className="space-y-1">
                <button
                  onClick={() => setActiveSection("assets")}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                    activeSection === "assets"
                      ? "bg-[#1a1a1a] text-white"
                      : "text-gray-400 hover:text-white hover:bg-[#1a1a1a]"
                  }`}
                >
                  GET /api/assets
                </button>
                <button
                  onClick={() => setActiveSection("transactions")}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                    activeSection === "transactions"
                      ? "bg-[#1a1a1a] text-white"
                      : "text-gray-400 hover:text-white hover:bg-[#1a1a1a]"
                  }`}
                >
                  GET /api/transactions
                </button>
              </div>
            </div>

            <div>
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Response Schema
              </h3>
              <div className="space-y-1">
                <button
                  onClick={() => setActiveSection("assets-schema")}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                    activeSection === "assets-schema"
                      ? "bg-[#1a1a1a] text-white"
                      : "text-gray-400 hover:text-white hover:bg-[#1a1a1a]"
                  }`}
                >
                  Assets Schema
                </button>
                <button
                  onClick={() => setActiveSection("transactions-schema")}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                    activeSection === "transactions-schema"
                      ? "bg-[#1a1a1a] text-white"
                      : "text-gray-400 hover:text-white hover:bg-[#1a1a1a]"
                  }`}
                >
                  Transactions Schema
                </button>
              </div>
            </div>
          </nav>

          <div className="mt-8 pt-6 border-t border-gray-800">
            <a
              href="/"
              className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-2"
            >
              <span>←</span>
              <span>Back to Explorer</span>
            </a>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 ml-64">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-8">
          {/* Documentation Content (2/3 width) */}
          <div className="lg:col-span-2 space-y-6">
            {activeSection === "overview" && (
              <>
                <h1 className="text-4xl font-bold mb-4">
                  Multi-Chain Wallet Explorer API
                </h1>
                <p className="text-gray-400 text-lg mb-6">
                  Query wallet balances and transactions across 19 platforms: 18
                  blockchains + Polymarket prediction markets with a unified
                  REST API.
                </p>

                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-semibold mb-3">
                      Introduction
                    </h2>
                    <p className="text-gray-400 leading-relaxed">
                      The Multi-Chain Wallet Explorer API provides a simple,
                      unified interface to query wallet information across
                      multiple blockchain networks and prediction markets.
                      Whether you're building a portfolio tracker, analytics
                      dashboard, or multi-chain wallet interface, our API
                      handles the complexity of different blockchain protocols
                      and includes comprehensive support for Polymarket
                      prediction market positions.
                    </p>
                  </div>

                  <div className="bg-[#1a1a1a] border border-gray-800 rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-3">
                      Supported Chains
                    </h3>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      {[
                        { icon: "⟠", name: "Ethereum" },
                        { icon: "🔵", name: "Base" },
                        { icon: "🔷", name: "Arbitrum" },
                        { icon: "🔴", name: "Optimism" },
                        { icon: "🟣", name: "Polygon" },
                        { icon: "🟡", name: "BNB Chain" },
                        { icon: "🎯", name: "Polymarket" },
                        { icon: "₿", name: "Bitcoin" },
                        { icon: "◎", name: "Solana" },
                      ].map((chain) => (
                        <div
                          key={chain.name}
                          className="flex items-center gap-2"
                        >
                          <span>{chain.icon}</span>
                          <span>{chain.name}</span>
                        </div>
                      ))}
                      <div className="col-span-2 text-gray-500 text-xs mt-2">
                        + 10 more EVM chains (Avalanche, Fantom, Gnosis, Celo,
                        Moonbeam, Cronos, zkSync, Linea, Scroll, Mantle)
                      </div>
                    </div>
                  </div>

                  <div>
                    <h2 className="text-2xl font-semibold mb-3">Quick Start</h2>
                    <p className="text-gray-400 mb-4">
                      Make a simple GET request to query any wallet:
                    </p>
                    <div className="bg-[#0d1117] border border-gray-800 rounded-lg p-4 font-mono text-sm">
                      <div className="text-gray-500 mb-2">
                        # Get wallet assets
                      </div>
                      <div className="text-blue-400">
                        GET /api/assets?address=0xd8dA6...&chain=ethereum
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-900/20 border border-blue-800 rounded-lg p-4">
                    <h4 className="font-semibold mb-2">🚀 Features</h4>
                    <ul className="space-y-2 text-sm text-gray-400">
                      <li>• Auto-detection of chain from address format</li>
                      <li>• Top 5 assets sorted by USD market value</li>
                      <li>• Real-time price data from CoinMarketCap</li>
                      <li>
                        • Smart transaction categorization (15 categories)
                      </li>
                      <li>
                        • Universal Polymarket detection for prediction market
                        activity
                      </li>
                      <li>
                        • Only shows top 100 tokens by market cap (reduces spam)
                      </li>
                      <li>• 5-minute caching for optimal performance</li>
                    </ul>
                  </div>
                </div>
              </>
            )}

            {activeSection === "quickstart" && (
              <>
                <h1 className="text-4xl font-bold mb-4">Quickstart</h1>
                <p className="text-gray-400 text-lg mb-6">
                  Get up and running in under 5 minutes. You'll need Node.js 18+
                  and a CoinMarketCap API key for token price data.
                </p>

                <div className="space-y-8">
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-sm">
                        1
                      </span>
                      <h3 className="text-xl font-semibold">Clone & Install</h3>
                    </div>
                    <p className="text-gray-400 mb-4">
                      Install all dependencies with a single command.
                    </p>
                    <div className="bg-[#0d1117] border border-gray-800 rounded-lg p-4 font-mono text-sm">
                      <div className="text-gray-500 mb-2">
                        # Clone the repository
                      </div>
                      <div className="text-blue-400 mb-3">
                        git clone https://github.com/oxsnosh/wallet-explorer
                      </div>
                      <div className="text-blue-400 mb-3">
                        cd wallet-explorer
                      </div>
                      <div className="text-gray-500 mb-2">
                        # Install dependencies
                      </div>
                      <div className="text-blue-400">npm install</div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-sm">
                        2
                      </span>
                      <h3 className="text-xl font-semibold">
                        Configure Environment
                      </h3>
                    </div>
                    <p className="text-gray-400 mb-4">
                      Create a{" "}
                      <code className="bg-[#1a1a1a] px-2 py-0.5 rounded">
                        .env.local
                      </code>{" "}
                      file and add your CoinMarketCap API key.
                    </p>
                    <div className="bg-[#0d1117] border border-gray-800 rounded-lg p-4 font-mono text-sm">
                      <div className="text-gray-500 mb-2"># .env.local</div>
                      <div className="text-blue-400">
                        COIN_MKTCAP_API_KEY=your_api_key_here
                      </div>
                    </div>
                    <div className="mt-3 text-sm text-gray-400">
                      Get your free API key from{" "}
                      <a
                        href="https://coinmarketcap.com/api/"
                        target="_blank"
                        className="text-blue-400 hover:underline"
                      >
                        CoinMarketCap →
                      </a>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-sm">
                        3
                      </span>
                      <h3 className="text-xl font-semibold">
                        Start the Server
                      </h3>
                    </div>
                    <p className="text-gray-400 mb-4">
                      Run the development server with hot-reload.
                    </p>
                    <div className="bg-[#0d1117] border border-gray-800 rounded-lg p-4 font-mono text-sm">
                      <div className="text-blue-400 mb-3">npm run dev</div>
                      <div className="text-gray-500">
                        # ✓ Server running at http://localhost:3000
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-sm">
                        4
                      </span>
                      <h3 className="text-xl font-semibold">
                        Make Your First Request
                      </h3>
                    </div>
                    <p className="text-gray-400 mb-4">
                      Query any wallet. No chain parameter needed—chain is
                      auto-detected.
                    </p>
                    <div className="bg-[#0d1117] border border-gray-800 rounded-lg p-4 font-mono text-sm">
                      <div className="text-gray-500 mb-2">
                        # Query a Bitcoin wallet
                      </div>
                      <div className="text-blue-400 mb-4">
                        curl
                        "http://localhost:3000/api/assets?address=1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa"
                      </div>
                      <div className="text-gray-500 mb-2">
                        # Query an Ethereum wallet
                      </div>
                      <div className="text-blue-400">
                        curl
                        "http://localhost:3000/api/assets?address=0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045"
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {activeSection === "authentication" && (
              <>
                <h1 className="text-4xl font-bold mb-4">Authentication</h1>
                <p className="text-gray-400 text-lg mb-6">
                  This is a server-side proxy. Your API keys stay on the server
                  in{" "}
                  <code className="bg-[#1a1a1a] px-2 py-0.5 rounded">
                    .env.local
                  </code>{" "}
                  — the client only talks to our API endpoints. No keys are
                  exposed to the browser.
                </p>

                <div className="space-y-6">
                  <div className="bg-[#1a1a1a] border border-gray-800 rounded-lg overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-[#0a0a0a]">
                        <tr>
                          <th className="text-left p-3 font-semibold">Chain</th>
                          <th className="text-left p-3 font-semibold">
                            Data Provider
                          </th>
                          <th className="text-left p-3 font-semibold">
                            API Key Required
                          </th>
                        </tr>
                      </thead>
                      <tbody className="text-gray-400">
                        <tr className="border-t border-gray-800">
                          <td className="p-3">ETH (16 chains)</td>
                          <td className="p-3">Blockscout + CoinMarketCap</td>
                          <td className="p-3">Yes (CMC only)</td>
                        </tr>
                        <tr className="border-t border-gray-800">
                          <td className="p-3">BTC</td>
                          <td className="p-3">Blockstream Esplora</td>
                          <td className="p-3">No</td>
                        </tr>
                        <tr className="border-t border-gray-800">
                          <td className="p-3">SOL</td>
                          <td className="p-3">Solana Public RPC</td>
                          <td className="p-3">No</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-4">
                      Environment Variables
                    </h3>
                    <div className="bg-yellow-900/20 border border-yellow-800 rounded-lg p-4 mb-4">
                      <p className="text-sm text-yellow-400">
                        ⚠️ Never commit your{" "}
                        <code className="bg-[#0a0a0a] px-1 py-0.5 rounded">
                          .env.local
                        </code>{" "}
                        file. It is listed in{" "}
                        <code className="bg-[#0a0a0a] px-1 py-0.5 rounded">
                          .gitignore
                        </code>
                        .
                      </p>
                    </div>
                    <div className="bg-[#0d1117] border border-gray-800 rounded-lg p-4 font-mono text-sm">
                      <div className="text-gray-500 mb-2"># .env.local</div>
                      <div className="text-blue-400 mb-2">
                        COIN_MKTCAP_API_KEY=your_coinmarketcap_api_key_here
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {activeSection === "chain-detection" && (
              <>
                <h1 className="text-4xl font-bold mb-4">Chain Detection</h1>
                <p className="text-gray-400 text-lg mb-6">
                  You never need to specify which blockchain you're querying.
                  The API analyzes the address format using regex patterns and
                  determines the chain automatically.
                </p>

                <div className="space-y-6">
                  <div className="bg-[#1a1a1a] border border-gray-800 rounded-lg overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-[#0a0a0a]">
                        <tr>
                          <th className="text-left p-3 font-semibold">
                            Format
                          </th>
                          <th className="text-left p-3 font-semibold">Chain</th>
                          <th className="text-left p-3 font-semibold">
                            Example
                          </th>
                        </tr>
                      </thead>
                      <tbody className="text-gray-400 font-mono text-xs">
                        <tr className="border-t border-gray-800">
                          <td className="p-3">0x + 40 hex chars</td>
                          <td className="p-3">ETH / EVM</td>
                          <td className="p-3">0x742d35Cc...</td>
                        </tr>
                        <tr className="border-t border-gray-800">
                          <td className="p-3">Starts with 1, base58</td>
                          <td className="p-3">BTC (P2PKH)</td>
                          <td className="p-3">1A1zP1eP5Q...</td>
                        </tr>
                        <tr className="border-t border-gray-800">
                          <td className="p-3">Starts with 3, base58</td>
                          <td className="p-3">BTC (P2SH)</td>
                          <td className="p-3">3J98t1WpEZ...</td>
                        </tr>
                        <tr className="border-t border-gray-800">
                          <td className="p-3">Starts with bc1, bech32</td>
                          <td className="p-3">BTC (Bech32)</td>
                          <td className="p-3">bc1qar0srrr...</td>
                        </tr>
                        <tr className="border-t border-gray-800">
                          <td className="p-3">32-44 base58 chars</td>
                          <td className="p-3">SOL</td>
                          <td className="p-3">5Q544fKrFoe...</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="bg-blue-900/20 border border-blue-800 rounded-lg p-4">
                    <p className="text-sm text-blue-400">
                      💡 Detection order matters: ETH is checked first
                      (unambiguous{" "}
                      <code className="bg-[#0a0a0a] px-1 py-0.5 rounded">
                        0x
                      </code>{" "}
                      prefix), BTC before SOL (both use base58 but BTC has
                      distinct leading characters).
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-4">
                      Detection Code
                    </h3>
                    <div className="bg-[#0d1117] border border-gray-800 rounded-lg p-4 font-mono text-xs overflow-x-auto">
                      <pre className="text-gray-300">{`// Detection order (ETH → BTC → SOL → null)
if (/^0x[a-fA-F0-9]{40}$/.test(addr))         return 'ETH';
if (/^1[a-zA-Z0-9]{25,34}$/.test(addr))       return 'BTC'; // P2PKH
if (/^3[a-zA-Z0-9]{25,34}$/.test(addr))       return 'BTC'; // P2SH
if (/^bc1[a-zA-Z0-9]{6,87}$/.test(addr))      return 'BTC'; // Bech32
if (/^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(addr)) return 'SOL';
return null; // → 422 UNRECOGNIZED_ADDRESS`}</pre>
                    </div>
                  </div>
                </div>
              </>
            )}

            {activeSection === "caching" && (
              <>
                <h1 className="text-4xl font-bold mb-4">Caching</h1>
                <p className="text-gray-400 text-lg mb-6">
                  The API uses in-memory caching to reduce vendor API calls and
                  improve response latency. Cached responses are served
                  immediately without hitting upstream APIs.
                </p>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold mb-4">
                      Cache Behavior
                    </h3>
                    <ul className="space-y-2 text-gray-400">
                      <li>
                        • <strong className="text-white">TTL:</strong> 5 minutes
                        (300 seconds) for asset/transaction data
                      </li>
                      <li>
                        • <strong className="text-white">TTL:</strong> 1 hour
                        (3600 seconds) for top 100 token lists per chain
                      </li>
                      <li>
                        • <strong className="text-white">Scope:</strong> Cache
                        is per-endpoint — assets and transactions are cached
                        separately
                      </li>
                      <li>
                        • <strong className="text-white">Storage:</strong> Cache
                        is in-process — cleared on server restart
                      </li>
                      <li>
                        • <strong className="text-white">Dependencies:</strong>{" "}
                        No external Redis or Memcached required
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-4">
                      Cache Key Format
                    </h3>
                    <p className="text-gray-400 mb-4">
                      Keys follow the pattern{" "}
                      <code className="bg-[#1a1a1a] px-2 py-0.5 rounded text-blue-400">
                        {"{CHAIN}:{address}:{endpoint}"}
                      </code>
                      :
                    </p>
                    <div className="bg-[#0d1117] border border-gray-800 rounded-lg p-4 font-mono text-sm">
                      <div className="text-gray-400">
                        ETH:0x742d...44e:assets
                      </div>
                      <div className="text-gray-400">
                        BTC:bc1qar0...mdq:transactions
                      </div>
                      <div className="text-gray-400">
                        SOL:5Q544...4j1:assets
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-4">
                      Observe Caching
                    </h3>
                    <div className="bg-[#0d1117] border border-gray-800 rounded-lg p-4 font-mono text-sm">
                      <div className="text-gray-500 mb-2">
                        # First request → fresh data from API
                      </div>
                      <div className="text-blue-400 mb-4">
                        curl
                        "http://localhost:3000/api/assets?address=0xd8dA6..."
                      </div>
                      <div className="text-gray-500 mb-2">
                        # Response includes source field
                      </div>
                      <div className="text-gray-400 mb-4">
                        {
                          '{ "address": "...", "source": "live", "cachedAt": "2026-02-23T..." }'
                        }
                      </div>
                      <div className="text-gray-500 mb-2">
                        # Same request within 5 min → instant, from cache
                      </div>
                      <div className="text-blue-400 mb-4">
                        curl
                        "http://localhost:3000/api/assets?address=0xd8dA6..."
                      </div>
                      <div className="text-gray-500 mb-2">
                        # Response shows cached source
                      </div>
                      <div className="text-gray-400">
                        {
                          '{ "address": "...", "source": "cache", "cachedAt": "2026-02-23T..." }'
                        }
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {activeSection === "error-handling" && (
              <>
                <h1 className="text-4xl font-bold mb-4">Error Handling</h1>
                <p className="text-gray-400 text-lg mb-6">
                  All errors return a consistent JSON body with an{" "}
                  <code className="bg-[#1a1a1a] px-2 py-0.5 rounded">
                    error
                  </code>{" "}
                  message and a machine-readable{" "}
                  <code className="bg-[#1a1a1a] px-2 py-0.5 rounded">code</code>{" "}
                  string.
                </p>

                <div className="space-y-6">
                  <div className="bg-[#1a1a1a] border border-gray-800 rounded-lg overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-[#0a0a0a]">
                        <tr>
                          <th className="text-left p-3 font-semibold">
                            Status
                          </th>
                          <th className="text-left p-3 font-semibold">Code</th>
                          <th className="text-left p-3 font-semibold">
                            Description
                          </th>
                        </tr>
                      </thead>
                      <tbody className="text-gray-400">
                        <tr className="border-t border-gray-800">
                          <td className="p-3 font-mono text-yellow-400">400</td>
                          <td className="p-3 font-mono text-xs">
                            MISSING_ADDRESS
                          </td>
                          <td className="p-3">
                            The address query parameter is absent from the
                            request
                          </td>
                        </tr>
                        <tr className="border-t border-gray-800">
                          <td className="p-3 font-mono text-yellow-400">422</td>
                          <td className="p-3 font-mono text-xs">
                            UNRECOGNIZED_ADDRESS
                          </td>
                          <td className="p-3">
                            Address format doesn't match any supported chain
                          </td>
                        </tr>
                        <tr className="border-t border-gray-800">
                          <td className="p-3 font-mono text-red-400">502</td>
                          <td className="p-3 font-mono text-xs">
                            VENDOR_API_ERROR
                          </td>
                          <td className="p-3">
                            Upstream data provider returned an error or timed
                            out
                          </td>
                        </tr>
                        <tr className="border-t border-gray-800">
                          <td className="p-3 font-mono text-red-400">500</td>
                          <td className="p-3 font-mono text-xs">
                            INTERNAL_ERROR
                          </td>
                          <td className="p-3">
                            An unexpected server-side error occurred
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold mb-3">
                        400 — Missing Address
                      </h3>
                      <div className="bg-[#0d1117] border border-gray-800 rounded-lg p-4 font-mono text-sm">
                        <div className="text-gray-500 mb-2">
                          # Missing address param
                        </div>
                        <div className="text-blue-400 mb-4">
                          curl "http://localhost:3000/api/assets"
                        </div>
                        <div className="text-gray-500 mb-2"># Response</div>
                        <div className="text-red-400">{`{
  "error": "address query parameter is required",
  "code": "MISSING_ADDRESS"
}`}</div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-3">
                        422 — Unrecognized Address
                      </h3>
                      <div className="bg-[#0d1117] border border-gray-800 rounded-lg p-4 font-mono text-sm">
                        <div className="text-blue-400 mb-4">
                          curl
                          "http://localhost:3000/api/assets?address=notanaddress"
                        </div>
                        <div className="text-red-400">{`{
  "error": "Cannot determine chain for address: notanaddress",
  "code": "UNRECOGNIZED_ADDRESS"
}`}</div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-3">
                        502 — Vendor API Error
                      </h3>
                      <div className="bg-[#0d1117] border border-gray-800 rounded-lg p-4 font-mono text-sm">
                        <div className="text-red-400">{`{
  "error": "Upstream API error: 429 Too Many Requests",
  "code": "VENDOR_API_ERROR"
}`}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {activeSection === "polymarket" && (
              <div className="p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <h1 className="text-4xl font-bold mb-4">
                  Polymarket Integration
                </h1>

                <div className="prose max-w-none">
                  <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                    Calico includes comprehensive support for Polymarket, the
                    world's largest prediction market platform. The API
                    automatically detects Polymarket activity on any address and
                    provides rich prediction market data.
                  </p>

                  <h2 className="text-2xl font-semibold mb-4">
                    Universal Detection
                  </h2>

                  <p className="mb-4">
                    Unlike traditional blockchain APIs that require you to
                    specify which chain to query, Calico's Polymarket
                    integration uses universal detection:
                  </p>

                  <ul className="list-disc pl-6 mb-6">
                    <li>
                      • Automatically checks any address for Polymarket activity
                      first
                    </li>
                    <li>
                      • No need to specify "Polymarket" as a chain parameter
                    </li>
                    <li>
                      • Falls back to blockchain detection if no Polymarket
                      activity found
                    </li>
                    <li>
                      • Works with any address that has prediction market
                      positions or trading history
                    </li>
                  </ul>

                  <h2 className="text-2xl font-semibold mb-4">
                    Supported Features
                  </h2>

                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                      <h3 className="font-semibold mb-2">Assets Endpoint</h3>
                      <ul className="text-sm space-y-1">
                        <li>• Active prediction market positions</li>
                        <li>• Market titles and descriptions</li>
                        <li>• Current position values and PnL</li>
                        <li>• Redeemable status for settled markets</li>
                        <li>• Position outcomes (YES/NO sides)</li>
                      </ul>
                    </div>

                    <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                      <h3 className="font-semibold mb-2">
                        Transactions Endpoint
                      </h3>
                      <ul className="text-sm space-y-1">
                        <li>• Complete betting history (BUY/SELL/REDEEM)</li>
                        <li>• Trade prices and position sizes</li>
                        <li>• Market context for each trade</li>
                        <li>• USDC trade amounts</li>
                        <li>• Categorized as 'polymarket_bet' type</li>
                      </ul>
                    </div>
                  </div>

                  <h2 className="text-2xl font-semibold mb-4">
                    Sample Addresses
                  </h2>

                  <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg mb-6">
                    <p className="mb-2 font-medium">
                      Try these addresses with known Polymarket activity:
                    </p>
                    <div className="font-mono text-sm space-y-2">
                      <div>0x259689a1594081a808a9bc7300c2a0fac7fc56d0</div>
                      <div>0x45e842555d3a1d418bb7b7f8a0c1caf9ee297e8d</div>
                    </div>
                  </div>

                  <h2 className="text-2xl font-semibold mb-4">
                    API Response Format
                  </h2>

                  <p className="mb-4">
                    Polymarket data is returned in the same unified format as
                    blockchain data, making it easy to integrate into existing
                    applications:
                  </p>

                  <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg mb-6">
                    <pre className="text-sm overflow-x-auto">
                      {`{
  "address": "0x259689...",
  "chain": "Polymarket",
  "chainId": "polymarket",
  "tokens": [
    {
      "symbol": "PM-YES",
      "balance": "1500000000",
      "marketValue": 850.25,
      "metadata": {
        "title": "Will US or Israel strike Iran by June 30, 2026?",
        "outcome": "YES",
        "percentPnl": 32.15,
        "redeemable": false
      }
    }
  ]
}`}
                    </pre>
                  </div>

                  <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 p-4 rounded-lg">
                    <h3 className="font-semibold mb-2">✨ Pro Tip</h3>
                    <p className="text-sm">
                      The Calico UI automatically detects Polymarket addresses
                      and defaults to Polygon chain selection, since Polymarket
                      operates on Polygon for on-chain settlement.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeSection === "assets" && (
              <>
                <div className="flex items-center gap-3 mb-6">
                  <span className="bg-green-600 text-white px-3 py-1 rounded-md text-sm font-semibold">
                    GET
                  </span>
                  <h1 className="text-3xl font-bold font-mono">/api/assets</h1>
                </div>

                <p className="text-gray-400 text-lg mb-8">
                  Returns the native balance and top token holdings for a wallet
                  address. Chain is auto-detected from the address format.
                </p>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold mb-4">
                      Query Parameters
                    </h3>
                    <div className="space-y-4">
                      <div className="bg-[#1a1a1a] border border-gray-800 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-mono text-sm text-blue-400">
                            address
                          </span>
                          <span className="text-xs bg-red-900/30 text-red-400 px-2 py-0.5 rounded font-medium">
                            REQUIRED
                          </span>
                        </div>
                        <p className="text-sm text-gray-400">
                          Wallet address - supports ETH (0x...), BTC (1...,
                          3..., bc1...), and SOL (base58)
                        </p>
                      </div>
                      <div className="bg-[#1a1a1a] border border-gray-800 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-mono text-sm text-blue-400">
                            chain
                          </span>
                          <span className="text-xs bg-blue-900/30 text-blue-400 px-2 py-0.5 rounded font-medium">
                            OPTIONAL
                          </span>
                        </div>
                        <p className="text-sm text-gray-400 mb-2">
                          For EVM addresses, specify which chain to query.
                          Defaults to{" "}
                          <code className="bg-[#0a0a0a] px-1 py-0.5 rounded">
                            ethereum
                          </code>
                        </p>
                        <div className="text-xs text-gray-500 mt-2">
                          Options: ethereum, base, arbitrum, optimism, polygon,
                          bsc, avalanche, fantom, gnosis, celo, moonbeam,
                          cronos, zksync, linea, scroll, mantle
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-4">
                      Response Fields
                    </h3>
                    <div className="bg-[#0d1117] border border-gray-800 rounded-lg p-4 font-mono text-xs overflow-x-auto">
                      <pre className="text-gray-300">{`{
  "address": "string",
  "chain": "ETH" | "BTC" | "SOL",
  "balance": "string",
  "topAssets": [
    {
      "symbol": "string",
      "balance": "string",
      "decimals": number,
      "price": number,
      "marketValue": number,
      "contractAddress"?: "string"
    }
  ],
  "note"?: "string"
}`}</pre>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-4">
                      Example Request
                    </h3>
                    <div className="bg-[#0d1117] border border-gray-800 rounded-lg p-4">
                      <div className="font-mono text-sm">
                        <div className="text-gray-500 mb-2">GET</div>
                        <div className="text-blue-400">
                          /api/assets?address=0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045&chain=ethereum
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {activeSection === "transactions" && (
              <>
                <div className="flex items-center gap-3 mb-6">
                  <span className="bg-green-600 text-white px-3 py-1 rounded-md text-sm font-semibold">
                    GET
                  </span>
                  <h1 className="text-3xl font-bold font-mono">
                    /api/transactions
                  </h1>
                </div>

                <p className="text-gray-400 text-lg mb-8">
                  Returns the last 20 transactions for a wallet address with
                  smart categorization. Supports ETH (16 EVM chains), BTC, and
                  SOL.
                </p>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold mb-4">
                      Query Parameters
                    </h3>
                    <div className="space-y-4">
                      <div className="bg-[#1a1a1a] border border-gray-800 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-mono text-sm text-blue-400">
                            address
                          </span>
                          <span className="text-xs bg-red-900/30 text-red-400 px-2 py-0.5 rounded font-medium">
                            REQUIRED
                          </span>
                        </div>
                        <p className="text-sm text-gray-400">
                          Wallet address to query transactions for
                        </p>
                      </div>
                      <div className="bg-[#1a1a1a] border border-gray-800 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-mono text-sm text-blue-400">
                            chain
                          </span>
                          <span className="text-xs bg-blue-900/30 text-blue-400 px-2 py-0.5 rounded font-medium">
                            OPTIONAL
                          </span>
                        </div>
                        <p className="text-sm text-gray-400">
                          For EVM addresses, specify the chain (default:
                          ethereum)
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-4">
                      Response Fields
                    </h3>
                    <div className="bg-[#0d1117] border border-gray-800 rounded-lg p-4 font-mono text-xs overflow-x-auto">
                      <pre className="text-gray-300">{`{
  "address": "string",
  "chain": "ETH" | "BTC" | "SOL",
  "transactions": [
    {
      "hash": "string",
      "from": "string",
      "to": "string",
      "value": "string",
      "timestamp": number,
      "category": "string",
      "explorerUrl": "string"
    }
  ]
}`}</pre>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-4">
                      Example Request
                    </h3>
                    <div className="bg-[#0d1117] border border-gray-800 rounded-lg p-4">
                      <div className="font-mono text-sm">
                        <div className="text-gray-500 mb-2">GET</div>
                        <div className="text-blue-400">
                          /api/transactions?address=0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045&chain=base
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {activeSection === "assets-schema" && (
              <>
                <h1 className="text-4xl font-bold mb-4">
                  Assets Response Schema
                </h1>
                <p className="text-gray-400 text-lg mb-6">
                  Complete schema for the{" "}
                  <code className="bg-[#1a1a1a] px-2 py-0.5 rounded">
                    /api/assets
                  </code>{" "}
                  endpoint response.
                </p>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold mb-4">
                      Response Fields
                    </h3>
                    <div className="space-y-3">
                      <div className="bg-[#1a1a1a] border border-gray-800 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-mono text-blue-400 text-sm">
                            address
                          </span>
                          <span className="text-xs text-gray-500">string</span>
                        </div>
                        <p className="text-sm text-gray-400">
                          The queried wallet address, echoed back.
                        </p>
                      </div>

                      <div className="bg-[#1a1a1a] border border-gray-800 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-mono text-blue-400 text-sm">
                            chain
                          </span>
                          <span className="text-xs text-gray-500">string</span>
                        </div>
                        <p className="text-sm text-gray-400">
                          Detected chain:{" "}
                          <code className="bg-[#0a0a0a] px-1 py-0.5 rounded">
                            "ETH"
                          </code>
                          ,{" "}
                          <code className="bg-[#0a0a0a] px-1 py-0.5 rounded">
                            "BTC"
                          </code>
                          , or{" "}
                          <code className="bg-[#0a0a0a] px-1 py-0.5 rounded">
                            "SOL"
                          </code>
                          .
                        </p>
                      </div>

                      <div className="bg-[#1a1a1a] border border-gray-800 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-mono text-blue-400 text-sm">
                            balance
                          </span>
                          <span className="text-xs text-gray-500">string</span>
                        </div>
                        <p className="text-sm text-gray-400">
                          Native coin balance in the smallest unit (wei /
                          satoshis / lamports) as a string to avoid precision
                          loss.
                        </p>
                      </div>

                      <div className="bg-[#1a1a1a] border border-gray-800 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-mono text-blue-400 text-sm">
                            topAssets
                          </span>
                          <span className="text-xs text-gray-500">array</span>
                        </div>
                        <p className="text-sm text-gray-400 mb-3">
                          Top 5 assets by USD market value. Each asset object
                          contains:
                        </p>
                        <div className="pl-4 space-y-2 text-sm text-gray-400">
                          <div>
                            <code className="bg-[#0a0a0a] px-1 py-0.5 rounded text-blue-400">
                              symbol
                            </code>{" "}
                            — Token symbol (e.g., "USDC", "WETH")
                          </div>
                          <div>
                            <code className="bg-[#0a0a0a] px-1 py-0.5 rounded text-blue-400">
                              balance
                            </code>{" "}
                            — Token balance as string in smallest unit
                          </div>
                          <div>
                            <code className="bg-[#0a0a0a] px-1 py-0.5 rounded text-blue-400">
                              decimals
                            </code>{" "}
                            — Number of decimal places
                          </div>
                          <div>
                            <code className="bg-[#0a0a0a] px-1 py-0.5 rounded text-blue-400">
                              price
                            </code>{" "}
                            — USD price per token
                          </div>
                          <div>
                            <code className="bg-[#0a0a0a] px-1 py-0.5 rounded text-blue-400">
                              marketValue
                            </code>{" "}
                            — Total USD value of holdings
                          </div>
                          <div>
                            <code className="bg-[#0a0a0a] px-1 py-0.5 rounded text-blue-400">
                              contractAddress
                            </code>{" "}
                            — Token contract address (ERC-20 only)
                          </div>
                        </div>
                      </div>

                      <div className="bg-[#1a1a1a] border border-gray-800 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-mono text-blue-400 text-sm">
                            note
                          </span>
                          <span className="text-xs text-gray-500">
                            string | optional
                          </span>
                        </div>
                        <p className="text-sm text-gray-400">
                          Additional information, such as "Showing only tokens
                          from top 100 by market cap".
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-4">
                      Example Response
                    </h3>
                    <div className="bg-[#0d1117] border border-gray-800 rounded-lg p-4 font-mono text-xs overflow-x-auto">
                      <pre className="text-gray-300">{`{
  "address": "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
  "chain": "ETH",
  "balance": "32120000000000000000",
  "topAssets": [
    {
      "symbol": "ETH",
      "balance": "32120000000000000000",
      "decimals": 18,
      "price": 2450.32,
      "marketValue": 78685.78,
      "contractAddress": null
    },
    {
      "symbol": "USDC",
      "balance": "1500000000",
      "decimals": 6,
      "price": 1.00,
      "marketValue": 1500.00,
      "contractAddress": "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
    }
  ],
  "note": "Showing only tokens from top 100 by market cap on Ethereum"
}`}</pre>
                    </div>
                  </div>
                </div>
              </>
            )}

            {activeSection === "transactions-schema" && (
              <>
                <h1 className="text-4xl font-bold mb-4">
                  Transactions Response Schema
                </h1>
                <p className="text-gray-400 text-lg mb-6">
                  Complete schema for the{" "}
                  <code className="bg-[#1a1a1a] px-2 py-0.5 rounded">
                    /api/transactions
                  </code>{" "}
                  endpoint response.
                </p>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold mb-4">
                      Response Fields
                    </h3>
                    <div className="space-y-3">
                      <div className="bg-[#1a1a1a] border border-gray-800 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-mono text-blue-400 text-sm">
                            address
                          </span>
                          <span className="text-xs text-gray-500">string</span>
                        </div>
                        <p className="text-sm text-gray-400">
                          The queried wallet address.
                        </p>
                      </div>

                      <div className="bg-[#1a1a1a] border border-gray-800 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-mono text-blue-400 text-sm">
                            chain
                          </span>
                          <span className="text-xs text-gray-500">string</span>
                        </div>
                        <p className="text-sm text-gray-400">
                          Detected chain identifier.
                        </p>
                      </div>

                      <div className="bg-[#1a1a1a] border border-gray-800 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-mono text-blue-400 text-sm">
                            transactions
                          </span>
                          <span className="text-xs text-gray-500">array</span>
                        </div>
                        <p className="text-sm text-gray-400 mb-3">
                          Array of up to 20 most recent transactions. Each
                          transaction object contains:
                        </p>
                        <div className="pl-4 space-y-2 text-sm text-gray-400">
                          <div>
                            <code className="bg-[#0a0a0a] px-1 py-0.5 rounded text-blue-400">
                              hash
                            </code>{" "}
                            — Transaction hash or signature
                          </div>
                          <div>
                            <code className="bg-[#0a0a0a] px-1 py-0.5 rounded text-blue-400">
                              from
                            </code>{" "}
                            — Sender address
                          </div>
                          <div>
                            <code className="bg-[#0a0a0a] px-1 py-0.5 rounded text-blue-400">
                              to
                            </code>{" "}
                            — Recipient address
                          </div>
                          <div>
                            <code className="bg-[#0a0a0a] px-1 py-0.5 rounded text-blue-400">
                              value
                            </code>{" "}
                            — Transfer amount in smallest unit as string
                          </div>
                          <div>
                            <code className="bg-[#0a0a0a] px-1 py-0.5 rounded text-blue-400">
                              timestamp
                            </code>{" "}
                            — Unix timestamp in seconds
                          </div>
                          <div>
                            <code className="bg-[#0a0a0a] px-1 py-0.5 rounded text-blue-400">
                              category
                            </code>{" "}
                            — Transaction category (swap, transfer, bridge,
                            etc.)
                          </div>
                          <div>
                            <code className="bg-[#0a0a0a] px-1 py-0.5 rounded text-blue-400">
                              explorerUrl
                            </code>{" "}
                            — Link to block explorer
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-4">
                      Transaction Categories
                    </h3>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      {[
                        "transfer",
                        "swap",
                        "bridge",
                        "lending",
                        "staking",
                        "nft",
                        "airdrop",
                        "polymarket_bet",
                        "mint",
                        "burn",
                        "approval",
                        "contract",
                        "receive",
                        "reverted",
                        "unknown",
                      ].map((cat) => (
                        <div
                          key={cat}
                          className="bg-[#0a0a0a] px-3 py-2 rounded border border-gray-800"
                        >
                          <span className="text-gray-300">{cat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-4">
                      Example Response
                    </h3>
                    <div className="bg-[#0d1117] border border-gray-800 rounded-lg p-4 font-mono text-xs overflow-x-auto">
                      <pre className="text-gray-300">{`{
  "address": "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
  "chain": "ETH",
  "transactions": [
    {
      "hash": "0x3a1df8dda50b4f...",
      "from": "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
      "to": "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984",
      "value": "1000000000000000000",
      "timestamp": 1708704161,
      "category": "swap",
      "explorerUrl": "https://etherscan.io/tx/0x3a1df8..."
    },
    {
      "hash": "0x7b2ef9a51c3d2a...",
      "from": "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
      "to": "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
      "value": "500000000000000000",
      "timestamp": 1708617761,
      "category": "receive",
      "explorerUrl": "https://etherscan.io/tx/0x7b2ef9..."
    }
  ]
}`}</pre>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Right Panel - Interactive Tester (1/3 width) */}
          <div className="lg:col-span-1">
            <div className="bg-[#121212] border border-gray-800 rounded-lg p-6 sticky top-8">
              <h3 className="text-lg font-semibold mb-4">Try it out</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Address <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="0xd8dA6BF..."
                    className="w-full bg-[#0a0a0a] border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Chain
                  </label>
                  <select
                    value={chain}
                    onChange={(e) => setChain(e.target.value)}
                    className="w-full bg-[#0a0a0a] border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                  >
                    {chains.map((c) => (
                      <option key={c} value={c}>
                        {c.charAt(0).toUpperCase() + c.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                {(activeSection === "assets" ||
                  activeSection === "transactions") && (
                  <button
                    onClick={() =>
                      handleQuery(activeSection as "assets" | "transactions")
                    }
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm"
                  >
                    {loading ? "Loading..." : "Execute"}
                  </button>
                )}

                {error && (
                  <div className="bg-red-900/20 border border-red-900 rounded-lg p-3">
                    <p className="text-red-400 text-sm">{error}</p>
                  </div>
                )}

                {response && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-400">
                        Response
                      </span>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(
                            JSON.stringify(response, null, 2),
                          );
                        }}
                        className="text-xs text-blue-400 hover:text-blue-300"
                      >
                        Copy
                      </button>
                    </div>
                    <div className="bg-[#0a0a0a] border border-gray-700 rounded-lg p-3 max-h-[400px] overflow-auto">
                      <pre className="text-xs text-gray-300">
                        {JSON.stringify(response, null, 2)}
                      </pre>
                    </div>
                  </div>
                )}

                {/* Sample Addresses */}
                <div className="pt-4 border-t border-gray-800">
                  <div className="text-xs font-medium text-gray-500 mb-2">
                    SAMPLE ADDRESSES
                  </div>
                  <div className="space-y-2">
                    <button
                      onClick={() =>
                        setAddress("0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045")
                      }
                      className="w-full text-left text-xs bg-[#0a0a0a] hover:bg-[#1a1a1a] border border-gray-800 rounded px-2 py-2 transition-colors"
                    >
                      <div className="font-medium text-white mb-0.5">
                        Vitalik (ETH)
                      </div>
                      <div className="text-gray-500 font-mono truncate">
                        0xd8dA6BF...
                      </div>
                    </button>
                    <button
                      onClick={() =>
                        setAddress("1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa")
                      }
                      className="w-full text-left text-xs bg-[#0a0a0a] hover:bg-[#1a1a1a] border border-gray-800 rounded px-2 py-2 transition-colors"
                    >
                      <div className="font-medium text-white mb-0.5">
                        Genesis (BTC)
                      </div>
                      <div className="text-gray-500 font-mono truncate">
                        1A1zP1eP...
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
