"use client";
import { motion } from "framer-motion";

export default function CTASection() {
  return (
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
  );
}
