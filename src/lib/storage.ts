// lib/storage.ts
import { ThirdwebStorage } from "@thirdweb-dev/storage";

// Initialize Thirdweb Storage
export const storage = new ThirdwebStorage({
  clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID,
});

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface CollectionMetadata {
  name: string;
  symbol: string;
  description: string;
  profileImage: string; // IPFS URL
  bannerImage: string; // IPFS URL
  tags: string[]; // e.g., ["art", "pfp", "gaming"]
  contractAddress: string;
  totalSupply: number;
  creatorWallet: string;
}

export interface NFTAttribute {
  trait_type: string;
  value: string;
  rarity?: string; // Optional rarity percentage or tier
}

export interface NFTTransaction {
  type: "minted" | "transfer" | "listed" | "sold" | "delisted";
  from?: string;
  to?: string;
  price?: string; // In ETH
  timestamp: number;
  txHash: string;
}

export interface NFTOffer {
  offerAddress: string;
  price: string; // In ETH
  timestamp: number;
}

export interface NFTMetadata {
  name: string;
  description: string;
  image: string; // IPFS URL
  contractAddress: string;
  tokenId: string;
  ownerWallet: string;
  attributes: NFTAttribute[];

  // Listing information (optional)
  currentListingPrice?: string;
  previousPrice?: string;
  offers?: NFTOffer[];

  // Transaction history
  transactions: NFTTransaction[];
}

// ============================================================================
// COLLECTION STORAGE FUNCTIONS
// ============================================================================

/**
 * Upload collection images and metadata to IPFS
 */
export async function uploadCollectionMetadata(data: {
  name: string;
  symbol: string;
  description: string;
  profileImageFile: File;
  bannerImageFile: File;
  tags: string[];
  contractAddress: string;
  totalSupply: number;
  creatorWallet: string;
}): Promise<{ metadataUri: string; metadata: CollectionMetadata }> {
  try {
    // Upload images first
    console.log("Uploading profile image...");
    const profileImageUri = await storage.upload(data.profileImageFile);

    console.log("Uploading banner image...");
    const bannerImageUri = await storage.upload(data.bannerImageFile);

    // Create metadata object
    const metadata: CollectionMetadata = {
      name: data.name,
      symbol: data.symbol,
      description: data.description,
      profileImage: profileImageUri,
      bannerImage: bannerImageUri,
      tags: data.tags,
      contractAddress: data.contractAddress,
      totalSupply: data.totalSupply,
      creatorWallet: data.creatorWallet,
    };

    // Upload metadata JSON
    console.log("Uploading collection metadata...");
    const metadataUri = await storage.upload(metadata);

    return { metadataUri, metadata };
  } catch (error) {
    console.error("Error uploading collection metadata:", error);
    throw error;
  }
}

/**
 * Fetch collection metadata from IPFS
 */
export async function fetchCollectionMetadata(
  metadataUri: string
): Promise<CollectionMetadata> {
  try {
    const response = await fetch(storage.resolveScheme(metadataUri));
    const metadata = await response.json();
    return metadata;
  } catch (error) {
    console.error("Error fetching collection metadata:", error);
    throw error;
  }
}

/**
 * Store collection metadata URI in a public way
 * For now, we'll emit it via an indexer or store in a public DB
 * Alternative: Store in contract if you can redeploy
 */
export function storeCollectionMetadataPublicly(
  contractAddress: string,
  metadataUri: string
) {
  // Store in localStorage as fallback
  localStorage.setItem(`collection_metadata_${contractAddress}`, metadataUri);
  
  // TODO: Also store in a public database or IPFS directory
  // For production, use:
  // - Firebase/Supabase
  // - The Graph protocol
  // - Your own backend API
  
  console.log("Collection metadata stored:", { contractAddress, metadataUri });
}

// ============================================================================
// NFT STORAGE FUNCTIONS
// ============================================================================

/**
 * Upload NFT image and metadata to IPFS
 */
