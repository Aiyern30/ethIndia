import { useAddress, useSigner, useConnectionStatus } from "@thirdweb-dev/react";
import { useMemo } from "react";

export function useWalletReady() {
  const address = useAddress();
  const signer = useSigner();
  const connectionStatus = useConnectionStatus();

  // Derive ready state instead of using useState + useEffect
  const isReady = useMemo(() => {
    return connectionStatus === "connected" || connectionStatus === "disconnected";
  }, [connectionStatus]);

  return {
    address,
    signer,
    isReady,
    isConnected: !!address && connectionStatus === "connected",
    connectionStatus,
  };
}
