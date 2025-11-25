/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useCallback } from "react";
import { ethers } from "ethers";
import {
  Plus,
  ExternalLink,
  Loader2,
  Package,
  AlertCircle,
  Upload,
  X,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import {
  uploadCollectionMetadata,
  fetchCollectionMetadata,
  CollectionMetadata,
} from "@/lib/storage";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { resolveIPFS } from "@/lib/utils";
import { useWalletReady } from "@/hooks/useWalletReady";

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
  metadata?: CollectionMetadata;
}

// Storage key for collection metadata mapping
const COLLECTION_METADATA_KEY = "collection_metadata_";

function CollectionSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700 animate-pulse">
      {/* Banner Skeleton */}
      <div className="h-32 bg-linear-to-br from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700" />

      {/* Content Skeleton */}
      <div className="p-6 -mt-8 relative">
        {/* Profile Image Skeleton */}
        <div className="w-16 h-16 bg-gray-300 dark:bg-gray-600 rounded-xl shadow-lg mb-4 border-4 border-white dark:border-gray-800" />

        {/* Title Skeleton */}
        <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mb-2" />

        {/* Symbol Skeleton */}
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4" />

        {/* Description Skeleton */}
        <div className="space-y-2 mb-4">
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full" />
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-5/6" />
        </div>

        {/* Tags Skeleton */}
        <div className="flex gap-2 mb-4">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-16" />
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-20" />
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-14" />
        </div>

        {/* Stats Skeleton */}
        <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20" />
          <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-12" />
        </div>

        {/* Button Skeleton */}
        <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg w-full" />
      </div>
    </div>
  );
}