export async function uploadNFTMetadata(data: {
  name: string;
  description: string;
  imageFile: File;
  contractAddress: string;
  tokenId: string;
  ownerWallet: string;
  attributes: NFTAttribute[];
  transactions?: NFTTransaction[];
}): Promise<{ metadataUri: string; metadata: NFTMetadata }> {
  try {
    // Upload image first
    console.log("Uploading NFT image...");
    const imageUri = await storage.upload(data.imageFile);

    // Create metadata object with ERC-721 standard format
    const metadata: NFTMetadata = {
      name: data.name,
      description: data.description,
      image: imageUri,
      contractAddress: data.contractAddress,
      tokenId: data.tokenId,
      ownerWallet: data.ownerWallet,
      attributes: data.attributes,
      transactions: data.transactions || [
        {
          type: "minted",
          to: data.ownerWallet,
          timestamp: Date.now(),
          txHash: "",
        },
      ],
    };

    // Upload metadata JSON
    console.log("Uploading NFT metadata...");
    const metadataUri = await storage.upload(metadata);

    return { metadataUri, metadata };
  } catch (error) {
    console.error("Error uploading NFT metadata:", error);
    throw error;
  }
}

/**
 * Fetch NFT metadata from IPFS
 */
export async function fetchNFTMetadata(tokenUri: string): Promise<NFTMetadata> {
  try {
    const response = await fetch(storage.resolveScheme(tokenUri));
    const metadata = await response.json();
    return metadata;
  } catch (error) {
    console.error("Error fetching NFT metadata:", error);
    throw error;
  }
}

/**
 * Update NFT listing information (creates new metadata version)
 */
export async function updateNFTListing(
  existingMetadata: NFTMetadata,
  listingData: {
    currentListingPrice?: string;
    previousPrice?: string;
    newTransaction?: NFTTransaction;
  }
): Promise<string> {
  try {
    const updatedMetadata: NFTMetadata = {
      ...existingMetadata,
      currentListingPrice: listingData.currentListingPrice,
      previousPrice: listingData.previousPrice,
      transactions: listingData.newTransaction
        ? [...existingMetadata.transactions, listingData.newTransaction]
        : existingMetadata.transactions,
    };

    const metadataUri = await storage.upload(updatedMetadata);
    return metadataUri;
  } catch (error) {
    console.error("Error updating NFT listing:", error);
    throw error;
  }
}

/**
 * Add offer to NFT metadata
 */
export async function addNFTOffer(
  existingMetadata: NFTMetadata,
  offer: NFTOffer
): Promise<string> {
  try {
    const updatedMetadata: NFTMetadata = {
      ...existingMetadata,
      offers: [...(existingMetadata.offers || []), offer],
    };

    const metadataUri = await storage.upload(updatedMetadata);
    return metadataUri;
  } catch (error) {
    console.error("Error adding NFT offer:", error);
    throw error;
  }
}

/**
 * Update NFT owner (after transfer/sale)
 */
export async function updateNFTOwner(
  existingMetadata: NFTMetadata,
  newOwner: string,
  transaction: NFTTransaction
): Promise<string> {
  try {
    const updatedMetadata: NFTMetadata = {
      ...existingMetadata,
      ownerWallet: newOwner,
      previousPrice: existingMetadata.currentListingPrice,
      currentListingPrice: undefined, // Clear listing after sale
      offers: [], // Clear offers after sale
      transactions: [...existingMetadata.transactions, transaction],
    };

    const metadataUri = await storage.upload(updatedMetadata);
    return metadataUri;
  } catch (error) {
    console.error("Error updating NFT owner:", error);
    throw error;
  }
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Convert IPFS URI to HTTP gateway URL
 */
export function resolveIPFS(uri: string): string {
  if (!uri) return "";
  
  // Use Thirdweb's built-in resolver which handles ipfs:// URIs
  return storage.resolveScheme(uri);
}

/**
 * Batch upload multiple NFTs
 */
export async function batchUploadNFTs(
  nftsData: Array<{
    name: string;
    description: string;
    imageFile: File;
    attributes: NFTAttribute[];
  }>,
  contractAddress: string,
  startTokenId: number,
  ownerWallet: string
): Promise<string[]> {
  try {
    console.log(`Batch uploading ${nftsData.length} NFTs...`);

    const metadataUris: string[] = [];

    for (let i = 0; i < nftsData.length; i++) {
      const nft = nftsData[i];
      const tokenId = (startTokenId + i).toString();

      const { metadataUri } = await uploadNFTMetadata({
        ...nft,
        contractAddress,
        tokenId,
        ownerWallet,
      });

      metadataUris.push(metadataUri);
      console.log(`Uploaded NFT ${i + 1}/${nftsData.length}`);
    }

    return metadataUris;
  } catch (error) {
    console.error("Error batch uploading NFTs:", error);
    throw error;
  }
}
