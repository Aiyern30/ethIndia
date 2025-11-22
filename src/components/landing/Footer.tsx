"use client";
import { Sparkles, Twitter, MessageCircle, Github } from "lucide-react";

export default function Footer() {
  return (
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
  );
}
