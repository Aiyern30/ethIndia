"use client";
import { useEffect, useState, useCallback } from "react";
import { ethers } from "ethers";

// Replace with your actual contract address
const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

// Example ABI - replace with your actual Marketplace ABI
const MARKETPLACE_ABI = [
  "function listItem(string memory _name, uint256 _price) public returns (uint256)",
  "function buyItem(uint256 _itemId) public payable",
  "function getItem(uint256 _itemId) public view returns (uint256 id, string memory name, uint256 price, address seller, address owner, bool sold)",
  "function getItemCount() public view returns (uint256)",
  "function transferItem(uint256 _itemId, address _to) public",
  "event ItemListed(uint256 indexed itemId, string name, uint256 price, address seller)",
  "event ItemSold(uint256 indexed itemId, address buyer, uint256 price)",
  "event ItemTransferred(uint256 indexed itemId, address from, address to)",
];

export default function MarketplaceDemo() {
  const [account, setAccount] = useState("");
  const [contract, setContract] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Form states
  const [itemName, setItemName] = useState("");
  const [itemPrice, setItemPrice] = useState("");
  const [transferItemId, setTransferItemId] = useState("");
  const [transferAddress, setTransferAddress] = useState("");

  const loadItems = useCallback(
    async (contractInstance = contract) => {
      if (!contractInstance) return;

      try {
        setLoading(true);
        const itemCount = await contractInstance.getItemCount();
        const itemsData = [];

        for (let i = 1; i <= itemCount.toNumber(); i++) {
          const item = await contractInstance.getItem(i);
          itemsData.push({
            id: item.id.toNumber(),
            name: item.name,
            price: ethers.utils.formatEther(item.price),
            seller: item.seller,
            owner: item.owner,
            sold: item.sold,
          });
        }

        setItems(itemsData);
        setError("");
      } catch (err) {
        console.error("Error loading items:", err);
        setError("Error loading items: " + err.message);
      } finally {
        setLoading(false);
      }
    },
    [contract]
  );

  const initializeContract = useCallback(async () => {
    if (typeof window === "undefined" || !window.ethereum) {
      setError("Please install MetaMask!");
      return;
    }

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      setAccount(accounts[0]);

      const signer = provider.getSigner();
      const marketplaceContract = new ethers.Contract(
        CONTRACT_ADDRESS,
        MARKETPLACE_ABI,
        signer
      );
      setContract(marketplaceContract);

      // Load items
      await loadItems(marketplaceContract);

      // Listen for account changes
      window.ethereum.on("accountsChanged", (accounts) => {
        setAccount(accounts[0] || "");
      });
    } catch (err) {
      console.error("Error initializing:", err);
      setError(err.message);
    }
  }, [loadItems]);

  // Initialize connection
  useEffect(() => {
    initializeContract();
  }, [initializeContract]);

  const listItem = async () => {
    if (!contract || !itemName || !itemPrice) return;

    try {
      setLoading(true);
      const price = ethers.utils.parseEther(itemPrice);
      const tx = await contract.listItem(itemName, price);
      await tx.wait();

      setItemName("");
      setItemPrice("");
      await loadItems();
      setError("");
      alert("Item listed successfully!");
    } catch (err) {
      console.error("Error listing item:", err);
      setError("Error listing item: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const buyItem = async (itemId, price) => {
    if (!contract) return;

    try {
      setLoading(true);
      const tx = await contract.buyItem(itemId, {
        value: ethers.utils.parseEther(price),
      });
      await tx.wait();

      await loadItems();
      setError("");
      alert("Item purchased successfully!");
    } catch (err) {
      console.error("Error buying item:", err);
      setError("Error buying item: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const transferItem = async () => {
    if (!contract || !transferItemId || !transferAddress) return;

    try {
      setLoading(true);
      const tx = await contract.transferItem(
        parseInt(transferItemId),
        transferAddress
      );
      await tx.wait();

      setTransferItemId("");
      setTransferAddress("");
      await loadItems();
      setError("");
      alert("Item transferred successfully!");
    } catch (err) {
      console.error("Error transferring item:", err);
      setError("Error transferring item: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const connectWallet = async () => {
    await initializeContract();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h1 className="text-3xl font-bold mb-4">NFT Marketplace</h1>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Contract Address:</p>
              <p className="font-mono text-xs">{CONTRACT_ADDRESS}</p>
            </div>
            <div>
              {account ? (
                <div>
                  <p className="text-sm text-gray-600">Connected Account:</p>
                  <p className="font-mono text-xs">{account}</p>
                </div>
              ) : (
                <button
                  onClick={connectWallet}
                  className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
                >
                  Connect Wallet
                </button>
              )}
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* List Item Form */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4">List New Item</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Item Name
              </label>
              <input
                type="text"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                className="w-full border rounded-lg px-4 py-2"
                placeholder="Enter item name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Price (ETH)
              </label>
              <input
                type="number"
                step="0.001"
                value={itemPrice}
                onChange={(e) => setItemPrice(e.target.value)}
                className="w-full border rounded-lg px-4 py-2"
                placeholder="0.1"
              />
            </div>
            <button
              onClick={listItem}
              disabled={loading || !account}
              className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 disabled:bg-gray-400"
            >
              {loading ? "Processing..." : "List Item"}
            </button>
          </div>
        </div>

        {/* Transfer Item Form */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4">Transfer Item</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Item ID</label>
              <input
                type="number"
                value={transferItemId}
                onChange={(e) => setTransferItemId(e.target.value)}
                className="w-full border rounded-lg px-4 py-2"
                placeholder="1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Recipient Address
              </label>
              <input
                type="text"
                value={transferAddress}
                onChange={(e) => setTransferAddress(e.target.value)}
                className="w-full border rounded-lg px-4 py-2"
                placeholder="0x..."
              />
            </div>
            <button
              onClick={transferItem}
              disabled={loading || !account}
              className="bg-purple-500 text-white px-6 py-2 rounded-lg hover:bg-purple-600 disabled:bg-gray-400"
            >
              {loading ? "Processing..." : "Transfer Item"}
            </button>
          </div>
        </div>

        {/* Items List */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Marketplace Items</h2>
            <button
              onClick={() => loadItems()}
              disabled={loading}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:bg-gray-400"
            >
              Refresh
            </button>
          </div>

          {loading && items.length === 0 ? (
            <p className="text-center py-8 text-gray-500">Loading items...</p>
          ) : items.length === 0 ? (
            <p className="text-center py-8 text-gray-500">
              No items listed yet
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="border rounded-lg p-4 hover:shadow-lg transition-shadow"
                >
                  <div className="mb-3">
                    <h3 className="text-lg font-bold">{item.name}</h3>
                    <p className="text-2xl font-bold text-blue-600">
                      {item.price} ETH
                    </p>
                  </div>

                  <div className="text-sm text-gray-600 space-y-1 mb-4">
                    <p>Item ID: {item.id}</p>
                    <p>
                      Seller: {item.seller.slice(0, 6)}...
                      {item.seller.slice(-4)}
                    </p>
                    <p>
                      Owner: {item.owner.slice(0, 6)}...{item.owner.slice(-4)}
                    </p>
                    <p>Status: {item.sold ? "Sold" : "Available"}</p>
                  </div>

                  {!item.sold && item.owner !== account && (
                    <button
                      onClick={() => buyItem(item.id, item.price)}
                      disabled={loading || !account}
                      className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:bg-gray-400"
                    >
                      Buy Now
                    </button>
                  )}

                  {item.owner === account && (
                    <div className="bg-green-100 text-green-800 text-sm px-3 py-2 rounded-lg text-center">
                      You own this item
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
