import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Calico - Multi-Chain Wallet Explorer",
  description: "Query Ethereum, Bitcoin, and Solana wallets with ease",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
