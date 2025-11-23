"use client";
import HeroSection from "@/components/landing/HeroSection";
import WhyChooseUs from "@/components/landing/WhyChooseUs";
import TrendingNFT from "@/components/landing/TrendingNFT";
import CTASection from "@/components/landing/CTASection";
import ResponsiveStatsSection from "@/components/landing/ResponsiveStats";

export default function LandingPage() {
  const nftItems = [
    {
      id: 1,
      title: "Cosmic Dreams #1",
      price: "2.5 ETH",
      image:
        "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=400&h=400&fit=crop",
    },
    {
      id: 2,
      title: "Digital Genesis",
      price: "1.8 ETH",
      image:
        "https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?w=400&h=400&fit=crop",
    },
    {
      id: 3,
      title: "Neon Pulse",
      price: "3.2 ETH",
      image:
        "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=400&h=400&fit=crop",
    },
    {
      id: 4,
      title: "Abstract Mind",
      price: "2.1 ETH",
      image:
        "https://images.unsplash.com/photo-1635322966219-b75ed372eb01?w=400&h=400&fit=crop",
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-white transition-colors duration-300">
      {/* <HeroSection nftItems={nftItems} /> */}

      <ResponsiveStatsSection />

      <WhyChooseUs />
      <TrendingNFT nftItems={nftItems} />
      <CTASection />
    </div>
  );
}
