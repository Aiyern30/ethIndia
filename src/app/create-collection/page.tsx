/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState } from "react";
import { useAddress, useSigner } from "@thirdweb-dev/react";
import { ethers } from "ethers";

// Replace with your deployed CollectionFactory contract address
const COLLECTION_FACTORY_ADDRESS = "0x0C1d41D31c23759b8e9F59ac58289e9AfbAA5835";

// Minimal ABI for createCollection
const COLLECTION_FACTORY_ABI = [
  {
    inputs: [
      { internalType: "string", name: "name", type: "string" },
      { internalType: "string", name: "symbol", type: "string" },
    ],
    name: "createCollection",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "nonpayable",
    type: "function",
  },
];

export default function CreateCollectionPage() {
  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [loading, setLoading] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const signer = useSigner();
  const address = useAddress();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setTxHash(null);

    try {
      if (!signer) throw new Error("Wallet not connected");

      const contract = new ethers.Contract(
        COLLECTION_FACTORY_ADDRESS,
        COLLECTION_FACTORY_ABI,
        signer
      );

      const tx = await contract.createCollection(name, symbol);
      setTxHash(tx.hash);
      await tx.wait();
      setLoading(false);
    } catch (err: any) {
      setError(err.message || "Transaction failed");
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto mt-16 p-8 bg-white dark:bg-gray-900 rounded-xl shadow-lg">
      <h1 className="text-2xl font-bold mb-6 text-center">Create Collection</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block mb-2 font-medium">Collection Name</label>
          <input
            type="text"
            className="w-full px-4 py-2 border rounded-lg bg-gray-50 dark:bg-gray-800"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            disabled={loading}
          />
        </div>
        <div>
          <label className="block mb-2 font-medium">Symbol</label>
          <input
            type="text"
            className="w-full px-4 py-2 border rounded-lg bg-gray-50 dark:bg-gray-800"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}
            required
            disabled={loading}
          />
        </div>
        <button
          type="submit"
          className="w-full py-3 bg-linear-to-r from-purple-600 to-pink-600 text-white font-bold rounded-lg hover:opacity-90 transition disabled:opacity-50"
          disabled={loading || !address}
        >
          {loading ? "Creating..." : "Create Collection"}
        </button>
      </form>
      {txHash && (
        <div className="mt-4 text-green-600 text-center">
          Transaction sent! <br />
          <a
            href={`https://sepolia.etherscan.io/tx/${txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            View on Etherscan
          </a>
        </div>
      )}
      {error && <div className="mt-4 text-red-600 text-center">{error}</div>}
    </div>
  );
}
