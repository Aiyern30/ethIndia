/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Sparkles, ArrowRight } from "lucide-react";

interface NFTItem {
  id: number;
  title: string;
  price: string;
  image: string;
}

interface HeroSectionProps {
  nftItems: NFTItem[];
}

// Animated background particles
const generateParticles = () => {
  const width = typeof window !== "undefined" ? window.innerWidth : 1000;
  const height = typeof window !== "undefined" ? window.innerHeight : 1000;
  return Array.from({ length: 50 }).map((_, i) => ({
    id: i,
    initialX: Math.random() * width,
    initialY: Math.random() * height,
    targetX: Math.random() * width,
    targetY: Math.random() * height,
    duration: Math.random() * 20 + 10,
  }));
};

const Particles = () => {
  const [particles] = useState(generateParticles);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute w-1 h-1 bg-purple-500/30 rounded-full"
          initial={{
            x: particle.initialX,
            y: particle.initialY,
          }}
          animate={{
            x: particle.targetX,
            y: particle.targetY,
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
};

// Animated grid background
const AnimatedGrid = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
      <div style={{ backgroundSize: "60px 60px" }}>
        <motion.div className="absolute inset-0 bg-[linear-linear(to_right,rgb(147,51,234)_1px,transparent_1px),linear-linear(to_bottom,rgb(147,51,234)_1px,transparent_1px)]" />
      </div>
      <div style={{ backgroundSize: "60px 60px" }}>
        <motion.div
          className="absolute inset-0 bg-[linear-linear(to_right,rgb(219,39,119)_1px,transparent_1px),linear-linear(to_bottom,rgb(219,39,119)_1px,transparent_1px)]"
          animate={{
            backgroundPosition: ["0px 0px", "60px 60px"],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </div>
    </div>
  );
};

// Animated character component
const AnimatedChar = ({ char }: { char: string; index: number }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <span
      style={{
        display: char === " " ? "inline" : "inline-block",
        color: isHovered ? "rgb(219, 39, 119)" : "inherit",
      }}
    >
      <motion.span
        className="inline-block cursor-default"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        animate={{
          scale: isHovered ? 1.3 : 1,
          y: isHovered ? -10 : 0,
          rotateZ: isHovered ? 10 : 0,
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 15,
        }}
      >
        {char === " " ? "\u00A0" : char}
      </motion.span>
    </span>
  );
};

// Animated title with interactive characters
const AnimatedTitle = ({ text }: { text: string }) => {
  return (
    <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 bg-linear-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent leading-tight">
      {text.split("").map((char, index) => (
        <AnimatedChar key={index} char={char} index={index} />
      ))}
    </h1>
  );
};

// 3D floating NFT card - Keep 3D design but in a row
const FloatingNFTCard = ({
  nft,
  index,
}: {
  nft: NFTItem;
  index: number;
  totalCards: number;
}) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-300, 300], [10, -10]), {
    stiffness: 100,
    damping: 30,
  });
  const rotateY = useSpring(useTransform(mouseX, [-300, 300], [-10, 10]), {
    stiffness: 100,
    damping: 30,
  });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const rect = document.body.getBoundingClientRect();
      mouseX.set(e.clientX - rect.width / 2);
      mouseY.set(e.clientY - rect.height / 2);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0, y: 50 }}
      animate={{
        opacity: 1,
        scale: 1,
        y: 0,
      }}
      transition={{
        delay: index * 0.2,
        duration: 1,
        type: "spring",
        stiffness: 100,
      }}
      className="w-full h-64 md:h-80 cursor-pointer"
      style={{
        rotateX,
        rotateY,
      }}
      whileHover={{
        scale: 1.05,
        y: -10,
        transition: { duration: 0.3 },
      }}
    >
      <motion.div
        className="w-full h-full rounded-2xl overflow-hidden shadow-2xl border border-purple-500/50 dark:border-pink-500/50 relative group"
        style={{ transformStyle: "preserve-3d" } as any}
        whileHover={{ boxShadow: "0 0 40px rgba(168, 85, 247, 0.6)" }}
      >
        {/* Glow effect */}
        <div className="absolute inset-0 bg-linear-to-br from-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        <Image
          src={nft.image}
          alt={nft.title}
          fill
          className="object-cover"
          priority={index === 0}
        />

        {/* NFT Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-linear-to-t from-black/80 to-transparent transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <h3 className="text-white font-bold text-sm md:text-base">
            {nft.title}
          </h3>
          <p className="text-purple-300 text-xs md:text-sm">{nft.price}</p>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Glowing orb background
const GlowingOrbs = () => {
  return (
    <>
      <motion.div
        className="absolute top-20 left-20 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          x: [0, 50, 0],
          y: [0, 30, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-20 right-20 w-96 h-96 bg-pink-500/30 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.3, 1],
          x: [0, -50, 0],
          y: [0, -30, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.4, 1],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </>
  );
};

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
    <section className="relative min-h-screen flex flex-col items-center px-6 overflow-hidden pt-20 pb-24">
      {/* Animated Background Elements */}
      <GlowingOrbs />
      <AnimatedGrid />
      <Particles />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-start w-full">
        <motion.div
          initial="initial"
          animate="animate"
          variants={staggerContainer}
          className="text-center max-w-4xl w-full mx-auto flex flex-col items-center justify-center"
        >
          {/* Badge */}
          <motion.div
            variants={fadeInUp}
            className="inline-flex items-center gap-2 mb-6 px-6 py-3 bg-linear-to-r from-purple-500/10 to-pink-500/10 backdrop-blur-sm border border-purple-500/20 rounded-full"
          >
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="text-purple-600 dark:text-purple-400 font-semibold text-sm md:text-base">
              The Future of Digital Assets
            </span>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="w-4 h-4 text-pink-400" />
            </motion.div>
          </motion.div>

          {/* Interactive Animated Title */}
          <motion.div variants={fadeInUp}>
            <AnimatedTitle text="Discover, Collect & Sell Extraordinary NFTs" />
          </motion.div>

          {/* Description */}
          <motion.p
            variants={fadeInUp}
            className="text-lg md:text-xl lg:text-2xl text-gray-600 dark:text-gray-400 mb-10 max-w-3xl mx-auto leading-relaxed"
          >
            The world&apos;s first and largest digital marketplace for crypto
            collectibles and non-fungible tokens.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={fadeInUp}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group relative px-8 py-4 bg-linear-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold overflow-hidden shadow-lg shadow-purple-500/50 transition-all"
            >
              <motion.div
                className="absolute inset-0 bg-linear-to-r from-pink-600 to-purple-600"
                initial={{ x: "100%" }}
                whileHover={{ x: 0 }}
                transition={{ duration: 0.3 }}
              />
              <span className="relative flex items-center gap-2">
                Explore Marketplace
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group px-8 py-4 bg-white/10 dark:bg-gray-800/50 backdrop-blur-sm border-2 border-purple-500/30 rounded-xl font-semibold hover:border-purple-500 hover:bg-purple-500/10 transition-all relative overflow-hidden"
            >
              <span className="relative flex items-center gap-2">
                Create NFT
                <Sparkles className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
              </span>
            </motion.button>
          </motion.div>

          {/* Stats */}
          <motion.div
            variants={fadeInUp}
            className="mt-16 grid grid-cols-3 gap-8 max-w-2xl mx-auto"
          >
            {[
              { value: "2.5M+", label: "NFTs" },
              { value: "500K+", label: "Users" },
              { value: "127K", label: "ETH Volume" },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + i * 0.1 }}
                className="relative group"
              >
                <div className="text-2xl md:text-4xl font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="text-sm md:text-base text-gray-600 dark:text-gray-400 mt-1">
                  {stat.label}
                </div>
                {/* Hover glow effect */}
                <div className="absolute inset-0 bg-linear-to-r from-purple-500/0 to-pink-500/0 group-hover:from-purple-500/10 group-hover:to-pink-500/10 rounded-lg transition-all duration-300 -z-10" />
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* 3D Floating NFT Cards - Responsive Grid */}
        <div className="relative mt-12 w-full max-w-7xl mx-auto z-20 px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {nftItems.map((nft, i) => (
              <FloatingNFTCard
                key={nft.id}
                nft={nft}
                index={i}
                totalCards={nftItems.length}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Spacer to prevent overlap with next section */}
      <div className="h-32 lg:h-0"></div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="w-6 h-10 border-2 border-purple-500/50 rounded-full flex items-start justify-center p-2">
          <motion.div
            className="w-1.5 h-1.5 bg-purple-500 rounded-full"
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </motion.div>
    </section>
  );
}
