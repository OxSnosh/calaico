"use client";

import WalletExplorer from "@/components/WalletExplorer";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] p-8">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-12">
          <div className="flex justify-between items-center mb-4">
            <div className="flex-1"></div>
            <h1 className="flex-1 text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Multi-Chain Wallet Explorer
            </h1>
            <div className="flex-1 flex justify-end">
              <a
                href="/docs"
                className="px-4 py-2 bg-[#1a1a1a] hover:bg-[#2a2a2a] border border-gray-700 rounded-lg text-sm font-medium text-gray-300 hover:text-white transition-colors"
              >
                📖 API Docs
              </a>
            </div>
          </div>
          <p className="text-gray-400 text-lg">
            Query any wallet - Ethereum, Bitcoin, or Solana
          </p>
        </header>

        <WalletExplorer />

        <footer className="mt-16 text-center text-gray-500 text-sm">
          <p>Built with ❤️ using Next.js and Claude Code</p>
          <div className="mt-4">
            <a href="/docs" className="text-blue-400 hover:text-blue-300 mx-2">
              API Reference
            </a>
          </div>
        </footer>
      </div>
    </main>
  );
}
