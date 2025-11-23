"use client";
import { motion } from "framer-motion";
import { NumberTicker } from "../ui/number-ticker";

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
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              viewport={{ once: true }}
              className="text-center p-4 sm:p-6 rounded-xl bg-white dark:bg-gray-800/50 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-center"
            >
              {/* Fixed height container to align all numbers on same baseline */}
              <div className="min-h-[60px] sm:min-h-[70px] flex items-center justify-center mb-2">
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent flex items-baseline justify-center whitespace-nowrap">
                  <NumberTicker
                    value={stat.value}
                    startValue={0}
                    delay={0.2 + i * 0.2}
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
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
