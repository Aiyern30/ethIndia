/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { ThirdwebProvider } from "@thirdweb-dev/react";
import { Sepolia } from "@thirdweb-dev/chains";
import { ThemeProvider } from "next-themes";

export default function Web3Provider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <ThirdwebProvider
        activeChain={Sepolia}
        clientId={process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID}
        supportedChains={[Sepolia]}
        autoConnect={true}
        dAppMeta={{
          name: "NFT Platform",
          description: "Create and manage NFT collections",
          url: typeof window !== "undefined" ? window.location.origin : "",
        }}
      >
        {children as any}
      </ThirdwebProvider>
    </ThemeProvider>
  );
}
