/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { motion } from "framer-motion";
import { NumberTicker } from "../ui/number-ticker";
import { useState } from "react";

export default function ResponsiveStatsSection() {
  const stats = [
    { label: "Total Volume", value: 127000, suffix: " ETH" },
    { label: "NFTs Created", value: 2500000, suffix: "+" },
    { label: "Active Users", value: 500000, suffix: "+" },
    { label: "Transactions", value: 10000000, suffix: "+" },
  ];

  return (
    <section
      id="stats"
      className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 bg-gray-50 dark:bg-gray-900/50"
    >
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 md:gap-10">
          {stats.map((stat, i) => (
            <StatCard key={i} stat={stat} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function StatCard({ stat, index }: { stat: any; index: number }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      viewport={{ once: true }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative"
    >
      {/* Animated border linear - OUTSIDE the card */}
      <motion.div
        className="absolute -inset-0.5 bg-linear-to-r from-purple-600 via-pink-600 to-blue-600 rounded-xl opacity-0 group-hover:opacity-100 blur transition-all duration-500"
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
        className="relative text-center p-4 sm:p-6 rounded-xl bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden"
        whileHover={{ y: -5 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        {/* linear overlay on hover */}
        <motion.div className="absolute inset-0 bg-linear-to-br from-purple-600 via-pink-600 to-blue-600 opacity-0 group-hover:opacity-10 transition-opacity duration-500" />

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

        {/* Content above backgrounds */}
        <div className="relative z-10 flex flex-col justify-center">
          {/* Fixed height container to align all numbers on same baseline */}
          <div className="min-h-[60px] sm:min-h-[70px] flex items-center justify-center mb-2">
            <div className="text-2xl sm:text-3xl md:text-4xl font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent flex items-baseline justify-center whitespace-nowrap">
              <NumberTicker
                value={stat.value}
                startValue={0}
                delay={0.2 + index * 0.2}
                decimalPlaces={0}
                className="tabular-nums"
              />
              <span className="text-xl sm:text-2xl md:text-3xl ml-1">
                {stat.suffix}
              </span>
            </div>
          </div>
          <div className="text-xs sm:text-sm md:text-base text-gray-600 dark:text-gray-400 font-medium min-h-5">
            {stat.label}
          </div>
        </div>

        {/* Animated corner decorations */}
        <motion.div className="absolute top-0 right-0 w-20 h-20 bg-linear-to-br from-purple-500/20 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <motion.div className="absolute bottom-0 left-0 w-20 h-20 bg-linear-to-tr from-pink-500/20 to-transparent rounded-tr-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </motion.div>
    </motion.div>
  );
}
