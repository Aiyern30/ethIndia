"use client";
import { ThirdwebProvider } from "@thirdweb-dev/react";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";
import { ThemeProvider } from "next-themes";
import { useState } from "react";

export default function Web3Provider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <ThirdwebProvider activeChain="ethereum">
        <Header
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
        />
        <main>{children}</main>
        <Footer />
      </ThirdwebProvider>
    </ThemeProvider>
  );
}
