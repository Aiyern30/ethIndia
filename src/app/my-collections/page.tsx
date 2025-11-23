/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useCallback } from "react";
import { useAddress, useSigner } from "@thirdweb-dev/react";
import { ethers } from "ethers";
import {
  Plus,
  ExternalLink,
  Loader2,
  Package,
  AlertCircle,
} from "lucide-react";

const COLLECTION_FACTORY_ADDRESS = "0x0C1d41D31c23759b8e9F59ac58289e9AfbAA5835";

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
  {
    inputs: [{ internalType: "address", name: "user", type: "address" }],
    name: "getUserCollections",
    outputs: [{ internalType: "address[]", name: "", type: "address[]" }],
    stateMutability: "view",
    type: "function",
  },
];

// Minimal ERC721 ABI to get collection details
const ERC721_ABI = [
  {
    inputs: [],
    name: "name",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "owner", type: "address" }],
    name: "balanceOf",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
];

interface Collection {
  address: string;
  name: string;
  symbol: string;
  nftCount: string;
}

export default function MyCollectionsPage() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [creating, setCreating] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const signer = useSigner();
  const address = useAddress();

  // Fetch collections
  const fetchCollections = useCallback(async () => {
    if (!signer || !address) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const contract = new ethers.Contract(
        COLLECTION_FACTORY_ADDRESS,
        COLLECTION_FACTORY_ABI,
        signer
      );

      const collectionAddresses = await contract.getUserCollections(address);

      // Fetch details for each collection
      const collectionsData = await Promise.all(
        collectionAddresses.map(async (addr: string) => {
          const collectionContract = new ethers.Contract(
            addr,
            ERC721_ABI,
            signer
          );
          const [name, symbol, balance] = await Promise.all([
            collectionContract.name(),
            collectionContract.symbol(),
            collectionContract.balanceOf(address),
          ]);
          return {
            address: addr,
            name,
            symbol,
            nftCount: balance.toString(),
          };
        })
      );

      setCollections(collectionsData);
    } catch (err) {
      console.error("Error fetching collections:", err);
    } finally {
      setLoading(false);
    }
  }, [signer, address]);

  useEffect(() => {
    fetchCollections();
  }, [fetchCollections]);

  async function handleCreateCollection(e: React.FormEvent) {
    e.preventDefault();
    setCreating(true);
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

      // Refresh collections
      await fetchCollections();

      // Reset form
      setName("");
      setSymbol("");
      setShowCreateModal(false);
      setTxHash(null);
    } catch (err: any) {
      setError(err.message || "Transaction failed");
    } finally {
      setCreating(false);
    }
  }

  if (!address) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <Package className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h2 className="text-2xl font-bold mb-2">Connect Your Wallet</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Please connect your wallet to view your collections
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              My Collections
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Manage and create your NFT collections
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-linear-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-200"
          >
            <Plus className="w-5 h-5" />
            Create Collection
          </button>
        </div>

        {/* Collections Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-purple-600" />
          </div>
        ) : collections.length === 0 ? (
          <div className="text-center py-20">
            <Package className="w-20 h-20 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
            <h3 className="text-xl font-semibold mb-2 text-gray-700 dark:text-gray-300">
              No Collections Yet
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Create your first NFT collection to get started
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-linear-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-200"
            >
              <Plus className="w-5 h-5" />
              Create Your First Collection
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {collections.map((collection) => (
              <div
                key={collection.address}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 overflow-hidden border border-gray-200 dark:border-gray-700 group"
              >
                {/* linear Header */}
                <div className="h-32 bg-linear-to-br from-purple-500 via-pink-500 to-blue-500 relative">
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                </div>

                {/* Content */}
                <div className="p-6 -mt-8 relative">
                  <div className="w-16 h-16 bg-white dark:bg-gray-800 rounded-xl shadow-lg flex items-center justify-center mb-4 border-4 border-white dark:border-gray-800">
                    <Package className="w-8 h-8 text-purple-600" />
                  </div>

                  <h3 className="text-xl font-bold mb-1 text-gray-900 dark:text-white">
                    {collection.name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    {collection.symbol}
                  </p>

                  <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      NFTs Owned
                    </span>
                    <span className="text-lg font-bold text-purple-600">
                      {collection.nftCount}
                    </span>
                  </div>

                  <a
                    href={`https://sepolia.etherscan.io/address/${collection.address}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-2 text-sm text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    View on Etherscan
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Collection Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-md w-full p-8 relative">
            <button
              onClick={() => setShowCreateModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            >
              ✕
            </button>

            <h2 className="text-2xl font-bold mb-6 bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Create New Collection
            </h2>

            <form onSubmit={handleCreateCollection} className="space-y-6">
              <div>
                <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300">
                  Collection Name
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., My Awesome NFTs"
                  required
                  disabled={creating}
                />
              </div>

              <div>
                <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300">
                  Symbol
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  value={symbol}
                  onChange={(e) => setSymbol(e.target.value.toUpperCase())}
                  placeholder="e.g., MNFT"
                  required
                  disabled={creating}
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-linear-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl hover:shadow-lg hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                disabled={creating || !address}
              >
                {creating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Plus className="w-5 h-5" />
                    Create Collection
                  </>
                )}
              </button>
            </form>

            {txHash && (
              <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl">
                <p className="text-green-800 dark:text-green-200 text-sm font-medium mb-2">
                  Transaction sent!
                </p>
                <a
                  href={`https://sepolia.etherscan.io/tx/${txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-green-600 dark:text-green-400 text-sm hover:underline"
                >
                  <ExternalLink className="w-4 h-4" />
                  View on Etherscan
                </a>
              </div>
            )}

            {error && (
              <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
                <p className="text-red-800 dark:text-red-200 text-sm">
                  {error}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