export default function MyCollectionsPage() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Form state
  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [description, setDescription] = useState("");
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(
    null
  );
  const [bannerImageFile, setBannerImageFile] = useState<File | null>(null);
  const [bannerImagePreview, setBannerImagePreview] = useState<string | null>(
    null
  );
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");

  const [creating, setCreating] = useState(false);
  const [uploadProgress, setUploadProgress] = useState("");
  const [txHash, setTxHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { address, signer, isReady, isConnected } = useWalletReady();

  // Handle profile image selection
  const handleProfileImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle banner image selection
  const handleBannerImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setBannerImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setBannerImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Add tag
  const addTag = () => {
    if (newTag && !tags.includes(newTag.toLowerCase())) {
      setTags([...tags, newTag.toLowerCase()]);
      setNewTag("");
    }
  };

  // Remove tag
  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

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

          // Try to fetch metadata from localStorage
          let metadata: CollectionMetadata | undefined;
          try {
            const storedMetadataUri = localStorage.getItem(
              `${COLLECTION_METADATA_KEY}${addr}`
            );
            if (storedMetadataUri) {
              metadata = await fetchCollectionMetadata(storedMetadataUri);
            }
          } catch {
            console.log("No metadata found for collection", addr);
          }

          return {
            address: addr,
            name,
            symbol,
            nftCount: balance.toString(),
            metadata,
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
    if (isReady && isConnected) {
      fetchCollections();
    }
  }, [fetchCollections, isReady, isConnected]);

  async function handleCreateCollection(e: React.FormEvent) {
    e.preventDefault();

    if (!profileImageFile || !bannerImageFile) {
      setError("Please upload both profile and banner images");
      return;
    }

    setCreating(true);
    setError(null);
    setTxHash(null);
    setUploadProgress("Creating collection...");

    try {
      if (!signer) throw new Error("Wallet not connected");
      if (!address) throw new Error("Address not found");

      const contract = new ethers.Contract(
        COLLECTION_FACTORY_ADDRESS,
        COLLECTION_FACTORY_ABI,
        signer
      );

      // Create collection on-chain first
      setUploadProgress("Deploying collection contract...");
      const tx = await contract.createCollection(name, symbol);
      setTxHash(tx.hash);

      const receipt = await tx.wait();
      console.log("Transaction receipt:", receipt);

      // Try multiple methods to get collection address
      let collectionAddress = null;

      // Method 1: Parse events with interface
      try {
        const iface = new ethers.utils.Interface(COLLECTION_FACTORY_ABI);
        for (const log of receipt.logs) {
          try {
            const parsed = iface.parseLog(log);
            if (parsed.name === "CollectionCreated") {
              collectionAddress = parsed.args.collection;
              console.log(
                "Found collection address from event:",
                collectionAddress
              );
              break;
            }
          } catch {
            // Skip logs that don't match our interface
            continue;
          }
        }
      } catch (err) {
        console.log("Method 1 failed:", err);
      }

      // Method 2: Call getUserCollections to get latest
      if (!collectionAddress) {
        console.log("Trying method 2: getUserCollections");
        try {
          const collections = await contract.getUserCollections(address);
          if (collections && collections.length > 0) {
            collectionAddress = collections[collections.length - 1];
            console.log(
              "Found collection address from getUserCollections:",
              collectionAddress
            );
          }
        } catch (err) {
          console.log("Method 2 failed:", err);
        }
      }

      if (!collectionAddress) {
        throw new Error(
          "Failed to get collection address from transaction. Please check Etherscan for the deployed contract."
        );
      }

      // Upload metadata to IPFS
      setUploadProgress("Uploading collection metadata to IPFS...");
      console.log("Uploading metadata for collection:", collectionAddress);

      try {
        const { metadataUri } = await uploadCollectionMetadata({
          name,
          symbol,
          description,
          profileImageFile,
          bannerImageFile,
          tags,
          contractAddress: collectionAddress,
          totalSupply: 0,
          creatorWallet: address,
        });

        console.log("Metadata uploaded successfully:", metadataUri);

        // Store metadata URI in localStorage for future reference
        localStorage.setItem(
          `${COLLECTION_METADATA_KEY}${collectionAddress}`,
          metadataUri
        );

        setUploadProgress("Collection created successfully!");
      } catch (uploadError: any) {
        console.error("Metadata upload error:", uploadError);
        setError(
          `Collection deployed but metadata upload failed: ${uploadError.message}. Collection address: ${collectionAddress}`
        );

        // Still store the collection address even if metadata upload fails
        localStorage.setItem(
          `${COLLECTION_METADATA_KEY}${collectionAddress}`,
          "metadata_upload_failed"
        );
      }

      // Refresh collections
      await fetchCollections();

      // Reset form
      setTimeout(() => {
        setName("");
        setSymbol("");
        setDescription("");
        setProfileImageFile(null);
        setProfileImagePreview(null);
        setBannerImageFile(null);
        setBannerImagePreview(null);
        setTags([]);
        setShowCreateModal(false);
        setTxHash(null);
        setUploadProgress("");
        setError(null);
      }, 3000);
    } catch (err: any) {
      console.error("Creation error:", err);
      setError(err.message || "Transaction failed");
      setUploadProgress("");
    } finally {
      setCreating(false);
    }
  }

  // Show nothing while checking wallet status
  if (!isReady) {
    return (
      <div className="min-h-screen bg-linear-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Skeleton */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <div className="h-10 bg-gray-300 dark:bg-gray-600 rounded w-64 mb-2 animate-pulse" />
              <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-48 animate-pulse" />
            </div>
            <div className="h-12 bg-gray-300 dark:bg-gray-600 rounded-xl w-48 animate-pulse" />
          </div>

          {/* Collections Grid Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <CollectionSkeleton key={index} />
            ))}
          </div>
        </div>
      </div>
    );
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <CollectionSkeleton key={index} />
            ))}
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
              <Link
                key={collection.address}
                href={`/collection/${collection.address}`}
                className="cursor-pointer"
              >
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 overflow-hidden border border-gray-200 dark:border-gray-700 group">
                  {/* Banner Header */}
                  <div className="h-32 relative overflow-hidden">
                    {collection.metadata?.bannerImage ? (
                      <Image
                        src={resolveIPFS(collection.metadata.bannerImage)}
                        alt={collection.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    ) : (
                      <div className="h-full bg-linear-to-br from-purple-500 via-pink-500 to-blue-500">
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6 -mt-8 relative">
                    {/* Profile Image */}
                    <div className="w-16 h-16 bg-white dark:bg-gray-800 rounded-xl shadow-lg flex items-center justify-center mb-4 border-4 border-white dark:border-gray-800 relative overflow-hidden">
                      {collection.metadata?.profileImage ? (
                        <Image
                          src={resolveIPFS(collection.metadata.profileImage)}
                          alt={collection.name}
                          fill
                          className="object-cover"
                          sizes="64px"
                        />
                      ) : (
                        <Package className="w-8 h-8 text-purple-600" />
                      )}
                    </div>

                    <h3 className="text-xl font-bold mb-1 text-gray-900 dark:text-white">
                      {collection.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                      {collection.symbol}
                    </p>

                    {/* Description */}
                    {collection.metadata?.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                        {collection.metadata.description}
                      </p>
                    )}

                    {/* Tags */}
                    {collection.metadata?.tags &&
                      collection.metadata.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-4">
                          {collection.metadata.tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="text-xs px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}

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
                      onClick={(e) => e.stopPropagation()}
                      className="flex items-center justify-center gap-2 w-full py-2 text-sm text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                      View on Etherscan
                    </a>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Enhanced Create Collection Modal */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className="max-w-2xl w-full p-0 flex flex-col max-h-[90vh]">
          {/* Fixed Header */}
          <div className="bg-white dark:bg-gray-900 px-8 pt-8 pb-4 border-b border-gray-100 dark:border-gray-800">
            <DialogHeader>
              <DialogTitle>
                <span className="text-2xl font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Create New Collection
                </span>
              </DialogTitle>
              <DialogDescription>
                {/* Optionally add a description here */}
              </DialogDescription>
            </DialogHeader>
          </div>
          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto px-8 py-6">
            <form
              id="create-collection-form"
              onSubmit={handleCreateCollection}
              className="space-y-6"
            >
              {/* Banner Image */}
              <div>
                <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300">
                  Banner Image * (Recommended: 1500x500px)
                </label>
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-4 text-center hover:border-purple-500 transition-colors">
                  {bannerImagePreview ? (
                    <div className="relative">
                      <Image
                        src={bannerImagePreview}
                        alt="Banner Preview"
                        width={1500}
                        height={500}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setBannerImageFile(null);
                          setBannerImagePreview(null);
                        }}
                        className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
                        disabled={creating}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <label className="cursor-pointer block">
                      <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Upload banner image
                      </p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleBannerImageSelect}
                        className="hidden"
                        disabled={creating}
                        required
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* Profile Image */}
              <div>
                <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300">
                  Profile Image * (Recommended: 350x350px)
                </label>
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-4 text-center hover:border-purple-500 transition-colors">
                  {profileImagePreview ? (
                    <div className="relative inline-block">
                      <Image
                        src={profileImagePreview}
                        alt="Profile Preview"
                        width={96}
                        height={96}
                        className="w-24 h-24 object-cover rounded-full"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setProfileImageFile(null);
                          setProfileImagePreview(null);
                        }}
                        className="absolute top-0 right-0 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                        disabled={creating}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <label className="cursor-pointer block">
                      <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Upload profile image
                      </p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleProfileImageSelect}
                        className="hidden"
                        disabled={creating}
                        required
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300">
                  Collection Name *
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

              {/* Symbol */}
              <div>
                <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300">
                  Symbol *
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

              {/* Description */}
              <div>
                <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300">
                  Description
                </label>
                <textarea
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your collection..."
                  rows={3}
                  disabled={creating}
                />
              </div>

              {/* Tags */}
              <div>
                <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300">
                  Tags / Categories
                </label>

                {tags.length > 0 && (
                  <div className="mb-3 flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-2 px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-sm"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="hover:text-purple-900 dark:hover:text-purple-100"
                          disabled={creating}
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g., art, pfp, gaming"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                    disabled={creating}
                  />
                  <button
                    type="button"
                    onClick={addTag}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
                    disabled={creating || !newTag}
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

              {/* Transaction hash and error display */}
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
          </div>
          {/* Fixed Submit Button */}
          <div className="bg-white dark:bg-gray-900 px-8 pb-8 pt-4 border-t border-gray-100 dark:border-gray-800">
            <button
              type="submit"
              form="create-collection-form"
              className="w-full py-3 bg-linear-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl hover:shadow-lg hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              disabled={
                creating ||
                !address ||
                !name ||
                !symbol ||
                !profileImageFile ||
                !bannerImageFile
              }
              onClick={() => {
                const form = document.getElementById(
                  "create-collection-form"
                ) as HTMLFormElement;
                if (form) {
                  form.requestSubmit();
                }
              }}
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
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
