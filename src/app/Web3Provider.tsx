import { ThirdwebProvider, ConnectWallet } from "@thirdweb-dev/react";

export default function Web3Provider({ children }: { children: React.ReactNode }) {
  return (
    <ThirdwebProvider activeChain="ethereum">
      <ConnectWallet />
      {children}
    </ThirdwebProvider>
  );
}
