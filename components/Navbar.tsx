"use client"
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
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
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/60 backdrop-blur-xl border-b border-border/10">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link
            href="/"
            className="flex items-center gap-2 group"
            onClick={(e) => {
              if (pathname === "/") {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: "smooth" });
              }
            }}
          >
            <Image src="/logo-full.png" alt="Buna Logo" width={80} height={80} />
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
            {session ? (
              <Link href="/dashboard" className="flex items-center gap-3 group">
                <div className="text-right hidden lg:block">
                  <p className="text-xs font-display font-bold text-foreground leading-none mb-1">{session.user.name}</p>
                  <p className="text-[10px] font-body text-muted-foreground leading-none">Member</p>
                </div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative w-10 h-10 rounded-full overflow-hidden clay-ring"
                >
                  {session.user.image ? (
                    <img 
                      src={session.user.image} 
                      alt={session.user.name || "User"} 
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-secondary flex items-center justify-center">
                      <span className="text-sm">👤</span>
                    </div>
                  )}
                </motion.div>
              </Link>
            ) : (
              <Link href="/join">
                <motion.button
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="btn-mahber text-sm py-2.5 px-6"
                >
                  Join the Club
                </motion.button>
              </Link>
            )}
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
              {session ? (
                <Link href="/dashboard" onClick={() => setIsOpen(false)}>
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary/50 border border-border/50">
                    <div className="relative w-10 h-10 rounded-full overflow-hidden clay-ring">
                      {session.user.image ? (
                        <img 
                          src={session.user.image} 
                          alt={session.user.name || "User"}  
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-secondary flex items-center justify-center">
                          <span className="text-sm">👤</span>
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-display font-bold text-foreground">{session.user.name}</p>
                      <p className="text-xs font-body text-muted-foreground">Go to Dashboard</p>
                    </div>
                  </div>
                </Link>
              ) : (
                <Link href="/join" onClick={() => setIsOpen(false)}>
                  <button className="btn-mahber w-full text-sm py-3 mt-2">
                    Join the Club
                  </button>
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
