"use client";
import CollectionDetailPage from "@/components/CollectionDetails";

export default function CollectionPage({
  params,
}: {
  params: { address: string };
}) {
  return <CollectionDetailPage collectionAddress={params.address} />;
}
