"use client";
import { motion } from "framer-motion";
import { ConnectWallet } from "@thirdweb-dev/react";
import { Moon, Sun, Menu, Sparkles } from "lucide-react";
import { useTheme } from "next-themes";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";

interface HeaderProps {
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}

export default function Header({
  mobileMenuOpen,
  setMobileMenuOpen,
}: HeaderProps) {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  return (
    <header className="fixed top-0 w-full z-50 h-[100px] bg-white/80 dark:bg-gray-950/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800">
      <nav className="container mx-auto px-6 h-full flex items-center">
        <div className="flex items-center justify-between w-full">
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

          {/* Mobile Menu Button with Sheet */}
          <div className="md:hidden">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <button>
                  <Menu className="w-7 h-7" />
                </button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="p-0 w-[80vw] max-w-xs [&>button]:top-[37.5px] [&>button]:right-6"
              >
                {/* Header section matching main header height */}
                <div className="h-[100px] border-b border-gray-200 dark:border-gray-800 flex items-center justify-start px-6">
                  <div className="flex items-center space-x-2">
                    <div className="w-10 h-10 bg-linear-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                      <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-2xl font-bold bg-linear-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                      NFTVerse
                    </span>
                  </div>
                </div>

                {/* Navigation content */}
                <div className="flex flex-col p-6 space-y-4">
                  <nav className="flex flex-col gap-4">
                    <a
                      href="#features"
                      className="block py-2 px-4 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Features
                    </a>
                    <a
                      href="#explore"
                      className="block py-2 px-4 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Explore
                    </a>
                    <a
                      href="#stats"
                      className="block py-2 px-4 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Stats
                    </a>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleTheme();
                      }}
                      className="flex items-center gap-2 py-2 px-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                      {theme === "dark" ? (
                        <Sun className="w-5 h-5" />
                      ) : (
                        <Moon className="w-5 h-5" />
                      )}
                      <span>Toggle Theme</span>
                    </button>
                    <div className="mt-4">
                      <ConnectWallet />
                    </div>
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>
    </header>
  );
}
