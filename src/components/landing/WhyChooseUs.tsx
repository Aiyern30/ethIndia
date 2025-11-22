"use client";
import { motion } from "framer-motion";
import { Shield, Zap, TrendingUp } from "lucide-react";

export default function WhyChooseUs() {
  const features = [
    {
      icon: <Shield />,
      title: "Secure Transactions",
      desc: "Industry-leading security with multi-signature wallets",
    },
    {
      icon: <Zap />,
      title: "Lightning Fast",
      desc: "Instant minting and trading on Layer 2 solutions",
    },
    {
      icon: <TrendingUp />,
      title: "Low Fees",
      desc: "Competitive rates with zero hidden charges",
    },
  ];

  return (
    <section id="features" className="py-20 px-6">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Why Choose NFTVerse
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            The most trusted NFT marketplace
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="p-8 rounded-2xl bg-linear-to-br from-purple-50 to-pink-50 dark:from-gray-800 dark:to-gray-900 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all"
            >
              <div className="w-12 h-12 bg-linear-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center mb-4 text-white">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-gray-600 dark:text-gray-400">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
