"use client";
import "./globals.css";
import Web3Provider from "./Web3Provider";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import { useState } from "react";
import { Toaster } from "sonner";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <Web3Provider>
          <Header
            mobileMenuOpen={mobileMenuOpen}
            setMobileMenuOpen={setMobileMenuOpen}
          />
          <main className="pt-18 sm:pt-[100px]">{children}</main>
          <Footer />
          <Toaster richColors position="top-right" />
        </Web3Provider>
      </body>
    </html>
  );
}
