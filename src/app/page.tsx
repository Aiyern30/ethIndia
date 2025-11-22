/* eslint-disable react/no-unescaped-entities */
"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ConnectWallet } from "@thirdweb-dev/react";
import {
  Moon,
  Sun,
  Menu,
  X,
  Sparkles,
  TrendingUp,
  Shield,
  Zap,
  ExternalLink,
  Twitter,
  Github,
  MessageCircle,
} from "lucide-react";
import Image from "next/image";

export default function LandingPage() {
  const [theme, setTheme] = useState("dark");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  };

  const staggerContainer = {
    animate: { transition: { staggerChildren: 0.1 } },
  };

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
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800">
        <nav className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-2"
            >
              <div className="w-10 h-10 bg-linear-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                NFTVerse
              </span>
            </motion.div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <a
                href="#features"
                className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
              >
                Features
              </a>
              <a
                href="#explore"
                className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
              >
                Explore
              </a>
              <a
                href="#stats"
                className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
              >
                Stats
              </a>
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                {theme === "dark" ? (
                  <Sun className="w-5 h-5" />
                ) : (
                  <Moon className="w-5 h-5" />
                )}
              </button>
              <ConnectWallet />
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="md:hidden mt-4 pb-4 space-y-4"
            >
              <a
                href="#features"
                className="block hover:text-purple-600 dark:hover:text-purple-400"
              >
                Features
              </a>
              <a
                href="#explore"
                className="block hover:text-purple-600 dark:hover:text-purple-400"
              >
                Explore
              </a>
              <a
                href="#stats"
                className="block hover:text-purple-600 dark:hover:text-purple-400"
              >
                Stats
              </a>
              <button
                onClick={toggleTheme}
                className="flex items-center space-x-2"
              >
                {theme === "dark" ? (
                  <Sun className="w-5 h-5" />
                ) : (
                  <Moon className="w-5 h-5" />
                )}
                <span>Toggle Theme</span>
              </button>
              <ConnectWallet />
            </motion.div>
          )}
        </nav>
      </header>

      {/* Hero Section */}
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
              The world's first and largest digital marketplace for crypto
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

      {/* Stats Section */}
      <section id="stats" className="py-20 px-6 bg-gray-50 dark:bg-gray-900/50">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: "Total Volume", value: "127K ETH" },
              { label: "NFTs Created", value: "2.5M+" },
              { label: "Active Users", value: "500K+" },
              { label: "Transactions", value: "10M+" },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="text-4xl font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600 dark:text-gray-400">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
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
            {[
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
            ].map((feature, i) => (
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
                <p className="text-gray-600 dark:text-gray-400">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* NFT Showcase */}
      <section
        id="explore"
        className="py-20 px-6 bg-gray-50 dark:bg-gray-900/50"
      >
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

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-3xl bg-linear-to-r from-purple-600 to-pink-600 p-12 text-center text-white"
          >
            <h2 className="text-4xl font-bold mb-4">
              Start Your NFT Journey Today
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of creators and collectors
            </p>
            <button className="px-8 py-4 bg-white text-purple-600 rounded-xl font-semibold hover:shadow-xl transition-all">
              Get Started Now
            </button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 py-12 px-6">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-linear-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">NFTVerse</span>
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                The premier marketplace for digital collectibles
              </p>
            </div>

            <div>
              <h3 className="font-bold mb-4">Marketplace</h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                <li>
                  <a
                    href="#"
                    className="hover:text-purple-600 dark:hover:text-purple-400"
                  >
                    Explore
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-purple-600 dark:hover:text-purple-400"
                  >
                    Create
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-purple-600 dark:hover:text-purple-400"
                  >
                    Collections
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold mb-4">Resources</h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                <li>
                  <a
                    href="#"
                    className="hover:text-purple-600 dark:hover:text-purple-400"
                  >
                    Help Center
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-purple-600 dark:hover:text-purple-400"
                  >
                    Blog
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-purple-600 dark:hover:text-purple-400"
                  >
                    Documentation
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold mb-4">Community</h3>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="w-10 h-10 bg-gray-200 dark:bg-gray-800 rounded-lg flex items-center justify-center hover:bg-purple-600 hover:text-white transition-all"
                >
                  <Twitter className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-gray-200 dark:bg-gray-800 rounded-lg flex items-center justify-center hover:bg-purple-600 hover:text-white transition-all"
                >
                  <MessageCircle className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-gray-200 dark:bg-gray-800 rounded-lg flex items-center justify-center hover:bg-purple-600 hover:text-white transition-all"
                >
                  <Github className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 dark:border-gray-800 pt-8 text-center text-gray-600 dark:text-gray-400">
            <p>© 2024 NFTVerse. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
