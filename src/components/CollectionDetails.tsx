/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState, useEffect, useCallback } from "react";
import { NFTMetadata } from "@thirdweb-dev/react";
import { ethers } from "ethers";
import {
  Plus,
  ExternalLink,
  Loader2,
  AlertCircle,
  ArrowLeft,
  Trash2,
  Package,
  Upload,
  X,
} from "lucide-react";
import Image from "next/image";
import {
  NFTAttribute,
  fetchNFTMetadata,
  uploadNFTMetadata,
} from "@/lib/storage";
import { resolveIPFS } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
  AlertDialogDescription,
} from "@/components/ui/alert-dialog";
import { useWalletReady } from "@/hooks/useWalletReady";

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
  metadata?: NFTMetadata;
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

  // Mint form state
  const [nftName, setNftName] = useState("");
  const [nftDescription, setNftDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [attributes, setAttributes] = useState<NFTAttribute[]>([]);
  const [newTraitType, setNewTraitType] = useState("");
  const [newTraitValue, setNewTraitValue] = useState("");

  const [minting, setMinting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState("");
  const [txHash, setTxHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [burnDialogOpen, setBurnDialogOpen] = useState(false);
  const [burnTokenId, setBurnTokenId] = useState<string | null>(null);

  const { address, signer, isReady, isConnected } = useWalletReady();

  // Handle image file selection
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Add attribute
  const addAttribute = () => {
    if (newTraitType && newTraitValue) {
      setAttributes([
        ...attributes,
        { trait_type: newTraitType, value: newTraitValue },
      ]);
      setNewTraitType("");
      setNewTraitValue("");
    }
  };

  // Remove attribute
  const removeAttribute = (index: number) => {
    setAttributes(attributes.filter((_, i) => i !== index));
  };

  // Fetch collection data
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

              let metadata = undefined;
              try {
                metadata = await fetchNFTMetadata(uri);
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
    if (isReady && isConnected) {
      fetchCollectionData();
    } else if (isReady && !isConnected) {
      setLoading(false);
    }
  }, [fetchCollectionData, isReady, isConnected]);

  // Handle mint with Thirdweb Storage
  async function handleMint(e: React.FormEvent) {
    e.preventDefault();

    if (!imageFile) {
      setError("Please select an image");
      return;
    }

    setMinting(true);
    setError(null);
    setTxHash(null);
    setUploadProgress("Preparing upload...");

    try {
      if (!signer) throw new Error("Wallet not connected");
      if (!collectionInfo) throw new Error("Collection not loaded");
      if (!address) throw new Error("Address not found");

      // Check if user is the owner
      if (collectionInfo.owner.toLowerCase() !== address.toLowerCase()) {
        throw new Error("Only the collection owner can mint NFTs");
      }

      // Get next token ID
      const contract = new ethers.Contract(
        collectionAddress,
        COLLECTION_ABI,
        signer
      );
      const nextTokenId = await contract.nextTokenId();

      // Upload to IPFS using Thirdweb Storage
      setUploadProgress("Uploading image to IPFS...");

      const { metadataUri } = await uploadNFTMetadata({
        name: nftName || `${collectionInfo.name} #${nextTokenId}`,
        description: nftDescription,
        imageFile: imageFile,
        contractAddress: collectionAddress,
        tokenId: nextTokenId.toString(),
        ownerWallet: address,
        attributes: attributes,
        transactions: [
          {
            type: "minted",
            to: address,
            timestamp: Date.now(),
            txHash: "",
          },
        ],
      });

      setUploadProgress("Metadata uploaded! Minting NFT...");

      // Mint NFT with metadata URI
      const tx = await contract.mint(metadataUri);
      setTxHash(tx.hash);
      setUploadProgress("Transaction sent! Waiting for confirmation...");

      await tx.wait();
      setUploadProgress("NFT minted successfully!");

      // Refresh NFTs
      await fetchCollectionData();

      // Reset form
      setTimeout(() => {
        setNftName("");
        setNftDescription("");
        setImageFile(null);
        setImagePreview(null);
        setAttributes([]);
        setShowMintModal(false);
        setTxHash(null);
        setUploadProgress("");
      }, 2000);
    } catch (err: any) {
      console.error("Minting error:", err);
      setError(err.message || "Minting failed");
      setUploadProgress("");
    } finally {
      setMinting(false);
    }
  }

  // Update handleBurn to not show window.confirm
  async function handleBurn(tokenId: string) {
    try {
      if (!signer) throw new Error("Wallet not connected");

      const contract = new ethers.Contract(
        collectionAddress,
        COLLECTION_ABI,
        signer
      );
      const tx = await contract.burn(tokenId);
      await tx.wait();

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

  // Show nothing while checking wallet status
  if (!isReady) {
    return null;
  }

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
                    <div className="aspect-square bg-linear-to-br from-purple-500 via-pink-500 to-blue-500 relative overflow-hidden">
                      {nft.metadata?.image ? (
                        <Image
                          src={resolveIPFS(nft.metadata.image)}
                          alt={
                            nft.metadata?.name
                              ? String(nft.metadata.name)
                              : `NFT #${nft.tokenId}`
                          }
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

                      <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full text-white text-sm font-semibold">
                        #{nft.tokenId}
                      </div>

                      {nft.owner.toLowerCase() === address?.toLowerCase() && (
                        <div className="absolute top-3 right-3 bg-green-500/90 backdrop-blur-sm px-3 py-1 rounded-full text-white text-xs font-semibold">
                          You Own
                        </div>
                      )}
                    </div>

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

                      {/* Attributes */}
                      {nft.metadata?.attributes &&
                        Array.isArray(nft.metadata.attributes) &&
                        nft.metadata.attributes.length > 0 && (
                          <div className="mb-3 flex flex-wrap gap-1">
                            {nft.metadata.attributes
                              .slice(0, 3)
                              .map((attr: any, i) => (
                                <span
                                  key={i}
                                  className="text-xs px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full"
                                >
                                  {String(attr.trait_type)}:{" "}
                                  {String(attr.value)}
                                </span>
                              ))}
                          </div>
                        )}

                      <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-3">
                        <span>Owner:</span>
                        <span className="font-mono truncate">
                          {nft.owner.slice(0, 6)}...{nft.owner.slice(-4)}
                        </span>
                      </div>

                      <div className="flex gap-2">
                        <a
                          href={nft.tokenURI}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 flex items-center justify-center gap-2 py-2 text-sm text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-colors"
                        >
                          <ExternalLink className="w-4 h-4" />
                          Metadata
                        </a>

                        {nft.owner.toLowerCase() === address?.toLowerCase() && (
                          <>
                            <AlertDialog
                              open={
                                burnDialogOpen && burnTokenId === nft.tokenId
                              }
                              onOpenChange={(open) => {
                                setBurnDialogOpen(open);
                                if (!open) setBurnTokenId(null);
                              }}
                            >
                              <AlertDialogTrigger asChild>
                                <button
                                  className="flex items-center justify-center gap-2 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                  onClick={() => {
                                    setBurnTokenId(nft.tokenId);
                                    setBurnDialogOpen(true);
                                  }}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Burn NFT</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to burn this NFT? This
                                    action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    className="bg-red-600 hover:bg-red-700 text-white"
                                    onClick={async () => {
                                      if (burnTokenId) {
                                        await handleBurn(burnTokenId);
                                        setBurnDialogOpen(false);
                                        setBurnTokenId(null);
                                      }
                                    }}
                                  >
                                    Burn
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </>
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

      {/* Enhanced Mint Modal using Shadcn Dialog */}
      <Dialog open={showMintModal} onOpenChange={setShowMintModal}>
        <DialogContent className="max-w-2xl w-full p-0 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl flex flex-col h-[80vh] relative">
          {/* Sticky Header */}
          <DialogHeader className="sticky top-0 z-10 bg-white dark:bg-gray-900 pt-8 pb-4 px-8">
            <DialogTitle className="text-2xl font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Mint New NFT
            </DialogTitle>
            <DialogClose
              asChild
              disabled={minting}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            >
              <button aria-label="Close">✕</button>
            </DialogClose>
          </DialogHeader>

          {/* Scrollable Content */}
          <form
            onSubmit={handleMint}
            className="flex-1 overflow-y-auto space-y-6 px-8 pb-6"
            style={{ minHeight: 0 }}
            id="mint-nft-form"
          >
            {/* Image Upload */}
            <div>
              <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300">
                NFT Image *
              </label>
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-6 text-center hover:border-purple-500 transition-colors">
                {imagePreview ? (
                  <div className="relative">
                    <Image
                      src={imagePreview}
                      alt="Preview"
                      width={256}
                      height={256}
                      className="max-h-64 mx-auto rounded-lg object-contain"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImageFile(null);
                        setImagePreview(null);
                      }}
                      className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
                      disabled={minting}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label className="cursor-pointer block">
                    <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-600 dark:text-gray-400 mb-2">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">
                      PNG, JPG, GIF up to 10MB
                    </p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageSelect}
                      className="hidden"
                      disabled={minting}
                      required
                    />
                  </label>
                )}
              </div>
            </div>

            {/* Name */}
            <div>
              <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300">
                NFT Name (Optional)
              </label>
              <input
                type="text"
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                value={nftName}
                onChange={(e) => setNftName(e.target.value)}
                placeholder="e.g., Cool NFT #1"
                disabled={minting}
              />
            </div>

            {/* Description */}
            <div>
              <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300">
                Description
              </label>
              <textarea
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
                value={nftDescription}
                onChange={(e) => setNftDescription(e.target.value)}
                placeholder="Describe your NFT..."
                rows={3}
                disabled={minting}
              />
            </div>

            {/* Attributes */}
            <div>
              <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300">
                Attributes / Traits
              </label>

              {/* Existing attributes */}
              {attributes.length > 0 && (
                <div className="mb-3 space-y-2">
                  {attributes.map((attr, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-purple-50 dark:bg-purple-900/20 px-4 py-2 rounded-lg"
                    >
                      <span className="text-sm">
                        <strong>{attr.trait_type}:</strong> {attr.value}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeAttribute(index)}
                        className="text-red-500 hover:text-red-700"
                        disabled={minting}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Add new attribute */}
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  placeholder="Trait type (e.g., Color)"
                  value={newTraitType}
                  onChange={(e) => setNewTraitType(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                  disabled={minting}
                />
                <input
                  type="text"
                  placeholder="Value (e.g., Blue)"
                  value={newTraitValue}
                  onChange={(e) => setNewTraitValue(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                  disabled={minting}
                />
                <button
                  type="button"
                  onClick={addAttribute}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
                  disabled={minting || !newTraitType || !newTraitValue}
                >
                  Add
                </button>
              </div>
            </div>

            {/* Upload Progress */}
            {uploadProgress && (
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
                <p className="text-blue-800 dark:text-blue-200 text-sm">
                  {uploadProgress}
                </p>
              </div>
            )}

            {/* Transaction hash and error messages */}
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
          </form>

          {/* Sticky Footer */}
          <div className="sticky bottom-0 z-10 bg-white dark:bg-gray-900 pb-8 pt-4 px-8">
            <button
              type="submit"
              form="mint-nft-form"
              className="w-full py-3 bg-linear-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl hover:shadow-lg hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              disabled={minting || !imageFile}
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
        </DialogContent>
      </Dialog>
    </div>
  );
}
