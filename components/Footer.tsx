"use client"
import { motion } from "framer-motion";
import { Coffee, Heart } from "lucide-react";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-background border-t border-border/10 text-foreground">
      <div className="container mx-auto px-4 md:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-2 mb-6">
              <img src="/logo-full.png" alt="ቡጠማ Logo" className="h-10 w-auto object-contain" />
            </div>
            <p className="font-body text-sm text-muted-foreground leading-relaxed max-w-sm">
              A fun digital association celebrating Ethiopia&apos;s rich coffee heritage. From the highlands of Sidama to your morning cup — we&apos;re all connected by buna.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <h4 className="font-display font-bold text-xs uppercase tracking-widest mb-6 text-accent">Navigate</h4>
            <div className="flex flex-col gap-4">
              {[
                { to: "/", label: "Home" },
                { to: "/election", label: "Presidential Election" },
                { to: "/quiz", label: "Coffee Quiz" },
                { to: "/community", label: "Community" },
                { to: "/map", label: "Coffee Map" },
              ].map((link) => (
                <Link
                  key={link.to}
                  href={link.to}
                  className="text-sm text-muted-foreground hover:text-accent transition-colors font-body inline-block"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <h4 className="font-display font-bold text-xs uppercase tracking-widest mb-6 text-accent">The Birthplace of Coffee</h4>
            <p className="font-body text-sm text-muted-foreground leading-relaxed items-center">
              Our journey in pursuit of great coffee starts here, in Ethiopia. The birthplace and home of all coffee varieties in the world.
            </p>
            <div className="mt-8 pt-8 border-t border-border/10">
              <p className="text-[10px] tracking-widest uppercase text-muted-foreground/40 font-bold mb-4">Developed by</p>
              <Link href="https://abrahammule.vercel.app" target="_blank" className="font-display text-sm font-bold text-muted-foreground hover:text-foreground transition-colors group">
                PulseLabs <span className="opacity-0 group-hover:opacity-100 transition-opacity ml-1">→</span>
              </Link>
            </div>
          </motion.div>
        </div>

        <div className="mt-20 pt-10 border-t border-border/10 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-[10px] tracking-tighter uppercase text-muted-foreground/30 font-medium">
            © {new Date().getFullYear()} ET Coffee Lovers' Association. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground/40 font-body flex items-center gap-2">
            Made with <Heart className="w-3 h-3 text-accent fill-accent" /> and lots of buna
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
