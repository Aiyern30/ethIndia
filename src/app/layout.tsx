"use client";
import "./globals.css";
import { QueryProvider } from "@/components/QueryProvider";
import Web3Provider from "./Web3Provider";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import { useState } from "react";

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
          <QueryProvider>
            <Header
              mobileMenuOpen={mobileMenuOpen}
              setMobileMenuOpen={setMobileMenuOpen}
            />
            <main className="pt-18 sm:pt-[100px]">{children}</main>
            <Footer />
          </QueryProvider>
        </Web3Provider>
      </body>
    </html>
  );
}
