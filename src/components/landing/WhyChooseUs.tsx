/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { Shield, Zap, TrendingUp } from "lucide-react";
import { useState, useMemo, useEffect } from "react";

export default function WhyChooseUs() {
  const features = [
    {
      icon: <Shield />,
      title: "Secure Transactions",
      desc: "Industry-leading security with multi-signature wallets",
      color: "from-purple-500 to-purple-700",
      shadowColor: "shadow-purple-500/50",
      glowColor: "group-hover:shadow-purple-500/50",
    },
    {
      icon: <Zap />,
      title: "Lightning Fast",
      desc: "Instant minting and trading on Layer 2 solutions",
      color: "from-pink-500 to-pink-700",
      shadowColor: "shadow-pink-500/50",
      glowColor: "group-hover:shadow-pink-500/50",
    },
    {
      icon: <TrendingUp />,
      title: "Low Fees",
      desc: "Competitive rates with zero hidden charges",
      color: "from-blue-500 to-blue-700",
      shadowColor: "shadow-blue-500/50",
      glowColor: "group-hover:shadow-blue-500/50",
    },
  ];

  return (
    <section id="features" className="py-20 px-6 relative overflow-hidden">
      {/* Animated Background linear Orbs */}
      <motion.div
        className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          x: [0, 100, 0],
          y: [0, 50, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.3, 1],
          x: [0, -100, 0],
          y: [0, -50, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <div className="container mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="inline-block mb-4"
          >
            <span className="px-4 py-2 bg-linear-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-full text-sm font-semibold text-purple-600 dark:text-purple-400">
              ✨ Our Features
            </span>
          </motion.div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-linear-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
            Why Choose NFTVerse
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            The most trusted NFT marketplace
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, i) => (
            <FeatureCard key={i} feature={feature} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FeatureCard({ feature, index }: { feature: any; index: number }) {
  const [isHovered, setIsHovered] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const [floatingParticles] = useState(() =>
    [...Array(5)].map(() => ({
      x: Math.random() * 200 - 100,
      y: Math.random() * 200 - 100,
    }))
  );

  const rotateX = useTransform(mouseY, [-100, 100], [10, -10]);
  const rotateY = useTransform(mouseX, [-100, 100], [-10, 10]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setIsHovered(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        delay: index * 0.2,
        type: "spring",
        stiffness: 100,
        damping: 15,
      }}
      viewport={{ once: true }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
      }}
      className="group relative transform-3d"
    >
      {/* Animated border linear */}
      <motion.div
        className="absolute -inset-0.5 bg-linear-to-r from-purple-600 via-pink-600 to-blue-600 rounded-2xl opacity-0 group-hover:opacity-100 blur transition-all duration-500"
        animate={{
          rotate: isHovered ? 360 : 0,
        }}
        transition={{
          duration: 3,
          ease: "linear",
          repeat: isHovered ? Infinity : 0,
        }}
      />

      {/* Card content */}
      <motion.div
        className="relative p-8 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 overflow-hidden"
        whileHover={{ y: -5 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        {/* Animated linear overlay */}
        <motion.div
          className={`absolute inset-0 bg-linear-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
        />

        {/* Sparkle effects */}
        <motion.div
          className="absolute top-4 right-4 w-2 h-2 bg-purple-500 rounded-full"
          animate={{
            scale: isHovered ? [1, 1.5, 1] : 1,
            opacity: isHovered ? [0.5, 1, 0.5] : 0,
          }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-4 left-4 w-2 h-2 bg-pink-500 rounded-full"
          animate={{
            scale: isHovered ? [1, 1.5, 1] : 1,
            opacity: isHovered ? [0.5, 1, 0.5] : 0,
          }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
        />

        {/* Icon container with 3D effect */}
        <motion.div
          className={`relative w-16 h-16 bg-linear-to-br ${feature.color} rounded-xl flex items-center justify-center mb-6 text-white shadow-lg ${feature.shadowColor} transform-3d `}
          style={{ translateZ: 50 }}
          animate={{
            rotateY: isHovered ? [0, 360] : 0,
          }}
          transition={{ duration: 0.8 }}
        >
          {/* Icon glow effect */}
          <motion.div
            className={`absolute inset-0 bg-linear-to-br ${feature.color} rounded-xl blur-xl opacity-0 group-hover:opacity-70 transition-opacity duration-500`}
          />
          <motion.div
            animate={{
              scale: isHovered ? 1.2 : 1,
            }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
            className="relative z-10"
          >
            {feature.icon}
          </motion.div>
        </motion.div>

        {/* Text content */}
        <motion.h3
          className="text-xl font-bold mb-2 relative z-10"
          animate={{
            x: isHovered ? 5 : 0,
          }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          {feature.title}
        </motion.h3>
        <motion.p
          className="text-gray-600 dark:text-gray-400 relative z-10"
          animate={{
            x: isHovered ? 5 : 0,
          }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 20,
            delay: 0.05,
          }}
        >
          {feature.desc}
        </motion.p>

        {/* Animated corner decorations */}
        <motion.div className="absolute top-0 right-0 w-20 h-20 bg-linear-to-br from-purple-500/20 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <motion.div className="absolute bottom-0 left-0 w-20 h-20 bg-linear-to-tr from-pink-500/20 to-transparent rounded-tr-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Floating particles */}
        {isHovered && (
          <>
            {floatingParticles.map((pos, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-purple-500 rounded-full left-1/2 top-1/2"
                initial={{ x: 0, y: 0, opacity: 1 }}
                animate={{
                  x: pos.x,
                  y: pos.y,
                  opacity: 0,
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              />
            ))}
          </>
        )}
      </motion.div>
    </motion.div>
  );
}
