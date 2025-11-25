import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function resolveIPFS(uri: string): string {
  if (!uri) return "";

  // If it's already an HTTP(S) URL, return as-is
  if (uri.startsWith("http://") || uri.startsWith("https://")) {
    return uri;
  }

  // Convert ipfs:// to https://nftstorage.link/ipfs/
  if (uri.startsWith("ipfs://")) {
    const cidAndPath = uri.replace("ipfs://", "");
    return `https://nftstorage.link/ipfs/${cidAndPath}`;
  }

  // If it's just a CID (no protocol), assume it's IPFS
  if (!uri.includes("://")) {
    return `https://nftstorage.link/ipfs/${uri}`;
  }

  return uri;
}
