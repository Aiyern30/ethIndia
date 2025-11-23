/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useCallback } from "react";
import { useAddress, useSigner } from "@thirdweb-dev/react";
import { ethers } from "ethers";
import {
  Plus,
  ExternalLink,
  Loader2,
  AlertCircle,
  ArrowLeft,
  Trash2,
  Package,
} from "lucide-react";
import Image from "next/image";

// Use this prop to pass the collection address from your route
interface CollectionDetailProps {
  collectionAddress: string;
}

const COLLECTION_ABI = [
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
    inputs: [],
    name: "owner",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "nextTokenId",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "string", name: "tokenURI", type: "string" }],
    name: "mint",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
    name: "burn",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
    name: "tokenURI",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
    name: "ownerOf",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
];

interface NFT {
  tokenId: string;
  tokenURI: string;
  owner: string;
  metadata?: {
    name?: string;
    description?: string;
    image?: string;
  };
}

interface CollectionInfo {
  name: string;
  symbol: string;
  owner: string;
  totalSupply: number;
}

export default function CollectionDetailPage({
  collectionAddress,
}: CollectionDetailProps) {
  const [collectionInfo, setCollectionInfo] = useState<CollectionInfo | null>(
    null
  );
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [loading, setLoading] = useState(true);
  const [showMintModal, setShowMintModal] = useState(false);
  const [tokenURI, setTokenURI] = useState("");
  const [minting, setMinting] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const signer = useSigner();
  const address = useAddress();

  // Fetch collection info and NFTs
  const fetchCollectionData = useCallback(async () => {
    if (!signer) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const contract = new ethers.Contract(
        collectionAddress,
        COLLECTION_ABI,
        signer
      );

      // Get collection info
      const [name, symbol, owner, nextTokenId] = await Promise.all([
        contract.name(),
        contract.symbol(),
        contract.owner(),
        contract.nextTokenId(),
      ]);

      setCollectionInfo({
        name,
        symbol,
        owner,
        totalSupply: nextTokenId.toNumber(),
      });

      // Fetch all NFTs
      const nftPromises = [];
      for (let i = 0; i < nextTokenId.toNumber(); i++) {
        nftPromises.push(
          (async () => {
            try {
              const [uri, nftOwner] = await Promise.all([
                contract.tokenURI(i),
                contract.ownerOf(i),
              ]);

              // Try to fetch metadata from URI
              let metadata = undefined;
              try {
                if (uri.startsWith("http")) {
                  const response = await fetch(uri);
                  metadata = await response.json();
                } else if (uri.startsWith("ipfs://")) {
                  const ipfsUrl = uri.replace(
                    "ipfs://",
                    "https://ipfs.io/ipfs/"
                  );
                  const response = await fetch(ipfsUrl);
                  metadata = await response.json();
                }
              } catch {
                console.log("Could not fetch metadata for token", i);
              }

              return {
                tokenId: i.toString(),
                tokenURI: uri,
                owner: nftOwner,
                metadata,
              };
            } catch {
              // Token might be burned
              return null;
            }
          })()
        );
      }

      const nftResults = await Promise.all(nftPromises);
      setNfts(nftResults.filter((nft) => nft !== null) as NFT[]);
    } catch (err) {
      console.error("Error fetching collection data:", err);
      setError("Failed to load collection data");
    } finally {
      setLoading(false);
    }
  }, [signer, collectionAddress]);

  useEffect(() => {
    fetchCollectionData();
  }, [fetchCollectionData]);

  async function handleMint(e: React.FormEvent) {
    e.preventDefault();
    setMinting(true);
    setError(null);
    setTxHash(null);

    try {
      if (!signer) throw new Error("Wallet not connected");
      if (!collectionInfo) throw new Error("Collection not loaded");

      // Check if user is the owner
      if (collectionInfo.owner.toLowerCase() !== address?.toLowerCase()) {
        throw new Error("Only the collection owner can mint NFTs");
      }

      const contract = new ethers.Contract(
        collectionAddress,
        COLLECTION_ABI,
        signer
      );
      const tx = await contract.mint(tokenURI);
      setTxHash(tx.hash);
      await tx.wait();

      // Refresh NFTs
      await fetchCollectionData();

      // Reset form
      setTokenURI("");
      setShowMintModal(false);
      setTxHash(null);
    } catch (err: any) {
      setError(err.message || "Minting failed");
    } finally {
      setMinting(false);
    }
  }

  async function handleBurn(tokenId: string) {
    if (
      !window.confirm(
        "Are you sure you want to burn this NFT? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      if (!signer) throw new Error("Wallet not connected");

      const contract = new ethers.Contract(
        collectionAddress,
        COLLECTION_ABI,
        signer
      );
      const tx = await contract.burn(tokenId);
      await tx.wait();

      // Refresh NFTs
      await fetchCollectionData();
    } catch (err: any) {
      alert(err.message || "Burn failed");
    }
  }

  const isOwner =
    collectionInfo &&
    address &&
    collectionInfo.owner.toLowerCase() === address.toLowerCase();
  const myNFTs = nfts.filter(
    (nft) => nft.owner.toLowerCase() === address?.toLowerCase()
  );

  if (!address) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <Package className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <h2 className="text-2xl font-bold mb-2">Connect Your Wallet</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Please connect your wallet to view this collection
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => window.history.back()}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Collections
        </button>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-purple-600" />
          </div>
        ) : collectionInfo ? (
          <>
            {/* Collection Header */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 mb-8 border border-gray-200 dark:border-gray-700">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div>
                  <h1 className="text-4xl font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                    {collectionInfo.name}
                  </h1>
                  <p className="text-xl text-gray-600 dark:text-gray-400 mb-4">
                    {collectionInfo.symbol}
                  </p>
                  <div className="flex flex-wrap gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-600 dark:text-gray-400">
                        Total NFTs:
                      </span>
                      <span className="font-bold text-purple-600">
                        {collectionInfo.totalSupply}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-600 dark:text-gray-400">
                        You Own:
                      </span>
                      <span className="font-bold text-pink-600">
                        {myNFTs.length}
                      </span>
                    </div>
                  </div>
                  <a
                    href={`https://sepolia.etherscan.io/address/${collectionAddress}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 mt-4 text-sm text-purple-600 dark:text-purple-400 hover:underline"
                  >
                    <ExternalLink className="w-4 h-4" />
                    View Contract on Etherscan
                  </a>
                </div>

                {isOwner && (
                  <button
                    onClick={() => setShowMintModal(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-linear-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-200 whitespace-nowrap"
                  >
                    <Plus className="w-5 h-5" />
                    Mint New NFT
                  </button>
                )}
              </div>
            </div>

            {/* NFTs Grid */}
            {nfts.length === 0 ? (
              <div className="text-center py-20">
                <Package className="w-20 h-20 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                <h3 className="text-xl font-semibold mb-2 text-gray-700 dark:text-gray-300">
                  No NFTs Yet
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6">
                  {isOwner
                    ? "Mint your first NFT to get started"
                    : "No NFTs have been minted in this collection yet"}
                </p>
                {isOwner && (
                  <button
                    onClick={() => setShowMintModal(true)}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-linear-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-200"
                  >
                    <Plus className="w-5 h-5" />
                    Mint First NFT
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {nfts.map((nft) => (
                  <div
                    key={nft.tokenId}
                    className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 overflow-hidden border border-gray-200 dark:border-gray-700 group"
                  >
                    {/* NFT Image */}
                    <div className="aspect-square bg-linear-to-br from-purple-500 via-pink-500 to-blue-500 relative overflow-hidden">
                      {nft.metadata?.image ? (
                        <Image
                          src={
                            nft.metadata.image.startsWith("ipfs://")
                              ? nft.metadata.image.replace(
                                  "ipfs://",
                                  "https://ipfs.io/ipfs/"
                                )
                              : nft.metadata.image
                          }
                          alt={nft.metadata?.name || `NFT #${nft.tokenId}`}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-300"
                          sizes="(max-width: 768px) 100vw, 33vw"
                          priority={false}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="w-16 h-16 text-white/50" />
                        </div>
                      )}

                      {/* Token ID Badge */}
                      <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full text-white text-sm font-semibold">
                        #{nft.tokenId}
                      </div>

                      {/* Owner Badge */}
                      {nft.owner.toLowerCase() === address?.toLowerCase() && (
                        <div className="absolute top-3 right-3 bg-green-500/90 backdrop-blur-sm px-3 py-1 rounded-full text-white text-xs font-semibold">
                          You Own
                        </div>
                      )}
                    </div>

                    {/* NFT Info */}
                    <div className="p-4">
                      <h3 className="text-lg font-bold mb-1 text-gray-900 dark:text-white truncate">
                        {nft.metadata?.name ||
                          `${collectionInfo.name} #${nft.tokenId}`}
                      </h3>
                      {nft.metadata?.description && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                          {nft.metadata.description}
                        </p>
                      )}

                      <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-3">
                        <span>Owner:</span>
                        <span className="font-mono truncate">
                          {nft.owner.slice(0, 6)}...{nft.owner.slice(-4)}
                        </span>
                      </div>

                      <div className="flex gap-2">
                        <a
                          href={
                            nft.tokenURI.startsWith("ipfs://")
                              ? nft.tokenURI.replace(
                                  "ipfs://",
                                  "https://ipfs.io/ipfs/"
                                )
                              : nft.tokenURI
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 flex items-center justify-center gap-2 py-2 text-sm text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-colors"
                        >
                          <ExternalLink className="w-4 h-4" />
                          Metadata
                        </a>

                        {nft.owner.toLowerCase() === address?.toLowerCase() && (
                          <button
                            onClick={() => handleBurn(nft.tokenId)}
                            className="flex items-center justify-center gap-2 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20">
            <AlertCircle className="w-16 h-16 mx-auto mb-4 text-red-500" />
            <h2 className="text-2xl font-bold mb-2">Collection Not Found</h2>
            <p className="text-gray-600 dark:text-gray-400">
              {error || "Unable to load collection"}
            </p>
          </div>
        )}
      </div>

      {/* Mint Modal */}
      {showMintModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-md w-full p-8 relative">
            <button
              onClick={() => setShowMintModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            >
              ✕
            </button>

            <h2 className="text-2xl font-bold mb-6 bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Mint New NFT
            </h2>

            <div className="space-y-6">
              <div>
                <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300">
                  Token URI / Metadata URL
                </label>
                <textarea
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
                  value={tokenURI}
                  onChange={(e) => setTokenURI(e.target.value)}
                  placeholder="ipfs://... or https://..."
                  rows={4}
                  disabled={minting}
                />
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  Enter the IPFS or HTTP URL pointing to your NFT metadata JSON
                </p>
              </div>

              <button
                onClick={handleMint}
                className="w-full py-3 bg-linear-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl hover:shadow-lg hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                disabled={minting || !tokenURI}
              >
                {minting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Minting...
                  </>
                ) : (
                  <>
                    <Plus className="w-5 h-5" />
                    Mint NFT
                  </>
                )}
              </button>
            </div>

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
