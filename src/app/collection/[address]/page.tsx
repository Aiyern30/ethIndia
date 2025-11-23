"use client";
import CollectionDetailPage from "@/components/CollectionDetails";
import { use } from "react";

export default function CollectionPage({
  params,
}: {
  params: Promise<{ address: string }>;
}) {
  const { address } = use(params);

  return <CollectionDetailPage collectionAddress={address} />;
}
