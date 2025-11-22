import { useEffect, useState } from "react";
import { ethers } from "ethers";
import MarketplaceAbi from "../../artifacts/contracts/Marketplace.sol/Marketplace.json";

const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

export default function MarketplaceDemo() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (window.ethereum) {
      const ethProvider = new ethers.providers.Web3Provider(window.ethereum);
      setProvider(ethProvider);
      ethProvider.send("eth_requestAccounts", []).then(() => {
        const ethSigner = ethProvider.getSigner();
        setSigner(ethSigner);
        const marketplace = new ethers.Contract(
          CONTRACT_ADDRESS,
          MarketplaceAbi.abi,
          ethSigner
        );
        setContract(marketplace);
        // Example: fetch items if contract has a function
        // marketplace.getItems().then(setItems);
      });
    }
  }, []);

  // Example UI
  return (
    <div>
      <h2>Marketplace Contract Connected</h2>
      <p>Contract: {CONTRACT_ADDRESS}</p>
      {/* Add UI for listing, buying, transferring items here */}
    </div>
  );
}
