"use client";
import React, { useState } from "react";
import PrimaryButtom from "../ui/custom-button";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import Image from "next/image";
import { Terminal, Github } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const Navbar = () => {
  const { scrollYProgress } = useScroll();
  const pathname = usePathname();
  const isPricingPage = pathname === "/pricing";
  const [showNavbar, setShowNavbar] = useState(isPricingPage ? true : false);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (!isPricingPage) {
      setShowNavbar(latest > 0);
    }
  });

  const links = [
    { name: "Pricing", href: "/pricing" },
    { name: "Features", href: "/#features" },
    { name: "Demo", href: "/#demo" },
    { name: "How it works", href: "/#HIW" },
    { name: "Stats", href: "/#Stats" },
    { name: "Contact", href: "/#Contact" },
    {name:"FAQ",href:"./#faq"}
  ];

  return (
    <motion.nav
      initial={{ opacity: 0 }}
      animate={showNavbar ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        " z-40  flex items-center justify-between px-4 py-3  bg-neutral-900/5 backdrop-blur-xl  border-white/10",
        isPricingPage
          ? "relative h-max md:w-full top-0 border-b"
          : "fixed rounded-3xl top-4 border w-[94%] md:w-[80%] mx-auto left-1/2 -translate-x-1/2"
      )}
    >
      <div className="text-2xl font-medium tracking-tighter flex items-center gap-2">
        <div className="w-10 aspect-square overflow-hidden relative">
          <Image
            src="/assets/logo.svg"
            alt="background"
            fill
            className="object-cover w-full h-full"
          />
        </div>
        Opensox AI
      </div>
      <div className="hidden md:flex items-center gap-5 tracking-tight text-lg font-light text-[#d1d1d1]">
        {links.map((link, index) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={index}
              href={link.href}
              className={cn(
                "cursor-pointer hover:text-white",
                isActive && "text-white"
              )}
            >
              {link.name}
            </Link>
          );
        })}
      </div>
      <div className="flex items-center gap-3">
        <Link
          href="https://github.com/apsinghdev/opensox"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden lg:flex items-center gap-2 px-4 py-2.5 bg-[#0d1117] hover:bg-[#161b22] transition-colors rounded-lg border border-[#30363d] text-white"
        >
          <Github className="w-5 h-5" />
          <span className="text-sm font-medium">Contribute</span>
        </Link>
        <Link href="/dashboard/home" className="cursor-pointer z-30">
          <PrimaryButtom>
            <Terminal />
            Get Started
          </PrimaryButtom>
        </Link>
      </div>
    </motion.nav>
  );
};

export default Navbar;
