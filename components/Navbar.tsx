"use client"
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Coffee, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { authClient } from "@/lib/auth-client";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/election", label: "Election" },
  { to: "/quiz", label: "Quiz" },
  { to: "/community", label: "Community" },
  { to: "/map", label: "Coffee Map" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { data: session } = authClient.useSession();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link href="/" className="flex items-center gap-2 group">
          <Image src="/ethiopian-coffee-cup.jpg" alt="Buna Logo" width={50} height={50} />
            <span className="font-ethiopic font-bold text-lg text-foreground">ቡጠማ</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                href={link.to}
                className={`relative px-4 py-2 rounded-full text-sm font-body font-medium transition-colors ${
                  pathname === link.to
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {pathname === link.to && (
                  <motion.div
                    layoutId="nav-active"
                    className="absolute inset-0 bg-secondary rounded-full"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className="relative z-10">{link.label}</span>
              </Link>
            ))}
          </div>

          <div className="hidden md:block">
            <Link href={session ? "/dashboard" : "/join"}>
              <motion.button
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="btn-mahber text-sm py-2.5 px-6"
              >
                {session ? "Dashboard" : "Join the Club"}
              </motion.button>
            </Link>
          </div>

          {/* Mobile toggle */}
          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden p-2 text-foreground">
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-background border-b border-border overflow-hidden"
          >
            <div className="container mx-auto px-4 py-4 flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  href={link.to}
                  onClick={() => setIsOpen(false)}
                  className={`px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                    pathname === link.to
                      ? "bg-secondary text-foreground"
                      : "text-muted-foreground"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <Link href={session ? "/dashboard" : "/join"} onClick={() => setIsOpen(false)}>
                <button className="btn-mahber w-full text-sm py-3 mt-2">
                  {session ? "Dashboard" : "Join the Club"}
                </button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
