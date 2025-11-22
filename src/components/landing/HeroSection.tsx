"use client";
import { motion } from "framer-motion";
import Image from "next/image";

interface NFTItem {
  id: number;
  title: string;
  price: string;
  image: string;
}

interface HeroSectionProps {
  nftItems: NFTItem[];
}

export default function HeroSection({ nftItems }: HeroSectionProps) {
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  };

  const staggerContainer = {
    animate: { transition: { staggerChildren: 0.1 } },
  };

  return (
    <section className="pt-32 pb-20 px-6">
      <div className="container mx-auto">
        <motion.div
          initial="initial"
          animate="animate"
          variants={staggerContainer}
          className="text-center max-w-4xl mx-auto"
        >
          <motion.div
            variants={fadeInUp}
            className="inline-block mb-4 px-4 py-2 bg-purple-100 dark:bg-purple-900/30 rounded-full"
          >
            <span className="text-purple-600 dark:text-purple-400 font-semibold">
              🚀 The Future of Digital Assets
            </span>
          </motion.div>

          <motion.h1
            variants={fadeInUp}
            className="text-5xl md:text-7xl font-bold mb-6 bg-linear-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent"
          >
            Discover, Collect & Sell Extraordinary NFTs
          </motion.h1>

          <motion.p
            variants={fadeInUp}
            className="text-xl text-gray-600 dark:text-gray-400 mb-8"
          >
            The world&apos;s first and largest digital marketplace for crypto
            collectibles and non-fungible tokens.
          </motion.p>

          <motion.div
            variants={fadeInUp}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <button className="px-8 py-4 bg-linear-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all">
              Explore Marketplace
            </button>
            <button className="px-8 py-4 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-700 rounded-xl font-semibold hover:border-purple-600 dark:hover:border-purple-400 transition-all">
              Create NFT
            </button>
          </motion.div>
        </motion.div>

        {/* Floating Cards Animation */}
        <div className="relative mt-20 h-96">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 100 }}
              animate={{
                opacity: 1,
                y: 0,
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                delay: i * 0.2,
                rotate: { duration: 5, repeat: Infinity, ease: "easeInOut" },
              }}
              className={`absolute -translate-x-1/2 -translate-y-1/2`}
              style={{}}
            >
              <div
                className="w-64 h-80 rounded-2xl overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-800"
                style={{
                  position: "absolute",
                  left: `${30 + i * 20}%`,
                  top: `${40 + i * 10}%`,
                }}
              >
                <Image
                  src={nftItems[i]?.image}
                  alt=""
                  width={256}
                  height={320}
                  className="w-full h-full object-cover"
                  priority={i === 0}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
