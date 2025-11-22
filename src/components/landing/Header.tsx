"use client";
import { motion } from "framer-motion";
import { ConnectWallet } from "@thirdweb-dev/react";
import { Moon, Sun, Menu, X, Sparkles } from "lucide-react";

interface HeaderProps {
  theme: string;
  toggleTheme: () => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}

export default function Header({
  theme,
  toggleTheme,
  mobileMenuOpen,
  setMobileMenuOpen,
}: HeaderProps) {
  return (
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
  );
}
