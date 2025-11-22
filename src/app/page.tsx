"use client";
import { motion } from "framer-motion";
import HeroSection from "@/components/landing/HeroSection";
import WhyChooseUs from "@/components/landing/WhyChooseUs";
import TrendingNFT from "@/components/landing/TrendingNFT";
import CTASection from "@/components/landing/CTASection";
import { NumberTicker } from "@/components/ui/number-ticker";

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
      <HeroSection nftItems={nftItems} />

      {/* Stats Section */}
      <section id="stats" className="py-20 px-6 bg-gray-50 dark:bg-gray-900/50">
        <div className="container mx-auto">
          <div className="w-full overflow-x-auto">
            <div
              className="grid gap-8"
              style={{
                gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
              }}
            >
              {[
                { label: "Total Volume", value: 127000, suffix: " ETH" },
                { label: "NFTs Created", value: 2500000, suffix: "+" },
                { label: "Active Users", value: 500000, suffix: "+" },
                { label: "Transactions", value: 10000000, suffix: "+" },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center min-w-40"
                >
                  <div className="text-2xl md:text-4xl font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2 flex justify-center items-center wrap-break-word truncate">
                    <NumberTicker
                      value={stat.value}
                      startValue={0}
                      delay={0.2 + i * 0.2}
                      decimalPlaces={0}
                      className="mr-1"
                    />
                    <span className="whitespace-nowrap">{stat.suffix}</span>
                  </div>
                  <div className="text-gray-600 dark:text-gray-400">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <WhyChooseUs />
      <TrendingNFT nftItems={nftItems} />
      <CTASection />
    </div>
  );
}
