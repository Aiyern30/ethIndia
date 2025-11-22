"use client";
import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import Image from "next/image";

interface NFTItem {
  id: number;
  title: string;
  price: string;
  image: string;
}

interface TrendingNFTProps {
  nftItems: NFTItem[];
}

export default function TrendingNFT({ nftItems }: TrendingNFTProps) {
  return (
    <section id="explore" className="py-20 px-6 bg-gray-50 dark:bg-gray-900/50">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex justify-between items-center mb-12"
        >
          <h2 className="text-4xl font-bold">Trending NFTs</h2>
          <button className="flex items-center space-x-2 text-purple-600 dark:text-purple-400 hover:underline">
            <span>View All</span>
            <ExternalLink className="w-4 h-4" />
          </button>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {nftItems.map((nft, i) => (
            <motion.div
              key={nft.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
              className="rounded-2xl overflow-hidden bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:shadow-2xl transition-all cursor-pointer"
            >
              <div className="aspect-square overflow-hidden">
                <Image
                  src={nft.image}
                  alt={nft.title}
                  width={400}
                  height={400}
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div className="p-4">
                <h3 className="font-bold mb-2">{nft.title}</h3>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400 text-sm">
                    Price
                  </span>
                  <span className="font-bold text-purple-600 dark:text-purple-400">
                    {nft.price}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
